/**
 * PASCO BLE Examples - Reusable Web Components
 * Custom elements for common UI patterns across all examples
 */

import { escapeHtml } from './common.js';

// ============================================================================
// Connection Panel Component
// ============================================================================

/**
 * Connection panel with status indicator, connect/disconnect buttons,
 * and optional quality indicator.
 *
 * @example
 * <pasco-connection-panel
 *   device-name="Force Sensor"
 *   show-quality>
 * </pasco-connection-panel>
 *
 * @fires {CustomEvent} connect - When connect button is clicked
 * @fires {CustomEvent} disconnect - When disconnect button is clicked
 */
class ConnectionPanel extends HTMLElement {
  static get observedAttributes() {
    return ['device-name', 'show-quality'];
  }

  constructor() {
    super();
    this._connected = false;
    this._connecting = false;
    this._qualityIndicator = null;
  }

  connectedCallback() {
    this.render();
    this.setupEventListeners();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
      this.setupEventListeners();
    }
  }

  get deviceName() {
    return this.getAttribute('device-name') || 'PASCO Device';
  }

  get showQuality() {
    return this.hasAttribute('show-quality');
  }

  render() {
    const qualityHtml = this.showQuality
      ? '<div class="quality-container" style="margin-top: 10px; display: none;"></div>'
      : '';

    this.innerHTML = `
      <section class="card" aria-label="Connection controls">
        <p class="connection-status status disconnected">Disconnected</p>
        <nav class="button-row">
          <button class="connect-btn btn-primary">Connect to ${escapeHtml(this.deviceName)}</button>
          <button class="disconnect-btn btn-danger" disabled>Disconnect</button>
        </nav>
        ${qualityHtml}
      </section>
    `;
  }

  setupEventListeners() {
    const connectBtn = this.querySelector('.connect-btn');
    const disconnectBtn = this.querySelector('.disconnect-btn');

    connectBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('connect', { bubbles: true }));
    });

    disconnectBtn?.addEventListener('click', () => {
      this.dispatchEvent(new CustomEvent('disconnect', { bubbles: true }));
    });
  }

  /** @returns {HTMLButtonElement} */
  get connectBtn() {
    return this.querySelector('.connect-btn');
  }

  /** @returns {HTMLButtonElement} */
  get disconnectBtn() {
    return this.querySelector('.disconnect-btn');
  }

  /** @returns {HTMLElement} */
  get statusEl() {
    return this.querySelector('.connection-status');
  }

  /** @returns {HTMLElement|null} */
  get qualityContainer() {
    return this.querySelector('.quality-container');
  }

  /**
   * Set connection status
   * @param {'disconnected'|'connecting'|'connected'} status
   * @param {string} text
   */
  setStatus(status, text) {
    const el = this.statusEl;
    if (el) {
      el.className = `connection-status status ${status}`;
      el.textContent = text;
    }

    this._connected = status === 'connected';
    this._connecting = status === 'connecting';

    // Update button states
    const connectBtn = this.connectBtn;
    const disconnectBtn = this.disconnectBtn;

    if (connectBtn && disconnectBtn) {
      connectBtn.disabled = this._connected || this._connecting;
      disconnectBtn.disabled = !this._connected;
    }
  }

  /**
   * Show the quality indicator
   */
  showQualityIndicator() {
    const container = this.qualityContainer;
    if (container) {
      container.style.display = 'block';
    }
  }

  /**
   * Hide the quality indicator
   */
  hideQualityIndicator() {
    const container = this.qualityContainer;
    if (container) {
      container.style.display = 'none';
    }
  }

  /**
   * Disable connect button (e.g., when browser not supported)
   */
  disableConnect() {
    const btn = this.connectBtn;
    if (btn) {
      btn.disabled = true;
    }
  }
}

// ============================================================================
// Console Log Component
// ============================================================================

/**
 * Console-style log output display.
 *
 * @example
 * <pasco-console-log></pasco-console-log>
 */
