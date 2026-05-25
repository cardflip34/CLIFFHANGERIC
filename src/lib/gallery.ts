import data from '@/content/gallery.json';

export interface GalleryImage {
  id: string;
  src: string;          // public path to the full image
  thumb: string;        // public path to the thumb
  medium?: string;
  width: number;
  height: number;
  alt?: string;
  caption?: string;
  section?: string;
  order?: number;
}

export function getGallery(): GalleryImage[] {
  const imgs = (data.images as GalleryImage[]) ?? [];
  return [...imgs].sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
}

export function getHeroImage(): GalleryImage | null {
  const all = getGallery();
  return all[0] ?? null;
}
