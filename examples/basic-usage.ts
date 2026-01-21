/**
 * PASCO BLE Basic Usage Example
 *
 * This example demonstrates how to:
 * 1. Scan for PASCO BLE devices
 * 2. Connect to a device
 * 3. Read sensor measurements
 * 4. Disconnect
 */

import { PASCOBLEDevice } from '../src/index.js';

async function main() {
  // Create a new PASCO BLE device instance
  const sensor = new PASCOBLEDevice();

  console.log('Scanning for PASCO devices...');

  try {
    // Scan for available devices
    const devices = await sensor.scan();

    if (devices.length === 0) {
      console.log('No devices found');
      return;
    }

    console.log(`Found ${devices.length} device(s):`);
    devices.forEach((device, index) => {
      console.log(`  ${index}: ${device.name}`);
    });

    // Connect to the first device found
    const selectedDevice = devices[0];
    if (!selectedDevice) {
      console.log('No device selected');
      return;
    }

    console.log(`\nConnecting to ${selectedDevice.name}...`);
    await sensor.connect(selectedDevice);
    console.log('Connected!');

    // Get available measurements
    const measurements = sensor.getMeasurementList();
    console.log(`\nAvailable measurements: ${measurements.join(', ')}`);

    // Read some measurements
    console.log('\nReading measurements...');
    for (const measurement of measurements) {
      try {
        const value = await sensor.readData(measurement);
        const unit = sensor.getMeasurementUnit(measurement);
        console.log(`  ${measurement}: ${value} ${unit ?? ''}`);
      } catch (_error) {
        console.log(`  ${measurement}: Error reading`);
      }
    }

    // Disconnect
    console.log('\nDisconnecting...');
    await sensor.disconnect();
    console.log('Disconnected');
  } catch (error) {
    console.error('Error:', error);
    // Make sure to disconnect on error
    if (sensor.isConnected()) {
      await sensor.disconnect();
    }
  }
}

// Run the example
main().catch(console.error);
