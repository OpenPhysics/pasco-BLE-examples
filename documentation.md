# Examples Documentation

Detailed guide to the PASCO BLE examples and how to use the [pasco-ble](https://www.npmjs.com/package/pasco-ble) library in your own projects.

## Contents

- [Getting Started](#getting-started)
- [Example Descriptions](#example-descriptions)
- [Using the Library](#using-the-library)
- [Web Components](#web-components)
- [Shared Helpers](#shared-helpers)
- [Creating Your Own Examples](#creating-your-own-examples)

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

Serve the examples over HTTP (`npm run serve`) rather than double-clicking the `.html` files: the pages import `common.js` and `components.js` as ES modules, which browsers block on `file://` URLs.

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

**Purpose**: Position tracking with the Wireless Motion Sensor.

**Features**:
- Large position display
- All available measurements shown
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
    "pasco-ble": "https://esm.sh/pasco-ble@0.3.70"
  }
}
</script>

<script type="module">
  import { PASCOBLEDevice } from 'pasco-ble';
  // Your code here
</script>
```

### Available Exports

See the [pascoTS README](https://github.com/OpenPhysics/pascoTS#readme) for the full `pasco-ble` API (devices, error classes, LED icons, browser-support helpers).

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

## Shared Helpers (`examples/common.js`)

Every example imports its shared helpers and constants from `examples/common.js`. The JSDoc there is the reference; this is the map.

| Area | Exports |
|---|---|
| Status / errors | `setStatus`, `showError`, `createLogger`, `escapeHtml` |
| Browser support | `isWebBluetoothSupported`, `checkBrowserSupport` |
| Connection | `connectDevice`, `disconnectDevice`, `setupDisconnectOnUnload`, `createAutoReconnect` |
| Data | `calculateStats`, `formatNumber`, `exportToCSV`, `generateExportFilename`, `createDataPlayback`, `createSampleRateTracker` |
| Charts | `createThrottledChartUpdater` |
| UI | `createKeyboardShortcuts`, `createShortcutsHelp`, `createConnectionQualityIndicator`, `createPreferences` |
| General | `delay`, `debounce`, `throttle`, `clamp`, `hexToRgb` |
| Constants | `READ_INTERVAL_MS`, `CHART_UPDATE_INTERVAL_MS`, `ERROR_DISPLAY_DURATION_MS`, `DEFAULT_SAMPLE_RATE_HZ`, `MAX_CHART_POINTS`, `RECONNECT_MAX_ATTEMPTS`, `RECONNECT_BASE_DELAY_MS` |

The more involved helpers (auto-reconnect, data playback, keyboard shortcuts) are used by `smart-cart.html`, `multi-sensor-graph.html` and `sensor-xy-graph.html`; read those for working usage.

Accessibility conventions followed by all examples: semantic landmarks, a skip link, ARIA live regions for status and readings, and keyboard access to every control. The web components in `components.js` already provide these, so new pages that use them get them for free.

---

## Creating Your Own Examples

### Template

Copy `examples/basic-usage.html` and adjust it; it is the smallest page that uses the web components, `common.js` and the `pasco-ble` import map.

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

## Resources

- **pasco-ble npm**: [npmjs.com/package/pasco-ble](https://www.npmjs.com/package/pasco-ble)
- **Library source**: [github.com/OpenPhysics/pascoTS](https://github.com/OpenPhysics/pascoTS)
- **Web Bluetooth**: [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
- **Chart.js**: [chartjs.org](https://www.chartjs.org/)
- **Plotly.js**: [plotly.com/javascript](https://plotly.com/javascript/)
