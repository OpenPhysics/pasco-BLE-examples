/**
 * PASCO BLE Examples - Common Utilities
 * Shared JavaScript functions for all examples
 */

// ============================================================================
// Constants - Replace magic numbers with named values
// ============================================================================

/** Default interval for reading sensor data (ms) */
export const READ_INTERVAL_MS = 100;

/** Default interval for updating charts (ms) */
export const CHART_UPDATE_INTERVAL_MS = 50;

/** Default duration for error messages (ms) */
export const ERROR_DISPLAY_DURATION_MS = 5000;

/** Default sample rate for recording (Hz) */
export const DEFAULT_SAMPLE_RATE_HZ = 10;

/** Maximum data points to keep in charts */
export const MAX_CHART_POINTS = 500;

/** Auto-reconnect settings */
export const RECONNECT_MAX_ATTEMPTS = 3;
export const RECONNECT_BASE_DELAY_MS = 1000;

// ============================================================================
// Browser Support
// ============================================================================

/**
 * Check if Web Bluetooth is supported in the current browser
 * @returns {boolean} True if Web Bluetooth is available
 */
export function isWebBluetoothSupported() {
  return typeof navigator !== 'undefined' && 'bluetooth' in navigator;
}

/**
 * Show a browser support warning banner if Web Bluetooth is not available
 * @param {string} [containerId='browser-warning'] - ID of container element to show warning in
 * @returns {boolean} True if browser is supported, false otherwise
 */
export function checkBrowserSupport(containerId = 'browser-warning') {
  if (isWebBluetoothSupported()) {
    return true;
  }

  const container = document.getElementById(containerId);
  if (container) {
    container.innerHTML = `
      <div class="browser-warning" role="alert">
        <strong>Browser Not Supported:</strong> Web Bluetooth is required but not available in your browser.
        Please use <a href="https://www.google.com/chrome/" target="_blank" rel="noopener">Chrome</a>,
        <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener">Edge</a>, or another Chromium-based browser.
      </div>
    `;
    container.style.display = 'block';
  }

  return false;
}

// ============================================================================
// Status and Error Handling
// ============================================================================

/**
 * Set the connection status indicator
 * @param {HTMLElement} element - The status element
 * @param {'disconnected'|'connecting'|'connected'} status - Status type
 * @param {string} text - Status text to display
 */
export function setStatus(element, status, text) {
  element.className = `status ${status}`;
  element.textContent = text;
}

/**
 * Show an error message with close button
 * @param {HTMLElement} container - Container element for the error
 * @param {string} message - Error message to display
 * @param {number} duration - Duration in ms (default 5000, 0 for persistent)
 */
export function showError(container, message, duration = 5000) {
  const errorDiv = document.createElement('div');
  errorDiv.className = 'error';
  errorDiv.innerHTML = `
		<span class="error-message">${escapeHtml(message)}</span>
		<button class="error-close" aria-label="Close error message" type="button">&times;</button>
	`;

  const closeBtn = errorDiv.querySelector('.error-close');
  closeBtn.addEventListener('click', () => errorDiv.remove());

  container.innerHTML = '';
  container.appendChild(errorDiv);

  if (duration > 0) {
    setTimeout(() => {
      if (container.contains(errorDiv)) {
        errorDiv.remove();
      }
    }, duration);
  }
}

/**
 * Escape HTML to prevent XSS
 * @param {string} text - Text to escape
 * @returns {string} Escaped text
 */
export function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

/**
 * Create a log function for console-style output
 * @param {HTMLElement} logElement - The log container element
 * @returns {function} Log function
 */
