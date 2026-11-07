// Renders the 1200×630 social sharing image from the built site's fonts + assets.
// Run with the preview server up:  (cd .. && npm run dev)  then  node render-og.mjs
import { createRequire } from 'node:module';
import sharp from 'sharp';
const { chromium } = createRequire(import.meta.url)('playwright');

const base = process.env.BASE || 'http://localhost:4173';
const html = `<!doctype html><html><head><base href="${base}/"><link rel="stylesheet" href="/assets/css/main.css">
<style>
  body { margin:0; width:1200px; height:630px; overflow:hidden; background:#0a0a0b; }
  body::after { opacity:.05; }
  .og { position:relative; width:1200px; height:630px; padding:56px 64px; box-sizing:border-box; display:flex; flex-direction:column; }
  .og-top { display:flex; justify-content:space-between; align-items:center; }
  .og-glow { position:absolute; right:-160px; top:-200px; width:900px; height:900px; background: radial-gradient(closest-side, rgba(198,255,61,.08), transparent 70%); }
  .og-obj { position:absolute; right:56px; top:40px; width:400px; height:400px; filter: drop-shadow(0 40px 60px rgba(0,0,0,.6)); }
  .og-title { margin-top:56px; font-family: var(--font-display); font-weight:600; font-size:84px; line-height:.92; letter-spacing:-.05em; color:var(--text); max-width: 680px; position:relative; }
  .og-title em { font-family: var(--font-serif); font-style: italic; font-weight: 400; background: var(--chrome); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .og-mark { position:absolute; left:52px; right:52px; bottom:-34px; }
  .og-mark .wm { font-size: 262px; letter-spacing:-.065em; line-height:.8; background: var(--chrome); -webkit-background-clip:text; background-clip:text; -webkit-text-fill-color:transparent; }
  .og-mark .wm-l { background: inherit; -webkit-background-clip:text; background-clip:text; }
  .og-mark .wm-dot { width:.15em; height:.15em; align-self:flex-end; margin:0 0 .075em .035em; border-radius:50%; background: var(--accent); -webkit-background-clip:border-box; background-clip:border-box; -webkit-text-fill-color:transparent; overflow:hidden; }
  .og-rule { position:absolute; left:64px; right:64px; top:110px; height:1px; background: var(--line); }
</style></head><body>
<div class="og">
  <span class="og-glow"></span>
  <img class="og-obj" src="/assets/img/objects/monogram-800.webp" alt="">
  <div class="og-top"><span class="mono" style="color:var(--text-2)">Fuzail Khan — Senior UI Designer | Product &amp; Visual Designer</span></div>
  <span class="og-rule"></span>
  <h1 class="og-title">Designing <em>beyond</em> the interface.</h1>
  <div class="og-mark"><span class="wm"><span class="wm-l wm-f">F</span><span class="wm-l">U</span><span class="wm-l">Z</span><span class="wm-l">A</span><span class="wm-l">I</span><span class="wm-l">L</span><span class="wm-l wm-dot">.</span></span></div>
</div></body></html>`;

const b = await chromium.launch();
const p = await b.newPage({ viewport: { width: 1200, height: 630 } });
await p.setContent(html, { waitUntil: 'networkidle' });
await p.evaluate(() => document.fonts.ready);
const png = await p.screenshot({ type: 'png' });
await b.close();
const out = new URL('../src/assets/img/meta/og.jpg', import.meta.url).pathname;
await sharp(png).jpeg({ quality: 86, mozjpeg: true }).toFile(out);
console.log('wrote', out);
