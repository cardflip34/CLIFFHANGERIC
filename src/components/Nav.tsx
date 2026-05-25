'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useState } from 'react';
import { site } from '@/content/site';

export default function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/login';
  }

  return (
    <header className="fixed inset-x-0 top-0 z-40 backdrop-blur-md bg-ink/60 border-b border-white/5">
      <nav className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link href="/" className="text-bone font-light tracking-display text-sm">
          CLIFFHANGER&nbsp;IC
        </Link>

        <ul className="hidden md:flex items-center gap-8">
          {site.nav.slice(1).map((item) => {
            const active = pathname === item.href;
            return (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`text-xs uppercase tracking-[0.28em] transition-colors duration-300 ease-apple ${
                    active ? 'text-bone' : 'text-stone hover:text-bone'
                  }`}
                >
                  {item.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              onClick={logout}
              className="text-xs uppercase tracking-[0.28em] text-stone hover:text-bone transition-colors duration-300"
              aria-label="Sign out"
            >
              Exit
            </button>
          </li>
        </ul>

        <button
          className="md:hidden text-bone p-2"
          aria-label="Toggle menu"
          aria-expanded={open}
          onClick={() => setOpen((v) => !v)}
        >
          <span className="block w-6 h-px bg-bone mb-1.5" />
          <span className="block w-6 h-px bg-bone mb-1.5" />
          <span className="block w-4 h-px bg-bone ml-auto" />
        </button>
      </nav>

      {open && (
        <div className="md:hidden border-t border-white/5 bg-ink/95">
          <ul className="px-6 py-6 space-y-5">
            {site.nav.slice(1).map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="block text-sm uppercase tracking-[0.28em] text-bone"
                >
                  {item.label}
                </Link>
              </li>
            ))}
            <li>
              <button
                onClick={logout}
                className="block text-sm uppercase tracking-[0.28em] text-stone"
              >
                Exit
              </button>
            </li>
          </ul>
        </div>
      )}
    </header>
  );
}
