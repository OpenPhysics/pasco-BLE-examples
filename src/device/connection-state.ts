/**
 * Connection State Machine
 *
 * Manages the connection state of PASCO BLE devices with clear state transitions.
 */

/**
 * Connection states for the device
 */
export type ConnectionState =
  | 'disconnected'
  | 'connecting'
  | 'connected'
  | 'disconnecting'
  | 'reconnecting';

/**
 * State transition event
 */
export interface StateTransition {
  from: ConnectionState;
  to: ConnectionState;
  timestamp: number;
  reason?: string | undefined;
}

/**
 * Valid state transitions
 */
const VALID_TRANSITIONS: Record<ConnectionState, ConnectionState[]> = {
  disconnected: ['connecting'],
  connecting: ['connected', 'disconnected'],
  connected: ['disconnecting', 'reconnecting', 'disconnected'],
  disconnecting: ['disconnected'],
  reconnecting: ['connected', 'disconnected'],
};

/**
 * State change callback type
 */
export type StateChangeCallback = (transition: StateTransition) => void;

/**
 * Connection state machine for managing device connection lifecycle
 */
export class ConnectionStateMachine {
  private _state: ConnectionState = 'disconnected';
  private _stateHistory: StateTransition[] = [];
  private _listeners: Set<StateChangeCallback> = new Set();
  private _maxHistorySize: number;

  constructor(maxHistorySize = 50) {
    this._maxHistorySize = maxHistorySize;
  }

  /**
   * Get current connection state
   */
  get state(): ConnectionState {
    return this._state;
  }

  /**
   * Get state transition history
   */
  get history(): readonly StateTransition[] {
    return this._stateHistory;
  }

  /**
   * Check if currently connected
   */
  get isConnected(): boolean {
    return this._state === 'connected';
  }

  /**
   * Check if currently connecting or reconnecting
   */
  get isConnecting(): boolean {
    return this._state === 'connecting' || this._state === 'reconnecting';
  }

  /**
   * Check if can start a connection
   */
  get canConnect(): boolean {
    return this._state === 'disconnected';
  }

  /**
   * Check if can disconnect
   */
  get canDisconnect(): boolean {
    return this._state === 'connected' || this._state === 'connecting';
  }

  /**
   * Check if a transition to the target state is valid
   */
  canTransitionTo(targetState: ConnectionState): boolean {
    return VALID_TRANSITIONS[this._state]?.includes(targetState) ?? false;
  }

  /**
   * Transition to a new state
   * @param newState The target state
   * @param reason Optional reason for the transition
   * @returns true if transition was successful
   * @throws Error if transition is invalid
   */
  transitionTo(newState: ConnectionState, reason?: string): boolean {
    if (this._state === newState) {
      return true; // Already in target state
    }

    if (!this.canTransitionTo(newState)) {
      throw new Error(
        `Invalid state transition: cannot transition from '${this._state}' to '${newState}'`,
      );
    }

    const transition: StateTransition = {
      from: this._state,
      to: newState,
      timestamp: Date.now(),
      reason,
    };

    this._state = newState;
    this._stateHistory.push(transition);

    // Trim history if it exceeds max size
    if (this._stateHistory.length > this._maxHistorySize) {
      this._stateHistory.shift();
    }

    // Notify listeners
    for (const listener of this._listeners) {
      try {
        listener(transition);
      } catch {
        // Ignore listener errors
      }
    }

    return true;
  }

  /**
   * Attempt a transition without throwing on invalid transitions
   * @returns true if transition was successful, false otherwise
   */
  tryTransitionTo(newState: ConnectionState, reason?: string): boolean {
    if (!this.canTransitionTo(newState)) {
      return false;
    }
    return this.transitionTo(newState, reason);
  }

  /**
   * Reset state machine to disconnected state
   */
  reset(): void {
    this._state = 'disconnected';
    this._stateHistory = [];
  }

  /**
   * Subscribe to state changes
   */
  onStateChange(callback: StateChangeCallback): () => void {
    this._listeners.add(callback);
    return () => this._listeners.delete(callback);
  }

  /**
   * Unsubscribe from state changes
   */
  offStateChange(callback: StateChangeCallback): void {
    this._listeners.delete(callback);
  }

  /**
   * Get time since last state change in milliseconds
   */
  get timeSinceLastChange(): number {
    if (this._stateHistory.length === 0) {
      return 0;
    }
    const lastTransition = this._stateHistory[this._stateHistory.length - 1];
    return Date.now() - (lastTransition?.timestamp ?? Date.now());
  }

  /**
   * Get the last transition
   */
  get lastTransition(): StateTransition | null {
    return this._stateHistory[this._stateHistory.length - 1] ?? null;
  }
}
