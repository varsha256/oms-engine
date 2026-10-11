import { redis } from './redis';

const IDEMPOTENCY_TTL_SECONDS = 86400; // 24 hours

export async function saveIdempotentResponse(
  tenantKey: string,
  idempotencyKey: string | null,
  status: number,
  body: Record<string, any>
): Promise<void> {
  if (!idempotencyKey) return;

  const cacheKey = `idempotency:${tenantKey}:${idempotencyKey}`;
  const payload = JSON.stringify({ status, body });

  try {
    await redis.set(cacheKey, payload, { ex: IDEMPOTENCY_TTL_SECONDS });
  } catch (err) {
    console.error('Failed to store idempotency record in Redis:', err);
  }
}