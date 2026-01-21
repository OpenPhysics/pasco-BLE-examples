/**
 * Noble BLE Adapter
 *
 * Node.js implementation of the BLE adapter using the Noble library.
 * Works on Windows, macOS, and Linux.
 */

import { BLEAdapterBase, BLEClientBase, isPascoUuid, getServiceIdFromUuid } from './ble-adapter.js';
import type { BLEDevice, BLECharacteristic, NotifyCallback } from '../types/ble.js';
import { COMPATIBLE_DEVICES } from '../types/device.js';

// Noble types - these will be provided by the actual noble package
interface NoblePeripheral {
  id: string;
  uuid: string;
  address: string;
  addressType: string;
  connectable: boolean;
  advertisement: {
    localName?: string;
    manufacturerData?: Buffer;
    serviceUuids?: string[];
  };
  rssi: number;
  state: string;
  connect(callback?: (error?: Error) => void): void;
  disconnect(callback?: (error?: Error) => void): void;
  discoverAllServicesAndCharacteristics(
    callback?: (error?: Error, services?: NobleService[], characteristics?: NobleCharacteristic[]) => void
  ): void;
  on(event: string, listener: (...args: unknown[]) => void): void;
  removeListener(event: string, listener: (...args: unknown[]) => void): void;
}

interface NobleService {
  uuid: string;
  characteristics: NobleCharacteristic[];
}

interface NobleCharacteristic {
  uuid: string;
  properties: string[];
  read(callback?: (error?: Error, data?: Buffer) => void): void;
  write(data: Buffer, withoutResponse: boolean, callback?: (error?: Error) => void): void;
  subscribe(callback?: (error?: Error) => void): void;
  unsubscribe(callback?: (error?: Error) => void): void;
  on(event: 'data', listener: (data: Buffer, isNotification: boolean) => void): void;
  on(event: string, listener: (...args: unknown[]) => void): void;
  removeListener(event: 'data', listener: (data: Buffer, isNotification: boolean) => void): void;
  removeListener(event: string, listener: (...args: unknown[]) => void): void;
}

interface Noble {
  state: string;
  on(event: 'discover', listener: (peripheral: NoblePeripheral) => void): void;
  on(event: 'stateChange', listener: (state: string) => void): void;
  on(event: string, listener: (...args: unknown[]) => void): void;
  removeListener(event: 'discover', listener: (peripheral: NoblePeripheral) => void): void;
  removeListener(event: 'stateChange', listener: (state: string) => void): void;
  removeListener(event: string, listener: (...args: unknown[]) => void): void;
  startScanning(serviceUuids?: string[], allowDuplicates?: boolean, callback?: (error?: Error) => void): void;
  stopScanning(callback?: () => void): void;
}

// Lazy load noble to avoid issues on platforms where it's not available
let nobleInstance: Noble | null = null;

async function loadNoble(): Promise<Noble> {
  if (nobleInstance) return nobleInstance;

  try {
    // Try to load @abandonware/noble first (more actively maintained)
    const module = await import('@abandonware/noble');
    nobleInstance = (module.default || module) as unknown as Noble;
    return nobleInstance;
  } catch {
    throw new Error(
      'Noble BLE library not found. Please install @abandonware/noble: npm install @abandonware/noble'
    );
  }
}

/**
 * Noble adapter for Node.js environments
 */
export class NobleAdapter extends BLEAdapterBase {
  private _peripherals: Map<string, NoblePeripheral> = new Map();
  private _scanning = false;

  isAvailable(): boolean {
    // Noble is available if we can load it and we're in Node.js
    return typeof process !== 'undefined' && process.versions?.node !== undefined;
  }

  async scan(nameFilters?: string[], timeout: number = 5000): Promise<BLEDevice[]> {
    const nobleInstance = await loadNoble();
    const devices: BLEDevice[] = [];
    const filters = nameFilters ?? [...COMPATIBLE_DEVICES];

    return new Promise((resolve, reject) => {
      const handleDiscover = (peripheral: NoblePeripheral) => {
        const name = peripheral.advertisement.localName;

        // Check if device matches filter
        if (name && filters.some((filter) => name.includes(filter))) {
          // Avoid duplicates
          if (!this._peripherals.has(peripheral.id)) {
            this._peripherals.set(peripheral.id, peripheral);
            devices.push({
              name: name,
              address: peripheral.address || peripheral.id,
              rssi: peripheral.rssi,
            });
          }
        }
      };

      const handleStateChange = (state: string) => {
        if (state === 'poweredOn') {
          nobleInstance.startScanning([], false, (error) => {
            if (error) {
              reject(error);
            }
          });
          this._scanning = true;
        } else {
          reject(new Error(`Bluetooth adapter state: ${state}`));
        }
      };

      // Set up listeners
      nobleInstance.on('discover', handleDiscover);

      // Check if already powered on
      if (nobleInstance.state === 'poweredOn') {
        nobleInstance.startScanning([], false, (error) => {
          if (error) {
            reject(error);
          }
        });
        this._scanning = true;
      } else {
        nobleInstance.on('stateChange', handleStateChange);
      }

      // Set timeout
      setTimeout(() => {
        nobleInstance.stopScanning();
        nobleInstance.removeListener('discover', handleDiscover);
        nobleInstance.removeListener('stateChange', handleStateChange);
        this._scanning = false;
        resolve(devices);
      }, timeout);
    });
  }

