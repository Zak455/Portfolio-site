// Renders the chrome brand objects with Three.js in headless Chromium and writes
// optimised, transparent WebP files to src/assets/img/objects. Run: npm run render
import { createServer } from 'node:http';
import { readFile, mkdir } from 'node:fs/promises';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
const { chromium } = createRequire(import.meta.url)('playwright'); // pre-installed globally
import sharp from 'sharp';

const root = fileURLToPath(new URL('.', import.meta.url));
const outDir = fileURLToPath(new URL('../src/assets/img/objects/', import.meta.url));
const types = { '.html': 'text/html', '.js': 'text/javascript' };

const server = createServer(async (req, res) => {
  try {
    const body = await readFile(join(root, decodeURIComponent(req.url.split('?')[0])));
    res.writeHead(200, { 'content-type': types[extname(req.url)] || 'application/octet-stream' });
    res.end(body);
  } catch { res.writeHead(404); res.end(); }
}).listen(0);
const port = server.address().port;

const objects = [
  // { name: 'monogram', size: 1600, widths: [1400, 800] }, // F monogram (not used in the current design)
  { name: 'layers', size: 1200, widths: [1000, 600] },
  { name: 'globe', size: 1200, widths: [1000, 600] },
  { name: 'rings', size: 1200, widths: [1000, 600] },
  { name: 'device', size: 1200, widths: [1000, 600] },
  { name: 'cards', size: 1200, widths: [1000, 600] },
];

await mkdir(outDir, { recursive: true });
const browser = await chromium.launch({ args: ['--use-angle=swiftshader', '--enable-unsafe-swiftshader'] });
const page = await browser.newPage();
page.on('console', (m) => m.type() === 'error' && console.error(m.text()));
await page.goto(`http://localhost:${port}/render-page.html`);
await page.waitForFunction('window.ready === true');

for (const o of objects) {
  const dataUrl = await page.evaluate(([n, s]) => window.renderObject(n, s), [o.name, o.size]);
  const png = Buffer.from(dataUrl.split(',')[1], 'base64');
  for (const w of o.widths) {
    const file = join(outDir, `${o.name}-${w}.webp`);
    await sharp(png).trim({ threshold: 1 }).resize({ width: w, height: w, fit: 'inside' }).webp({ quality: 84, alphaQuality: 90 }).toFile(file);
    console.log('wrote', file);
  }
}
await browser.close();
server.close();
