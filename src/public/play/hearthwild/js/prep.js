// Hearthwild — stage 2: preparing at the board.
'use strict';

class PrepScene {
  constructor(recipe) {
    this.r = recipe; this.P = SKY[recipe.time];
    this.i = -1; this.task = null; this.fx = new Particles(); this.motes = new Particles();
    this.bowls = []; this.scores = [];
    this.pointer = { x: 0, y: 0 };
  }
  enter() {
    Audio2.ambience('kitchenQuiet');
    UI.stage(2, 'Prepare');
    UI.basket([]);
    UI.clearAction();
    this.d3 = !!(window.Prep3D && Prep3D.start(this));
    this.next();
  }
  exit() { if (this.d3) Prep3D.stop(); UI.hint(''); UI.caption(''); UI.clearAction(); }

  resize() {
    const W = G.W, H = G.H, portrait = W < H;
    this.bw = Math.min(W * 0.94, (H - 200) * 1.45, 820);
    this.bh = this.bw * (portrait ? 0.78 : 0.62);
    this.bx = W / 2; this.by = portrait ? H * 0.5 : H * 0.53;
    this.s = Math.min(this.bh * 0.42, this.bw * 0.3);
    this.bg = this.paintKitchen();
    if (this.task && this.task.resize) this.task.resize();
  }

