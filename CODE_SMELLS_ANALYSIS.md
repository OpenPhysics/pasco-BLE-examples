# Code Smells Analysis & Refactoring Guide

**Analysis Date:** 2026-01-23
**Codebase:** PASCO BLE TypeScript Library
**Methodology:** Martin Fowler's Refactoring patterns + Clean Code principles

---

## Executive Summary

While the codebase demonstrates strong architecture and type safety, there are **15 identifiable code smells** that could be refactored for improved maintainability. Most are **Medium Priority** and represent opportunities for incremental improvement rather than critical issues.

**Total Smells Found:** 15
- 🔴 High Priority: 4
- 🟡 Medium Priority: 9
- 🟢 Low Priority: 2

---

## 1. Long Method 🔴 High Priority

### Smell: Methods exceeding 50 lines indicate too many responsibilities

#### 1.1 `_sendStepperCommand()` - 88 Lines

**Location:** `control-node-device.ts:188-275`

**Problem:**
- Does 6 different things: parameter validation, channel selection, multiplier calculation, unit conversion, limit application, and command building
- Hard to test individual concerns
- Difficult to understand flow

**Current Code:**
```typescript
protected async _sendStepperCommand(
  speedA: number | null,
  accelerationA: number | null,
  distanceA: number | 'continuous' | null,
  speedB: number | null,
  accelerationB: number | null,
  distanceB: number | 'continuous' | null,
): Promise<void> {
  // Determine which steppers to control (12 lines)
  let stepperChannel = ControlNodeDevice.BOTH_STEPPER_CHANNEL;
  let effSpeedA = speedA ?? 0;
  // ... more initialization ...

  // Calculate multipliers (17 lines)
  const mul: Record<number, number> = {};
  for (const sensor of this._deviceChannels) {
    // ...
  }

  // Convert units (15 lines)
  const stepsPerDeg = /* ... */;
  let speedAVal = effSpeedA * mulA * deciStepsPerDeg;
  // ...

  // Apply limits (7 lines)
  speedAVal = Math.round(limit(speedAVal, -19200, 19200));
  // ...

  // Build command (16 lines)
  const command = [
    PASCOBLEDevice.GCMD_CONTROL_NODE_CMD,
    // ... 13 more lines ...
  ];

  await this.writeAwaitCallback(PASCOBLEDevice.SENSOR_SERVICE_ID, command);
}
```

**Refactored Solution:**
```typescript
protected async _sendStepperCommand(
  speedA: number | null,
  accelerationA: number | null,
  distanceA: number | 'continuous' | null,
  speedB: number | null,
  accelerationB: number | null,
  distanceB: number | 'continuous' | null,
): Promise<void> {
  const params = this._normalizeStepperParameters(
    speedA, accelerationA, distanceA,
    speedB, accelerationB, distanceB
  );

  const multipliers = this._getStepperMultipliers();
  const converted = this._convertStepperUnits(params, multipliers);
  const limited = this._applyStepperLimits(converted);
  const command = this._buildStepperCommand(limited);

  await this.writeAwaitCallback(PASCOBLEDevice.SENSOR_SERVICE_ID, command);
}

private _normalizeStepperParameters(/* ... */): StepperParams {
  // 12 lines
}

private _getStepperMultipliers(): { mulA: number; mulB: number } {
  // 10 lines
}

private _convertStepperUnits(params: StepperParams, muls: Multipliers): ConvertedParams {
  // 12 lines
}

private _applyStepperLimits(params: ConvertedParams): LimitedParams {
  // 8 lines
}

private _buildStepperCommand(params: LimitedParams): number[] {
  // 16 lines
}
```

**Benefits:**
- Each method has one responsibility
- Easy to test each step independently
- Clear data flow through pipeline
- Easier to modify individual steps

---

#### 1.2 `connect()` - 61 Lines

**Location:** `pasco-ble-device.ts:255-315`

**Problem:**
```typescript
async connect(bleDevice: BLEDevice): Promise<void> {
  // Validation (10 lines)
  // State transition (5 lines)
  // Connection with timeout (12 lines)
  // Device parameter setup (4 lines)
  // Protocol initialization (8 lines)
  // Special sensor handling (6 lines)
  // Device initialization (3 lines)
  // State finalization (8 lines)
}
```

