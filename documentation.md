# Examples Documentation

Detailed guide to the PASCO BLE examples and how to use the [pasco-ble](https://www.npmjs.com/package/pasco-ble) library in your own projects.

## Contents

- [Getting Started](#getting-started)
- [Example Descriptions](#example-descriptions)
- [Using the Library](#using-the-library)
- [Web Components](#web-components)
- [Utility Functions](#utility-functions)
- [Constants](#constants)
- [Common Patterns](#common-patterns)
- [Advanced Features](#advanced-features)
- [Accessibility](#accessibility)
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
git clone https://github.com/OpenPhysics/pasco-BLE-examples.git
cd pasco-BLE-examples

# Install dependencies
npm install

# Start local server
npm run serve
```

Open `http://localhost:3000/examples/` in your browser.

### Development Commands

**Note:** Run `npm install` first to install dependencies before using these commands.

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

## Web Components

The examples use custom Web Components (defined in `components.js`) for common UI patterns. Import them in your HTML:

```html
<script type="module">
  import './components.js';
</script>
```

### Connection Panel

Connection controls with status indicator, connect/disconnect buttons, and optional quality indicator.

```html
<pasco-connection-panel
  device-name="Force Sensor"
  show-quality>
</pasco-connection-panel>
```

**Attributes:**
- `device-name` - Display name for the connect button (default: "PASCO Device")
- `show-quality` - Show connection quality indicator container

**Events:**
- `connect` - Fired when connect button is clicked
- `disconnect` - Fired when disconnect button is clicked

**Methods:**
```javascript
const panel = document.querySelector('pasco-connection-panel');

// Set connection status
panel.setStatus('disconnected', 'Disconnected');
panel.setStatus('connecting', 'Connecting...');
panel.setStatus('connected', 'Connected: Device Name');

// Quality indicator
panel.showQualityIndicator();
panel.hideQualityIndicator();

// Disable connect (e.g., unsupported browser)
panel.disableConnect();
```

---

### Console Log

Console-style log output display.

```html
<pasco-console-log></pasco-console-log>
```

**Methods:**
```javascript
const consoleLog = document.querySelector('pasco-console-log');

// Log messages
consoleLog.log('Connected to device');
consoleLog.log('Reading data...');

// Clear all entries
consoleLog.clear();

// Create a bound logger function
const log = consoleLog.createLogger();
log('This is a log message');
```

---

### Error Display

Error message display with auto-dismiss.

```html
<pasco-error-display></pasco-error-display>
```

**Methods:**
```javascript
const errorDisplay = document.querySelector('pasco-error-display');

// Show error (auto-dismisses after 5 seconds by default)
errorDisplay.show('Connection failed');

// Show error with custom duration (in ms)
errorDisplay.show('Read error', 3000);

// Show persistent error (duration = 0)
errorDisplay.show('Critical error', 0);

// Manually clear error
errorDisplay.clear();

// Create a bound showError function
const showError = errorDisplay.createShowError();
showError('Something went wrong');
```

---

### Browser Warning

Browser support warning banner (hidden by default).

```html
<pasco-browser-warning></pasco-browser-warning>
```

**Methods:**
```javascript
const browserWarning = document.querySelector('pasco-browser-warning');

// Check support and show warning if needed
if (!browserWarning.check()) {
  // Browser not supported - disable connect, etc.
  connectionPanel.disableConnect();
}
```

---

### Measurements List

Display list of sensor measurements with values and units.

```html
<pasco-measurements-list title="Sensor Readings"></pasco-measurements-list>
```

**Attributes:**
- `title` - Section heading (default: "Available Measurements")

**Methods:**
```javascript
const measurementsList = document.querySelector('pasco-measurements-list');

// Show/hide the measurements card
measurementsList.show();
measurementsList.hide();

// Update measurements
measurementsList.update([
  { name: 'Force', value: '12.34', unit: 'N' },
  { name: 'Acceleration X', value: '0.98', unit: 'm/s²' },
]);

// Clear display
measurementsList.clear();
```

---

### Primary Reading

Large display for a single primary measurement.

```html
<pasco-primary-reading
  label="Force"
  unit="N">
</pasco-primary-reading>
```

**Attributes:**
- `label` - Measurement label (default: "Value")
- `unit` - Measurement unit

**Methods:**
```javascript
const reading = document.querySelector('pasco-primary-reading');

// Update value
reading.setValue('12.34');
reading.setValue(12.34);  // Numbers are also accepted

// Update unit
reading.setUnit('kg');

// Reset to default
reading.reset();  // Shows "--"
```

---

### Page Footer

Footer with about section, using slots for customization.

```html
<pasco-page-footer>
  <span slot="description">This example demonstrates basic sensor usage.</span>
  <ul slot="features">
    <li>Connect to any PASCO sensor</li>
    <li>Read all available measurements</li>
    <li>Real-time display</li>
  </ul>
  <ul slot="requirements">
    <li>Chrome or Edge browser</li>
    <li>PASCO Wireless sensor</li>
  </ul>
</pasco-page-footer>
```

**Slots:**
- `description` - Description text
- `features` - Feature list (typically `<ul>`)
- `requirements` - Requirements list (typically `<ul>`)

---

## Utility Functions

Import utility functions from `common.js`:

```javascript
import {
  // Status and Error
  setStatus,
  showError,
  createLogger,
  escapeHtml,

  // Browser Support
  isWebBluetoothSupported,
  checkBrowserSupport,

  // Connection Helpers
  connectDevice,
  disconnectDevice,
  setupDisconnectOnUnload,

  // Data
  formatNumber,
  calculateStats,
  exportToCSV,
  generateExportFilename,

  // Utilities
  delay,
  hexToRgb,
  debounce,
  throttle,
  clamp,

  // Advanced
  createAutoReconnect,
  createThrottledChartUpdater,
  createPreferences,
  createDataPlayback,
  createKeyboardShortcuts,
  createShortcutsHelp,
  createSampleRateTracker,
  createConnectionQualityIndicator,
} from './common.js';
```

### Status and Error Handling

```javascript
// Set connection status on an element
setStatus(statusElement, 'connected', 'Connected to Device');
// Status types: 'disconnected', 'connecting', 'connected'

// Show error message in a container
showError(container, 'Connection failed', 5000);
// Duration 0 = persistent (no auto-dismiss)

// Create a logger for console-style output
const log = createLogger(logElement);
log('Connected!');
log('Reading sensor data...');

// Escape HTML to prevent XSS
const safe = escapeHtml(userInput);
```

### Browser Support

```javascript
// Simple check
if (!isWebBluetoothSupported()) {
  alert('Please use Chrome or Edge');
}

// Check and auto-show warning
const supported = checkBrowserSupport('warning-container-id');
if (!supported) {
  // Warning banner is automatically displayed
  connectBtn.disabled = true;
}
```

### Connection Helpers

```javascript
// Connect with standard error handling
const device = await connectDevice(PASCOBLEDevice, {
  filter: 'Force',  // Optional device name filter
  onStatus: (status, text) => panel.setStatus(status, text),
  onLog: (message) => console.log(message),
  onError: (message) => errorDisplay.show(message),
});

// Disconnect safely
await disconnectDevice(device, {
  onStatus: (status, text) => panel.setStatus(status, text),
  onLog: (message) => console.log(message),
});

// Auto-disconnect on page close
setupDisconnectOnUnload(() => device);
```

### Data Utilities

```javascript
// Format numbers with fixed decimals
formatNumber(3.14159, 2);        // "3.14"
formatNumber(null, 2);           // "--"
formatNumber(undefined, 2, 'N/A'); // "N/A"

// Calculate statistics
const stats = calculateStats([1, 2, 3, 4, 5]);
// { min: 1, max: 5, mean: 3, count: 5 }

// Export data to CSV
exportToCSV(dataPoints, ['time', 'force', 'position'], 'sensor-data.csv');

// Generate timestamped filename
const filename = generateExportFilename('force-data', 'csv');
// "force-data_2024-01-15T10-30-45.csv"
```

### General Utilities

```javascript
// Async delay
await delay(1000); // Wait 1 second

// Convert hex color to RGB
const rgb = hexToRgb('#ff5500');
// { r: 255, g: 85, b: 0 }

// Debounce (delay execution until calls stop)
const debouncedSearch = debounce(search, 300);

// Throttle (limit execution rate)
const throttledUpdate = throttle(updateChart, 50);

// Clamp value to range
clamp(150, 0, 100);  // 100
clamp(-10, 0, 100);  // 0
```

---

## Constants

Import constants from `common.js` for consistent behavior across examples:

```javascript
import {
  READ_INTERVAL_MS,           // 100 - Default sensor read interval
  CHART_UPDATE_INTERVAL_MS,   // 50 - Default chart update interval
  ERROR_DISPLAY_DURATION_MS,  // 5000 - Default error message duration
  DEFAULT_SAMPLE_RATE_HZ,     // 10 - Default recording sample rate
  MAX_CHART_POINTS,           // 500 - Maximum chart data points
  RECONNECT_MAX_ATTEMPTS,     // 3 - Auto-reconnect attempts
  RECONNECT_BASE_DELAY_MS,    // 1000 - Initial reconnect delay
} from './common.js';
```

Use these constants to tune example behavior:

```javascript
// Reading loop with standard interval
async function readLoop() {
  while (isReading) {
    const value = await device.readData('Force');
    updateDisplay(value);
    await delay(READ_INTERVAL_MS);  // Consistent 100ms interval
  }
}

// Limit chart points
if (chartData.length > MAX_CHART_POINTS) {
  chartData.shift();
}
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
import { setupDisconnectOnUnload } from './common.js';

// Automatically disconnect when user closes/navigates away from page
setupDisconnectOnUnload(() => device);
```

---

## Advanced Features

### Auto-Reconnect

Automatically attempt to reconnect when connection is lost:

```javascript
import { createAutoReconnect } from './common.js';

const reconnect = createAutoReconnect({
  connect: async () => {
    // Your connection logic
    await device.connectById('055-808');
  },
  onReconnecting: (attempt, max) => {
    console.log(`Reconnecting... attempt ${attempt}/${max}`);
  },
  onReconnected: () => {
    console.log('Reconnected!');
    startReading();
  },
  onReconnectFailed: () => {
    showError('Could not reconnect. Please try manually.');
  },
  maxAttempts: 3,      // Default: 3
  baseDelay: 1000,     // Default: 1000ms, doubles each attempt
});

// Start reconnection attempts
reconnect.start();

// Stop trying to reconnect
reconnect.stop();

// Reset for future use
reconnect.reset();
```

---

### CSV Data Export

Export recorded data to CSV files:

```javascript
import { exportToCSV, generateExportFilename } from './common.js';

// Record data points
const dataPoints = [];
dataPoints.push({ time: 0, force: 10.5, position: 0.0 });
dataPoints.push({ time: 0.1, force: 11.2, position: 0.5 });
// ...

// Export with specific filename
exportToCSV(dataPoints, ['time', 'force', 'position'], 'my-data.csv');

// Export with timestamped filename
const filename = generateExportFilename('force-sensor', 'csv');
// "force-sensor_2024-01-15T10-30-45.csv"
exportToCSV(dataPoints, ['time', 'force', 'position'], filename);
```

---

### Data Playback

Review recorded data with playback controls:

```javascript
import { createDataPlayback } from './common.js';

const playback = createDataPlayback({
  getData: () => recordedDataPoints,
  onFrame: (point, index, time) => {
    // Update display with current data point
    updateChart(point);
    updateReadings(point);
  },
  onPlay: () => playBtn.textContent = 'Pause',
  onPause: () => playBtn.textContent = 'Play',
  onSeek: (index) => updateSlider(index),
  onEnd: () => console.log('Playback complete'),
  fps: 30,  // Playback frame rate
});

// Controls
playback.play();
playback.pause();
playback.toggle();        // Play/pause toggle
playback.seek(50);        // Jump to index 50
playback.seekPercent(50); // Jump to 50%
playback.setSpeed(2);     // 2x speed
playback.reset();         // Back to beginning

// Get state
playback.isPlaying();     // true/false
playback.getCurrentIndex();
playback.getProgress();   // 0-100 percent

// Clean up
playback.destroy();
```

---

### Keyboard Shortcuts

Add keyboard shortcuts to your examples:

```javascript
import { createKeyboardShortcuts, createShortcutsHelp } from './common.js';

const shortcuts = createKeyboardShortcuts();

// Register shortcuts
shortcuts.register(' ', () => playback.toggle(), 'Play/Pause');
shortcuts.register('r', () => startRecording(), 'Start Recording');
shortcuts.register('escape', () => stopRecording(), 'Stop Recording');
shortcuts.register('ctrl+s', () => exportData(), 'Export Data');

// Enable/disable temporarily
shortcuts.setEnabled(' ', false);

// Remove a shortcut
shortcuts.unregister('r');

// Display help panel
const footer = document.querySelector('pasco-page-footer');
createShortcutsHelp(shortcuts, footer.shortcutsContainer);

// Clean up
shortcuts.destroy();
```

---

### Throttled Chart Updates

Improve performance for high-frequency data:

```javascript
import { createThrottledChartUpdater, CHART_UPDATE_INTERVAL_MS } from './common.js';

const chart = new Chart(ctx, config);
const chartUpdater = createThrottledChartUpdater(chart, CHART_UPDATE_INTERVAL_MS);

// In your reading loop - call update() frequently
async function readLoop() {
  while (isReading) {
    const value = await device.readData('Force');
    chart.data.datasets[0].data.push({ x: time, y: value });

    // This batches updates to avoid overwhelming the chart
    chartUpdater.update();

    await delay(10); // Fast reading (100Hz)
  }
}

// Force immediate update when needed
chartUpdater.flush();

// Clean up when done
chartUpdater.destroy();
```

---

### Connection Quality Indicator

Monitor sample rate and connection quality:

```javascript
import { createConnectionQualityIndicator } from './common.js';

const panel = document.querySelector('pasco-connection-panel');
const quality = createConnectionQualityIndicator(panel.qualityContainer);

async function readLoop() {
  quality.start();

  while (isReading) {
    const value = await device.readData('Force');
    quality.recordSample();  // Call each time you read
    updateDisplay(value);
    await delay(READ_INTERVAL_MS);
  }

  quality.stop();
}
```

The indicator shows real-time sample rate (Hz) with color-coded quality:
- 🟢 Good: ≥80% of expected rate
- 🟡 Fair: 50-80% of expected rate
- 🔴 Poor: <50% of expected rate

---

### User Preferences

Store user preferences in localStorage:

```javascript
import { createPreferences } from './common.js';

const prefs = createPreferences('my-example-prefs', {
  // Default values
  chartColor: '#4285f4',
  autoConnect: false,
  sampleRate: 10,
});

// Get/set individual values
const color = prefs.get('chartColor');
prefs.set('autoConnect', true);

// Get/set all at once
const all = prefs.getAll();
prefs.setAll({ chartColor: '#ff0000', sampleRate: 20 });

// Reset to defaults
prefs.reset();

// Clear (remove from localStorage)
prefs.clear();
```

---

## Accessibility

The examples include accessibility features for inclusive design:

### Semantic HTML

Examples use proper semantic structure:

```html
<header>...</header>
<main id="main-content">
  <section class="card" aria-label="Connection controls">...</section>
  <section class="card" aria-label="Measurements">...</section>
</main>
<footer>...</footer>
```

### Skip Links

Navigate directly to main content:

```html
<a href="#main-content" class="skip-link">Skip to main content</a>
```

### ARIA Attributes

- `role="status"` for live-updating values
- `role="log"` for console output
- `role="alert"` for error messages
- `aria-live="polite"` for non-critical updates
- `aria-live="assertive"` for errors
- `aria-label` for descriptive element names

### Keyboard Navigation

- All interactive elements are keyboard accessible
- Focus indicators are visible (`:focus-visible` styles)
- Tab order follows logical reading order

### Screen Reader Support

- Dynamic content uses `aria-live` regions
- Status changes are announced
- Error messages are announced immediately

### Color Contrast

- Status colors (red, yellow, green) meet WCAG AA contrast
- Text colors are tested for readability

### Best Practices for New Examples

1. Use semantic HTML elements (`<header>`, `<main>`, `<section>`, `<nav>`)
2. Add `aria-label` to sections that need context
3. Use Web Components which include ARIA by default
4. Test with keyboard-only navigation
5. Avoid color as the only indicator (use text/icons too)

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

### Template (Using Web Components)

This is the recommended template using Web Components for consistent UI:

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
  <a href="#main-content" class="skip-link">Skip to main content</a>

  <header>
    <nav aria-label="Breadcrumb">
      <a href="index.html">Examples</a> &gt; My Example
    </nav>
    <h1>My PASCO Example</h1>
  </header>

  <!-- Browser support warning (shown if needed) -->
  <pasco-browser-warning></pasco-browser-warning>

  <!-- Error messages -->
  <pasco-error-display></pasco-error-display>

  <main id="main-content">
    <!-- Connection panel with status and buttons -->
    <pasco-connection-panel
      device-name="My Sensor"
      show-quality>
    </pasco-connection-panel>

    <!-- Primary reading display -->
    <pasco-primary-reading
      label="Temperature"
      unit="°C">
    </pasco-primary-reading>

    <!-- All measurements list -->
    <pasco-measurements-list></pasco-measurements-list>
  </main>

  <!-- Footer with about section -->
  <pasco-page-footer>
    <span slot="description">This example demonstrates basic sensor usage.</span>
    <ul slot="features">
      <li>Connect to any PASCO sensor</li>
      <li>Display real-time temperature</li>
      <li>Show all available measurements</li>
    </ul>
    <ul slot="requirements">
      <li>Chrome or Edge browser</li>
      <li>PASCO Wireless sensor</li>
    </ul>
  </pasco-page-footer>

  <script type="module">
    import { PASCOBLEDevice } from 'pasco-ble';
    import './components.js';
    import {
      setupDisconnectOnUnload,
      formatNumber,
      createConnectionQualityIndicator,
      READ_INTERVAL_MS,
    } from './common.js';

    // Get component references
    const browserWarning = document.querySelector('pasco-browser-warning');
    const errorDisplay = document.querySelector('pasco-error-display');
    const connectionPanel = document.querySelector('pasco-connection-panel');
    const primaryReading = document.querySelector('pasco-primary-reading');
    const measurementsList = document.querySelector('pasco-measurements-list');

    // Check browser support
    if (!browserWarning.check()) {
      connectionPanel.disableConnect();
    }

    // Setup quality indicator
    const quality = createConnectionQualityIndicator(connectionPanel.qualityContainer);

    let device = null;
    let isReading = false;

    // Handle connect
    connectionPanel.addEventListener('connect', async () => {
      try {
        connectionPanel.setStatus('connecting', 'Select your device...');

        device = new PASCOBLEDevice();
        const devices = await device.scan();

        if (devices.length === 0) {
          throw new Error('No device selected');
        }

        connectionPanel.setStatus('connecting', 'Connecting...');
        await device.connect(devices[0]);

        connectionPanel.setStatus('connected', `Connected: ${devices[0].name}`);
        connectionPanel.showQualityIndicator();

        startReading();
      } catch (err) {
        connectionPanel.setStatus('disconnected', 'Disconnected');
        if (!err.message.includes('cancelled')) {
          errorDisplay.show(err.message);
        }
      }
    });

    // Handle disconnect
    connectionPanel.addEventListener('disconnect', async () => {
      isReading = false;
      quality.stop();

      if (device) {
        await device.disconnect();
        device = null;
      }

      connectionPanel.setStatus('disconnected', 'Disconnected');
      connectionPanel.hideQualityIndicator();
      primaryReading.reset();
      measurementsList.hide();
    });

    async function startReading() {
      if (!device) return;

      isReading = true;
      measurementsList.show();
      quality.start();

      while (isReading && device.isConnected()) {
        try {
          // Read primary measurement
          const temp = await device.readData('Temperature');
          const unit = device.getMeasurementUnit('Temperature');
          primaryReading.setValue(formatNumber(temp, 2));
          primaryReading.setUnit(unit);

          // Read all measurements
          const measurementNames = device.getMeasurementList();
          const measurements = await Promise.all(
            measurementNames.map(async (name) => ({
              name,
              value: formatNumber(await device.readData(name), 3),
              unit: device.getMeasurementUnit(name),
            }))
          );
          measurementsList.update(measurements);

          quality.recordSample();
        } catch (err) {
          // Ignore read errors during normal operation
        }

        await new Promise((r) => setTimeout(r, READ_INTERVAL_MS));
      }
    }

    // Clean disconnect on page close
    setupDisconnectOnUnload(() => device);
  </script>
</body>
</html>
```

### Key Patterns

**1. Import Web Components:**
```javascript
import './components.js';
```

**2. Get component references:**
```javascript
const connectionPanel = document.querySelector('pasco-connection-panel');
const errorDisplay = document.querySelector('pasco-error-display');
```

**3. Use component events for connection:**
```javascript
connectionPanel.addEventListener('connect', async () => { /* ... */ });
connectionPanel.addEventListener('disconnect', async () => { /* ... */ });
```

**4. Use component methods for updates:**
```javascript
connectionPanel.setStatus('connected', 'Connected');
errorDisplay.show('Something went wrong');
primaryReading.setValue('12.34');
measurementsList.update([{ name: 'Force', value: '10.5', unit: 'N' }]);
```

**5. Auto-disconnect on page close:**
```javascript
setupDisconnectOnUnload(() => device);
```

---

## Contributing

### Code Quality

This project uses [Biome](https://biomejs.dev/) for linting and formatting JavaScript, JSON, and CSS files.

```bash
# Install dependencies (required first)
npm install

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
- **Library source**: [github.com/OpenPhysics/pascoTS](https://github.com/OpenPhysics/pascoTS)
- **Web Bluetooth**: [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- **Chart.js**: [chartjs.org](https://www.chartjs.org/)
- **Plotly.js**: [plotly.com/javascript](https://plotly.com/javascript/)
- **Biome**: [biomejs.dev](https://biomejs.dev/)