class ConsoleLog extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <section class="card" aria-label="Console output">
        <h2>Console Log</h2>
        <pre class="log" role="log" aria-live="polite"></pre>
      </section>
    `;
  }

  /** @returns {HTMLPreElement} */
  get logEl() {
    return this.querySelector('.log');
  }

  /**
   * Log a message to the console
   * @param {string} message
   */
  log(message) {
    const logEl = this.logEl;
    if (!logEl) return;

    const entry = document.createElement('div');
    entry.className = 'log-entry';
    entry.textContent = `> ${message}`;
    logEl.appendChild(entry);
    logEl.scrollTop = logEl.scrollHeight;
    console.log(message);
  }

  /**
   * Clear all log entries
   */
  clear() {
    const logEl = this.logEl;
    if (logEl) {
      logEl.innerHTML = '';
    }
  }

  /**
   * Create a bound log function for convenience
   * @returns {function(string): void}
   */
  createLogger() {
    return (message) => this.log(message);
  }
}

// ============================================================================
// Error Display Component
// ============================================================================

/**
 * Error message display with auto-dismiss.
 *
 * @example
 * <pasco-error-display></pasco-error-display>
 */
class ErrorDisplay extends HTMLElement {
  constructor() {
    super();
    this._timeoutId = null;
  }

  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <aside class="error-container" role="alert" aria-live="assertive"></aside>
    `;
  }

  /** @returns {HTMLElement} */
  get containerEl() {
    return this.querySelector('.error-container');
  }

  /**
   * Show an error message
   * @param {string} message
   * @param {number} [duration=5000] - Duration in ms (0 for persistent)
   */
  show(message, duration = 5000) {
    const container = this.containerEl;
    if (!container) return;

    // Clear any existing timeout
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }

    const errorDiv = document.createElement('div');
    errorDiv.className = 'error';
    errorDiv.innerHTML = `
      <span class="error-message">${escapeHtml(message)}</span>
      <button class="error-close" aria-label="Close error message" type="button">&times;</button>
    `;

    const closeBtn = errorDiv.querySelector('.error-close');
    closeBtn?.addEventListener('click', () => errorDiv.remove());

    container.innerHTML = '';
    container.appendChild(errorDiv);

    if (duration > 0) {
      this._timeoutId = setTimeout(() => {
        if (container.contains(errorDiv)) {
          errorDiv.remove();
        }
        this._timeoutId = null;
      }, duration);
    }
  }

  /**
   * Clear any displayed error
   */
  clear() {
    const container = this.containerEl;
    if (container) {
      container.innerHTML = '';
    }
    if (this._timeoutId) {
      clearTimeout(this._timeoutId);
      this._timeoutId = null;
    }
  }

  /**
   * Create a bound showError function for convenience
   * @returns {function(string, number=): void}
   */
  createShowError() {
    return (message, duration) => this.show(message, duration);
  }
}

// ============================================================================
// Page Footer Component
// ============================================================================

/**
 * Footer with about section, features, requirements, and keyboard shortcuts.
 *
 * @example
 * <pasco-page-footer>
 *   <span slot="description">Demonstrates basic usage:</span>
 *   <ul slot="features">
 *     <li>Feature 1</li>
 *     <li>Feature 2</li>
 *   </ul>
 *   <ul slot="requirements">
 *     <li>Chrome or Edge browser</li>
 *   </ul>
 * </pasco-page-footer>
 */
class PageFooter extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    this.innerHTML = `
      <footer class="card">
        <section class="info">
          <h2>About this example</h2>
          <p><slot name="description">Example description</slot></p>
          <slot name="features"></slot>
          <h2>Requirements</h2>
          <slot name="requirements">
            <ul>
              <li>Chrome or Edge browser (Web Bluetooth)</li>
            </ul>
          </slot>
          <div class="shortcuts-container"></div>
        </section>
      </footer>
    `;
  }

  /** @returns {HTMLElement} */
  get shortcutsContainer() {
    return this.querySelector('.shortcuts-container');
  }
}

// ============================================================================
// Browser Warning Component
// ============================================================================

/**
 * Browser support warning banner.
 *
 * @example
 * <pasco-browser-warning></pasco-browser-warning>
 */
class BrowserWarning extends HTMLElement {
  connectedCallback() {
    // Initially hidden
    this.style.display = 'none';
  }

  /**
   * Check browser support and show warning if needed
   * @returns {boolean} True if browser is supported
   */
  check() {
    const supported = typeof navigator !== 'undefined' && 'bluetooth' in navigator;

    if (!supported) {
      this.innerHTML = `
        <div class="browser-warning" role="alert">
          <strong>Browser Not Supported:</strong> Web Bluetooth is required but not available in your browser.
          Please use <a href="https://www.google.com/chrome/" target="_blank" rel="noopener">Chrome</a>,
          <a href="https://www.microsoft.com/edge" target="_blank" rel="noopener">Edge</a>, or another Chromium-based browser.
        </div>
      `;
      this.style.display = 'block';
    }

    return supported;
  }
}

