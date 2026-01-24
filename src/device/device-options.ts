/**
 * Device Options
 *
 * Configuration options for PASCOBLEDevice.
 */

import type { RetryOptions } from '@/utils/retry.js';

/**
 * Log levels for device logging
 */
export type LogLevel = 'none' | 'error' | 'warn' | 'info' | 'debug';

/**
 * Configuration options for PASCOBLEDevice
 */
export interface DeviceOptions {
  /**
   * Connection timeout in milliseconds.
   * How long to wait for initial connection.
   * @default 10000
   */
  connectionTimeout?: number;

  /**
   * Command timeout in milliseconds.
   * How long to wait for BLE command responses.
   * @default 5000
   */
  commandTimeout?: number;

  /**
   * Retry options for BLE operations.
   * Set maxRetries > 0 to enable retry logic.
   * @default { maxRetries: 0 }
   */
  retry?: RetryOptions;

  /**
   * Auto-reconnect on unexpected disconnection.
   * @default false
   */
  autoReconnect?: boolean;

  /**
   * Maximum auto-reconnect attempts.
   * Only used if autoReconnect is true.
   * @default 3
   */
  maxReconnectAttempts?: number;

  /**
   * Delay between reconnection attempts in milliseconds.
   * @default 2000
   */
  reconnectDelay?: number;

  /**
   * Log level for device operations.
   * @default 'error'
   */
  logLevel?: LogLevel;

  /**
   * Custom logger function.
   * If not provided, uses console methods based on logLevel.
   */
  logger?: DeviceLogger;

  /**
   * Enable emitting 'data' events when reading measurements.
   * @default true
   */
  emitDataEvents?: boolean;

  /**
   * Enable emitting 'notification' events for raw BLE notifications.
   * Useful for debugging but may impact performance.
   * @default false
   */
  emitNotificationEvents?: boolean;
}

/**
 * Custom logger interface
 */
export interface DeviceLogger {
  error: (message: string, ...args: unknown[]) => void;
  warn: (message: string, ...args: unknown[]) => void;
  info: (message: string, ...args: unknown[]) => void;
  debug: (message: string, ...args: unknown[]) => void;
}

/**
 * Default device options
 */
export const DEFAULT_DEVICE_OPTIONS: Required<Omit<DeviceOptions, 'logger'>> = {
  connectionTimeout: 10000,
  commandTimeout: 5000,
  retry: { maxRetries: 0 },
  autoReconnect: false,
  maxReconnectAttempts: 3,
  reconnectDelay: 2000,
  logLevel: 'error',
  emitDataEvents: true,
  emitNotificationEvents: false,
};

/**
 * Create a logger based on log level
 */
export function createLogger(level: LogLevel, customLogger?: DeviceLogger): DeviceLogger {
  if (customLogger) {
    return customLogger;
  }

  const noop = () => {};
  const levels: LogLevel[] = ['none', 'error', 'warn', 'info', 'debug'];
  const levelIndex = levels.indexOf(level);

  return {
    error: levelIndex >= 1 ? console.error.bind(console, '[PASCO]') : noop,
    warn: levelIndex >= 2 ? console.warn.bind(console, '[PASCO]') : noop,
    info: levelIndex >= 3 ? console.info.bind(console, '[PASCO]') : noop,
    debug: levelIndex >= 4 ? console.debug.bind(console, '[PASCO]') : noop,
  };
}
