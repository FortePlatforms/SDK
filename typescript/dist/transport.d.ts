import type { FetchAPI } from './generated/runtime';
/**
 * Wraps a fetch implementation with quick automatic retries for transient failures: network errors and
 * 5xx responses are retried up to 3 times with a 50-100ms jittered backoff. The identical init (and
 * therefore the same Idempotency-Key, if any) is re-sent on every attempt, so a retried idempotent
 * request stays deduplicable server-side.
 */
export declare function withRetries(baseFetch: FetchAPI): FetchAPI;
