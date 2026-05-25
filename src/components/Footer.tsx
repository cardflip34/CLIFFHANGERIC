import { site } from '@/content/site';

export default function Footer() {
  return (
    <footer className="border-t border-white/5 mt-32">
      <div className="mx-auto max-w-7xl px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-4">
        <p className="text-[11px] uppercase tracking-[0.28em] text-stone">CLIFFHANGER&nbsp;IC</p>
        <p className="text-[11px] text-stone text-center md:text-right max-w-xl">{site.footer.line}</p>
      </div>
    </footer>
  );
}