  async stopScan(): Promise<void> {
    if (this._scanning) {
      const nobleInstance = await loadNoble();
      return new Promise((resolve) => {
        nobleInstance.stopScanning(() => {
          this._scanning = false;
          resolve();
        });
      });
    }
  }

  createClient(device: BLEDevice): NobleClient {
    const peripheral = this._peripherals.get(device.address) || this._peripherals.get(device.name ?? '');
    if (!peripheral) {
      throw new Error(`Peripheral not found for device: ${device.address}`);
    }
    return new NobleClient(device.address, peripheral);
  }

  /**
   * Get cached peripheral by address
   */
  getPeripheral(address: string): NoblePeripheral | undefined {
    return this._peripherals.get(address);
  }
}

/**
 * Noble client implementation
 */
export class NobleClient extends BLEClientBase {
  private _peripheral: NoblePeripheral;
  private _characteristics: Map<string, NobleCharacteristic> = new Map();

  constructor(address: string, peripheral: NoblePeripheral) {
    super(address);
    this._peripheral = peripheral;
  }

  async connect(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._peripheral.connect((error) => {
        if (error) {
          reject(error);
          return;
        }

        this._isConnected = true;

        // Set up disconnect handler
        this._peripheral.on('disconnect', () => {
          this._isConnected = false;
        });

        // Discover services and characteristics
        this.discoverServicesAndCharacteristics()
          .then(() => resolve())
          .catch(reject);
      });
    });
  }

  async disconnect(): Promise<void> {
    return new Promise((resolve) => {
      this._peripheral.disconnect(() => {
        this._isConnected = false;
        this._characteristics.clear();
        resolve();
      });
    });
  }

  async discoverServicesAndCharacteristics(): Promise<void> {
    return new Promise((resolve, reject) => {
      this._peripheral.discoverAllServicesAndCharacteristics((error, services, _characteristics) => {
        if (error) {
          reject(error);
          return;
        }

        this._services = [];
        this._characteristics.clear();

        if (services) {
          for (const service of services) {
            const charList: BLECharacteristic[] = [];

            for (const char of service.characteristics) {
              charList.push({
                uuid: char.uuid,
                handle: isPascoUuid(char.uuid) ? getServiceIdFromUuid(char.uuid) : 0,
                properties: char.properties,
              });

              // Cache characteristic for later use
              this._characteristics.set(char.uuid.toLowerCase(), char);
            }

            this._services.push({
              uuid: service.uuid,
              characteristics: charList,
            });
          }
        }

        resolve();
      });
    });
  }

  async writeGattChar(uuid: string, data: Uint8Array): Promise<void> {
    const char = this._characteristics.get(uuid.toLowerCase().replace(/-/g, ''));
    if (!char) {
      throw new Error(`Characteristic ${uuid} not found`);
    }

    return new Promise((resolve, reject) => {
      const withoutResponse = char.properties.includes('writeWithoutResponse');
      char.write(Buffer.from(data), withoutResponse, (error) => {
        if (error) {
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async readGattChar(uuid: string): Promise<Uint8Array> {
    const char = this._characteristics.get(uuid.toLowerCase().replace(/-/g, ''));
    if (!char) {
      throw new Error(`Characteristic ${uuid} not found`);
    }

    return new Promise((resolve, reject) => {
      char.read((error, data) => {
        if (error) {
          reject(error);
        } else if (data) {
          resolve(new Uint8Array(data));
        } else {
          resolve(new Uint8Array(0));
        }
      });
    });
  }

  async startNotify(uuid: string, callback: NotifyCallback): Promise<void> {
    const char = this._characteristics.get(uuid.toLowerCase().replace(/-/g, ''));
    if (!char) {
      throw new Error(`Characteristic ${uuid} not found`);
    }

    // Store callback
    this._notifyCallbacks.set(uuid.toLowerCase(), callback);

    // Set up data listener
    const handleData = (data: Buffer, isNotification: boolean) => {
      if (isNotification) {
        const charInfo: BLECharacteristic = {
          uuid: char.uuid,
          handle: isPascoUuid(char.uuid) ? getServiceIdFromUuid(char.uuid) : 0,
          properties: char.properties,
        };
        callback(charInfo, new Uint8Array(data));
      }
    };

    char.on('data', handleData);

    return new Promise((resolve, reject) => {
      char.subscribe((error) => {
        if (error) {
          char.removeListener('data', handleData);
          reject(error);
        } else {
          resolve();
        }
      });
    });
  }

  async stopNotify(uuid: string): Promise<void> {
    const char = this._characteristics.get(uuid.toLowerCase().replace(/-/g, ''));
    if (!char) {
      return;
    }

    return new Promise((resolve) => {
      char.unsubscribe(() => {
        this._notifyCallbacks.delete(uuid.toLowerCase());
        resolve();
      });
    });
  }
}
