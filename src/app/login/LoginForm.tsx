'use client';

import { useState } from 'react';

export default function LoginForm({ next }: { next: string }) {
  const [pw, setPw] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setBusy(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password: pw, next }),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) {
        window.location.href = data.next || '/';
        return;
      }
      setError(data?.error || 'Incorrect password.');
    } catch {
      setError('Network error. Try again.');
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <label className="block text-left">
        <span className="sr-only">Access code</span>
        <input
          type="password"
          autoComplete="current-password"
          autoFocus
          value={pw}
          onChange={(e) => setPw(e.target.value)}
          placeholder="Access code"
          className="w-full bg-transparent border-b border-stone/40 focus:border-bone outline-none py-3 text-center text-bone tracking-[0.4em] placeholder:text-stone/50 placeholder:tracking-[0.2em] transition-colors"
          aria-label="Access code"
        />
      </label>

      <button
        type="submit"
        disabled={busy || !pw}
        className="w-full border border-bone/40 px-8 py-3 text-[11px] uppercase tracking-[0.32em] text-bone hover:bg-bone hover:text-ink transition-colors duration-500 ease-apple disabled:opacity-40 disabled:hover:bg-transparent disabled:hover:text-bone"
      >
        {busy ? 'Verifying…' : 'Enter'}
      </button>

      <div className="h-5">
        {error && <p className="text-[12px] text-red-300/80" role="alert">{error}</p>}
      </div>
    </form>
  );
}
