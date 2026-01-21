/**
 * BLE abstraction type definitions
 */

export interface BLEDevice {
  name: string | null;
  address: string;
  rssi?: number;
}

export interface BLECharacteristic {
  uuid: string;
  handle: number;
  properties: string[];
}

export interface BLEService {
  uuid: string;
  characteristics: BLECharacteristic[];
}

export interface BLEClient {
  address: string;
  isConnected: boolean;
  services: BLEService[];

  connect(): Promise<void>;
  disconnect(): Promise<void>;
  writeGattChar(uuid: string, data: Uint8Array): Promise<void>;
  readGattChar(uuid: string): Promise<Uint8Array>;
  startNotify(
    uuid: string,
    callback: (characteristic: BLECharacteristic, data: Uint8Array) => void,
  ): Promise<void>;
  stopNotify(uuid: string): Promise<void>;
}

export interface BLEAdapter {
  /**
   * Scan for BLE devices
   * @param filter Optional name filter for devices
   * @param timeout Scan timeout in milliseconds
   */
  scan(filter?: string[], timeout?: number): Promise<BLEDevice[]>;

  /**
   * Create a client connection to a device
   * @param device The device to connect to
   */
  createClient(device: BLEDevice): BLEClient;

  /**
   * Stop an ongoing scan
   */
  stopScan(): Promise<void>;
}

export type NotifyCallback = (
  characteristic: BLECharacteristic,
  data: Uint8Array,
) => void | Promise<void>;