  paintKitchen() {
    const W = G.W, H = G.H, P = this.P;
    const cv = makeCanvas(W, H, Math.min(G.dpr, 1.5)), c = cv.getContext('2d');
    const R = rng(77);
    // wooden counter planks
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, '#6b4329'); g.addColorStop(1, '#4a2c19');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    const plank = 90;
    for (let y = -20; y < H; y += plank) {
      c.fillStyle = rgba(R.pick(['#7a4e30', '#5f3a22', '#6e4529', '#83563a']), 0.55); c.fillRect(0, y, W, plank - 2);
      c.fillStyle = 'rgba(25,12,5,.55)'; c.fillRect(0, y + plank - 2, W, 2);
      for (let i = 0; i < 26; i++) {
        c.strokeStyle = `rgba(${R() < 0.5 ? '40,20,10' : '160,110,70'},${R.r(0.08, 0.2)})`; c.lineWidth = R.r(0.5, 1.5);
        const yy = y + R.r(4, plank - 6), ph = R.r(0, 6);
        c.beginPath(); for (let x = 0; x <= W; x += 20) c.lineTo(x, yy + Math.sin(x * 0.01 + ph) * 3); c.stroke();
      }
    }
    // window light falling across the counter
    c.save(); c.globalCompositeOperation = 'soft-light';
    const lx = W * 0.1, lg = c.createLinearGradient(lx, 0, W * 0.8, H);
    lg.addColorStop(0, rgba(P.light, 0.95)); lg.addColorStop(1, rgba(P.light, 0));
    c.fillStyle = lg; c.beginPath(); c.moveTo(lx - W * 0.2, -10); c.lineTo(lx + W * 0.55, -10); c.lineTo(W * 1.1, H * 0.9); c.lineTo(W * 0.3, H * 1.1); c.fill();
    c.restore();
    c.save(); c.globalCompositeOperation = 'multiply'; c.fillStyle = 'rgba(80,50,40,.25)';
    // muntin shadows
    c.translate(W * 0.45, H * 0.4); c.transform(1, 0, -0.6, 1, 0, 0);
    c.fillRect(-W * 0.02, -H * 0.7, 14, H * 1.4); c.fillRect(-W * 0.6, -6, W * 1.2, 12);
    c.restore();
    // board shadow
    const { bx, by, bw, bh } = this;
    c.fillStyle = 'rgba(20,8,0,.45)'; c.filter = 'blur(14px)'; rrect(c, bx - bw / 2 + 10, by - bh / 2 + 18, bw, bh, 26); c.fill(); c.filter = 'none';
    // board
    const bgr = c.createLinearGradient(bx - bw / 2, by - bh / 2, bx + bw / 2, by + bh / 2);
    bgr.addColorStop(0, '#e2b57a'); bgr.addColorStop(0.5, '#cf9a5e'); bgr.addColorStop(1, '#b37c45');
    c.fillStyle = bgr; rrect(c, bx - bw / 2, by - bh / 2, bw, bh, 24); c.fill();
    c.save(); rrect(c, bx - bw / 2, by - bh / 2, bw, bh, 24); c.clip();
    for (let i = 0; i < 60; i++) {
      c.strokeStyle = `rgba(${R() < 0.5 ? '120,70,30' : '255,230,190'},${R.r(0.06, 0.16)})`; c.lineWidth = R.r(0.6, 2);
      const yy = by - bh / 2 + R.r(0, bh), ph = R.r(0, 6);
      c.beginPath(); for (let x = bx - bw / 2; x <= bx + bw / 2; x += 16) c.lineTo(x, yy + Math.sin(x * 0.012 + ph) * 4); c.stroke();
    }
    // knife marks
    for (let i = 0; i < 40; i++) { c.strokeStyle = `rgba(90,50,20,${R.r(0.05, 0.12)})`; c.lineWidth = 0.8; const x = bx + R.r(-bw, bw) * 0.4, y = by + R.r(-bh, bh) * 0.4; c.beginPath(); c.moveTo(x, y); c.lineTo(x + R.r(-6, 6), y + R.r(10, 24)); c.stroke(); }
    // juice groove
    c.strokeStyle = 'rgba(110,60,25,.35)'; c.lineWidth = 3; rrect(c, bx - bw / 2 + 16, by - bh / 2 + 16, bw - 32, bh - 32, 16); c.stroke();
    c.strokeStyle = 'rgba(255,235,200,.25)'; c.lineWidth = 1; rrect(c, bx - bw / 2 + 18, by - bh / 2 + 18, bw - 36, bh - 36, 15); c.stroke();
    // window light on the board
    c.globalCompositeOperation = 'soft-light'; softCircle(c, bx - bw * 0.2, by - bh * 0.3, bw * 0.7, P.light, 0.7);
    c.restore();
    c.strokeStyle = 'rgba(255,240,210,.45)'; c.lineWidth = 2; rrect(c, bx - bw / 2 + 1, by - bh / 2 + 1, bw - 2, bh - 2, 23); c.stroke();
    // flour dust
    for (let i = 0; i < 160; i++) { c.fillStyle = `rgba(255,250,240,${R.r(0.05, 0.25)})`; c.beginPath(); c.arc(bx + R.r(-0.6, 0.6) * bw + bw * 0.35, by + R.r(-0.6, 0.6) * bh, R.r(0.5, 2), 0, TAU); c.fill(); }
    // a sprig resting on the counter
    c.save(); c.translate(W - 40, 60); c.rotate(2.4); ING.rosemary(c, 40); c.restore();
    c.save(); c.translate(36, H - 40); c.rotate(-0.4); ING.thyme(c, 34); c.restore();
    // vignette
    const vg = c.createRadialGradient(W / 2, H / 2, Math.min(W, H) * 0.3, W / 2, H / 2, Math.max(W, H) * 0.8);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,8,2,.6)');
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
    return cv;
  }

  next() {
    if (this.task) {
      this.scores.push(this.task.q);
      const out = this.task.out || this.task.def.ing;
      this.bowls.push({ ing: out, opt: this.task.outOpt || {}, t: 0 });
    }
    this.i++;
    const def = this.r.prep[this.i];
    if (!def) { this.finish(); return; }
    const T = { rub: RubTask, chop: ChopTask, trace: TraceTask, peel: PeelTask, grind: GrindTask, roll: RollTask }[def.type];
    this.task = new T(this, def);
    UI.top(this.r.name, `Prep · ${this.i + 1} of ${this.r.prep.length}`);
    UI.caption(def.title);
    UI.hint(def.hint || '');
    this.task.intro = 0;
    Tw.to(this.task, { intro: 1 }, 0.8, easeBack);
  }
  async taskDone(word) {
    Audio2.sfxGood();
    const q = this.task.q;
    UI.toast(word || (q > 0.85 ? 'Beautifully done' : q > 0.6 ? 'Nicely done' : 'Good enough for a cottage kitchen'));
    for (let i = 0; i < 26; i++) this.fx.add({ kind: 'star', x: this.bx + rand(-this.s, this.s), y: this.by + rand(-this.s, this.s) * 0.6, vx: rand(-60, 60), vy: rand(-90, -20), life: rand(0.8, 1.4), size: rand(3, 7), color: pick(['#fff6d0', '#ffe08a']), add: true, rot: 0, vr: 3 });
    await Tw.wait(0.7);
    await Tw.to(this.task, { intro: 0 }, 0.45, easeInOut);
    this.next();
  }
  finish() {
    this.task = null;
    UI.caption('Everything is ready');
    UI.hint('');
    UI.top(this.r.name, 'Prep complete');
    const q = this.scores.reduce((a, b) => a + b, 0) / this.scores.length;
    game.prepQ = q;
    UI.action('Light the hearth', () => game.toCook(this.r));
  }

  down(x, y) { this.pointer.x = x; this.pointer.y = y; this.task && this.task.down && this.task.intro > 0.9 && this.task.down(x, y); }
  move(x, y) { this.pointer.x = x; this.pointer.y = y; this.task && this.task.move && this.task.move(x, y); }
  up(x, y) { this.task && this.task.up && this.task.up(x, y); }

  update(dt) {
    this.fx.update(dt); this.motes.update(dt);
    if (Math.random() < dt * 4) this.motes.add({ kind: 'glow', x: rand(0, G.W * 0.7), y: rand(0, G.H), vx: rand(3, 12), vy: rand(-8, 3), life: rand(4, 8), size: rand(1.5, 3.5), color: '#fff3d6', add: true, fadeIn: true, a: 0.7, flutter: 0.8, seed: rand(0, 9) });
    this.task && this.task.update && this.task.update(dt);
    for (const b of this.bowls) b.t = Math.min(1, b.t + dt * 2);
  }
  draw(c) {
    if (this.d3) {
      c.clearRect(0, 0, G.W, G.H);
      if (this.task) { c.save(); const k = this.task.intro; c.globalAlpha = clamp(k * 1.5); c.translate(this.bx, this.by); c.scale(0.85 + 0.15 * k, 0.85 + 0.15 * k); c.translate(-this.bx, -this.by); this.task.draw(c); c.restore(); }
      this.fx.draw(c); this.motes.draw(c);
      const vg = c.createRadialGradient(G.W / 2, G.H / 2, Math.min(G.W, G.H) * 0.35, G.W / 2, G.H / 2, Math.max(G.W, G.H) * 0.8);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(20,8,2,.5)'); c.fillStyle = vg; c.fillRect(0, 0, G.W, G.H);
      return;
    }
    c.drawImage(this.bg, 0, 0, G.W, G.H);
    this.drawBowls(c);
    if (this.task) {
      c.save();
      const k = this.task.intro;
      c.globalAlpha = clamp(k * 1.5);
      c.translate(this.bx, this.by); c.scale(0.85 + 0.15 * k, 0.85 + 0.15 * k); c.translate(-this.bx, -this.by);
      this.task.draw(c);
      c.restore();
    } else this.drawReady(c);
    this.fx.draw(c);
    this.motes.draw(c);
  }
  drawBowls(c) {
    // little ceramic bowls of finished prep along the board's lower edge
    const n = this.r.prep.length, gap = Math.min(86, this.bw / n), y = Math.min(G.H - 70, this.by + this.bh / 2 + 52);
    for (let i = 0; i < n; i++) {
      const x = this.bx + (i - (n - 1) / 2) * gap, r = Math.min(30, gap * 0.38);
      c.fillStyle = 'rgba(20,8,0,.35)'; c.beginPath(); c.ellipse(x + 3, y + r * 0.55, r * 1.05, r * 0.4, 0, 0, TAU); c.fill();
      const g = c.createLinearGradient(x - r, y - r * 0.3, x + r, y + r * 0.6); g.addColorStop(0, '#f4ece0'); g.addColorStop(1, '#b9ab98');
      c.fillStyle = g; c.beginPath(); c.ellipse(x, y, r, r * 0.62, 0, 0, TAU); c.fill();
      c.fillStyle = '#5b6f7c'; c.beginPath(); c.ellipse(x, y - r * 0.05, r * 0.84, r * 0.48, 0, 0, TAU); c.fill();
      c.fillStyle = '#3e4f5a'; c.beginPath(); c.ellipse(x, y, r * 0.78, r * 0.42, 0, 0, TAU); c.fill();
      const b = this.bowls[i];
      if (b) drawSprite(c, b.ing, x, y - r * 0.08 - (1 - b.t) * 30, r * 0.55, b.opt, 0, b.t, 1);
    }
  }
  drawReady(c) {
    const t = G.t;
    c.save(); c.globalCompositeOperation = 'lighter';
    softCircle(c, this.bx, this.by, this.s * 2 + Math.sin(t * 2) * 10, '#ffe2a8', 0.18);
    c.restore();
    const n = this.bowls.length;
    this.bowls.forEach((b, i) => {
      const a = (i / n) * TAU + t * 0.2, rx = this.s * 1.1, ry = this.s * 0.6;
      drawSprite(c, b.ing, this.bx + Math.cos(a) * rx, this.by + Math.sin(a) * ry, this.s * 0.42, b.opt, Math.sin(t + i) * 0.1);
    });
  }
  // Knife glyph used by several tasks.
  knife(c, x, y, rot = 0, s = 1) {
    c.save(); c.translate(x, y); c.rotate(rot); c.scale(s, s);
    c.fillStyle = 'rgba(0,0,0,.2)'; c.beginPath(); c.ellipse(6, 90, 14, 4, 0, 0, TAU); c.fill();
    const bg = c.createLinearGradient(-10, 0, 10, 0); bg.addColorStop(0, '#9aa3ab'); bg.addColorStop(0.5, '#f4f7fa'); bg.addColorStop(1, '#b8c0c8');
    c.fillStyle = bg; c.beginPath(); c.moveTo(-9, -10); c.lineTo(9, -10); c.lineTo(8, 60); c.quadraticCurveTo(4, 80, -4, 86); c.lineTo(-9, 70); c.closePath(); c.fill();
    c.strokeStyle = 'rgba(255,255,255,.8)'; c.lineWidth = 1; c.beginPath(); c.moveTo(7, -8); c.lineTo(6, 62); c.stroke();
    const hg = c.createLinearGradient(-8, 0, 8, 0); hg.addColorStop(0, '#5a3318'); hg.addColorStop(0.5, '#9a6338'); hg.addColorStop(1, '#4a2810');
    c.fillStyle = hg; rrect(c, -8, -70, 16, 62, 6); c.fill();
    c.fillStyle = '#d8d0c0'; for (const yy of [-58, -40, -22]) { c.beginPath(); c.arc(0, yy, 2.2, 0, TAU); c.fill(); }
    c.restore();
  }
}

