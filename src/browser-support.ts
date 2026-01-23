/**
 * Browser support detection for Web Bluetooth API
 */

/**
 * Browser support status for Web Bluetooth
 */
export interface BrowserSupport {
  /** Whether Web Bluetooth API is available */
  supported: boolean;
  /** Whether the current context is secure (HTTPS or localhost) */
  secureContext: boolean;
  /** Human-readable status message */
  message: string;
  /** Detected browser name (if identifiable) */
  browser: string | undefined;
}

/**
 * Supported browsers and their minimum versions
 */
export const SUPPORTED_BROWSERS = {
  chrome: { name: 'Chrome', minVersion: 56, platforms: ['Windows', 'macOS', 'Linux', 'Android'] },
  edge: { name: 'Edge', minVersion: 79, platforms: ['Windows', 'macOS'] },
  opera: { name: 'Opera', minVersion: 43, platforms: ['Windows', 'macOS', 'Linux'] },
} as const;

/**
 * Browsers that do not support Web Bluetooth
 */
export const UNSUPPORTED_BROWSERS = ['Firefox', 'Safari', 'Internet Explorer'] as const;

/**
 * Detects browser from user agent string
 */
function detectBrowser(): string | undefined {
  if (typeof navigator === 'undefined') {
    return undefined;
  }

  const ua = navigator.userAgent;

  // Order matters: Edge includes "Chrome" in UA, Opera includes "Chrome" too
  if (ua.includes('Edg/')) return 'Edge';
  if (ua.includes('OPR/') || ua.includes('Opera')) return 'Opera';
  if (ua.includes('Firefox/')) return 'Firefox';
  if (ua.includes('Safari/') && !ua.includes('Chrome')) return 'Safari';
  if (ua.includes('Chrome/')) return 'Chrome';

  return undefined;
}

/**
 * Checks if the current browser supports Web Bluetooth API.
 *
 * Use this function to provide helpful error messages to users before
 * attempting to connect to PASCO sensors.
 *
 * @returns Browser support status with detailed information
 *
 * @example
 * ```typescript
 * import { checkBrowserSupport } from 'pasco-ble';
 *
 * const support = checkBrowserSupport();
 *
 * if (!support.supported) {
 *   alert(support.message);
 * } else {
 *   // Proceed with sensor connection
 *   const device = new PASCOBLEDevice();
 *   await device.scan();
 * }
 * ```
 *
 * @example
 * ```typescript
 * // Display browser-specific guidance
 * const support = checkBrowserSupport();
 *
 * if (!support.secureContext) {
 *   console.error('HTTPS required. Current page is not secure.');
 * }
 *
 * if (support.browser === 'Firefox' || support.browser === 'Safari') {
 *   console.error(`${support.browser} does not support Web Bluetooth.`);
 *   console.error('Please use Chrome, Edge, or Opera.');
 * }
 * ```
 */
export function checkBrowserSupport(): BrowserSupport {
  const browser = detectBrowser();

  // Check if running in a browser environment
  if (typeof navigator === 'undefined' || typeof window === 'undefined') {
    return {
      supported: false,
      secureContext: false,
      message:
        'Web Bluetooth is only available in browser environments. This library does not support Node.js.',
      browser,
    };
  }

  // Check secure context (HTTPS or localhost)
  const secureContext = window.isSecureContext ?? false;

  // Check if Web Bluetooth API is available
  const hasBluetoothAPI = 'bluetooth' in navigator;

  if (!secureContext) {
    return {
      supported: false,
      secureContext: false,
      message:
        'Web Bluetooth requires a secure context (HTTPS). Please serve your page over HTTPS or use localhost for development.',
      browser,
    };
  }

  if (!hasBluetoothAPI) {
    const browserHint =
      browser === 'Firefox' || browser === 'Safari'
        ? ` ${browser} does not support Web Bluetooth.`
        : '';

    return {
      supported: false,
      secureContext: true,
      message: `Web Bluetooth API is not available in this browser.${browserHint} Please use Chrome 56+, Edge 79+, or Opera 43+.`,
      browser,
    };
  }

  return {
    supported: true,
    secureContext: true,
    message: 'Web Bluetooth is supported in this browser.',
    browser,
  };
}

/**
 * Returns true if Web Bluetooth is supported, false otherwise.
 *
 * This is a convenience wrapper around `checkBrowserSupport()` for simple checks.
 *
 * @returns true if Web Bluetooth is available
 *
 * @example
 * ```typescript
 * import { isWebBluetoothSupported } from 'pasco-ble';
 *
 * if (!isWebBluetoothSupported()) {
 *   console.error('Please use a supported browser (Chrome, Edge, or Opera)');
 * }
 * ```
 */
export function isWebBluetoothSupported(): boolean {
  return checkBrowserSupport().supported;
}
