import "server-only";

/**
 * In-memory sliding-window limiter for the admin login action. There is no
 * database/Redis in this app (see ARCHITECTURE.md "Data layer"), so this
 * resets on server restart — acceptable for a single/few-admin dashboard
 * where the goal is slowing down online brute-force, not a hard guarantee.
 */

const WINDOW_MS = 15 * 60 * 1000;
const MAX_ATTEMPTS = 5;

type Bucket = { count: number; windowStart: number };

const buckets = new Map<string, Bucket>();

function prune(now: number) {
  for (const [key, bucket] of buckets) {
    if (now - bucket.windowStart > WINDOW_MS) buckets.delete(key);
  }
}

/** Call once per login attempt, before verifying credentials. */
export function isRateLimited(key: string): boolean {
  const now = Date.now();
  prune(now);

  const bucket = buckets.get(key);
  if (!bucket || now - bucket.windowStart > WINDOW_MS) return false;
  return bucket.count >= MAX_ATTEMPTS;
}

/** Call after a failed login attempt for `key`. */
export function recordFailedAttempt(key: string): void {
  const now = Date.now();
  const bucket = buckets.get(key);

  if (!bucket || now - bucket.windowStart > WINDOW_MS) {
    buckets.set(key, { count: 1, windowStart: now });
    return;
  }

  bucket.count += 1;
}

/** Call after a successful login to let the account attempt again freely. */
export function clearAttempts(key: string): void {
  buckets.delete(key);
}