// ── Rub: brush soil / scale fish / pluck feathers ───────────────────────────
class RubTask {
  constructor(sc, def) {
    this.sc = sc; this.def = def; this.q = 1; this.done = false; this.cover = 1; this.t = 0;
    this.build();
  }
  resize() { this.build(); }
  build() {
    const s = this.sc.s * (this.def.ing === 'trout' ? 1.25 : 1.1);
    this.size = s;
    const box = s * 2.4, res = Math.min(G.dpr, 1.5);
    this.box = box;
    // base sprite + texture overlay masked to the item
    this.base = makeCanvas(box * 2, box * 2, res);
    const b = this.base.getContext('2d'); b.translate(box, box);
    const opt = this.def.mode === 'brush' ? {} : this.def.mode === 'scale' ? { clean: 1 } : {};
    (ING[this.def.ing])(b, s, opt);
    this.mask = makeCanvas(box * 2, box * 2, res);
    const m = this.mask.getContext('2d');
    this.paintTexture(m, box, s);
    m.globalCompositeOperation = 'destination-in';
    m.setTransform(1, 0, 0, 1, 0, 0);
    m.drawImage(this.base, 0, 0);
    m.globalCompositeOperation = 'source-over';
    m.setTransform(res, 0, 0, res, 0, 0);
    this.total = this.countAlpha();
    this.cover = 1;
  }
  paintTexture(m, box, s) {
    const R = rng(13), mode = this.def.mode;
    m.save(); m.translate(box, box);
    if (mode === 'brush') {
      for (let i = 0; i < 180; i++) { m.fillStyle = `rgba(${R.pick(['92,64,38', '70,48,28', '120,92,60', '60,46,30'])},${R.r(0.5, 0.95)})`; m.beginPath(); m.ellipse(R.r(-1, 1) * s, R.r(-1, 1) * s, R.r(2, 9), R.r(2, 6), R.r(0, 3), 0, TAU); m.fill(); }
      m.strokeStyle = 'rgba(120,90,40,.9)'; m.lineWidth = 1.5;
      for (let i = 0; i < 18; i++) { const x = R.r(-0.8, 0.8) * s, y = R.r(-0.8, 0.8) * s, a = R.r(0, 3); m.beginPath(); m.moveTo(x, y); m.lineTo(x + Math.cos(a) * 16, y + Math.sin(a) * 16); m.stroke(); }
    } else if (mode === 'scale') {
      for (let y = -s; y < s; y += 6) for (let x = -s * 1.1; x < s * 1.1; x += 7) {
        const ox = (Math.round(y / 6) % 2) * 3.5;
        m.fillStyle = `rgba(${R() < 0.5 ? '210,222,215' : '170,185,170'},${R.r(0.55, 0.85)})`;
        m.beginPath(); m.arc(x + ox, y, 4.2, 0, Math.PI); m.fill();
        m.strokeStyle = 'rgba(255,255,255,.5)'; m.lineWidth = 0.6; m.beginPath(); m.arc(x + ox, y, 4.2, 0.2, Math.PI - 0.2); m.stroke();
      }
    } else if (mode === 'pluck') {
      const fs = Math.max(7, s * 0.075);
      for (let x = s * 1.15; x > -s * 1.2; x -= fs * 0.8) for (let y = -s * 0.85; y < s * 0.85; y += fs * 0.75) {
        const yy = y + ((Math.round(x / fs) % 2) ? fs * 0.37 : 0);
        const head = clamp((x / s + 1) / 2);
        const col = mix(R.pick(['#b5652d', '#c97a36', '#a85a26', '#d48c44']), '#2c4a46', head > 0.82 ? 0.7 : 0);
        m.save(); m.translate(x, yy);
        const g = m.createLinearGradient(fs, 0, -fs, 0); g.addColorStop(0, mix(col, '#000000', 0.25)); g.addColorStop(1, mix(col, '#ffe0a0', 0.25));
        m.fillStyle = g; m.beginPath(); m.ellipse(-fs * 0.2, 0, fs, fs * 0.62, 0, 0, TAU); m.fill();
        m.strokeStyle = 'rgba(40,18,6,.55)'; m.lineWidth = 1.2; m.beginPath(); m.arc(-fs * 0.2, 0, fs * 0.62, Math.PI * 0.6, Math.PI * 1.4); m.stroke();
        m.fillStyle = 'rgba(30,14,4,.45)'; m.beginPath(); m.ellipse(-fs * 0.6, 0, fs * 0.18, fs * 0.14, 0, 0, TAU); m.fill();
        m.restore();
      }
    }
    m.restore();
  }
  countAlpha() {
    try {
      const w = this.mask.width, h = this.mask.height, d = this.mask.getContext('2d').getImageData(0, 0, w, h).data;
      let n = 0; for (let i = 3; i < d.length; i += 16) if (d[i] > 40) n++;
      return n;
    } catch (_) { return 1; }
  }
  down(x, y) { this.last = [x, y]; this.scrub(x, y); }
  move(x, y) { if (G.pointer.down && !this.done) this.scrub(x, y); }
  up() { this.last = null; }
  scrub(x, y) {
    const sc = this.sc, box = this.box;
    const lx = x - sc.bx + box, ly = y - sc.by + box;
    const m = this.mask.getContext('2d');
    m.save(); m.globalCompositeOperation = 'destination-out';
    const r = this.size * (this.def.mode === 'pluck' ? 0.22 : 0.2);
    const [px, py] = this.last || [x, y];
    const steps = Math.max(1, Math.ceil(dist(px, py, x, y) / 6));
    for (let i = 0; i <= steps; i++) {
      const t = i / steps, cx = lerp(px - sc.bx + box, lx, t), cy = lerp(py - sc.by + box, ly, t);
      const g = m.createRadialGradient(cx, cy, 0, cx, cy, r);
      g.addColorStop(0, 'rgba(0,0,0,.55)'); g.addColorStop(1, 'rgba(0,0,0,0)');
      m.fillStyle = g; m.beginPath(); m.arc(cx, cy, r, 0, TAU); m.fill();
    }
    m.restore();
    const moved = dist(px, py, x, y);
    this.last = [x, y];
    const onItem = Math.abs(x - sc.bx) < this.size * 1.1 && Math.abs(y - sc.by) < this.size;
    if (!onItem || moved < 1) return;
    this.acc = (this.acc || 0) + moved;
    if (this.acc > 22) {
      this.acc = 0;
      const mode = this.def.mode;
      if (mode === 'brush') { Audio2.sfxScrub(); for (let i = 0; i < 3; i++) sc.fx.add({ x, y, vx: rand(-80, 80), vy: rand(-60, 10), g: 500, life: 0.9, size: rand(1, 2.6), color: pick(['#5c4026', '#7a5a3a']), floor: sc.by + sc.bh * 0.45 }); }
      else if (mode === 'scale') { Audio2.sfxScrub(); for (let i = 0; i < 4; i++) sc.fx.add({ kind: 'star', x, y, vx: rand(-120, 120), vy: rand(-140, -20), g: 400, life: 0.8, size: rand(2, 4), color: pick(['#e8f6f2', '#cfe3dc', '#ffffff']), add: true, rot: rand(0, 3), vr: rand(-8, 8) }); }
      else if (mode === 'pluck') {
        Audio2.sfxTear();
        for (let i = 0; i < 2; i++) {
          const col = pick(['#b5652d', '#8a4820', '#d48c44', '#c97a36']);
          sc.fx.add({ kind: 'feather', x, y, vx: rand(-60, 60), vy: rand(-120, -40), g: 30, drag: 0.97, life: rand(2.5, 4), rot: rand(0, 6), vr: rand(-3, 3), flutter: 2.5, seed: rand(0, 9),
            draw: (c) => { c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 10, 4, 0, 0, TAU); c.fill(); c.strokeStyle = 'rgba(255,240,220,.6)'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-10, 0); c.lineTo(10, 0); c.stroke(); } });
        }
      }
    }
    this.checkT = (this.checkT || 0) + 1;
    if (this.checkT % 6 === 0) {
      this.cover = this.countAlpha() / Math.max(1, this.total);
      if (this.cover < 0.1 && !this.done) {
        this.done = true; this.t = 0;
        this.q = clamp(1 - Math.max(0, this.time - 10) * 0.02, 0.7, 1);
        Tw.to(this, { fadeOut: 1 }, 0.5);
        this.sc.taskDone(this.def.mode === 'pluck' ? 'Plucked clean' : this.def.mode === 'scale' ? 'Scales gone, skin gleaming' : 'Clean as a whistle');
      }
    }
  }
  update(dt) { this.time = (this.time || 0) + dt; }
  draw(c) {
    const sc = this.sc, box = this.box;
    c.fillStyle = 'rgba(40,20,5,.25)'; c.beginPath(); c.ellipse(sc.bx + 6, sc.by + this.size * 0.55, this.size * 0.75, this.size * 0.14, 0, 0, TAU); c.fill();
    c.drawImage(this.base, sc.bx - box, sc.by - box, box * 2, box * 2);
    c.globalAlpha *= 1 - (this.fadeOut || 0);
    c.drawImage(this.mask, sc.bx - box, sc.by - box, box * 2, box * 2);
    c.globalAlpha = 1;
    // tool at pointer
    if (!this.done && G.pointer.down) {
      const { x, y } = G.pointer;
      c.save(); c.translate(x, y); c.rotate(-0.5 + Math.sin(G.t * 20) * 0.08);
      if (this.def.mode === 'brush') {
        c.fillStyle = '#8a5a30'; rrect(c, -22, -8, 44, 16, 6); c.fill();
        c.fillStyle = '#e8d8b0'; for (let i = -18; i < 20; i += 4) c.fillRect(i, 6, 2.2, 10);
      } else if (this.def.mode === 'scale') { sc.knife(c, 0, -40, 1.2, 0.6); }
      else { c.fillStyle = 'rgba(255,230,210,.5)'; c.beginPath(); c.arc(0, 0, 14, 0, TAU); c.fill(); }
      c.restore();
    }
    // progress ring
    const p = 1 - clamp((this.cover - 0.1) / 0.9);
    UI.ring(c, sc.bx + sc.bw / 2 - 34, sc.by - sc.bh / 2 + 34, 16, p);
  }
}