export function createLogger(logElement) {
  return function log(message) {
    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${message}`;
    logElement.appendChild(entry);
    logElement.scrollTop = logElement.scrollHeight;
    console.log(message);
  };
}

/**
 * Promise-based delay
 * @param {number} ms - Milliseconds to wait
 * @returns {Promise<void>}
 */
export function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Convert hex color to RGB object
 * @param {string} hex - Hex color string (e.g., '#ff0000')
 * @returns {{r: number, g: number, b: number}} RGB values
 */
export function hexToRgb(hex) {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16),
      }
    : { r: 0, g: 0, b: 0 };
}

/**
 * Format a number with fixed decimal places
 * @param {number|null|undefined} value - Value to format
 * @param {number} decimals - Number of decimal places
 * @param {string} fallback - Fallback string if value is null/undefined
 * @returns {string} Formatted value
 */
export function formatNumber(value, decimals = 3, fallback = '--') {
  if (value === null || value === undefined || Number.isNaN(value)) {
    return fallback;
  }
  return Number(value).toFixed(decimals);
}

/**
 * Calculate basic statistics for an array of numbers
 * @param {number[]} values - Array of numbers
 * @returns {{min: number, max: number, mean: number, count: number}|null}
 */
export function calculateStats(values) {
  const filtered = values.filter((v) => v !== null && v !== undefined && !Number.isNaN(v));
  if (filtered.length === 0) return null;

  const min = Math.min(...filtered);
  const max = Math.max(...filtered);
  const mean = filtered.reduce((a, b) => a + b, 0) / filtered.length;

  return { min, max, mean, count: filtered.length };
}

/**
 * Setup disconnect handler for page unload
 * @param {function} getDevice - Function that returns the current device
 */
export function setupDisconnectOnUnload(getDevice) {
  window.addEventListener('beforeunload', () => {
    const device = getDevice();
    if (device?.isConnected()) {
      device.disconnect();
    }
  });
}

/**
 * Debounce a function
 * @param {function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {function} Debounced function
 */
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

/**
 * Throttle a function
 * @param {function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {function} Throttled function
 */
export function throttle(func, limit) {
  let inThrottle;
  return function executedFunction(...args) {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => {
        inThrottle = false;
      }, limit);
    }
  };
}

/**
 * Clamp a value between min and max
 * @param {number} value - Value to clamp
 * @param {number} min - Minimum value
 * @param {number} max - Maximum value
 * @returns {number} Clamped value
 */
export function clamp(value, min, max) {
  return Math.min(Math.max(value, min), max);
}

// ============================================================================
// Connection Helpers
// ============================================================================

/**
 * Connect to a PASCO BLE device with standard error handling
 * @param {Object} DeviceClass - The device class to instantiate (PASCOBLEDevice, CodeNodeDevice, etc.)
 * @param {Object} options - Connection options
 * @param {string} [options.filter] - Device name filter for scanning
 * @param {function} [options.onStatus] - Status update callback (status, text)
 * @param {function} [options.onLog] - Log message callback (message)
 * @param {function} [options.onError] - Error callback (message)
 * @returns {Promise<Object>} Connected device instance
 * @throws {Error} If connection fails or is cancelled
 */
export async function connectDevice(DeviceClass, options = {}) {
  const { filter, onStatus, onLog, onError } = options;

  const device = new DeviceClass();

  try {
    onLog?.('Scanning for devices...');
    onStatus?.('connecting', 'Select your device...');

    const devices = await device.scan(filter);

    if (devices.length === 0) {
      throw new Error('No device selected');
    }

    const selectedDevice = devices[0];
    onLog?.(`Found: ${selectedDevice.name}`);
    onStatus?.('connecting', 'Connecting...');

    await device.connect(selectedDevice);

    onLog?.('Connected!');
    onStatus?.('connected', `Connected: ${selectedDevice.name}`);

    return device;
  } catch (error) {
    onStatus?.('disconnected', 'Disconnected');

    if (error.message.includes('User cancelled')) {
      onError?.('Connection cancelled by user');
    } else if (error.message.includes('No device selected')) {
      onError?.('No device selected');
    } else {
      onError?.(`Connection failed: ${error.message}`);
    }

    throw error;
  }
}

/**
 * Disconnect from a device safely
 * @param {Object} device - The device to disconnect
 * @param {Object} options - Disconnect options
 * @param {function} [options.onStatus] - Status update callback
 * @param {function} [options.onLog] - Log message callback
 */
export async function disconnectDevice(device, options = {}) {
  const { onStatus, onLog } = options;

  if (!device) return;

  try {
    onLog?.('Disconnecting...');
    await device.disconnect();
    onLog?.('Disconnected');
    onStatus?.('disconnected', 'Disconnected');
  } catch (error) {
    onLog?.(`Disconnect error: ${error.message}`);
  }
}

// ============================================================================
// Data Export
// ============================================================================

/**
 * Export data points to CSV and trigger download
 * @param {Array<Object>} dataPoints - Array of data point objects
 * @param {string[]} columns - Column names to export
 * @param {string} [filename='data.csv'] - Download filename
 */
export function exportToCSV(dataPoints, columns, filename = 'data.csv') {
  if (!dataPoints || dataPoints.length === 0) {
    console.warn('No data to export');
    return;
  }

  // Build CSV content
  const header = columns.join(',');
  const rows = dataPoints.map((point) =>
    columns
      .map((col) => {
        const value = point[col];
        // Handle values that might contain commas or quotes
        if (typeof value === 'string' && (value.includes(',') || value.includes('"'))) {
          return `"${value.replace(/"/g, '""')}"`;
        }
        return value ?? '';
      })
      .join(',')
  );

  const csvContent = [header, ...rows].join('\n');

  // Create and trigger download
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  link.style.display = 'none';
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Generate a timestamped filename for exports
 * @param {string} prefix - Filename prefix
 * @param {string} [extension='csv'] - File extension
 * @returns {string} Timestamped filename
 */
