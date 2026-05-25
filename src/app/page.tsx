import Nav from '@/components/Nav';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { site } from '@/content/site';

export default function HomePage() {
  return (
    <>
      <Nav />
      <main>
        <Hero />

        <section className="mx-auto max-w-4xl px-6 py-32 text-center fade-in">
          <p className="eyebrow mb-6">{site.overview.eyebrow}</p>
          <h2 className="h-display text-3xl md:text-5xl text-bone mb-10">
            {site.overview.title}
          </h2>
          <p className="text-stone leading-relaxed font-light">
            {site.overview.body[0]}
          </p>
          <Link
            href="/overview"
            className="mt-12 inline-block text-[11px] uppercase tracking-[0.32em] text-bone border-b border-bone/30 pb-1 hover:border-bone transition-colors"
          >
            Continue Reading
          </Link>
        </section>
      </main>
      <Footer />
    </>
  );
}
