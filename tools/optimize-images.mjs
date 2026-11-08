// Turns source artwork in assets/source into responsive WebP files for the site.
// Run: npm run images   (add new playground pieces to the list below + content/playground.mjs)
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const src = (f) => fileURLToPath(new URL(`../assets/source/${f}`, import.meta.url));
const out = (f) => fileURLToPath(new URL(`../src/assets/img/${f}`, import.meta.url));

const jobs = [
  // Add playground pieces here, e.g. ['my-study.png', 'playground/my-study', [1600, 800]],
  ['img-2.png', 'about/portrait', [1000, 560]],
];

await mkdir(out('playground'), { recursive: true });
await mkdir(out('about'), { recursive: true });
for (const [file, name, widths] of jobs) {
  for (const w of widths) {
    const info = await sharp(src(file)).rotate().resize({ width: w, withoutEnlargement: true })
      .webp({ quality: 78 }).toFile(out(`${name}-${w}.webp`));
    console.log(`${name}-${w}.webp`, `${info.width}x${info.height}`, `${Math.round(info.size / 1024)}KB`);
  }
}
