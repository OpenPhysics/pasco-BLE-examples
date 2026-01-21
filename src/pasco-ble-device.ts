/**
 * PASCO BLE Device
 *
 * Main class for connecting to and communicating with PASCO BLE sensors.
 */

import { type BLEAdapterBase, type BLEClientBase, createPascoUuid } from './ble/ble-adapter.js';
import { createBLEAdapter } from './ble/index.js';
import { getInterface, getSensor } from './datasheets.js';
import type { BLECharacteristic, BLEDevice } from './types/ble.js';
import { COMPATIBLE_DEVICES } from './types/device.js';
import type { Measurement, SensorChannel } from './types/index.js';
import { binaryFraction, decode64, twosComplement } from './utils/binary.js';
import { evaluateEquation } from './utils/equation-parser.js';
import {
  calc4Params,
  calcLinearParams,
  calcRotaryPos,
  limit,
  threeInputVector,
} from './utils/math.js';

/**
 * Error classes for PASCO BLE operations
 */
export class BLEScanFailed extends Error {
  constructor(message = 'Error occurred when trying to scan for a BLE sensor') {
    super(message);
    this.name = 'BLEScanFailed';
  }
}

export class BLEConnectionError extends Error {
  constructor(message = 'Could not connect to the sensor') {
    super(message);
    this.name = 'BLEConnectionError';
  }
}

export class BLEAlreadyConnectedError extends Error {
  constructor(message = 'Device already connected') {
    super(message);
    this.name = 'BLEAlreadyConnectedError';
  }
}

export class DeviceNotConnected extends Error {
  constructor(message = 'No device connected') {
    super(message);
    this.name = 'DeviceNotConnected';
  }
}

export class MeasurementNotFound extends Error {
  constructor(message = 'Requested measurement does not belong to this device') {
    super(message);
    this.name = 'MeasurementNotFound';
  }
}

export class InvalidParameter extends Error {
  constructor(message = 'An invalid parameter was passed in') {
    super(message);
    this.name = 'InvalidParameter';
  }
}

export class SensorNotFound extends Error {
  constructor(message = 'The device does not have this sensor') {
    super(message);
    this.name = 'SensorNotFound';
  }
}

export class InvalidEquation extends Error {
  constructor(message = 'Could not calculate the measurement') {
    super(message);
    this.name = 'InvalidEquation';
  }
}

export class CouldNotDecodeData extends Error {
  constructor(message = 'Could not decode the raw data from the sensor') {
    super(message);
    this.name = 'CouldNotDecodeData';
  }
}

export class CommunicationError extends Error {
  constructor(message = 'Error sending or receiving data from the sensor') {
    super(message);
    this.name = 'CommunicationError';
  }
}

export class SensorSetupError extends Error {
  constructor(message = 'Error setting the sensor parameters up') {
    super(message);
    this.name = 'SensorSetupError';
  }
}

/**
 * PASCO BLE Device class
 *
 * Provides functionality for connecting to and reading data from PASCO BLE sensors.
 */
export class PASCOBLEDevice {
  // BLE Service and Characteristic IDs
  protected static readonly SENSOR_SERVICE_ID = 0;
  protected static readonly SEND_CMD_CHAR_ID = 2;
  protected static readonly RECV_CMD_CHAR_ID = 3;
  protected static readonly SEND_ACK_CHAR_ID = 5;

  // Command constants
  protected static readonly GCMD_CUSTOM_CMD = 0x37;
  protected static readonly GCMD_READ_ONE_SAMPLE = 0x05;
  protected static readonly GCMD_XFER_BURST_RAM = 0x0e;
  protected static readonly CNTRLNODE_PLUGINS_CALLBACK = 0x82;
  protected static readonly CTRLNODE_CMD_DETECT_DEVICES = 8;
  protected static readonly GCMD_CONTROL_NODE_CMD = 0x37;
  protected static readonly GRSP_RESULT = 0xc0;
  protected static readonly GEVT_SENSOR_ID = 0x82;
  protected static readonly WIRELESS_RMS_START = [0x37, 0x01, 0x00];