export function generateExportFilename(prefix, extension = 'csv') {
  const now = new Date();
  const timestamp = now.toISOString().replace(/[:.]/g, '-').slice(0, 19);
  return `${prefix}_${timestamp}.${extension}`;
}

// ============================================================================
// Auto-Reconnect
// ============================================================================

/**
 * Create an auto-reconnect handler for a device
 * @param {Object} options - Reconnect options
 * @param {function} options.connect - Function to call to reconnect
 * @param {function} [options.onReconnecting] - Called when attempting reconnect (attempt, maxAttempts)
 * @param {function} [options.onReconnected] - Called on successful reconnect
 * @param {function} [options.onReconnectFailed] - Called when all attempts fail
 * @param {number} [options.maxAttempts=3] - Maximum reconnect attempts
 * @param {number} [options.baseDelay=1000] - Base delay between attempts (doubles each time)
 * @returns {Object} Reconnect controller with start() and stop() methods
 */
export function createAutoReconnect(options) {
  const {
    connect,
    onReconnecting,
    onReconnected,
    onReconnectFailed,
    maxAttempts = RECONNECT_MAX_ATTEMPTS,
    baseDelay = RECONNECT_BASE_DELAY_MS,
  } = options;

  let isReconnecting = false;
  let shouldReconnect = true;
  let currentAttempt = 0;

  async function attemptReconnect() {
    if (!shouldReconnect || isReconnecting) return;

    isReconnecting = true;
    currentAttempt = 0;

    while (currentAttempt < maxAttempts && shouldReconnect) {
      currentAttempt++;
      onReconnecting?.(currentAttempt, maxAttempts);

      try {
        await connect();
        isReconnecting = false;
        currentAttempt = 0;
        onReconnected?.();
        return true;
      } catch (_error) {
        if (currentAttempt < maxAttempts && shouldReconnect) {
          const delayMs = baseDelay * 2 ** (currentAttempt - 1);
          await delay(delayMs);
        }
      }
    }

    isReconnecting = false;
    onReconnectFailed?.();
    return false;
  }

  return {
    start: attemptReconnect,
    stop: () => {
      shouldReconnect = false;
    },
    reset: () => {
      shouldReconnect = true;
      currentAttempt = 0;
    },
    isReconnecting: () => isReconnecting,
  };
}

