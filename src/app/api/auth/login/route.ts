import { NextRequest, NextResponse } from 'next/server';
import { SESSION_COOKIE, SESSION_MAX_AGE_SECONDS, createSessionToken } from '@/lib/auth';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

export async function POST(req: NextRequest) {
  const ip = clientIpFromHeaders(req.headers);
  const rl = rateLimit(`login:${ip}`, 5, 10 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json(
      { ok: false, error: 'Too many attempts. Please try again later.' },
      { status: 429, headers: { 'Retry-After': String(rl.retryAfterSeconds) } },
    );
  }

  const expected = process.env.SITE_PASSWORD;
  if (!expected) {
    return NextResponse.json({ ok: false, error: 'Server not configured.' }, { status: 500 });
  }

  let password = '';
  let next = '/';
  try {
    const ct = req.headers.get('content-type') || '';
    if (ct.includes('application/json')) {
      const body = await req.json();
      password = String(body?.password ?? '');
      if (typeof body?.next === 'string') next = body.next;
    } else {
      const form = await req.formData();
      password = String(form.get('password') ?? '');
      const n = form.get('next');
      if (typeof n === 'string') next = n;
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request.' }, { status: 400 });
  }

  // Brief delay to flatten timing differences.
  await new Promise((r) => setTimeout(r, 150));

  if (!timingSafeEqual(password, expected)) {
    return NextResponse.json({ ok: false, error: 'Incorrect password.' }, { status: 401 });
  }

  const safeNext = next.startsWith('/') && !next.startsWith('//') ? next : '/';
  const token = await createSessionToken();

  const res = NextResponse.json({ ok: true, next: safeNext });
  res.cookies.set({
    name: SESSION_COOKIE,
    value: token,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: SESSION_MAX_AGE_SECONDS,
  });
  return res;
}