// ── Chop: tap along the guides ──────────────────────────────────────────────
class ChopTask {
  constructor(sc, def) {
    this.sc = sc; this.def = def; this.q = 1; this.done = false;
    this.pass = 0; this.passRot = 0; this.hits = []; this.misses = 0;
    this.knifeY = 0; this.kx = sc.bx; this.spread = 0;
    this.out = def.out; this.cuts = [[], []];
    this.setup();
  }
  resize() { this.setup(true); }
  setup(keep) {
    const sc = this.sc, s = sc.s * (this.def.ing === 'venison' ? 1.0 : 1.15);
    this.size = s;
    const n = this.def.cuts;
    this.lines = [];
    for (let i = 0; i < n; i++) this.lines.push(lerp(-0.72, 0.72, (i + 0.5) / n) * s * (this.def.ing === 'venison' ? 0.95 : 1));
    this.tol = (this.lines[1] - this.lines[0]) * 0.5;
  }
  current() { return this.cuts[this.pass]; }
  down(x) {
    if (this.done || this.chopping) return;
    this.kx = x;
    this.chopping = true;
    Tw.to(this, { knifeY: 1 }, 0.07, (t) => t).then(() => {
      // in board frame, screen x maps to frame coord for current pass
      const rel = x - this.sc.bx;
      const cut = this.current();
      let best = -1, bd = 1e9;
      this.lines.forEach((l, i) => { if (cut.some((cc) => cc.i === i)) return; const d = Math.abs(l - rel); if (d < bd) { bd = d; best = i; } });
      if (best >= 0 && bd < this.tol) {
        cut.push({ i: best, at: this.lines[best], q: 1 - bd / this.tol });
        Audio2.sfxChop();
        for (let k = 0; k < 5; k++) this.sc.fx.add({ x, y: this.sc.by + rand(-10, 10), vx: rand(-90, 90), vy: rand(-160, -60), g: 600, life: 0.7, size: rand(1.4, 3), color: this.crumbCol(), floor: this.sc.by + this.size * 0.5 });
        Tw.to(this, { spread: cut.length / this.lines.length }, 0.25, easeOut);
        if (cut.length === this.lines.length) this.passDone();
      } else { Audio2.sfxKnifeTap(); this.misses++; }
      Tw.to(this, { knifeY: 0 }, 0.16, easeOut).then(() => (this.chopping = false));
    });
  }
  crumbCol() { return { chanterelle: '#f2b23a', garlic: '#5aa845', sorrel: '#6cb34e', carrot: '#f39033', venison: '#9a2f2c', porcini: '#e9dcc0' }[this.def.ing] || '#ffffff'; }
  move(x) { this.kx = x; }
  async passDone() {
    if (this.def.dice && this.pass === 0) {
      this.passBusy = true;
      await Tw.wait(0.25);
      Audio2.sfxWhoosh();
      await Tw.to(this, { passRot: Math.PI / 2 }, 0.6, easeInOut);
      this.pass = 1; this.spread = 0; this.passBusy = false;
      const n = this.lines.length; this.lines = this.lines.map((l, i) => lerp(-0.42, 0.42, (i + 0.5) / n) * this.size); this.tol = (this.lines[1] - this.lines[0]) * 0.5;
      UI.hint('Now across the other way.');
      return;
    }
    this.done = true;
    const all = this.cuts[0].concat(this.cuts[1]);
    const acc = all.reduce((a, c) => a + c.q, 0) / all.length;
    this.q = clamp(acc * 0.85 + 0.2 - this.misses * 0.03, 0.4, 1);
    await Tw.to(this, { spread: 2.2 }, 0.5, easeOut);
    this.sc.taskDone();
  }
  update() {}
  draw(c) {
    const sc = this.sc, s = this.size;
    c.fillStyle = 'rgba(40,20,5,.25)'; c.beginPath(); c.ellipse(sc.bx + 6, sc.by + s * 0.35, s * 0.85, s * 0.12, 0, 0, TAU); c.fill();
    c.save(); c.translate(sc.bx, sc.by); c.rotate(this.passRot);
    const xs = [-1e4].concat(this.cuts[0].map((q) => q.at).sort((a, b) => a - b), [1e4]);
    const ys = [-1e4].concat(this.cuts[1].map((q) => -q.at).sort((a, b) => a - b), [1e4]);
    const sp0 = (this.pass === 0 ? this.spread : 1) * 10, sp1 = (this.pass === 1 ? this.spread : 0) * 10;
    const opt = Object.assign({}, this.def.opt || {});
    for (let i = 0; i < xs.length - 1; i++) for (let j = 0; j < ys.length - 1; j++) {
      c.save();
      const ox = (i - (xs.length - 2) / 2) * sp0, oy = (j - (ys.length - 2) / 2) * sp1;
      c.translate(ox, oy);
      c.beginPath(); c.rect(Math.max(xs[i], -s * 2), Math.max(ys[j], -s * 2), Math.min(xs[i + 1], s * 2) - Math.max(xs[i], -s * 2), Math.min(ys[j + 1], s * 2) - Math.max(ys[j], -s * 2)); c.clip();
      drawSprite(c, this.def.ing, 0, 0, s * (this.def.ing === 'venison' ? 0.95 : 0.85), opt, this.def.rot || 0);
      c.restore();
    }
    // guides
    if (!this.done && !this.passBusy) {
      const cut = this.current();
      this.lines.forEach((l, i) => {
        if (cut.some((cc) => cc.i === i)) return;
        const a = 0.55 + 0.25 * Math.sin(G.t * 4 + i);
        c.strokeStyle = `rgba(255,255,255,${a})`; c.lineWidth = 1.6; c.setLineDash([5, 6]); c.lineDashOffset = -G.t * 20;
        c.beginPath();
        if (this.pass === 0) { c.moveTo(l, -s * 0.7); c.lineTo(l, s * 0.7); }
        else { c.moveTo(-s * 0.95, -l); c.lineTo(s * 0.95, -l); }
        c.stroke(); c.setLineDash([]);
      });
    }
    c.restore();
    // knife
    if (!this.done) {
      const kx = clamp(this.kx, sc.bx - s * 1.2, sc.bx + s * 1.2);
      const ky = sc.by - s * 1.55 + this.knifeY * s * 0.95;
      sc.knife(c, kx - 2, ky, 0, Math.max(0.7, s / 110));
    }
    const p = this.current().length / this.lines.length;
    UI.ring(c, sc.bx + sc.bw / 2 - 34, sc.by - sc.bh / 2 + 34, 16, this.def.dice ? (this.pass + p) / 2 : p);
  }
}