**Refactored Solution:**
```typescript
async connect(bleDevice: BLEDevice): Promise<void> {
  this._validateConnectionRequest(bleDevice);
  this._beginConnection(bleDevice);

  try {
    await this._establishBLEConnection();
    await this._initializeProtocol();
    await this._handleSpecialSensors();
    await this._initializeDevice();
    this._finalizeConnection();
  } catch (error) {
    this._handleConnectionFailure(error);
    throw error;
  }
}

private _validateConnectionRequest(device: BLEDevice): void { /* ... */ }
private _beginConnection(device: BLEDevice): void { /* ... */ }
private async _establishBLEConnection(): Promise<void> { /* ... */ }
// ... etc
```

---

#### 1.3 `readData()` Override - 68 Lines

**Location:** `control-node-device.ts:72-139`

**Problem:**
- Handles 3 different port types (undefined, string, number) with different logic
- Deep nesting with multiple conditions

**Refactored Solution:**
```typescript
override async readData(measurement: string, port?: string | number): Promise<number | null> {
  if (!this.isConnected()) {
    throw new DeviceNotConnected();
  }

  if (!measurement || typeof measurement !== 'string') {
    throw new InvalidParameter();
  }

  if (port === undefined) {
    return super.readData(measurement);
  }

  if (typeof port === 'string') {
    return this._readFromStepperPort(measurement, port);
  }

  if (typeof port === 'number') {
    return this._readServoResistance(measurement, port);
  }

  throw new MeasurementNotFound();
}

private async _readFromStepperPort(measurement: string, port: string): Promise<number | null> {
  // 25 lines - extract stepper port reading logic
}

private async _readServoResistance(measurement: string, port: number): Promise<number | null> {
  // 15 lines - extract servo resistance reading logic
}
```

---

#### 1.4 `setPowerOut()` - 54 Lines

**Location:** `control-node-device.ts:512-565`

**Problem:**
- Multiple lookup tables defined inline
- Complex value calculation logic
- Long command building

**Refactored Solution:**
```typescript
// Extract to class constants or config object
private static readonly POWER_OUT_PIN_ENCODING: Record<string, number> = {
  'A,1': 3,
  'A,2': 12,
  'B,1': 48,
  'B,2': 192,
};

private static readonly POWER_OUT_PIN_INDICES: Record<string, number> = {
  'A,1': 0,
  'A,2': 2,
  'B,1': 4,
  'B,2': 6,
};

async setPowerOut(
  port: PortId,
  channel: 1 | 2,
  outputType: OutputType,
  value: number,
): Promise<void> {
  const config = this._getPowerOutConfig(port, channel);
  const pwmPeriod = this._getPWMPeriod(outputType);
  const values = this._calculatePowerValues(outputType, value, config.firstPinIndex);
  const command = this._buildPowerOutCommand(config.whichPins, pwmPeriod, values);

  await this.writeAwaitCallback(PASCOBLEDevice.SENSOR_SERVICE_ID, command);
}
```

---

## 2. Long Parameter List 🔴 High Priority

### Smell: More than 4 parameters makes functions hard to call and understand

#### 2.1 Stepper Motor Functions - 6-7 Parameters

**Location:** `control-node-device.ts`
- `_sendStepperCommand()`: 6 parameters (lines 188-195)
- `rotateSteppersThrough()`: 7 parameters (lines 358-365)
- `rotateSteppersContinuously()`: 4 parameters (lines 284-289)

**Problem:**
```typescript
await device.rotateSteppersThrough(
  360,    // speedA - what units?
  180,    // accelerationA - what units?
  720,    // distanceA - what units?
  180,    // speedB - which motor is this?
  90,     // accelerationB
  360,    // distanceB
  true    // awaitCompletion - easy to forget
);
```

**Refactored Solution:**
```typescript
// Define configuration interfaces
interface StepperMotion {
  speed: number;           // deg/s
  acceleration: number;    // deg/s²
  distance?: number;       // degrees (omit for continuous)
}

interface StepperCommand {
  motorA?: StepperMotion;
  motorB?: StepperMotion;
  awaitCompletion?: boolean;
}

// Refactored API
async rotateSteppers(config: StepperCommand): Promise<void> {
  const params = this._expandStepperConfig(config);
  await this._sendStepperCommand(params);

  if (config.awaitCompletion) {
    await this._waitForSteppersToComplete();
  }
}

// Usage - self-documenting!
await device.rotateSteppers({
  motorA: { speed: 360, acceleration: 180, distance: 720 },
  motorB: { speed: 180, acceleration: 90, distance: 360 },
  awaitCompletion: true
});

// Or single motor
await device.rotateSteppers({
  motorA: { speed: 360, acceleration: 180 }, // continuous (no distance)
});
```

