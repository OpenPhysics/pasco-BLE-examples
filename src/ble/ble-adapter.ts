/**
 * BLE Adapter Abstract Interface
 *
 * Defines the platform-agnostic interface for BLE operations.
 * Implementations are provided for Node.js (Noble) and Browser (Web Bluetooth).
 */

import type { BLECharacteristic, BLEClient, BLEDevice, NotifyCallback } from '@/types/ble.js';

/**
 * Abstract BLE adapter interface
 */
export abstract class BLEAdapterBase {
  /**
   * Scan for BLE devices
   * @param nameFilters Optional array of name substrings to filter devices
   * @param timeout Scan timeout in milliseconds (default: 5000)
   */
  abstract scan(nameFilters?: string[], timeout?: number): Promise<BLEDevice[]>;

  /**
   * Stop an ongoing scan
   */
  abstract stopScan(): Promise<void>;

  /**
   * Create a client for connecting to a device
   * @param device The BLE device to create a client for
   */
  abstract createClient(device: BLEDevice): BLEClientBase;

  /**
   * Check if BLE is available on this platform
   */
  abstract isAvailable(): boolean;
}

/**
 * Abstract BLE client interface for device communication
 */
export abstract class BLEClientBase implements BLEClient {
  protected _address: string;
  protected _isConnected: boolean = false;
  protected _services: { uuid: string; characteristics: BLECharacteristic[] }[] = [];
  protected _notifyCallbacks: Map<string, NotifyCallback> = new Map();

  constructor(address: string) {
    this._address = address;
  }

  get address(): string {
    return this._address;
  }

  get isConnected(): boolean {
    return this._isConnected;
  }

  get services(): { uuid: string; characteristics: BLECharacteristic[] }[] {
    return this._services;
  }

  /**
   * Connect to the device
   */
  abstract connect(): Promise<void>;

  /**
   * Disconnect from the device
   */
  abstract disconnect(): Promise<void>;

  /**
   * Write data to a GATT characteristic
   * @param uuid The characteristic UUID
   * @param data The data to write
   */
  abstract writeGattChar(uuid: string, data: Uint8Array): Promise<void>;

  /**
   * Read data from a GATT characteristic
   * @param uuid The characteristic UUID
   */
  abstract readGattChar(uuid: string): Promise<Uint8Array>;

  /**
   * Start notifications for a characteristic
   * @param uuid The characteristic UUID
   * @param callback Function to call when data is received
   */
  abstract startNotify(uuid: string, callback: NotifyCallback): Promise<void>;

  /**
   * Stop notifications for a characteristic
   * @param uuid The characteristic UUID
   */
  abstract stopNotify(uuid: string): Promise<void>;

  /**
   * Discover all services and characteristics
   */
  abstract discoverServicesAndCharacteristics(): Promise<void>;
}

/**
 * PASCO-specific UUID generation
 * Creates UUIDs in the format: 4a5c000X-000Y-0000-0000-5c1e741f1c00
 * where X is the service ID and Y is the characteristic ID
 */
export function createPascoUuid(serviceId: number, characteristicId: number): string {
  return `4a5c000${serviceId}-000${characteristicId}-0000-0000-5c1e741f1c00`;
}

/**
 * Extract service ID from PASCO UUID
 */
export function getServiceIdFromUuid(uuid: string): number {
  const match = uuid.match(/4a5c000(\d)/);
  if (match?.[1]) {
    return parseInt(match[1], 10);
  }
  return -1;
}

/**
 * Extract characteristic ID from PASCO UUID
 */
export function getCharacteristicIdFromUuid(uuid: string): number {
  const match = uuid.match(/4a5c000\d-000(\d)/);
  if (match?.[1]) {
    return parseInt(match[1], 10);
  }
  return -1;
}

/**
 * Check if a UUID is a PASCO UUID
 */
export function isPascoUuid(uuid: string): boolean {
  return uuid.toLowerCase().startsWith('4a5c000') && uuid.toLowerCase().endsWith('5c1e741f1c00');
}
