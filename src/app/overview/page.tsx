import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import { site } from '@/content/site';

export const metadata = { title: 'Overview' };

export default function OverviewPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-16 px-6 fade-in">
        <section className="mx-auto max-w-3xl text-center">
          <p className="eyebrow mb-6">{site.overview.eyebrow}</p>
          <h1 className="h-display text-4xl md:text-6xl text-bone mb-12">{site.overview.title}</h1>
          <div className="space-y-8 text-stone leading-relaxed font-light text-[15px] md:text-base">
            {site.overview.body.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        </section>

        <section className="mx-auto max-w-5xl mt-24 grid grid-cols-2 md:grid-cols-5 border-t border-white/5 divide-x divide-white/5">
          {site.overview.stats.map((s) => (
            <div key={s.label} className="text-center py-10 px-4">
              <div className="h-display text-2xl md:text-3xl text-bone">{s.value}</div>
              <div className="eyebrow mt-3">{s.label}</div>
            </div>
          ))}
        </section>
      </main>
      <Footer />
    </>
  );
}