**Benefits:**
- Self-documenting with named properties
- Optional parameters are explicit
- Easy to add new configuration options
- TypeScript autocomplete works better
- Can't mix up parameter order

---

#### 2.2 Servo Control - 4 Parameters

**Location:** `control-node-device.ts:451-456`

**Current:**
```typescript
await device.setServos(
  'standard',  // ch1Type
  90,          // ch1Value
  'continuous', // ch2Type
  50           // ch2Value
);
```

**Refactored:**
```typescript
interface ServoConfig {
  channel1?: { type: ServoType; value: number };
  channel2?: { type: ServoType; value: number };
}

await device.setServos({
  channel1: { type: 'standard', value: 90 },
  channel2: { type: 'continuous', value: 50 }
});
```

---

## 3. Duplicated Code 🟡 Medium Priority

### Smell: Same code appears in multiple places

#### 3.1 Port Selection Pattern - 5+ Occurrences

**Locations:**
- `rotateStepperContinuously()`: lines 315-321
- `stopStepper()`: lines 339-345
- `rotateStepperThrough()`: lines 404-425
- `setServo()`: lines 493-501

**Problem:**
```typescript
// Pattern repeated 5+ times
if (port.toUpperCase() === 'A') {
  await this.someMethodForBothSteppers(value, null, null, null);
} else if (port.toUpperCase() === 'B') {
  await this.someMethodForBothSteppers(null, null, null, value);
} else {
  throw new InvalidParameter('Port must be A or B');
}
```

**Refactored Solution:**
```typescript
// Extract to utility method
private _routeToStepper<T>(
  port: PortId,
  valueForA: T,
  valueForB: T,
  handler: (a: T, b: T) => Promise<void>
): Promise<void> {
  const upperPort = port.toUpperCase();

  if (upperPort === 'A') {
    return handler(valueForA, null as T);
  } else if (upperPort === 'B') {
    return handler(null as T, valueForB);
  }

  throw new InvalidParameter('Port must be A or B');
}

// Usage
async rotateStepperContinuously(port: PortId, speed: number, accel: number): Promise<void> {
  return this._routeToStepper(
    port,
    { speed, acceleration: accel },
    { speed, acceleration: accel },
    (a, b) => this.rotateSteppersContinuously(a?.speed, a?.acceleration, b?.speed, b?.acceleration)
  );
}
```

**Better Alternative - Use Strategy Pattern:**
```typescript
class StepperPortRouter {
  constructor(private device: ControlNodeDevice) {}

  async execute<T>(
    port: PortId,
    value: T,
    bothHandler: (valueA: T | null, valueB: T | null) => Promise<void>
  ): Promise<void> {
    const upperPort = port.toUpperCase();

    switch (upperPort) {
      case 'A':
        return bothHandler(value, null);
      case 'B':
        return bothHandler(null, value);
      default:
        throw new InvalidParameter('Port must be A or B');
    }
  }
}

// Initialize once
private _portRouter = new StepperPortRouter(this);

// Use everywhere
async rotateStepperContinuously(port: PortId, speed: number, accel: number): Promise<void> {
  return this._portRouter.execute(
    port,
    { speed, accel },
    (a, b) => this.rotateSteppersContinuously(a?.speed, a?.accel, b?.speed, b?.accel)
  );
}
```

---

#### 3.2 Lookup Table Pattern - 3 Occurrences

**Location:** `control-node-device.ts`

**Problem:**
```typescript
// Pattern 1: setPowerOut (lines 518-530)
const encodeWhichPins: Record<string, number> = {
  'A,1': 3, 'A,2': 12, 'B,1': 48, 'B,2': 192,
};
const firstPinIndices: Record<string, number> = {
  'A,1': 0, 'A,2': 2, 'B,1': 4, 'B,2': 6,
};

// Pattern 2: setGreenhouseLight (lines 601-602)
const whichPins: Record<string, number> = { A: 0x0f, B: 0xf0 };

// Pattern 3: PLUGIN_CHANNELS (lines 57-63)
protected static readonly PLUGIN_CHANNELS: Record<string | number, number> = {
  A: 0, B: 1, sensor: 2, 1: 3, 2: 3,
};
```