// ── Trace: fillet, joint, take breasts, strip herbs ─────────────────────────
class TraceTask {
  constructor(sc, def) {
    this.sc = sc; this.def = def; this.q = 1; this.done = false;
    this.k = 0; this.p = 0; this.dev = 0; this.devN = 0; this.parts = { fore: 1, hind: 1, saddle: 1 }; this.sep = [0, 0, 0];
    this.setup();
  }
  resize() { this.setup(); }
  setup() {
    const s = this.sc.s * (this.def.mode === 'strip' ? 1.3 : 1.2);
    this.size = s;
    const m = this.def.mode;
    let paths;
    if (m === 'fillet') paths = [[[0.78, -0.08], [0.45, -0.2], [0, -0.22], [-0.45, -0.14], [-0.74, -0.06]]];
    else if (m === 'joint') paths = [[[0.48, -0.42], [0.42, -0.15], [0.42, 0.15], [0.48, 0.42]], [[-0.5, -0.45], [-0.56, -0.15], [-0.56, 0.15], [-0.5, 0.45]]];
    else if (m === 'breast') paths = [[[0.62, 0], [0.2, -0.04], [-0.2, -0.04], [-0.58, 0]], [[0.6, -0.08], [0.3, -0.5], [-0.3, -0.52], [-0.62, -0.12]]];
    else paths = [[[0.95, 0], [0.4, -0.04], [-0.2, -0.02], [-0.9, 0.08]]];
    // sample each path densely
    this.paths = paths.map((pts) => {
      const P = pts.map((p) => [p[0] * s, p[1] * s]);
      const out = [];
      for (let i = 0; i < P.length - 1; i++) {
        const p0 = P[Math.max(0, i - 1)], p1 = P[i], p2 = P[i + 1], p3 = P[Math.min(P.length - 1, i + 2)];
        for (let t = 0; t < 1; t += 0.05) {
          const t2 = t * t, t3 = t2 * t;
          const f = (a, b, c2, d) => 0.5 * (2 * b + (-a + c2) * t + (2 * a - 5 * b + 4 * c2 - d) * t2 + (-a + 3 * b - 3 * c2 + d) * t3);
          out.push([f(p0[0], p1[0], p2[0], p3[0]), f(p0[1], p1[1], p2[1], p3[1])]);
        }
      }
      out.push(P[P.length - 1]);
      return out;
    });
    this.tol = Math.max(20, s * 0.14);
  }
  local(x, y) { return [x - this.sc.bx, y - this.sc.by]; }
  down(x, y) { this.move(x, y, true); }
  move(x, y) {
    if (!G.pointer.down || this.done || this.busy) return;
    const path = this.paths[this.k];
    const [lx, ly] = this.local(x, y);
    let found = -1, fd = 1e9;
    for (let j = this.p; j < Math.min(path.length, this.p + 10); j++) {
      const d = dist(lx, ly, path[j][0], path[j][1]);
      if (d < this.tol && d < fd + 0.01) { fd = d; found = j; }
    }
    if (found > this.p || (found === this.p && this.p === 0)) {
      const steps = found - this.p;
      this.p = found; this.dev += (fd / this.tol) * Math.max(1, steps); this.devN += Math.max(1, steps);
      this.sliceT = (this.sliceT || 0) - 1;
      if (this.sliceT <= 0) { this.sliceT = 5; this.def.mode === 'strip' ? Audio2.sfxRustle() : Audio2.sfxSlice(); }
      if (this.def.mode === 'strip') {
        if (Math.random() < 0.7) { const col = pick(['#6f9a5a', '#8fb874']); this.sc.fx.add({ x, y, vx: rand(-30, 30), vy: rand(20, 80), g: 300, life: 1.2, rot: rand(0, 6), vr: rand(-6, 6), floor: this.sc.by + this.size * 0.5, draw: (c) => { c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 4, 2.4, 0, 0, TAU); c.fill(); } }); }
      } else if (Math.random() < 0.5) this.sc.fx.add({ kind: 'star', x, y, vx: rand(-30, 30), vy: rand(-40, -5), life: 0.5, size: rand(2, 3.5), color: '#fff6dc', add: true });
      if (this.p >= path.length - 1) this.cutDone();
    }
  }
  up() {}
  async cutDone() {
    this.busy = true;
    Audio2.sfxGood();
    const m = this.def.mode;
    if (m === 'joint') { Tw.to(this.sep, { [this.k]: 1 }, 0.6, easeBack); }
    if (m === 'breast' || m === 'fillet') Tw.to(this.sep, { [this.k]: 1 }, 0.6, easeOut);
    await Tw.wait(0.6);
    if (this.k < this.paths.length - 1) { this.k++; this.p = 0; this.busy = false; return; }
    this.done = true;
    this.q = clamp(1 - (this.dev / Math.max(1, this.devN)) * 0.55, 0.45, 1);
    this.out = m === 'fillet' ? 'troutFillet' : m === 'joint' ? 'rabbitPiece' : m === 'breast' ? 'pheasantBreast' : 'thymeLeaves';
    if (m === 'fillet') this.outOpt = { skin: true };
    await Tw.to(this, { morph: 1 }, 0.6, easeInOut);
    this.sc.taskDone(m === 'joint' ? 'Neatly jointed' : m === 'fillet' ? 'A clean fillet' : m === 'breast' ? 'Two perfect breasts' : 'Leaves stripped');
  }
  update() {}
  draw(c) {
    const sc = this.sc, s = this.size, m = this.def.mode;
    c.fillStyle = 'rgba(40,20,5,.25)'; c.beginPath(); c.ellipse(sc.bx + 6, sc.by + s * 0.35, s * 0.85, s * 0.12, 0, 0, TAU); c.fill();
    c.save(); c.translate(sc.bx, sc.by);
    const mo = this.morph || 0;
    c.globalAlpha = 1 - mo;
    if (m === 'fillet') {
      drawTrout(c, s, {});
      if (this.sep[0] > 0) { c.save(); c.globalAlpha = this.sep[0] * (1 - mo); c.translate(0, -this.sep[0] * s * 0.45); ING.troutFillet(c, s * 0.9, {}); c.restore(); }
    } else if (m === 'joint') {
      const sep = this.sep;
      c.save(); c.translate(sep[0] * s * 0.25, 0); ING.rabbitDressed(c, s, { parts: { fore: 1 } }); c.restore();
      c.save(); c.translate(-sep[1] * s * 0.25, 0); ING.rabbitDressed(c, s, { parts: { hind: 1 } }); c.restore();
      ING.rabbitDressed(c, s, { parts: { saddle: 1 } });
    } else if (m === 'breast') {
      ING.pheasantPlucked(c, s, {});
      if (this.sep[1] > 0) { c.save(); c.globalAlpha = this.sep[1] * (1 - mo); c.translate(0, -this.sep[1] * s * 0.5); ING.pheasantBreast(c, s * 0.5, {}); c.translate(0, s * 0.3); ING.pheasantBreast(c, s * 0.5, {}); c.restore(); }
    } else {
      const total = this.paths[0].length;
      ING.thyme(c, s, { stripped: this.p / total });
    }
    c.globalAlpha = 1;
    if (mo > 0) {
      const outName = this.out, n = m === 'joint' ? 4 : m === 'breast' ? 2 : 1;
      for (let i = 0; i < n; i++) drawSprite(c, outName, (i - (n - 1) / 2) * s * 0.55, 0, s * (n > 1 ? 0.32 : 0.6), this.outOpt || {}, 0.2 * i, mo, 0.8 + mo * 0.2);
    }
    // guides
    if (!this.done) {
      this.paths.forEach((path, pi) => {
        if (pi < this.k) return;
        const active = pi === this.k;
        c.lineCap = 'round';
        c.strokeStyle = `rgba(255,255,255,${active ? 0.75 : 0.25})`; c.lineWidth = 2; c.setLineDash([2, 7]); c.lineDashOffset = -G.t * 18;
        c.beginPath(); path.forEach((p, i) => (i ? c.lineTo(p[0], p[1]) : c.moveTo(p[0], p[1]))); c.stroke(); c.setLineDash([]);
        if (active) {
          // completed portion glows
          if (this.p > 0) {
            c.save(); c.globalCompositeOperation = 'lighter';
            c.strokeStyle = 'rgba(255,220,150,.9)'; c.lineWidth = 3; c.shadowColor = '#ffd58a'; c.shadowBlur = 12;
            c.beginPath(); for (let i = 0; i <= this.p; i++) i ? c.lineTo(path[i][0], path[i][1]) : c.moveTo(path[i][0], path[i][1]); c.stroke();
            c.restore();
          }
          // start beacon
          const sp = path[this.p], k = (G.t % 1.2) / 1.2;
          c.strokeStyle = `rgba(255,240,200,${1 - k})`; c.lineWidth = 2; c.beginPath(); c.arc(sp[0], sp[1], 8 + k * 16, 0, TAU); c.stroke();
          c.fillStyle = '#fff4d8'; c.beginPath(); c.arc(sp[0], sp[1], 5, 0, TAU); c.fill();
          // arrow toward next
          const nx = path[Math.min(path.length - 1, this.p + 6)];
          const a = Math.atan2(nx[1] - sp[1], nx[0] - sp[0]);
          c.save(); c.translate(sp[0] + Math.cos(a) * 22, sp[1] + Math.sin(a) * 22); c.rotate(a); c.fillStyle = 'rgba(255,244,220,.8)'; c.beginPath(); c.moveTo(6, 0); c.lineTo(-4, -5); c.lineTo(-4, 5); c.fill(); c.restore();
        }
      });
    }
    c.restore();
    if (!this.done && G.pointer.down && m !== 'strip') sc.knife(c, G.pointer.x - 2, G.pointer.y - 84 * Math.max(0.7, s / 110), 0, Math.max(0.7, s / 110));
    const total = this.paths.reduce((a, p) => a + p.length, 0), done = this.paths.slice(0, this.k).reduce((a, p) => a + p.length, 0) + this.p;
    UI.ring(c, sc.bx + sc.bw / 2 - 34, sc.by - sc.bh / 2 + 34, 16, done / total);
  }
}

