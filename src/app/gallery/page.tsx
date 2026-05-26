import Nav from '@/components/Nav';
import Footer from '@/components/Footer';
import GalleryGrid from '@/components/GalleryGrid';
import { getGallery } from '@/lib/gallery';

export const metadata = { title: 'Gallery' };

export default function GalleryPage() {
  const images = getGallery();
  return (
    <>
      <Nav />
      <main className="pt-28 pb-16 px-3 md:px-6 fade-in">
        <header className="text-center mb-12 px-3">
          <h1 className="h-display text-3xl md:text-5xl text-bone tracking-tight">
            CLIFFHANGER&nbsp;IC
          </h1>
        </header>
        <GalleryGrid images={images} />
      </main>
      <Footer />
    </>
  );
}
