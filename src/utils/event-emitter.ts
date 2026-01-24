/**
 * Event Emitter
 *
 * A lightweight, cross-platform event emitter for device events.
 * Works in both browser and Node.js environments.
 */

/**
 * Error thrown when waitForEvent times out.
 */
export class EventTimeoutError extends Error {
  /** The event name that was being waited for */
  readonly eventName: string;
  /** The timeout duration in milliseconds */
  readonly timeoutMs: number;

  constructor(eventName: string, timeoutMs: number) {
    super(`Timeout waiting for '${eventName}' event after ${timeoutMs}ms`);
    this.name = 'EventTimeoutError';
    this.eventName = eventName;
    this.timeoutMs = timeoutMs;
  }
}

/**
 * Event listener function type
 */
export type EventListener<T = unknown> = (data: T) => void;

/**
 * Device event types and their payloads
 */
export type DeviceEvents = {
  /** Emitted when device connection is established */
  connected: { name: string | null; address: string | null };
  /** Emitted when device is disconnected */
  disconnected: { reason?: string };
  /** Emitted when new measurement data is received */
  data: { measurement: string; value: number | null; unit?: string | null };
  /** Emitted when an error occurs */
  error: { error: Error; context?: string };
  /** Emitted when connection state changes */
  stateChange: { previousState: string; newState: string };
  /** Emitted when sensors are initialized */
  sensorsReady: { sensors: string[] };
  /** Emitted on BLE notification received */
  notification: { serviceId: number; data: number[] };
};

/**
 * Type-safe event names
 */
export type DeviceEventName = keyof DeviceEvents;

/**
 * A lightweight event emitter with TypeScript support
 */
export class TypedEventEmitter<TEvents extends { [K in keyof TEvents]: unknown } = DeviceEvents> {
  private _listeners: Map<keyof TEvents, Set<EventListener<unknown>>> = new Map();
  private _onceListeners: Map<keyof TEvents, Set<EventListener<unknown>>> = new Map();
  private _debugMode = false;

  /**
   * Enable or disable debug mode for listener error logging
   * When enabled, errors thrown by event listeners are logged to console
   * in addition to being emitted as error events.
   * @param enabled Whether to enable debug mode
   */
  setDebugMode(enabled: boolean): void {
    this._debugMode = enabled;
  }

  /**
   * Check if debug mode is enabled
   * @returns true if debug mode is enabled
   */
  isDebugMode(): boolean {
    return this._debugMode;
  }

  /**
   * Add an event listener
   * @param event Event name
   * @param listener Callback function
   * @returns this for chaining
   */
  on<K extends keyof TEvents>(event: K, listener: EventListener<TEvents[K]>): this {
    if (!this._listeners.has(event)) {
      this._listeners.set(event, new Set());
    }
    this._listeners.get(event)!.add(listener as EventListener<unknown>);
    return this;
  }

  /**
   * Add a one-time event listener
   * @param event Event name
   * @param listener Callback function
   * @returns this for chaining
   */
  once<K extends keyof TEvents>(event: K, listener: EventListener<TEvents[K]>): this {
    if (!this._onceListeners.has(event)) {
      this._onceListeners.set(event, new Set());
    }
    this._onceListeners.get(event)!.add(listener as EventListener<unknown>);
    return this;
  }

  /**
   * Remove an event listener
   * @param event Event name
   * @param listener Callback function to remove
   * @returns this for chaining
   */
  off<K extends keyof TEvents>(event: K, listener: EventListener<TEvents[K]>): this {
    this._listeners.get(event)?.delete(listener as EventListener<unknown>);
    this._onceListeners.get(event)?.delete(listener as EventListener<unknown>);
    return this;
  }

  /**
   * Remove all listeners for an event, or all listeners if no event specified
   * @param event Optional event name
   * @returns this for chaining
   */
  removeAllListeners<K extends keyof TEvents>(event?: K): this {
    if (event !== undefined) {
      this._listeners.delete(event);
      this._onceListeners.delete(event);
    } else {
      this._listeners.clear();
      this._onceListeners.clear();
    }
    return this;
  }

  /**
   * Emit an event to all listeners
   * @param event Event name
   * @param data Event data
   * @returns true if event had listeners
   */
  emit<K extends keyof TEvents>(event: K, data: TEvents[K]): boolean {
    const listeners = this._listeners.get(event);
    const onceListeners = this._onceListeners.get(event);

    const hasRegularListeners = listeners !== undefined && listeners.size > 0;
    const hasOnceListeners = onceListeners !== undefined && onceListeners.size > 0;

    // Call regular listeners
    if (listeners) {
      for (const listener of listeners) {
        try {
          listener(data);
        } catch (error) {
          const wrappedError = error instanceof Error ? error : new Error(String(error));
          const context = `Error in '${String(event)}' event listener`;

          // Log to console in debug mode for easier development troubleshooting
          if (this._debugMode) {
            console.error(`[EventEmitter Debug] ${context}:`, wrappedError);
          }

          // Emit listener errors as error events to prevent silent failures
          // Skip if this is already an error event to prevent infinite loops
          if (event !== 'error') {
            this.emit('error' as K, { error: wrappedError, context } as TEvents[K]);
          }
        }
      }
    }

    // Call and remove once listeners
    if (onceListeners) {
      for (const listener of onceListeners) {
        try {
          listener(data);
        } catch (error) {
          const wrappedError = error instanceof Error ? error : new Error(String(error));
          const context = `Error in '${String(event)}' once listener`;

          // Log to console in debug mode for easier development troubleshooting
          if (this._debugMode) {
            console.error(`[EventEmitter Debug] ${context}:`, wrappedError);
          }

          // Emit listener errors as error events to prevent silent failures
          // Skip if this is already an error event to prevent infinite loops
          if (event !== 'error') {
            this.emit('error' as K, { error: wrappedError, context } as TEvents[K]);
          }
        }
      }
      this._onceListeners.delete(event);
    }

    return hasRegularListeners || hasOnceListeners;
  }

