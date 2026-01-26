# CLAUDE.md

This file provides guidance for AI assistants working on the pasco-ble codebase.

## Quick Reference

```bash
npm run build      # TypeScript compilation to dist/
npm run lint       # Biome linter check
npm run lint:fix   # Biome linter with auto-fix
npm run format     # Biome formatter
npm run check      # Combined lint + format with auto-fix
npm run clean      # Remove dist/ directory
```

## Project Overview

TypeScript library for PASCO wireless BLE sensors using Web Bluetooth API. See `documentation.md` for architecture details and `README.md` for API reference.

## Code Conventions

### TypeScript Strict Mode

The project uses strict TypeScript configuration with all strict checks enabled. 



- `src/datasheets.ts`: Sensor definitions (auto-generated, do not edit)
- `src/code-node-device.ts`: Code.Node LED/sound controls
- `src/control-node-device.ts`: Control.Node motor/servo controls
