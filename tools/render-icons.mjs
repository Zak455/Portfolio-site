// Rasterises src/public/favicon.svg into PNG icons. Run: node render-icons.mjs
import sharp from 'sharp';
const svg = new URL('../src/public/favicon.svg', import.meta.url);
for (const [size, name] of [[32, 'favicon-32.png'], [180, 'apple-touch-icon.png'], [512, 'icon-512.png']]) {
  await sharp(svg.pathname, { density: 600 }).resize(size, size).png().toFile(new URL(`../src/public/${name}`, import.meta.url).pathname);
  console.log('wrote', name);
}