// ============================================================================
// Measurements List Component
// ============================================================================

/**
 * Display list of sensor measurements with values and units.
 *
 * @example
 * <pasco-measurements-list></pasco-measurements-list>
 */
class MeasurementsList extends HTMLElement {
  connectedCallback() {
    this.render();
  }

  render() {
    const title = this.getAttribute('title') || 'Available Measurements';
    this.innerHTML = `
      <section class="card measurements-card" style="display: none;" aria-label="Measurements">
        <h2>${escapeHtml(title)}</h2>
        <dl class="measurements-dl"></dl>
      </section>
    `;
  }

  /** @returns {HTMLElement} */
  get cardEl() {
    return this.querySelector('.measurements-card');
  }

  /** @returns {HTMLDListElement} */
  get listEl() {
    return this.querySelector('.measurements-dl');
  }

  /**
   * Show the measurements card
   */
  show() {
    const card = this.cardEl;
    if (card) {
      card.style.display = 'block';
    }
  }

  /**
   * Hide the measurements card
   */
  hide() {
    const card = this.cardEl;
    if (card) {
      card.style.display = 'none';
    }
  }

  /**
   * Update the measurements display
   * @param {Array<{name: string, value: string, unit: string}>} measurements
   */
  update(measurements) {
    const listEl = this.listEl;
    if (!listEl) return;

    if (!measurements || measurements.length === 0) {
      listEl.innerHTML = '<div class="measurement-row"><dt>No data</dt><dd>--</dd></div>';
      return;
    }

    let html = '';
    for (const { name, value, unit } of measurements) {
      html += `
        <div class="measurement-row">
          <dt class="measurement-name">${escapeHtml(name)}</dt>
          <dd class="measurement-value">${escapeHtml(value)} ${escapeHtml(unit)}</dd>
        </div>
      `;
    }
    listEl.innerHTML = html;
  }

  /**
   * Clear the measurements display
   */
  clear() {
    const listEl = this.listEl;
    if (listEl) {
      listEl.innerHTML = '';
    }
  }
}

// ============================================================================
// Primary Reading Component
// ============================================================================

/**
 * Large primary reading display for a single measurement.
 *
 * @example
 * <pasco-primary-reading
 *   label="Force"
 *   unit="N">
 * </pasco-primary-reading>
 */
class PrimaryReading extends HTMLElement {
  static get observedAttributes() {
    return ['label', 'unit'];
  }

  connectedCallback() {
    this.render();
  }

  attributeChangedCallback() {
    if (this.isConnected) {
      this.render();
    }
  }

  get label() {
    return this.getAttribute('label') || 'Value';
  }

  get unit() {
    return this.getAttribute('unit') || '';
  }

  render() {
    this.innerHTML = `
      <section class="card" aria-label="Primary reading">
        <div class="reading" role="status" aria-label="${escapeHtml(this.label)} reading">
          <output class="value primary-value">--</output>
          <span class="unit primary-unit">${escapeHtml(this.unit)}</span>
          <p class="label">${escapeHtml(this.label)}</p>
        </div>
      </section>
    `;
  }

  /** @returns {HTMLOutputElement} */
  get valueEl() {
    return this.querySelector('.primary-value');
  }

  /** @returns {HTMLElement} */
  get unitEl() {
    return this.querySelector('.primary-unit');
  }

  /**
   * Update the displayed value
   * @param {string|number} value
   */
  setValue(value) {
    const el = this.valueEl;
    if (el) {
      el.textContent = value ?? '--';
    }
  }

  /**
   * Update the displayed unit
   * @param {string} unit
   */
  setUnit(unit) {
    const el = this.unitEl;
    if (el) {
      el.textContent = unit;
    }
    this.setAttribute('unit', unit);
  }

  /**
   * Reset to default display
   */
  reset() {
    this.setValue('--');
  }
}

// ============================================================================
// Register Custom Elements
// ============================================================================

customElements.define('pasco-connection-panel', ConnectionPanel);
customElements.define('pasco-console-log', ConsoleLog);
customElements.define('pasco-error-display', ErrorDisplay);
customElements.define('pasco-page-footer', PageFooter);
customElements.define('pasco-browser-warning', BrowserWarning);
customElements.define('pasco-measurements-list', MeasurementsList);
customElements.define('pasco-primary-reading', PrimaryReading);

// Export for programmatic use
export {
  BrowserWarning,
  ConnectionPanel,
  ConsoleLog,
  ErrorDisplay,
  MeasurementsList,
  PageFooter,
  PrimaryReading,
};
