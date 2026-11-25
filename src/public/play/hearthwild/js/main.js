// Hearthwild — UI, title, journal, plating, finale, and the game flow.
'use strict';

const $ = (s) => document.querySelector(s);

// ── DOM UI helpers ──────────────────────────────────────────────────────────
const UI = {
  stage(n, label) {
    const el = $('#stages');
    if (!n) { el.classList.remove('on'); return; }
    el.classList.add('on');
    el.querySelectorAll('li').forEach((li, i) => { li.classList.toggle('active', i + 1 === n); li.classList.toggle('past', i + 1 < n); });
  },
  top(title, sub) { $('#top').classList.toggle('on', !!title); $('#ttl').textContent = title || ''; $('#sub').textContent = sub || ''; },
  basket(list) {
    const el = $('#basket');
    el.innerHTML = '';
    el.classList.toggle('on', list.length > 0);
    for (const it of list) {
      const d = document.createElement('div');
      d.className = 'bk' + (it.have >= it.need ? ' full' : '');
      d.dataset.id = it.id;
      d.innerHTML = `<img alt="" src="${iconURL(it.icon)}"><span>${Math.min(it.have, it.need)}/${it.need}</span>`;
      d.title = NAMES[it.id];
      el.appendChild(d);
    }
  },
  basketPos(id) {
    const d = document.querySelector(`#basket [data-id="${id}"]`) || $('#basket');
    const r = d.getBoundingClientRect();
    if (!r.width) return [G.W / 2, 40];
    return [r.left + r.width / 2, r.top + r.height / 2];
  },
  bump(id) { const d = document.querySelector(`#basket [data-id="${id}"]`); if (d) { d.classList.remove('bump'); void d.offsetWidth; d.classList.add('bump'); } },
  hint(t) { const el = $('#hint'); el.textContent = t; el.classList.toggle('on', !!t); },
  caption(t) {
    const el = $('#caption');
    if (!t) { el.classList.remove('on'); return; }
    el.classList.remove('on'); void el.offsetWidth;
    el.textContent = t; el.classList.add('on');
  },
  toast(t) {
    const el = document.createElement('div'); el.className = 'toast'; el.textContent = t;
    $('#toasts').appendChild(el);
    setTimeout(() => el.classList.add('out'), 2600);
    setTimeout(() => el.remove(), 3300);
  },
  action(label, cb) {
    const b = $('#action'); b.textContent = label; b.classList.add('on');
    b.onclick = () => { Audio2.sfxUI(); b.classList.remove('on'); b.onclick = null; cb(); };
  },
  clearAction() { const b = $('#action'); b.classList.remove('on'); b.onclick = null; },
  overlay(html) { $('#overlay').innerHTML = html; },
  ring(c, x, y, r, p) {
    c.save();
    c.lineCap = 'round';
    c.lineWidth = 4; c.strokeStyle = 'rgba(30,15,5,.35)'; c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
    c.strokeStyle = '#ffe3a6'; c.shadowColor = '#ffcf70'; c.shadowBlur = 8;
    c.beginPath(); c.arc(x, y, r, -Math.PI / 2, -Math.PI / 2 + TAU * clamp(p)); c.stroke();
    c.restore();
  },
  bellows(show, cb) {
    const b = $('#bellows');
    b.classList.toggle('on', show);
    if (!show) { b.onpointerdown = b.onpointerup = b.onpointerleave = b.onpointercancel = null; return; }
    const on = (e) => { e.preventDefault(); Audio2.unlock(); b.classList.add('press'); cb(true); };
    const off = () => { b.classList.remove('press'); cb(false); };
    b.onpointerdown = on; b.onpointerup = off; b.onpointerleave = off; b.onpointercancel = off;
    b.oncontextmenu = (e) => e.preventDefault();
  },
  meter(o) {
    const el = $('#meter');
    if (!o) { el.classList.remove('on'); return; }
    el.classList.add('on');
    if (o.finish) {
      el.className = 'on finish';
      el.innerHTML = `<div class="lbl"><span>Raw</span><span>Golden</span><span>Charred</span></div><div class="bar"><i class="gold"></i><b style="left:${(o.v * 100).toFixed(1)}%"></b></div>`;
    } else {
      el.className = 'on hold';
      el.innerHTML = `<div class="lbl"><span>${this.heatWord(o)}</span></div><div class="bar"><em style="width:${(o.p * 100).toFixed(1)}%"></em></div>`;
    }
  },
  heatWord(o) { return o.v < o.lo ? 'Too cool. Hold the bellows.' : o.v > o.hi ? 'Too hot. Let it settle.' : 'Just right. Hold it there.'; },
  hideAll() { this.stage(0); this.top(''); this.basket([]); this.hint(''); this.caption(''); this.clearAction(); this.overlay(''); this.bellows(false); this.meter(null); },
};

