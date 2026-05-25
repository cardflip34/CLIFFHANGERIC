import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, verifySessionToken } from '@/lib/auth';

export const config = {
  // Run on everything except Next internals, API auth routes, and public assets.
  matcher: ['/((?!_next/|api/auth/|favicon.ico|robots.txt|login).*)'],
};

export async function middleware(req: NextRequest) {
  const token = req.cookies.get(SESSION_COOKIE)?.value;
  const ok = await verifySessionToken(token);
  if (ok) {
    const res = NextResponse.next();
    res.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    return res;
  }
  const url = req.nextUrl.clone();
  url.pathname = '/login';
  url.searchParams.set('next', req.nextUrl.pathname + req.nextUrl.search);
  return NextResponse.redirect(url);
}
