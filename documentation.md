# Technical Documentation

### A detailed description of how the PASCO BLE library works

## Contents

- [Architecture Overview](#architecture-overview)
- [BLE Communication](#ble-communication)
- [Device Initialization](#device-initialization)
- [Data Decoding Pipeline](#data-decoding-pipeline)
- [Platform Adapters](#platform-adapters)
- [Control Node Specifics](#control-node-specifics)

---

## Architecture Overview

The PASCO BLE library provides a TypeScript interface for communicating with PASCO wireless sensors over Bluetooth Low Energy (BLE). The library is designed to work in both Node.js and browser environments through a platform abstraction layer.

### Library Layers

```
┌─────────────────────────────────────────────────────────────┐
│                      User Application                        │
├─────────────────────────────────────────────────────────────┤
│   PascoBot          CodeNodeDevice      ControlNodeDevice   │
│   (robotics)        (LED/sound)         (motors/servos)     │
├─────────────────────────────────────────────────────────────┤
│                      PASCOBLEDevice                          │
│              (base class: connection, data reading)          │
├─────────────────────────────────────────────────────────────┤
│              BLE Adapter Abstraction Layer                   │
│         (BLEAdapterBase / BLEClientBase)                    │
├───────────────────────┬─────────────────────────────────────┤
│   WebBluetoothAdapter │         NobleAdapter                │
│   (Browser)           │         (Node.js)                   │
└───────────────────────┴─────────────────────────────────────┘
```

### Module Structure

```
src/
├── index.ts                 # Public API exports
├── pasco-ble-device.ts      # Base device class
├── code-node-device.ts      # Code.Node controls
├── control-node-device.ts   # Control.Node controls
├── pasco-bot.ts             # Robotics interface
├── character-library.ts     # LED matrix characters/icons
├── datasheets.ts            # Sensor definitions
├── ble/
│   ├── ble-adapter.ts       # Abstract BLE interface
│   ├── web-bluetooth-adapter.ts  # Browser implementation
│   ├── noble-adapter.ts     # Node.js implementation
│   └── index.ts             # Platform detection
├── types/
│   ├── ble.ts               # BLE type definitions
│   ├── measurement.ts       # Measurement types
│   └── device.ts            # Device/sensor types
└── utils/
    ├── binary.ts            # Binary data utilities
    ├── math.ts              # Mathematical functions
    └── equation-parser.ts   # Safe equation evaluation
```

### Device Hierarchy

PASCO devices have three conceptual layers:

1. **Interface**: The physical device (e.g., Control Node, Temperature Sensor)
2. **Sensors**: Components within the device that provide data channels
3. **Measurements**: Individual data points from each sensor

**Example**: Wireless Weather Sensor
- Interface ID: 1036
- Sensors: WirelessWeatherSensor, WirelessGPSSensor, WirelessLightSensor, WirelessCompass
- Measurements: Temperature, RelativeHumidity, Latitude, UVIndex, WindDirection, etc.

---

## BLE Communication

### PASCO UUID Structure

PASCO devices use custom BLE UUIDs with this format:
```
4a5c000{serviceId}-000{charId}-0000-0000-5c1e741f1c00
```

- **Service ID (0-9)**: Identifies the sensor channel
  - Service 0: Main device commands
  - Services 1+: Individual sensor channels
- **Characteristic ID (2, 3, 5)**:
  - Char 2 (`SEND_CMD_CHAR_ID`): Send commands to device
  - Char 3 (`RECV_CMD_CHAR_ID`): Receive responses/notifications
  - Char 5 (`SEND_ACK_CHAR_ID`): Send acknowledgments

### Communication Flow

```
┌──────────┐                           ┌──────────────┐
│ Computer │                           │ PASCO Device │
└────┬─────┘                           └──────┬───────┘
     │                                        │
     │  1. Write command to Char 2            │
     │ ─────────────────────────────────────> │
     │                                        │
     │  2. Device sends notification on Char 3│
     │ <───────────────────────────────────── │
     │                                        │
     │  3. Send ACK on Char 5 (if needed)     │
     │ ─────────────────────────────────────> │
     │                                        │
```

### Command Protocol

**Request Format:**
```typescript
[COMMAND_ID, ...parameters]
```

**Response Format:**
```typescript
[0xC0, status, originalCommand, ...data]  // Generic response
[packetNum, ...data]                       // Measurement data (packetNum <= 0x1F)
```

### Key Commands

| Command | ID | Purpose |
|---------|-----|---------|
| `GCMD_READ_ONE_SAMPLE` | 0x05 | Read single measurement |
| `GCMD_CUSTOM_CMD` | 0x37 | Custom/device-specific command |
| `GCMD_XFER_BURST_RAM` | 0x0E | Burst RAM transfer |

### Synchronization with writeAwaitCallback

BLE communication is asynchronous. The `writeAwaitCallback()` method ensures proper synchronization:

```typescript
async writeAwaitCallback(serviceId: number, command: number[]): Promise<void> {
  // 1. Set up promise to wait for callback
  const callbackPromise = new Promise((resolve, reject) => {
    this._callbackResolve = resolve;
    this._callbackReject = reject;
  });

  // 2. Write command to device
  await this.write(serviceId, command);

  // 3. Wait for notification callback
  await callbackPromise;
}
```

When a notification arrives, `_notifyCallback()` resolves the promise, allowing execution to continue.

---

## Device Initialization

### Connection Sequence

```typescript
// 1. Create device and scan
const device = new PASCOBLEDevice();
const found = await device.scan();

// 2. Connect to device
await device.connect(found[0]);

// Internally:
// - Establish GATT connection
// - Discover services and characteristics
// - Start notifications on all channels
// - Parse device name to extract interface ID
// - Load interface definition from datasheets
// - Initialize sensors and measurements
```

### Device Name Parsing

PASCO device names follow this format:
```
{DeviceType} {SerialId}-{InterfaceId}
```

Example: `Temperature 055-808-1025`
- Device Type: Temperature
- Serial ID: 055-808
- Interface ID: 1025

### Datasheet Lookup

The `datasheets.ts` file contains definitions for all PASCO interfaces and sensors:

```typescript
interface ParsedInterface {
  ID: number;
  channels: InterfaceChannel[];
}

interface ParsedSensor {
  ID: number;
  Tag: string;
  measurements: Measurement[];
}
```

During initialization:
1. Look up interface by ID
2. For each channel, look up sensor definition
3. Build measurement lookup tables

---

## Data Decoding Pipeline

When sensor data is received, it goes through a multi-stage decoding process:

```
Raw BLE Bytes
      │
      ▼
┌─────────────────┐
│ Build byte value│  Little-endian assembly
│ from data stack │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Apply base type │  RawDigital, Direct, Constant
│ conversion      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Apply derived   │  LinearConv, FactoryCal, Derivative,
│ calculations    │  ThreeInputVector, RotaryPos, etc.
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Apply equation  │  table(), usound(), dewpoint(),
│ (if present)    │  windchill(), heatindex(), custom
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ Apply precision │  Round to specified decimal places
│ and limits      │
└────────┬────────┘
         │
         ▼
   Final Value
```

### Measurement Types

| Type | Description |
|------|-------------|
| `RawDigital` | Raw sensor value, optionally two's complement |
| `Direct` | Direct conversion with binary fraction |
| `Constant` | Fixed predefined value |
| `LinearConv` | Linear transformation: `y = m*x + b` |
| `FactoryCal` | 4-parameter factory calibration |
| `UserCal` | 4-parameter user calibration |
| `ThreeInputVector` | Vector magnitude: `√(x² + y² + z²)` |
| `Derivative` | Rate of change from previous value |
| `RotaryPos` | Accumulated rotary position |
| `Select` | Pass-through from input measurement |

### Equation Evaluation

The library uses the `expr-eval` library for safe equation evaluation (avoiding `eval()`):

```typescript
// Example equation from datasheet
"table((880*[1])+336.9,7122,45,14100,20,17245,15,51725,0)"

// Parsed and evaluated:
// 1. Replace [1] with measurement ID 1's value
// 2. Evaluate inner expression
// 3. Look up result in interpolation table
```

Supported functions: `sqrt`, `log`, `sin`, `cos`, `tan`, `abs`, `pow`, `exp`, `floor`, `ceil`, `round`, plus custom functions like `dewpoint()`, `windchill()`, `heatindex()`, `usound()`.

---

## Platform Adapters

### BLE Adapter Interface

```typescript
abstract class BLEAdapterBase {
  abstract scan(nameFilters?: string[], timeout?: number): Promise<BLEDevice[]>;
  abstract stopScan(): Promise<void>;
  abstract createClient(device: BLEDevice): BLEClientBase;
  abstract isAvailable(): boolean;
}

abstract class BLEClientBase {
  abstract connect(): Promise<void>;
  abstract disconnect(): Promise<void>;
  abstract writeGattChar(uuid: string, data: Uint8Array): Promise<void>;
  abstract readGattChar(uuid: string): Promise<Uint8Array>;
  abstract startNotify(uuid: string, callback: NotifyCallback): Promise<void>;
  abstract stopNotify(uuid: string): Promise<void>;
  abstract discoverServicesAndCharacteristics(): Promise<void>;
}
```

### Web Bluetooth Adapter (Browser)

- Uses `navigator.bluetooth.requestDevice()` for scanning
- Shows browser device picker dialog
- Requires HTTPS context
- Requires user gesture to initiate scan/connect
- Limited to Chrome and Edge browsers

### Noble Adapter (Node.js)

- Uses `@abandonware/noble` package
- Passive scanning with name filters
- Works on Windows, macOS, and Linux
- Requires platform-specific Bluetooth setup

### Platform Detection

```typescript
function createBLEAdapter(): BLEAdapterBase {
  if (Platform.isBrowser() && Platform.hasWebBluetooth()) {
    return new WebBluetoothAdapter();
  } else if (Platform.isNode()) {
    return new NobleAdapter();
  }
  throw new Error('No BLE adapter available');
}
```

---

## Control Node Specifics

### Port-Based Measurement Reading

The Control Node supports multiple sensors on different ports (A, B, Sensor). The `readData()` method is overridden to handle port-specific readings:

```typescript
// Read angle from stepper on port A
const angleA = await controlNode.readData('Angle', 'A');

// Read angle from stepper on port B
const angleB = await controlNode.readData('Angle', 'B');
```

### Plugin Sensor Detection

When sensors are plugged into the Control Node, it sends a callback with updated sensor information:

```typescript
// Callback format: [0x82, sensorIdA_lo, sensorIdA_hi, sensorIdB_lo, sensorIdB_hi, ...]
```

The `update_controlnode_plugin_sensor()` method processes this and reinitializes the sensor list.

### Stepper Motor Commands

Stepper commands use this format:
```typescript
[0x37, 0x04, channel,
 speedA_lo, speedA_hi, accelA_lo, accelA_hi, distA_0, distA_1, distA_2, distA_3,
 speedB_lo, speedB_hi, accelB_lo, accelB_hi, distB_0, distB_1, distB_2, distB_3]
```

- Speed: deci-steps per second (960 steps = 360 degrees)
- Acceleration: deci-steps per second squared
- Distance: deci-steps (0 = continuous rotation)

### Servo PWM Calculation

```typescript
// Standard servo: angle (-90 to 90) → PWM on-time
onTime = angle + 150;  // microseconds

// Continuous servo: speed (-100 to 100) → PWM on-time
onTime = 0.2 * speed + 150;  // microseconds
```

---

## Utility Functions

### Binary Utilities (`utils/binary.ts`)

| Function | Purpose |
|----------|---------|
| `decode64(char)` | PASCO-specific Base-64 decoding |
| `twosComplement(value, byteLen)` | Two's complement conversion |
| `binaryFraction(value)` | Fixed-point fraction conversion |
| `binaryFloat(value, byteLen)` | IEEE 754 float conversion |
| `unpackFloat32LE(data)` | Little-endian float unpacking |
| `packInt16LE(value)` | Little-endian int packing |

### Math Utilities (`utils/math.ts`)

| Function | Purpose |
|----------|---------|
| `linearInterpolate(x, points)` | Linear interpolation |
| `calc4Params(raw, x1, y1, x2, y2)` | 4-parameter calibration |
| `calcLinearParams(raw, m, b)` | Linear conversion |
| `calcRotaryPos(count, x, r)` | Rotary position |
| `threeInputVector(x, y, z)` | 3D vector magnitude |
| `dewpoint(temp, humidity)` | Dew point calculation |
| `windchill(temp, wind)` | Wind chill calculation |
| `heatindex(temp, humidity)` | Heat index calculation |

---

## Error Handling

The library defines specific error classes for different failure modes:

| Error | Cause |
|-------|-------|
| `BLEScanFailed` | Bluetooth scan failed |
| `BLEConnectionError` | Connection to device failed |
| `BLEAlreadyConnectedError` | Attempted to connect when already connected |
| `DeviceNotConnected` | Operation attempted without connection |
| `MeasurementNotFound` | Requested measurement doesn't exist |
| `InvalidParameter` | Invalid parameter passed to method |
| `SensorNotFound` | Requested sensor doesn't exist |
| `InvalidEquation` | Equation evaluation failed |
| `CouldNotDecodeData` | Data decoding failed |
| `CommunicationError` | BLE communication failed |
| `SensorSetupError` | Sensor initialization failed |
