// Captures fresh screenshots of the playable games for their case studies.
// Drives headless Edge over the DevTools protocol (no extra dependencies):
// opens each scene at 1440×900 @2x, runs a few steps (waits, keys, clicks,
// small scripts) and saves a 1440px WebP into src/assets/img/work/.
//
// Run from the repo root with `npm run dev` going on :4173:
//   node tools/capture-games.mjs            (every shot)
//   node tools/capture-games.mjs hearthwild (one game)
import { spawn } from 'node:child_process';
import { mkdtempSync, mkdirSync, rmSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';

const here = path.dirname(fileURLToPath(import.meta.url));
const sharp = createRequire(import.meta.url)('sharp');
const OUT = process.env.OUT_DIR || path.join(here, '..', 'src', 'assets', 'img', 'work');
const BASE = process.env.BASE || 'http://localhost:4173';
const EDGE = process.env.EDGE || 'C:/Program Files (x86)/Microsoft/Edge/Application/msedge.exe';
const W = 1440, H = 900, PORT = 9333;

// Steps: { wait: ms } · { key: 'KeyL' } · { click: [x, y] } (CSS px) · { eval: 'js' } · { clickText: 'Start' }
// `card: true` also writes the 16:10 project card (<slug>-800/-1440.webp).
const HM_OPEN = [{ clickText: 'Open the file', after: 3000 }, { click: [1384, 774], after: 3500 }];
export const SHOTS = {
  hollowmere: [
    // Shared opening: title → Case 01 → skip the narrated intro → field report.
    { name: 'field-report', url: '/play/hollowmere/', load: 4500, card: true, steps: HM_OPEN },
    { name: 'crime-scene', url: '/play/hollowmere/', load: 4500, steps: [...HM_OPEN, { clickText: 'Enter the scene', after: 3500 }] },
    { name: 'seance-room', url: '/play/hollowmere/', load: 4500, steps: [...HM_OPEN, { clickText: 'Enter the scene', after: 3000 }, { clickText: 'Séance Room', after: 2500 }, { clickText: 'What happened at the séance?', after: 4000 }] },
    { name: 'lab', url: '/play/hollowmere/', load: 4500, steps: [...HM_OPEN, { clickText: 'Enter the scene', after: 3000 }, { click: [689, 371], after: 1500 }, { clickText: 'Add to Evidence Locker', after: 1000 }, { clickText: 'Paranormal Lab', after: 1500 }, { clickText: 'Run uv blacklight sweep', after: 4500 }] },
  ],
  hearthwild: [
    { name: 'title', url: '/play/hearthwild/', load: 5000, card: true },
    { name: 'forage', url: '/play/hearthwild/?scene=forage&r=0', load: 6000 },
    { name: 'fish', url: '/play/hearthwild/?scene=forage&r=1', load: 6000 },
    { name: 'prep', url: '/play/hearthwild/?scene=prep&r=2', load: 5000 },
    { name: 'cook', url: '/play/hearthwild/?scene=cook&r=0', load: 5000 },
    { name: 'plate', url: '/play/hearthwild/?scene=plate&r=3', load: 7000 },
  ],
  aetherbound: [
    { name: 'title', url: '/play/aetherbound/', load: 7000, card: true },
    { name: 'alpha', url: '/play/aetherbound/?scene=play&lvl=9&done=6&sk=4&x=75&y=47', load: 7000 },
    { name: 'boot', url: '/play/aetherbound/?scene=intro', load: 4000, steps: [{ eval: 'AB.Intro.skip()', after: 7000 }] },
    { name: 'village', url: '/play/aetherbound/?scene=play&lvl=2&done=1&x=24&y=18', load: 7000 },
    { name: 'forest', url: '/play/aetherbound/?scene=play&lvl=5&done=2&sk=2&x=42&y=24', load: 7000, steps: [{ eval: 'AB.Game.setPaused(false)', after: 1500 }] },
    { name: 'ledger', url: '/play/aetherbound/?scene=play&lvl=6&done=3&sk=3&x=24&y=18', load: 6000, steps: [{ key: 'KeyL', after: 1500 }] },
    { name: 'offer', url: '/play/aetherbound/?scene=play&lvl=5&done=3&sk=3&x=24&y=18', load: 5000, steps: [{ eval: "AB.Ledger.queueOffer('Level 5 offer')", after: 2500 }] },
  ],
};

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function cdp() {
  const dir = mkdtempSync(path.join(tmpdir(), 'cap-'));
  const proc = spawn(EDGE, [
    '--headless=new', `--remote-debugging-port=${PORT}`, `--user-data-dir=${dir}`,
    `--window-size=${W},${H}`, '--force-device-scale-factor=2', '--hide-scrollbars',
    '--autoplay-policy=no-user-gesture-required', '--mute-audio',
    '--enable-unsafe-swiftshader', '--ignore-gpu-blocklist', '--enable-webgl', 'about:blank',
  ], { stdio: 'ignore' });
  let ver;
  for (let i = 0; i < 50 && !ver; i++) { try { ver = await (await fetch(`http://127.0.0.1:${PORT}/json/version`)).json(); } catch { await sleep(200); } }
  if (!ver) throw new Error('Edge did not start');
  const ws = new WebSocket(ver.webSocketDebuggerUrl);
  await new Promise((r) => ws.addEventListener('open', r, { once: true }));
  let id = 0; const pending = new Map();
  ws.addEventListener('message', (e) => {
    const m = JSON.parse(e.data);
    if (m.id && pending.has(m.id)) { const { res, rej } = pending.get(m.id); pending.delete(m.id); m.error ? rej(new Error(m.error.message)) : res(m.result); }
  });
  const send = (method, params = {}, sessionId) => new Promise((res, rej) => { const i = ++id; pending.set(i, { res, rej }); ws.send(JSON.stringify({ id: i, method, params, sessionId })); });
  const { targetId } = await send('Target.createTarget', { url: 'about:blank' });
  const { sessionId } = await send('Target.attachToTarget', { targetId, flatten: true });
  const s = (m, p) => send(m, p, sessionId);
  await s('Page.enable'); await s('Runtime.enable');
  await s('Emulation.setDeviceMetricsOverride', { width: W, height: H, deviceScaleFactor: 2, mobile: false });
  const close = () => { try { ws.close(); } catch {} proc.kill(); setTimeout(() => { try { rmSync(dir, { recursive: true, force: true }); } catch {} }, 1500); };
  return { s, close };
}

const KEYS = { Escape: 27, Enter: 13, Space: 32, Tab: 9, ArrowUp: 38, ArrowDown: 40, ArrowLeft: 37, ArrowRight: 39 };
async function key(s, code, holdMs = 60) {
  const ch = /^Key([A-Z])$/.exec(code)?.[1];
  const keyName = ch ? ch.toLowerCase() : code === 'Space' ? ' ' : code;
  const vk = ch ? ch.charCodeAt(0) : KEYS[code] || 0;
  await s('Input.dispatchKeyEvent', { type: 'keyDown', code, key: keyName, windowsVirtualKeyCode: vk, text: ch ? keyName : undefined });
  await sleep(holdMs);
  await s('Input.dispatchKeyEvent', { type: 'keyUp', code, key: keyName, windowsVirtualKeyCode: vk });
}
async function click(s, x, y) {
  for (const type of ['mouseMoved', 'mousePressed', 'mouseReleased']) await s('Input.dispatchMouseEvent', { type, x, y, button: 'left', clickCount: 1 });
}
const evaluate = async (s, expression) => (await s('Runtime.evaluate', { expression, awaitPromise: true, returnByValue: true })).result?.value;

async function shoot(c, slug, shot) {
  const { s } = c;
  await s('Page.navigate', { url: BASE + shot.url });
  await sleep(shot.load ?? 2500);
  for (const st of shot.steps || []) {
    if (st.wait) await sleep(st.wait);
    if (st.key) await key(s, st.key, st.hold);
    if (st.click) await click(s, st.click[0], st.click[1]);
    if (st.eval) await evaluate(s, st.eval);
    if (st.clickText) {
      // Accent- and case-insensitive "starts with"; the smallest visible match wins.
      const pos = await evaluate(s, `(() => {
        const norm = (x) => x.normalize('NFD').replace(/[\\u0300-\\u036f]/g, '').replace(/\\s+/g, ' ').trim().toLowerCase();
        const t = norm(${JSON.stringify(st.clickText)});
        const hits = [...document.querySelectorAll('button, a, [role=button], [role=tab], li, div, span')]
          .filter((e) => { const r = e.getBoundingClientRect(); return r.width && r.height && norm(e.textContent).startsWith(t); })
          .sort((a, b) => a.getBoundingClientRect().width * a.getBoundingClientRect().height - b.getBoundingClientRect().width * b.getBoundingClientRect().height);
        const el = hits.find((e) => e.closest('button, a, [role=button], [role=tab]')) || hits[0];
        if (!el) return null; const r = el.getBoundingClientRect(); return [r.x + r.width / 2, r.y + r.height / 2]; })()`);
      if (!pos) throw new Error(`${slug}/${shot.name}: no element starting with "${st.clickText}"`);
      await click(s, pos[0], pos[1]);
    }
    if (st.after) await sleep(st.after);
  }
  const { data } = await s('Page.captureScreenshot', { format: 'png', captureBeyondViewport: false });
  const png = Buffer.from(data, 'base64');
  const dir = path.join(OUT, slug); mkdirSync(dir, { recursive: true });
  const file = path.join(dir, `${shot.name}.webp`);
  const info = await sharp(png).resize({ width: 1440 }).webp({ quality: 82 }).toFile(file);
  console.log(`${slug}/${shot.name}.webp ${info.width}x${info.height} ${Math.round(info.size / 1024)}KB`);
  if (shot.card) {
    for (const w of [1440, 800]) await sharp(png).resize({ width: w, height: Math.round(w / 1.6), fit: 'cover', position: 'top' }).webp({ quality: 82 }).toFile(path.join(OUT, `${slug}-${w}.webp`));
    console.log(`${slug}-1440/800.webp (card)`);
  }
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const only = process.argv.slice(2);
  const c = await cdp();
  try {
    for (const [slug, shots] of Object.entries(SHOTS)) {
      if (only.length && !only.includes(slug) && !only.some((o) => o.startsWith(slug + '/'))) continue;
      for (const shot of shots) {
        if (only.some((o) => o.includes('/')) && !only.includes(`${slug}/${shot.name}`)) continue;
        await shoot(c, slug, shot);
      }
    }
  } finally { c.close(); }
}
