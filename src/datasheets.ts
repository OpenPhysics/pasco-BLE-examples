/**
 * PASCO Device Datasheets
 *
 * This module contains the device configuration data in XML format.
 * The XML is parsed at runtime to extract sensor and measurement information.
 */

import type { Datasheets, InterfaceChannel, Measurement } from './types/index.js';

// Import the raw XML datasheet - this will be loaded from file in the build
// For now, we'll use dynamic import or embed key interfaces only
export const DATASHEET_VERSION = '1.0';

/**
 * Interface for parsed sensor data
 */
export interface ParsedSensor {
  id: number;
  tag: string;
  measurements: Map<number, Measurement>;
}

/**
 * Interface for parsed interface data
 */
export interface ParsedInterface {
  id: number;
  nameTag: string;
  channels: InterfaceChannel[];
}

/**
 * Key wireless interfaces commonly used with BLE devices
 * These are pre-parsed for faster access
 */
export const WIRELESS_INTERFACES: Record<number, ParsedInterface> = {
  1025: {
    id: 1025,
    nameTag: 'WirelessTemperature',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 0x2020 }],
  },
  1026: {
    id: 1026,
    nameTag: 'WirelessPH',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 0x2021 }],
  },
  1027: {
    id: 1027,
    nameTag: 'WirelessPressure',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 0x2022 }],
  },
  1028: {
    id: 1028,
    nameTag: 'WirelessForceAccel',
    channels: [
      { ID: 0, NameTag: 'Force', Type: 'Pasport', SensorID: 0x2023 },
      { ID: 1, NameTag: 'Accel', Type: 'Pasport', SensorID: 0x2024 },
      { ID: 2, NameTag: 'Gyro', Type: 'Pasport', SensorID: 0x2028 },
    ],
  },
  1029: {
    id: 1029,
    nameTag: 'SmartCart',
    channels: [
      { ID: 0, NameTag: 'Force', Type: 'Pasport', SensorID: 0x2025 },
      { ID: 1, NameTag: 'Accel', Type: 'Pasport', SensorID: 0x2026 },
      { ID: 2, NameTag: 'Position', Type: 'Pasport', SensorID: 0x2027 },
      { ID: 3, NameTag: 'Gyro', Type: 'Pasport', SensorID: 0x2029 },
    ],
  },
  1030: {
    id: 1030,
    nameTag: 'WirelessLight',
    channels: [
      { ID: 0, Type: 'Pasport', SensorID: 0x2030 },
      { ID: 1, Type: 'Pasport', SensorID: 0x2034 },
    ],
  },
  1031: {
    id: 1031,
    nameTag: 'WirelessVoltage',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 0x2031 }],
  },
  1032: {
    id: 1032,
    nameTag: 'WirelessCurrent',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 0x2032 }],
  },
  1033: {
    id: 1033,
    nameTag: 'WirelessConductivity',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 0x2033 }],
  },
  1034: {
    id: 1034,
    nameTag: 'WirelessCO2',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 0x2035 }],
  },
  1036: {
    id: 1036,
    nameTag: 'WirelessWeather',
    channels: [
      { ID: 0, NameTag: 'Weather', Type: 'Pasport', SensorID: 0x2037 },
      { ID: 1, NameTag: 'GPS', Type: 'Pasport', SensorID: 0x2038 },
      { ID: 2, NameTag: 'Light', Type: 'Pasport', SensorID: 0x2039 },
      { ID: 3, NameTag: 'Compass', Type: 'Pasport', SensorID: 0x2045 },
    ],
  },
  1041: {
    id: 1041,
    nameTag: 'WirelessRotaryMotion',
    channels: [{ ID: 0, NameTag: 'Position', Type: 'Pasport', SensorID: 0x2047 }],
  },
  1042: {
    id: 1042,
    nameTag: 'WirelessMotion',
    channels: [{ ID: 0, NameTag: 'Position', Type: 'Pasport', SensorID: 0x2048 }],
  },
  1043: {
    id: 1043,
    nameTag: 'WirelessDropCounter',
    channels: [{ ID: 0, NameTag: 'Drops', Type: 'Pasport', SensorID: 0x2050 }],
  },
  1044: {
    id: 1044,
    nameTag: 'WirelessMagField',
    channels: [{ ID: 0, NameTag: 'MagField', Type: 'Pasport', SensorID: 0x2051 }],
  },
  1045: {
    id: 1045,
    nameTag: 'WirelessODO',
    channels: [{ ID: 0, NameTag: 'ODO', Type: 'Pasport', SensorID: 0x2049 }],
  },
  1046: {
    id: 1046,
    nameTag: 'WirelessFastRespTemp',
    channels: [{ ID: 0, NameTag: 'Temperature', Type: 'Pasport', SensorID: 0x2052 }],
  },
  1047: {
    id: 1047,
    nameTag: 'WirelessAccelAlt',
    channels: [
      { ID: 0, NameTag: 'Accel', Type: 'Pasport', SensorID: 0x2053 },
      { ID: 1, NameTag: 'Gyro', Type: 'Pasport', SensorID: 0x2056 },
      { ID: 2, NameTag: 'Altimeter', Type: 'Pasport', SensorID: 0x2054 },
    ],
  },
  // Smart Gate interface
  1048: {
    id: 1048,
    nameTag: 'WirelessSmartGate',
    channels: [{ ID: 0, NameTag: 'SmartGate', Type: 'Pasport', SensorID: 0x2055 }],
  },
  // Oxygen Gas (O2) interface
  1049: {
    id: 1049,
    nameTag: 'WirelessOxygenGas',
    channels: [{ ID: 0, NameTag: 'Oxygen', Type: 'Pasport', SensorID: 0x2057 }],
  },
  // Diffraction interface
  1050: {
    id: 1050,
    nameTag: 'WirelessDiffraction',
    channels: [
      { ID: 0, NameTag: 'Position', Type: 'Pasport', SensorID: 0x2058 },
      { ID: 1, NameTag: 'Intensity', Type: 'Pasport', SensorID: 0x2059 },
    ],
  },
  // Sound interface
  1052: {
    id: 1052,
    nameTag: 'WirelessSound',
    channels: [
      { ID: 0, NameTag: 'SoundWave', Type: 'Pasport', SensorID: 0x2062 },
      { ID: 1, NameTag: 'SoundLevel', Type: 'Pasport', SensorID: 0x2063 },
    ],
  },
  // Soil Moisture interface
  1055: {
    id: 1055,
    nameTag: 'WirelessSoilMoisture',
    channels: [{ ID: 0, NameTag: 'SoilMoisture', Type: 'Pasport', SensorID: 0x2065 }],
  },
  // Code.Node interface
  1056: {
    id: 1056,
    nameTag: 'WirelessCodeNode',
    channels: [
      { ID: 0, NameTag: 'Light', Type: 'Pasport', SensorID: 0x2057 },
      { ID: 1, NameTag: 'Accel', Type: 'Pasport', SensorID: 0x2058 },
      { ID: 2, NameTag: 'Sound', Type: 'Pasport', SensorID: 0x2059 },
    ],
  },
  // Control.Node interface
  1057: {
    id: 1057,
    nameTag: 'WirelessControlNode',
    channels: [
      { ID: 0, NameTag: 'StepperA', Type: 'Pasport', SensorID: 0x2060, OutputType: '1' },
      { ID: 1, NameTag: 'StepperB', Type: 'Pasport', SensorID: 0x2060, OutputType: '1' },
      { ID: 2, NameTag: 'Sensor', Type: 'Pasport', PlugDetect: 1 },
      { ID: 3, NameTag: 'PluginA', Type: 'Pasport', PlugDetect: 1 },
      { ID: 4, NameTag: 'PluginB', Type: 'Pasport', PlugDetect: 1 },
    ],
  },
};

