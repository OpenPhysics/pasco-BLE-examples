/**
 * PASCO Device Datasheets
 *
 * This module contains the device configuration data in XML format.
 * The XML is parsed at runtime to extract sensor and measurement information.
 */

import type { Measurement, Datasheets, InterfaceChannel } from './types/index.js';

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
  // Code.Node interface
  1049: {
    id: 1049,
    nameTag: 'CodeNode',
    channels: [
      { ID: 0, NameTag: 'Light', Type: 'Pasport', SensorID: 0x2057 },
      { ID: 1, NameTag: 'Accel', Type: 'Pasport', SensorID: 0x2058 },
      { ID: 2, NameTag: 'Sound', Type: 'Pasport', SensorID: 0x2059 },
    ],
  },
  // Control.Node interface
  1050: {
    id: 1050,
    nameTag: 'ControlNode',
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
  // Wireless Temperature Sensor
  0x2020: {
    id: 0x2020,
    tag: 'WirelessTemperature',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawTemp',
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
          Type: 'FactoryCal',
          Inputs: '0',
          Params: '27512,0,32700,85',
          UnitType: 'DegC',
          Precision: 1,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Pressure Sensor
  0x2022: {
    id: 0x2022,
    tag: 'WirelessPressure',
    measurements: new Map([
      [
        0,
        {
          ID: 0,
          NameTag: 'RawPressure',
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
          NameTag: 'AbsolutePressure',
          Type: 'LinearConv',
          Inputs: '0',
          Params: '0.001,0',
          UnitType: 'kPa',
          Precision: 2,
          Visible: 1,
        },
      ],
    ]),
  },
  // Wireless Force Sensor
  0x2023: {
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
  // Wireless Acceleration Sensor
  0x2024: {
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
  // Wireless Gyro Sensor
  0x2028: {
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
  // Code.Node Light Sensor
  0x2057: {
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
  0x2058: {
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
  0x2059: {
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
  0x2060: {
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
  0x2061: {
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
