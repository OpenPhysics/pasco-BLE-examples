/**
 * BLE Module Exports
 *
 * Provides platform-agnostic BLE adapter factory and utilities.
 */

import { BLEAdapterBase } from './ble-adapter.js';
import { WebBluetoothAdapter } from './web-bluetooth-adapter.js';

export { BLEAdapterBase, BLEClientBase, createPascoUuid, getServiceIdFromUuid, getCharacteristicIdFromUuid, isPascoUuid } from './ble-adapter.js';
export { WebBluetoothAdapter, WebBluetoothClient } from './web-bluetooth-adapter.js';
export { NobleAdapter, NobleClient } from './noble-adapter.js';
export type { BLEDevice, BLEClient, BLEAdapter, BLECharacteristic, NotifyCallback } from '../types/ble.js';

/**
 * Detect the current platform and return an appropriate BLE adapter
 */
export function createBLEAdapter(): BLEAdapterBase {
  // Check for browser environment with Web Bluetooth
  if (typeof navigator !== 'undefined' && navigator.bluetooth !== undefined) {
    return new WebBluetoothAdapter();
  }

  // Check for Node.js environment with Noble
  if (typeof process !== 'undefined' && process.versions?.node !== undefined) {
    // Dynamic require for Node.js only - this code path won't run in browsers
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const { NobleAdapter } = require('./noble-adapter.js');
    return new NobleAdapter();
  }

  throw new Error('No supported BLE adapter found for this platform');
}

/**
 * Platform detection utilities
 */
export const Platform = {
  /**
   * Check if running in a browser environment
   */
  isBrowser(): boolean {
    return typeof window !== 'undefined' && typeof navigator !== 'undefined';
  },

  /**
   * Check if running in Node.js
   */
  isNode(): boolean {
    return typeof process !== 'undefined' && process.versions?.node !== undefined;
  },

  /**
   * Check if Web Bluetooth is available
   */
  hasWebBluetooth(): boolean {
    return this.isBrowser() && navigator.bluetooth !== undefined;
  },

  /**
   * Check if Noble BLE library is likely available
   */
  hasNoble(): boolean {
    if (!this.isNode()) return false;
    try {
      require.resolve('@abandonware/noble');
      return true;
    } catch {
      return false;
    }
  },
};