**Refactored Solution:**
```typescript
// Create configuration object at class level
private static readonly PORT_CONFIGS = {
  powerOut: {
    pins: { 'A,1': 3, 'A,2': 12, 'B,1': 48, 'B,2': 192 },
    indices: { 'A,1': 0, 'A,2': 2, 'B,1': 4, 'B,2': 6 },
  },
  greenhouseLight: {
    pins: { A: 0x0f, B: 0xf0 },
  },
  plugins: {
    A: 0, B: 1, sensor: 2, 1: 3, 2: 3,
  },
} as const;

// Or better - create config class
class PortConfiguration {
  static getPowerOutPinEncoding(port: string, channel: number): number {
    return this.PORT_CONFIGS.powerOut.pins[`${port},${channel}`];
  }

  static getPowerOutPinIndex(port: string, channel: number): number {
    return this.PORT_CONFIGS.powerOut.indices[`${port},${channel}`];
  }

  static getGreenhouseLightPins(port: string): number {
    return this.PORT_CONFIGS.greenhouseLight.pins[port];
  }
}
```

---

#### 3.3 Delay Helper - 2 Occurrences

**Locations:**
- `control-node-device.ts:661-663`
- `code-node-device.ts:244-246`

**Problem:**
```typescript
// Duplicated in two classes
protected _delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
```

**Refactored Solution:**

**Option 1:** Move to shared utilities
```typescript
// src/utils/async.ts
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Usage in both classes
import { delay } from '../utils/async.js';

await delay(100);
```

**Option 2:** Move to base class
```typescript
// In PASCOBLEDevice
protected _delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// Available in all subclasses automatically
```

---

#### 3.4 LED Index Calculation - 2 Occurrences

**Location:** `code-node-device.ts:54, 103`

**Problem:**
```typescript
// Duplicated formula
const ledIndex = 20 - y * 5 + x;
```

**Refactored Solution:**
```typescript
/**
 * Convert x,y coordinates to LED array index
 *
 * LED Matrix Layout (5x5):
 * [0,0] [1,0] [2,0] [3,0] [4,0]  -> indices 20-24
 * [0,1] [1,1] [2,1] [3,1] [4,1]  -> indices 15-19
 * [0,2] [1,2] [2,2] [3,2] [4,2]  -> indices 10-14
 * [0,3] [1,3] [2,3] [3,3] [4,3]  -> indices 5-9
 * [0,4] [1,4] [2,4] [3,4] [4,4]  -> indices 0-4
 */
private _calculateLedIndex(x: number, y: number): number {
  const MATRIX_HEIGHT = 5;
  const MATRIX_WIDTH = 5;
  const BOTTOM_LEFT_INDEX = 20;

  return BOTTOM_LEFT_INDEX - y * MATRIX_WIDTH + x;
}

// Usage
const ledIndex = this._calculateLedIndex(x, y);
```

---

## 4. Large Class 🟡 Medium Priority

### Smell: Class has too many responsibilities (God Object)

#### 4.1 `PASCOBLEDevice` - 788 Lines

**Location:** `device/pasco-ble-device.ts`

**Responsibilities:**
1. Connection management (scan, connect, disconnect, reconnect)
2. State machine coordination
3. Event emission
4. Notification handling
5. Device initialization
6. Measurement reading
7. Sensor management
8. Protocol coordination

**Refactoring Strategy:**

Extract into focused classes:

```typescript
// 1. Connection Manager (~150 lines)
class ConnectionManager {
  constructor(
    private adapter: BLEAdapterBase,
    private stateMachine: ConnectionStateMachine,
    private options: DeviceOptions
  ) {}

  async scan(filter?: string): Promise<BLEDevice[]>
  async connect(device: BLEDevice): Promise<BLEClientBase>
  async disconnect(): Promise<void>
  async reconnect(): Promise<boolean>
}

// 2. Measurement Reader (~200 lines)
class MeasurementReader {
  constructor(
    private protocol: ProtocolHandler,
    private decoder: MeasurementDecoder,
    private state: MeasurementState
  ) {}

  async readData(measurement: string): Promise<number | null>
  async readDataList(measurements: string[]): Promise<Record<string, number | null>>
  getMeasurementList(sensor?: string): string[]
  getMeasurementUnit(measurement: string): string | null
}

// 3. Notification Handler (~100 lines)
class NotificationHandler {
  constructor(
    private decoder: MeasurementDecoder,
    private protocol: ProtocolHandler,
    private emitter: TypedEventEmitter<DeviceEvents>
  ) {}

  handleNotification(serviceId: number, data: number[]): void
  private processMeasurementResponse(sensorId: number, data: number[]): void
  private processDeviceResponse(data: number[]): void
}

// 4. Main Device (orchestrator) (~200 lines)
export class PASCOBLEDevice extends TypedEventEmitter<DeviceEvents> {
  private connectionManager: ConnectionManager;
  private measurementReader: MeasurementReader;
  private notificationHandler: NotificationHandler;
  private deviceInfo: DeviceInfo;

  async scan(filter?: string) { return this.connectionManager.scan(filter); }
  async connect(device: BLEDevice) { /* orchestrate connection */ }
  async readData(m: string) { return this.measurementReader.readData(m); }
  // ... etc
}
```