// ── Peel: long strokes along the carrot ─────────────────────────────────────
class PeelTask {
  constructor(sc, def) {
    this.sc = sc; this.def = def; this.q = 1; this.done = false;
    this.bands = [0, 0, 0, 0, 0]; this.strokes = 0; this.cur = null;
    this.size = sc.s * 1.25; this.out = 'carrot'; this.outOpt = { peeled: 1 };
  }
  resize() { this.size = this.sc.s * 1.25; }
  bandY(i) { return lerp(-0.13, 0.13, i / 4) * this.size; }
  down(x, y) {
    const lx = x - this.sc.bx, ly = y - this.sc.by;
    if (Math.abs(ly) > this.size * 0.35) return;
    let best = -1, bd = 1e9;
    this.bands.forEach((b, i) => { if (b >= 1) return; const d = Math.abs(this.bandY(i) - ly); if (d < bd) { bd = d; best = i; } });
    if (best < 0) return;
    this.cur = { band: best, x0: lx, min: lx, max: lx };
    this.strokes++;
  }
  move(x, y) {
    if (!this.cur || !G.pointer.down) return;
    const lx = x - this.sc.bx; const c = this.cur;
    const pmin = c.min, pmax = c.max;
    c.min = Math.min(c.min, lx); c.max = Math.max(c.max, lx);
    if (c.max - c.min > pmax - pmin + 6) Audio2.nz({ f: 2200, q: 1, vol: 0.05, d: 0.06 });
    const span = (c.max - c.min) / (this.size * 1.8);
    this.bands[c.band] = Math.max(this.bands[c.band], clamp(span) * 0.999);
    if (span > 0.62) {
      this.bands[c.band] = 1; Audio2.sfxSlice();
      const y = this.sc.by + this.bandY(c.band);
      for (let i = 0; i < 3; i++) this.sc.fx.add({ x: x, y, vx: rand(-60, 60), vy: rand(-140, -40), g: 420, life: 1.4, rot: rand(0, 6), vr: rand(-5, 5), floor: this.sc.by + this.size * 0.5,
        draw: (cc) => { cc.strokeStyle = '#c0661e'; cc.lineWidth = 3; cc.lineCap = 'round'; cc.beginPath(); cc.arc(0, 0, 7, 0, Math.PI * 1.4); cc.stroke(); } });
      this.cur = null;
      if (this.bands.every((b) => b >= 1)) {
        this.done = true;
        this.q = clamp(1 - Math.max(0, this.strokes - this.bands.length) * 0.06, 0.5, 1);
        this.sc.taskDone('Peeled to a shine');
      }
    }
  }
  up() { if (this.cur && this.bands[this.cur.band] < 1) this.bands[this.cur.band] = 0; this.cur = null; }
  update() {}
  draw(c) {
    const sc = this.sc, s = this.size;
    c.fillStyle = 'rgba(40,20,5,.25)'; c.beginPath(); c.ellipse(sc.bx + 8, sc.by + s * 0.25, s * 1.05, s * 0.12, 0, 0, TAU); c.fill();
    c.save(); c.translate(sc.bx, sc.by);
    ING.carrot(c, s, { peeled: 1 });
    // unpeeled skin bands clipped to the root
    c.save();
    c.beginPath(); c.moveTo(-s * 0.9, -s * 0.18); c.quadraticCurveTo(0, -s * 0.2, s * 1.0, -s * 0.01); c.lineTo(s, s * 0.01); c.quadraticCurveTo(0, s * 0.2, -s * 0.9, s * 0.18); c.closePath(); c.clip();
    const bh = s * 0.4 / 5;
    this.bands.forEach((b, i) => {
      if (b >= 1) return;
      const y = this.bandY(i) - bh / 2 - s * 0.02;
      let x0 = -s, x1 = s * 1.05;
      if (this.cur && this.cur.band === i) { // peel progressively from one end of the stroke
        const L = this.cur.max - this.cur.min;
        if (L > 4) { c.fillStyle = 'rgba(150,70,20,.55)'; c.fillRect(x0, y, this.cur.min - x0, bh + 1); c.fillRect(this.cur.max, y, x1 - this.cur.max, bh + 1); return; }
      }
      c.fillStyle = 'rgba(150,70,20,.55)'; c.fillRect(x0, y, x1 - x0, bh + 1);
      c.strokeStyle = 'rgba(90,40,10,.4)'; c.lineWidth = 0.8;
      for (let x = -s; x < s; x += 14) { c.beginPath(); c.moveTo(x, y + 1); c.lineTo(x + 4, y + bh); c.stroke(); }
    });
    c.restore();
    // band guides
    if (!this.done) this.bands.forEach((b, i) => {
      if (b >= 1) return;
      c.strokeStyle = `rgba(255,255,255,${0.35 + 0.2 * Math.sin(G.t * 3 + i)})`; c.setLineDash([3, 8]); c.lineDashOffset = -G.t * 30; c.lineWidth = 1.2;
      c.beginPath(); c.moveTo(-s * 0.8, this.bandY(i)); c.lineTo(s * 0.85, this.bandY(i)); c.stroke(); c.setLineDash([]);
    });
    c.restore();
    if (G.pointer.down && !this.done) {
      // little peeler
      c.save(); c.translate(G.pointer.x, G.pointer.y); c.rotate(-0.3);
      c.fillStyle = '#c8ced4'; rrect(c, -4, -18, 8, 22, 3); c.fill();
      c.fillStyle = '#7a4a28'; rrect(c, -5, -60, 10, 42, 4); c.fill();
      c.restore();
    }
    const p = this.bands.filter((b) => b >= 1).length / this.bands.length;
    UI.ring(c, sc.bx + sc.bw / 2 - 34, sc.by - sc.bh / 2 + 34, 16, p);
  }
}

