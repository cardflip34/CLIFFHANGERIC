'use client';

import { useState } from 'react';

export default function InquiryForm() {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [err, setErr] = useState<string | null>(null);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setState('sending');
    setErr(null);
    const fd = new FormData(e.currentTarget);
    const payload = Object.fromEntries(fd.entries());
    try {
      const res = await fetch('/api/inquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json().catch(() => ({}));
      if (res.ok && data?.ok) setState('sent');
      else { setState('error'); setErr(data?.error || 'Could not send. Please try again.'); }
    } catch {
      setState('error');
      setErr('Network error.');
    }
  }

  if (state === 'sent') {
    return (
      <div className="text-center border border-white/10 py-16 px-6 fade-in">
        <p className="eyebrow mb-4">Received</p>
        <p className="text-bone font-light">Thank you. We will be in touch personally.</p>
      </div>
    );
  }

  const field = 'w-full bg-transparent border-b border-stone/40 focus:border-bone outline-none py-3 text-bone placeholder:text-stone/60 transition-colors';

  return (
    <form onSubmit={onSubmit} className="space-y-8">
      <input name="name" required placeholder="Name" className={field} />
      <input name="email" type="email" required placeholder="Email" className={field} />
      <input name="phone" placeholder="Phone (optional)" className={field} />
      <textarea name="message" required rows={5} placeholder="A brief note" className={field + ' resize-none'} />

      <button
        type="submit"
        disabled={state === 'sending'}
        className="w-full border border-bone/40 px-8 py-3 text-[11px] uppercase tracking-[0.32em] text-bone hover:bg-bone hover:text-ink transition-colors duration-500 ease-apple disabled:opacity-40"
      >
        {state === 'sending' ? 'Sending…' : 'Submit'}
      </button>

      {err && <p className="text-[12px] text-red-300/80" role="alert">{err}</p>}
    </form>
  );
}