**Benefits:**
- Each class < 200 lines
- Single responsibility
- Easier to test
- Easier to understand
- Can evolve independently

---

#### 4.2 `ControlNodeDevice` - 665 Lines

**Location:** `control-node-device.ts`

**Responsibilities:**
1. Stepper motor control
2. Servo control
3. Power output control
4. Sound control
5. Greenhouse light control
6. Sensor reading (override)
7. Device reset

**Refactoring Strategy:**

```typescript
// Extract concerns into mixins or separate controllers

class StepperController {
  async rotateThrough(config: StepperMotion): Promise<void>
  async rotateContinuously(config: StepperMotion): Promise<void>
  async stop(deceleration: number): Promise<void>
  async getRemaining(): Promise<[number, number, number, number]>
}

class ServoController {
  async setServo(port: 1 | 2, type: ServoType, value: number): Promise<void>
  async setServos(config: DualServoConfig): Promise<void>
}

class PowerController {
  async setPowerOut(config: PowerOutConfig): Promise<void>
  async setGreenhouseLight(port: PortId, red: number, blue: number): Promise<void>
}

class SoundController {
  async setSoundFrequency(freq: number): Promise<void>
}

// Main class orchestrates
export class ControlNodeDevice extends PASCOBLEDevice {
  readonly steppers: StepperController;
  readonly servos: ServoController;
  readonly power: PowerController;
  readonly sound: SoundController;

  constructor(options?: DeviceOptions) {
    super(options);
    this.steppers = new StepperController(this);
    this.servos = new ServoController(this);
    this.power = new PowerController(this);
    this.sound = new SoundController(this);
  }
}

// Usage
await device.steppers.rotateThrough({ speed: 360, acceleration: 180 });
await device.servos.setServo(1, 'standard', 90);
await device.power.setPowerOut({ port: 'A', channel: 1, type: 'USB', value: 1 });
```

---

## 5. Magic Numbers 🟡 Medium Priority

### Smell: Unexplained numeric constants in code

**Locations Throughout Codebase:**

#### 5.1 Control Node Device

**Location:** `control-node-device.ts`

```typescript
// Line 113-114: Angle conversion
value = Math.round(((value * 180) / Math.PI) * 10) / 10;

// Should be:
const RADIANS_TO_DEGREES = 180 / Math.PI;
const ANGLE_DECIMAL_PLACES = 1;
const ANGLE_ROUNDING_FACTOR = 10 ** ANGLE_DECIMAL_PLACES;

value = Math.round(value * RADIANS_TO_DEGREES * ANGLE_ROUNDING_FACTOR) / ANGLE_ROUNDING_FACTOR;

// Line 134: Servo resistance scaling
return value * 12.5;

// Should be:
const SERVO_RESISTANCE_SCALE_FACTOR = 12.5;
return value * SERVO_RESISTANCE_SCALE_FACTOR;

// Line 248: Stepper limits
speedAVal = Math.round(limit(speedAVal, -19200, 19200));

// Should be:
const MAX_STEPPER_SPEED = 19200; // decisteps per second
speedAVal = Math.round(limit(speedAVal, -MAX_STEPPER_SPEED, MAX_STEPPER_SPEED));

// Line 550: Duty cycle calculation
const dutyCycle = Math.round(2.53 * Math.abs(value) + 1);

// Should be:
const PWM_DUTY_CYCLE_SCALE = 2.53;
const PWM_DUTY_CYCLE_OFFSET = 1;
const dutyCycle = Math.round(PWM_DUTY_CYCLE_SCALE * Math.abs(value) + PWM_DUTY_CYCLE_OFFSET);

// Line 609-610: Brightness inversion
const redValue = Math.round((100 - red) * 2.55) + 1;
const blueValue = Math.round((100 - blue) * 2.55) + 1;

// Should be:
const BRIGHTNESS_SCALE = 2.55; // Convert 0-100 to 0-255
const BRIGHTNESS_OFFSET = 1;
const redValue = Math.round((100 - red) * BRIGHTNESS_SCALE) + BRIGHTNESS_OFFSET;
```

