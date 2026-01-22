[![TypeScript](https://img.shields.io/badge/typescript-5.3+-blue)](https://www.npmjs.com/package/pasco-ble)
[![Platform](https://img.shields.io/badge/platform-node.js%20%7C%20browser-lightgrey)](https://www.npmjs.com/package/pasco-ble)

# PASCO BLE Library

The official TypeScript/JavaScript library for connecting to PASCO Wireless sensors. Create your own data collection applications, integrate sensors with other hardware, or build unique solutions for science education!

## Contents

- [Getting Started](#getting-started)
- [Compatible Sensors](#compatible-sensors)
- [Quick Start](#quick-start)
- [API Reference](#api-reference)
- [//code.Node](#codenode)
- [//control.Node](#controlnode)
- [PascoBot](#pascobot)
- [Browser Usage](#browser-usage)
- [Examples](#examples)
- [Troubleshooting](#troubleshooting)

## Getting Started

### Installation

```bash
npm install pasco-ble
```

No additional setup required. The library uses the Web Bluetooth API built into Chrome and Edge browsers. **HTTPS is required for Web Bluetooth.**

## Compatible Sensors

- //control.Node
- //code.Node
- Smart Cart
- Wireless Acceleration Altimeter
- Wireless CO2
- Wireless Conductivity
- Wireless Current
- Wireless Diffraction
- Wireless Drop Counter
- Wireless Force Acceleration
- Wireless Light
- Wireless Load Cell
- Wireless Magnetic Field
- Wireless Motion
- Wireless O2
- Wireless Optical DO
- Wireless pH
- Wireless Pressure
- Wireless Rotary Motion
- Wireless Temperature
- Wireless Voltage
- Wireless Weather

## Quick Start

### Basic Sensor Reading

```typescript
import { PASCOBLEDevice } from 'pasco-ble';

async function main() {
  const sensor = new PASCOBLEDevice();

  // Connect by device ID (printed on sensor)
  await sensor.connectById('055-808');

  // Read temperature
  const temp = await sensor.readData('Temperature');
  const units = sensor.getMeasurementUnit('Temperature');
  console.log(`${temp} ${units}`);

  await sensor.disconnect();
}

main();
```

### Scan and Select Device

```typescript
import { PASCOBLEDevice } from 'pasco-ble';

async function main() {
  const sensor = new PASCOBLEDevice();

  // Scan for devices
  const devices = await sensor.scan();

  if (devices.length === 0) {
    console.log('No devices found');
    return;
  }

  console.log('Devices found:');
  devices.forEach((d, i) => console.log(`${i}: ${d.name}`));

  // Connect to first device
  await sensor.connect(devices[0]);

  // Get available measurements
  const measurements = sensor.getMeasurementList();
  console.log('Available measurements:', measurements);

  // Read data continuously
  for (let i = 0; i < 10; i++) {
    const temp = await sensor.readData('Temperature');
    console.log(`Temperature: ${temp}`);
  }

  await sensor.disconnect();
}

main();
```

## API Reference

### Device Structure

- **Device**: A physical PASCO wireless sensor
- **Sensor**: A device can have multiple sensors built in
- **Measurements**: Each sensor can offer multiple measurements

**Example:** A Wireless Weather Sensor has 4 sensors:
- `WirelessWeatherSensor`: Temperature, RelativeHumidity, BarometricPressure, WindSpeed, DewPoint, etc.
- `WirelessGPSSensor`: Latitude, Longitude, Altitude, Speed
- `WirelessLightSensor`: UVIndex, Illuminance, SolarIrradiance
- `WirelessCompass`: WindDirection, MagneticHeading, TrueHeading

### PASCOBLEDevice

```typescript
import { PASCOBLEDevice } from 'pasco-ble';

const device = new PASCOBLEDevice();

// Scanning & Connection
await device.scan(filter?: string);           // Scan for devices (optional name filter)
await device.connect(bleDevice);              // Connect to a scanned device
await device.connectById('123-456');          // Connect by 6-digit device ID
await device.disconnect();                    // Disconnect from device
device.isConnected();                         // Check connection status

// Device Information
device.name;                                  // Device name
device.serialId;                              // Device serial ID
device.address;                               // BLE address

// Sensors & Measurements
device.getSensorList();                       // Get list of sensors
device.getMeasurementList(sensorName?);       // Get available measurements
device.getMeasurementUnit(measurement);       // Get unit for a measurement
device.getMeasurementUnitList(measurements);  // Get units for multiple measurements

// Reading Data
await device.readData(measurement);           // Read single measurement
await device.readDataList(measurements);      // Read multiple measurements
```

## //code.Node

The //code.Node features a 5x5 LED matrix, RGB LED, speaker, and various sensors.

```typescript
import { CodeNodeDevice, Icons } from 'pasco-ble';

const codeNode = new CodeNodeDevice();
await codeNode.connectById('481-782');

// 5x5 LED Matrix
await codeNode.setLedInArray(2, 2, 255);              // Set single LED (x, y, intensity)
await codeNode.setLedsInArray([[0,0], [1,1]], 128);   // Set multiple LEDs
await codeNode.scrollTextInArray('HELLO');            // Scroll text
await codeNode.showImageInArray(Icons.smile);         // Display icon

// RGB LED
await codeNode.setRgbLed(255, 0, 0);                  // Red

// Speaker
await codeNode.setSoundFrequency(440);                // 440 Hz tone
await codeNode.setSoundFrequency(0);                  // Turn off

// Reset all outputs
await codeNode.reset();

// Read sensors
const brightness = await codeNode.readData('Brightness');
const button = await codeNode.readData('Button1');
```

### LED Matrix Coordinates

```
| 0,0  1,0  2,0  3,0  4,0 |
| 0,1  1,1  2,1  3,1  4,1 |
| 0,2  1,2  2,2  3,2  4,2 |
| 0,3  1,3  2,3  3,3  4,3 |
| 0,4  1,4  2,4  3,4  4,4 |
```

### Available Icons

```typescript
import { Icons } from 'pasco-ble';

Icons.heart      Icons.heartSmall   Icons.smile
Icons.sad        Icons.surprise     Icons.star
Icons.arrowTop   Icons.arrowLeft    Icons.arrowBottom
Icons.arrowRight Icons.alien
```

## //control.Node

The //control.Node can control stepper motors, servos, and power outputs, plus connect to plugin sensors.

```typescript
import { ControlNodeDevice } from 'pasco-ble';

const controlNode = new ControlNodeDevice();
await controlNode.connectById('664-591');
```

### Stepper Motors

```typescript
// Rotate both steppers continuously (speed in deg/s, acceleration in deg/s²)
await controlNode.rotateSteppersContinuously(360, 360, 360, 360);

// Rotate single stepper continuously
await controlNode.rotateStepperContinuously('A', 360, 360);

// Rotate through a specific angle
await controlNode.rotateSteppersThrough(
  360, 360, 180,  // Speed A, Accel A, Distance A (degrees)
  360, 360, 180,  // Speed B, Accel B, Distance B (degrees)
  true            // Wait for completion
);

// Stop steppers
await controlNode.stopSteppers(360, 360);  // With deceleration

// Read stepper position
const angleA = await controlNode.readData('Angle', 'A');
const angleB = await controlNode.readData('Angle', 'B');
```

### Servos

```typescript
// Standard servo (angle: -90 to 90 degrees)
await controlNode.setServo(1, 'standard', 45);

// Continuous servo (speed: -100 to 100 percent)
await controlNode.setServo(2, 'continuous', 50);

// Control both servos
await controlNode.setServos('standard', 45, 'continuous', -50);

// Read servo current (for detecting resistance)
const current = await controlNode.readData('ServoCurrentOrd', 1);
```

### Power Output Board

```typescript
// USB output (on/off: 0 or 1)
await controlNode.setPowerOut('A', 1, 'USB', 1);

// Terminal output (PWM duty cycle: 0-100%)
await controlNode.setPowerOut('B', 2, 'terminal', 75);
```

### Greenhouse Light

```typescript
// Control red and blue LEDs (0-100%)
await controlNode.setGreenhouseLight('A', 50, 75);
```

### Speaker

```typescript
await controlNode.setSoundFrequency(440);  // 440 Hz
```

## PascoBot

High-level robotics interface for wheeled robots.

```typescript
import { PascoBot } from 'pasco-ble';

const bot = new PascoBot();
await bot.connectById('664-591');

// Drive forward (speed in cm/s, acceleration in cm/s²)
await bot.drive(10, 5);

// Turn (angle in degrees, velocity in deg/s)
await bot.turn(90, 180);

// Turn continuously (angular velocity in deg/s)
await bot.turnContinuous(45);

// Stop
await bot.stop();

await bot.disconnect();
```

## Browser Usage

The library works in browsers using the Web Bluetooth API:

```html
<!DOCTYPE html>
<html>
<head>
  <title>PASCO Sensor Demo</title>
</head>
<body>
  <button id="connect">Connect to Sensor</button>
  <div id="output"></div>

  <script type="module">
    import { PASCOBLEDevice } from 'https://unpkg.com/pasco-ble/dist/index.js';

    document.getElementById('connect').onclick = async () => {
      const sensor = new PASCOBLEDevice();

      // In browsers, scan() opens a device picker dialog
      const devices = await sensor.scan();

      if (devices.length > 0) {
        await sensor.connect(devices[0]);

        const temp = await sensor.readData('Temperature');
        document.getElementById('output').textContent = `Temperature: ${temp}`;

        await sensor.disconnect();
      }
    };
  </script>
</body>
</html>
```

> **Note:** Web Bluetooth requires HTTPS and a user gesture (button click) to initiate scanning/connecting.

## Examples

See the `examples/` directory for complete examples:

- `basic-usage.ts` - Basic sensor reading with Node.js
- `code-node-example.ts` - Code.Node LED and sound control
- `control-node-example.ts` - Control.Node motor and servo control
- `pasco-bot-example.ts` - PascoBot robotics interface
- `force-sensor.html` - Browser-based force sensor demo

For more project examples, see our [pasco_python_examples repository](https://github.com/PASCOscientific/pasco_python_examples).

## Troubleshooting

### 1. Node.js: Noble installation issues

Noble requires native compilation. On Windows, you may need:
```bash
npm install --global windows-build-tools
```

On Linux, you may need:
```bash
sudo apt-get install bluetooth bluez libbluetooth-dev libudev-dev
```

See [Noble documentation](https://github.com/abandonware/noble#prerequisites) for full details.

### 2. Browser: Web Bluetooth not working

- Ensure you're using Chrome or Edge
- Ensure the page is served over HTTPS (or localhost)
- Check that Bluetooth is enabled on your device
- The scan must be initiated by a user gesture (button click)

### 3. Device not found during scan

- Check if the device's red light is blinking (ready to connect)
- If the light is green, the device is already connected elsewhere
- Hold the power button to turn off, then press to turn on again

### 4. Connection drops or times out

- Move closer to the device
- Ensure no other application is connected to the device
- Try resetting the device (power off/on)

### 5. Cannot read measurement

- Use `getMeasurementList()` to see available measurements
- Measurement names are case-sensitive
- Some measurements require specific sensors to be connected

## License

See LICENSE file for details.
