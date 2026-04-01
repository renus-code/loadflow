/**
 * In-Memory Sliding-Window Rate Limiter
 *
 * Tracks requests per IP address using a sliding-window algorithm.
 * Safe for single-server Next.js deployments (dev + production on one machine).
 *
 * For multi-instance / edge deployments, swap this out for a Redis-backed
 * solution such as @upstash/ratelimit.
 */
import { NextRequest, NextResponse } from 'next/server';

interface RateLimitEntry {
  /** Timestamps (ms) of each request within the current window */
  timestamps: number[];
}

interface RateLimitOptions {
  /** Maximum number of requests allowed in the window */
  max: number;
  /** Window size in milliseconds */
  windowMs: number;
}

interface RateLimitResult {
  /** Whether the caller is rate-limited */
  limited: boolean;
  /** Requests remaining in the current window */
  remaining: number;
  /** Seconds until the oldest request expires from the window */
  retryAfter: number;
}

// Global store — persists across hot-reloads in dev via globalThis
const store: Map<string, RateLimitEntry> =
  (globalThis as any).__rateLimitStore ?? ((globalThis as any).__rateLimitStore = new Map());

/**
 * Extracts the real client IP from a Next.js request.
 * Reads X-Forwarded-For first (reverse-proxy header), then X-Real-IP,
 * then falls back to 'unknown'.
 */
function getClientIp(req: NextRequest): string {
  const forwarded = req.headers.get('x-forwarded-for');
  if (forwarded) {
    // x-forwarded-for may contain a comma-separated list; the first is the real client
    return forwarded.split(',')[0].trim();
  }
  return req.headers.get('x-real-ip') ?? 'unknown';
}

/**
 * Checks whether a request is within the allowed rate limit.
 *
 * @param req     - The incoming Next.js request
 * @param options - Rate limit configuration
 * @returns       - Result object with `limited`, `remaining`, and `retryAfter`
 *
 * @example
 * const result = rateLimit(req, { max: 10, windowMs: 15 * 60 * 1000 });
 * if (result.limited) {
 *   return NextResponse.json({ error: 'Too many requests' }, {
 *     status: 429,
 *     headers: { 'Retry-After': String(result.retryAfter) },
 *   });
 * }
 */
export function rateLimit(req: NextRequest, options: RateLimitOptions): RateLimitResult {
  const { max, windowMs } = options;
  const ip = getClientIp(req);
  const now = Date.now();
  const windowStart = now - windowMs;

  const entry = store.get(ip) ?? { timestamps: [] };

  // Slide the window — drop timestamps older than windowStart
  entry.timestamps = entry.timestamps.filter((ts) => ts > windowStart);

  if (entry.timestamps.length >= max) {
    // Oldest timestamp in window — client must wait until it expires
    const oldest = entry.timestamps[0];
    const retryAfter = Math.ceil((oldest + windowMs - now) / 1000);
    store.set(ip, entry);
    return { limited: true, remaining: 0, retryAfter };
  }

  // Allow the request — record this timestamp
  entry.timestamps.push(now);
  store.set(ip, entry);

  return {
    limited: false,
    remaining: max - entry.timestamps.length,
    retryAfter: 0,
  };
}

/**
 * Convenience helper — runs rateLimit and returns a ready-made 429 NextResponse
 * when limited, or `null` when the request is allowed.
 *
 * @example
 * const limitResponse = checkRateLimit(req, { max: 10, windowMs: 15 * 60 * 1000 });
 * if (limitResponse) return limitResponse;
 */
export function checkRateLimit(
  req: NextRequest,
  options: RateLimitOptions
): NextResponse | null {
  const result = rateLimit(req, options);
  if (!result.limited) return null;

  return NextResponse.json(
    {
      error: `Too many requests. Please try again in ${result.retryAfter} second${result.retryAfter === 1 ? '' : 's'}.`,
    },
    {
      status: 429,
      headers: {
        'Retry-After': String(result.retryAfter),
        'X-RateLimit-Limit': String(options.max),
        'X-RateLimit-Remaining': '0',
        'X-RateLimit-Reset': String(Math.ceil((Date.now() + result.retryAfter * 1000) / 1000)),
      },
    }
  );
}
