/**
 * Error classes for PASCO BLE operations
 *
 * All error classes support ES2022 error cause chaining via the `cause` option:
 *
 * @example
 * ```typescript
 * try {
 *   await device.connect();
 * } catch (error) {
 *   throw new BLEConnectionError('Failed to connect to sensor', { cause: error });
 * }
 * ```
 *
 * Each error has an `isRetryable` property indicating whether the operation
 * that caused the error can be retried:
 *
 * @example
 * ```typescript
 * try {
 *   await device.readData('Temperature');
 * } catch (error) {
 *   if (error instanceof PASCOError && error.isRetryable) {
 *     // Retry the operation
 *   }
 * }
 * ```
 */

// ============================================================================
// Error Codes
// ============================================================================

/**
 * Error codes for programmatic error handling.
 * Use these codes to identify specific error types without relying on error messages.
 *
 * @example
 * ```typescript
 * try {
 *   await device.connect();
 * } catch (error) {
 *   if (error instanceof PASCOError) {
 *     switch (error.code) {
 *       case ErrorCode.CONNECTION_FAILED:
 *         showReconnectDialog();
 *         break;
 *       case ErrorCode.DEVICE_ALREADY_CONNECTED:
 *         console.log('Already connected');
 *         break;
 *     }
 *   }
 * }
 * ```
 */
export enum ErrorCode {
  // BLE/Connection errors (1xx)
  /** BLE scan operation failed */
  SCAN_FAILED = 'PASCO_SCAN_FAILED',
  /** Connection to device failed */
  CONNECTION_FAILED = 'PASCO_CONNECTION_FAILED',
  /** Device is already connected */
  DEVICE_ALREADY_CONNECTED = 'PASCO_DEVICE_ALREADY_CONNECTED',
  /** Device is not connected */
  DEVICE_NOT_CONNECTED = 'PASCO_DEVICE_NOT_CONNECTED',
  /** BLE communication error */
  COMMUNICATION_ERROR = 'PASCO_COMMUNICATION_ERROR',

  // Sensor/Measurement errors (2xx)
  /** Requested measurement not found */
  MEASUREMENT_NOT_FOUND = 'PASCO_MEASUREMENT_NOT_FOUND',
  /** Sensor not found on device */
  SENSOR_NOT_FOUND = 'PASCO_SENSOR_NOT_FOUND',
  /** Failed to decode sensor data */
  DECODE_FAILED = 'PASCO_DECODE_FAILED',
  /** Sensor setup/initialization failed */
  SENSOR_SETUP_FAILED = 'PASCO_SENSOR_SETUP_FAILED',

  // Validation errors (3xx)
  /** Invalid parameter provided */
  INVALID_PARAMETER = 'PASCO_INVALID_PARAMETER',
  /** Invalid equation in measurement calculation */
  INVALID_EQUATION = 'PASCO_INVALID_EQUATION',
}

// ============================================================================
// Base Error Class
// ============================================================================

/** Options for error construction, supporting ES2022 cause chaining */
export interface ErrorOptions {
  cause?: unknown;
}

/** Extended options including error code */
export interface PASCOErrorOptions extends ErrorOptions {
  /** Optional error code override */
  code?: ErrorCode;
}

/**
 * Base class for all PASCO errors.
 * Provides common functionality like error codes and retryability.
 */
export abstract class PASCOError extends Error {
  /**
   * Error code for programmatic error handling.
   * Use this instead of parsing error messages.
   */
  abstract readonly code: ErrorCode;

  /**
   * Whether the operation that caused this error can be retried.
   * - `true`: Transient error, retry may succeed (e.g., communication timeout)
   * - `false`: Permanent error, retry will not help (e.g., invalid parameter)
   */
  abstract readonly isRetryable: boolean;
}

// ============================================================================
// BLE/Connection Errors (Retryable)
// ============================================================================

/**
 * Error thrown when BLE scanning fails.
 * This is typically retryable as scan failures are often transient.
 */
export class BLEScanFailed extends PASCOError {
  readonly code = ErrorCode.SCAN_FAILED;
  readonly isRetryable = true;

  constructor(
    message = 'Error occurred when trying to scan for a BLE sensor',
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'BLEScanFailed';
  }
}

/**
 * Error thrown when connection to a device fails.
 * This is typically retryable as connection failures can be transient.
 */
export class BLEConnectionError extends PASCOError {
  readonly code = ErrorCode.CONNECTION_FAILED;
  readonly isRetryable = true;

  constructor(message = 'Could not connect to the sensor', options?: ErrorOptions) {
    super(message, options);
    this.name = 'BLEConnectionError';
  }
}

/**
 * Error thrown when attempting to connect to an already-connected device.
 * This is NOT retryable - disconnect first before reconnecting.
 */