// ── Grind: circle the pestle ────────────────────────────────────────────────
class GrindTask {
  constructor(sc, def) {
    this.sc = sc; this.def = def; this.q = 1; this.done = false; this.p = 0; this.out = 'juniperCrushed';
    this.R = sc.s * 1.05; this.berries = [];
    const R = rng(4); for (let i = 0; i < 16; i++) this.berries.push([R.r(-0.5, 0.5), R.r(-0.5, 0.5), R.r(0, 6)]);
  }
  resize() { this.R = this.sc.s * 1.05; }
  down(x, y) { this.lastA = Math.atan2(y - this.sc.by, x - this.sc.bx); }
  move(x, y) {
    if (!G.pointer.down || this.done) return;
    const dx = x - this.sc.bx, dy = y - this.sc.by, d = Math.hypot(dx, dy);
    const a = Math.atan2(dy, dx);
    if (this.lastA !== undefined && d > this.R * 0.15 && d < this.R * 1.1) {
      let da = a - this.lastA; if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU;
      if (Math.abs(da) < 1) {
        this.p = clamp(this.p + Math.abs(da) / (TAU * 4));
        this.acc = (this.acc || 0) + Math.abs(da);
        if (this.acc > 0.5) { this.acc = 0; Audio2.sfxGrind(); }
        if (Math.random() < 0.3) this.sc.fx.add({ x, y, vx: rand(-20, 20), vy: rand(-20, 20), life: 0.6, size: rand(0.8, 1.8), color: '#4b5d8f' });
      }
    }
    this.lastA = a;
    if (this.p >= 1 && !this.done) {
      this.done = true; this.q = 1;
      Audio2.nz({ f: 800, q: 0.5, vol: 0.1, d: 0.4 });
      this.sc.taskDone('Fragrant as a pine wood');
    }
  }
  up() { this.lastA = undefined; }
  update() {}
  draw(c) {
    const { bx, by } = this.sc, R = this.R;
    if (this.sc.d3) {
      if (!this.done && !G.pointer.down) { const k = (G.t % 1.6) / 1.6; c.strokeStyle = `rgba(255,245,220,${0.7 * (1 - k)})`; c.lineWidth = 2; c.setLineDash([4, 8]); c.beginPath(); c.arc(bx, by, R * 0.55, G.t, G.t + Math.PI * 1.5); c.stroke(); c.setLineDash([]); }
      UI.ring(c, this.sc.bx + this.sc.bw / 2 - 34, this.sc.by - this.sc.bh / 2 + 34, 16, this.p);
      return;
    }
    c.fillStyle = 'rgba(30,15,5,.35)'; c.beginPath(); c.ellipse(bx + 10, by + 16, R * 1.15, R * 1.1, 0, 0, TAU); c.fill();
    const g = c.createRadialGradient(bx - R * 0.3, by - R * 0.4, R * 0.2, bx, by, R * 1.15);
    g.addColorStop(0, '#d6d0c4'); g.addColorStop(1, '#8f877a');
    c.fillStyle = g; c.beginPath(); c.arc(bx, by, R * 1.1, 0, TAU); c.fill();
    const ig = c.createRadialGradient(bx + R * 0.2, by + R * 0.3, 0, bx, by, R * 0.85);
    ig.addColorStop(0, '#a49b8c'); ig.addColorStop(1, '#6e665a');
    c.fillStyle = ig; c.beginPath(); c.arc(bx, by, R * 0.85, 0, TAU); c.fill();
    // stone speckles
    const Rr = rng(6); for (let i = 0; i < 60; i++) { c.fillStyle = `rgba(${Rr() < 0.5 ? '255,255,255' : '40,30,20'},.12)`; const a = Rr.r(0, TAU), d = Rr.r(0.86, 1.08) * R; c.beginPath(); c.arc(bx + Math.cos(a) * d, by + Math.sin(a) * d, 1.2, 0, TAU); c.fill(); }
    // contents
    const p = this.p;
    c.fillStyle = `rgba(70,80,120,${p * 0.9})`; c.beginPath(); c.ellipse(bx, by + R * 0.1, R * 0.55 * (0.5 + p * 0.5), R * 0.4 * (0.5 + p * 0.5), 0, 0, TAU); c.fill();
    this.berries.forEach(([x, y, a], i) => {
      const k = 1 - clamp(p * 1.3 - i * 0.02);
      if (k <= 0) return;
      berry(c, bx + x * R + Math.cos(G.t * 0.5 + a) * 2, by + y * R, R * 0.12 * k, '#4b5d8f');
    });
    // pestle
    const px = G.pointer.down ? G.pointer.x : bx + R * 0.4, py = G.pointer.down ? G.pointer.y : by - R * 0.2;
    c.fillStyle = 'rgba(30,15,5,.3)'; c.beginPath(); c.ellipse(px + 14, py + 18, R * 0.24, R * 0.18, 0, 0, TAU); c.fill();
    const pg = c.createRadialGradient(px - R * 0.06, py - R * 0.08, 0, px, py, R * 0.26);
    pg.addColorStop(0, '#efe9dd'); pg.addColorStop(1, '#a39a8a');
    c.fillStyle = pg; c.beginPath(); c.arc(px, py, R * 0.24, 0, TAU); c.fill();
    if (!this.done && !G.pointer.down) {
      const k = (G.t % 1.6) / 1.6;
      c.strokeStyle = `rgba(255,245,220,${0.6 * (1 - k)})`; c.lineWidth = 2; c.setLineDash([4, 8]);
      c.beginPath(); c.arc(bx, by, R * 0.55, G.t, G.t + Math.PI * 1.5); c.stroke(); c.setLineDash([]);
    }
    UI.ring(c, this.sc.bx + this.sc.bw / 2 - 34, this.sc.by - this.sc.bh / 2 + 34, 16, p);
  }
}

