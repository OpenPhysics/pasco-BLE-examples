/**
 * Parameter Validation Utilities
 *
 * Provides consistent validation helpers for function parameters.
 */

import { InvalidParameter } from '../errors.js';

/**
 * Validate that a value is a number
 * @param value The value to validate
 * @param name The parameter name for error messages
 * @returns The validated number
 * @throws InvalidParameter if value is not a number
 */
export function validateNumber(value: unknown, name: string): number {
  if (typeof value !== 'number' || Number.isNaN(value)) {
    throw new InvalidParameter(`${name} must be a number`);
  }
  return value;
}

/**
 * Validate that a value is a finite number (not Infinity or NaN)
 * @param value The value to validate
 * @param name The parameter name for error messages
 * @returns The validated number
 * @throws InvalidParameter if value is not a finite number
 */
export function validateFiniteNumber(value: unknown, name: string): number {
  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new InvalidParameter(`${name} must be a finite number`);
  }
  return value;
}

/**
 * Validate that a value is an integer
 * @param value The value to validate
 * @param name The parameter name for error messages
 * @returns The validated integer
 * @throws InvalidParameter if value is not an integer
 */
export function validateInteger(value: unknown, name: string): number {
  if (typeof value !== 'number' || !Number.isInteger(value)) {
    throw new InvalidParameter(`${name} must be an integer`);
  }
  return value;
}

/**
 * Validate that a value is a string
 * @param value The value to validate
 * @param name The parameter name for error messages
 * @returns The validated string
 * @throws InvalidParameter if value is not a string
 */
export function validateString(value: unknown, name: string): string {
  if (typeof value !== 'string') {
    throw new InvalidParameter(`${name} must be a string`);
  }
  return value;
}

/**
 * Validate that a value is a non-empty string
 * @param value The value to validate
 * @param name The parameter name for error messages
 * @returns The validated string
 * @throws InvalidParameter if value is not a non-empty string
 */
export function validateNonEmptyString(value: unknown, name: string): string {
  if (typeof value !== 'string' || value.trim().length === 0) {
    throw new InvalidParameter(`${name} must be a non-empty string`);
  }
  return value;
}

/**
 * Validate that a value is an array
 * @param value The value to validate
 * @param name The parameter name for error messages
 * @returns The validated array
 * @throws InvalidParameter if value is not an array
 */
export function validateArray<T = unknown>(value: unknown, name: string): T[] {
  if (!Array.isArray(value)) {
    throw new InvalidParameter(`${name} must be an array`);
  }
  return value as T[];
}

/**
 * Validate that a number is within a specified range
 * @param value The value to validate
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @param name The parameter name for error messages
 * @returns The validated number
 * @throws InvalidParameter if value is outside the range
 */
export function validateRange(value: number, min: number, max: number, name: string): number {
  if (typeof value !== 'number' || value < min || value > max) {
    throw new InvalidParameter(`${name} must be between ${min} and ${max}`);
  }
  return value;
}

/**
 * Validate that a number is within a specified range (integer only)
 * @param value The value to validate
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @param name The parameter name for error messages
 * @returns The validated integer
 * @throws InvalidParameter if value is not an integer or outside the range
 */
export function validateIntegerRange(
  value: number,
  min: number,
  max: number,
  name: string,
): number {
  if (typeof value !== 'number' || !Number.isInteger(value) || value < min || value > max) {
    throw new InvalidParameter(`${name} must be an integer between ${min} and ${max}`);
  }
  return value;
}

/**
 * Validate that a value is defined (not null or undefined)
 * @param value The value to validate
 * @param name The parameter name for error messages
 * @returns The validated value
 * @throws InvalidParameter if value is null or undefined
 */
export function validateDefined<T>(value: T | null | undefined, name: string): T {
  if (value === null || value === undefined) {
    throw new InvalidParameter(`${name} is required`);
  }
  return value;
}
