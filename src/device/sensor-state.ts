/**
 * Sensor State
 *
 * Centralized state container for sensor data. Provides controlled access
 * to sensor state with clear ownership and mutation patterns.
 *
 * This class addresses the shared mutable state problem by:
 * 1. Owning all state in a single location
 * 2. Providing typed accessors for reading state
 * 3. Offering explicit mutation methods instead of exposing raw Maps
 */

import type { Measurement, SensorChannel } from '@/types/index.js';

/**
 * Read-only view of sensor state for components that only need to read
 */
export interface SensorStateReader {
  /** Get a sensor channel by ID */
  getChannel(channelId: number): SensorChannel | undefined;

  /** Get all device channels */
  getChannels(): readonly SensorChannel[];

  /** Get measurement definition for a sensor/measurement ID pair */
  getMeasurement(sensorId: number, measurementId: number): Measurement | undefined;

  /** Get all measurements for a sensor */
  getMeasurements(sensorId: number): ReadonlyMap<number, Measurement> | undefined;

  /** Get current sensor data value */
  getSensorValue(sensorId: number, measurementId: number): number | null | undefined;

  /** Get previous sensor data value (for derivative calculations) */
  getPreviousSensorValue(sensorId: number, measurementId: number): number | null | undefined;

  /** Get the data stack for a sensor */
  getDataStack(sensorId: number): readonly number[] | undefined;

  /** Get a result value by measurement name */
  getResult(measurementName: string): number | null | undefined;

  /** Get all result names */
  getResultNames(): IterableIterator<string>;

  /** Get sensor channel by name */
  getSensorByName(name: string): SensorChannel | undefined;

  /** Get all sensor names */
  getSensorNames(): IterableIterator<string>;

  /** Get the sensor ID for a measurement name */
  getMeasurementSensorId(measurementName: string): number | undefined;

  /** Check if a measurement exists */
  hasMeasurement(measurementName: string): boolean;

  /** Check if a sensor exists */
  hasSensor(sensorName: string): boolean;

  /**
   * Get direct access to device measurements map
   * @internal Use typed accessors when possible
   */
  readonly deviceMeasurementsMap: ReadonlyMap<number, ReadonlyMap<number, Measurement>>;
}

/**
 * Mutable operations for sensor state
 */
export interface SensorStateWriter {
  /** Set device channels (replaces all channels) */
  setChannels(channels: SensorChannel[]): void;

  /** Update a specific channel */
  updateChannel(channelId: number, updates: Partial<SensorChannel>): void;

  /** Set a measurement definition */
  setMeasurement(sensorId: number, measurementId: number, measurement: Measurement): void;

  /** Initialize measurement map for a sensor */
  initMeasurementsForSensor(sensorId: number): void;

  /** Set a sensor data value */
  setSensorValue(sensorId: number, measurementId: number, value: number | null): void;

  /** Initialize sensor data map for a sensor */
  initSensorDataForSensor(sensorId: number): void;

  /** Save current sensor data as previous (for derivative calculations) */
  savePreviousSensorData(sensorId: number): void;

  /** Set the data stack for a sensor */
  setDataStack(sensorId: number, stack: number[]): void;

  /** Append to the data stack for a sensor */
  appendToDataStack(sensorId: number, data: number[]): void;

  /** Consume bytes from the data stack (shift from front) */
  consumeFromDataStack(sensorId: number, count: number): number[];

  /** Set a result value */
  setResult(measurementName: string, value: number | null): void;

  /** Register a sensor by name */
  registerSensor(name: string, channel: SensorChannel): void;

  /** Map a measurement name to its sensor ID */
  mapMeasurementToSensor(measurementName: string, sensorId: number): void;

  /** Set the acknowledgement counter for a sensor */
  setAckCounter(sensorId: number, count: number): void;

  /** Get and increment the acknowledgement counter */
  incrementAckCounter(sensorId: number): number;

  /** Reset all state */
  reset(): void;

  /** Clear lookup tables (for rebuilding) */
  clearLookupTables(): void;
}

/**
 * Combined read/write interface for full state access
 */
export interface SensorStateAccess extends SensorStateReader, SensorStateWriter {}

/**
 * Centralized state container for sensor management
 *
 * Replaces the scattered Map instances that were previously shared between
 * SensorInitializer and MeasurementDecoder via mutable state objects.
 */
export class SensorState implements SensorStateAccess {
  // Core sensor configuration
  private _deviceChannels: SensorChannel[] = [];
  private _deviceMeasurements: Map<number, Map<number, Measurement>> = new Map();

  // Sensor name lookups
  private _sensorNames: Map<string, SensorChannel> = new Map();
  private _measurementSensorIds: Map<string, number> = new Map();

  // Runtime sensor data
  private _sensorData: Map<number, Map<number, number | null>> = new Map();
  private _sensorDataPrev: Map<number, Map<number, number | null>> = new Map();

  // Data buffering and results
  private _dataStack: Map<number, number[]> = new Map();
  private _dataResults: Map<string, number | null> = new Map();

  // Protocol state
  private _dataAckCounter: Map<number, number> = new Map();

  // ==================== Channel Operations ====================

  getChannel(channelId: number): SensorChannel | undefined {
    return this._deviceChannels.find((ch) => ch.id === channelId);
  }

  getChannels(): readonly SensorChannel[] {
    return this._deviceChannels;
  }

  setChannels(channels: SensorChannel[]): void {
    this._deviceChannels = channels;
  }