// ============================================================================
// Chart Throttling
// ============================================================================

/**
 * Create a throttled chart updater for high-frequency data
 * @param {Object} chart - Chart.js chart instance
 * @param {number} [minInterval=50] - Minimum milliseconds between updates
 * @returns {Object} Controller with update(), flush(), and destroy() methods
 */
export function createThrottledChartUpdater(chart, minInterval = CHART_UPDATE_INTERVAL_MS) {
  let pendingUpdate = false;
  let lastUpdateTime = 0;
  let rafId = null;

  function scheduleUpdate() {
    if (rafId !== null) return;

    rafId = requestAnimationFrame(() => {
      rafId = null;
      const now = performance.now();

      if (now - lastUpdateTime >= minInterval) {
        if (pendingUpdate) {
          chart.update('none');
          pendingUpdate = false;
          lastUpdateTime = now;
        }
      } else {
        // Schedule another check
        scheduleUpdate();
      }
    });
  }

  return {
    /** Mark chart as needing update (batched) */
    update() {
      pendingUpdate = true;
      scheduleUpdate();
    },
    /** Force immediate update */
    flush() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
      if (pendingUpdate) {
        chart.update('none');
        pendingUpdate = false;
        lastUpdateTime = performance.now();
      }
    },
    /** Clean up resources */
    destroy() {
      if (rafId !== null) {
        cancelAnimationFrame(rafId);
        rafId = null;
      }
    },
  };
}

// ============================================================================
// LocalStorage Preferences
// ============================================================================

/**
 * Create a preferences manager backed by localStorage
 * @param {string} storageKey - Key for localStorage
 * @param {Object} defaults - Default preference values
 * @returns {Object} Preferences manager
 */
export function createPreferences(storageKey, defaults = {}) {
  let cache = null;

  function load() {
    if (cache !== null) return cache;

    try {
      const stored = localStorage.getItem(storageKey);
      cache = stored ? { ...defaults, ...JSON.parse(stored) } : { ...defaults };
    } catch (e) {
      console.warn('Failed to load preferences:', e);
      cache = { ...defaults };
    }
    return cache;
  }

  function save() {
    try {
      localStorage.setItem(storageKey, JSON.stringify(cache));
    } catch (e) {
      console.warn('Failed to save preferences:', e);
    }
  }

  return {
    /** Get a preference value */
    get(key) {
      return load()[key];
    },
    /** Set a preference value */
    set(key, value) {
      load();
      cache[key] = value;
      save();
    },
    /** Get all preferences */
    getAll() {
      return { ...load() };
    },
    /** Set multiple preferences at once */
    setAll(values) {
      load();
      Object.assign(cache, values);
      save();
    },
    /** Reset to defaults */
    reset() {
      cache = { ...defaults };
      save();
    },
    /** Clear all stored preferences */
    clear() {
      cache = { ...defaults };
      try {
        localStorage.removeItem(storageKey);
      } catch (e) {
        console.warn('Failed to clear preferences:', e);
      }
    },
  };
}

// ============================================================================
// Data Playback
// ============================================================================

/**
 * Create a data playback controller for reviewing recorded data
 * @param {Object} options - Playback options
 * @param {Array} options.getData - Function returning data points array
 * @param {function} options.onFrame - Called for each frame (dataPoint, index, time)
 * @param {function} [options.onPlay] - Called when playback starts
 * @param {function} [options.onPause] - Called when playback pauses
 * @param {function} [options.onSeek] - Called when seeking (index)
 * @param {function} [options.onEnd] - Called when playback reaches end
 * @param {number} [options.fps=30] - Playback frames per second
 * @returns {Object} Playback controller
 */