const iconCache = {};
function iconURL(name) {
  if (iconCache[name]) return iconCache[name];
  const cv = makeCanvas(64, 64, 2), c = cv.getContext('2d');
  c.translate(32, 34);
  const s = { venison: 18, rabbitDressed: 20, pheasantPlucked: 20, trout: 22, carrot: 18, thyme: 22, rosemary: 22, juniper: 20 }[name] || 20;
  (ING[name] || ING.butter)(c, s, {});
  return (iconCache[name] = cv.toDataURL());
}

// ── Cottage (title screen) ──────────────────────────────────────────────────
function drawCottage(c, x, y, s, P) {
  c.save(); c.translate(x, y);
  // chimney
  c.fillStyle = '#6e6258'; c.fillRect(s * 0.28, -s * 1.05, s * 0.16, s * 0.5);
  // walls
  const wg = c.createLinearGradient(-s * 0.7, 0, s * 0.7, 0); wg.addColorStop(0, mix('#c9b8a0', P.tree, 0.3)); wg.addColorStop(1, mix('#e8d8c0', P.rim, 0.2));
  c.fillStyle = wg; c.fillRect(-s * 0.62, -s * 0.5, s * 1.24, s * 0.5);
  // stones
  const R = rng(3); c.fillStyle = 'rgba(80,60,40,.18)'; for (let i = 0; i < 30; i++) { c.beginPath(); c.ellipse(R.r(-0.6, 0.6) * s, -R.r(0.05, 0.45) * s, s * 0.05, s * 0.025, 0, 0, TAU); c.fill(); }
  // thatched roof
  const rg = c.createLinearGradient(0, -s * 1.0, 0, -s * 0.45); rg.addColorStop(0, mix('#c8a060', P.rim, 0.3)); rg.addColorStop(1, '#7a5a30');
  c.fillStyle = rg; c.beginPath(); c.moveTo(-s * 0.8, -s * 0.42); c.quadraticCurveTo(-s * 0.4, -s * 1.02, 0, -s * 1.02); c.quadraticCurveTo(s * 0.4, -s * 1.02, s * 0.8, -s * 0.42); c.quadraticCurveTo(0, -s * 0.36, -s * 0.8, -s * 0.42); c.fill();
  c.strokeStyle = 'rgba(90,60,25,.35)'; c.lineWidth = 1; for (let i = 0; i < 16; i++) { const t = i / 15; c.beginPath(); c.moveTo(-s * 0.7 + t * s * 1.4, -s * 0.44); c.lineTo(-s * 0.3 + t * s * 0.6, -s * 0.95); c.stroke(); }
  // windows glowing
  const glow = 0.85 + 0.15 * Math.sin(G.t * 6) * Math.sin(G.t * 2.3);
  for (const wx of [-s * 0.38, s * 0.3]) {
    c.fillStyle = `rgba(255,${190 + 20 * glow | 0},110,${glow})`; c.fillRect(wx - s * 0.08, -s * 0.36, s * 0.16, s * 0.14);
    c.fillStyle = '#4a3020'; c.fillRect(wx - 1, -s * 0.36, 2, s * 0.14); c.fillRect(wx - s * 0.08, -s * 0.29 - 1, s * 0.16, 2);
    c.save(); c.globalCompositeOperation = 'lighter'; softCircle(c, wx, -s * 0.29, s * 0.4, '#ffb060', 0.25 * glow); c.restore();
  }
  // door
  c.fillStyle = '#5a3a22'; c.beginPath(); c.moveTo(-s * 0.08, 0); c.lineTo(-s * 0.08, -s * 0.24); c.quadraticCurveTo(0, -s * 0.32, s * 0.08, -s * 0.24); c.lineTo(s * 0.08, 0); c.fill();
  c.restore();
}

