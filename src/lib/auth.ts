// Edge-compatible HMAC session helpers. No Node `crypto` imports — only Web Crypto.

export const SESSION_COOKIE = 'cliff_session';
export const SESSION_MAX_AGE_SECONDS = 60 * 60 * 24 * 14; // 14 days

const enc = new TextEncoder();

function b64url(bytes: ArrayBuffer | Uint8Array): string {
  const b = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = '';
  for (let i = 0; i < b.length; i++) s += String.fromCharCode(b[i]);
  return btoa(s).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

async function hmac(secret: string, message: string): Promise<string> {
  const key = await crypto.subtle.importKey(
    'raw',
    enc.encode(secret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign', 'verify'],
  );
  const sig = await crypto.subtle.sign('HMAC', key, enc.encode(message));
  return b64url(sig);
}

function constantTimeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let r = 0;
  for (let i = 0; i < a.length; i++) r |= a.charCodeAt(i) ^ b.charCodeAt(i);
  return r === 0;
}

function getSecret(): string {
  const s = process.env.SESSION_SECRET;
  if (!s || s.length < 16) {
    // Fail closed in production; allow a dev default to avoid crashing local dev.
    if (process.env.NODE_ENV === 'production') {
      throw new Error('SESSION_SECRET is not configured');
    }
    return 'dev-only-insecure-secret-change-me';
  }
  return s;
}

// Token format: <expIso>.<sig>   where sig = HMAC(secret, expIso)
export async function createSessionToken(maxAgeSeconds = SESSION_MAX_AGE_SECONDS): Promise<string> {
  const exp = Date.now() + maxAgeSeconds * 1000;
  const payload = String(exp);
  const sig = await hmac(getSecret(), payload);
  return `${payload}.${sig}`;
}

export async function verifySessionToken(token: string | undefined | null): Promise<boolean> {
  if (!token) return false;
  const dot = token.indexOf('.');
  if (dot <= 0) return false;
  const payload = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  const exp = Number(payload);
  if (!Number.isFinite(exp) || exp < Date.now()) return false;
  const expected = await hmac(getSecret(), payload);
  return constantTimeEqual(sig, expected);
}
