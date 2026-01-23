/**
 * Error classes for PASCO BLE operations
 */

export class BLEScanFailed extends Error {
  constructor(message = 'Error occurred when trying to scan for a BLE sensor') {
    super(message);
    this.name = 'BLEScanFailed';
  }
}

export class BLEConnectionError extends Error {
  constructor(message = 'Could not connect to the sensor') {
    super(message);
    this.name = 'BLEConnectionError';
  }
}

export class BLEAlreadyConnectedError extends Error {
  constructor(message = 'Device already connected') {
    super(message);
    this.name = 'BLEAlreadyConnectedError';
  }
}

export class DeviceNotConnected extends Error {
  constructor(message = 'No device connected') {
    super(message);
    this.name = 'DeviceNotConnected';
  }
}

export class MeasurementNotFound extends Error {
  constructor(message = 'Requested measurement does not belong to this device') {
    super(message);
    this.name = 'MeasurementNotFound';
  }
}

export class InvalidParameter extends Error {
  constructor(message = 'An invalid parameter was passed in') {
    super(message);
    this.name = 'InvalidParameter';
  }
}

export class SensorNotFound extends Error {
  constructor(message = 'The device does not have this sensor') {
    super(message);
    this.name = 'SensorNotFound';
  }
}

export class InvalidEquation extends Error {
  constructor(message = 'Could not calculate the measurement') {
    super(message);
    this.name = 'InvalidEquation';
  }
}

export class CouldNotDecodeData extends Error {
  constructor(message = 'Could not decode the raw data from the sensor') {
    super(message);
    this.name = 'CouldNotDecodeData';
  }
}

export class CommunicationError extends Error {
  constructor(message = 'Error sending or receiving data from the sensor') {
    super(message);
    this.name = 'CommunicationError';
  }
}

export class SensorSetupError extends Error {
  constructor(message = 'Error setting the sensor parameters up') {
    super(message);
    this.name = 'SensorSetupError';
  }
}
