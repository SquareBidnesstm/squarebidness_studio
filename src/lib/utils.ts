import { Redis } from "@upstash/redis";
export { formatDuration, formatViews, slugify } from "./helpers";
export { getThumbnailUrl, getEmbedUrl } from "./cloudflare";

const WINDOW_SECONDS = 15 * 60;
const WINDOW_MS = WINDOW_SECONDS * 1000;

let _redis: Redis | null = null;
function getRedis(): Redis | null {
  if (_redis) return _redis;
  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;
  if (!url || !token) return null;
  _redis = new Redis({ url, token });
  return _redis;
}

const _map = new Map<string, { count: number; resetAt: number }>();

export async function checkRateLimit(key: string, max = 10): Promise<{ limited: boolean; retryAfterSeconds: number }> {
  const redis = getRedis();
  if (redis) {
    const rKey = `rl:studio:${key}`;
    const count = await redis.incr(rKey);
    if (count === 1) await redis.expire(rKey, WINDOW_SECONDS);
    if (count > max) { const ttl = await redis.ttl(rKey); return { limited: true, retryAfterSeconds: Math.max(ttl, 0) }; }
    return { limited: false, retryAfterSeconds: 0 };
  }
  const now = Date.now();
  for (const [k, v] of _map.entries()) { if (now > v.resetAt) _map.delete(k); }
  const entry = _map.get(key);
  if (!entry || now > entry.resetAt) { _map.set(key, { count: 1, resetAt: now + WINDOW_MS }); return { limited: false, retryAfterSeconds: 0 }; }
  entry.count++;
  if (entry.count > max) return { limited: true, retryAfterSeconds: Math.ceil((entry.resetAt - now) / 1000) };
  return { limited: false, retryAfterSeconds: 0 };
}

export function isSafeOrigin(req: Request): boolean {
  const origin = req.headers.get("origin") ?? "";
  const referer = req.headers.get("referer") ?? "";
  return ["studio.squarebidness.com", "localhost:3000", ".vercel.app"].some(h => origin.includes(h) || referer.includes(h));
}
