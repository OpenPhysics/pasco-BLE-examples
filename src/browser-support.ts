/**
 * Browser support detection for Web Bluetooth API
 */

/**
 * Support level for Web Bluetooth
 */
export type SupportLevel =
  | 'not-supported' // API not available or browser incompatible
  | 'likely-supported' // API exists but not yet tested
  | 'available'; // API confirmed available (requires async check)

/**
 * Browser support status for Web Bluetooth
 */
export interface BrowserSupport {
  /** Whether Web Bluetooth API is available */
  supported: boolean;
  /** Whether the current context is secure (HTTPS or localhost) */
  secureContext: boolean;
  /** Support level (requires async check for 'available') */
  level: SupportLevel;
  /** Human-readable status message */
  message: string;
  /** Detected browser name (if identifiable) */
  browser: string | undefined;
  /** Whether Bluetooth is available on the system (undefined until checked) */
  bluetoothAvailable?: boolean;
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
      level: 'not-supported',
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
      level: 'not-supported',
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
      level: 'not-supported',
      message: `Web Bluetooth API is not available in this browser.${browserHint} Please use Chrome 56+, Edge 79+, or Opera 43+.`,
      browser,
    };
  }

  return {
    supported: true,
    secureContext: true,
    level: 'likely-supported',
    message:
      'Web Bluetooth API is available. Call checkBluetoothAvailability() to verify Bluetooth hardware is present.',
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

/**
 * Checks if Bluetooth hardware is actually available on the system.
 *
 * This performs a runtime check using the Web Bluetooth API to verify that:
 * - The browser supports Web Bluetooth (API is present)
 * - Bluetooth hardware is present on the system
 * - Bluetooth is not disabled by the user or system policy
 *
 * Note: This function requires user interaction in some browsers (gesture requirement).
 *
 * @returns Extended browser support status with Bluetooth availability
 *
 * @example
 * ```typescript
 * import { checkBluetoothAvailability } from 'pasco-ble';
 *
 * const support = await checkBluetoothAvailability();
 *
 * if (!support.supported) {
 *   alert(support.message);
 * } else if (support.bluetoothAvailable === false) {
 *   alert('Bluetooth hardware not found or disabled');
 * } else {
 *   // Safe to proceed with scanning
 *   await device.scan();
 * }
 * ```
 */
export async function checkBluetoothAvailability(): Promise<BrowserSupport> {
  const baseSupport = checkBrowserSupport();

  // If basic support check failed, return early
  if (!baseSupport.supported) {
    return baseSupport;
  }

  // Try to check actual Bluetooth hardware availability
  try {
    // Use getAvailability() if available (Chrome 56+, Edge 79+, Opera 43+)
    if (navigator.bluetooth && 'getAvailability' in navigator.bluetooth) {
      const available = await navigator.bluetooth.getAvailability();

      if (!available) {
        return {
          ...baseSupport,
          level: 'not-supported',
          supported: false,
          bluetoothAvailable: false,
          message:
            'Bluetooth hardware not found or disabled. Please enable Bluetooth on your device.',
        };
      }

      return {
        ...baseSupport,
        level: 'available',
        bluetoothAvailable: true,
        message: 'Web Bluetooth is fully available and ready to use.',
      };
    }

    // If getAvailability() not available, assume it's supported
    return {
      ...baseSupport,
      level: 'likely-supported',
      message: 'Web Bluetooth API is available (hardware status could not be verified).',
    };
  } catch (error) {
    // If checking availability fails, return likely-supported
    return {
      ...baseSupport,
      level: 'likely-supported',
      message: `Web Bluetooth API is available but status check failed: ${error instanceof Error ? error.message : String(error)}`,
    };
  }
}