  // BLE adapter and client
  protected _adapter: BLEAdapterBase;
  protected _client: BLEClientBase | null = null;

  // Device info
  protected _address: string | null = null;
  protected _name: string | null = null;
  protected _serialId: string | null = null;
  protected _interfaceId: number | null = null;
  protected _devType: string | null = null;
  protected _airlinkSensorId: number | null = null;
  protected _type = 'BLE';

  // Communication state
  protected _callbackResolve: ((value: boolean) => void) | null = null;
  protected _callbackReject: ((reason: Error) => void) | null = null;
  protected _dataAckCounter: Map<number, number> = new Map();

  // Sensor and measurement data
  protected _sensorNames: Map<string, SensorChannel> = new Map();
  protected _deviceMeasurements: Map<number, Map<number, Measurement>> = new Map();
  protected _handleService: Map<number, number> = new Map();
  protected _dataStack: Map<number, number[]> = new Map();
  protected _dataPacket: number[] = [];
  protected _responseData: Uint8Array = new Uint8Array();
  protected _sensorData: Map<number, Map<number, number | null>> = new Map();
  protected _sensorDataPrev: Map<number, Map<number, number | null>> = new Map();
  protected _dataResults: Map<string, number | null> = new Map();
  protected _measurementSensorIds: Map<string, number> = new Map();
  protected _deviceChannels: SensorChannel[] = [];
  protected _notifySensorId: number | null = null;

  // Compatible devices list
  protected _compatibleDevices: readonly string[] = COMPATIBLE_DEVICES;

  constructor(adapter?: BLEAdapterBase) {
    this._adapter = adapter ?? createBLEAdapter();
  }

  // Properties
  get name(): string | null {
    return this._name;
  }

  get serialId(): string | null {
    return this._serialId;
  }

  get client(): BLEClientBase | null {
    return this._client;
  }

  get address(): string | null {
    return this._address;
  }

  get dataResults(): Map<string, number | null> {
    return this._dataResults;
  }

  get deviceSensors(): Map<string, SensorChannel> {
    return this._sensorNames;
  }

  // ==================== Connecting ====================

  /**
   * Scan for PASCO BLE devices
   * @param sensorNameFilter Optional sensor name to filter for
   * @returns Array of found BLE devices
   */
  async scan(sensorNameFilter?: string): Promise<BLEDevice[]> {
    try {
      const filters = sensorNameFilter ? [sensorNameFilter] : [...this._compatibleDevices];
      return await this._adapter.scan(filters);
    } catch {
      throw new BLEScanFailed();
    }
  }

  /**
   * Connect to a BLE device
   * @param bleDevice The device to connect to (from scan results)
   */
  async connect(bleDevice: BLEDevice): Promise<void> {
    if (!bleDevice) {
      throw new InvalidParameter();
    }

    if (this._client !== null) {
      throw new BLEAlreadyConnectedError();
    }

    this._client = this._adapter.createClient(bleDevice);

    try {
      await this._client.connect();
    } catch {
      this._client = null;
      throw new BLEConnectionError();
    }

    this._setDeviceParams(bleDevice);
    this._setHandleService();

    // Start notifications on all notifiable characteristics
    await this._startNotifications();

    // Special handling for Rotary Motion sensor
    if (this._devType === 'Rotary Motion') {
      await this.writeAwaitCallback(
        PASCOBLEDevice.SENSOR_SERVICE_ID,
        PASCOBLEDevice.WIRELESS_RMS_START,
      );
    }

    await this.initializeDevice();
  }

