/**
 * Device and sensor type definitions for PASCO BLE devices
 */

import type { Measurement } from './measurement.js';

export type ChannelType = 'Pasport' | 'BuiltIn' | 'Plugin';

export interface SensorChannel {
  id: number;
  name: string;
  sensor_id: number;
  type: ChannelType | string;
  output_type: string;
  measurements: string[];
  total_data_size: number;
  plug_detect: number;
  channel_id_tag: string;
  factory_cal_ids: string[];
}

export interface Sensor {
  ID: number;
  Tag: string;
  measurements: Measurement[];
}

export interface InterfaceChannel {
  ID: number;
  NameTag?: string;
  SensorID?: number;
  Type: string;
  OutputType?: string;
  PlugDetect?: number;
  ChannelIDTag?: string;
}

export interface Interface {
  ID: number;
  channels: InterfaceChannel[];
}

export interface Datasheets {
  genericMeasurements: Record<number, { Tag: string; UnitGroup: string }>;
  interfaces: Record<number, { channels: InterfaceChannel[] }>;
  sensors: Record<number, { Tag: string; measurements: Measurement[] }>;
}

export interface DeviceState {
  name: string | null;
  serialId: string | null;
  address: string | null;
  interfaceId: number | null;
  devType: string | null;
  airlinkSensorId: number | null;
}

export const COMPATIBLE_DEVICES = [
  '//code.Node',
  'Accel Alt',
  'CO2',
  'Conductivity',
  '//control.Node',
  'Current',
  'Diffraction',
  'Drop Counter',
  'Force Accel',
  'Light',
  'Load Cell',
  'Mag Field',
  'Motion',
  'O2',
  'Optical DO',
  'pH',
  'Pressure',
  'Rotary Motion',
  'Smart Cart',
  'Temperature',
  'Voltage',
  'Weather',
] as const;

export type CompatibleDevice = (typeof COMPATIBLE_DEVICES)[number];