/**
 * Key sensors commonly used with BLE devices
 * Pre-parsed for faster access
 */
export const SENSORS: Record<number, ParsedSensor> = {
  // Wireless Temperature Sensor (PS-3201)
  8224: {
    id: 0x2020,
    tag: 'WirelessTemperatureSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawTemperature',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Temperature',
          Type: 'UserCal',
          Inputs: '2',
          Params: '0,0,100,100',
          UnitType: 'DegC',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'UncalTemperature',
          Type: 'LinearConv',
          Inputs: '0',
          Params: '0.00268127,-46.85',
          UnitType: 'DegC',
          Internal: 1,
          Visible: 0,
        },
      ],
    ]),
  },
  // Wireless Pressure Sensor (PS-3203)
  8226: {
    id: 0x2022,
    tag: 'WirelessPressureSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'adc',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Pressure',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '16016,14.7,38688,34.7',
          UnitType: 'kPa',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless pH Sensor (PS-3204)
  8225: {
    id: 0x2021,
    tag: 'WirelessPHSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'adc',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Voltage',
          Type: 'LinearConv',
          Inputs: '0',
          Params: '1,-2048',
          UnitType: 'mV',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'pH',
          Type: 'UserCal',
          Inputs: '1',
          Params: '177,4,-182,10',
          UnitType: 'Unitless',
          Precision: 2,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Force Sensor (PS-3202)
  8227: {
    id: 0x2023,
    tag: 'WirelessForceSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawForce',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'ForceFCal',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '32768,0,5000,50',
          UnitType: 'N',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Force',
          Type: 'UserCal',
          Inputs: '1',
          Params: '0,0,50,50',
          UnitType: 'N',
          Precision: 2,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Acceleration Sensor (PS-3202)
  8228: {
    id: 0x2024,
    tag: 'WirelessAccelerationSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'X',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Y',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'Z',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Accelerationx',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '0,0,1,0.004787',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Accelerationy',
          Type: 'FactoryCal',
          Inputs: '1',
          Params: '0,0,1,0.004787',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'Accelerationz',
          Type: 'FactoryCal',
          Inputs: '2',
          Params: '0,0,1,0.004787',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        6,
        {
          ID: 6,
          NameTag: 'AccelerationResultant',
          Type: 'ThreeInputVector',
          Inputs: '3,4,5',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Gyro Sensor (PS-3202)
  8232: {
    id: 0x2028,
    tag: 'WirelessGyroSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'X',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Y',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'Z',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'AngularVelocityx',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '0,0,1,0.07',
          UnitType: 'degps',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'AngularVelocityy',
          Type: 'FactoryCal',
          Inputs: '1',
          Params: '0,0,1,0.07',
          UnitType: 'degps',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'AngularVelocityz',
          Type: 'FactoryCal',
          Inputs: '2',
          Params: '0,0,1,0.07',
          UnitType: 'degps',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Light Sensor (PS-3213)
  8240: {
    id: 0x2030,
    tag: 'WirelessLightSensor1',
    measurements: new Map([
      [
        8,
        {
          ID: 8,
          NameTag: 'Illuminance',
          Type: 'LinearConv',
          Inputs: '16',
          Params: '2,0',
          UnitType: 'lux',
          Precision: 0,
          Visible: 1,
        },
      ],
      [
        9,
        {
          ID: 9,
          NameTag: 'R',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        10,
        {
          ID: 10,
          NameTag: 'G',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        11,
        {
          ID: 11,
          NameTag: 'B',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        16,
        {
          ID: 16,
          NameTag: 'LuxCal',
          Type: 'FactoryCal',
          Inputs: '10',
          Params: '0,0,1,1',
          Internal: 1,
          Visible: 0,
        },
      ],
    ]),
  },
  // Wireless Voltage Sensor (PS-3211)
  8241: {
    id: 0x2031,
    tag: 'WirelessVoltageSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawVoltage',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'CalVoltage5V',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '32768,0,65536,5',
          UnitType: 'V',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'CalVoltage15V',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '32768,0,65536,15',
          UnitType: 'V',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Voltage',
          Type: 'Select',
          Inputs: '1,2',
          UnitType: 'V',
          Precision: 3,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Current Sensor (PS-3212)
  8242: {
    id: 0x2032,
    tag: 'WirelessCurrentSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawCurrent',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'CalCurrent100mA',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '32768,0,65536,0.1',
          UnitType: 'A',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'CalCurrent1A',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '32768,0,65536,1.0',
          UnitType: 'A',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Current',
          Type: 'Select',
          Inputs: '1,2',
          UnitType: 'A',
          Precision: 3,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Conductivity Sensor (PS-3210)
  8243: {
    id: 0x2033,
    tag: 'WirelessConductivitySensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawConductivity',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'FCalConductivity',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '0,0,1,1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'Conductivity',
          Type: 'UserCal',
          Inputs: '1',
          Params: '0,0,1,1',
          UnitType: 'uSpcm',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'RawTemperature',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Temperature',
          Type: 'LinearConv',
          Inputs: '3',
          Params: '0.00268127,-46.85',
          UnitType: 'DegC',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless CO2 Sensor (PS-3208)
  8245: {
    id: 0x2035,
    tag: 'WirelessCO2Sensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'CO2Concentration',
          Type: 'UserCal',
          Inputs: '2',
          Params: '400,400,50000,50000',
          UnitType: 'ppm',
          Precision: 0,
          Visible: 1,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'RawCO2Concentration',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'RawUncalCO2Concentration',
          Type: 'LinearConv',
          Inputs: '1',
          Params: '2,0',
          UnitType: 'ppm',
          Internal: 1,
          Visible: 0,
        },
      ],
    ]),
  },
  // Wireless Drop Counter Sensor (PS-3214)
  8272: {
    id: 0x2050,
    tag: 'WirelessDropCounterSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'DropsSample',
          Type: 'RawDigital',
          DataSize: 2,
          UnitType: 'drops',
          Precision: 0,
          Visible: 1,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'DropCount',
          Type: 'RotaryPos',
          Inputs: '0',
          Params: '1,1',
          UnitType: 'drops',
          Precision: 0,
          Visible: 1,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'FluidVolume',
          Type: 'UserCal',
          Inputs: '1',
          Params: '0,0,30,1',
          UnitType: 'mL',
          Precision: 2,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Magnetic Field Sensor (PS-3221)
  8273: {
    id: 0x2051,
    tag: 'WirelessMagFieldSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawMagX',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'RawMagY',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'RawMagZ',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'MagneticFieldX',
          Type: 'UserCal',
          Inputs: '0',
          Params: '0,0,1,0.15',
          UnitType: 'utesla',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'MagneticFieldY',
          Type: 'UserCal',
          Inputs: '1',
          Params: '0,0,1,0.15',
          UnitType: 'utesla',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'MagneticFieldZ',
          Type: 'UserCal',
          Inputs: '2',
          Params: '0,0,1,0.15',
          UnitType: 'utesla',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Temperature Link (PS-3222)
  8274: {
    id: 0x2052,
    tag: 'WirelessTempLink',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawTemperature',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Temperature',
          Type: 'UserCal',
          Inputs: '2',
          Params: '0,0,100,100',
          UnitType: 'DegC',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'UncalTemperature',
          Type: 'LinearConv',
          Inputs: '0',
          Params: '0.00268127,-46.85',
          UnitType: 'DegC',
          Internal: 1,
          Visible: 0,
        },
      ],
    ]),
  },
  // SmartCart Force Sensor (ME-1240)
  8229: {
    id: 0x2025,
    tag: 'SmartCartForceSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawForce',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'ForceFCal',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '32768,0,1000,100',
          UnitType: 'N',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Force',
          Type: 'UserCal',
          Inputs: '1',
          Params: '0,0,100,100',
          UnitType: 'N',
          Precision: 2,
          Visible: 1,
        },
      ],
    ]),
  },
  // SmartCart Acceleration Sensor (ME-1240)
  8230: {
    id: 0x2026,
    tag: 'SmartCartAccelerationSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'X',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Y',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'Z',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Accelerationx',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '0,0,1,0.004787',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Accelerationy',
          Type: 'FactoryCal',
          Inputs: '1',
          Params: '0,0,1,0.004787',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'Accelerationz',
          Type: 'FactoryCal',
          Inputs: '2',
          Params: '0,0,1,0.004787',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        6,
        {
          ID: 6,
          NameTag: 'AccelerationResultant',
          Type: 'ThreeInputVector',
          Inputs: '3,4,5',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // SmartCart Position Sensor (ME-1240)
  8231: {
    id: 0x2027,
    tag: 'SmartCartPositionSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawCountChange',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Position',
          Type: 'RotaryPos',
          Inputs: '0',
          Params: '0.09895,816',
          UnitType: 'm',
          Precision: 4,
          Visible: 1,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'Velocity',
          Type: 'Derivative',
          Inputs: '1',
          Params: '3',
          UnitType: 'mps',
          Precision: 3,
          Visible: 1,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Acceleration',
          Type: 'Derivative',
          Inputs: '2',
          Params: '3',
          UnitType: 'ms2',
          Precision: 3,
          Visible: 1,
        },
      ],
    ]),
  },
  // SmartCart Gyro Sensor (ME-1240)
  8233: {
    id: 0x2029,
    tag: 'SmartCartGyroSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'X',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Y',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'Z',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'AngularVelocityx',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '0,0,1,0.00875',
          UnitType: 'degps',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'AngularVelocityy',
          Type: 'FactoryCal',
          Inputs: '1',
          Params: '0,0,1,0.00875',
          UnitType: 'degps',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'AngularVelocityz',
          Type: 'FactoryCal',
          Inputs: '2',
          Params: '0,0,1,0.00875',
          UnitType: 'degps',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Accelerometer (PS-3223 Accel Alt)
  8275: {
    id: 0x2053,
    tag: 'WirelessAccelerometer',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'X',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Y',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'Z',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Accelerationx',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '0,0,1,0.004787',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Accelerationy',
          Type: 'FactoryCal',
          Inputs: '1',
          Params: '0,0,1,0.004787',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'Accelerationz',
          Type: 'FactoryCal',
          Inputs: '2',
          Params: '0,0,1,0.004787',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        6,
        {
          ID: 6,
          NameTag: 'AccelerationResultant',
          Type: 'ThreeInputVector',
          Inputs: '3,4,5',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Altimeter (PS-3223 Accel Alt)
  8276: {
    id: 0x2054,
    tag: 'WirelessAltimeter',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawAltitude',
          Type: 'RawDigital',
          DataSize: 4,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Altitude',
          Type: 'UserCal',
          Inputs: '2',
          Params: '0,0,1,1',
          UnitType: 'm',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'AltitudeRaw',
          Type: 'Equation',
          Equation: '[0]/1000',
          UnitType: 'm',
          Internal: 1,
          Visible: 0,
        },
      ],
    ]),
  },
  // Wireless Gyro Sensor (PS-3223 Accel Alt)
  8278: {
    id: 0x2056,
    tag: 'WirelessGyroSensorAlt',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'X',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Y',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'Z',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'AngularVelocityx',
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '0,0,1,0.07',
          UnitType: 'degps',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'AngularVelocityy',
          Type: 'FactoryCal',
          Inputs: '1',
          Params: '0,0,1,0.07',
          UnitType: 'degps',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'AngularVelocityz',
          Type: 'FactoryCal',
          Inputs: '2',
          Params: '0,0,1,0.07',
          UnitType: 'degps',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Code.Node Light Sensor
  8279: {
    id: 0x2057,
    tag: 'CodeNodeLight',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawLight',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'LightLevel',
          Type: 'LinearConv',
          Inputs: '0',
          Params: '0.0244140625,0',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
          Limits: '0,100',
        },
      ],
    ]),
  },
  // Code.Node Accelerometer
  8280: {
    id: 0x2058,
    tag: 'CodeNodeAccelerometer',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawX',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          TwosComp: '1',
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'RawY',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          TwosComp: '1',
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'RawZ',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          TwosComp: '1',
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Accelerationx',
          Type: 'LinearConv',
          Inputs: '0',
          Params: '0.00024414,0',
          UnitType: 'grav',
          Precision: 2,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Accelerationy',
          Type: 'LinearConv',
          Inputs: '1',
          Params: '0.00024414,0',
          UnitType: 'grav',
          Precision: 2,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'Accelerationz',
          Type: 'LinearConv',
          Inputs: '2',
          Params: '0.00024414,0',
          UnitType: 'grav',
          Precision: 2,
          Visible: 1,
        },
      ],
      [
        6,
        {
          ID: 6,
          NameTag: 'AccelerationResultant',
          Type: 'ThreeInputVector',
          Inputs: '3,4,5',
          UnitType: 'grav',
          Precision: 2,
          Visible: 1,
        },
      ],
    ]),
  },
  // Code.Node Sound Sensor
  8281: {
    id: 0x2059,
    tag: 'CodeNodeSound',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawSound',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'SoundLevel',
          Type: 'LinearConv',
          Inputs: '0',
          Params: '0.0244140625,0',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
          Limits: '0,100',
        },
      ],
    ]),
  },
  // Control.Node Stepper Motor
  8288: {
    id: 0x2060,
    tag: 'ControlNodeStepper',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'StepperPosition',
          Type: 'RawDigital',
          DataSize: 4,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'StepperAngle',
          Type: 'LinearConv',
          Inputs: '0',
          Params: '0.375,0',
          UnitType: 'deg',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Control.Node Acceleration Sensor (built-in)
  8289: {
    id: 0x2061,
    tag: 'ControlNodeAcceleration',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawX',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          TwosComp: '1',
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'RawY',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          TwosComp: '1',
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'RawZ',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          TwosComp: '1',
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Accelerationx',
          Type: 'LinearConv',
          Inputs: '0',
          Params: '0.00024414,0',
          UnitType: 'grav',
          Precision: 2,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Accelerationy',
          Type: 'LinearConv',
          Inputs: '1',
          Params: '0.00024414,0',
          UnitType: 'grav',
          Precision: 2,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'Accelerationz',
          Type: 'LinearConv',
          Inputs: '2',
          Params: '0.00024414,0',
          UnitType: 'grav',
          Precision: 2,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Rotary Motion Sensor (PS-3220)
  8263: {
    id: 0x2047,
    tag: 'WirelessRotaryMotionSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawCountChange',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Angle',
          Type: 'RotaryPos',
          Inputs: '0',
          Params: '6.28319,2000',
          UnitType: 'rad',
          Precision: 3,
          Visible: 1,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'AngularVelocity',
          Type: 'Derivative',
          Inputs: '1',
          Params: '3',
          UnitType: 'radps',
          Precision: 3,
          Visible: 1,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'AngularAcceleration',
          Type: 'Derivative',
          Inputs: '2',
          Params: '3',
          UnitType: 'radps2',
          Precision: 3,
          Visible: 1,
        },
      ],
      [
        7,
        {
          ID: 7,
          NameTag: 'Position',
          Type: 'Equation',
          Equation: '[1]*[100]/6.2832',
          UnitType: 'm',
          Precision: 4,
          Visible: 1,
        },
      ],
      [
        8,
        {
          ID: 8,
          NameTag: 'Velocity',
          Type: 'Derivative',
          Inputs: '7',
          Params: '3',
          UnitType: 'mps',
          Precision: 3,
          Visible: 1,
        },
      ],
      [
        9,
        {
          ID: 9,
          NameTag: 'Acceleration',
          Type: 'Derivative',
          Inputs: '8',
          Params: '3',
          UnitType: 'ms2',
          Precision: 3,
          Visible: 1,
        },
      ],
      [
        100,
        {
          ID: 100,
          NameTag: 'LinearAccessory',
          Type: 'Constant',
          Internal: 1,
          Visible: 0,
          Value: '0.15',
        },
      ],
    ]),
  },
  // Wireless Motion Sensor (PS-3219)
  8264: {
    id: 0x2048,
    tag: 'WirelessMotionSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'EchoTime',
          Type: 'RawDigital',
          DataSize: 2,
          UnitType: 'us',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Position',
          Type: 'Equation',
          Equation: 'usound([0],[101])',
          UnitType: 'm',
          Precision: 2,
          Visible: 1,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'Velocity',
          Type: 'Derivative',
          Inputs: '1',
          Params: '3',
          UnitType: 'mps',
          Precision: 2,
          Visible: 1,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Acceleration',
          Type: 'Derivative',
          Inputs: '2',
          Params: '3',
          UnitType: 'ms2',
          Precision: 2,
          Visible: 1,
        },
      ],
      [
        100,
        {
          ID: 100,
          NameTag: 'MotionRange',
          Type: 'Constant',
          Internal: 1,
          Visible: 0,
          Value: '2',
        },
      ],
      [
        101,
        {
          ID: 101,
          NameTag: 'SpeedOfSound',
          Type: 'Constant',
          UnitType: 'mps',
          Internal: 1,
          Visible: 0,
          Value: '344',
        },
      ],
    ]),
  },
};

