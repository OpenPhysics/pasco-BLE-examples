/**
 * PASCO BLE Device
 *
 * Main class for connecting to and communicating with PASCO BLE sensors.
 * This is the refactored version that delegates to specialized modules.
 */

import type { BLEAdapterBase, BLEClientBase } from '../ble/ble-adapter.js';
import { createBLEAdapter } from '../ble/index.js';
import {
  BLEAlreadyConnectedError,
  BLEConnectionError,
  BLEScanFailed,
  DeviceNotConnected,
  InvalidParameter,
  MeasurementNotFound,
  SensorNotFound,
} from '../errors.js';
import type { BLEDevice } from '../types/ble.js';
import { COMPATIBLE_DEVICES } from '../types/device.js';
import type { Measurement, SensorChannel } from '../types/index.js';
import { decode64 } from '../utils/binary.js';
import { type DecoderState, MeasurementDecoder } from './measurement-decoder.js';
import { PROTOCOL, ProtocolHandler } from './protocol-handler.js';
import { type InitializerState, SensorInitializer } from './sensor-initializer.js';

/**
 * PASCO BLE Device class
 *
 * Provides functionality for connecting to and reading data from PASCO BLE sensors.
 */
export class PASCOBLEDevice {
  // Static constants for backward compatibility with subclasses
  protected static readonly SENSOR_SERVICE_ID = PROTOCOL.SENSOR_SERVICE_ID;
  protected static readonly SEND_CMD_CHAR_ID = PROTOCOL.SEND_CMD_CHAR_ID;
  protected static readonly RECV_CMD_CHAR_ID = PROTOCOL.RECV_CMD_CHAR_ID;
  protected static readonly SEND_ACK_CHAR_ID = PROTOCOL.SEND_ACK_CHAR_ID;
  protected static readonly GCMD_CUSTOM_CMD = PROTOCOL.GCMD_CUSTOM_CMD;
  protected static readonly GCMD_READ_ONE_SAMPLE = PROTOCOL.GCMD_READ_ONE_SAMPLE;
  protected static readonly GCMD_XFER_BURST_RAM = PROTOCOL.GCMD_XFER_BURST_RAM;
  protected static readonly GCMD_CONTROL_NODE_CMD = PROTOCOL.GCMD_CONTROL_NODE_CMD;
  protected static readonly GRSP_RESULT = PROTOCOL.GRSP_RESULT;
  protected static readonly GEVT_SENSOR_ID = PROTOCOL.GEVT_SENSOR_ID;
  protected static readonly CNTRLNODE_PLUGINS_CALLBACK = PROTOCOL.CNTRLNODE_PLUGINS_CALLBACK;
  protected static readonly CTRLNODE_CMD_DETECT_DEVICES = PROTOCOL.CTRLNODE_CMD_DETECT_DEVICES;
  protected static readonly WIRELESS_RMS_START = PROTOCOL.WIRELESS_RMS_START;

  // BLE adapter and client
  protected _adapter: BLEAdapterBase;
  protected _client: BLEClientBase | null = null;
  protected _protocol: ProtocolHandler;

  // Device info
  protected _address: string | null = null;
  protected _name: string | null = null;
  protected _serialId: string | null = null;
  protected _interfaceId: number | null = null;
  protected _devType: string | null = null;
  protected _airlinkSensorId: number | null = null;
  protected _type = 'BLE';

  // State maps (shared with decoder/initializer)
  protected _sensorNames: Map<string, SensorChannel> = new Map();
  protected _deviceMeasurements: Map<number, Map<number, Measurement>> = new Map();
  protected _dataStack: Map<number, number[]> = new Map();
  protected _sensorData: Map<number, Map<number, number | null>> = new Map();
  protected _sensorDataPrev: Map<number, Map<number, number | null>> = new Map();
  protected _dataResults: Map<string, number | null> = new Map();
  protected _measurementSensorIds: Map<string, number> = new Map();
  protected _deviceChannels: SensorChannel[] = [];
  protected _dataAckCounter: Map<number, number> = new Map();
  protected _notifySensorId: number | null = null;
  protected _dataPacket: number[] = [];
  protected _responseData: Uint8Array = new Uint8Array();

  // Compatible devices list
  protected _compatibleDevices: readonly string[] = COMPATIBLE_DEVICES;

  // Specialized handlers
  protected _decoder: MeasurementDecoder;
  protected _initializer: SensorInitializer;

  constructor(adapter?: BLEAdapterBase) {
    this._adapter = adapter ?? createBLEAdapter();
    this._protocol = new ProtocolHandler();
    this._protocol.setNotificationHandler(this._handleNotification.bind(this));

    // Create shared state for decoder
    const decoderState: DecoderState = {
      sensorData: this._sensorData,
      sensorDataPrev: this._sensorDataPrev,
      deviceMeasurements: this._deviceMeasurements,
      dataStack: this._dataStack,
      dataResults: this._dataResults,
    };
    this._decoder = new MeasurementDecoder(decoderState);

    // Create shared state for initializer
    const initState: InitializerState = {
      deviceChannels: this._deviceChannels,
      deviceMeasurements: this._deviceMeasurements,
      sensorNames: this._sensorNames,
      measurementSensorIds: this._measurementSensorIds,
      dataResults: this._dataResults,
      dataAckCounter: this._dataAckCounter,
      dataStack: this._dataStack,
      sensorData: this._sensorData,
    };
    this._initializer = new SensorInitializer(initState);
  }

  // ==================== Properties ====================

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

  // ==================== Connection ====================

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
    this._protocol.setClient(this._client);
    this._protocol.buildHandleServiceMap();
    await this._protocol.startNotifications();