class TitleScene {
  constructor() { this.fx = new Particles(); this.smoke = new Particles(); this.t = 0; }
  enter() {
    UI.hideAll();
    Audio2.ambience('meadow');
    $('#title').classList.add('on');
    this.camX = this.cam();
    this.d3 = !!(window.Forage3D && Forage3D.title(this));
  }
  exit() { if (this.d3) Forage3D.stop(); $('#title').classList.remove('on'); }
  resize() {
    const W = G.W, H = G.H;
    this.P = SKY.golden;
    this.gy = H * (W < H ? 0.56 : 0.6);
    this.worldW = W * 1.25;
    const cfg = { groundY: this.gy, trees: 'mixed', seed: 909, clearings: 0.5, flowers: ['#ffd36a', '#ffffff', '#ff9f6a'] };
    this.layers = paintLandscape(cfg, this.P, W, H, this.worldW);
    this.tufts = makeTufts(rng(5), this.worldW, this.gy, H, Math.round(this.worldW / 6));
    this.cs = Math.min(W, H) * (W < H ? 0.32 : 0.2);
  }
  update(dt) {
    this.t += dt;
    this.fx.update(dt); this.smoke.update(dt);
    const cam = this.cam(); this.camX = cam;
    let cx = G.W * 0.72 - cam * 0.55 + this.cs * 0.36, cy = this.gy + 6 - this.cs * 1.05;
    if (this.d3 && this.chim) [cx, cy] = this.chim;
    if (Math.random() < dt * 8) this.smoke.add({ kind: 'glow', x: cx, y: cy, vx: rand(4, 14), vy: rand(-26, -14), life: rand(5, 8), size: rand(10, 18), color: '#e8d8d0', a: 0.18, fadeIn: true, drag: 0.995, flutter: 0.4, seed: rand(0, 9) });
    for (const s of this.smoke.p) s.size += dt * 6;
    if (Math.random() < dt * 4) this.fx.add({ kind: 'glow', x: rand(0, G.W), y: rand(this.gy - 40, G.H), vx: rand(-10, 10), vy: rand(-12, 4), life: rand(3, 6), size: rand(5, 10), color: '#fff0a0', add: true, fadeIn: true, flutter: 2, seed: rand(0, 9), a: 0.8 });
  }
  cam() { return (Math.sin(this.t * 0.05) * 0.5 + 0.5) * (this.worldW - G.W); }
  draw(c) {
    const W = G.W, H = G.H, cam = this.cam();
    if (this.d3) {
      c.clearRect(0, 0, W, H); this.smoke.draw(c); this.fx.draw(c);
      const vg = c.createLinearGradient(0, 0, 0, H); vg.addColorStop(0, 'rgba(20,10,30,.35)'); vg.addColorStop(0.4, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,5,.55)');
      c.fillStyle = vg; c.fillRect(0, 0, W, H); return;
    }
    for (const L of this.layers) {
      c.drawImage(L.cv, -cam * L.par, 0, L.w, H);
      if (L.par === 0.55) drawCottage(c, W * 0.72 - cam * 0.55, this.gy + 6, this.cs, this.P);
    }
    this.smoke.draw(c);
    c.save(); c.translate(-cam, 0);
    for (const t of this.tufts) if (t.x > cam - 30 && t.x < cam + W + 30) drawTuft(c, t, this.P, 2.5);
    c.restore();
    this.fx.draw(c);
    const vg = c.createLinearGradient(0, 0, 0, H); vg.addColorStop(0, 'rgba(20,10,30,.35)'); vg.addColorStop(0.4, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,10,5,.55)');
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
  }
}

// ── Journal ─────────────────────────────────────────────────────────────────
function unlocked(i) { return i === 0 || !!Save.data.done[RECIPES[i - 1].id]; }