#### 5.2 Code Node Device

**Location:** `code-node-device.ts`

```typescript
// Lines 54, 103: LED index calculation
const ledIndex = 20 - y * 5 + x;

// Should be:
const LED_MATRIX_SIZE = 5;
const LED_BOTTOM_ROW_START = 20;
const ledIndex = LED_BOTTOM_ROW_START - y * LED_MATRIX_SIZE + x;

// Line 104: LED bit activation
ledActivate += 2 ** ledIndex;

// Should be:
const BITS_PER_LED = 1;
ledActivate += (1 << ledIndex); // Bit shift is clearer for bit flags
```

#### 5.3 Measurement Decoder

**Location:** `measurement-decoder.ts`

```typescript
// Line 282: Derivative calculation
return (inputValue - prevValue) / 2;

// Should be:
const DERIVATIVE_TIME_STEP = 2; // seconds or appropriate unit
return (inputValue - prevValue) / DERIVATIVE_TIME_STEP;
```

#### 5.4 Binary Utilities

**Location:** `utils/binary.ts`

```typescript
// Line 39: Two's complement check
if (value && value > 1 << (bitLen - 1)) {

// Should be:
const SIGN_BIT_POSITION = bitLen - 1;
const SIGN_BIT_THRESHOLD = 1 << SIGN_BIT_POSITION;
if (value && value > SIGN_BIT_THRESHOLD) {
```

**Recommendation:** Create a constants file:
```typescript
// src/constants/hardware.ts
export const HARDWARE_CONSTANTS = {
  STEPPER: {
    MAX_SPEED_DECISTEPS_PER_SEC: 19200,
    STEPS_PER_REVOLUTION: 960,
    DEGREES_PER_REVOLUTION: 360,
    DECISTEPS_PER_STEP: 10,
  },
  SERVO: {
    RESISTANCE_SCALE_FACTOR: 12.5,
  },
  LED: {
    MATRIX_SIZE: 5,
    MATRIX_TOTAL_LEDS: 25,
    BOTTOM_ROW_START_INDEX: 20,
  },
  PWM: {
    DUTY_CYCLE_SCALE: 2.53,
    DUTY_CYCLE_OFFSET: 1,
    BRIGHTNESS_SCALE: 2.55,
  },
  CONVERSION: {
    RADIANS_TO_DEGREES: 180 / Math.PI,
    DEGREES_TO_RADIANS: Math.PI / 180,
  },
} as const;
```

---

## 6. Primitive Obsession 🟡 Medium Priority

### Smell: Using primitives instead of small objects to represent concepts

#### 6.1 Port Identifiers

**Problem:**
```typescript
type PortId = 'A' | 'B' | 'a' | 'b'; // String primitive

// Used everywhere with validation
if (port.toUpperCase() === 'A') { /* ... */ }
```

**Refactored:**
```typescript
class Port {
  private constructor(private readonly value: 'A' | 'B') {}

  static A = new Port('A');
  static B = new Port('B');

  static from(id: string): Port {
    const upper = id.toUpperCase();
    if (upper === 'A') return Port.A;
    if (upper === 'B') return Port.B;
    throw new InvalidParameter('Port must be A or B');
  }

  isA(): boolean { return this.value === 'A'; }
  isB(): boolean { return this.value === 'B'; }
  toString(): string { return this.value; }
}

// Usage
async rotateStepperContinuously(port: Port, speed: number, accel: number) {
  if (port.isA()) {
    await this.rotateSteppersContinuously(speed, accel, null, null);
  } else {
    await this.rotateSteppersContinuously(null, null, speed, accel);
  }
}

// API
await device.rotateStepperContinuously(Port.A, 360, 180);
```

#### 6.2 Coordinate Pairs

**Problem:**
```typescript
type LEDCoordinate = [number, number]; // Tuple primitive

// Validation repeated everywhere
if (x < 0 || x > 4 || y < 0 || y > 4) {
  throw new InvalidParameter('x and y must be in range [0-4]');
}
```

