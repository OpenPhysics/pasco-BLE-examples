/**
 * Event Emitter
 *
 * A lightweight, cross-platform event emitter for device events.
 * Works in both browser and Node.js environments.
 */

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
        } catch {
          // Prevent listener errors from breaking emission
          // Errors are silently swallowed to maintain event flow
        }
      }
    }

    // Call and remove once listeners
    if (onceListeners) {
      for (const listener of onceListeners) {
        try {
          listener(data);
        } catch {
          // Prevent listener errors from breaking emission
          // Errors are silently swallowed to maintain event flow
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
}
