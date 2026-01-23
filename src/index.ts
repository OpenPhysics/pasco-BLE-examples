/**
 * PASCO BLE Library for TypeScript
 *
 * A TypeScript library for connecting to and communicating with PASCO BLE sensors.
 *
 * @example
 * ```typescript
 * import { PASCOBLEDevice, checkBrowserSupport } from 'pasco-ble';
 *
 * // Check browser compatibility first
 * const support = checkBrowserSupport();
 * if (!support.supported) {
 *   console.error(support.message);
 * }
 *
 * // Connect to a sensor
 * const device = new PASCOBLEDevice();
 * const devices = await device.scan();
 * await device.connect(devices[0]);
 *
 * // Read data
 * const temperature = await device.readData('Temperature');
 * console.log(`Temperature: ${temperature} ${device.getMeasurementUnit('Temperature')}`);
 *
 * await device.disconnect();
 * ```
 *
 * @packageDocumentation
 */

// ============================================================================
// Browser Support Detection
// ============================================================================

export {
  type BrowserSupport,
  checkBrowserSupport,
  isWebBluetoothSupported,
  SUPPORTED_BROWSERS,
  UNSUPPORTED_BROWSERS,
} from './browser-support.js';

// ============================================================================
// Main Device Classes
// ============================================================================

export { CodeNodeDevice, Icons } from './code-node-device.js';
export {
  ControlNodeDevice,
  type OutputType,
  type PortId,
  type ServoType,
} from './control-node-device.js';
export { PASCOBLEDevice } from './device/index.js';
export { PascoBot } from './pasco-bot.js';

// ============================================================================
// Device Configuration
// ============================================================================

export {
  DEFAULT_DEVICE_OPTIONS,
  type DeviceOptions,
  type LogLevel,
} from './device/index.js';

// ============================================================================
// Error Classes
// ============================================================================

export {
  BLEAlreadyConnectedError,
  BLEConnectionError,
  BLEScanFailed,
  CommunicationError,
  CouldNotDecodeData,
  DeviceNotConnected,
  type ErrorOptions,
  InvalidEquation,
  InvalidParameter,
  MeasurementNotFound,
  SensorNotFound,
  SensorSetupError,
} from './errors.js';

// ============================================================================
// Types
// ============================================================================

export * from './types/index.js';

// ============================================================================
// Unit Conversions
// ============================================================================

export type { UnitDefinition, UnitGroup } from './units.js';
export {
  convertUnit,
  getDefaultUnit,
  getUnitGroup,
  getUnitsInGroup,
} from './units.js';

// ============================================================================
// Event System
// ============================================================================

export {
  type DeviceEventName,
  type DeviceEvents,
  type EventListener,
  TypedEventEmitter,
} from './utils/event-emitter.js';

// ============================================================================
// LED Icons (for CodeNodeDevice)
// ============================================================================

export {
  type CharacterMatrix,
  getIcon,
  getWord,
  Icons as LEDIcons,
  type LEDCoordinate,
} from './character-library.js';
