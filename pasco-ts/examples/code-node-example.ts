/**
 * PASCO Code.Node Example
 *
 * This example demonstrates how to use the Code.Node's:
 * 1. LED matrix display
 * 2. RGB LED
 * 3. Speaker
 */

import { CodeNodeDevice, Icons } from '../src/index.js';

async function main() {
  const codeNode = new CodeNodeDevice();

  console.log('Scanning for Code.Node devices...');

  try {
    // Scan specifically for Code.Node
    const devices = await codeNode.scan('//code.Node');

    if (devices.length === 0) {
      console.log('No Code.Node devices found');
      return;
    }

    const device = devices[0];
    if (!device) {
      console.log('No device selected');
      return;
    }

    console.log(`Connecting to ${device.name}...`);
    await codeNode.connect(device);
    console.log('Connected!');

    // Show a smile icon
    console.log('\nShowing smile icon...');
    await codeNode.showImageInArray(Icons.smile);
    await delay(1000);

    // Show a heart icon
    console.log('Showing heart icon...');
    await codeNode.showImageInArray(Icons.heart);
    await delay(1000);

    // Scroll some text
    console.log('Scrolling text...');
    await codeNode.scrollTextInArray('PASCO', 150);
    await delay(500);

    // Set RGB LED to different colors
    console.log('\nCycling RGB LED colors...');
    await codeNode.setRgbLed(255, 0, 0); // Red
    await delay(500);
    await codeNode.setRgbLed(0, 255, 0); // Green
    await delay(500);
    await codeNode.setRgbLed(0, 0, 255); // Blue
    await delay(500);

    // Play some tones
    console.log('\nPlaying tones...');
    await codeNode.setSoundFrequency(440); // A4
    await delay(300);
    await codeNode.setSoundFrequency(523); // C5
    await delay(300);
    await codeNode.setSoundFrequency(659); // E5
    await delay(300);

    // Reset everything
    console.log('\nResetting...');
    await codeNode.reset();

    // Disconnect
    console.log('Disconnecting...');
    await codeNode.disconnect();
    console.log('Done!');
  } catch (error) {
    console.error('Error:', error);
    if (codeNode.isConnected()) {
      await codeNode.disconnect();
    }
  }
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

main().catch(console.error);
