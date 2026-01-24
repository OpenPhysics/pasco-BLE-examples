/**
 * Sensor Manager
 *
 * Manages sensor state, initialization, and data reading for PASCO BLE devices.
 * Coordinates between SensorInitializer and MeasurementDecoder.
 */

import type { Measurement, SensorChannel } from '@/types/index.js';

import {
  DeviceNotConnected,
  InvalidParameter,
  MeasurementNotFound,
  SensorNotFound,
} from '../errors.js';
import { type DecoderState, MeasurementDecoder } from './measurement-decoder.js';
import { PROTOCOL, type ProtocolHandler } from './protocol-handler.js';
import { type InitializerState, SensorInitializer } from './sensor-initializer.js';

/**
 * Options for sensor manager
 */
export interface SensorManagerOptions {
  /** Device type for special handling */
  devType?: string | null;
  /** Protocol handler for reading sensor data */
  protocolHandler: ProtocolHandler;
  /** Check if device is connected */
  isConnected: () => boolean;
}

/**
 * Manages all sensor-related state and operations
 */
export class SensorManager {
  // Options
  private _options: SensorManagerOptions;

  // Sensor state maps
  private _sensorNames: Map<string, SensorChannel> = new Map();
  private _deviceMeasurements: Map<number, Map<number, Measurement>> = new Map();
  private _dataStack: Map<number, number[]> = new Map();
  private _sensorData: Map<number, Map<number, number | null>> = new Map();
  private _sensorDataPrev: Map<number, Map<number, number | null>> = new Map();
  private _dataResults: Map<string, number | null> = new Map();
  private _measurementSensorIds: Map<string, number> = new Map();
  private _deviceChannels: SensorChannel[] = [];
  private _dataAckCounter: Map<number, number> = new Map();
  private _notifySensorId: number | null = null;

  // Specialized handlers
  private _decoder: MeasurementDecoder;
  private _initializer: SensorInitializer;

  constructor(options: SensorManagerOptions) {
    this._options = options;

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

  get dataResults(): Map<string, number | null> {
    return this._dataResults;
  }

  get deviceSensors(): Map<string, SensorChannel> {
    return this._sensorNames;
  }

  get deviceChannels(): SensorChannel[] {
    return this._deviceChannels;
  }

  /**
   * Get device measurements map (for subclass compatibility)
   * @internal
   */
  get deviceMeasurements(): Map<number, Map<number, Measurement>> {
    return this._deviceMeasurements;
  }

  /**
   * Get sensor data map (for subclass compatibility)
   * @internal
   */
  get sensorData(): Map<number, Map<number, number | null>> {
    return this._sensorData;
  }

  // ==================== Initialization ====================

  /**
   * Initialize device sensors from interface ID
   */
  async initializeFromInterface(interfaceId: number): Promise<string[]> {
    this._initializer.initializeFromInterface(interfaceId);

    // Sync the device channels reference
    this._deviceChannels = this._initializer.state.deviceChannels;

    // Check for pluggable sensors
    if (this._initializer.hasPluggableSensors()) {
      await this._scanControlnodePlugins();
    } else {
      this._initializer.initializeSensors();
    }

    // Return list of sensor names
    return Array.from(this._sensorNames.keys());
  }

  /**
   * Reset all sensor state (for reconnection)
   */
  reset(): void {
    this._sensorNames.clear();
    this._deviceMeasurements.clear();
    this._dataStack.clear();
    this._sensorData.clear();
    this._sensorDataPrev.clear();
    this._dataResults.clear();
    this._measurementSensorIds.clear();
    this._deviceChannels = [];
    this._dataAckCounter.clear();
    this._notifySensorId = null;
  }

  // ==================== Sensor Validation Helpers ====================

  /**
   * Check if a sensor is initialized and ready
   * @param sensorName The sensor name to check
   * @returns true if the sensor exists and is initialized
   */
  isSensorReady(sensorName: string): boolean {
    return this._sensorNames.has(sensorName);
  }

  /**
   * Ensure a sensor is initialized, throwing if not
   * @param sensorName The sensor name to validate
   * @throws SensorNotFound if the sensor is not initialized
   */
  ensureSensorReady(sensorName: string): void {
    if (!this._sensorNames.has(sensorName)) {
      throw new SensorNotFound(`Sensor "${sensorName}" not initialized`);
    }
  }

  /**
   * Get sensor channel info, throwing if not found
   * @param sensorName The sensor name
   * @returns The sensor channel information
   * @throws SensorNotFound if the sensor does not exist
   */
  getSensorOrThrow(sensorName: string): SensorChannel {
    const sensor = this._sensorNames.get(sensorName);
    if (!sensor) {
      throw new SensorNotFound(`Sensor "${sensorName}" not found`);
    }
    return sensor;
  }

  /**
   * Check if a measurement is available
   * @param measurement The measurement name to check
   * @returns true if the measurement exists
   */
  isMeasurementReady(measurement: string): boolean {
    return this._measurementSensorIds.has(measurement);
  }

  /**
   * Ensure a measurement is available, throwing if not
   * @param measurement The measurement name to validate
   * @throws MeasurementNotFound if the measurement is not available
   */
  ensureMeasurementReady(measurement: string): void {
    if (!this._measurementSensorIds.has(measurement)) {
      throw new MeasurementNotFound(`Measurement "${measurement}" not available`);
    }
  }

  // ==================== Sensor API ====================

  /**
   * Get list of sensors on this device
   */
  getSensorList(): string[] {
    if (!this._options.isConnected()) {
      throw new DeviceNotConnected();
    }
    return Array.from(this._sensorNames.keys());
  }

  /**
   * Get list of measurements available from a sensor
   * @param sensorName Optional sensor name to filter by
   */
  getMeasurementList(sensorName?: string): string[] {
    if (!this._options.isConnected()) {
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
    if (!this._options.isConnected()) {
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
    if (!this._options.isConnected()) {
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
    if (!this._options.isConnected()) {
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
    if (!this._options.isConnected()) {
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

  // ==================== Notification Handling ====================

  /**
   * Handle incoming measurement response from sensor
   */
  handleMeasurementResponse(sensorId: number, data: number[]): void {
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
        this._options.protocolHandler.sendAck(responseServiceId, [data[0]!]).catch(() => {});
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
   * Request and decode sensor measurements by sensor ID (for subclass use)
   * @internal
   */
  async requestSensorMeasurements(sensorId: number): Promise<void> {
    await this._getSensorMeasurements(sensorId);
  }

  // ==================== Internal Methods ====================

  /**
   * Detect devices attached to control node
   */
  private async _scanControlnodePlugins(): Promise<void> {
    await this._options.protocolHandler.writeAwaitCallback(PROTOCOL.SENSOR_SERVICE_ID, [
      PROTOCOL.CTRLNODE_CMD_DETECT_DEVICES,
    ]);
  }

  /**
   * Update control node plugin sensors
   */
  private _updateControlnodePluginSensor(data: number[]): void {
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
   * Request and decode sensor measurements
   */
  private async _getSensorMeasurements(sensorId: number): Promise<void> {
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
    await this._options.protocolHandler.writeAwaitCallback(serviceId, [
      PROTOCOL.GCMD_READ_ONE_SAMPLE,
      packetSize,
    ]);

    // Decode the received data
    this._decoder.decode(sensorId);
  }
}
