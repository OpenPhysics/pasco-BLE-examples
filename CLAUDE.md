# CLAUDE.md

This file provides guidance for AI assistants working on the pasco-ble-examples codebase.

## Project Overview

This repository contains **browser examples** demonstrating how to use the [pasco-ble](https://www.npmjs.com/package/pasco-ble) npm package for PASCO wireless BLE sensors.

**Important:** This is NOT the library source code. The library is maintained at [veillette/pascoTS](https://github.com/veillette/pascoTS). This repository only contains usage examples.

## Quick Reference

```bash
npm run serve      # Start local server to view examples
npm run start      # Alias for serve
```

## Repository Structure

```
pasco-BLE-examples/
├── examples/
│   ├── common.css          # Shared styles
│   ├── common.js           # Shared utility functions
│   ├── basic-usage.html    # Entry-level example
│   ├── force-sensor.html   # Force sensor demo
│   ├── motion-sensor.html  # Motion sensor demo
│   ├── code-node.html      # Code.Node controller
│   ├── control-node.html   # Control.Node controller
│   ├── sensor-xy-graph.html    # X-Y parametric plotting
│   ├── multi-sensor-graph.html # Multi-device graphing
│   └── smart-cart.html     # 3D visualization
├── package.json            # Examples package config
├── README.md               # User documentation
├── documentation.md        # Detailed examples guide
└── CLAUDE.md               # This file
```

## Working with Examples

### Key Files

- **examples/common.css**: Shared styles for all examples (responsive layouts, cards, status indicators)
- **examples/common.js**: Utility functions (setStatus, showError, createLogger, formatNumber, etc.)
- **examples/*.html**: Individual example files, each self-contained

### How Examples Load the Library

Examples use ES module imports via importmap to load `pasco-ble` from CDN:

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
  // Example code
</script>
```

### External Libraries Used

- **Chart.js** - For time-series and scatter plots
- **Plotly.js** - For 3D visualizations
- **expr-eval** - For safe equation evaluation

## Guidelines for AI Assistants

1. **Do not modify library code** - This repo only contains examples
2. **Examples should be self-contained** - Each HTML file should work independently
3. **Use CDN imports** - Don't add build steps; examples should work by opening HTML files directly
4. **Follow existing patterns** - Use common.css and common.js utilities
5. **Test in Chrome/Edge** - Web Bluetooth only works in Chromium browsers

## Resources

- **pasco-ble npm**: https://www.npmjs.com/package/pasco-ble
- **pasco-ble source**: https://github.com/veillette/pascoTS
- **CDN**: https://esm.sh/pasco-ble or https://unpkg.com/pasco-ble/dist/index.js
