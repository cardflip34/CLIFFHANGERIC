import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { site } from '@/content/site';

export const metadata = { title: 'Location' };

export default function LocationPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-16 px-6 fade-in">
        <section className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-6">{site.location.eyebrow}</p>
          <h1 className="h-display text-4xl md:text-6xl text-bone mb-12">{site.location.title}</h1>
          <div className="space-y-6 text-stone leading-relaxed font-light text-[15px] md:text-base">
            {site.location.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>

        <ul className="mx-auto max-w-3xl mt-20 grid grid-cols-1 md:grid-cols-2 gap-6">
          {site.location.points.map((p) => (
            <li key={p} className="border-l border-bone/20 pl-5 py-2 text-bone/90 font-light">
              {p}
            </li>
          ))}
        </ul>
      </main>
      <Footer />
    </>
  );
}
