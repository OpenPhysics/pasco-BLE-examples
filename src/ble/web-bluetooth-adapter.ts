/**
 * Web Bluetooth API Adapter
 *
 * Browser implementation of the BLE adapter using the Web Bluetooth API.
 * Requires HTTPS context and user gesture to initiate scan/connect.
 */

import type { BLECharacteristic, BLEDevice, NotifyCallback } from '../types/ble.js';
import { COMPATIBLE_DEVICES } from '../types/device.js';
import { BLEAdapterBase, BLEClientBase, getServiceIdFromUuid, isPascoUuid } from './ble-adapter.js';

/**
 * Extended BLEDevice that includes the native Web Bluetooth device reference
 */
export interface WebBLEDevice extends BLEDevice {
  _nativeDevice?: BluetoothDevice;
}

/**
 * Web Bluetooth adapter for browser environments
 */
export class WebBluetoothAdapter extends BLEAdapterBase {
  isAvailable(): boolean {
    return typeof navigator !== 'undefined' && navigator.bluetooth !== undefined;
  }

  async scan(nameFilters?: string[], _timeout?: number): Promise<WebBLEDevice[]> {
    if (!this.isAvailable()) {
      throw new Error('Web Bluetooth API is not available');
    }

    try {
      // Web Bluetooth requires explicit user gesture and uses requestDevice
      // which shows a picker dialog rather than returning all devices
      const filters = (nameFilters ?? [...COMPATIBLE_DEVICES]).map((name) => ({
        namePrefix: name,
      }));

      // Request device with PASCO service UUID filter
      const device = await navigator.bluetooth.requestDevice({
        filters,
        optionalServices: [
          '4a5c0000-0000-0000-0000-5c1e741f1c00', // PASCO main service
          '4a5c0001-0000-0000-0000-5c1e741f1c00', // PASCO sensor services
          '4a5c0002-0000-0000-0000-5c1e741f1c00',
          '4a5c0003-0000-0000-0000-5c1e741f1c00',
          '4a5c0004-0000-0000-0000-5c1e741f1c00',
        ],
      });

      // Return the selected device with native reference preserved
      return [
        {
          name: device.name ?? null,
          address: device.id,
          rssi: 0, // Web Bluetooth doesn't expose RSSI during scan
          _nativeDevice: device,
        },
      ];
    } catch (error) {
      if (error instanceof Error && error.name === 'NotFoundError') {
        // User cancelled the picker
        return [];
      }
      throw error;
    }
  }

  async stopScan(): Promise<void> {
    // Web Bluetooth doesn't support stopping scans as it uses a picker dialog
  }

  createClient(device: BLEDevice): WebBluetoothClient {
    const webDevice = device as WebBLEDevice;
    return new WebBluetoothClient(device.address, device.name, webDevice._nativeDevice);
  }
}

/**
 * Web Bluetooth client implementation
 */
export class WebBluetoothClient extends BLEClientBase {
  private _device: BluetoothDevice | null = null;
  private _server: BluetoothRemoteGATTServer | null = null;
  private _characteristics: Map<string, BluetoothRemoteGATTCharacteristic> = new Map();
  private _deviceName: string | null;

  constructor(address: string, name: string | null = null, nativeDevice?: BluetoothDevice) {
    super(address);
    this._deviceName = name;
    this._device = nativeDevice ?? null;
  }

  async connect(): Promise<void> {
    if (!navigator.bluetooth) {
      throw new Error('Web Bluetooth API is not available');
    }

    try {
      // If we don't have a device yet (e.g., connectById flow), we need to request one
      if (!this._device) {
        const filters: BluetoothLEScanFilter[] = [];
        if (this._deviceName) {
          filters.push({ name: this._deviceName });
        }

        this._device = await navigator.bluetooth.requestDevice({
          filters: filters.length > 0 ? filters : undefined,
          acceptAllDevices: filters.length === 0,
          optionalServices: [
            '4a5c0000-0000-0000-0000-5c1e741f1c00',
            '4a5c0001-0000-0000-0000-5c1e741f1c00',
            '4a5c0002-0000-0000-0000-5c1e741f1c00',
            '4a5c0003-0000-0000-0000-5c1e741f1c00',
            '4a5c0004-0000-0000-0000-5c1e741f1c00',
          ],
        });
      }

      // Connect to GATT server
      this._server = (await this._device.gatt?.connect()) ?? null;
      if (!this._server) {
        throw new Error('Failed to connect to GATT server');
      }

      this._isConnected = true;
      await this.discoverServicesAndCharacteristics();

      // Set up disconnect handler
      this._device.addEventListener('gattserverdisconnected', () => {
        this._isConnected = false;
        this._server = null;
      });
    } catch (error) {
      this._isConnected = false;
      throw error;
    }
  }