  /**
   * Connect to a device using its 6-digit ID
   * @param pascoDeviceId The device's 6-digit ID (with dash)
   */
  async connectById(pascoDeviceId: string): Promise<void> {
    if (!pascoDeviceId) {
      throw new InvalidParameter();
    }

    if (this._client !== null) {
      throw new BLEAlreadyConnectedError();
    }

    try {
      const foundDevices = await this.scan(pascoDeviceId);
      if (foundDevices.length > 0 && foundDevices[0]) {
        await this.connect(foundDevices[0]);
      } else {
        throw new BLEConnectionError();
      }
    } catch {
      throw new BLEConnectionError();
    }
  }

  /**
   * Check if the device is connected
   */
  isConnected(): boolean {
    return this._client?.isConnected ?? false;
  }

  /**
   * Disconnect from the device
   */
  async disconnect(): Promise<void> {
    if (this._client) {
      await this._client.disconnect();
    }
    this._client = null;
  }

  // ==================== Initializing ====================

  protected _setHandleService(): void {
    if (!this._client) return;

    for (const service of this._client.services) {
      for (const char of service.characteristics) {
        const match = char.uuid.match(/4a5c000(\d)/);
        if (match?.[1]) {
          this._handleService.set(char.handle, parseInt(match[1], 10));
        }
      }
    }
  }

  protected _setUuid(serviceId: number, characteristicId: number): string {
    return createPascoUuid(serviceId, characteristicId);
  }

  protected async _startNotifications(): Promise<void> {
    if (!this._client) return;

    for (const service of this._client.services) {
      for (const char of service.characteristics) {
        if (char.properties.includes('notify')) {
          await this._client.startNotify(char.uuid, this._notifyCallback.bind(this));
        }
      }
    }
  }