    // Special handling for Rotary Motion sensor
    if (this._devType === 'Rotary Motion') {
      await this._protocol.writeAwaitCallback(PROTOCOL.SENSOR_SERVICE_ID, [
        ...PROTOCOL.WIRELESS_RMS_START,
      ]);
    }

    await this._initializeDevice();
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
    this._protocol.setClient(null);
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

  /**
   * Detect devices attached to control node
   */
  async scanControlnodePlugins(): Promise<void> {
    if (!this.isConnected()) {
      throw new DeviceNotConnected();
    }

    await this._protocol.writeAwaitCallback(PROTOCOL.SENSOR_SERVICE_ID, [
      PROTOCOL.CTRLNODE_CMD_DETECT_DEVICES,
    ]);
  }

  // ==================== Protected Methods for Subclasses ====================

  /**
   * Write a command to the device (for subclass use)
   */
  protected async write(serviceId: number, command: number[]): Promise<void> {
    return this._protocol.write(serviceId, command);
  }

  /**
   * Write and await callback (for subclass use)
   */
  protected async writeAwaitCallback(serviceId: number, command: number[]): Promise<void> {
    return this._protocol.writeAwaitCallback(serviceId, command);
  }

  // ==================== Internal Methods ====================

  /**
   * Set device parameters from BLE device info
   */
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

  /**
   * Initialize device by parsing datasheet
   */
  protected async _initializeDevice(): Promise<void> {
    this._initializer.initializeFromInterface(this._interfaceId ?? 0);

    // Sync the device channels reference
    this._deviceChannels = this._initializer.state.deviceChannels;

    // Check for pluggable sensors
    if (this._initializer.hasPluggableSensors()) {
      await this.scanControlnodePlugins();
    } else {
      this._initializer.initializeSensors();
    }
  }

  /**
   * Handle incoming BLE notifications
   */
  protected _handleNotification(serviceId: number, data: number[]): void {
    if (serviceId > 0) {
      // Sensor measurement response
      this._processMeasurementResponse(serviceId - 1, data);
    } else {
      // Device response
      this._processDeviceResponse(data);
    }
  }

  /**
   * Process measurement response from sensor
   */
  protected _processMeasurementResponse(sensorId: number, data: number[]): void {
    if (data[0] !== undefined && data[0] <= 0x1f) {
      // Periodic data
      const stack = this._dataStack.get(sensorId) ?? [];
      stack.push(...data.slice(1));
      this._dataStack.set(sensorId, stack);

      const counter = (this._dataAckCounter.get(sensorId) ?? 0) + 1;
      this._dataAckCounter.set(sensorId, counter);

      this._decoder.decode(sensorId);

      // Send acknowledgement every 8 packets
      if (counter > 8) {
        this._dataAckCounter.set(sensorId, 0);
        const responseServiceId = sensorId + 1;
        this._protocol.sendAck(responseServiceId, [data[0]!]).catch(() => {});
      }
    } else if (data[0] === PROTOCOL.CNTRLNODE_PLUGINS_CALLBACK) {
      this._updateControlnodePluginSensor(data);
    } else if (data[0] === PROTOCOL.GRSP_RESULT && data[1] === 0x00) {
      if (data[2] === PROTOCOL.GCMD_READ_ONE_SAMPLE) {
        // Store data for the sensor we requested from
        if (this._notifySensorId !== null) {
          this._dataStack.set(this._notifySensorId, data.slice(3));
        }
      }
    }
  }

  /**
   * Process device response
   */
  protected _processDeviceResponse(data: number[]): void {
    this._responseData = new Uint8Array(data);

    if (data[0] === PROTOCOL.GRSP_RESULT && data[1] === 0x00) {
      if (data[2] === PROTOCOL.GCMD_READ_ONE_SAMPLE) {
        this._dataPacket = data.slice(3);
        if (this._notifySensorId !== null) {
          this._dataStack.set(this._notifySensorId, [...this._dataPacket]);
        }
      } else if (data[2] === PROTOCOL.GCMD_CONTROL_NODE_CMD) {
        this._dataPacket = data.slice(3);
      }
    }
  }

  /**
   * Update control node plugin sensors
   */
  protected _updateControlnodePluginSensor(data: number[]): void {
    // Unpack sensor IDs (little-endian 16-bit integers)
    const sensorIds: number[] = [];
    for (let i = 1; i < data.length - 1; i += 2) {
      const low = data[i] ?? 0;
      const high = data[i + 1] ?? 0;
      sensorIds.push(low | (high << 8));
    }
    this._initializer.initializeSensors(sensorIds);
  }

  /**
   * Request sensor data (for subclass use)
   */
  protected async _requestSensorData(sensorId: number): Promise<void> {
    this._notifySensorId = sensorId;

    let packetSize = 0;
    for (const sensor of this._deviceChannels) {
      if (sensor.id === sensorId) {
        packetSize = sensor.total_data_size;
        break;
      }
    }

    const serviceId = sensorId + 1;
    await this._protocol.writeAwaitCallback(serviceId, [PROTOCOL.GCMD_READ_ONE_SAMPLE, packetSize]);
  }

  /**
   * Request and decode sensor measurements
   */
  protected async _getSensorMeasurements(sensorId: number): Promise<void> {
    // Track which sensor we're requesting data from
    this._notifySensorId = sensorId;

    // Find packet size for this sensor
    let packetSize = 0;
    for (const sensor of this._deviceChannels) {
      if (sensor.id === sensorId) {
        packetSize = sensor.total_data_size;
        break;
      }
    }

    // Request data
    const serviceId = sensorId + 1;
    await this._protocol.writeAwaitCallback(serviceId, [PROTOCOL.GCMD_READ_ONE_SAMPLE, packetSize]);

    // Decode the received data
    this._decoder.decode(sensorId);
  }
}
