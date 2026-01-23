# PASCO BLE TypeScript Library - Codebase Analysis Report

**Date:** January 2026
**Library Version:** 0.3.65
**Total Source Lines:** ~1,187 TypeScript

---

## Executive Summary

PASCO BLE is a well-architected TypeScript library for controlling PASCO educational Bluetooth Low Energy (BLE) sensors and devices. The codebase demonstrates strong software engineering practices including proper abstraction layers, type safety, and extensible design patterns. This report provides a comprehensive analysis of the infrastructure, class design, and actionable recommendations for improvement.

---

## 1. Project Infrastructure

### 1.1 Build System & Tooling

| Component | Technology | Version |
|-----------|------------|---------|
| Language | TypeScript | 5.3.0 |
| Module System | ESNext (ES Modules) | - |
| Target | ES2022 | - |
| Linter/Formatter | Biome | 2.3.11 |
| Pre-commit Hooks | simple-git-hooks | 2.13.1 |

**Build Scripts:**
```json
{
  "build": "tsc",
  "clean": "rm -rf dist",
  "lint": "biome check src/ examples/",
  "lint:fix": "biome check --fix src/ examples/",
  "format": "biome format --write src/ examples/",
  "check": "npm run lint && npm run format"
}
```

### 1.2 Directory Structure

```
pascoTs/
├── src/                          # Source code (1,187 lines)
│   ├── ble/                      # BLE abstraction layer
│   │   ├── ble-adapter.ts        # Abstract base classes
│   │   ├── web-bluetooth-adapter.ts
│   │   └── index.ts              # Factory + exports
│   ├── types/                    # Type definitions
│   │   ├── ble.ts                # BLE interfaces
│   │   ├── device.ts             # Device/sensor types
│   │   ├── measurement.ts        # Measurement types
│   │   └── index.ts
│   ├── utils/                    # Utility functions
│   │   ├── binary.ts             # Binary data handling
│   │   ├── equation-parser.ts    # Safe expression evaluation
│   │   ├── math.ts               # Scientific calculations
│   │   └── index.ts
│   ├── pasco-ble-device.ts       # Core device class (1,027 lines)
│   ├── code-node-device.ts       # LED/speaker control
│   ├── control-node-device.ts    # Motor/servo control
│   ├── pasco-bot.ts              # Robotics abstraction
│   ├── character-library.ts      # 5x5 LED characters
│   ├── datasheets.ts             # Sensor metadata
│   ├── units.ts                  # Unit conversions
│   └── index.ts                  # Main exports
├── examples/                     # Usage examples (7 files)
├── dist/                         # Compiled output
└── [config files]                # tsconfig, biome, package.json
```

### 1.3 Dependencies

**Runtime Dependencies (1):**
| Package | Version | Purpose |
|---------|---------|---------|
| expr-eval | ^2.0.2 | Safe mathematical expression parser |

**Dev Dependencies (4):**
| Package | Version | Purpose |
|---------|---------|---------|
| @biomejs/biome | ^2.3.11 | Linting and formatting |
| @types/web-bluetooth | ^0.0.20 | TypeScript types for Web Bluetooth |
| simple-git-hooks | ^2.13.1 | Git hooks |
| typescript | ^5.3.0 | TypeScript compiler |

**Assessment:** Minimal dependency footprint is excellent for a BLE library. The single runtime dependency (`expr-eval`) is justified for safe equation evaluation.

---

## 2. Class Architecture

### 2.1 Class Hierarchy

```
BLEAdapterBase (Abstract)
└── WebBluetoothAdapter

BLEClientBase (Abstract)
└── WebBluetoothClient

PASCOBLEDevice (Base - 1,027 lines)
├── CodeNodeDevice (LED matrix, RGB LED, speaker)
├── ControlNodeDevice (Stepper motors, servos, power)
│   └── PascoBot (High-level robotics interface)
```

### 2.2 Core Classes Analysis

#### PASCOBLEDevice (`src/pasco-ble-device.ts`)
**Role:** Base class for all PASCO device interactions
**Lines:** 1,027 (largest file - potential concern)

**Responsibilities:**
- BLE device scanning and connection management
- Sensor detection and initialization
- Measurement reading and data decoding
- Binary protocol communication
- Datasheet parsing and measurement calculation

**Key Methods:**
| Method | Purpose |
|--------|---------|
| `scan()` | Discover available BLE devices |
| `connect()` | Establish device connection |
| `readData()` | Read single measurement value |
| `readDataList()` | Read multiple measurements |
| `getSensorList()` | Get available sensors |
| `getMeasurementList()` | Get available measurements |