**Refactored:**
```typescript
class LEDCoordinate {
  private static readonly MIN = 0;
  private static readonly MAX = 4;

  constructor(
    public readonly x: number,
    public readonly y: number
  ) {
    if (!this.isValid()) {
      throw new InvalidParameter(`Coordinates must be in range [${LEDCoordinate.MIN}-${LEDCoordinate.MAX}]`);
    }
  }

  private isValid(): boolean {
    return this.x >= LEDCoordinate.MIN && this.x <= LEDCoordinate.MAX &&
           this.y >= LEDCoordinate.MIN && this.y <= LEDCoordinate.MAX;
  }

  toIndex(): number {
    const MATRIX_SIZE = 5;
    const BOTTOM_ROW_START = 20;
    return BOTTOM_ROW_START - this.y * MATRIX_SIZE + this.x;
  }
}

// Usage
const coord = new LEDCoordinate(2, 3); // Validates automatically
const index = coord.toIndex();
```

---

## 7. Deep Nesting 🟡 Medium Priority

### Smell: More than 3 levels of nesting

#### 7.1 Stepper Multiplier Calculation

**Location:** `control-node-device.ts:223-228`

**Problem:**
```typescript
const mul: Record<number, number> = {};
for (const sensor of this._deviceChannels) {
  if (sensor.channel_id_tag) {
    mul[sensor.id] = sensor.sensor_id === ControlNodeDevice.CN_ACC_ID_LOW_SPEED_STEPPER ? 6 : 1;
  }
}
```

**Refactored:**
```typescript
private _getStepperMultipliers(): Record<number, number> {
  const multipliers: Record<number, number> = {};

  for (const sensor of this._deviceChannels) {
    if (!sensor.channel_id_tag) continue;

    multipliers[sensor.id] = this._getStepperMultiplier(sensor.sensor_id);
  }

  return multipliers;
}

private _getStepperMultiplier(sensorId: number): number {
  const LOW_SPEED_STEPPER_MULTIPLIER = 6;
  const STANDARD_MULTIPLIER = 1;

  return sensorId === ControlNodeDevice.CN_ACC_ID_LOW_SPEED_STEPPER
    ? LOW_SPEED_STEPPER_MULTIPLIER
    : STANDARD_MULTIPLIER;
}
```

#### 7.2 Measurement ID Lookup

**Location:** `control-node-device.ts:94-104`

**Problem:**
```typescript
let measurementId: number | null = null;
const measurements = this._deviceMeasurements.get(sensorId);
if (measurements) {
  for (const [mId, m] of measurements) {
    if (m.NameTag === measurement) {
      measurementId = mId;
      break;
    }
  }
}
```

**Refactored:**
```typescript
private _findMeasurementId(sensorId: number, measurementName: string): number | null {
  const measurements = this._deviceMeasurements.get(sensorId);
  if (!measurements) return null;

  for (const [id, measurement] of measurements) {
    if (measurement.NameTag === measurementName) {
      return id;
    }
  }

  return null;
}

// Or even better - use find
private _findMeasurementId(sensorId: number, measurementName: string): number | null {
  const measurements = this._deviceMeasurements.get(sensorId);
  if (!measurements) return null;

  const entry = Array.from(measurements.entries())
    .find(([_, m]) => m.NameTag === measurementName);

  return entry?.[0] ?? null;
}
```

---

## 8. Switch Statements 🟢 Low Priority

### Smell: Type-based switching - consider polymorphism

#### 8.1 Measurement Type Decoding

**Location:** `measurement-decoder.ts:197-214`

**Current:**
```typescript
switch (m.Type) {
  case 'ThreeInputVector':
    return this._calcThreeInputVector(inputStr, sensorId);
  case 'Select':
    return this._calcSelect(inputStr, sensorId);
  case 'UserCal':
  case 'FactoryCal':
    return this._calcCalibration(m, inputStr, sensorId);
  case 'LinearConv':
    return this._calcLinear(m, inputStr, sensorId);
  case 'Derivative':
    return this._calcDerivative(inputStr, sensorId);
  case 'RotaryPos':
    return this._calcRotary(m, inputStr, sensorId);
  default:
    return null;
}
```

**Note:** This switch is actually acceptable because:
- Each case is simple (single function call)
- It's in one location (not duplicated)
- The types are fixed (from hardware datasheets)

