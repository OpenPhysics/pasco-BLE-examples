# PASCO BLE Library for TypeScript

A TypeScript library for connecting to and communicating with PASCO wireless BLE sensors.

## Installation

```bash
npm install pasco-ble
```

## Platform Support

This library supports both Node.js and browser environments:

- **Node.js**: Uses the Noble BLE library (`@abandonware/noble`)
- **Browser**: Uses the Web Bluetooth API (Chrome/Edge only, requires HTTPS)

### Node.js Setup

```bash
npm install @abandonware/noble
```

Note: Noble has platform-specific requirements. See the [Noble documentation](https://github.com/abandonware/noble#readme) for setup instructions.

### Browser Setup

No additional setup required. Web Bluetooth API is built into Chrome and Edge browsers.

## Quick Start

```typescript
import { PASCOBLEDevice } from 'pasco-ble';

async function main() {
  // Create device instance
  const sensor = new PASCOBLEDevice();

  // Scan for devices
  const devices = await sensor.scan();
  console.log(`Found ${devices.length} device(s)`);

  // Connect to first device
  if (devices[0]) {
    await sensor.connect(devices[0]);

    // Read temperature
    const temp = await sensor.readData('Temperature');
    console.log(`Temperature: ${temp}`);

    // Disconnect
    await sensor.disconnect();
  }
}

main();
```

## Supported Devices

- //code.Node
- //control.Node
- Accel Alt
- CO2
- Conductivity
- Current
- Diffraction
- Drop Counter
- Force Accel
- Light
- Load Cell
- Mag Field
- Motion
- O2
- Optical DO
- pH
- Pressure
- Rotary Motion
- Smart Cart
- Temperature
- Voltage
- Weather

## API Reference

### PASCOBLEDevice

Base class for all PASCO BLE devices.

```typescript
class PASCOBLEDevice {
  // Scanning
  scan(filter?: string): Promise<BLEDevice[]>;

  // Connection
  connect(device: BLEDevice): Promise<void>;
  connectById(pascoDeviceId: string): Promise<void>;
  disconnect(): Promise<void>;
  isConnected(): boolean;

  // Device info
  get name(): string | null;
  get serialId(): string | null;
  get address(): string | null;

  // Sensors & Measurements
  getSensorList(): string[];
  getMeasurementList(sensorName?: string): string[];
  getMeasurementUnit(measurement: string): string | null;
  getMeasurementUnitList(measurements: string[]): Record<string, string | null>;

  // Reading data
  readData(measurement: string): Promise<number | null>;
  readDataList(measurements: string[]): Promise<Record<string, number | null>>;
}
```

### CodeNodeDevice

Extends PASCOBLEDevice with LED and sound control for the //code.Node.

```typescript
class CodeNodeDevice extends PASCOBLEDevice {
  // LED Matrix (5x5)
  setLedInArray(x: number, y: number, intensity?: number): Promise<void>;
  setLedsInArray(xyList: [number, number][], intensity?: number): Promise<void>;
  scrollTextInArray(text: string | number, delayMs?: number): Promise<void>;
  showImageInArray(icon: CharacterMatrix): Promise<void>;

  // RGB LED
  setRgbLed(red: number, green: number, blue: number): Promise<void>;

  // Speaker
  setSoundFrequency(frequency: number): Promise<void>;

  // Reset
  reset(): Promise<void>;
}
```

### ControlNodeDevice

Extends PASCOBLEDevice with motor control for the //control.Node.

```typescript
class ControlNodeDevice extends PASCOBLEDevice {
  // Stepper Motors
  rotateSteppersContinuously(
    speedA: number | null,
    accelerationA: number | null,
    speedB: number | null,
    accelerationB: number | null
  ): Promise<void>;

  rotateSteppersThrough(
    speedA: number | null,
    accelerationA: number | null,
    distanceA: number | null,
    speedB: number | null,
    accelerationB: number | null,
    distanceB: number | null,
    awaitCompletion?: boolean
  ): Promise<void>;

  stopSteppers(accelerationA: number | null, accelerationB: number | null): Promise<void>;

  // Servos
  setServo(port: 1 | 2, type: 'standard' | 'continuous', value: number): Promise<void>;
  setServos(
    ch1Type: ServoType,
    ch1Value: number,
    ch2Type: ServoType,
    ch2Value: number
  ): Promise<void>;

  // Power Output
  setPowerOut(
    port: 'A' | 'B',
    channel: 1 | 2,
    outputType: 'USB' | 'terminal',
    value: number
  ): Promise<void>;

  // Speaker
  setSoundFrequency(frequency: number): Promise<void>;

  // Reset
  reset(): Promise<void>;
}
```

### PascoBot

High-level robotics interface for wheeled robot control.

```typescript
class PascoBot extends ControlNodeDevice {
  drive(speed: number, acceleration: number): Promise<void>;
  turn(angle: number, velocity?: number): Promise<void>;
  turnContinuous(angularVelocity: number): Promise<void>;
  stop(acceleration?: number): Promise<void>;
}
```

## Icons

The library includes predefined icons for the LED matrix:

```typescript
import { Icons } from 'pasco-ble';

await codeNode.showImageInArray(Icons.smile);
await codeNode.showImageInArray(Icons.heart);
await codeNode.showImageInArray(Icons.star);
// ... and more
```

## Examples

See the `examples/` directory for complete usage examples:

- `basic-usage.ts` - Basic sensor reading
- `code-node-example.ts` - Code.Node LED and sound control
- `control-node-example.ts` - Control.Node motor and servo control
- `pasco-bot-example.ts` - PascoBot robotics interface
- `force-sensor.html` - Browser-based force sensor demo

## Building from Source

```bash
# Install dependencies
npm install

# Build
npm run build
```

## License

See LICENSE file.
