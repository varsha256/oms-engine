import { NextRequest, NextResponse } from 'next/server';
import Redis from 'ioredis';

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');

export async function handleApiMiddleware(req: NextRequest) {
  const tenantKey = req.headers.get('X-Tenant-Key');
  if (!tenantKey) {
    return NextResponse.json({ error: 'UNAUTHORIZED', message: 'Missing X-Tenant-Key header' }, { status: 401 });
  }

  const idempotencyKey = req.headers.get('Idempotency-Key');
  if (idempotencyKey && req.method === 'POST') {
    const cacheKey = `idempotency:${tenantKey}:${idempotencyKey}`;
    const cachedResponse = await redis.get(cacheKey);

    if (cachedResponse) {
      const parsed = JSON.parse(cachedResponse);
      return NextResponse.json(parsed.body, { status: parsed.status, headers: { 'X-Cache': 'HIT' } });
    }
  }

  return null; // Proceed to route handler
}