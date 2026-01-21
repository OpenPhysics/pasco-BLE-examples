/**
 * PASCO Control.Node Example
 *
 * This example demonstrates how to use the Control.Node's:
 * 1. Stepper motor control
 * 2. Servo motor control
 * 3. Reading sensor data from plugin ports
 */

import { ControlNodeDevice } from '../src/index.js';

async function main() {
  const controlNode = new ControlNodeDevice();

  console.log('Scanning for Control.Node devices...');

  try {
    // Scan specifically for Control.Node
    const devices = await controlNode.scan('//control.Node');

    if (devices.length === 0) {
      console.log('No Control.Node devices found');
      return;
    }

    const device = devices[0];
    if (!device) {
      console.log('No device selected');
      return;
    }

    console.log(`Connecting to ${device.name}...`);
    await controlNode.connect(device);
    console.log('Connected!');

    // Get available measurements (depends on what's plugged in)
    const measurements = controlNode.getMeasurementList();
    console.log(`\nAvailable measurements: ${measurements.join(', ')}`);

    // ========================================
    // Stepper Motor Examples
    // ========================================

    console.log('\n--- Stepper Motor Control ---');

    // Rotate both steppers continuously
    console.log('Rotating both steppers at 180 deg/s...');
    await controlNode.rotateSteppersContinuously(180, 360, 180, 360);
    await delay(2000);

    // Stop steppers
    console.log('Stopping steppers...');
    await controlNode.stopSteppers(360, 360);
    await delay(500);

    // Rotate through a specific angle
    console.log('Rotating stepper A through 360 degrees...');
    await controlNode.rotateStepperThrough('A', 360, 360, 360, true);

    // Read stepper position
    try {
      const angleA = await controlNode.readData('Angle', 'A');
      console.log(`Stepper A angle: ${angleA} degrees`);
    } catch {
      console.log('(Stepper position not available)');
    }

    // ========================================
    // Servo Motor Examples
    // ========================================

    console.log('\n--- Servo Motor Control ---');

    // Standard servo - move to different angles
    console.log('Moving servo 1 to 0 degrees...');
    await controlNode.setServo(1, 'standard', 0);
    await delay(1000);

    console.log('Moving servo 1 to 45 degrees...');
    await controlNode.setServo(1, 'standard', 45);
    await delay(1000);

    console.log('Moving servo 1 to -45 degrees...');
    await controlNode.setServo(1, 'standard', -45);
    await delay(1000);

    // Return to center
    console.log('Returning servo 1 to center...');
    await controlNode.setServo(1, 'standard', 0);
    await delay(500);

    // ========================================
    // Speaker Example
    // ========================================

    console.log('\n--- Speaker Control ---');

    console.log('Playing tone at 440 Hz...');
    await controlNode.setSoundFrequency(440);
    await delay(500);

    console.log('Playing tone at 880 Hz...');
    await controlNode.setSoundFrequency(880);
    await delay(500);

    // Turn off speaker
    await controlNode.setSoundFrequency(0);

    // ========================================
    // Sensor Reading Examples
    // ========================================

    console.log('\n--- Sensor Readings ---');

    // Read built-in accelerometer
    if (measurements.includes('AccelerationX')) {
      const accelX = await controlNode.readData('AccelerationX');
      const accelY = await controlNode.readData('AccelerationY');
      const accelZ = await controlNode.readData('AccelerationZ');
      console.log(`Acceleration: X=${accelX}, Y=${accelY}, Z=${accelZ}`);
    }

    // If a distance sensor is plugged in
    if (measurements.includes('Distance')) {
      const distance = await controlNode.readData('Distance');
      console.log(`Distance: ${distance} cm`);
    }

    // Reset everything
    console.log('\nResetting...');
    await controlNode.reset();

    // Disconnect
    console.log('Disconnecting...');
    await controlNode.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    if (controlNode.isConnected()) {
      await controlNode.disconnect();
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch(console.error);