  updateChannel(channelId: number, updates: Partial<SensorChannel>): void {
    const channel = this._deviceChannels.find((ch) => ch.id === channelId);
    if (channel) {
      Object.assign(channel, updates);
    }
  }

  // ==================== Measurement Definition Operations ====================

  getMeasurement(sensorId: number, measurementId: number): Measurement | undefined {
    return this._deviceMeasurements.get(sensorId)?.get(measurementId);
  }

  getMeasurements(sensorId: number): ReadonlyMap<number, Measurement> | undefined {
    return this._deviceMeasurements.get(sensorId);
  }

  setMeasurement(sensorId: number, measurementId: number, measurement: Measurement): void {
    this._deviceMeasurements.get(sensorId)?.set(measurementId, measurement);
  }

  initMeasurementsForSensor(sensorId: number): void {
    this._deviceMeasurements.set(sensorId, new Map());
  }

  // ==================== Sensor Data Operations ====================

  getSensorValue(sensorId: number, measurementId: number): number | null | undefined {
    return this._sensorData.get(sensorId)?.get(measurementId);
  }

  getPreviousSensorValue(sensorId: number, measurementId: number): number | null | undefined {
    return this._sensorDataPrev.get(sensorId)?.get(measurementId);
  }

  setSensorValue(sensorId: number, measurementId: number, value: number | null): void {
    this._sensorData.get(sensorId)?.set(measurementId, value);
  }

  initSensorDataForSensor(sensorId: number): void {
    this._sensorData.set(sensorId, new Map());
  }

  savePreviousSensorData(sensorId: number): void {
    const currentData = this._sensorData.get(sensorId);
    if (currentData) {
      this._sensorDataPrev.set(sensorId, new Map(currentData));
    }
  }

  // ==================== Data Stack Operations ====================

  getDataStack(sensorId: number): readonly number[] | undefined {
    return this._dataStack.get(sensorId);
  }

  setDataStack(sensorId: number, stack: number[]): void {
    this._dataStack.set(sensorId, stack);
  }

  appendToDataStack(sensorId: number, data: number[]): void {
    const stack = this._dataStack.get(sensorId) ?? [];
    stack.push(...data);
    this._dataStack.set(sensorId, stack);
  }

  consumeFromDataStack(sensorId: number, count: number): number[] {
    const stack = this._dataStack.get(sensorId);
    if (!stack) return [];

    const consumed: number[] = [];
    for (let i = 0; i < count && stack.length > 0; i++) {
      const value = stack.shift();
      if (value !== undefined) {
        consumed.push(value);
      }
    }
    return consumed;
  }

  // ==================== Result Operations ====================

  getResult(measurementName: string): number | null | undefined {
    return this._dataResults.get(measurementName);
  }

  getResultNames(): IterableIterator<string> {
    return this._dataResults.keys();
  }

  setResult(measurementName: string, value: number | null): void {
    this._dataResults.set(measurementName, value);
  }

  /**
   * Get a copy of all results (for external use)
   */
  getAllResults(): Map<string, number | null> {
    return new Map(this._dataResults);
  }

  // ==================== Sensor Lookup Operations ====================

  getSensorByName(name: string): SensorChannel | undefined {
    return this._sensorNames.get(name);
  }

  getSensorNames(): IterableIterator<string> {
    return this._sensorNames.keys();
  }

  hasSensor(sensorName: string): boolean {
    return this._sensorNames.has(sensorName);
  }

  registerSensor(name: string, channel: SensorChannel): void {
    this._sensorNames.set(name, channel);
  }

  // ==================== Measurement Lookup Operations ====================

  getMeasurementSensorId(measurementName: string): number | undefined {
    return this._measurementSensorIds.get(measurementName);
  }

  hasMeasurement(measurementName: string): boolean {
    return this._measurementSensorIds.has(measurementName);
  }

  mapMeasurementToSensor(measurementName: string, sensorId: number): void {
    this._measurementSensorIds.set(measurementName, sensorId);
  }

  // ==================== Protocol State Operations ====================

  setAckCounter(sensorId: number, count: number): void {
    this._dataAckCounter.set(sensorId, count);
  }

  incrementAckCounter(sensorId: number): number {
    const current = this._dataAckCounter.get(sensorId) ?? 0;
    const next = current + 1;
    this._dataAckCounter.set(sensorId, next);
    return next;
  }

  // ==================== Bulk Operations ====================

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
  }

  clearLookupTables(): void {
    this._measurementSensorIds.clear();
    this._dataResults.clear();
    this._sensorNames.clear();
  }

  // ==================== Direct Map Access (for backward compatibility) ====================

  /**
   * Get direct access to device measurements map
   * @internal Use typed accessors when possible
   */
  get deviceMeasurementsMap(): Map<number, Map<number, Measurement>> {
    return this._deviceMeasurements;
  }

  /**
   * Get direct access to sensor data map
   * @internal Use typed accessors when possible
   */
  get sensorDataMap(): Map<number, Map<number, number | null>> {
    return this._sensorData;
  }

  /**
   * Get direct access to data results map
   * @internal Use typed accessors when possible
   */
  get dataResultsMap(): Map<string, number | null> {
    return this._dataResults;
  }

  /**
   * Get direct access to sensor names map
   * @internal Use typed accessors when possible
   */
  get sensorNamesMap(): Map<string, SensorChannel> {
    return this._sensorNames;
  }
}
