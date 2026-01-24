/**
 * Measurement type definitions for PASCO BLE devices
 */

/**
 * Known measurement types supported by PASCO sensors.
 * Using const assertion for stricter type inference and runtime validation.
 */
export const MEASUREMENT_TYPES = [
  'RawDigital',
  'Direct',
  'Constant',
  'LinearConv',
  'FactoryCal',
  'UserCal',
  'ThreeInputVector',
  'Select',
  'RotaryPos',
  'Derivative',
  'Equation',
] as const;

/**
 * Known measurement type (one of the predefined types)
 */
export type KnownMeasurementType = (typeof MEASUREMENT_TYPES)[number];

/**
 * Measurement type - either a known type or a custom string for extensibility
 */
export type MeasurementType = KnownMeasurementType | (string & {});

/**
 * Check if a value is a known measurement type
 * @param value The value to check
 * @returns true if the value is a known measurement type
 */
export function isKnownMeasurementType(value: unknown): value is KnownMeasurementType {
  return typeof value === 'string' && MEASUREMENT_TYPES.includes(value as KnownMeasurementType);
}

export interface MeasurementLimits {
  min: number;
  max: number;
}

export interface Measurement {
  ID: number;
  NameTag: string;
  Type: MeasurementType;
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