  /**
   * Get the number of listeners for an event
   * @param event Event name
   * @returns Number of listeners
   */
  listenerCount<K extends keyof TEvents>(event: K): number {
    const regular = this._listeners.get(event)?.size ?? 0;
    const once = this._onceListeners.get(event)?.size ?? 0;
    return regular + once;
  }

  /**
   * Get all event names with listeners
   * @returns Array of event names
   */
  eventNames(): (keyof TEvents)[] {
    const names = new Set<keyof TEvents>();
    for (const key of this._listeners.keys()) {
      names.add(key);
    }
    for (const key of this._onceListeners.keys()) {
      names.add(key);
    }
    return Array.from(names);
  }

  /**
   * Wait for a specific event to be emitted.
   * Returns a promise that resolves with the event data when the event is emitted,
   * or rejects with EventTimeoutError if the timeout is reached.
   *
   * @param event Event name to wait for
   * @param timeoutMs Optional timeout in milliseconds (default: no timeout)
   * @returns Promise that resolves with the event data
   * @throws EventTimeoutError if timeout is reached before event is emitted
   *
   * @example
   * ```typescript
   * // Wait for connection (with timeout)
   * try {
   *   const { name, address } = await device.waitForEvent('connected', 10000);
   *   console.log(`Connected to ${name}`);
   * } catch (error) {
   *   if (error instanceof EventTimeoutError) {
   *     console.log('Connection timed out');
   *   }
   * }
   *
   * // Wait for disconnection (no timeout)
   * const { reason } = await device.waitForEvent('disconnected');
   * console.log(`Disconnected: ${reason}`);
   * ```
   */
  waitForEvent<K extends keyof TEvents>(event: K, timeoutMs?: number): Promise<TEvents[K]> {
    return new Promise<TEvents[K]>((resolve, reject) => {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const listener: EventListener<TEvents[K]> = (data) => {
        if (timeoutId !== undefined) {
          clearTimeout(timeoutId);
        }
        resolve(data);
      };

      // Set up timeout if specified
      if (timeoutMs !== undefined && timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          this.off(event, listener);
          reject(new EventTimeoutError(String(event), timeoutMs));
        }, timeoutMs);
      }

      // Listen for the event once
      this.once(event, listener);
    });
  }

  /**
   * Wait for an event that matches a filter condition.
   * Returns a promise that resolves when an event matching the filter is emitted.
   *
   * @param event Event name to wait for
   * @param filter Function that returns true for matching events
   * @param timeoutMs Optional timeout in milliseconds (default: no timeout)
   * @returns Promise that resolves with the matching event data
   * @throws EventTimeoutError if timeout is reached before matching event
   *
   * @example
   * ```typescript
   * // Wait for a specific measurement
   * const data = await device.waitForEventWithFilter(
   *   'data',
   *   (d) => d.measurement === 'Temperature' && d.value !== null && d.value > 25,
   *   5000
   * );
   * console.log(`Temperature exceeded 25: ${data.value}`);
   *
   * // Wait for specific state change
   * await device.waitForEventWithFilter(
   *   'stateChange',
   *   (s) => s.newState === 'connected'
   * );
   * ```
   */
  waitForEventWithFilter<K extends keyof TEvents>(
    event: K,
    filter: (data: TEvents[K]) => boolean,
    timeoutMs?: number,
  ): Promise<TEvents[K]> {
    return new Promise<TEvents[K]>((resolve, reject) => {
      let timeoutId: ReturnType<typeof setTimeout> | undefined;

      const listener: EventListener<TEvents[K]> = (data) => {
        if (filter(data)) {
          if (timeoutId !== undefined) {
            clearTimeout(timeoutId);
          }
          this.off(event, listener);
          resolve(data);
        }
      };

      // Set up timeout if specified
      if (timeoutMs !== undefined && timeoutMs > 0) {
        timeoutId = setTimeout(() => {
          this.off(event, listener);
          reject(new EventTimeoutError(String(event), timeoutMs));
        }, timeoutMs);
      }

      // Use regular listener (not once) since we may need to check multiple events
      this.on(event, listener);
    });
  }
}