#### CodeNodeDevice (`src/code-node-device.ts`)
**Role:** Control //code.Node LED and speaker features
**Extends:** PASCOBLEDevice

**Capabilities:**
- 5x5 LED matrix control
- RGB LED control
- Speaker frequency control
- Icon/text display

#### ControlNodeDevice (`src/control-node-device.ts`)
**Role:** Control //control.Node motor and power features
**Extends:** PASCOBLEDevice

**Capabilities:**
- Stepper motor control (channels A & B)
- Servo positioning
- Power output management
- Plugin sensor detection

#### PascoBot (`src/pasco-bot.ts`)
**Role:** High-level robotics abstraction
**Extends:** ControlNodeDevice

**Capabilities:**
- Simple drive commands (forward/backward)
- Turn commands (angle-based)
- Automatic wheel calculations

### 2.3 Error Classes

Nine custom error classes provide granular error handling:

| Error Class | Purpose |
|-------------|---------|
| `BLEScanFailed` | Bluetooth scan failures |
| `BLEConnectionError` | Connection establishment failures |
| `BLEAlreadyConnectedError` | Duplicate connection attempts |
| `DeviceNotConnected` | Operations on disconnected device |
| `MeasurementNotFound` | Invalid measurement requests |
| `InvalidParameter` | Invalid method parameters |
| `SensorNotFound` | Missing sensor errors |
| `InvalidEquation` | Malformed equations |
| `CouldNotDecodeData` | Binary decoding failures |
| `CommunicationError` | Protocol communication errors |
| `SensorSetupError` | Sensor initialization failures |

---

## 3. Design Patterns

### 3.1 Patterns Identified

| Pattern | Location | Purpose |
|---------|----------|---------|
| **Adapter** | `ble/` directory | Abstract platform-specific BLE |
| **Factory** | `createBLEAdapter()` | Create appropriate BLE adapter |
| **Template Method** | Device hierarchy | Define operation skeletons |
| **Strategy** | `_getMeasurementValue()` | Handle measurement types |
| **Observer** | Notification callbacks | Handle async BLE events |
| **Registry** | Datasheets, measurement maps | O(1) metadata lookups |

### 3.2 Adapter Pattern (BLE Layer)

```typescript
// Abstract interface
interface BLEAdapter {
  scan(filter?: string[], timeout?: number): Promise<BLEDevice[]>
  createClient(device: BLEDevice): BLEClient
  stopScan(): Promise<void>
}

// Concrete implementation
class WebBluetoothAdapter extends BLEAdapterBase {
  // Browser-specific implementation
}

// Factory
function createBLEAdapter(): BLEAdapterBase {
  if (typeof navigator !== 'undefined' && navigator.bluetooth) {
    return new WebBluetoothAdapter()
  }
  throw new Error('Web Bluetooth API not available')
}
```

**Benefit:** Enables future Node.js BLE adapter without modifying core code.

### 3.3 Strategy Pattern (Measurement Calculation)

Measurements are calculated based on type:

| Type | Strategy |
|------|----------|
| `RawDigital` | Binary unpacking |
| `Direct` | Float conversion |
| `Constant` | Return fixed value |
| `LinearConv` | y = mx + b transformation |
| `FactoryCal` | 4-parameter calibration |
| `UserCal` | User calibration overlay |
| `ThreeInputVector` | 3D vector magnitude |
| `RotaryPos` | Rotary position tracking |
| `Derivative` | Rate of change |
| `Equation` | Expression evaluation |

---

## 4. Type System

### 4.1 Core Types

**Device Types (`src/types/device.ts`):**
```typescript
interface SensorChannel {
  id: number
  name: string
  sensor_id: number
  type: number
  output_type: number
  measurements: Measurement[]
  total_data_size: number
  plug_detect: number
  channel_id_tag: number
  factory_cal_ids: number[]
}

interface DeviceState {
  name: string
  serialId: string
  address: string
  interfaceId: number
  devType: string
  airlinkSensorId: number
}
```

**BLE Types (`src/types/ble.ts`):**
```typescript
interface BLEDevice {
  id: string
  name: string | null
}

interface BLEClient {
  address: string
  isConnected: boolean
  services: BLEService[]
  connect(): Promise<void>
  disconnect(): Promise<void>
  writeGattChar(uuid: string, data: Uint8Array): Promise<void>
  readGattChar(uuid: string): Promise<Uint8Array>
  startNotify(uuid: string, callback: NotifyCallback): Promise<void>
  stopNotify(uuid: string): Promise<void>
}
```

