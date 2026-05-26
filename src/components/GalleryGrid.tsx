'use client';

import Image from 'next/image';
import { useCallback, useEffect, useRef, useState } from 'react';
import type { GalleryImage } from '@/lib/gallery';

export default function GalleryGrid({ images }: { images: GalleryImage[] }) {
  const [index, setIndex] = useState<number | null>(null);
  const startX = useRef<number | null>(null);

  const open = useCallback((i: number) => setIndex(i), []);
  const close = useCallback(() => setIndex(null), []);
  const next = useCallback(
    () => setIndex((i) => (i === null ? null : (i + 1) % images.length)),
    [images.length],
  );
  const prev = useCallback(
    () => setIndex((i) => (i === null ? null : (i - 1 + images.length) % images.length)),
    [images.length],
  );

  useEffect(() => {
    if (index === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') close();
      else if (e.key === 'ArrowRight') next();
      else if (e.key === 'ArrowLeft') prev();
    };
    window.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [index, close, next, prev]);

  if (!images.length) {
    return (
      <div className="mx-auto max-w-3xl text-center py-32 text-stone">
        <p className="eyebrow mb-4">Gallery</p>
        <p className="text-bone/80 font-light">
          Imagery is being prepared. Run <code className="text-bone">npm run ingest</code> and
          <code className="text-bone"> npm run process-images</code> to populate.
        </p>
      </div>
    );
  }

  const current = index !== null ? images[index] : null;

  return (
    <>
      <div className="masonry">
        {images.map((img, i) => (
          <button
            key={img.id}
            onClick={() => open(i)}
            className="group block w-full overflow-hidden bg-graphite/40"
            aria-label={`Open image ${i + 1} of ${images.length}`}
          >
            <Image
              src={img.thumb || img.src}
              alt={img.alt ?? ''}
              width={img.width}
              height={img.height}
              loading={i < 6 ? 'eager' : 'lazy'}
              sizes="(min-width:1536px) 25vw, (min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
              className="h-auto w-full opacity-90 transition-all duration-700 ease-apple group-hover:opacity-100 group-hover:scale-[1.01]"
            />
          </button>
        ))}
      </div>

      {current && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Image viewer"
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/95 fade-in"
          onClick={close}
          onTouchStart={(e) => (startX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (startX.current === null) return;
            const dx = e.changedTouches[0].clientX - startX.current;
            startX.current = null;
            if (Math.abs(dx) > 40) (dx < 0 ? next : prev)();
          }}
        >
          <button
            className="absolute top-5 right-5 text-bone/80 hover:text-bone text-xs uppercase tracking-[0.32em] z-10"
            onClick={(e) => { e.stopPropagation(); close(); }}
            aria-label="Close"
          >
            Close
          </button>

          <button
            className="absolute left-3 md:left-6 top-1/2 -translate-y-1/2 text-bone/70 hover:text-bone z-10 p-3"
            onClick={(e) => { e.stopPropagation(); prev(); }}
            aria-label="Previous image"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>

          <button
            className="absolute right-3 md:right-6 top-1/2 -translate-y-1/2 text-bone/70 hover:text-bone z-10 p-3"
            onClick={(e) => { e.stopPropagation(); next(); }}
            aria-label="Next image"
          >
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1">
              <path d="M9 6l6 6-6 6" />
            </svg>
          </button>

          <div
            className="relative max-w-[96vw] max-h-[92vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              key={current.id}
              src={current.src}
              alt={current.alt ?? ''}
              width={current.width}
              height={current.height}
              sizes="100vw"
              className="max-h-[90vh] w-auto h-auto object-contain"
              priority
            />
            <div className="absolute top-5 left-5 text-[11px] uppercase tracking-[0.32em] text-stone">
              {String((index ?? 0) + 1).padStart(2, '0')} / {String(images.length).padStart(2, '0')}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
