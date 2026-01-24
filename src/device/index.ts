/**
 * Device module exports
 */

export {
  type ConnectionState,
  ConnectionStateMachine,
  type StateChangeCallback,
  type StateTransition,
} from './connection-state.js';
export {
  createLogger,
  DEFAULT_DEVICE_OPTIONS,
  type DeviceLogger,
  type DeviceOptions,
  type LogLevel,
} from './device-options.js';
export { MeasurementDecoder } from './measurement-decoder.js';
export { PASCOBLEDevice } from './pasco-ble-device.js';
export { type NotificationHandler, PROTOCOL, ProtocolHandler } from './protocol-handler.js';
export { SensorInitializer } from './sensor-initializer.js';
export { SensorManager, type SensorManagerOptions } from './sensor-manager.js';
export {
  SensorState,
  type SensorStateAccess,
  type SensorStateReader,
  type SensorStateWriter,
} from './sensor-state.js';
