import "server-only";

/** Transient Gemini errors worth retrying: 429 (Requests Per Minute bursts, not the
 *  daily quota) and 503 (Google's own servers temporarily overloaded). */
const RETRYABLE_STATUSES = new Set([429, 503]);

export async function withRetry<T>(fn: () => Promise<T>, maxAttempts = 4): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (err) {
      lastError = err;
      const status = (err as { status?: number })?.status;
      if (!status || !RETRYABLE_STATUSES.has(status) || attempt === maxAttempts - 1) throw err;
      const delayMs = 8000 * 2 ** attempt;
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }
  throw lastError;
}
