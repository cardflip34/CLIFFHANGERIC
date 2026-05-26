import Nav from '@/components/Nav';
import Footer from '@/components/Footer';

export const metadata = { title: 'Location' };

export default function LocationPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[100svh] flex items-center justify-center px-6 fade-in">
        <h1 className="h-display text-4xl md:text-6xl text-bone tracking-tight text-center">
          CLIFFHANGER&nbsp;IC
        </h1>
      </main>
      <Footer />
    </>
  );
}
