#!/usr/bin/env node
/**
 * Generates derivatives (thumb 800w / medium 1600w / full 2560w) from
 * ./public/gallery/originals/  →  ./public/gallery/{thumb,medium,full}/
 *
 * Writes src/content/gallery.json (preserves human-edited captions / order
 * / section when ids match between runs).
 *
 * EXIF orientation is auto-applied; outputs are stripped of metadata.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import sharp from 'sharp';

const ROOT = process.cwd();
const ORIG_DIR = path.join(ROOT, 'public', 'gallery', 'originals');
const OUT_BASE = path.join(ROOT, 'public', 'gallery');
const VARIANTS = [
  { name: 'thumb',  width: 800 },
  { name: 'medium', width: 1600 },
  { name: 'full',   width: 2560 },
];
const MANIFEST = path.join(ROOT, 'src', 'content', 'gallery.json');

if (!fs.existsSync(ORIG_DIR)) {
  console.error(`No originals folder at ${ORIG_DIR}. Run "npm run ingest" first or drop images there.`);
  process.exit(1);
}

for (const v of VARIANTS) fs.mkdirSync(path.join(OUT_BASE, v.name), { recursive: true });

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff']);

const prev = (() => {
  try { return JSON.parse(fs.readFileSync(MANIFEST, 'utf8')); }
  catch { return { version: 1, images: [] }; }
})();
const prevById = new Map((prev.images || []).map((i) => [i.id, i]));

function idFor(file) {
  return crypto.createHash('sha1').update(file).digest('hex').slice(0, 12);
}

const files = fs.readdirSync(ORIG_DIR)
  .filter((f) => IMG_EXT.has(path.extname(f).toLowerCase()))
  .sort();

if (!files.length) {
  console.error(`No images in ${ORIG_DIR}. Add files and re-run.`);
  process.exit(1);
}

console.log(`[process] ${files.length} image(s)`);

const out = [];
let order = 0;
for (const file of files) {
  const id = idFor(file);
  const src = path.join(ORIG_DIR, file);
  const stem = path.parse(file).name;

  const base = sharp(src).rotate(); // honor EXIF orientation
  const meta = await base.metadata();
  const w = meta.width ?? 0;
  const h = meta.height ?? 0;
  if (!w || !h) { console.warn(`  ! skipping ${file} (no dimensions)`); continue; }

  for (const v of VARIANTS) {
    const outPath = path.join(OUT_BASE, v.name, `${stem}.jpg`);
    if (!fs.existsSync(outPath)) {
      await sharp(src)
        .rotate()
        .resize({ width: Math.min(v.width, w), withoutEnlargement: true })
        .jpeg({ quality: v.name === 'thumb' ? 78 : 84, mozjpeg: true })
        .withMetadata({}) // strip
        .toFile(outPath);
    }
  }

  const ratio = w / h;
  const thumbH = Math.round(800 / ratio);
  const fullW  = Math.min(2560, w);
  const fullH  = Math.round(fullW / ratio);

  const previous = prevById.get(id);
  order += 1;
  out.push({
    id,
    src:    `/gallery/full/${stem}.jpg`,
    medium: `/gallery/medium/${stem}.jpg`,
    thumb:  `/gallery/thumb/${stem}.jpg`,
    width:  fullW,
    height: fullH,
    thumbWidth: 800,
    thumbHeight: thumbH,
    alt:     previous?.alt     ?? `Cliffhanger IC — ${stem.replace(/[-_]+/g, ' ')}`,
    caption: previous?.caption ?? '',
    section: previous?.section ?? 'main',
    order:   previous?.order   ?? order,
  });
  console.log(`  ✓ ${file}`);
}

fs.writeFileSync(MANIFEST, JSON.stringify({ version: 1, images: out }, null, 2));
console.log(`[process] wrote ${out.length} entries to ${path.relative(ROOT, MANIFEST)}`);
