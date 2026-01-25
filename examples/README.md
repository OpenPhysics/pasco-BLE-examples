# PASCO BLE Examples

Browser examples demonstrating the [pasco-ble](https://www.npmjs.com/package/pasco-ble) library for PASCO wireless BLE sensors.

## Quick Start

1. Open any `.html` file directly in Chrome or Edge
2. Click "Connect" to scan for PASCO devices
3. Select your sensor from the browser's Bluetooth dialog

No build step required - examples load the library from CDN via ES modules.

## Examples

| Example | Description | Hardware |
|---------|-------------|----------|
| [basic-usage.html](basic-usage.html) | Connect and read all measurements | Any PASCO sensor |
| [force-sensor.html](force-sensor.html) | Large force display with all measurements | Wireless Force Acceleration |
| [motion-sensor.html](motion-sensor.html) | Position and velocity tracking | Wireless Motion Sensor |
| [code-node.html](code-node.html) | LED matrix, RGB LED, speaker control | Code.Node |
| [control-node.html](control-node.html) | Stepper motors, servos, speaker | Control.Node |
| [sensor-xy-graph.html](sensor-xy-graph.html) | Parametric X-Y plotting with Chart.js | Any PASCO sensor |
| [multi-sensor-graph.html](multi-sensor-graph.html) | Multiple sensors on one graph | Multiple sensors |
| [smart-cart.html](smart-cart.html) | 3D position-velocity-time plot with Plotly | Wireless Smart Cart |

## Requirements

- **Browser**: Chrome or Edge (Web Bluetooth API required)
- **Hardware**: PASCO Wireless BLE sensor(s)
- **Connection**: Sensors must be powered on and in range

## Project Structure

```
examples/
├── common.css          # Shared styles for all examples
├── common.js           # Shared utility functions
├── basic-usage.html    # Entry-level example
├── force-sensor.html   # Force sensor demo
├── motion-sensor.html  # Motion sensor demo
├── code-node.html      # Code.Node controller
├── control-node.html   # Control.Node controller
├── sensor-xy-graph.html    # X-Y parametric plotting
├── multi-sensor-graph.html # Multi-device graphing
└── smart-cart.html     # 3D visualization
```

## Shared Assets

### common.css

Unified styling with:
- Responsive layouts (mobile, tablet, desktop)
- Semantic HTML structure support
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
- `clamp()` - Value bounds clamping

## How Examples Load the Library

Examples use ES module imports via importmap:

```html
<script type="importmap">
{
    "imports": {
        "pasco-ble": "https://esm.sh/pasco-ble",
        "expr-eval": "https://esm.sh/expr-eval@2.0.2"
    }
}
</script>

<script type="module">
    import { PASCOBLEDevice } from 'pasco-ble';
    // ... your code
</script>
```

## External Libraries

Some examples use additional charting libraries loaded from CDN:
- **Chart.js** - Time series and scatter plots (`sensor-xy-graph.html`, `multi-sensor-graph.html`)
- **Plotly.js** - 3D scatter plots (`smart-cart.html`)

## License

See [LICENSE](../LICENSE) in the main repository.
