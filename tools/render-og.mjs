// Renders the 1200×630 social sharing image in the site's visual system.
// Run with the preview server up:  (cd .. && npm run dev)  then  node render-og.mjs
import { createRequire } from 'node:module';
import sharp from 'sharp';
import { pixelBand, pixelGlyph } from '../src/templates/components.mjs';
import { site } from '../content/site.mjs';
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.env.BASE || 'http://localhost:4173';
const html = `<!doctype html><html><head><base href="${base}/"><link rel="stylesheet" href="/assets/css/main.css">
<style>
  body { margin:0; width:1200px; height:630px; overflow:hidden; background:#0a0a0b; }
  body::after { display:none; }
  .og { position:relative; width:1200px; height:630px; display:grid; grid-template-columns: 1fr 360px; }
  .l { padding:44px 0 0 48px; display:flex; flex-direction:column; gap:14px; }
  .t { margin-top:auto; font-family:var(--font-display); font-weight:800; font-stretch:125%; font-size:136px; line-height:.84; letter-spacing:-.04em; color:var(--text); }
  .s { font-family:var(--font-display); font-weight:700; font-stretch:112%; font-size:32px; line-height:1.1; color:var(--text); margin-bottom:84px; }
  .s em { color: var(--accent); }
  .r { position:relative; background:var(--accent); overflow:hidden; }
  .r img { width:100%; height:100%; object-fit:cover; object-position:50% 18%; }
  .dots { position:absolute; inset:0; background: radial-gradient(rgba(10,10,11,.32) .9px, transparent 1.3px) 0 0/4px 4px; mix-blend-mode:multiply; }
  .b { position:absolute; left:0; right:0; bottom:0; }
  .logo { display:flex; align-items:center; gap:12px; color:var(--text); }
  .logo span:first-child { width:40px; height:40px; display:grid; place-items:center; background:var(--accent); color:var(--accent-ink); }
</style></head><body>
<div class="og">
  <div class="l">
    <div class="logo"><span>${pixelGlyph('f', { cell: 4 })}</span><span class="mono">${site.place.short} · ${site.place.coords}</span></div>
    <p><span class="badge badge--solid mono">${site.title} @ Spintly</span></p>
    <p class="t">FUZAIL.</p>
    <p class="s">Designing <em>beyond</em> the interface.</p>
  </div>
  <div class="r"><img src="/assets/img/about/portrait-2026-1000.webp" alt=""><span class="dots"></span></div>
  <div class="b">${pixelBand()}</div>
</div></body></html>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.goto(base + '/robots.txt'); // same origin, so web fonts are allowed to load
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(async () => { await document.fonts.load('800 136px Archivo'); await document.fonts.load('400 12px "JetBrains Mono"'); await document.fonts.ready; });
await p.waitForTimeout(300);
const png = await p.screenshot({ type: 'png' });
await b.close();
const out = new URL('../src/assets/img/meta/og.jpg', import.meta.url).pathname;
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
console.log('wrote', out);