/**
 * Get interface data by ID
 */
export function getInterface(interfaceId: number): ParsedInterface | undefined {
  return WIRELESS_INTERFACES[interfaceId];
}

/**
 * Get sensor data by ID
 */
export function getSensor(sensorId: number): ParsedSensor | undefined {
  return SENSORS[sensorId];
}

/**
 * Check if an interface exists
 */
export function hasInterface(interfaceId: number): boolean {
  return interfaceId in WIRELESS_INTERFACES;
}

/**
 * Check if a sensor exists
 */
export function hasSensor(sensorId: number): boolean {
  return sensorId in SENSORS;
}

/**
 * The full datasheet XML string
 * This is embedded for runtime parsing when pre-parsed data is not available
 */
export const datasheetXml = `<?xml version="1.0" encoding="UTF-8"?>
<!-- PASCO Datasheet - Embedded subset for BLE devices -->
<!-- Full datasheet can be loaded from external file if needed -->
<Datasheets Version="1.0">
  <GenericMeasurements>
    <Measurement ID="0" Tag="None" UnitGroup="None"/>
    <Measurement ID="1" Tag="Time" UnitGroup="Time"/>
    <Measurement ID="5" Tag="Temperature" UnitGroup="Temperature"/>
    <Measurement ID="9" Tag="Pressure" UnitGroup="Pressure"/>
    <Measurement ID="10" Tag="Acceleration" UnitGroup="Acceleration"/>
    <Measurement ID="25" Tag="LightIntensity" UnitGroup="Light"/>
    <Measurement ID="24" Tag="SoundIntensity" UnitGroup="SoundIntensity"/>
  </GenericMeasurements>
</Datasheets>`;

