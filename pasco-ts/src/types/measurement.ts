/**
 * Measurement type definitions for PASCO BLE devices
 */

export type MeasurementType =
  | 'RawDigital'
  | 'Direct'
  | 'Constant'
  | 'LinearConv'
  | 'FactoryCal'
  | 'UserCal'
  | 'ThreeInputVector'
  | 'Select'
  | 'RotaryPos'
  | 'Derivative';

export interface MeasurementLimits {
  min: number;
  max: number;
}

export interface Measurement {
  ID: number;
  NameTag: string;
  Type: MeasurementType | string;
  DataSize?: number;
  Precision?: number;
  UnitType?: string;
  Equation?: string;
  Inputs?: string | number;
  Params?: string;
  Value?: number | string | null;
  Limits?: string;
  Visible?: number;
  Internal?: number;
  TwosComp?: string;
  InternalUnit?: string;
  FactoryCalOrder?: number;
  FactoryCalParams?: number[];
}

export interface GenericMeasurement {
  ID: number;
  Tag: string;
  UnitGroup: string;
}
