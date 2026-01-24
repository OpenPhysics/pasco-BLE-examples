/**
 * Protocol Handler
 *
 * Handles BLE communication protocol for PASCO devices.
 */

import type { BLEClientBase } from '@/ble/ble-adapter.js';
import { createPascoUuid } from '@/ble/ble-adapter.js';
import type { BLECharacteristic } from '@/types/ble.js';
import { type RetryOptions, withRetry } from '@/utils/retry.js';
import { CommunicationError } from '../errors.js';

/**
 * Protocol constants for PASCO BLE communication
 */
export const PROTOCOL = {
  SENSOR_SERVICE_ID: 0,
  SEND_CMD_CHAR_ID: 2,
  RECV_CMD_CHAR_ID: 3,
  SEND_ACK_CHAR_ID: 5,
  GCMD_CUSTOM_CMD: 0x37,
  GCMD_READ_ONE_SAMPLE: 0x05,
  GCMD_XFER_BURST_RAM: 0x0e,
  GCMD_CONTROL_NODE_CMD: 0x37,
  GRSP_RESULT: 0xc0,
  GEVT_SENSOR_ID: 0x82,
  CNTRLNODE_PLUGINS_CALLBACK: 0x82,
  CTRLNODE_CMD_DETECT_DEVICES: 8,
  WIRELESS_RMS_START: [0x37, 0x01, 0x00],
} as const;

/**
 * Handler function type for processing BLE notifications
 */
export type NotificationHandler = (serviceId: number, data: number[]) => void;

/**
 * Handles BLE protocol communication including notifications, commands, and acknowledgements
 */
export class ProtocolHandler {
  private _client: BLEClientBase | null = null;
  private _handleService: Map<number, number> = new Map();
  private _callbackResolve: ((value: boolean) => void) | null = null;
  private _onNotification: NotificationHandler | null = null;
  private _retryOptions: RetryOptions = {
    maxRetries: 0, // Disabled by default for backward compatibility
    initialDelayMs: 500,
    maxDelayMs: 5000,
    backoffMultiplier: 2,
  };

  /**
   * Set the BLE client for communication
   */
  setClient(client: BLEClientBase | null): void {
    this._client = client;
    if (!client) {
      this._handleService.clear();
    }
  }

  /**
   * Configure retry options for BLE operations
   * @param options Retry configuration
   */
  setRetryOptions(options: RetryOptions): void {
    this._retryOptions = { ...this._retryOptions, ...options };
  }

  /**
   * Get current retry options
   */
  getRetryOptions(): RetryOptions {
    return { ...this._retryOptions };
  }

  /**
   * Set the handler for incoming notifications
   */
  setNotificationHandler(handler: NotificationHandler): void {
    this._onNotification = handler;
  }

  /**
   * Build a mapping of characteristic handles to service IDs
   */
  buildHandleServiceMap(): void {
    if (!this._client) return;
    this._handleService.clear();

    for (const service of this._client.services) {
      for (const char of service.characteristics) {
        const match = char.uuid.match(/4a5c000(\d)/);
        if (match?.[1]) {
          this._handleService.set(char.handle, parseInt(match[1], 10));
        }
      }
    }
  }

  /**
   * Start notifications on all notifiable characteristics
   */
  async startNotifications(): Promise<void> {
    if (!this._client) return;

    for (const service of this._client.services) {
      for (const char of service.characteristics) {
        if (char.properties.includes('notify')) {
          await this._client.startNotify(char.uuid, this._handleNotify.bind(this));
        }
      }
    }
  }

  /**
   * Internal notification handler that routes to the registered handler
   */
  private _handleNotify(char: BLECharacteristic, data: Uint8Array): void {
    // Signal callback if waiting for response
    if (
      (data[0] === PROTOCOL.GRSP_RESULT || data[0] === PROTOCOL.GEVT_SENSOR_ID) &&
      this._callbackResolve
    ) {
      this._callbackResolve(true);
      this._callbackResolve = null;
    }

    // Determine service ID from handle map or use handle directly (Web Bluetooth)
    let serviceId = this._handleService.get(char.handle);
    if (serviceId === undefined && char.handle > 0) {
      serviceId = char.handle;
    }

    // Route to registered handler
    if (this._onNotification) {
      this._onNotification(serviceId ?? 0, Array.from(data));
    }
  }

  /**
   * Write a command to the device (internal, without retry)
   */
  private async _writeInternal(serviceId: number, command: number[]): Promise<void> {
    const uuid = createPascoUuid(serviceId, PROTOCOL.SEND_CMD_CHAR_ID);
    try {
      await this._client?.writeGattChar(uuid, new Uint8Array(command));
    } catch (error) {
      const cause = error instanceof Error ? error : new Error(String(error));
      throw new CommunicationError(`Failed to write command to service ${serviceId}`, { cause });
    }
  }

  /**
   * Write a command to the device with optional retry
   */
  async write(serviceId: number, command: number[]): Promise<void> {
    if (this._retryOptions.maxRetries && this._retryOptions.maxRetries > 0) {
      return withRetry(() => this._writeInternal(serviceId, command), {
        ...this._retryOptions,
        isRetryable: (error) => error instanceof CommunicationError,
      });
    }
    return this._writeInternal(serviceId, command);
  }

  /**
   * Send an acknowledgement to the device (internal, without retry)
   */
  private async _sendAckInternal(serviceId: number, command: number[]): Promise<void> {
    const uuid = createPascoUuid(serviceId, PROTOCOL.SEND_ACK_CHAR_ID);
    try {
      await this._client?.writeGattChar(uuid, new Uint8Array(command));
    } catch (error) {
      const cause = error instanceof Error ? error : new Error(String(error));
      throw new CommunicationError(`Failed to send acknowledgement to service ${serviceId}`, {
        cause,
      });
    }
  }

  /**
   * Send an acknowledgement to the device with optional retry
   */
  async sendAck(serviceId: number, command: number[]): Promise<void> {
    if (this._retryOptions.maxRetries && this._retryOptions.maxRetries > 0) {
      return withRetry(() => this._sendAckInternal(serviceId, command), {
        ...this._retryOptions,
        isRetryable: (error) => error instanceof CommunicationError,
      });
    }
    return this._sendAckInternal(serviceId, command);
  }

  /**
   * Write a command and wait for callback response (internal, without retry)
   */
  private _writeAwaitCallbackInternal(
    serviceId: number,
    command: number[],
    timeoutMs: number,
  ): Promise<void> {
    return new Promise((resolve, reject) => {
      const timeout = setTimeout(() => {
        this._callbackResolve = null;
        reject(new CommunicationError('Callback timeout'));
      }, timeoutMs);

      this._callbackResolve = () => {
        clearTimeout(timeout);
        resolve();
      };

      this._writeInternal(serviceId, command).catch((err) => {
        clearTimeout(timeout);
        this._callbackResolve = null;
        reject(err);
      });
    });
  }

  /**
   * Write a command and wait for callback response with optional retry
   */
  async writeAwaitCallback(serviceId: number, command: number[], timeoutMs = 5000): Promise<void> {
    if (this._retryOptions.maxRetries && this._retryOptions.maxRetries > 0) {
      return withRetry(() => this._writeAwaitCallbackInternal(serviceId, command, timeoutMs), {
        ...this._retryOptions,
        isRetryable: (error) => error instanceof CommunicationError,
      });
    }
    return this._writeAwaitCallbackInternal(serviceId, command, timeoutMs);
  }
}
