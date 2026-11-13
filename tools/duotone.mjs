// Maps the portrait to a two-tone near-black → electric blue image (brand duotone).
// Run: node duotone.mjs
import sharp from 'sharp';
const src = new URL('../assets/source/portrait.webp', import.meta.url).pathname;
const out = (w) => new URL(`../src/assets/img/about/portrait-2026-${w}.webp`, import.meta.url).pathname;
const dark = [10, 10, 11], light = [79, 140, 255];
const { data, info } = await sharp(src).rotate().extract({ left: 53, top: 0, width: 853, height: 1280 }).resize({ width: 1000 }).grayscale().normalise()
  .linear(1.25, -28).raw().toBuffer({ resolveWithObject: true });
const rgb = Buffer.alloc(info.width * info.height * 3);
for (let i = 0; i < info.width * info.height; i++) {
  const t = Math.pow(data[i * info.channels] / 255, 1.15);
  for (let c = 0; c < 3; c++) rgb[i * 3 + c] = Math.round(dark[c] + (light[c] - dark[c]) * t);
}
for (const w of [1000, 560]) {
  const r = await sharp(rgb, { raw: { width: info.width, height: info.height, channels: 3 } })
    .resize({ width: w }).webp({ quality: 82 }).toFile(out(w));
  console.log(out(w), r.width + 'x' + r.height, Math.round(r.size / 1024) + 'KB');
}
