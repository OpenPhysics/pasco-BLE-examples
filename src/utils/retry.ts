/**
 * Retry Utility
 *
 * Provides retry logic with exponential backoff for BLE operations.
 */

/**
 * Options for retry behavior
 */
export interface RetryOptions {
  /** Maximum number of retry attempts (default: 3) */
  maxRetries?: number;
  /** Initial delay between retries in ms (default: 1000) */
  initialDelayMs?: number;
  /** Maximum delay between retries in ms (default: 10000) */
  maxDelayMs?: number;
  /** Multiplier for exponential backoff (default: 2) */
  backoffMultiplier?: number;
  /** Optional callback when a retry occurs */
  onRetry?: (attempt: number, error: Error, nextDelayMs: number) => void;
  /** Optional predicate to determine if error is retryable */
  isRetryable?: (error: Error) => boolean;
}

const DEFAULT_OPTIONS: Required<Omit<RetryOptions, 'onRetry' | 'isRetryable'>> = {
  maxRetries: 3,
  initialDelayMs: 1000,
  maxDelayMs: 10000,
  backoffMultiplier: 2,
};

/**
 * Delay execution for a specified time
 */
export function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Calculate delay for a given attempt using exponential backoff
 */
export function calculateBackoffDelay(
  attempt: number,
  initialDelayMs: number,
  maxDelayMs: number,
  multiplier: number,
): number {
  const exponentialDelay = initialDelayMs * multiplier ** (attempt - 1);
  return Math.min(exponentialDelay, maxDelayMs);
}

/**
 * Execute an operation with retry logic and exponential backoff
 *
 * @param operation - The async operation to execute
 * @param options - Retry configuration options
 * @returns The result of the operation
 * @throws The last error if all retries fail
 *
 * @example
 * ```typescript
 * const result = await withRetry(
 *   () => device.connect(),
 *   { maxRetries: 3, initialDelayMs: 1000 }
 * );
 * ```
 */
export async function withRetry<T>(
  operation: () => Promise<T>,
  options: RetryOptions = {},
): Promise<T> {
  const { maxRetries, initialDelayMs, maxDelayMs, backoffMultiplier } = {
    ...DEFAULT_OPTIONS,
    ...options,
  };

  let lastError: Error | undefined;

  for (let attempt = 1; attempt <= maxRetries + 1; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      // Check if we should retry
      if (attempt > maxRetries) {
        break;
      }

      // Check if error is retryable
      if (options.isRetryable && !options.isRetryable(lastError)) {
        break;
      }

      // Calculate delay for next attempt
      const delayMs = calculateBackoffDelay(attempt, initialDelayMs, maxDelayMs, backoffMultiplier);

      // Notify about retry
      if (options.onRetry) {
        options.onRetry(attempt, lastError, delayMs);
      }

      // Wait before retrying
      await delay(delayMs);
    }
  }

  throw lastError;
}

/**
 * Create a retryable version of an async function
 *
 * @param fn - The function to wrap
 * @param options - Retry configuration options
 * @returns A wrapped function that retries on failure
 *
 * @example
 * ```typescript
 * const retryableConnect = retryable(
 *   (device: BLEDevice) => client.connect(device),
 *   { maxRetries: 3 }
 * );
 * await retryableConnect(myDevice);
 * ```
 */
export function retryable<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  options: RetryOptions = {},
): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) => withRetry(() => fn(...args), options);
}

/**
 * Error thrown when an operation times out
 */
export class TimeoutError extends Error {
  constructor(message: string = 'Operation timed out') {
    super(message);
    this.name = 'TimeoutError';
  }
}

/**
 * Wrap a promise with a timeout.
 * If the promise doesn't resolve within the specified time, a TimeoutError is thrown.
 *
 * @param promise - The promise to wrap
 * @param timeoutMs - Timeout duration in milliseconds
 * @param message - Optional custom error message
 * @returns The result of the promise if it resolves in time
 * @throws TimeoutError if the promise doesn't resolve within the timeout
 *
 * @example
 * ```typescript
 * // Basic usage
 * const result = await withTimeout(
 *   fetch('https://api.example.com/data'),
 *   5000,
 *   'API request timed out'
 * );
 *
 * // With async operations
 * const data = await withTimeout(
 *   device.readData('Temperature'),
 *   3000
 * );
 * ```
 */
export function withTimeout<T>(
  promise: Promise<T>,
  timeoutMs: number,
  message?: string,
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timeoutId = setTimeout(() => {
      reject(new TimeoutError(message ?? `Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);

    promise
      .then((result) => {
        clearTimeout(timeoutId);
        resolve(result);
      })
      .catch((error) => {
        clearTimeout(timeoutId);
        reject(error);
      });
  });
}

/**
 * Create a timeout-wrapped version of an async function.
 *
 * @param fn - The async function to wrap
 * @param timeoutMs - Timeout duration in milliseconds
 * @param message - Optional custom error message
 * @returns A wrapped function that times out after the specified duration
 *
 * @example
 * ```typescript
 * const timedFetch = withTimeoutFn(
 *   (url: string) => fetch(url),
 *   5000,
 *   'Fetch timed out'
 * );
 * const response = await timedFetch('https://api.example.com');
 * ```
 */
export function withTimeoutFn<TArgs extends unknown[], TResult>(
  fn: (...args: TArgs) => Promise<TResult>,
  timeoutMs: number,
  message?: string,
): (...args: TArgs) => Promise<TResult> {
  return (...args: TArgs) => withTimeout(fn(...args), timeoutMs, message);
}
