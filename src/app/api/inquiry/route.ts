import { NextRequest, NextResponse } from 'next/server';
import { clientIpFromHeaders, rateLimit } from '@/lib/rate-limit';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const ip = clientIpFromHeaders(req.headers);
  const rl = rateLimit(`inquiry:${ip}`, 5, 60 * 60 * 1000);
  if (!rl.allowed) {
    return NextResponse.json({ ok: false, error: 'Please try again later.' }, { status: 429 });
  }

  let payload: Record<string, string> = {};
  try {
    const body = await req.json();
    for (const k of ['name', 'email', 'phone', 'message']) {
      payload[k] = String(body?.[k] ?? '').slice(0, 2000);
    }
  } catch {
    return NextResponse.json({ ok: false, error: 'Bad request.' }, { status: 400 });
  }

  if (!payload.name || !payload.email || !payload.message) {
    return NextResponse.json({ ok: false, error: 'Missing required fields.' }, { status: 422 });
  }

  const to = process.env.INQUIRY_TO_EMAIL;
  const resendKey = process.env.RESEND_API_KEY;

  if (to && resendKey) {
    try {
      await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          from: 'Cliffhanger IC <inquiry@cliffhangeric.com>',
          to,
          subject: `Private Inquiry — ${payload.name}`,
          text: `Name:  ${payload.name}\nEmail: ${payload.email}\nPhone: ${payload.phone}\n\n${payload.message}`,
        }),
      });
    } catch (e) {
      console.error('[inquiry] send failed', e);
    }
  } else {
    console.log('[inquiry]', { ...payload, ip });
  }

  return NextResponse.json({ ok: true });
}
