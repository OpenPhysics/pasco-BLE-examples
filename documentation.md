# Examples Documentation

Detailed guide to the PASCO BLE examples and how to use the [pasco-ble](https://www.npmjs.com/package/pasco-ble) library in your own projects.

## Contents

- [Getting Started](#getting-started)
- [Example Descriptions](#example-descriptions)
- [Using the Library](#using-the-library)
- [Common Patterns](#common-patterns)
- [API Quick Reference](#api-quick-reference)
- [Creating Your Own Examples](#creating-your-own-examples)
- [Contributing](#contributing)

---

## Getting Started

### Prerequisites

1. **Browser**: Chrome 56+, Edge 79+, or Opera 43+ (Web Bluetooth required)
2. **HTTPS**: Examples must be served over HTTPS (localhost is exempt)
3. **Hardware**: PASCO Wireless BLE sensor(s)

### Running Examples Locally

```bash
# Clone the repository
git clone https://github.com/veillette/pasco-BLE-examples.git
cd pasco-BLE-examples

# Install dependencies
npm install

# Start local server
npm run serve
```

Open `http://localhost:3000/examples/` in your browser.

### Development Commands

```bash
npm run serve      # Start local server
npm run check      # Run linting and formatting checks
npm run check:fix  # Auto-fix linting/formatting issues
npm run lint       # Run linting only
npm run format     # Run formatting only
```

### Running Examples Directly

Examples can also be opened directly in Chrome/Edge from your file system - no server needed! Just double-click any `.html` file.

---

## Example Descriptions

### basic-usage.html

**Purpose**: Entry-level example showing how to connect to any PASCO sensor and read all available measurements.

**Features**:
- Connect/disconnect button
- Automatic detection of all available measurements
- Real-time display of all sensor values
- Connection status indicator

**Key Concepts**:
- `PASCOBLEDevice` instantiation
- Scanning and connecting
- `getMeasurementList()` to discover measurements
- `readData()` for reading values

---

### force-sensor.html

**Purpose**: Dedicated interface for the Wireless Force Acceleration sensor.

**Features**:
- Large, easy-to-read force display
- All measurements from the sensor
- Real-time updates

**Hardware**: Wireless Force Acceleration sensor

---

### motion-sensor.html

**Purpose**: Position and velocity tracking with the Wireless Motion Sensor.

**Features**:
- Position display
- Velocity calculation
- Real-time updates

**Hardware**: Wireless Motion Sensor

---

### code-node.html

**Purpose**: Control the Code.Node's outputs (LED matrix, RGB LED, speaker).

**Features**:
- 5x5 LED matrix control with click-to-toggle
- RGB LED color picker
- Sound frequency control
- Read onboard sensors (brightness, buttons)

**Hardware**: Code.Node

**Key APIs**:
```javascript
import { CodeNodeDevice, Icons } from 'pasco-ble';

const device = new CodeNodeDevice();
await device.connectById('481-782');

// LED Matrix
await device.setLedInArray(2, 2, 255);           // Single LED
await device.showImageInArray(Icons.smile);      // Show icon
await device.scrollTextInArray('HELLO');         // Scroll text

// RGB LED
await device.setRgbLed(255, 0, 0);               // Red

// Speaker
await device.setSoundFrequency(440);             // 440 Hz tone
```

---

### control-node.html

**Purpose**: Control the Control.Node's motors, servos, and outputs.

**Features**:
- Stepper motor control (speed, direction, position)
- Servo control (standard and continuous)
- Speaker frequency control
- Plugin sensor reading

**Hardware**: Control.Node

**Key APIs**:
```javascript
import { ControlNodeDevice } from 'pasco-ble';

const device = new ControlNodeDevice();
await device.connectById('664-591');

// Stepper motors
await device.rotateStepperContinuously('A', 360, 360);
await device.stopSteppers(360, 360);

// Servos
await device.setServo(1, 'standard', 45);        // Standard: -90 to 90 degrees
await device.setServo(2, 'continuous', 50);      // Continuous: -100 to 100 speed

// Speaker
await device.setSoundFrequency(440);
```

---

### sensor-xy-graph.html

**Purpose**: Parametric X-Y plotting using Chart.js with custom equations.

**Features**:
- Select X and Y axis measurements
- Custom equation support using expr-eval
- Real-time scatter plot
- Data export

**External Libraries**: Chart.js, expr-eval

---

### multi-sensor-graph.html

**Purpose**: Connect multiple sensors and display their data on a single graph.

**Features**:
- Connect multiple PASCO devices simultaneously
- Combined time-series graph
- Color-coded data series
- Synchronized timing

**External Libraries**: Chart.js

---

### smart-cart.html

**Purpose**: 3D visualization of Smart Cart data using Plotly.

**Features**:
- Position-velocity-time 3D scatter plot
- Interactive rotation and zoom
- Real-time data accumulation

**Hardware**: Wireless Smart Cart

**External Libraries**: Plotly.js

---

## Using the Library

### Loading via CDN

The recommended way to use `pasco-ble` in browser examples:

```html
<script type="importmap">
{
  "imports": {
    "pasco-ble": "https://esm.sh/pasco-ble"
  }
}
</script>

<script type="module">
  import { PASCOBLEDevice } from 'pasco-ble';
  // Your code here
</script>
```

### Alternative: Direct URL Import

```html
<script type="module">
  import { PASCOBLEDevice } from 'https://unpkg.com/pasco-ble/dist/index.js';
</script>
```

### Available Exports

```javascript
import {
  // Device classes
  PASCOBLEDevice,      // Generic sensor device
  CodeNodeDevice,       // Code.Node with LED/speaker
  ControlNodeDevice,    // Control.Node with motors/servos
  PascoBot,            // Robotics interface

  // Browser support
  checkBrowserSupport,
  isWebBluetoothSupported,

  // LED icons for Code.Node
  Icons,
  LEDIcons,

  // Error classes
  BLEConnectionError,
  DeviceNotConnected,
  MeasurementNotFound,
} from 'pasco-ble';
```

---

## Common Patterns

### Basic Connection Flow

```javascript
const device = new PASCOBLEDevice();

// 1. Scan for devices (opens browser picker)
const devices = await device.scan();

// 2. Connect to selected device
if (devices.length > 0) {
  await device.connect(devices[0]);
}

// 3. Read data
const value = await device.readData('Temperature');

// 4. Disconnect when done
await device.disconnect();
```

### Continuous Reading Loop

```javascript
let isReading = true;

async function readLoop() {
  while (isReading && device.isConnected()) {
    const value = await device.readData('Force');
    updateDisplay(value);
    await new Promise(r => setTimeout(r, 50)); // 20 Hz
  }
}

// Start reading
readLoop();

// Stop reading
isReading = false;
```

### Connect by Device ID

If you know your device's ID (shown on the device or in previous connections):

```javascript
await device.connectById('055-808');
```

### Check Browser Support

```javascript
import { checkBrowserSupport, isWebBluetoothSupported } from 'pasco-ble';

// Simple check
if (!isWebBluetoothSupported()) {
  alert('Please use Chrome or Edge');
}

// Detailed check
const support = checkBrowserSupport();
if (!support.supported) {
  console.log(support.message);  // Helpful error message
  console.log(support.browser);  // Detected browser name
}
```

### Discover Available Measurements

```javascript
// Get all measurements
const measurements = device.getMeasurementList();
console.log(measurements);  // ['Temperature', 'Force', 'Acceleration-x', ...]

// Get unit for a measurement
const unit = device.getMeasurementUnit('Temperature');
console.log(unit);  // '°C'
```

### Read Multiple Measurements

```javascript
const values = await device.readDataList(['Force', 'Acceleration-x', 'Acceleration-y']);
console.log(values);  // [12.5, 0.98, -0.02]
```

### Handle Disconnection

```javascript
// Clean disconnect on page unload
window.addEventListener('beforeunload', async () => {
  if (device.isConnected()) {
    await device.disconnect();
  }
});
```

---

## API Quick Reference

### PASCOBLEDevice

| Method | Description |
|--------|-------------|
| `scan(filter?)` | Scan for devices, optionally filter by name |
| `connect(bleDevice)` | Connect to a scanned device |
| `connectById(id)` | Connect by 6-digit device ID |
| `disconnect()` | Disconnect from device |
| `isConnected()` | Check connection status |
| `getMeasurementList()` | Get available measurements |
| `getMeasurementUnit(name)` | Get unit for measurement |
| `readData(name)` | Read single measurement |
| `readDataList(names)` | Read multiple measurements |

### CodeNodeDevice (extends PASCOBLEDevice)

| Method | Description |
|--------|-------------|
| `setLedInArray(x, y, intensity)` | Set single LED (0-4, 0-4, 0-255) |
| `setLedsInArray(coords, intensity)` | Set multiple LEDs |
| `showImageInArray(icon)` | Display preset icon |
| `scrollTextInArray(text)` | Scroll text across matrix |
| `setRgbLed(r, g, b)` | Set RGB LED color (0-255 each) |
| `setSoundFrequency(hz)` | Play tone (0 to stop) |
| `reset()` | Turn off all outputs |

### ControlNodeDevice (extends PASCOBLEDevice)

| Method | Description |
|--------|-------------|
| `rotateStepperContinuously(port, speed, accel)` | Continuous rotation |
| `rotateSteppersThrough(...)` | Rotate specific angle |
| `stopSteppers(decelA, decelB)` | Stop with deceleration |
| `setServo(port, type, value)` | Control servo |
| `setSoundFrequency(hz)` | Play tone |
| `readData(name, port?)` | Read with optional port |

---

## Creating Your Own Examples

### Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>My PASCO Example</title>
  <link rel="stylesheet" href="common.css">
  <script type="importmap">
  {
    "imports": {
      "pasco-ble": "https://esm.sh/pasco-ble"
    }
  }
  </script>
</head>
<body>
  <header>
    <h1>My PASCO Example</h1>
    <div id="status" class="status disconnected">Disconnected</div>
  </header>

  <main>
    <section class="card">
      <h2>Controls</h2>
      <button id="connectBtn">Connect</button>
      <button id="disconnectBtn" disabled>Disconnect</button>
    </section>

    <section class="card">
      <h2>Data</h2>
      <div id="output">--</div>
    </section>
  </main>

  <script type="module">
    import { PASCOBLEDevice, isWebBluetoothSupported } from 'pasco-ble';
    import { setStatus, showError, setupDisconnectOnUnload } from './common.js';

    // Check browser support
    if (!isWebBluetoothSupported()) {
      showError('Web Bluetooth not supported. Use Chrome or Edge.');
    }

    const device = new PASCOBLEDevice();
    let isReading = false;

    document.getElementById('connectBtn').onclick = async () => {
      try {
        const devices = await device.scan();
        if (devices.length > 0) {
          await device.connect(devices[0]);
          setStatus('connected', 'Connected');
          document.getElementById('connectBtn').disabled = true;
          document.getElementById('disconnectBtn').disabled = false;
          startReading();
        }
      } catch (err) {
        showError(err.message);
      }
    };

    document.getElementById('disconnectBtn').onclick = async () => {
      isReading = false;
      await device.disconnect();
      setStatus('disconnected', 'Disconnected');
      document.getElementById('connectBtn').disabled = false;
      document.getElementById('disconnectBtn').disabled = true;
    };

    async function startReading() {
      isReading = true;
      while (isReading && device.isConnected()) {
        try {
          const value = await device.readData('Temperature');
          const unit = device.getMeasurementUnit('Temperature');
          document.getElementById('output').textContent = `${value.toFixed(2)} ${unit}`;
        } catch (err) {
          // Handle read errors
        }
        await new Promise(r => setTimeout(r, 100));
      }
    }

    // Clean disconnect on page close
    setupDisconnectOnUnload(device);
  </script>
</body>
</html>
```

### Using common.js Utilities

```javascript
import {
  setStatus,           // Update status indicator
  showError,           // Show error notification
  createLogger,        // Create logging function
  formatNumber,        // Format numbers
  calculateStats,      // Compute statistics
  setupDisconnectOnUnload,  // Auto-disconnect on close
  hexToRgb,            // Color conversion
  debounce,            // Debounce function
  throttle,            // Throttle function
  clamp,               // Clamp value to range
} from './common.js';
```

---

## Contributing

### Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting JavaScript, JSON, and CSS files.

```bash
# Check for issues (run before committing)
npm run check

# Auto-fix all fixable issues
npm run check:fix
```

### Code Style

The project enforces consistent code style:

- **JavaScript**: Single quotes, semicolons, 2-space indentation, trailing commas
- **CSS**: 2-space indentation, double quotes
- **JSON**: 2-space indentation
- **Line endings**: LF (Unix-style)

### CI Pipeline

Pull requests are automatically checked by the CI pipeline:

1. **Lint** - Runs Biome checks
2. **Validate** - Verifies required files exist
3. **Deploy** - Deploys to GitHub Pages (main branch only)

---

## Resources

- **pasco-ble npm**: [npmjs.com/package/pasco-ble](https://www.npmjs.com/package/pasco-ble)
- **Library source**: [github.com/veillette/pascoTS](https://github.com/veillette/pascoTS)
- **Web Bluetooth**: [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- **Chart.js**: [chartjs.org](https://www.chartjs.org/)
- **Plotly.js**: [plotly.com/javascript](https://plotly.com/javascript/)
- **Biome**: [biomejs.dev](https://biomejs.dev/)