  /**
   * Detect devices attached to control node
   */
  async scanControlnodePlugins(): Promise<void> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    const cmd = [PASCOBLEDevice.CTRLNODE_CMD_DETECT_DEVICES];
    await this.writeAwaitCallback(PASCOBLEDevice.SENSOR_SERVICE_ID, cmd);
  }

  /**
   * Initialize device by parsing datasheet
   */
  protected async initializeDevice(): Promise<void> {
    try {
      const iface = getInterface(this._interfaceId ?? 0);
      if (!iface) {
        throw new SensorSetupError(`Interface ${this._interfaceId} not found`);
      }

      this._deviceChannels = iface.channels.map((c) => ({
        id: c.ID,
        name: c.NameTag ?? '',
        sensor_id: c.SensorID ?? 0,
        type: c.Type ?? 'Pasport',
        output_type: c.OutputType ?? '',
        measurements: [],
        total_data_size: 0,
        plug_detect: c.PlugDetect ?? 0,
        channel_id_tag: c.ChannelIDTag ?? '',
        factory_cal_ids: [],
      }));

      // Check for pluggable sensors
      if (this._deviceChannels.some((ch) => ch.plug_detect === 1)) {
        await this.scanControlnodePlugins();
      } else {
        this._initializeDeviceSensors();
      }
    } catch {
      throw new SensorSetupError();
    }
  }

  protected _initializeDeviceSensors(pluginSensorIds?: number[]): void {
    try {
      // Update sensor IDs for plugin sensors
      if (pluginSensorIds) {
        let i = 0;
        for (const channel of this._deviceChannels) {
          if (channel.plug_detect === 1) {
            channel.sensor_id = pluginSensorIds[i] ?? 0;
            i++;
          }
        }
      }

      // Initialize each sensor channel
      for (const channel of this._deviceChannels) {
        if (channel.type === 'Pasport' && channel.sensor_id !== 0) {
          this._initializeSensor(channel);
        }
      }

      // Build lookup tables
      this._measurementSensorIds.clear();
      this._dataResults.clear();

      for (const channel of this._deviceChannels) {
        for (const measurement of channel.measurements) {
          this._measurementSensorIds.set(measurement, channel.id);
          this._dataResults.set(measurement, null);
        }
      }

      this._sensorNames.clear();
      for (const sensor of this._deviceChannels) {
        this._sensorNames.set(sensor.name, sensor);
      }
    } catch {
      throw new SensorSetupError();
    }
  }

  protected _initializeSensor(sensorChannel: SensorChannel): void {
    // Initialize channel state
    this._dataAckCounter.set(sensorChannel.id, 0);
    this._dataStack.set(sensorChannel.id, []);
    this._deviceMeasurements.set(sensorChannel.id, new Map());

    // Get sensor data from datasheets
    const sensorData = getSensor(sensorChannel.sensor_id);
    if (!sensorData) {
      return;
    }

    sensorChannel.name = sensorData.tag;

    // Get non-internal measurements
    const measurements: string[] = [];
    const factoryCalIds: string[] = [];

    for (const [mId, m] of sensorData.measurements) {
      // Store measurement in device measurements
      const measurementCopy = { ...m };
      this._deviceMeasurements.get(sensorChannel.id)?.set(mId, measurementCopy);

      // Add to visible measurements list
      if (!m.Internal && m.Type !== 'Derivative' && m.Visible) {
        measurements.push(m.NameTag);
      }

      // Track factory calibration IDs
      if (m.Type === 'FactoryCal') {
        factoryCalIds.push(m.ID.toString());
      }

      // Calculate total data size
      if (m.DataSize) {
        sensorChannel.total_data_size += m.DataSize;
      }
    }

    sensorChannel.measurements = measurements;
    sensorChannel.factory_cal_ids = factoryCalIds;

    // Initialize sensor data values
    const sensorDataMap = new Map<number, number | null>();
    for (const [mId, m] of sensorData.measurements) {
      const initialValue = m.Type === 'RotaryPos' ? 0 : null;
      sensorDataMap.set(mId, initialValue);
    }
    this._sensorData.set(sensorChannel.id, sensorDataMap);
  }

  // ==================== Public API ====================

  /**
   * Get list of sensors on this device
   */
  getSensorList(): string[] {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }
    return Array.from(this._sensorNames.keys());
  }

  /**
   * Get list of measurements available from a sensor
   * @param sensorName Optional sensor name to filter by
   */
  getMeasurementList(sensorName?: string): string[] {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    if (sensorName !== undefined && typeof sensorName !== 'string') {
      throw new InvalidParameter();
    }

    if (!sensorName) {
      const measurementList: string[] = [];
      for (const sensor of this._deviceChannels) {
        measurementList.push(...sensor.measurements);
      }
      return measurementList;
    }

    const sensor = this._sensorNames.get(sensorName);
    if (!sensor) {
      throw new SensorNotFound();
    }

    return sensor.measurements;
  }

  /**
   * Get the unit type for a measurement
   * @param measurement The measurement name
   */
  getMeasurementUnit(measurement: string): string | null {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    if (!measurement || typeof measurement !== 'string') {
      throw new InvalidParameter();
    }

    const sensorId = this._measurementSensorIds.get(measurement);
    if (sensorId === undefined) {
      throw new InvalidParameter();
    }

    const measurements = this._deviceMeasurements.get(sensorId);
    if (measurements) {
      for (const [_, m] of measurements) {
        if (m.NameTag === measurement) {
          return m.UnitType ?? null;
        }
      }
    }

    return null;
  }

  /**
   * Get units for multiple measurements
   * @param measurements Array of measurement names
   */
  getMeasurementUnitList(measurements: string[]): Record<string, string | null> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    if (!measurements || !Array.isArray(measurements)) {
      throw new InvalidParameter();
    }

    const result: Record<string, string | null> = {};
    for (const measurement of measurements) {
      result[measurement] = this.getMeasurementUnit(measurement);
    }
    return result;
  }

  /**
   * Read a single measurement
   * @param measurement The measurement name to read
   */
  async readData(measurement: string): Promise<number | null> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    if (!measurement || typeof measurement !== 'string') {
      throw new InvalidParameter();
    }

    const sensorId = this._measurementSensorIds.get(measurement);
    if (sensorId === undefined) {
      throw new MeasurementNotFound();
    }

    await this._getSensorMeasurements(sensorId);
    return this._dataResults.get(measurement) ?? null;
  }

  /**
   * Read multiple measurements
   * @param measurements Array of measurement names to read
   */
  async readDataList(measurements: string[]): Promise<Record<string, number | null>> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    if (!measurements || !Array.isArray(measurements)) {
      throw new InvalidParameter();
    }

    for (const m of measurements) {
      if (typeof m !== 'string') {
        throw new InvalidParameter();
      }
    }

    // Get unique sensor IDs
    const sensorIds = new Set<number>();
    for (const m of measurements) {
      const sensorId = this._measurementSensorIds.get(m);
      if (sensorId === undefined) {
        throw new MeasurementNotFound();
      }
      sensorIds.add(sensorId);
    }

    // Request data from each sensor
    for (const sensorId of sensorIds) {
      await this._getSensorMeasurements(sensorId);
    }

    // Build result
    const result: Record<string, number | null> = {};
    for (const measurement of measurements) {
      result[measurement] = this._dataResults.get(measurement) ?? null;
    }
    return result;
  }

  // ==================== Communication ====================

  protected async _sendAck(serviceId: number, command: number[]): Promise<void> {
    const uuid = this._setUuid(serviceId, PASCOBLEDevice.SEND_ACK_CHAR_ID);
    try {
      await this._client?.writeGattChar(uuid, new Uint8Array(command));
    } catch {
      throw new CommunicationError();
    }
  }

  protected async write(serviceId: number, command: number[]): Promise<void> {
    const uuid = this._setUuid(serviceId, PASCOBLEDevice.SEND_CMD_CHAR_ID);
    try {
      await this._client?.writeGattChar(uuid, new Uint8Array(command));
    } catch {
      throw new CommunicationError();
    }
  }

  protected _setDeviceParams(bleDevice: BLEDevice): void {
    this._address = bleDevice.address;
    const nameParts = (bleDevice.name ?? '').split(' ');
    if (nameParts.length >= 2) {
      this._devType = nameParts.slice(0, -1).join(' ');
      const lastPart = nameParts[nameParts.length - 1] ?? '';
      this._serialId = lastPart.substring(0, 7);
      this._name = `${this._devType} ${this._serialId}`;
      // Interface ID character is at index 8 (after 7-char serial + separator)
      if (lastPart.length > 8) {
        this._interfaceId = decode64(lastPart[8]!) + 1024;
      }
    }
  }

  protected async _notifyCallback(char: BLECharacteristic, data: Uint8Array): Promise<void> {
    // Check for valid callback data
    if (data[0] === 0xc0 || data[0] === 0x82) {
      // Signal callback received
      if (this._callbackResolve) {
        this._callbackResolve(true);
        this._callbackResolve = null;
      }
    }

    // Get service ID from handle map, or use handle directly (Web Bluetooth sets handle to service ID)
    let serviceId = this._handleService.get(char.handle);
    if (serviceId === undefined && char.handle > 0) {
      // Web Bluetooth: handle contains the service ID directly
      serviceId = char.handle;
    }
    console.log(
      `_notifyCallback: char.handle=${char.handle}, serviceId=${serviceId}, data[0]=0x${data[0]?.toString(16)}`,
    );

    if (serviceId !== undefined && serviceId > 0) {
      // Sensor measurement response
      const sensorId = serviceId - 1;
      console.log(`Routing to _processMeasurementResponse for sensorId=${sensorId}`);
      this._processMeasurementResponse(sensorId, Array.from(data));
    } else {
      // Device response
      console.log('Routing to _processDeviceResponse');
      this._processDeviceResponse(Array.from(data));
    }
  }

  protected _processMeasurementResponse(sensorId: number, data: number[]): void {
    if (data[0] !== undefined && data[0] <= 0x1f) {
      // Periodic data
      const stack = this._dataStack.get(sensorId) ?? [];
      stack.push(...data.slice(1));
      this._dataStack.set(sensorId, stack);

      const counter = (this._dataAckCounter.get(sensorId) ?? 0) + 1;
      this._dataAckCounter.set(sensorId, counter);

      this._decodeData(sensorId);

      // Send acknowledgement
      if (counter > 8) {
        this._dataAckCounter.set(sensorId, 0);
        const serviceId = sensorId + 1;
        this._sendAck(serviceId, [data[0]!]).catch(() => {});
      }
    } else if (data[0] === PASCOBLEDevice.CNTRLNODE_PLUGINS_CALLBACK) {
      this._updateControlnodePluginSensor(data);
    } else if (data[0] === PASCOBLEDevice.GRSP_RESULT) {
      if (data[1] === 0x00) {
        if (data[2] === PASCOBLEDevice.GCMD_READ_ONE_SAMPLE) {
          this._dataPacket = data.slice(3);
        }
      }
    }
  }

  protected _processDeviceResponse(data: number[]): void {
    this._responseData = new Uint8Array(data);
    console.log(
      `_processDeviceResponse called, data[0]=0x${data[0]?.toString(16)}, data[1]=0x${data[1]?.toString(16)}, data[2]=0x${data[2]?.toString(16)}, _notifySensorId=${this._notifySensorId}`,
    );

    if (data[0] === PASCOBLEDevice.GRSP_RESULT) {
      if (data[1] === 0x00) {
        if (data[2] === PASCOBLEDevice.GCMD_READ_ONE_SAMPLE) {
          // Sensor data response - route to the sensor we requested from
          this._dataPacket = data.slice(3);
          // Store in per-sensor data stack using tracked sensor ID
          if (this._notifySensorId !== null) {
            console.log(
              `Routing response to sensor ${this._notifySensorId}, data:`,
              this._dataPacket,
            );
            this._dataStack.set(this._notifySensorId, [...this._dataPacket]);
          }
        } else if (data[2] === PASCOBLEDevice.GCMD_CONTROL_NODE_CMD) {
          this._dataPacket = data.slice(3);
        }
      }
    }
  }

  protected _updateControlnodePluginSensor(data: number[]): void {
    // Unpack sensor IDs (little-endian 16-bit integers)
    const sensorIds: number[] = [];
    for (let i = 1; i < data.length - 1; i += 2) {
      const low = data[i] ?? 0;
      const high = data[i + 1] ?? 0;
      sensorIds.push(low | (high << 8));
    }
    this._initializeDeviceSensors(sensorIds);
  }

  protected async writeAwaitCallback(serviceId: number, command: number[]): Promise<void> {
    return new Promise((resolve, reject) => {
      this._callbackResolve = () => resolve();
      this._callbackReject = reject;

      // Set timeout
      const timeout = setTimeout(() => {
        this._callbackResolve = null;
        this._callbackReject = null;
        reject(new CommunicationError('Callback timeout'));
      }, 5000);

      // Write command
      this.write(serviceId, command)
        .then(() => {
          // Wait for callback
        })
        .catch((err) => {
          clearTimeout(timeout);
          this._callbackResolve = null;
          this._callbackReject = null;
          reject(err);
        });

      // Clear timeout when callback resolves
      const originalResolve = this._callbackResolve;
      this._callbackResolve = () => {
        clearTimeout(timeout);
        originalResolve?.(true);
      };
    });
  }

  // ==================== Reading Data ====================

  protected async _requestSensorData(sensorId: number): Promise<void> {
    const serviceId = sensorId + 1;

    let packetSize = 0;
    for (const sensor of this._deviceChannels) {
      if (sensor.id === sensorId) {
        packetSize = sensor.total_data_size;
        break;
      }
    }

    // Track which sensor we're requesting data from (for routing responses on service 0)
    this._notifySensorId = sensorId;

    const cmd = [PASCOBLEDevice.GCMD_READ_ONE_SAMPLE, packetSize];
    await this.writeAwaitCallback(serviceId, cmd);
  }

  protected async _getSensorMeasurements(sensorId: number): Promise<void> {
    await this._requestSensorData(sensorId);
    // Data stack was already populated by _processDeviceResponse using _notifySensorId
    const sensorData = this._dataStack.get(sensorId) ?? [];
    console.log(`Sensor ${sensorId} data from stack:`, sensorData);
    this._decodeData(sensorId);
  }

  // ==================== Data Processing ====================

  protected _decodeData(sensorId: number): void {
    try {
      // Save previous data
      const prevData = new Map(this._sensorData.get(sensorId));
      this._sensorDataPrev.set(sensorId, prevData);

      const stack = this._dataStack.get(sensorId) ?? [];
      const measurements = this._deviceMeasurements.get(sensorId);
      if (!measurements) return;

      // Decode raw measurements
      for (const [mId, m] of measurements) {
        let resultValue: number | null = null;

        if (m.Type === 'RawDigital' && m.DataSize) {
          let byteValue = 0;
          for (let d = 0; d < m.DataSize && stack.length > 0; d++) {
            const stackValue = stack.shift() ?? 0;
            byteValue += stackValue * 2 ** (8 * d);
          }
          resultValue = byteValue;

          if (m.DataSize === 4 || (m.TwosComp && parseInt(m.TwosComp, 10) === 1)) {
            resultValue = twosComplement(resultValue, m.DataSize);
          }
        } else if (m.Type === 'Direct' && m.DataSize) {
          let byteValue = 0;
          for (let d = 0; d < m.DataSize && stack.length > 0; d++) {
            const stackValue = stack.shift() ?? 0;
            byteValue += stackValue * 2 ** (8 * d);
          }

          if (m.DataSize === 4) {
            byteValue = twosComplement(byteValue, m.DataSize);
            resultValue = binaryFraction(byteValue);
          } else {
            resultValue = byteValue;
          }

          if (m.Precision !== undefined) {
            resultValue = Math.round(resultValue * 10 ** m.Precision) / 10 ** m.Precision;
          }
        } else if (m.Type === 'Constant') {
          resultValue =
            typeof m.Value === 'number' ? m.Value : parseFloat(m.Value?.toString() ?? '0');

          if (m.Precision !== undefined) {
            resultValue = Math.round(resultValue * 10 ** m.Precision) / 10 ** m.Precision;
          }
        }

        this._sensorData.get(sensorId)?.set(mId, resultValue);
      }

      // Calculate derived measurements
      for (const [mId, m] of measurements) {
        const currentValue = this._sensorData.get(sensorId)?.get(mId);
        if (currentValue === null) {
          let resultValue = this._getMeasurementValue(sensorId, mId);

          if (m.Precision !== undefined && resultValue !== null) {
            resultValue = Math.round(resultValue * 10 ** m.Precision) / 10 ** m.Precision;
          }

          if (m.Limits && resultValue !== null) {
            const limits = m.Limits.split(',').map((l) => parseInt(l, 10));
            if (limits.length === 2 && limits[0] !== undefined && limits[1] !== undefined) {
              resultValue = limit(resultValue, limits[0], limits[1]);
            }
          }

          this._sensorData.get(sensorId)?.set(mId, resultValue);
        }
      }

      // Update visible results
      for (const [sid, meas] of this._deviceMeasurements) {
        for (const [mId, m] of meas) {
          if (m.Visible === 1) {
            const value = this._sensorData.get(sid)?.get(mId);
            if (value !== undefined && value !== null) {
              this._dataResults.set(m.NameTag, value);
            }
          }
        }
      }
    } catch {
      throw new CouldNotDecodeData();
    }
  }

  protected _getMeasurementValue(sensorId: number, measurementId: number): number | null {
    const m = this._deviceMeasurements.get(sensorId)?.get(measurementId);
    if (!m) return null;

    let resultValue: number | null = null;

    if (m.Inputs !== undefined) {
      resultValue = this._calculateWithInput(m, sensorId);
    }

    if (m.Equation) {
      resultValue = this._calculateWithEquation(m, sensorId);
    }

    return resultValue;
  }

  protected _calculateWithInput(m: Measurement, sensorId: number): number | null {
    const inputStr = m.Inputs?.toString() ?? '';

    if (m.Type === 'ThreeInputVector') {
      const inputs = inputStr.split(',').map((i) => parseInt(i, 10));
      if (inputs.length === 3) {
        const ax = this._sensorData.get(sensorId)?.get(inputs[0]!);
        const ay = this._sensorData.get(sensorId)?.get(inputs[1]!);
        const az = this._sensorData.get(sensorId)?.get(inputs[2]!);

        if (
          ax !== null &&
          ax !== undefined &&
          ay !== null &&
          ay !== undefined &&
          az !== null &&
          az !== undefined
        ) {
          return threeInputVector(ax, ay, az);
        }
      }
      return null;
    }

    if (m.Type === 'Select') {
      const inputs = inputStr.split(',').map((i) => parseInt(i, 10));
      const needInput = inputs[0];
      if (needInput !== undefined) {
        const value = this._sensorData.get(sensorId)?.get(needInput);
        if (value !== null && value !== undefined) {
          return value;
        }
        return this._getMeasurementValue(sensorId, needInput);
      }
      return null;
    }

    // Single input
    const needInput = parseInt(inputStr, 10);
    let inputValue: number | null = null;

    const storedValue = this._sensorData.get(sensorId)?.get(needInput);
    if (storedValue !== null && storedValue !== undefined) {
      inputValue = storedValue;
    } else {
      inputValue = this._getMeasurementValue(sensorId, needInput);
    }

    if (inputValue === null) return null;

    const paramsStr = m.Params ?? '';
    const params = paramsStr.split(',').map((p) => parseFloat(p));

    switch (m.Type) {
      case 'UserCal':
      case 'FactoryCal':
        if (params.length >= 4) {
          return calc4Params(inputValue, params[0]!, params[1]!, params[2]!, params[3]!);
        }
        break;

      case 'LinearConv':
        if (params.length >= 2) {
          return calcLinearParams(inputValue, params[0]!, params[1]!);
        }
        break;

      case 'Derivative': {
        const prevValue = this._sensorDataPrev.get(sensorId)?.get(needInput);
        if (prevValue !== null && prevValue !== undefined) {
          return (inputValue - prevValue) / 2;
        }
        break;
      }

      case 'RotaryPos':
        if (params.length >= 2) {
          const currentVal = typeof m.Value === 'number' ? m.Value : 0;
          const newVal = currentVal + calcRotaryPos(inputValue, params[0]!, params[1]!);
          m.Value = newVal;
          return newVal;
        }
        break;
    }

    return null;
  }

  protected _calculateWithEquation(m: Measurement, sensorId: number): number | null {
    const rawEquation = m.Equation ?? '';

    // Build variables object
    const variables: Record<string, number | null> = {};
    const varMatches = rawEquation.match(/\[([0-9_]+)\]/g) || [];

    for (const match of varMatches) {
      const varKey = match.slice(1, -1);
      const varId = parseInt(varKey, 10);

      let value = this._sensorData.get(sensorId)?.get(varId);
      if (value === null || value === undefined) {
        value = this._getMeasurementValue(sensorId, varId);
      }

      variables[varKey] = value ?? null;
    }

    try {
      return evaluateEquation(rawEquation, variables);
    } catch {
      throw new InvalidEquation();
    }
  }
}
