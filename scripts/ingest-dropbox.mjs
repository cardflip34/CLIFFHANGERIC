#!/usr/bin/env node
/**
 * Dropbox ingest — two paths.
 *
 * Path A (API): Set DROPBOX_ACCESS_TOKEN and DROPBOX_FOLDER_PATH in .env.
 *   Listing + downloads happen automatically into ./public/gallery/originals/.
 *
 * Path B (manual): If DROPBOX_ACCESS_TOKEN is not set, this script just
 *   ensures ./public/gallery/originals/ exists and prints instructions.
 *
 * After running, run:   npm run process-images
 */
import fs from 'node:fs';
import path from 'node:path';
import 'dotenv/config';

const ROOT = process.cwd();
const ORIG_DIR = path.join(ROOT, 'public', 'gallery', 'originals');
fs.mkdirSync(ORIG_DIR, { recursive: true });

const token = process.env.DROPBOX_ACCESS_TOKEN;
const folder = process.env.DROPBOX_FOLDER_PATH || '';

if (!token) {
  console.log('────────────────────────────────────────────────────────────');
  console.log('Dropbox API not configured. Falling back to manual path.');
  console.log('1) From the shared Dropbox link, click Download → "Direct download" (ZIP).');
  console.log('2) Unzip and copy every image into:');
  console.log(`   ${ORIG_DIR}`);
  console.log('3) Then run:   npm run process-images');
  console.log('────────────────────────────────────────────────────────────');
  process.exit(0);
}

const IMG_EXT = new Set(['.jpg', '.jpeg', '.png', '.webp', '.heic', '.tif', '.tiff']);

async function dbx(endpoint, body, headers = {}) {
  const r = await fetch(`https://api.dropboxapi.com/2/${endpoint}`, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', ...headers },
    body: JSON.stringify(body),
  });
  if (!r.ok) throw new Error(`Dropbox ${endpoint} ${r.status}: ${await r.text()}`);
  return r.json();
}

async function listAll(folderPath) {
  let res = await dbx('files/list_folder', { path: folderPath, recursive: true });
  let entries = [...res.entries];
  while (res.has_more) {
    res = await dbx('files/list_folder/continue', { cursor: res.cursor });
    entries.push(...res.entries);
  }
  return entries.filter((e) => e['.tag'] === 'file' && IMG_EXT.has(path.extname(e.name).toLowerCase()));
}

async function download(filePath, dest) {
  const r = await fetch('https://content.dropboxapi.com/2/files/download', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${token}`,
      'Dropbox-API-Arg': JSON.stringify({ path: filePath }),
    },
  });
  if (!r.ok) throw new Error(`download ${filePath} ${r.status}: ${await r.text()}`);
  const buf = Buffer.from(await r.arrayBuffer());
  fs.writeFileSync(dest, buf);
}

function safeName(name) {
  return name.toLowerCase().replace(/[^a-z0-9.\-_]+/g, '-').replace(/-+/g, '-');
}

(async () => {
  console.log(`[ingest] listing ${folder} …`);
  const files = await listAll(folder);
  console.log(`[ingest] found ${files.length} image(s)`);
  let i = 0;
  for (const f of files) {
    i++;
    const out = path.join(ORIG_DIR, safeName(f.name));
    if (fs.existsSync(out) && fs.statSync(out).size === f.size) {
      console.log(`  · skip [${i}/${files.length}] ${f.name}`);
      continue;
    }
    console.log(`  ↓ get  [${i}/${files.length}] ${f.name}`);
    await download(f.path_lower, out);
  }
  console.log('[ingest] done. Next: npm run process-images');
})();