// ── Roll: drag the pin up and down ──────────────────────────────────────────
class RollTask {
  constructor(sc, def) { this.sc = sc; this.def = def; this.q = 1; this.done = false; this.p = 0; this.py = sc.by; this.out = 'pastry'; this.outOpt = { rolled: 1 }; }
  resize() {}
  down(x, y) { this.last = y; }
  move(x, y) {
    if (!G.pointer.down || this.done) return;
    const dy = Math.abs(y - (this.last ?? y)); this.last = y; this.py = y;
    if (Math.abs(x - this.sc.bx) < this.sc.s * 1.4) {
      this.p = clamp(this.p + dy / (this.sc.s * 9));
      this.acc = (this.acc || 0) + dy;
      if (this.acc > 40) { this.acc = 0; Audio2.nz({ type: 'lowpass', f: 400, vol: 0.12, a: 0.03, d: 0.18 }); this.sc.fx.add({ kind: 'glow', x: x + rand(-60, 60), y: y + rand(-10, 10), vx: rand(-20, 20), vy: rand(-30, -5), life: 1.2, size: rand(6, 14), color: '#fffaf0', a: 0.6 }); }
    }
    if (this.p >= 1) { this.done = true; this.q = 1; this.sc.taskDone('Thin, even and ready'); }
  }
  up() { this.last = null; }
  update() {}
  draw(c) {
    const { bx, by, s } = this.sc;
    if (this.sc.d3) { UI.ring(c, this.sc.bx + this.sc.bw / 2 - 34, this.sc.by - this.sc.bh / 2 + 34, 16, this.p); return; }
    // flour
    c.fillStyle = 'rgba(255,252,245,.35)'; c.beginPath(); c.ellipse(bx, by, s * 1.3, s * 1.0, 0, 0, TAU); c.fill();
    c.fillStyle = 'rgba(40,20,5,.2)'; c.beginPath(); c.ellipse(bx + 6, by + 8, s * (0.55 + this.p * 0.6), s * (0.5 + this.p * 0.5), 0, 0, TAU); c.fill();
    c.save(); c.translate(bx, by); ING.pastry(c, s, { rolled: this.p }); c.restore();
    // rolling pin
    const y = G.pointer.down ? this.py : by + Math.sin(G.t * 2) * 8 - s * 0.6;
    const L = s * 1.8;
    c.fillStyle = 'rgba(30,15,5,.3)'; rrect(c, bx - L + 6, y + 6, L * 2, s * 0.2, s * 0.1); c.fill();
    const g = c.createLinearGradient(0, y - s * 0.1, 0, y + s * 0.1); g.addColorStop(0, '#e6c08a'); g.addColorStop(0.5, '#c4935a'); g.addColorStop(1, '#8e6030');
    c.fillStyle = g; rrect(c, bx - L * 0.7, y - s * 0.1, L * 1.4, s * 0.2, s * 0.08); c.fill();
    c.fillStyle = '#9a6a3a'; rrect(c, bx - L, y - s * 0.05, L * 0.32, s * 0.1, s * 0.05); c.fill(); rrect(c, bx + L * 0.68, y - s * 0.05, L * 0.32, s * 0.1, s * 0.05); c.fill();
    UI.ring(c, this.sc.bx + this.sc.bw / 2 - 34, this.sc.by - this.sc.bh / 2 + 34, 16, this.p);
  }
}