class JournalScene {
  constructor(sel) { this.sel = sel ?? this.firstOpen(); this.motes = new Particles(); }
  firstOpen() { const i = RECIPES.findIndex((r) => !Save.data.done[r.id]); return i < 0 ? 0 : i; }
  enter() {
    UI.hideAll();
    Audio2.ambience('kitchenQuiet');
    $('#journal').classList.add('on');
    this.render();
  }
  exit() { $('#journal').classList.remove('on'); }
  resize() { this.bg = paintTable(); }
  render() {
    const list = $('#jlist');
    list.innerHTML = '';
    RECIPES.forEach((r, i) => {
      const open = unlocked(i), done = Save.data.done[r.id];
      const li = document.createElement('button');
      li.className = 'jitem' + (i === this.sel ? ' sel' : '') + (open ? '' : ' locked');
      li.innerHTML = `<img alt="" src="${dishThumb(r, !open)}"><div><small>${SKY[r.time].name}</small><b>${open ? r.name : 'Later in the day'}</b><span class="stars">${done ? '★'.repeat(done) + '<i>' + '★'.repeat(3 - done) + '</i>' : open ? 'Not yet cooked' : ''}</span></div>`;
      li.onclick = () => { if (!open) { UI.toast('Cook the earlier dishes first. The day goes in order.'); return; } Audio2.sfxPage(); this.sel = i; this.render(); if (G.W < 760) $('#jdetail').scrollIntoView({ behavior: 'smooth', block: 'start' }); };
      list.appendChild(li);
    });
    const allDone = RECIPES.every((r) => Save.data.done[r.id]);
    if (allDone) {
      const f = document.createElement('button');
      f.className = 'jitem feast';
      f.innerHTML = `<div><small>Night</small><b>Supper under the stars</b><span class="stars">The whole day on one table</span></div>`;
      f.onclick = () => { Audio2.sfxUI(); go(new FeastScene()); };
      list.appendChild(f);
    }
    const r = RECIPES[this.sel];
    const fl = r.forage.map((f) => `<li><img alt="" src="${iconURL(BASKET_ICON[f.id] || f.id)}">${NAMES[f.id]}${f.n > 1 ? ' × ' + f.n : ''}${f.hunt ? ' <em>hunt</em>' : f.fish ? ' <em>fish</em>' : ''}</li>`).join('');
    $('#jdetail').innerHTML = `
      <p class="eyebrow">${SKY[r.time].name} · ${r.place}</p>
      <h2>${r.name}</h2>
      <p class="blurb">${r.blurb}</p>
      <div class="cols">
        <div><h3>Forage</h3><ul class="forage">${fl}</ul></div>
        <div><h3>Prepare</h3><ol>${r.prep.map((p) => `<li>${p.title}</li>`).join('')}</ol></div>
        <div><h3>Cook</h3><ol>${r.cook.filter((s) => s.type !== 'add').map((s) => `<li>${s.title}</li>`).join('')}</ol></div>
      </div>
      <button class="btn primary" id="go">${Save.data.done[r.id] ? 'Cook it again' : 'Head out foraging'}</button>`;
    $('#go').onclick = () => { Audio2.sfxUI(); game.start(r); };
  }
  update(dt) { this.motes.update(dt); if (Math.random() < dt * 3) this.motes.add({ kind: 'glow', x: rand(0, G.W), y: rand(0, G.H), vx: rand(2, 10), vy: rand(-8, 2), life: rand(4, 8), size: rand(1.5, 3), color: '#fff0d0', add: true, fadeIn: true, a: 0.6 }); }
  draw(c) { c.drawImage(this.bg, 0, 0, G.W, G.H); drawCandle(c, G.W * 0.92, G.H * 0.2, Math.min(G.W, G.H) * 0.08); this.motes.draw(c); }
}

function paintTable() {
  const W = G.W, H = G.H, cv = makeCanvas(W, H, Math.min(G.dpr, 1.5)), c = cv.getContext('2d'), R = rng(12);
  const g = c.createRadialGradient(W * 0.5, H * 0.4, 0, W * 0.5, H * 0.5, Math.max(W, H));
  g.addColorStop(0, '#7a5034'); g.addColorStop(1, '#2a160c');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  for (let i = 0; i < 70; i++) { c.strokeStyle = `rgba(${R() < 0.5 ? '30,15,5' : '200,150,100'},${R.r(0.04, 0.1)})`; c.lineWidth = R.r(0.5, 2); const y = R.r(0, H), ph = R.r(0, 6); c.beginPath(); for (let x = 0; x <= W; x += 20) c.lineTo(x, y + Math.sin(x * 0.008 + ph) * 6); c.stroke(); }
  c.save(); c.globalCompositeOperation = 'lighter'; softCircle(c, W * 0.92, H * 0.2, Math.max(W, H) * 0.7, '#ff9a40', 0.12); c.restore();
  return cv;
}
function drawCandle(c, x, y, s) {
  c.fillStyle = '#f0e6d2'; c.fillRect(x - s * 0.15, y, s * 0.3, s * 1.4);
  c.fillStyle = 'rgba(0,0,0,.15)'; c.fillRect(x + s * 0.05, y, s * 0.1, s * 1.4);
  c.save(); c.globalCompositeOperation = 'lighter';
  softCircle(c, x, y - s * 0.2, s * 3, '#ffaa50', 0.22 + 0.04 * Math.sin(G.t * 8));
  c.fillStyle = '#fff1b0'; c.beginPath(); c.ellipse(x + Math.sin(G.t * 6) * 1.2, y - s * 0.22, s * 0.08, s * 0.22, 0, 0, TAU); c.fill();
  c.restore();
}