export function createDataPlayback(options) {
  const { getData, onFrame, onPlay, onPause, onSeek, onEnd, fps = 30 } = options;

  let isPlaying = false;
  let currentIndex = 0;
  let playbackSpeed = 1;
  let intervalId = null;
  let startTime = null;
  let pausedAtTime = 0;

  function getDataPoints() {
    return getData() || [];
  }

  function emitFrame() {
    const data = getDataPoints();
    if (currentIndex >= data.length) {
      pause();
      onEnd?.();
      return;
    }

    const point = data[currentIndex];
    onFrame?.(point, currentIndex, point?.time ?? currentIndex);
  }

  function advanceToElapsedTime(data, elapsed) {
    const targetTime = data[0]?.time ?? 0;

    // Find the frame closest to current playback time
    while (currentIndex < data.length - 1) {
      const nextPoint = data[currentIndex + 1];
      const nextTime = (nextPoint?.time ?? currentIndex + 1) - targetTime;
      if (nextTime * 1000 <= elapsed) {
        currentIndex++;
      } else {
        break;
      }
    }
  }

  function processPlaybackFrame() {
    if (!isPlaying) return;

    const data = getDataPoints();
    if (currentIndex >= data.length - 1) {
      pause();
      onEnd?.();
      return;
    }

    const elapsed = (performance.now() - startTime) * playbackSpeed;
    advanceToElapsedTime(data, elapsed);
    emitFrame();
  }

  function play() {
    const data = getDataPoints();
    if (data.length === 0 || isPlaying) return;

    isPlaying = true;
    startTime = performance.now() - pausedAtTime;
    onPlay?.();

    const frameInterval = 1000 / fps;
    intervalId = setInterval(processPlaybackFrame, frameInterval);
  }

  function pause() {
    if (!isPlaying) return;

    isPlaying = false;
    pausedAtTime = performance.now() - startTime;

    if (intervalId !== null) {
      clearInterval(intervalId);
      intervalId = null;
    }

    onPause?.();
  }

  function seek(index) {
    const data = getDataPoints();
    currentIndex = clamp(index, 0, Math.max(0, data.length - 1));

    // Reset timing for playback
    const point = data[currentIndex];
    const startPoint = data[0];
    if (point && startPoint) {
      pausedAtTime = ((point.time ?? currentIndex) - (startPoint.time ?? 0)) * 1000;
    } else {
      pausedAtTime = 0;
    }

    if (isPlaying) {
      startTime = performance.now() - pausedAtTime;
    }

    onSeek?.(currentIndex);
    emitFrame();
  }

  function seekPercent(percent) {
    const data = getDataPoints();
    const index = Math.floor((percent / 100) * (data.length - 1));
    seek(index);
  }

  function setSpeed(speed) {
    playbackSpeed = speed;
    if (isPlaying) {
      // Adjust start time to maintain position at new speed
      pausedAtTime = performance.now() - startTime;
      startTime = performance.now() - (pausedAtTime / speed) * playbackSpeed;
    }
  }

  return {
    play,
    pause,
    toggle() {
      if (isPlaying) pause();
      else play();
    },
    seek,
    seekPercent,
    setSpeed,
    reset() {
      pause();
      currentIndex = 0;
      pausedAtTime = 0;
      emitFrame();
    },
    isPlaying: () => isPlaying,
    getCurrentIndex: () => currentIndex,
    getProgress() {
      const data = getDataPoints();
      if (data.length === 0) return 0;
      return (currentIndex / (data.length - 1)) * 100;
    },
    destroy() {
      pause();
    },
  };
}

// ============================================================================
// Keyboard Shortcuts
// ============================================================================

/**
 * Check if an element is an input field where shortcuts should be ignored
 * @param {HTMLElement} element - Element to check
 * @returns {boolean} True if element is an input field
 */
