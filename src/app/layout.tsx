import type { Metadata, Viewport } from 'next';
import './globals.css';
import { site } from '@/content/site';

export const metadata: Metadata = {
  title: { default: site.name, template: `%s · ${site.name}` },
  description: site.description,
  robots: { index: false, follow: false, nocache: true, googleBot: { index: false, follow: false } },
  referrer: 'strict-origin-when-cross-origin',
  formatDetection: { telephone: false },
};

export const viewport: Viewport = {
  themeColor: '#0a0a0a',
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="robots" content="noindex, nofollow, noarchive, nosnippet, noimageindex" />
      </head>
      <body className="min-h-screen bg-ink text-bone antialiased">
        {children}
      </body>
    </html>
  );
}
