// Lightweight in-memory rate limiter for login attempts. Per-IP fixed window.
// Adequate for low-traffic private sites; swap for Upstash/KV at scale.

type Bucket = { count: number; resetAt: number };
const store = new Map<string, Bucket>();

export interface RateLimitResult {
  allowed: boolean;
  remaining: number;
  retryAfterSeconds: number;
}

export function rateLimit(key: string, limit = 5, windowMs = 10 * 60 * 1000): RateLimitResult {
  const now = Date.now();
  const b = store.get(key);
  if (!b || b.resetAt <= now) {
    store.set(key, { count: 1, resetAt: now + windowMs });
    return { allowed: true, remaining: limit - 1, retryAfterSeconds: 0 };
  }
  if (b.count >= limit) {
    return { allowed: false, remaining: 0, retryAfterSeconds: Math.ceil((b.resetAt - now) / 1000) };
  }
  b.count += 1;
  return { allowed: true, remaining: limit - b.count, retryAfterSeconds: 0 };
}

export function clientIpFromHeaders(h: Headers): string {
  const xff = h.get('x-forwarded-for');
  if (xff) return xff.split(',')[0].trim();
  return h.get('x-real-ip') || 'unknown';
}