// ── Plating ─────────────────────────────────────────────────────────────────
function drawDish(c, r, x, y, R, opt = {}) {
  const pl = r.plate, brown = opt.brown ?? 0.7, show = opt.show ?? 99;
  c.save(); c.translate(x, y);
  if (pl.board) {
    c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(R * 0.06, R * 0.08, R * 1.05, R * 0.82, 0, 0, TAU); c.fill();
    const g = c.createLinearGradient(-R, 0, R, 0); g.addColorStop(0, '#a8743e'); g.addColorStop(1, '#d6a468');
    c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, R, R * 0.78, 0, 0, TAU); c.fill();
    c.strokeStyle = 'rgba(90,50,20,.3)'; for (let i = 0; i < 8; i++) { c.beginPath(); c.ellipse(0, 0, R * (0.2 + i * 0.1), R * 0.78 * (0.2 + i * 0.1), 0, 0, TAU); c.stroke(); }
  } else {
    c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.arc(R * 0.05, R * 0.08, R * 1.02, 0, TAU); c.fill();
    const g = c.createRadialGradient(-R * 0.3, -R * 0.3, 0, 0, 0, R);
    g.addColorStop(0, '#fbf7ef'); g.addColorStop(0.8, '#ebe2d2'); g.addColorStop(1, '#cfc2ac');
    c.fillStyle = g; c.beginPath(); c.arc(0, 0, R, 0, TAU); c.fill();
    c.strokeStyle = '#7a8fa6'; c.lineWidth = Math.max(1, R * 0.015); c.beginPath(); c.arc(0, 0, R * 0.93, 0, TAU); c.stroke();
    if (pl.bowl) {
      const bg = c.createRadialGradient(R * 0.15, R * 0.2, 0, 0, 0, R * 0.75); bg.addColorStop(0, '#d8cfc0'); bg.addColorStop(1, '#9a8e7c');
      c.fillStyle = bg; c.beginPath(); c.arc(0, 0, R * 0.74, 0, TAU); c.fill();
      const sg = c.createRadialGradient(-R * 0.15, -R * 0.15, 0, 0, 0, R * 0.62); sg.addColorStop(0, mix('#b8803e', '#7a4418', brown)); sg.addColorStop(1, mix('#7a4a1e', '#4a2410', brown));
      c.fillStyle = sg; c.beginPath(); c.arc(0, 0, R * 0.62, 0, TAU); c.fill();
    } else {
      c.fillStyle = 'rgba(255,255,255,.5)'; c.beginPath(); c.ellipse(-R * 0.4, -R * 0.55, R * 0.25, R * 0.06, -0.6, 0, TAU); c.fill();
    }
  }
  pl.layout.slice(0, show).forEach(([ing, u, v, s, rot, o], i) => {
    const op = Object.assign({}, o || {});
    if (!op.raw) op.cook = Math.round(brown * 0.85 * 10) / 10; delete op.raw;
    if (ing === 'butter') return;
    const drop = opt.drops ? opt.drops[i] ?? 1 : 1;
    drawSprite(c, ing, u * R * 2, v * R * 2 - (1 - drop) * R * 0.6, s * R * 2 * 0.6, op, rot, clamp(drop * 2), 1 + (1 - drop) * 0.2);
  });
  c.restore();
}
const thumbCache = {};
function dishThumb(r, locked) {
  const key = r.id + locked;
  if (thumbCache[key]) return thumbCache[key];
  const cv = makeCanvas(96, 96, 2), c = cv.getContext('2d');
  if (locked) { c.fillStyle = 'rgba(255,240,220,.12)'; c.beginPath(); c.arc(48, 48, 40, 0, TAU); c.fill(); c.fillStyle = 'rgba(255,240,220,.35)'; c.font = '28px Georgia, serif'; c.textAlign = 'center'; c.fillText('?', 48, 58); }
  else { const t3 = window.Dish3D && Dish3D.ok && Dish3D.thumb(r); if (t3) return (thumbCache[key] = t3); drawDish(c, r, 48, 48, 40); }
  return (thumbCache[key] = cv.toDataURL());
}

