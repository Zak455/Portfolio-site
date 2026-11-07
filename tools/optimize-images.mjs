// Turns source artwork in assets/source into responsive WebP files for the site.
// Run: npm run images   (add new playground pieces to the list below + content/playground.mjs)
import sharp from 'sharp';
import { mkdir } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const src = (f) => fileURLToPath(new URL(`../assets/source/${f}`, import.meta.url));
const out = (f) => fileURLToPath(new URL(`../src/assets/img/${f}`, import.meta.url));

const jobs = [
  ['BASILISK SNAKE HUNTER CONCEPT ART.jpg', 'playground/basilisk', [1400, 720]],
  ['CTHULHU EXTERMINATION CONCEPT ART.jpg', 'playground/cthulhu', [1600, 800]],
  ['DEAD RHINO CONCEPT ART.jpg', 'playground/dead-rhino', [1600, 800]],
  ['THALLASSOPHOBIA.jpg', 'playground/thalassophobia', [1600, 800]],
  ['THE WITCHER CONCEPT ART.jpg', 'playground/witcher', [1400, 720]],
  ['img-1.png', 'playground/moonrise', [1400, 720]],
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
