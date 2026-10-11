import { NextResponse, type NextRequest } from 'next/server';
import { createClient } from '../../../lib/supabase/server';

export async function GET(request: NextRequest) {
  const code = request.nextUrl.searchParams.get('code');
  const requestedPath = request.nextUrl.searchParams.get('next');
  const nextPath =
    requestedPath?.startsWith('/') &&
    !requestedPath.startsWith('//') &&
    !requestedPath.includes('\\')
      ? requestedPath
      : '/dashboard';

  if (!code) {
    return NextResponse.redirect(
      new URL('/signin?error=oauth_callback', request.url),
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.exchangeCodeForSession(code);

  if (error) {
    return NextResponse.redirect(
      new URL('/signin?error=oauth_callback', request.url),
      { headers: { 'Cache-Control': 'private, no-store' } }
    );
  }

  return NextResponse.redirect(new URL(nextPath, request.url), {
    headers: { 'Cache-Control': 'private, no-store' },
  });
}