class PlateScene {
  constructor(r) { this.r = r; this.steam = new Particles(); this.fx = new Particles(); this.drops = r.plate.layout.map(() => 0); }
  async enter() {
    UI.hideAll();
    Audio2.ambience('kitchenQuiet');
    Audio2.mood = 1.2;
    const prepQ = game.prepQ ?? 0.85, cookQ = game.cookQ ?? 0.85;
    const q = prepQ * 0.4 + cookQ * 0.6;
    const stars = q >= 0.8 ? 3 : q >= 0.58 ? 2 : 1;
    this.stars = stars;
    Save.data.done[this.r.id] = Math.max(Save.data.done[this.r.id] || 0, stars); Save.store();
    const D3 = window.Dish3D;
    this.d3 = !!(D3 && D3.ok) && D3.plate(this.r, { brown: Math.min(0.85, game.brown ?? 0.7), view: () => ({ x: this.cx(), y: this.cy(), R: this.R() }) }) > 0;
    const n = this.d3 ? D3.pieces.length : this.drops.length;
    if (this.d3) await Tw.wait(0.5);
    for (let i = 0; i < n; i++) {
      await Tw.wait(this.d3 ? 0.26 : 0.22);
      if (G.scene !== this) return;
      if (this.d3) D3.reveal(i); else Tw.to(this.drops, { [i]: 1 }, 0.45, easeBack);
      Audio2.tone({ f: 520 + (i % 8) * 60, vol: 0.05, d: 0.3, verb: 0.5 });
    }
    await Tw.wait(0.6);
    const note = this.r.notes[3 - stars];
    UI.overlay(`<div class="card plated">
      <p class="eyebrow">Plated</p><h2>${this.r.name}</h2>
      <div class="bigstars">${[0, 1, 2].map((i) => `<span class="${i < stars ? 'lit' : ''}" style="animation-delay:${0.2 + i * 0.35}s">★</span>`).join('')}</div>
      <p class="note">${note}</p>
      <button class="btn primary" id="tojournal">Into the journal</button></div>`);
    [0, 1, 2].forEach((i) => { if (i < stars) setTimeout(() => { Audio2.sfxStar(i); for (let k = 0; k < 18; k++) this.fx.add({ kind: 'star', x: G.W / 2 + (i - 1) * 46, y: G.H * 0.24, vx: rand(-120, 120), vy: rand(-140, 40), g: 120, life: rand(0.8, 1.4), size: rand(3, 6), color: '#ffe9a0', add: true, rot: 0, vr: 3 }); }, 200 + i * 350 + 300); });
    $('#tojournal').onclick = () => {
      Audio2.sfxPage();
      const idx = RECIPES.indexOf(this.r);
      const next = RECIPES.every((r) => Save.data.done[r.id]) ? idx : Math.min(RECIPES.length - 1, idx + 1);
      if (RECIPES.every((r) => Save.data.done[r.id]) && !Save.data.feastSeen) { Save.data.feastSeen = 1; Save.store(); go(new FeastScene()); }
      else go(new JournalScene(next));
    };
  }
  exit() { UI.overlay(''); if (this.d3) Dish3D.stop(); }
  resize() { this.bg = paintLinen(this.r); }
  update(dt) {
    this.steam.update(dt); this.fx.update(dt);
    const R = this.R();
    if (!this.d3 && Math.random() < dt * 7) this.steam.add({ kind: 'glow', x: this.cx() + rand(-R, R) * 0.4, y: this.cy() - R * 0.1, vx: rand(-6, 6), vy: rand(-40, -22), life: rand(2.5, 4), size: rand(14, 26), color: '#ffffff', a: 0.12, fadeIn: true, flutter: 0.8, seed: rand(0, 9) });
  }
  R() { return G.W < G.H ? Math.min(G.W * 0.42, G.H * 0.22) : Math.min(G.H * 0.34, G.W * 0.22, 300); }
  cx() { return G.W < G.H ? G.W / 2 : Math.max(G.W * 0.64, Math.min(G.W - this.R() * 1.1, 520 + this.R())); }
  cy() { return G.W < G.H ? G.H * 0.68 : G.H * 0.53; }
  draw(c) {
    if (this.d3) { c.clearRect(0, 0, G.W, G.H); vignette(c, this.cx(), this.cy()); this.fx.draw(c); return; }
    c.drawImage(this.bg, 0, 0, G.W, G.H);
    drawDish(c, this.r, this.cx(), this.cy(), this.R(), { brown: Math.min(0.85, (game.brown ?? 0.7)), drops: this.drops });
    this.steam.draw(c); this.fx.draw(c);
  }
}
function vignette(c, x, y) {
  const W = G.W, H = G.H, g = c.createRadialGradient(x, y, Math.min(W, H) * 0.3, x, y, Math.hypot(W, H) * 0.62);
  g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(14,6,2,.6)');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
}
function paintLinen(r) {
  const W = G.W, H = G.H, P = SKY[r ? r.time : 'golden'], cv = makeCanvas(W, H, Math.min(G.dpr, 1.5)), c = cv.getContext('2d'), R = rng(8);
  const g = c.createLinearGradient(0, 0, W, H); g.addColorStop(0, '#6a4228'); g.addColorStop(1, '#3a2214');
  c.fillStyle = g; c.fillRect(0, 0, W, H);
  // linen runner
  const rx = W * 0.5, rw = Math.min(W * 0.9, 680);
  c.fillStyle = '#efe6d6'; c.fillRect(rx - rw / 2, 0, rw, H);
  c.strokeStyle = 'rgba(140,120,90,.12)'; c.lineWidth = 1;
  for (let x = rx - rw / 2; x < rx + rw / 2; x += 4) { c.beginPath(); c.moveTo(x, 0); c.lineTo(x, H); c.stroke(); }
  for (let y = 0; y < H; y += 4) { c.beginPath(); c.moveTo(rx - rw / 2, y); c.lineTo(rx + rw / 2, y); c.stroke(); }
  c.strokeStyle = 'rgba(160,80,60,.5)'; c.lineWidth = 3; for (const dx of [-rw / 2 + 18, rw / 2 - 18]) { c.beginPath(); c.moveTo(rx + dx, 0); c.lineTo(rx + dx, H); c.stroke(); }
  // light from the window of this time of day
  c.save(); c.globalCompositeOperation = 'soft-light'; softCircle(c, W * 0.25, H * 0.2, Math.max(W, H) * 0.8, P.light, 0.8); c.restore();
  // scattered herbs and a fork
  c.save(); c.translate(W / 2 + Math.min(W * 0.36, 300), H * 0.66); c.rotate(-0.1);
  c.fillStyle = '#c4c8cc'; rrect(c, -3, -70, 6, 120, 3); c.fill(); for (let i = -2; i <= 2; i++) c.fillRect(i * 4 - 1, -96, 2, 30); c.restore();
  for (let i = 0; i < 6; i++) { c.save(); c.translate(W / 2 + R.r(-0.4, 0.4) * rw, H * R.r(0.3, 0.95)); c.rotate(R.r(0, 6)); leaf(c, 0, 0, 16, 5, '#5a8a42', '#c8f0a0'); c.restore(); }
  const vg = c.createRadialGradient(W / 2, H * 0.6, Math.min(W, H) * 0.3, W / 2, H * 0.6, Math.max(W, H) * 0.8);
  vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,8,2,.55)');
  c.fillStyle = vg; c.fillRect(0, 0, W, H);
  return cv;
}

