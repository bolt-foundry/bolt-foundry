// Simple delay function
const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

/**
 * Creates a concurrency limiter function that ensures at most `concurrency`
 * async operations run simultaneously.
 */
export function createLimiter(concurrency: number) {
  let active = 0;
  const queue: Array<() => void> = [];

  return async function limited<T>(fn: () => Promise<T>): Promise<T> {
    while (active >= concurrency) {
      await new Promise<void>((resolve) => queue.push(resolve));
    }

    active++;
    try {
      return await fn();
    } finally {
      active--;
      queue.shift()?.();
    }
  };
}

/**
 * Process items in batches with a maximum batch size.
 * Each batch runs in parallel, but batches are processed sequentially.
 */
export async function batchProcess<T, R>(
  items: Array<T>,
  processor: (item: T) => Promise<R>,
  batchSize: number,
  onProgress?: (completed: number, total: number) => void,
): Promise<Array<R>> {
  const results: Array<R> = [];
  let completed = 0;

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map(async (item) => {
        const result = await processor(item);
        completed++;
        onProgress?.(completed, items.length);
        return result;
      }),
    );
    results.push(...batchResults);
  }

  return results;
}

/**
 * Process items in parallel with concurrency control and proper error handling.
 * Returns all results including failures.
 */
export function parallelMap<T, R>(
  items: Array<T>,
  processor: (item: T, index: number) => Promise<R>,
  options: {
    concurrency: number;
    onProgress?: (completed: number, total: number) => void;
  },
): Promise<Array<PromiseSettledResult<R>>> {
  const limit = createLimiter(options.concurrency);
  let completed = 0;

  return Promise.allSettled(
    items.map(async (item, index) => {
      const result = await limit(() => processor(item, index));
      completed++;
      options.onProgress?.(completed, items.length);
      return result;
    }),
  );
}

/**
 * Retry a function with exponential backoff
 */
export async function withRetry<T>(
  fn: () => Promise<T>,
  options: {
    attempts?: number;
    delayMs?: number;
    onRetry?: (error: Error, attempt: number) => void;
  } = {},
): Promise<T> {
  const { attempts = 3, delayMs = 1000, onRetry } = options;
  let lastError: Error;

  for (let attempt = 0; attempt < attempts; attempt++) {
    try {
      return await fn();
    } catch (error) {
      lastError = error instanceof Error ? error : new Error(String(error));

      if (attempt < attempts - 1) {
        onRetry?.(lastError, attempt + 1);

        // Exponential backoff for rate limits
        if (
          lastError.message.includes("rate limit") ||
          lastError.message.includes("429")
        ) {
          await delay(delayMs * Math.pow(2, attempt));
        } else {
          await delay(delayMs);
        }
      }
    }
  }

  throw lastError!;
}
