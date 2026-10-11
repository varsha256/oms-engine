import { NextRequest, NextResponse } from 'next/server';
import { createServerClient } from '@supabase/ssr';
import { redis } from '../lib/redis';

// 24-hour expiration window for idempotency records
const IDEMPOTENCY_TTL_SECONDS = 86400;

export async function middleware(req: NextRequest) {
  if (!req.nextUrl.pathname.startsWith('/api')) {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey =
      process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY ??
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (!supabaseUrl || !supabaseKey) {
      return NextResponse.next({ request: req });
    }

    let response = NextResponse.next({ request: req });
    const supabase = createServerClient(supabaseUrl, supabaseKey, {
      cookies: {
        getAll() {
          return req.cookies.getAll();
        },
        setAll(cookiesToSet, headers) {
          cookiesToSet.forEach(({ name, value }) => req.cookies.set(name, value));
          response = NextResponse.next({ request: req });
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options);
          });
          Object.entries(headers).forEach(([name, value]) => {
            response.headers.set(name, value);
          });
        },
      },
    });

    const { error } = await supabase.auth.getClaims();
    if (error && error.name !== 'AuthSessionMissingError') {
      throw error;
    }
    return response;
  }

  if (req.nextUrl.pathname === '/api/onboarding/tenant') {
    return NextResponse.next();
  }

  // 1. Multi-Tenant Authorization Check
  const tenantKey = req.headers.get('X-Tenant-Key');
  if (!tenantKey) {
    return NextResponse.json(
      {
        error: 'UNAUTHORIZED',
        message: 'Missing required X-Tenant-Key header.',
      },
      { status: 401 }
    );
  }

  // Pass validated tenant key to downstream handlers via request headers
  const requestHeaders = new Headers(req.headers);
  requestHeaders.set('x-tenant-id', tenantKey);

  // 2. Idempotency Guard for Mutation Requests (POST, PUT, PATCH, DELETE)
  const idempotencyKey = req.headers.get('Idempotency-Key');
  if (idempotencyKey && ['POST', 'PUT', 'PATCH', 'DELETE'].includes(req.method)) {
    const cacheKey = `idempotency:${tenantKey}:${idempotencyKey}`;

    try {
      const cachedRecord = await redis.get<string>(cacheKey);

      if (cachedRecord) {
        const parsed = JSON.parse(cachedRecord);

        // Return the exact cached response from the previous successful execution
        return NextResponse.json(parsed.body, {
          status: parsed.status,
          headers: {
            'X-Cache': 'HIT',
            'X-Idempotency-Replayed': 'true',
          },
        });
      }
    } catch (err) {
      console.error('Redis Idempotency Check Failed:', err);
      // Fall through on Redis cache failures to allow critical requests to proceed
    }
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

// Scope middleware specifically to application API routes
export const config = {
  matcher: ['/', '/signin', '/dashboard/:path*', '/auth/:path*', '/api/:path*'],
};