  async disconnect(): Promise<void> {
    if (this._server?.connected) {
      this._server.disconnect();
    }
    this._isConnected = false;
    this._server = null;
    this._characteristics.clear();
  }

  async discoverServicesAndCharacteristics(): Promise<void> {
    if (!this._server) {
      throw new Error('Not connected to GATT server');
    }

    this._services = [];
    this._characteristics.clear();

    // Retry logic for service discovery
    const maxRetries = 3;
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        // Check if still connected
        if (!this._server.connected) {
          console.log('GATT server disconnected, reconnecting...');
          this._server = await this._device!.gatt!.connect();
        }

        const services = await this._server.getPrimaryServices();

        for (const service of services) {
          const characteristics = await service.getCharacteristics();
          const charList: BLECharacteristic[] = [];

          for (const char of characteristics) {
            const props: string[] = [];
            if (char.properties.read) props.push('read');
            if (char.properties.write) props.push('write');
            if (char.properties.writeWithoutResponse) props.push('write-without-response');
            if (char.properties.notify) props.push('notify');
            if (char.properties.indicate) props.push('indicate');

            charList.push({
              uuid: char.uuid,
              handle: 0, // Web Bluetooth doesn't expose handles
              properties: props,
            });

            // Cache characteristic for later use
            this._characteristics.set(char.uuid, char);
          }

          this._services.push({
            uuid: service.uuid,
            characteristics: charList,
          });
        }

        // Success - exit retry loop
        console.log(
          `Service discovery complete: found ${this._characteristics.size} characteristics`,
        );
        console.log('Discovered characteristics:', Array.from(this._characteristics.keys()));
        return;
      } catch (error) {
        console.warn(`Service discovery attempt ${attempt}/${maxRetries} failed:`, error);
        if (attempt < maxRetries) {
          // Wait before retry
          await new Promise((resolve) => setTimeout(resolve, 500));
        }
      }
    }

    console.error('Service discovery failed after all retries');
  }

  async writeGattChar(uuid: string, data: Uint8Array): Promise<void> {
    console.log('Attempting to write to characteristic:', uuid.toLowerCase());
    const char = this._characteristics.get(uuid.toLowerCase());
    if (!char) {
      console.log('Available characteristics:', Array.from(this._characteristics.keys()));
      throw new Error(`Characteristic ${uuid} not found`);
    }

    // Create a new ArrayBuffer copy to ensure compatibility with BufferSource
    const buffer = new ArrayBuffer(data.byteLength);
    new Uint8Array(buffer).set(data);
    if (char.properties.writeWithoutResponse) {
      await char.writeValueWithoutResponse(buffer);
    } else {
      await char.writeValueWithResponse(buffer);
    }
  }

  async readGattChar(uuid: string): Promise<Uint8Array> {
    const char = this._characteristics.get(uuid.toLowerCase());
    if (!char) {
      throw new Error(`Characteristic ${uuid} not found`);
    }

    const value = await char.readValue();
    return new Uint8Array(value.buffer);
  }

  async startNotify(uuid: string, callback: NotifyCallback): Promise<void> {
    const char = this._characteristics.get(uuid.toLowerCase());
    if (!char) {
      throw new Error(`Characteristic ${uuid} not found`);
    }

    // Store callback
    this._notifyCallbacks.set(uuid.toLowerCase(), callback);

    // Set up event listener
    const handleValueChanged = (event: Event) => {
      const target = event.target as BluetoothRemoteGATTCharacteristic;
      const value = target.value;
      if (value) {
        const data = new Uint8Array(value.buffer);
        const serviceId = isPascoUuid(target.uuid) ? getServiceIdFromUuid(target.uuid) : 0;
        console.log(
          `Notification from UUID ${target.uuid}, serviceId=${serviceId}, data length=${data.length}`,
        );
        const charInfo: BLECharacteristic = {
          uuid: target.uuid,
          handle: serviceId,
          properties: [],
        };
        callback(charInfo, data);
      }
    };

    char.addEventListener('characteristicvaluechanged', handleValueChanged);
    await char.startNotifications();
  }

  async stopNotify(uuid: string): Promise<void> {
    const char = this._characteristics.get(uuid.toLowerCase());
    if (!char) {
      return;
    }

    try {
      await char.stopNotifications();
    } catch {
      // Ignore errors when stopping notifications
    }

    this._notifyCallbacks.delete(uuid.toLowerCase());
  }
}
