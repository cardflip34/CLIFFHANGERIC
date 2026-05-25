import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { site } from '@/content/site';

export const metadata = { title: 'Amenities' };

export default function AmenitiesPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-16 px-6 fade-in">
        <section className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-6">{site.amenities.eyebrow}</p>
          <h1 className="h-display text-4xl md:text-6xl text-bone mb-16">{site.amenities.title}</h1>
        </section>

        <ul className="mx-auto max-w-4xl grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-10">
          {site.amenities.items.map((a) => (
            <li key={a.name} className="border-t border-white/5 pt-6">
              <div className="text-bone text-base md:text-lg font-light">{a.name}</div>
              <div className="text-stone text-sm mt-2 leading-relaxed">{a.detail}</div>
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
