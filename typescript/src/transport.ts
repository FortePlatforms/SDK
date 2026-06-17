import type { FetchAPI } from './generated/runtime';

const MAX_RETRIES = 3;
const MIN_DELAY_MS = 50;
const MAX_DELAY_MS = 100;
const SAFE_METHODS = new Set(['GET', 'HEAD']);

function headerPresent(headers: HeadersInit | undefined, name: string): boolean {
  if (!headers) return false;
  const lower = name.toLowerCase();
  if (headers instanceof Headers) return headers.has(name);
  if (Array.isArray(headers)) return headers.some(([k]) => k.toLowerCase() === lower);
  return Object.keys(headers).some((k) => k.toLowerCase() === lower);
}

/**
 * A request is safe to auto-retry only if it has no side effects (GET/HEAD) or it carries an
 * Idempotency-Key header (i.e. it targets an idempotent endpoint, so the server can deduplicate the
 * replay). Everything else is left alone to avoid duplicating effects like a double charge.
 */
function isRetryable(init: RequestInit | undefined): boolean {
  const method = (init?.method ?? 'GET').toUpperCase();
  if (SAFE_METHODS.has(method)) return true;
  return headerPresent(init?.headers, 'Idempotency-Key');
}

function delay(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Wraps a fetch implementation with quick automatic retries for transient failures: network errors and
 * 5xx responses are retried up to 3 times with a 50-100ms jittered backoff. The identical init (and
 * therefore the same Idempotency-Key, if any) is re-sent on every attempt, so a retried idempotent
 * request stays deduplicable server-side.
 */
export function withRetries(baseFetch: FetchAPI): FetchAPI {
  return async (input: Parameters<FetchAPI>[0], init?: Parameters<FetchAPI>[1]): Promise<Response> => {
    const retryable = isRetryable(init as RequestInit | undefined);
    for (let attempt = 0; ; attempt++) {
      try {
        const response = await baseFetch(input, init);
        if (response.status < 500 || !retryable || attempt >= MAX_RETRIES) {
          return response;
        }
      } catch (error) {
        if (!retryable || attempt >= MAX_RETRIES) {
          throw error;
        }
      }
      await delay(MIN_DELAY_MS + Math.random() * (MAX_DELAY_MS - MIN_DELAY_MS));
    }
  };
}
