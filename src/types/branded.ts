/**
 * Branded Types for PASCO BLE Library
 *
 * Branded types (also known as nominal types or opaque types) provide compile-time
 * type safety for ID values that would otherwise be plain numbers or strings.
 * This prevents accidentally mixing up different ID types.
 *
 * @example
 * ```typescript
 * // Without branded types (dangerous - can mix up IDs):
 * function getSensor(sensorId: number, measurementId: number) { ... }
 * getSensor(measurementId, sensorId);  // Compiles but wrong!
 *
 * // With branded types (safe - compiler catches mistakes):
 * function getSensor(sensorId: SensorId, measurementId: MeasurementId) { ... }
 * getSensor(measurementId, sensorId);  // Compile error!
 * ```
 */

/**
 * Brand symbol for creating unique branded types.
 * This symbol is used internally and not exported.
 */
declare const __brand: unique symbol;

/**
 * Helper type for creating branded types.
 * A branded type is a primitive type with an additional phantom type tag.
 */
type Brand<T, B> = T & { readonly [__brand]: B };

/**
 * Branded type for Sensor IDs.
 * Sensor IDs identify specific sensor hardware (e.g., Temperature sensor, pH sensor).
 *
 * @example
 * ```typescript
 * const sensorId = 123 as SensorId;
 * const sensor = getSensor(sensorId);
 * ```
 */
export type SensorId = Brand<number, 'SensorId'>;

/**
 * Branded type for Measurement IDs.
 * Measurement IDs identify specific measurements within a sensor (e.g., Temperature, Humidity).
 *
 * @example
 * ```typescript
 * const measurementId = 456 as MeasurementId;
 * const value = getMeasurement(measurementId);
 * ```
 */
export type MeasurementId = Brand<number, 'MeasurementId'>;

/**
 * Branded type for Interface IDs.
 * Interface IDs identify wireless interface configurations for PASCO devices.
 *
 * @example
 * ```typescript
 * const interfaceId = 1024 as InterfaceId;
 * const config = getInterface(interfaceId);
 * ```
 */
export type InterfaceId = Brand<number, 'InterfaceId'>;

/**
 * Branded type for Channel IDs.
 * Channel IDs identify sensor channels on devices that support multiple inputs.
 *
 * @example
 * ```typescript
 * const channelId = 0 as ChannelId;
 * const channel = getChannel(channelId);
 * ```
 */
export type ChannelId = Brand<number, 'ChannelId'>;

// ============================================================================
// Type Guards and Utilities
// ============================================================================

/**
 * Create a SensorId from a number.
 * Use this when you have a number that you know represents a sensor ID.
 *
 * @param id - The numeric sensor ID
 * @returns The branded SensorId
 *
 * @example
 * ```typescript
 * const rawId = parseSensorFromDatasheet();  // returns number
 * const sensorId = asSensorId(rawId);        // branded SensorId
 * ```
 */
export function asSensorId(id: number): SensorId {
  return id as SensorId;
}

/**
 * Create a MeasurementId from a number.
 * Use this when you have a number that you know represents a measurement ID.
 *
 * @param id - The numeric measurement ID
 * @returns The branded MeasurementId
 */
export function asMeasurementId(id: number): MeasurementId {
  return id as MeasurementId;
}

/**
 * Create an InterfaceId from a number.
 * Use this when you have a number that you know represents an interface ID.
 *
 * @param id - The numeric interface ID
 * @returns The branded InterfaceId
 */
export function asInterfaceId(id: number): InterfaceId {
  return id as InterfaceId;
}

/**
 * Create a ChannelId from a number.
 * Use this when you have a number that you know represents a channel ID.
 *
 * @param id - The numeric channel ID
 * @returns The branded ChannelId
 */
export function asChannelId(id: number): ChannelId {
  return id as ChannelId;
}

/**
 * Extract the raw number from a branded ID.
 * Use this when you need to pass a branded ID to an API that expects a plain number.
 *
 * @param id - Any branded ID type
 * @returns The underlying number value
 *
 * @example
 * ```typescript
 * const sensorId = asSensorId(123);
 * const rawId = toNumber(sensorId);  // 123
 * ```
 */
export function toNumber(id: SensorId | MeasurementId | InterfaceId | ChannelId): number {
  return id as number;
}

/**
 * Check if a value is a valid sensor ID (non-negative integer).
 * Does not brand the value, just validates it.
 *
 * @param value - The value to check
 * @returns true if the value is a valid ID
 */
export function isValidId(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0;
}