// ── Finale ──────────────────────────────────────────────────────────────────
class FeastScene {
  constructor() { this.fx = new Particles(); this.steam = new Particles(); }
  enter() {
    UI.hideAll(); Audio2.ambience('night'); Audio2.mood = 1.3;
    const total = RECIPES.reduce((a, r) => a + (Save.data.done[r.id] || 0), 0);
    const finds = Object.keys(Save.data.finds).length;
    UI.overlay(`<div class="card feastcard"><p class="eyebrow">Night</p><h2>Supper under the stars</h2>
      <p class="note">Five dishes from one day in the wild: dawn mushrooms to dusk pies. ${total} of 15 stars${finds ? `, and ${finds} little extra find${finds > 1 ? 's' : ''} for the larder` : ''}.</p>
      <button class="btn primary" id="back">Back to the journal</button></div>`);
    $('#back').onclick = () => { Audio2.sfxPage(); go(new JournalScene(0)); };
    this.d3 = !!(window.Dish3D && Dish3D.ok) && Dish3D.feast(RECIPES);
  }
  exit() { UI.overlay(''); if (this.d3) Dish3D.stop(); }
  resize() {
    const W = G.W, H = G.H;
    this.gy = H * 0.42;
    this.layers = paintLandscape({ groundY: this.gy, trees: 'pine', seed: 616, clearings: 0.3, flowers: ['#d8c8ff', '#ffffff'] }, SKY.dusk, W, H, W);
  }
  update(dt) {
    this.fx.update(dt); this.steam.update(dt);
    if (Math.random() < dt * 6) this.fx.add({ kind: 'glow', x: rand(0, G.W), y: rand(this.gy - 60, G.H), vx: rand(-12, 12), vy: rand(-14, 4), life: rand(3, 6), size: rand(6, 12), color: '#e9ff9a', add: true, fadeIn: true, flutter: 2, seed: rand(0, 9), a: 0.9 });
    if (Math.random() < dt * 8) { const p = this.spots ? pick(this.spots) : [G.W / 2, G.H * 0.7, 40]; this.steam.add({ kind: 'glow', x: p[0] + rand(-p[2], p[2]) * 0.4, y: p[1] - p[2] * 0.2, vx: rand(-4, 4), vy: rand(-30, -16), life: rand(2, 3.5), size: rand(10, 18), color: '#ffffff', a: 0.1, fadeIn: true }); }
  }
  draw(c) {
    const W = G.W, H = G.H;
    if (this.d3) { c.clearRect(0, 0, W, H); vignette(c, W / 2, H * 0.62); return; }
    for (const L of this.layers) c.drawImage(L.cv, 0, 0, L.w, H);
    // string of lanterns
    c.strokeStyle = 'rgba(40,30,30,.8)'; c.lineWidth = 1.2; c.beginPath(); c.moveTo(-10, H * 0.12); c.quadraticCurveTo(W / 2, H * 0.32, W + 10, H * 0.12); c.stroke();
    for (let i = 1; i < 10; i++) {
      const t = i / 10, x = lerp(-10, W + 10, t), y = (1 - t) * (1 - t) * H * 0.12 + 2 * (1 - t) * t * H * 0.32 + t * t * H * 0.12;
      c.save(); c.globalCompositeOperation = 'lighter'; softCircle(c, x, y + 8, 40, '#ffb060', 0.3 + 0.06 * Math.sin(G.t * 3 + i)); c.restore();
      c.fillStyle = '#ffd890'; c.beginPath(); c.arc(x, y + 8, 4, 0, TAU); c.fill();
    }
    // table
    const tw = Math.min(W * 0.96, 1100), ty = H * 0.56, th = H * 0.44;
    c.fillStyle = '#3a2416'; c.beginPath(); c.moveTo(W / 2 - tw * 0.42, ty); c.lineTo(W / 2 + tw * 0.42, ty); c.lineTo(W / 2 + tw / 2, H); c.lineTo(W / 2 - tw / 2, H); c.fill();
    c.fillStyle = '#efe6d6'; c.beginPath(); c.moveTo(W / 2 - tw * 0.18, ty); c.lineTo(W / 2 + tw * 0.18, ty); c.lineTo(W / 2 + tw * 0.24, H); c.lineTo(W / 2 - tw * 0.24, H); c.fill();
    c.save(); c.globalCompositeOperation = 'lighter'; softCircle(c, W / 2, ty + th * 0.5, tw * 0.6, '#ffa050', 0.18); c.restore();
    // five dishes
    const portrait = W < H;
    const pos = portrait ? [[0.3, 0.64], [0.7, 0.64], [0.5, 0.75], [0.3, 0.88], [0.7, 0.88]] : [[0.3, 0.66], [0.5, 0.64], [0.7, 0.66], [0.4, 0.84], [0.6, 0.84]];
    const R = portrait ? W * 0.16 : Math.min(H * 0.1, W * 0.07);
    this.spots = [];
    RECIPES.forEach((r, i) => { const x = W * pos[i][0], y = H * pos[i][1]; drawDish(c, r, x, y, R * (0.9 + pos[i][1] * 0.2)); this.spots.push([x, y, R]); });
    drawCandle(c, W / 2, H * 0.7, R * 0.3);
    this.steam.draw(c);
    this.fx.draw(c);
  }
}

