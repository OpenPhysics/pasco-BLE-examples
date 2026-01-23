/**
 * PASCO BLE Library for TypeScript
 *
 * A TypeScript library for connecting to and communicating with PASCO BLE sensors.
 */

// BLE adapters
export {
  BLEAdapterBase,
  BLEClientBase,
  createPascoUuid,
  getCharacteristicIdFromUuid,
  getServiceIdFromUuid,
  isPascoUuid,
} from './ble/ble-adapter.js';
export { createBLEAdapter, Platform } from './ble/index.js';
export { WebBluetoothAdapter, WebBluetoothClient } from './ble/web-bluetooth-adapter.js';

// Character library for LED display
export {
  alphabet,
  type CharacterMatrix,
  getIcon,
  getWord,
  Icons as LEDIcons,
  type LEDCoordinate,
} from './character-library.js';
export { CodeNodeDevice, Icons } from './code-node-device.js';
export {
  ControlNodeDevice,
  type OutputType,
  type PortId,
  type ServoType,
} from './control-node-device.js';
// Datasheet functions
export {
  createDatasheets,
  getInterface,
  getSensor,
  hasInterface,
  hasSensor,
  type ParsedInterface,
  type ParsedSensor,
  SENSORS,
  WIRELESS_INTERFACES,
} from './datasheets.js';
// Main device classes
// Advanced: Internal device modules (for extension)
export {
  type DecoderState,
  type InitializerState,
  MeasurementDecoder,
  type NotificationHandler,
  PASCOBLEDevice,
  PROTOCOL,
  ProtocolHandler,
  SensorInitializer,
} from './device/index.js';
// Error classes
export {
  BLEAlreadyConnectedError,
  BLEConnectionError,
  BLEScanFailed,
  CommunicationError,
  CouldNotDecodeData,
  DeviceNotConnected,
  InvalidEquation,
  InvalidParameter,
  MeasurementNotFound,
  SensorNotFound,
  SensorSetupError,
} from './errors.js';
export { PascoBot } from './pasco-bot.js';
// Types
export * from './types/index.js';
export type { UnitDefinition, UnitGroup } from './units.js';
// Unit conversions
export {
  convertUnit,
  getDefaultUnit,
  getUnitGroup,
  getUnitsInGroup,
  UNIT_GROUPS,
  UNIT_TAG_TO_GROUP,
} from './units.js';
// Utility functions
export {
  binaryFloat,
  binaryFraction,
  buildByteValue,
  bytesToHex,
  decode64,
  packInt16LE,
  packInt32LE,
  twosComplement,
  unpackFloat32LE,
  unpackInt16LE,
  unpackInt32LE,
} from './utils/binary.js';
export {
  evaluateEquation,
  evaluateTableEquation,
  parentheticContents,
} from './utils/equation-parser.js';
export {
  calc4Params,
  calcLinearParams,
  calcRotaryPos,
  dewpoint,
  heatindex,
  limit,
  linearInterpolate,
  threeInputVector,
  usound,
  windchill,
} from './utils/math.js';