/**
 * Create a datasheets object from parsed data
 * This provides a similar interface to the Python version
 */
export function createDatasheets(): Datasheets {
  const genericMeasurements: Record<number, { Tag: string; UnitGroup: string }> = {
    0: { Tag: 'None', UnitGroup: 'None' },
    1: { Tag: 'Time', UnitGroup: 'Time' },
    5: { Tag: 'Temperature', UnitGroup: 'Temperature' },
    9: { Tag: 'Pressure', UnitGroup: 'Pressure' },
    10: { Tag: 'Acceleration', UnitGroup: 'Acceleration' },
    25: { Tag: 'LightIntensity', UnitGroup: 'Light' },
  };

  const interfaces: Record<number, { channels: InterfaceChannel[] }> = {};
  for (const [id, iface] of Object.entries(WIRELESS_INTERFACES)) {
    interfaces[Number(id)] = { channels: iface.channels };
  }

  const sensors: Record<number, { Tag: string; measurements: Measurement[] }> = {};
  for (const [id, sensor] of Object.entries(SENSORS)) {
    sensors[Number(id)] = {
      Tag: sensor.tag,
      measurements: Array.from(sensor.measurements.values()),
    };
  }

  return {
    genericMeasurements,
    interfaces,
    sensors,
  };
}
