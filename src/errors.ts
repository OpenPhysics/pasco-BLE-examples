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
 */

/** Options for error construction, supporting ES2022 cause chaining */
export interface ErrorOptions {
  cause?: unknown;
}

export class BLEScanFailed extends Error {
  constructor(
    message = 'Error occurred when trying to scan for a BLE sensor',
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'BLEScanFailed';
  }
}

export class BLEConnectionError extends Error {
  constructor(message = 'Could not connect to the sensor', options?: ErrorOptions) {
    super(message, options);
    this.name = 'BLEConnectionError';
  }
}

export class BLEAlreadyConnectedError extends Error {
  constructor(message = 'Device already connected', options?: ErrorOptions) {
    super(message, options);
    this.name = 'BLEAlreadyConnectedError';
  }
}

export class DeviceNotConnected extends Error {
  constructor(message = 'No device connected', options?: ErrorOptions) {
    super(message, options);
    this.name = 'DeviceNotConnected';
  }
}

export class MeasurementNotFound extends Error {
  constructor(
    message = 'Requested measurement does not belong to this device',
    options?: ErrorOptions,
  ) {
    super(message, options);
    this.name = 'MeasurementNotFound';
  }
}

export class InvalidParameter extends Error {
  constructor(message = 'An invalid parameter was passed in', options?: ErrorOptions) {
    super(message, options);
    this.name = 'InvalidParameter';
  }
}

export class SensorNotFound extends Error {
  constructor(message = 'The device does not have this sensor', options?: ErrorOptions) {
    super(message, options);
    this.name = 'SensorNotFound';
  }
}

export class InvalidEquation extends Error {
  constructor(message = 'Could not calculate the measurement', options?: ErrorOptions) {
    super(message, options);
    this.name = 'InvalidEquation';
  }
}

export class CouldNotDecodeData extends Error {
  constructor(message = 'Could not decode the raw data from the sensor', options?: ErrorOptions) {
    super(message, options);
    this.name = 'CouldNotDecodeData';
  }
}

export class CommunicationError extends Error {
  constructor(message = 'Error sending or receiving data from the sensor', options?: ErrorOptions) {
    super(message, options);
    this.name = 'CommunicationError';
  }
}

export class SensorSetupError extends Error {
  constructor(message = 'Error setting the sensor parameters up', options?: ErrorOptions) {
    super(message, options);
    this.name = 'SensorSetupError';
  }
}
