import Image from 'next/image';
import Link from 'next/link';
import { site } from '@/content/site';
import { getHeroImage } from '@/lib/gallery';

export default function Hero() {
  const hero = getHeroImage();
  return (
    <section className="relative h-[100svh] w-full overflow-hidden">
      {hero ? (
        <Image
          src={hero.src}
          alt={hero.alt ?? site.name}
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
      ) : (
        <div className="absolute inset-0 bg-gradient-to-b from-charcoal via-ink to-black" />
      )}
      <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-black/10 to-black/70" />

      <div className="relative z-10 flex h-full flex-col items-center justify-end pb-24 px-6 text-center fade-in">
        <p className="eyebrow mb-6">{site.hero.eyebrow}</p>
        <h1 className="h-display text-5xl sm:text-7xl md:text-8xl text-bone tracking-tight">
          {site.hero.title}
        </h1>
        <p className="mt-6 max-w-xl text-sm md:text-base text-stone font-light">
          {site.hero.sub}
        </p>
        <Link
          href="/gallery"
          className="mt-12 inline-block border border-bone/40 px-8 py-3 text-[11px] uppercase tracking-[0.32em] text-bone hover:bg-bone hover:text-ink transition-colors duration-500 ease-apple"
        >
          {site.hero.cta}
        </Link>
      </div>
    </section>
  );
}
