# PASCO BLE Examples

[![Web Bluetooth](https://img.shields.io/badge/Web%20Bluetooth-required-blue)](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)
[![pasco-ble](https://img.shields.io/npm/v/pasco-ble?label=pasco-ble)](https://www.npmjs.com/package/pasco-ble)

Browser examples demonstrating the [pasco-ble](https://www.npmjs.com/package/pasco-ble) library for PASCO wireless BLE sensors. Create interactive science experiments, data collection applications, and educational tools using Web Bluetooth!

> **Note:** These examples use the `pasco-ble` npm package. For library documentation and API reference, see the [pasco-ble repository](https://github.com/veillette/pascoTS).

## Quick Start

1. Open any `.html` file directly in **Chrome** or **Edge**
2. Click "Connect" to scan for PASCO devices
3. Select your sensor from the browser's Bluetooth dialog

**No build step required** - examples load the library from CDN via ES modules.

### Local Development

```bash
# Clone the repository
git clone https://github.com/veillette/pasco-BLE-examples.git
cd pasco-BLE-examples

# Install dependencies
npm install

# Start a local server
npm run serve
```

Then open `http://localhost:3000/examples/` in Chrome or Edge.

## Examples

| Example | Description | Hardware |
|---------|-------------|----------|
| [basic-usage.html](examples/basic-usage.html) | Connect and read all measurements | Any PASCO sensor |
| [force-sensor.html](examples/force-sensor.html) | Large force display with all measurements | Wireless Force Acceleration |
| [motion-sensor.html](examples/motion-sensor.html) | Position and velocity tracking | Wireless Motion Sensor |
| [code-node.html](examples/code-node.html) | LED matrix, RGB LED, speaker control | Code.Node |
| [control-node.html](examples/control-node.html) | Stepper motors, servos, speaker | Control.Node |
| [sensor-xy-graph.html](examples/sensor-xy-graph.html) | Parametric X-Y plotting with Chart.js | Any PASCO sensor |
| [multi-sensor-graph.html](examples/multi-sensor-graph.html) | Multiple sensors on one graph | Multiple sensors |
| [smart-cart.html](examples/smart-cart.html) | 3D position-velocity-time plot with Plotly | Wireless Smart Cart |

## Requirements

- **Browser**: Chrome 56+ or Edge 79+ (Web Bluetooth API required)
- **Connection**: HTTPS or localhost (Web Bluetooth requirement)
- **Hardware**: PASCO Wireless BLE sensor(s)
- **Sensors**: Must be powered on with blinking red light (ready to connect)

### Browser Compatibility

| Browser | Support | Minimum Version | Platforms |
|---------|---------|-----------------|-----------|
| Chrome | Supported | 56+ | Windows, macOS, Linux, Android |
| Edge | Supported | 79+ | Windows, macOS |
| Opera | Supported | 43+ | Windows, macOS, Linux |
| Firefox | Not supported | - | - |
| Safari | Not supported | - | - |

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

## How It Works

Examples use ES module imports via importmap to load `pasco-ble` from CDN:

```html
<!DOCTYPE html>
<html>
<head>
  <script type="importmap">
  {
    "imports": {
      "pasco-ble": "https://esm.sh/pasco-ble"
    }
  }
  </script>
</head>
<body>
  <button id="connect">Connect to Sensor</button>
  <div id="output"></div>

  <script type="module">
    import { PASCOBLEDevice } from 'pasco-ble';

    document.getElementById('connect').onclick = async () => {
      const sensor = new PASCOBLEDevice();

      // Scan opens browser's device picker
      const devices = await sensor.scan();

      if (devices.length > 0) {
        await sensor.connect(devices[0]);

        // Read temperature
        const temp = await sensor.readData('Temperature');
        const units = sensor.getMeasurementUnit('Temperature');

        document.getElementById('output').textContent = `${temp} ${units}`;

        await sensor.disconnect();
      }
    };
  </script>
</body>
</html>
```

### Alternative: Using unpkg CDN

```html
<script type="module">
  import { PASCOBLEDevice } from 'https://unpkg.com/pasco-ble/dist/index.js';
  // ...
</script>
```

## Project Structure

```
pasco-BLE-examples/
├── examples/
│   ├── common.css          # Shared styles for all examples
│   ├── common.js           # Shared utility functions
│   ├── basic-usage.html    # Entry-level example
│   ├── force-sensor.html   # Force sensor demo
│   ├── motion-sensor.html  # Motion sensor demo
│   ├── code-node.html      # Code.Node controller
│   ├── control-node.html   # Control.Node controller
│   ├── sensor-xy-graph.html    # X-Y parametric plotting
│   ├── multi-sensor-graph.html # Multi-device graphing
│   └── smart-cart.html     # 3D visualization
├── package.json
└── README.md
```

## Shared Assets

### common.css

Unified styling with:
- Responsive layouts (mobile, tablet, desktop)
- Card-based UI components
- Status indicators and buttons
- Chart and graph containers

### common.js

Utility functions for examples:
- `setStatus()` - Update connection status indicator
- `showError()` - Display error messages with auto-dismiss
- `createLogger()` - Console-style logging to DOM
- `formatNumber()` - Format numbers with fixed decimals
- `calculateStats()` - Compute min/max/mean statistics
- `setupDisconnectOnUnload()` - Clean disconnect on page unload
- `hexToRgb()` - Color conversion for LED control
- `debounce()` / `throttle()` - Function rate limiting
- `clamp()` - Value bounds clamping

## External Libraries

Some examples use additional charting libraries loaded from CDN:
- **Chart.js** - Time series and scatter plots (`sensor-xy-graph.html`, `multi-sensor-graph.html`)
- **Plotly.js** - 3D scatter plots (`smart-cart.html`)
- **expr-eval** - Safe equation evaluation (`sensor-xy-graph.html`)

## Troubleshooting

### Web Bluetooth not working

- **Browser**: Use Chrome, Edge, or Opera (Web Bluetooth required)
- **HTTPS**: Page must be served over HTTPS (localhost works for development)
- **Bluetooth**: Check that Bluetooth is enabled on your computer
- **User Gesture**: Connect must be initiated by a button click, not on page load
- **Permissions**: Browser may prompt for Bluetooth permissions

### Device not found during scan

- **Red Light Blinking**: Device should have a red blinking light (ready to connect)
- **Green Light**: If solid green, device is already connected elsewhere
- **Reset Device**: Hold power button to turn off, then press to turn on again
- **Range**: Ensure you're within Bluetooth range (typically 10-30 feet)

### Connection drops or times out

- **Distance**: Move closer to the device
- **Other Connections**: Ensure no other application is connected to the device
- **Browser Tab**: Keep the browser tab active (some browsers throttle background tabs)

## Resources

- **pasco-ble npm package**: [npmjs.com/package/pasco-ble](https://www.npmjs.com/package/pasco-ble)
- **pasco-ble library source**: [github.com/veillette/pascoTS](https://github.com/veillette/pascoTS)
- **CDN (esm.sh)**: [esm.sh/pasco-ble](https://esm.sh/pasco-ble)
- **CDN (unpkg)**: [unpkg.com/pasco-ble](https://unpkg.com/pasco-ble/dist/index.js)
- **PASCO Python library**: [github.com/PASCOscientific/pasco_python](https://github.com/PASCOscientific/pasco_python)
- **Web Bluetooth API**: [MDN Web Docs](https://developer.mozilla.org/en-US/docs/Web/API/Web_Bluetooth_API)

## License

See [LICENSE](LICENSE) for details.

**Copyright (c) 2024 Martin Veillette**

This repository contains examples for personal, non-commercial, and educational use.

### Acknowledgments

- **pasco-ble library**: [veillette/pascoTS](https://github.com/veillette/pascoTS)
- **PASCO Scientific**: [pasco.com](https://www.pasco.com)
- PASCO is a registered trademark of PASCO Scientific