function isInputElement(element) {
  const tagName = element.tagName.toLowerCase();
  const inputTags = ['input', 'textarea', 'select'];
  return inputTags.includes(tagName) || element.isContentEditable;
}

/**
 * Build a key identifier from a keyboard event
 * @param {KeyboardEvent} event - Keyboard event
 * @returns {string} Key identifier (e.g., 'ctrl+s', 'escape')
 */
function buildKeyId(event) {
  const parts = [];
  if (event.ctrlKey || event.metaKey) parts.push('ctrl');
  if (event.altKey) parts.push('alt');
  if (event.shiftKey) parts.push('shift');
  parts.push(event.key.toLowerCase());
  return parts.join('+');
}

/**
 * Create a keyboard shortcut manager
 * @param {Object} options - Manager options
 * @param {boolean} [options.ignoreInInputs=true] - Ignore shortcuts when typing in inputs
 * @returns {Object} Shortcut manager with register/unregister methods
 */
export function createKeyboardShortcuts(options = {}) {
  const { ignoreInInputs = true } = options;
  const shortcuts = new Map();

  function handleKeydown(event) {
    if (ignoreInInputs && isInputElement(event.target)) {
      return;
    }

    const keyId = buildKeyId(event);
    const shortcut = shortcuts.get(keyId);

    if (shortcut && !shortcut.disabled) {
      event.preventDefault();
      shortcut.callback(event);
    }
  }

  // Attach listener
  document.addEventListener('keydown', handleKeydown);

  return {
    /**
     * Register a keyboard shortcut
     * @param {string} key - Key combination (e.g., 'c', 'escape', 'ctrl+s')
     * @param {function} callback - Function to call when shortcut is triggered
     * @param {string} [description] - Human-readable description
     */
    register(key, callback, description = '') {
      const keyId = key.toLowerCase().replace(/\s/g, '');
      shortcuts.set(keyId, { callback, description, disabled: false });
    },

    /**
     * Unregister a keyboard shortcut
     * @param {string} key - Key combination to remove
     */
    unregister(key) {
      shortcuts.delete(key.toLowerCase().replace(/\s/g, ''));
    },

    /**
     * Enable or disable a shortcut
     * @param {string} key - Key combination
     * @param {boolean} enabled - Whether to enable
     */
    setEnabled(key, enabled) {
      const shortcut = shortcuts.get(key.toLowerCase().replace(/\s/g, ''));
      if (shortcut) {
        shortcut.disabled = !enabled;
      }
    },

    /**
     * Get all registered shortcuts with descriptions
     * @returns {Array<{key: string, description: string}>}
     */
    getShortcuts() {
      return Array.from(shortcuts.entries())
        .filter(([, s]) => s.description)
        .map(([key, s]) => ({
          key: key.replace(/\+/g, ' + ').toUpperCase(),
          description: s.description,
        }));
    },

    /**
     * Destroy the manager and remove event listener
     */
    destroy() {
      document.removeEventListener('keydown', handleKeydown);
      shortcuts.clear();
    },
  };
}

/**
 * Create a keyboard shortcuts help panel
 * @param {Object} shortcutManager - Keyboard shortcut manager instance
 * @param {HTMLElement} container - Container element for the help panel
 */
export function createShortcutsHelp(shortcutManager, container) {
  function render() {
    const shortcuts = shortcutManager.getShortcuts();
    if (shortcuts.length === 0) {
      container.innerHTML = '';
      return;
    }

    const items = shortcuts
      .map((s) => `<li><kbd>${escapeHtml(s.key)}</kbd> ${escapeHtml(s.description)}</li>`)
      .join('');

    container.innerHTML = `
      <details class="shortcuts-help">
        <summary>Keyboard Shortcuts</summary>
        <ul>${items}</ul>
      </details>
    `;
  }

  render();

  return { render };
}

// ============================================================================
// Connection Quality / Sample Rate Tracking
// ============================================================================