export class BLEAlreadyConnectedError extends PASCOError {
  readonly code = ErrorCode.DEVICE_ALREADY_CONNECTED;
  readonly isRetryable = false;

  constructor(message = 'Device already connected', options?: ErrorOptions) {
    super(message, options);
    this.name = 'BLEAlreadyConnectedError';
  }
}

/**
 * Error thrown when an operation requires a connection but device is not connected.
 * This is NOT retryable - connect first before performing the operation.
 */
export class DeviceNotConnected extends PASCOError {
  readonly code = ErrorCode.DEVICE_NOT_CONNECTED;
  readonly isRetryable = false;

  constructor(message = 'No device connected', options?: ErrorOptions) {
    super(message, options);
    this.name = 'DeviceNotConnected';
  }
}

/**
 * Error thrown when BLE communication fails.
 * This is typically retryable as communication errors can be transient.
 */
export class CommunicationError extends PASCOError {
  readonly code = ErrorCode.COMMUNICATION_ERROR;
  readonly isRetryable = true;

  constructor(message = 'Error sending or receiving data from the sensor', options?: ErrorOptions) {
    super(message, options);
    this.name = 'CommunicationError';
  }
}

// ============================================================================
// Sensor/Measurement Errors
// ============================================================================

/**
 * Error thrown when a requested measurement is not found on the device.
 * This is NOT retryable - the measurement doesn't exist on this device.
 */
export class MeasurementNotFound extends PASCOError {
  readonly code = ErrorCode.MEASUREMENT_NOT_FOUND;
  readonly isRetryable = false;

  constructor(
    message = 'Requested measurement does not belong to this device',
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'MeasurementNotFound';
  }
}

/**
 * Error thrown when a sensor is not found on the device.
 * This is NOT retryable - the sensor doesn't exist on this device.
 */
export class SensorNotFound extends PASCOError {
  readonly code = ErrorCode.SENSOR_NOT_FOUND;
  readonly isRetryable = false;

  constructor(message = 'The device does not have this sensor', options?: ErrorOptions) {
    super(message, options);
    this.name = 'SensorNotFound';
  }
}

/**
 * Error thrown when raw sensor data cannot be decoded.
 * This MAY be retryable if caused by corrupted data transmission.
 */
export class CouldNotDecodeData extends PASCOError {
  readonly code = ErrorCode.DECODE_FAILED;
  readonly isRetryable = true;

  constructor(message = 'Could not decode the raw data from the sensor', options?: ErrorOptions) {
    super(message, options);
    this.name = 'CouldNotDecodeData';
  }
}

/**
 * Error thrown when sensor initialization/setup fails.
 * This MAY be retryable if caused by timing or communication issues.
 */
export class SensorSetupError extends PASCOError {
  readonly code = ErrorCode.SENSOR_SETUP_FAILED;
  readonly isRetryable = true;

  constructor(message = 'Error setting the sensor parameters up', options?: ErrorOptions) {
    super(message, options);
    this.name = 'SensorSetupError';
  }
}

// ============================================================================
// Validation Errors (Not Retryable)
// ============================================================================

/**
 * Error thrown when an invalid parameter is provided.
 * This is NOT retryable - fix the parameter value before retrying.
 */
export class InvalidParameter extends PASCOError {
  readonly code = ErrorCode.INVALID_PARAMETER;
  readonly isRetryable = false;

  constructor(message = 'An invalid parameter was passed in', options?: ErrorOptions) {
    super(message, options);
    this.name = 'InvalidParameter';
  }
}

/**
 * Error thrown when an equation cannot be evaluated.
 * This is NOT retryable - indicates a configuration or datasheet issue.
 */
export class InvalidEquation extends PASCOError {
  readonly code = ErrorCode.INVALID_EQUATION;
  readonly isRetryable = false;

  constructor(message = 'Could not calculate the measurement', options?: ErrorOptions) {
    super(message, options);
    this.name = 'InvalidEquation';
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Type guard to check if an error is a PASCO error.
 *
 * @example
 * ```typescript
 * try {
 *   await device.readData('Temperature');
 * } catch (error) {
 *   if (isPASCOError(error)) {
 *     console.log(`Error code: ${error.code}, Retryable: ${error.isRetryable}`);
 *   }
 * }
 * ```
 */
export function isPASCOError(error: unknown): error is PASCOError {
  return error instanceof PASCOError;
}

/**
 * Check if an error is retryable.
 * Returns true for PASCO errors with isRetryable=true, false for all others.
 *
 * @example
 * ```typescript
 * try {
 *   await device.readData('Temperature');
 * } catch (error) {
 *   if (isRetryableError(error)) {
 *     await retry(() => device.readData('Temperature'));
 *   }
 * }
 * ```
 */
export function isRetryableError(error: unknown): boolean {
  return isPASCOError(error) && error.isRetryable;
}
