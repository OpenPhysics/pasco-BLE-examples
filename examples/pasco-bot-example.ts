/**
 * PASCO Bot Example
 *
 * This example demonstrates how to use the PascoBot for:
 * 1. Driving forward/backward
 * 2. Turning by angle
 * 3. Continuous turning
 * 4. Reading sensors (if connected)
 *
 * Prerequisites:
 * - Control.Node with stepper motors connected to ports A and B
 * - Wheels attached forming a differential drive robot
 */

import { PascoBot } from '../src/index.js';

async function main() {
  const bot = new PascoBot();

  console.log('Scanning for Control.Node devices...');

  try {
    // Scan for Control.Node (PascoBot uses Control.Node)
    const devices = await bot.scan('//control.Node');

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
    await bot.connect(device);
    console.log('Connected!');

    // ========================================
    // Basic Movement
    // ========================================

    console.log('\n--- Basic Movement ---');

    // Drive forward at 5 cm/s
    console.log('Driving forward at 5 cm/s...');
    await bot.drive(5, 10); // speed: 5 cm/s, acceleration: 10 cm/s²
    await delay(2000);

    // Stop
    console.log('Stopping...');
    await bot.stop();
    await delay(500);

    // Drive backward at 5 cm/s
    console.log('Driving backward at 5 cm/s...');
    await bot.drive(-5, 10);
    await delay(2000);

    // Stop
    console.log('Stopping...');
    await bot.stop();
    await delay(500);

    // ========================================
    // Turning
    // ========================================

    console.log('\n--- Turning ---');

    // Turn 90 degrees to the right
    console.log('Turning 90 degrees right...');
    await bot.turn(90, 180); // 90 degrees at 180 deg/s
    await delay(500);

    // Turn 90 degrees to the left
    console.log('Turning 90 degrees left...');
    await bot.turn(-90, 180);
    await delay(500);

    // Turn 180 degrees
    console.log('Turning 180 degrees...');
    await bot.turn(180, 180);
    await delay(500);

    // ========================================
    // Continuous Turning
    // ========================================

    console.log('\n--- Continuous Turning ---');

    // Spin clockwise
    console.log('Spinning clockwise at 45 deg/s...');
    await bot.turnContinuous(45);
    await delay(2000);

    // Stop spinning
    console.log('Stopping...');
    await bot.stop();
    await delay(500);

    // Spin counter-clockwise
    console.log('Spinning counter-clockwise at 45 deg/s...');
    await bot.turnContinuous(-45);
    await delay(2000);

    // Stop
    await bot.stop();

    // ========================================
    // Square Pattern
    // ========================================

    console.log('\n--- Drawing a Square ---');

    for (let i = 0; i < 4; i++) {
      console.log(`Side ${i + 1}: driving forward...`);
      await bot.drive(10, 20);
      await delay(1500);
      await bot.stop();

      console.log(`Corner ${i + 1}: turning 90 degrees...`);
      await bot.turn(90, 180);
      await delay(200);
    }

    console.log('Square complete!');

    // ========================================
    // Sensor-Based Control (if distance sensor connected)
    // ========================================

    const measurements = bot.getMeasurementList();
    if (measurements.includes('Distance')) {
      console.log('\n--- Distance-Based Control ---');

      // Drive forward slowly, checking distance
      console.log('Driving forward until obstacle detected...');
      await bot.drive(3, 10);

      for (let i = 0; i < 50; i++) {
        const distance = await bot.readData('Distance');
        console.log(`Distance: ${distance} cm`);

        if (distance !== null && distance < 20) {
          console.log('Obstacle detected! Stopping...');
          await bot.stop();
          break;
        }
        await delay(100);
      }
    }

    // Reset and disconnect
    console.log('\nResetting...');
    await bot.reset();

    console.log('Disconnecting...');
    await bot.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    if (bot.isConnected()) {
      await bot.disconnect();
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch(console.error);
