# AGENTS.md

This file provides guidance for AI assistants working on the pasco-ble-examples codebase.

## Project Overview

This repository contains **browser examples** demonstrating how to use the [pasco-ble](https://www.npmjs.com/package/pasco-ble) npm package for PASCO wireless BLE sensors.

**Important:** This is NOT the library source code. The library is maintained at [OpenPhysics/pascoTS](https://github.com/OpenPhysics/pascoTS). This repository only contains usage examples.

## Quick Reference

```bash
npm run serve      # Start local server to view examples
npm run start      # Alias for serve
npm run check      # Run Biome linting and formatting checks
npm run check:fix  # Auto-fix linting and formatting issues
npm run lint       # Run linting only
npm run format     # Run formatting only (with auto-fix)
```

## Repository Structure

```
pasco-BLE-examples/
├── .github/
│   └── workflows/
│       └── ci.yml              # CI pipeline (lint, validate, deploy)
├── examples/
│   ├── index.html              # Main navigation page
│   ├── common.css              # Shared styles
│   ├── common.js               # Shared utility functions
│   ├── components.js           # Reusable web components
│   ├── basic-usage.html        # Entry-level example
│   ├── force-sensor.html       # Force sensor demo
│   ├── motion-sensor.html      # Motion sensor demo
│   ├── code-node.html          # Code.Node controller
│   ├── control-node.html       # Control.Node controller
│   ├── sensor-xy-graph.html    # X-Y parametric plotting
│   ├── multi-sensor-graph.html # Multi-device graphing
│   └── smart-cart.html         # 3D visualization
├── biome.json                  # Biome linter/formatter config
├── package.json                # Examples package config
├── README.md                   # User documentation
├── documentation.md            # Detailed examples guide
└── AGENTS.md                   # This file
```

## Linting and Formatting

This project uses [Biome](https://biomejs.dev/) for linting and formatting JavaScript, JSON, and CSS files.

### Running Checks

```bash
npm install        # Install dependencies (including Biome)
npm run check      # Check for issues (CI runs this)
npm run check:fix  # Auto-fix all fixable issues
```

### Biome Configuration

The `biome.json` configures strict linting with all recommended rules enabled:

- **JavaScript**: Single quotes, semicolons, 2-space indent, trailing commas
- **CSS**: 2-space indent, double quotes
- **JSON**: 2-space indent, no trailing commas
- **Line endings**: LF enforced

Key rule customizations:
- `noConsole`: off (examples need console output)
- `useNamingConvention`: warns but allows acronyms (e.g., `exportToCSV`)
- `noExcessiveCognitiveComplexity`: warns at complexity > 15

### Before Committing

Always run `npm run check` before committing to ensure code passes CI.

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
    "pasco-ble": "https://esm.sh/pasco-ble@0.3.70"
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
3. **Use CDN imports** - Don't add a build step; serve the static examples with `npm run serve`
4. **Follow existing patterns** - Use common.css and common.js utilities
5. **Test in Chrome/Edge** - Web Bluetooth only works in Chromium browsers
6. **Run linting before committing** - Use `npm run check` to verify code quality
7. **Keep functions simple** - Avoid cognitive complexity > 15

## CI Pipeline

The GitHub Actions CI pipeline runs on PRs and pushes to main:

1. **Lint** - Runs Biome checks (`npm run check`)
2. **Validate** - Checks required files, HTML, and internal links
3. **Accessibility** - Non-blocking pa11y audit
4. **Deploy** - Deploys to GitHub Pages (main branch only)

## Resources

- **pasco-ble npm**: https://www.npmjs.com/package/pasco-ble
- **pasco-ble source**: https://github.com/OpenPhysics/pascoTS
- **CDN**: https://esm.sh/pasco-ble@0.3.70
- **Biome docs**: https://biomejs.dev/
