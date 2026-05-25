import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import InquiryForm from './InquiryForm';
import { site } from '@/content/site';

export const metadata = { title: 'Private Inquiry' };

export default function InquiryPage() {
  return (
    <>
      <Nav />
      <main className="pt-32 pb-16 px-6 fade-in">
        <section className="mx-auto max-w-2xl text-center">
          <p className="eyebrow mb-6">{site.contact.eyebrow}</p>
          <h1 className="h-display text-4xl md:text-5xl text-bone mb-6">{site.contact.title}</h1>
          <p className="text-stone leading-relaxed font-light mb-12">{site.contact.body}</p>
        </section>

        <div className="mx-auto max-w-xl">
          <InquiryForm />
        </div>

        {(site.contact.email || site.contact.phone) && (
          <div className="mx-auto max-w-xl mt-14 text-center text-stone text-sm">
            {site.contact.email && (
              <div>
                <a href={`mailto:${site.contact.email}`} className="text-bone hover:underline">
                  {site.contact.email}
                </a>
              </div>
            )}
            {site.contact.phone && (
              <div className="mt-2">
                <a href={`tel:${site.contact.phone}`} className="text-bone hover:underline">
                  {site.contact.phone}
                </a>
              </div>
            )}
          </div>
        )}
      </main>
      <Footer />
    </>
  );
}
