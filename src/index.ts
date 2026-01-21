/**
 * PASCO BLE Library for TypeScript
 *
 * A TypeScript library for connecting to and communicating with PASCO BLE sensors.
 */

// Main device classes
export {
  PASCOBLEDevice,
  BLEScanFailed,
  BLEConnectionError,
  BLEAlreadyConnectedError,
  DeviceNotConnected,
  MeasurementNotFound,
  InvalidParameter,
  SensorNotFound,
  InvalidEquation,
  CouldNotDecodeData,
  CommunicationError,
  SensorSetupError,
} from './pasco-ble-device.js';

export { CodeNodeDevice, Icons } from './code-node-device.js';
export { ControlNodeDevice, type ServoType, type OutputType, type PortId } from './control-node-device.js';
export { PascoBot } from './pasco-bot.js';

// Character library for LED display
export {
  alphabet,
  Icons as LEDIcons,
  getIcon,
  getWord,
  type CharacterMatrix,
  type LEDCoordinate,
} from './character-library.js';

// BLE adapters
export {
  BLEAdapterBase,
  BLEClientBase,
  createPascoUuid,
  getServiceIdFromUuid,
  getCharacteristicIdFromUuid,
  isPascoUuid,
} from './ble/ble-adapter.js';
export { WebBluetoothAdapter, WebBluetoothClient } from './ble/web-bluetooth-adapter.js';
export { NobleAdapter, NobleClient } from './ble/noble-adapter.js';
export { createBLEAdapter, Platform } from './ble/index.js';

// Types
export * from './types/index.js';

// Utility functions
export {
  decode64,
  twosComplement,
  binaryFraction,
  binaryFloat,
  unpackFloat32LE,
  unpackInt16LE,
  unpackInt32LE,
  packInt16LE,
  packInt32LE,
  bytesToHex,
  buildByteValue,
} from './utils/binary.js';

export {
  linearInterpolate,
  calcLinearParams,
  calc4Params,
  calcRotaryPos,
  limit,
  threeInputVector,
  dewpoint,
  windchill,
  heatindex,
  usound,
} from './utils/math.js';

export { evaluateEquation, evaluateTableEquation, parentheticContents } from './utils/equation-parser.js';

// Datasheet functions
export {
  WIRELESS_INTERFACES,
  SENSORS,
  getInterface,
  getSensor,
  hasInterface,
  hasSensor,
  createDatasheets,
  type ParsedSensor,
  type ParsedInterface,
} from './datasheets.js';
