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
