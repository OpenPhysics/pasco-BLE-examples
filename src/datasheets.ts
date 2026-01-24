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
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 2020 }],
  },
  1026: {
    id: 1026,
    nameTag: 'WirelessPH',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 2021 }],
  },
  1027: {
    id: 1027,
    nameTag: 'WirelessPressure',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 2022 }],
  },
  1028: {
    id: 1028,
    nameTag: 'WirelessForceAccel',
    channels: [
      { ID: 0, NameTag: 'Force', Type: 'Pasport', SensorID: 2023 },
      { ID: 1, NameTag: 'Accel', Type: 'Pasport', SensorID: 2024 },
      { ID: 2, NameTag: 'Gyro', Type: 'Pasport', SensorID: 2028 },
    ],
  },
  1029: {
    id: 1029,
    nameTag: 'SmartCart',
    channels: [
      { ID: 0, NameTag: 'Force', Type: 'Pasport', SensorID: 2025 },
      { ID: 1, NameTag: 'Accel', Type: 'Pasport', SensorID: 2026 },
      { ID: 2, NameTag: 'Position', Type: 'Pasport', SensorID: 2027 },
      { ID: 3, NameTag: 'Gyro', Type: 'Pasport', SensorID: 2029 },
    ],
  },
  1030: {
    id: 1030,
    nameTag: 'WirelessLight',
    channels: [
      { ID: 0, Type: 'Pasport', SensorID: 2030 },
      { ID: 1, Type: 'Pasport', SensorID: 2034 },
    ],
  },
  1031: {
    id: 1031,
    nameTag: 'WirelessVoltage',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 2031 }],
  },
  1032: {
    id: 1032,
    nameTag: 'WirelessCurrent',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 2032 }],
  },
  1033: {
    id: 1033,
    nameTag: 'WirelessConductivity',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 2033 }],
  },
  1034: {
    id: 1034,
    nameTag: 'WirelessCO2',
    channels: [{ ID: 0, Type: 'Pasport', SensorID: 2035 }],
  },
  1036: {
    id: 1036,
    nameTag: 'WirelessWeather',
    channels: [
      { ID: 0, NameTag: 'Weather', Type: 'Pasport', SensorID: 2037 },
      { ID: 1, NameTag: 'GPS', Type: 'Pasport', SensorID: 2038 },
      { ID: 2, NameTag: 'Light', Type: 'Pasport', SensorID: 2039 },
      { ID: 3, NameTag: 'Compass', Type: 'Pasport', SensorID: 2045 },
    ],
  },
  1041: {
    id: 1041,
    nameTag: 'WirelessRotaryMotion',
    channels: [{ ID: 0, NameTag: 'Position', Type: 'Pasport', SensorID: 2047 }],
  },
  1042: {
    id: 1042,
    nameTag: 'WirelessMotion',
    channels: [{ ID: 0, NameTag: 'Position', Type: 'Pasport', SensorID: 2048 }],
  },
  1043: {
    id: 1043,
    nameTag: 'WirelessDropCounter',
    channels: [{ ID: 0, NameTag: 'Drops', Type: 'Pasport', SensorID: 2050 }],
  },
  1044: {
    id: 1044,
    nameTag: 'WirelessMagField',
    channels: [{ ID: 0, NameTag: 'MagField', Type: 'Pasport', SensorID: 2051 }],
  },
  1045: {
    id: 1045,
    nameTag: 'WirelessODO',
    channels: [{ ID: 0, NameTag: 'ODO', Type: 'Pasport', SensorID: 2049 }],
  },
  1046: {
    id: 1046,
    nameTag: 'WirelessFastRespTemp',
    channels: [{ ID: 0, NameTag: 'Temperature', Type: 'Pasport', SensorID: 2052 }],
  },
  1047: {
    id: 1047,
    nameTag: 'WirelessAccelAlt',
    channels: [
      { ID: 0, NameTag: 'Accel', Type: 'Pasport', SensorID: 2053 },
      { ID: 1, NameTag: 'Gyro', Type: 'Pasport', SensorID: 2056 },
      { ID: 2, NameTag: 'Altimeter', Type: 'Pasport', SensorID: 2054 },
    ],
  },
  // Smart Gate interface
  1048: {
    id: 1048,
    nameTag: 'WirelessSmartGate',
    channels: [{ ID: 0, NameTag: 'SmartGate', Type: 'Pasport', SensorID: 2055 }],
  },
  // Oxygen Gas (O2) interface (PS-3217)
  1049: {
    id: 1049,
    nameTag: 'WirelessOxygenGas',
    channels: [{ ID: 0, NameTag: 'Oxygen', Type: 'Pasport', SensorID: 2057 }],
  },
  // Diffraction interface (OS-8441)
  1050: {
    id: 1050,
    nameTag: 'WirelessDiffraction',
    channels: [
      { ID: 0, NameTag: 'Position', Type: 'Pasport', SensorID: 2058 },
      { ID: 1, NameTag: 'Intensity', Type: 'Pasport', SensorID: 2059 },
    ],
  },
  // Sound interface
  1052: {
    id: 1052,
    nameTag: 'WirelessSound',
    channels: [
      { ID: 0, NameTag: 'SoundWave', Type: 'Pasport', SensorID: 2062 },
      { ID: 1, NameTag: 'SoundLevel', Type: 'Pasport', SensorID: 2063 },
    ],
  },
  // Soil Moisture interface
  1055: {
    id: 1055,
    nameTag: 'WirelessSoilMoisture',
    channels: [{ ID: 0, NameTag: 'SoilMoisture', Type: 'Pasport', SensorID: 2065 }],
  },
  // Code.Node interface (PS-3231)
  1056: {
    id: 1056,
    nameTag: 'WirelessCodeNode',
    channels: [
      { ID: 0, NameTag: 'TempLightSound', Type: 'Pasport', SensorID: 2066 },
      { ID: 1, NameTag: 'Compass', Type: 'Pasport', SensorID: 2067 },
      { ID: 2, NameTag: 'Acceleration', Type: 'Pasport', SensorID: 2068 },
      { ID: 3, NameTag: 'Buttons', Type: 'Pasport', SensorID: 2069 },
    ],
  },
  // Control.Node interface
  1057: {
    id: 1057,
    nameTag: 'WirelessControlNode',
    channels: [
      { ID: 0, NameTag: 'StepperA', Type: 'Pasport', SensorID: 2060, OutputType: '1' },
      { ID: 1, NameTag: 'StepperB', Type: 'Pasport', SensorID: 2060, OutputType: '1' },
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
  2020: {
    id: 2020,
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
  2022: {
    id: 2022,
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
  2021: {
    id: 2021,
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
  2023: {
    id: 2023,
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
  2024: {
    id: 2024,
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
  2028: {
    id: 2028,
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
  2030: {
    id: 2030,
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
  2031: {
    id: 2031,
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
  2032: {
    id: 2032,
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
  2033: {
    id: 2033,
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
  // Wireless Light Sensor 2 / Light UVA (PS-3213)
  2034: {
    id: 2034,
    tag: 'WirelessLightSensor2',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'White',
          Type: 'Equation',
          Equation: '([4]+([5]*1.27)+([6]*1.49))/3.76',
          UnitType: 'Unitless',
          Precision: 0,
          Visible: 1,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'R',
          Type: 'Equation',
          Equation: '([4]/[0])*26.6',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'G',
          Type: 'Equation',
          Equation: '(([5]*1.27)/[0])*26.6',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'B',
          Type: 'Equation',
          Equation: '(([6]*1.49)/[0])*26.6',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'RawR',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'RawG',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        6,
        {
          ID: 6,
          NameTag: 'RawB',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        7,
        {
          ID: 7,
          NameTag: 'RawWhite',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
    ]),
  },
  // Wireless CO2 Sensor (PS-3208)
  2035: {
    id: 2035,
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
  // Wireless Optical DO Sensor (PS-3224)
  2049: {
    id: 2049,
    tag: 'WirelessODOSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawO2',
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
          NameTag: 'RawTemperature',
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
          NameTag: 'DissolvedOxygen',
          Type: 'UserCal',
          Inputs: '0',
          Params: '0,0,29375,8.26',
          UnitType: 'mgpL',
          Precision: 2,
          Visible: 1,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'DOSaturation',
          Type: 'Equation',
          Equation: '[2]/[5]*100',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Temperature',
          Type: 'Equation',
          Equation: '[1]*0.01',
          UnitType: 'DegC',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'DOSatConc',
          Type: 'Equation',
          Equation: '14.621-0.41022*[4]+0.007991*[4]*[4]-0.000077774*[4]*[4]*[4]',
          UnitType: 'mgpL',
          Internal: 1,
          Visible: 0,
        },
      ],
    ]),
  },
  // Wireless Drop Counter Sensor (PS-3214)
  2050: {
    id: 2050,
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
  2051: {
    id: 2051,
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
  2052: {
    id: 2052,
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
  2025: {
    id: 2025,
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
  2026: {
    id: 2026,
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
  2027: {
    id: 2027,
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
  2029: {
    id: 2029,
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
  2053: {
    id: 2053,
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
  2054: {
    id: 2054,
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
  // Wireless Smart Gate Sensor (PS-3225)
  2055: {
    id: 2055,
    tag: 'WirelessSmartGateSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'Blocked',
          Type: 'RawDigital',
          DataSize: 1,
          UnitType: 'Unitless',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'TimeStamp',
          Type: 'RawDigital',
          DataSize: 2,
          UnitType: 'us',
          Internal: 1,
          Visible: 0,
        },
      ],
    ]),
  },
  // Wireless Gyro Sensor (PS-3223 Accel Alt)
  2056: {
    id: 2056,
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
  // Wireless Oxygen Gas Sensor (PS-3217)
  2057: {
    id: 2057,
    tag: 'WirelessOxygenGasSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawO2',
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
          NameTag: 'RawTemp',
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
          NameTag: 'RawHumidity',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'OxygenGasConcentration',
          Type: 'UserCal',
          Inputs: '0',
          Params: '0,0,13697,20.9',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Temperature',
          Type: 'Equation',
          Equation: '(([1]/65536)*165)-40',
          UnitType: 'DegC',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'RelativeHumidity',
          Type: 'Equation',
          Equation: '([2]/65536)*100',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Diffraction Position Sensor (OS-8441)
  2058: {
    id: 2058,
    tag: 'DiffractionPosition',
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
          Params: '0.01,2000',
          UnitType: 'm',
          Precision: 2,
          Visible: 1,
        },
      ],
    ]),
  },
  // Diffraction Intensity Sensor (OS-8441)
  2059: {
    id: 2059,
    tag: 'DiffractionIntensity',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawIntensity',
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
          NameTag: 'LightIntensity',
          Type: 'LinearConv',
          Inputs: '0',
          Params: '0.0015259,0',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Code.Node Temperature/Light/Sound Sensor (PS-3231)
  2066: {
    id: 2066,
    tag: 'CodeNodeTempLightSound',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawTemperature',
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
          NameTag: 'RawLight',
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
          NameTag: 'RawSoundLevel',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Temperature',
          Type: 'Equation',
          Equation: '[0]*0.01',
          UnitType: 'DegC',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'Brightness',
          Type: 'Equation',
          Equation: 'sqrt([1])*0.3906',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'Loudness',
          Type: 'Equation',
          Equation: '[2]*0.001526',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Code.Node Magnetic Field Sensor (PS-3231)
  2067: {
    id: 2067,
    tag: 'CodeNodeMagneticField',
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
        7,
        {
          ID: 7,
          NameTag: 'MagneticFieldStrength',
          Type: 'Equation',
          Equation: '[1]*0.15',
          UnitType: 'utesla',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Code.Node Motion Sensor (PS-3231)
  2068: {
    id: 2068,
    tag: 'CodeNodeMotion',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawX',
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
          NameTag: 'RawY',
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
          NameTag: 'RawZ',
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
          Params: '0,0,1,0.002394',
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
          Params: '0,0,1,0.002394',
          UnitType: 'ms2',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        7,
        {
          ID: 7,
          NameTag: 'TiltAngleX',
          Type: 'Equation',
          Equation: 'atan2([3],sqrt(([4]*[4])+([5]*[5])))*180/3.1416',
          UnitType: 'deg',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        8,
        {
          ID: 8,
          NameTag: 'TiltAngleY',
          Type: 'Equation',
          Equation: 'atan2([4],sqrt(([3]*[3])+([5]*[5])))*180/3.1416',
          UnitType: 'deg',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Code.Node Buttons (PS-3231)
  2069: {
    id: 2069,
    tag: 'CodeNodeButtons',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'Button1',
          Type: 'RawDigital',
          DataSize: 1,
          UnitType: 'Unitless',
          Precision: 0,
          Visible: 1,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'Button2',
          Type: 'RawDigital',
          DataSize: 1,
          UnitType: 'Unitless',
          Precision: 0,
          Visible: 1,
        },
      ],
    ]),
  },
  // Control.Node Stepper Motor
  2060: {
    id: 2060,
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
  2061: {
    id: 2061,
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
  // Wireless Weather Sensor (PS-3209)
  2037: {
    id: 2037,
    tag: 'WirelessWeatherSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'Temperature',
          Type: 'Equation',
          Equation: '(([8]/65536)*165)-40',
          UnitType: 'DegC',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        1,
        {
          ID: 1,
          NameTag: 'RelativeHumidity',
          Type: 'Equation',
          Equation: '([9]/65536)*100',
          UnitType: 'percent',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'BarometricPressure',
          Type: 'Equation',
          Equation: '[10]*0.002',
          UnitType: 'kPa',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'WindSpeed',
          Type: 'Equation',
          Equation: '[11]*0.0009144',
          UnitType: 'mps',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        8,
        {
          ID: 8,
          NameTag: 'RawTemperature',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        9,
        {
          ID: 9,
          NameTag: 'RawHumidity',
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
          NameTag: 'RawBaroPressure',
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
          NameTag: 'RawWindSpeed',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
    ]),
  },
  // Wireless GPS Sensor (PS-3209)
  2038: {
    id: 2038,
    tag: 'WirelessGPSSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawLatitude',
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
          NameTag: 'RawLongitude',
          Type: 'RawDigital',
          DataSize: 4,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        2,
        {
          ID: 2,
          NameTag: 'RawAltitude',
          Type: 'RawDigital',
          DataSize: 2,
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'RawSpeed',
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
          NameTag: 'SatelliteCount',
          Type: 'RawDigital',
          DataSize: 1,
          UnitType: 'Unitless',
          Precision: 0,
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'Latitude',
          Type: 'Equation',
          Equation: '[0]*0.000001',
          UnitType: 'deg',
          Precision: 5,
          Visible: 1,
        },
      ],
      [
        6,
        {
          ID: 6,
          NameTag: 'Longitude',
          Type: 'Equation',
          Equation: '[1]*0.000001',
          UnitType: 'deg',
          Precision: 5,
          Visible: 1,
        },
      ],
      [
        7,
        {
          ID: 7,
          NameTag: 'Altitude',
          Type: 'Equation',
          Equation: '([2]/3)-500',
          UnitType: 'm',
          Precision: 0,
          Visible: 1,
        },
      ],
      [
        8,
        {
          ID: 8,
          NameTag: 'Speed',
          Type: 'Equation',
          Equation: '[3]*0.0514444',
          UnitType: 'mps',
          Precision: 2,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Light Sensor for Weather (PS-3209)
  2039: {
    id: 2039,
    tag: 'WirelessLightSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'UVIRaw',
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
          NameTag: 'RawGreen',
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
          NameTag: 'UVIndex',
          Type: 'UserCal',
          Inputs: '0',
          Params: '0,0,100,1',
          UnitType: 'Unitless',
          Precision: 1,
          Visible: 1,
        },
      ],
      [
        3,
        {
          ID: 3,
          NameTag: 'Illuminance',
          Type: 'LinearConv',
          Inputs: '4',
          Params: '2,0',
          UnitType: 'lux',
          Precision: 0,
          Visible: 1,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'LuxCal',
          Type: 'FactoryCal',
          Inputs: '1',
          Params: '0,0,1,1',
          Internal: 1,
          Visible: 0,
        },
      ],
    ]),
  },
  // Wireless Compass Sensor (PS-3209)
  2045: {
    id: 2045,
    tag: 'WirelessCompass',
    measurements: new Map([
      [
        1,
        {
          ID: 1,
          NameTag: 'RawHeading',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          Internal: 1,
          Visible: 0,
        },
      ],
      [
        4,
        {
          ID: 4,
          NameTag: 'MagneticHeading',
          Type: 'Equation',
          Equation: '[1]*0.1',
          UnitType: 'deg',
          Precision: 0,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Rotary Motion Sensor (PS-3220)
  2047: {
    id: 2047,
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
  2048: {
    id: 2048,
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
  // Wireless Sound Wave Sensor (PS-3227)
  2062: {
    id: 2062,
    tag: 'WirelessSoundWaveSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'SoundWaveform',
          Type: 'RawDigital',
          DataSize: 2,
          TwosComp: '1',
          UnitType: 'Unitless',
          Precision: 0,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Sound Level Sensor (PS-3227)
  2063: {
    id: 2063,
    tag: 'WirelessSoundLevelSensor',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawSoundLevel',
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
          Type: 'Equation',
          Equation: '[0]*0.01',
          UnitType: 'dB',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Soil Moisture Sensor (PS-3228)
  2065: {
    id: 2065,
    tag: 'WirelessSoilMoistureSensor',
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
        4,
        {
          ID: 4,
          NameTag: 'VWCLoam',
          Type: 'UserCal',
          Inputs: '0',
          Params: '7122,45,51725,0',
          UnitType: 'percent',
          Precision: 0,
          Limits: '0,100',
          Visible: 1,
        },
      ],
      [
        5,
        {
          ID: 5,
          NameTag: 'VWCSand',
          Type: 'UserCal',
          Inputs: '0',
          Params: '6344,35,50689,0',
          UnitType: 'percent',
          Precision: 0,
          Limits: '0,100',
          Visible: 1,
        },
      ],
      [
        6,
        {
          ID: 6,
          NameTag: 'VWCClay',
          Type: 'UserCal',
          Inputs: '0',
          Params: '6499,45,52875,0',
          UnitType: 'percent',
          Precision: 0,
          Limits: '0,100',
          Visible: 1,
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