**Measurement Types (`src/types/measurement.ts`):**
```typescript
type MeasurementType =
  | 'RawDigital' | 'Direct' | 'Constant' | 'LinearConv'
  | 'FactoryCal' | 'UserCal' | 'ThreeInputVector' | 'Select'
  | 'RotaryPos' | 'Derivative' | 'Equation'
```

### 4.2 Type Safety Assessment

| Aspect | Status | Notes |
|--------|--------|-------|
| Strict mode | Enabled | All strict checks active |
| No implicit any | Enabled | Full type coverage |
| No unused locals | Enabled | Clean code |
| Exact optional properties | Enabled | Precise optionality |
| No implicit overrides | Enabled | Explicit inheritance |

---

## 5. Data Flow

### 5.1 Connection Flow

```
User
  │
  ├─► device.scan()
  │     └─► BLEAdapter.scan()
  │           └─► Browser device picker
  │
  ├─► device.connect(bleDevice)
  │     ├─► BLEClient.connect()
  │     ├─► _setDeviceParams()
  │     ├─► _setHandleService()
  │     ├─► _startNotifications()
  │     └─► initializeDevice()
  │           └─► _initializeDeviceSensors()
  │
  └─► device.readData("Temperature")
        ├─► _requestSensorData()
        ├─► writeAwaitCallback()
        ├─► _processMeasurementResponse()
        ├─► _decodeData()
        └─► Return value
```

### 5.2 Binary Protocol

Commands use a structured binary format:
```
[Command Type, Subcommand, ...Parameters]

Example (Set LED):
[GCMD_CODENODE_CMD, SET_LED, ledIndex, intensity]
```

Responses are received via BLE notifications with status codes.

---

## 6. Recommendations

### 6.1 High Priority

#### 1. Add Testing Infrastructure
**Current State:** No test files present
**Impact:** High risk of regressions

**Recommendation:**
```bash
npm install -D vitest @vitest/coverage-v8
```

Create test structure:
```
src/
├── __tests__/
│   ├── pasco-ble-device.test.ts
│   ├── utils/
│   │   ├── binary.test.ts
│   │   ├── math.test.ts
│   │   └── equation-parser.test.ts
│   └── ble/
│       └── ble-adapter.test.ts
```

Priority test targets:
- Binary utilities (pure functions, easy to test)
- Math utilities (pure functions)
- Equation parser (critical for accuracy)
- Unit conversion (data integrity)

#### 2. Refactor PASCOBLEDevice (1,027 lines)
**Current State:** Single file handles too many responsibilities
**Impact:** Difficult to maintain and test

**Recommendation:** Extract into focused modules:

```
src/
├── device/
│   ├── pasco-ble-device.ts      # Core connection logic (~300 lines)
│   ├── sensor-manager.ts        # Sensor initialization (~200 lines)
│   ├── measurement-decoder.ts   # Data decoding (~250 lines)
│   ├── protocol-handler.ts      # BLE protocol (~200 lines)
│   └── index.ts                 # Re-export
```

#### 3. Add JSDoc Documentation
**Current State:** Minimal inline documentation
**Impact:** Harder for contributors and users

**Recommendation:** Add JSDoc to public methods:
```typescript
/**
 * Read a measurement value from the connected device.
 *
 * @param measurementName - The name of the measurement (e.g., "Temperature")
 * @returns The measurement value in its default unit
 * @throws {DeviceNotConnected} If no device is connected
 * @throws {MeasurementNotFound} If the measurement doesn't exist
 *
 * @example
 * const temp = await device.readData("Temperature");
 * console.log(`Temperature: ${temp}°C`);
 */
async readData(measurementName: string): Promise<number | null>
```

### 6.2 Medium Priority

#### 4. Add Node.js BLE Adapter
**Current State:** Browser-only (Web Bluetooth)
**Impact:** Limited to browser environments

**Recommendation:** Add `@stoprocent/noble` adapter:
```typescript
// src/ble/noble-adapter.ts
import noble from '@stoprocent/noble'

export class NobleAdapter extends BLEAdapterBase {
  async scan(filter?: string[], timeout?: number): Promise<BLEDevice[]> {
    // Node.js implementation
  }
}

// Update factory
export function createBLEAdapter(): BLEAdapterBase {
  if (typeof navigator !== 'undefined' && navigator.bluetooth) {
    return new WebBluetoothAdapter()
  }
  if (typeof process !== 'undefined' && process.versions?.node) {
    return new NobleAdapter()
  }
  throw new Error('No BLE adapter available')
}
```

