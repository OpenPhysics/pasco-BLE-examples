/**
 * BLE Module Exports
 *
 * Provides Web Bluetooth adapter and utilities for browser environments.
 */

import type { BLEAdapterBase } from './ble-adapter.js';
import { WebBluetoothAdapter } from './web-bluetooth-adapter.js';

export type {
  BLEAdapter,
  BLECharacteristic,
  BLEClient,
  BLEDevice,
  NotifyCallback,
} from '../types/ble.js';
export {
  BLEAdapterBase,
  BLEClientBase,
  createPascoUuid,
  getCharacteristicIdFromUuid,
  getServiceIdFromUuid,
  isPascoUuid,
} from './ble-adapter.js';
export { WebBluetoothAdapter, WebBluetoothClient } from './web-bluetooth-adapter.js';

/**
 * Create a BLE adapter for the current environment
 */
export function createBLEAdapter(): BLEAdapterBase {
  if (typeof navigator !== 'undefined' && navigator.bluetooth !== undefined) {
    return new WebBluetoothAdapter();
  }

  throw new Error('Web Bluetooth API is not available in this environment');
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
   * Check if Web Bluetooth is available
   */
  hasWebBluetooth(): boolean {
    return this.isBrowser() && navigator.bluetooth !== undefined;
  },
};