/**
 * Create a sample rate tracker for monitoring connection quality
 * @param {Object} options - Tracker options
 * @param {number} [options.windowSize=1000] - Time window in ms for calculating rate
 * @param {number} [options.updateInterval=500] - How often to update the display (ms)
 * @param {function} [options.onUpdate] - Callback when rate is updated (rate, quality)
 * @returns {Object} Sample rate tracker controller
 */
export function createSampleRateTracker(options = {}) {
  const { windowSize = 1000, updateInterval = 500, onUpdate } = options;

  const timestamps = [];
  let intervalId = null;
  let lastRate = 0;

  /**
   * Get quality level based on sample rate
   * @param {number} rate - Samples per second
   * @param {number} expectedRate - Expected rate (default 10 Hz)
   * @returns {'good'|'fair'|'poor'} Quality level
   */
  function getQuality(rate, expectedRate = 10) {
    if (rate >= expectedRate * 0.8) return 'good';
    if (rate >= expectedRate * 0.5) return 'fair';
    return 'poor';
  }

  function calculateRate() {
    const now = performance.now();
    // Remove timestamps outside the window
    while (timestamps.length > 0 && now - timestamps[0] > windowSize) {
      timestamps.shift();
    }
    // Calculate rate (samples per second)
    return (timestamps.length / windowSize) * 1000;
  }

  function update() {
    lastRate = calculateRate();
    const quality = getQuality(lastRate);
    onUpdate?.(lastRate, quality);
  }

  return {
    /** Record a sample timestamp */
    recordSample() {
      timestamps.push(performance.now());
    },

    /** Get current sample rate (samples/second) */
    getRate() {
      return calculateRate();
    },

    /** Get quality assessment */
    getQuality(expectedRate = 10) {
      return getQuality(calculateRate(), expectedRate);
    },

    /** Start automatic updates */
    start() {
      if (intervalId !== null) return;
      intervalId = setInterval(update, updateInterval);
      update(); // Initial update
    },

    /** Stop automatic updates */
    stop() {
      if (intervalId !== null) {
        clearInterval(intervalId);
        intervalId = null;
      }
    },

    /** Reset the tracker */
    reset() {
      timestamps.length = 0;
      lastRate = 0;
    },

    /** Get last calculated rate */
    getLastRate() {
      return lastRate;
    },
  };
}

/**
 * Create and attach a connection quality indicator to an element
 * @param {HTMLElement} container - Container element for the indicator
 * @returns {Object} Controller with tracker and update methods
 */
export function createConnectionQualityIndicator(container) {
  // Create indicator HTML
  container.innerHTML = `
    <div class="connection-quality" aria-live="polite">
      <span class="quality-label">Sample Rate:</span>
      <span class="quality-value">--</span>
      <span class="quality-unit">Hz</span>
      <span class="quality-indicator" aria-label="Connection quality"></span>
    </div>
  `;

  const valueEl = container.querySelector('.quality-value');
  const indicatorEl = container.querySelector('.quality-indicator');

  const tracker = createSampleRateTracker({
    onUpdate: (rate, quality) => {
      valueEl.textContent = rate.toFixed(1);
      indicatorEl.className = `quality-indicator quality-${quality}`;
      indicatorEl.setAttribute('aria-label', `Connection quality: ${quality}`);
    },
  });

  return {
    tracker,

    /** Record a sample (call this each time you read data) */
    recordSample() {
      tracker.recordSample();
    },

    /** Start monitoring */
    start() {
      tracker.start();
    },

    /** Stop monitoring */
    stop() {
      tracker.stop();
      valueEl.textContent = '--';
      indicatorEl.className = 'quality-indicator';
    },

    /** Reset and clear display */
    reset() {
      tracker.reset();
      valueEl.textContent = '--';
      indicatorEl.className = 'quality-indicator';
    },
  };
}