#### 5. Implement Connection State Machine
**Current State:** Implicit state via boolean flags
**Impact:** Complex state management, potential race conditions

**Recommendation:** Add explicit state machine:
```typescript
type ConnectionState =
  | 'disconnected'
  | 'scanning'
  | 'connecting'
  | 'initializing'
  | 'connected'
  | 'disconnecting'
  | 'error'

class DeviceStateMachine {
  private state: ConnectionState = 'disconnected'

  transition(event: ConnectionEvent): void {
    // Validate and handle state transitions
  }
}
```

#### 6. Add Retry Logic for BLE Operations
**Current State:** Single-attempt operations
**Impact:** Fragile in noisy RF environments

**Recommendation:**
```typescript
async function withRetry<T>(
  operation: () => Promise<T>,
  maxRetries: number = 3,
  delayMs: number = 1000
): Promise<T> {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await operation()
    } catch (error) {
      if (attempt === maxRetries) throw error
      await delay(delayMs * attempt)
    }
  }
}
```

### 6.3 Low Priority

#### 7. Add Event Emitter for Device Events
**Current State:** Callback-based only
**Impact:** Less flexible event handling

**Recommendation:**
```typescript
import { EventEmitter } from 'events'

class PASCOBLEDevice extends EventEmitter {
  // Emit events
  this.emit('connected', { device: this.deviceState })
  this.emit('data', { measurement, value })
  this.emit('disconnected', { reason })
  this.emit('error', { error })
}

// User code
device.on('data', ({ measurement, value }) => {
  console.log(`${measurement}: ${value}`)
})
```

#### 8. Add Configuration Options
**Current State:** Hardcoded timeouts and settings
**Impact:** Less flexible for different use cases

**Recommendation:**
```typescript
interface DeviceOptions {
  connectionTimeout?: number  // Default: 10000ms
  commandTimeout?: number     // Default: 5000ms
  retryAttempts?: number      // Default: 3
  autoReconnect?: boolean     // Default: false
  logLevel?: 'none' | 'error' | 'warn' | 'info' | 'debug'
}

const device = new PASCOBLEDevice({
  connectionTimeout: 15000,
  autoReconnect: true,
  logLevel: 'debug'
})
```

#### 9. Add Changelog
**Current State:** No changelog file
**Impact:** Harder to track version changes

**Recommendation:** Add `CHANGELOG.md` following Keep a Changelog format.

#### 10. Consider TypeScript Decorators for Commands
**Future Enhancement:** Could simplify command definitions

```typescript
@Command(GCMD_CODENODE_CMD, SET_LED)
async setLedInArray(
  @Param() x: number,
  @Param() y: number,
  @Param() intensity: number
): Promise<void> {
  // Implementation
}
```

---

## 7. Code Quality Metrics

| Metric | Value | Assessment |
|--------|-------|------------|
| TypeScript Coverage | 100% | Excellent |
| Strict Mode | Enabled | Excellent |
| Dependencies | 1 runtime | Excellent |
| Largest File | 1,027 lines | Needs refactoring |
| Test Coverage | 0% | Critical gap |
| Documentation | Minimal | Needs improvement |
| Error Handling | 9 error types | Good |
| Design Patterns | 6 identified | Good |

---

## 8. Conclusion

The PASCO BLE library demonstrates solid software engineering fundamentals:

**Strengths:**
- Clean TypeScript with full type safety
- Well-designed abstraction layer for BLE
- Proper use of design patterns
- Minimal dependencies
- Good error class hierarchy
- Extensible class architecture

**Areas for Improvement:**
- Add comprehensive test suite (critical)
- Refactor large PASCOBLEDevice class
- Add JSDoc documentation
- Implement Node.js BLE support
- Add explicit state management

**Priority Order:**
1. Testing infrastructure (highest impact on reliability)
2. PASCOBLEDevice refactoring (maintainability)
3. JSDoc documentation (usability)
4. Node.js adapter (broader platform support)
5. Configuration options (flexibility)

The codebase is production-ready but would benefit significantly from the recommended improvements, particularly the addition of automated testing to ensure reliability of this hardware-interfacing library.