// ── Game flow ───────────────────────────────────────────────────────────────
const game = {
  start(r) { this.prepQ = this.cookQ = null; go(new ForageScene(r)); },
  toPrep(r) { go(new PrepScene(r)); },
  toCook(r) { go(new CookScene(r)); },
  toPlate(r) { go(new PlateScene(r), { color: '#fff4de' }); },
};

window.addEventListener('DOMContentLoaded', () => {
  Save.load();
  Audio2.on = Save.data.sound !== false;
  initCanvas();
  const snd = $('#sound');
  const setSnd = () => { snd.classList.toggle('off', !Audio2.on); snd.setAttribute('aria-label', Audio2.on ? 'Mute sound' : 'Turn sound on'); };
  setSnd();
  snd.onclick = () => { Audio2.unlock(); Audio2.setOn(!Audio2.on); Save.data.sound = Audio2.on; Save.store(); setSnd(); };
  $('#begin').onclick = () => { Audio2.unlock(); Audio2.sfxUI(); go(new JournalScene()); };
  $('#home').onclick = () => { Audio2.sfxUI(); Tw.clear(); go(new JournalScene()); };
  // Debug / screenshot hooks: ?scene=forage&r=0
  const q = new URLSearchParams(location.search);
  const sc = q.get('scene'), ri = +(q.get('r') || 0), r = RECIPES[ri];
  if (sc === 'forage') go(new ForageScene(r), { instant: true });
  else if (sc === 'prep') go(new PrepScene(r), { instant: true });
  else if (sc === 'cook') go(new CookScene(r), { instant: true });
  else if (sc === 'plate') { game.brown = 0.7; go(new PlateScene(r), { instant: true }); }
  else if (sc === 'journal') go(new JournalScene(ri), { instant: true });
  else if (sc === 'feast') go(new FeastScene(), { instant: true });
  else go(new TitleScene(), { instant: true });
});
