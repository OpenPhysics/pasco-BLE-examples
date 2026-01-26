# PASCO BLE Examples

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Try%20Now-blue?style=for-the-badge&logo=github)](https://phasematching.github.io/pasco-BLE-examples/examples/)

Browser examples demonstrating the [pasco-ble](https://www.npmjs.com/package/pasco-ble) library for PASCO wireless BLE sensors.

> **Note:** These examples use the `pasco-ble` npm package. For library documentation and API reference, see the [pasco-ble repository](https://github.com/veillette/pascoTS).# PASCO BLE Examples

**Live Demo:** [phasematching.github.io/pasco-BLE-examples/examples/](https://phasematching.github.io/pasco-BLE-examples/examples/)

## Quick Start for Developers

1. Open any `.html` file directly in Chrome or Edge
2. Click "Connect" to scan for PASCO devices
3. Select your sensor from the browser's Bluetooth dialog

No build step required - examples load the library from CDN via ES modules.

### Local Development

```bash
git clone https://github.com/phasematching/pasco-BLE-examples.git
cd pasco-BLE-examples
npm install
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

- **Browser**: Chrome or Edge (Web Bluetooth API required)
- **Connection**: HTTPS or localhost
- **Hardware**: PASCO Wireless BLE sensor(s)
- **Sensors**: Must be powered on with blinking red light (ready to connect)

## Project Structure

```
pasco-BLE-examples/
├── examples/
│   ├── index.html          # Main navigation page
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

## How Examples Load the Library

Examples use ES module imports via importmap:

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
    // ... your code
</script>
```

## Shared Assets

### common.css

Unified styling with:
- Responsive layouts (mobile, tablet, desktop)
- Card-based UI components
- Status indicators and buttons
- Chart and graph containers

### common.js

Utility functions:
- `setStatus()` - Update connection status indicator
- `showError()` - Display error messages with auto-dismiss
- `createLogger()` - Console-style logging to DOM
- `formatNumber()` - Format numbers with fixed decimals
- `calculateStats()` - Compute min/max/mean statistics
- `setupDisconnectOnUnload()` - Clean disconnect on page unload
- `hexToRgb()` - Color conversion for LED control
- `debounce()` / `throttle()` - Function rate limiting

## External Libraries

Some examples use additional charting libraries loaded from CDN:
- **Chart.js** - Time series and scatter plots
- **Plotly.js** - 3D scatter plots
- **expr-eval** - Safe equation evaluation

## Troubleshooting

### Device not found during scan

- **Red Light Blinking**: Device should have a red blinking light (ready to connect)
- **Green Light**: If solid green, device is already connected elsewhere
- **Reset Device**: Hold power button to turn off, then press to turn on again

### Connection drops

- **Distance**: Move closer to the device
- **Browser Tab**: Keep the browser tab active (browsers throttle background tabs)

## Resources

- **pasco-ble npm**: [npmjs.com/package/pasco-ble](https://www.npmjs.com/package/pasco-ble)
- **pasco-ble source**: [github.com/veillette/pascoTS](https://github.com/veillette/pascoTS)
- **CDN**: [esm.sh/pasco-ble](https://esm.sh/pasco-ble)

## License

See [LICENSE](LICENSE) for details.