**If refactoring were needed:**
```typescript
// Strategy pattern
interface MeasurementCalculator {
  calculate(m: Measurement, inputStr: string, sensorId: number): number | null;
}

class ThreeInputVectorCalculator implements MeasurementCalculator {
  calculate(m: Measurement, inputStr: string, sensorId: number): number | null {
    // implementation
  }
}

// Map of calculators
private calculators = new Map<string, MeasurementCalculator>([
  ['ThreeInputVector', new ThreeInputVectorCalculator()],
  ['Select', new SelectCalculator()],
  // ... etc
]);

private _calculateWithInput(m: Measurement, sensorId: number): number | null {
  const calculator = this.calculators.get(m.Type);
  return calculator?.calculate(m, m.Inputs?.toString() ?? '', sensorId) ?? null;
}
```

---

## 9. Dead Code 🟢 Low Priority

### Smell: Backward compatibility code that should be removed

#### 9.1 Protocol Constants Duplication

**Location:** `pasco-ble-device.ts:64-77`

**Problem:**
```typescript
// Static constants for backward compatibility with subclasses
protected static readonly SENSOR_SERVICE_ID = PROTOCOL.SENSOR_SERVICE_ID;
protected static readonly SEND_CMD_CHAR_ID = PROTOCOL.SEND_CMD_CHAR_ID;
// ... 14 more lines
```

**Recommendation:**
1. Mark as `@deprecated` in JSDoc
2. Add migration guide comment
3. Remove in next major version (v1.0.0)

```typescript
/**
 * @deprecated Use PROTOCOL.SENSOR_SERVICE_ID instead. Will be removed in v1.0.0
 * @see PROTOCOL
 */
protected static readonly SENSOR_SERVICE_ID = PROTOCOL.SENSOR_SERVICE_ID;
```

---

## Summary & Action Plan

### Quick Wins (Easy, High Impact)

1. ✅ **Extract magic numbers to constants** (2-4 hours)
   - Create `src/constants/hardware.ts`
   - Replace magic numbers throughout codebase
   - Estimated LOC affected: ~50

2. ✅ **Remove code duplication** (2-3 hours)
   - Extract `_delay` to utilities
   - Extract LED index calculation
   - Extract port routing logic
   - Estimated LOC affected: ~30

3. ✅ **Add parameter objects** (3-4 hours)
   - Create interfaces for stepper/servo/power configs
   - Update function signatures
   - Update all call sites
   - Estimated LOC affected: ~100

### Medium Effort (Moderate Impact)

4. **Break up long methods** (4-6 hours)
   - `_sendStepperCommand` → 5 methods
   - `connect` → extract connection steps
   - `readData` → extract port type handlers
   - `setPowerOut` → extract configuration logic
   - Estimated LOC affected: ~200

5. **Reduce deep nesting** (2-3 hours)
   - Use early returns
   - Extract nested conditions to methods
   - Estimated LOC affected: ~50

### Long Term (Large Refactoring)

6. **Split large classes** (16-24 hours)
   - Extract ConnectionManager from PASCOBLEDevice
   - Extract controllers from ControlNodeDevice
   - Create proper interfaces
   - Update all imports and usage
   - Write migration guide
   - Estimated LOC affected: ~800

7. **Add value objects** (8-12 hours)
   - Create Port, LEDCoordinate, etc.
   - Update all type signatures
   - Update all call sites
   - Estimated LOC affected: ~300

### Prioritized Roadmap

**Phase 1: Clean Up (Week 1)**
- Extract magic numbers
- Remove duplication
- Mark deprecated code

**Phase 2: API Improvement (Week 2-3)**
- Add parameter objects
- Update public API
- Write migration guide

**Phase 3: Internal Refactoring (Week 4-6)**
- Break up long methods
- Reduce nesting
- Improve internal structure

**Phase 4: Major Refactoring (v1.0.0 milestone)**
- Split large classes
- Add value objects
- Remove deprecated code
- Breaking changes OK for major version

---

## Conclusion

The codebase has **15 identifiable code smells**, but most are opportunities for incremental improvement rather than critical issues. The architecture is sound, and the code is functional and type-safe.

**Key Takeaway:** Focus on quick wins first (magic numbers, duplication, parameter objects) to get maximum benefit for minimal effort. Save major refactoring for when you're ready for breaking API changes (v1.0.0).

**Estimated Total Effort:**
- Quick wins: ~10 hours
- Medium effort: ~10 hours
- Long term: ~40 hours
- **Total: ~60 hours** of focused refactoring

This is a **healthy amount of technical debt** for a codebase of this size and complexity. The code quality is high overall! 🎉
