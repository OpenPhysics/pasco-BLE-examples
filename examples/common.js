/**
 * PASCO BLE Examples - Common Utilities
 * Shared JavaScript functions for all examples
 */

/**
 * Set the connection status indicator
 * @param {HTMLElement} element - The status element
 * @param {'disconnected'|'connecting'|'connected'} status - Status type
 * @param {string} text - Status text to display
 */
export function setStatus(element, status, text) {
	element.className = 'status ' + status;
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
	const filtered = values.filter(
		(v) => v !== null && v !== undefined && !Number.isNaN(v),
	);
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
		if (device && device.isConnected()) {
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
