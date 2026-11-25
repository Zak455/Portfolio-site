// Hearthwild — stage 3: cooking over the hearth.
'use strict';

class CookScene {
  constructor(recipe) {
    this.r = recipe; this.P = SKY[recipe.time];
    this.i = -1; this.step = null; this.heat = 0.2; this.bellows = false;
    this.flames = new Particles(); this.fx = new Particles(); this.steam = new Particles();
    this.contents = []; this.brown = 0; this.glaze = 0; this.liquid = 0; this.flipped = false;
    this.scores = []; this.toss = null; this.spoon = null;
    this.pies = recipe.vessel === 'stone' ? [{ fold: 0 }, { fold: 0 }, { fold: 0 }] : null;
  }
  enter() {
    Audio2.ambience('kitchen');
    UI.stage(3, 'Cook');
    UI.basket([]);
    UI.bellows(true, (v) => { this.bellows = v; if (v) Audio2.sfxPuff(); });
    this.d3 = !!(window.Cook3D && Cook3D.start(this));
    this.next();
  }
  exit() { if (this.d3) Cook3D.stop(); UI.bellows(false); UI.hint(''); UI.caption(''); UI.clearAction(); UI.meter(null); }

  resize() {
    const W = G.W, H = G.H, portrait = W < H;
    this.hw = portrait ? Math.min(W * 0.98, H * 0.62) : Math.min(W * 0.56, H * 0.88, 780);
    this.hx = W / 2; this.fy = portrait ? H * 0.74 : H * 0.8;
    this.fireY = this.fy - this.hw * 0.05;
    this.vx = this.hx; this.vy = this.fy - this.hw * (this.r.vessel === 'pot' ? 0.27 : 0.2);
    this.vr = this.hw * (this.r.vessel === 'pot' ? 0.2 : 0.22);
    if (this.r.vessel === 'stone') { this.vy = this.fy - this.hw * 0.1; this.vr = this.hw * 0.28; }
    this.bg = this.paintRoom();
  }

  paintRoom() {
    const W = G.W, H = G.H, P = this.P, R = rng(55);
    const cv = makeCanvas(W, H, Math.min(G.dpr, 1.5)), c = cv.getContext('2d');
    const night = this.r.time === 'dusk';
    // plaster wall
    const g = c.createLinearGradient(0, 0, 0, H); g.addColorStop(0, night ? '#3a2a24' : '#7a5a42'); g.addColorStop(1, night ? '#24170f' : '#4f3524');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    for (let i = 0; i < 90; i++) softCircle(c, R.r(0, W), R.r(0, H), R.r(40, 140), R() < 0.5 ? '#a07a5a' : '#3a2416', R.r(0.05, 0.14));
    // ceiling beam
    c.fillStyle = '#3a2416'; c.fillRect(0, 0, W, H * 0.06); c.fillStyle = 'rgba(255,220,180,.08)'; c.fillRect(0, H * 0.06 - 3, W, 3);
    // window
    const portrait = W < H;
    const ww = portrait ? W * 0.42 : Math.min(W * 0.18, 230), wh = ww * 1.2;
    const wx = portrait ? W * 0.06 : W * 0.06, wy = portrait ? H * 0.1 : H * 0.16;
    c.fillStyle = '#2a1a10'; rrect(c, wx - 10, wy - 10, ww + 20, wh + 20, 8); c.fill();
    const sg = c.createLinearGradient(0, wy, 0, wy + wh); sg.addColorStop(0, P.top); sg.addColorStop(0.6, P.mid); sg.addColorStop(1, P.hor);
    c.fillStyle = sg; c.fillRect(wx, wy, ww, wh);
    if (P.stars) for (let i = 0; i < 30; i++) { c.fillStyle = 'rgba(255,250,230,.8)'; c.fillRect(wx + R.r(0, ww), wy + R.r(0, wh * 0.5), 1.2, 1.2); }
    c.save(); c.beginPath(); c.rect(wx, wy, ww, wh); c.clip();
    softCircle(c, wx + ww * P.sunX, wy + wh * P.sunY * 0.8, ww * 0.5, P.sun, 0.7);
    c.fillStyle = mix(P.far, P.fog, 0.3); c.beginPath(); c.moveTo(wx, wy + wh * 0.72); for (let x = 0; x <= ww; x += 8) c.lineTo(wx + x, wy + wh * 0.7 - Math.sin(x * 0.05) * 8 - Math.sin(x * 0.13) * 4); c.lineTo(wx + ww, wy + wh); c.lineTo(wx, wy + wh); c.fill();
    c.fillStyle = mix(P.tree, P.fog, 0.2); for (let x = 0; x < ww; x += 9) { const h = R.r(14, 30); c.beginPath(); c.ellipse(wx + x, wy + wh * 0.8 - h * 0.3, 6, h * 0.5, 0, 0, TAU); c.fill(); }
    c.fillStyle = P.grass; c.fillRect(wx, wy + wh * 0.85, ww, wh * 0.15);
    c.restore();
    c.fillStyle = '#3a2416'; c.fillRect(wx + ww / 2 - 4, wy, 8, wh); c.fillRect(wx, wy + wh / 2 - 4, ww, 8);
    c.fillStyle = 'rgba(255,255,255,.12)'; c.beginPath(); c.moveTo(wx + 6, wy + 6); c.lineTo(wx + ww * 0.3, wy + 6); c.lineTo(wx + 6, wy + wh * 0.4); c.fill();
    c.fillStyle = '#5a3a22'; c.fillRect(wx - 16, wy + wh + 8, ww + 32, 10);
    // light spill
    c.save(); c.globalCompositeOperation = 'soft-light'; softCircle(c, wx + ww / 2, wy + wh, ww * 2, P.light, 0.7); c.restore();
    // pot plant on sill
    c.fillStyle = '#a4553a'; c.fillRect(wx + ww * 0.65, wy + wh - 18, 22, 20);
    c.save(); c.translate(wx + ww * 0.65 + 11, wy + wh - 18); for (let i = 0; i < 5; i++) { c.save(); c.rotate(-0.8 + i * 0.4); leaf(c, 0, 0, 26, 7, '#4f8a42', '#c8f0a0'); c.restore(); } c.restore();
    // shelf with jars on the right
    if (!portrait || true) {
      const sx = portrait ? W * 0.56 : W * 0.78, sw = portrait ? W * 0.4 : W * 0.18, sy = portrait ? H * 0.2 : H * 0.3;
      c.fillStyle = '#4a2e1a'; c.fillRect(sx, sy, sw, 8);
      c.fillStyle = 'rgba(0,0,0,.25)'; c.fillRect(sx, sy + 8, sw, 6);
      const cols = ['#d9a441', '#9b3a2e', '#e8e0c8', '#6a8a4a', '#c86a2a'];
      let x = sx + 6;
      while (x < sx + sw - 24) {
        const jw = R.r(16, 26), jh = R.r(24, 44);
        const jg = c.createLinearGradient(x, 0, x + jw, 0); jg.addColorStop(0, 'rgba(255,255,255,.08)'); jg.addColorStop(0.3, 'rgba(255,255,255,.35)'); jg.addColorStop(1, 'rgba(255,255,255,.05)');
        c.fillStyle = R.pick(cols); rrect(c, x, sy - jh * 0.7, jw, jh * 0.7, 3); c.fill();
        c.fillStyle = jg; rrect(c, x - 1, sy - jh, jw + 2, jh, 5); c.fill();
        c.fillStyle = '#b08a60'; c.fillRect(x + 2, sy - jh - 5, jw - 4, 6);
        x += jw + R.r(4, 10);
      }
      // hanging herbs
      for (let i = 0; i < 4; i++) {
        const hx = sx + sw * (0.15 + i * 0.22), hy = sy + 14;
        c.strokeStyle = '#8a7a5a'; c.lineWidth = 1; c.beginPath(); c.moveTo(hx, hy); c.lineTo(hx, hy + 18); c.stroke();
        c.save(); c.translate(hx, hy + 18); c.rotate(Math.PI);
        for (let j = 0; j < 5; j++) { c.save(); c.rotate(-0.4 + j * 0.2); leaf(c, 0, 0, 36, 6, R.pick(['#6a7a4a', '#7a8a50', '#8a7a4a']), '#c8c890'); c.restore(); }
        c.restore();
      }
    }
    // stone floor
    const fg = c.createLinearGradient(0, this.fy, 0, H); fg.addColorStop(0, '#5a4a3e'); fg.addColorStop(1, '#2e241c');
    c.fillStyle = fg; c.fillRect(0, this.fy, W, H - this.fy);
    for (let y = this.fy; y < H; y += 34) for (let x = (y / 34) % 2 ? -30 : 0; x < W; x += 70) { c.strokeStyle = 'rgba(0,0,0,.25)'; c.lineWidth = 1.5; rrect(c, x + 2, y + 2, 66, 30, 6); c.stroke(); }
    // hearth arch
    const hw = this.hw, hx = this.hx, fy = this.fy, top = fy - hw * 0.62;
    c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(hx, fy + 6, hw * 0.6, 16, 0, 0, TAU); c.fill();
    const stones = (x0, y0, w, h) => {
      for (let y = y0; y < y0 + h; y += 26) for (let x = x0 - R.r(0, 24), nw = 0; x < x0 + w; x += nw + 4) {
        nw = R.r(26, 52);
        const sw = Math.min(nw, x0 + w - x), sh = 22;
        if (sw < 8) continue;
        const sgc = c.createLinearGradient(x, y, x, y + sh); const base = R.pick(['#8a7a6a', '#7a6c5e', '#968676', '#6e6256']);
        sgc.addColorStop(0, mix(base, '#ffffff', 0.12)); sgc.addColorStop(1, mix(base, '#000000', 0.2));
        c.fillStyle = sgc; rrect(c, Math.max(x0, x) + 1, y + 1, sw - 2, sh, 6); c.fill();
      }
    };
    stones(hx - hw * 0.55, top, hw * 0.16, fy - top);
    stones(hx + hw * 0.39, top, hw * 0.16, fy - top);
    stones(hx - hw * 0.55, top - hw * 0.08, hw * 1.1, hw * 0.1);
    // firebox
    const ig = c.createLinearGradient(0, top, 0, fy); ig.addColorStop(0, '#120a06'); ig.addColorStop(1, '#2a160c');
    c.fillStyle = ig; c.beginPath(); c.moveTo(hx - hw * 0.39, fy); c.lineTo(hx - hw * 0.39, top + hw * 0.1); c.quadraticCurveTo(hx, top - hw * 0.02, hx + hw * 0.39, top + hw * 0.1); c.lineTo(hx + hw * 0.39, fy); c.fill();
    // back bricks faint
    for (let y = top + 30; y < fy; y += 18) for (let x = hx - hw * 0.37 + ((y / 18) % 2) * 14; x < hx + hw * 0.37; x += 28) { c.strokeStyle = 'rgba(120,60,30,.18)'; c.strokeRect(x, y, 26, 16); }
    // mantel beam
    c.fillStyle = '#4a2c18'; rrect(c, hx - hw * 0.62, top - hw * 0.13, hw * 1.24, hw * 0.06, 4); c.fill();
    c.fillStyle = 'rgba(255,220,170,.15)'; c.fillRect(hx - hw * 0.62, top - hw * 0.13, hw * 1.24, 2);
    // mantel props: candles and a jar
    const my = top - hw * 0.13;
    for (const [dx, h] of [[-0.5, 34], [-0.44, 24]]) { c.fillStyle = '#efe4cc'; c.fillRect(hx + hw * dx, my - h, 9, h); }
    this.candles = [[hx - hw * 0.5 + 4.5, my - 34], [hx - hw * 0.44 + 4.5, my - 24]];
    c.fillStyle = '#b87a3a'; c.beginPath(); c.arc(hx + hw * 0.45, my - 16, 16, 0, TAU); c.fill(); c.fillStyle = '#8a5428'; c.fillRect(hx + hw * 0.45 - 10, my - 36, 20, 8);
    // grate / trivet
    c.strokeStyle = '#1a1210'; c.lineWidth = 4;
    if (this.r.vessel !== 'stone') { c.beginPath(); c.moveTo(hx - hw * 0.2, fy - hw * 0.12); c.lineTo(hx + hw * 0.2, fy - hw * 0.12); c.moveTo(hx - hw * 0.17, fy - hw * 0.12); c.lineTo(hx - hw * 0.2, fy); c.moveTo(hx + hw * 0.17, fy - hw * 0.12); c.lineTo(hx + hw * 0.2, fy); c.stroke(); }
    return cv;
  }

  // ── Steps ────────────────────────────────────────────────────────────────
  next() {
    if (this.step) this.scores.push(this.step.q ?? 1);
    this.i++;
    const def = this.r.cook[this.i];
    if (!def) return;
    this.step = Object.assign({ q: 1, p: 0, t: 0 }, { def });
    UI.top(this.r.name, `Cook · ${this.i + 1} of ${this.r.cook.length}`);
    UI.caption(def.title);
    UI.hint(def.hint || (def.type === 'add' ? 'Drag it into the ' + this.vName() + ', or tap it.' : ''));
    UI.clearAction(); UI.meter(null);
    if (def.type === 'add') this.step.tray = { x: this.trayX(), y: this.trayY(), drag: false, s: Math.min(46, this.hw * 0.08) };
    if (def.type === 'finish') {
      this.step.m = Math.max(0.12, this.brown * 0.6);
      UI.action('Serve', () => this.serve());
    }
    if (def.type === 'simmer') this.step.catchT = rand(2, 3);
  }
  vName() { return { skillet: 'pan', pot: 'pot', stone: 'pastry' }[this.r.vessel]; }
  trayX() { return G.W < G.H ? G.W * 0.2 : this.hx - this.hw * 0.62; }
  trayY() { return G.W < G.H ? this.fy + (G.H - this.fy) * 0.45 : this.fy - this.hw * 0.05; }
  async stepDone(q = 1) {
    if (this.step.finished) return;
    this.step.finished = true; this.step.q = q;
    Audio2.tone({ f: 1046, vol: 0.06, d: 0.4, verb: 0.6 });
    await Tw.wait(0.45);
    this.next();
  }

  inVessel(x, y, pad = 1) {
    const dx = (x - this.vx) / (this.vr * 1.15 * pad), dy = (y - this.vy) / (this.vr * 0.55 * pad + 20);
    return dx * dx + dy * dy < 1.2;
  }

  addContents(def) {
    const n = { butter: 1, troutFillet: 1, pheasantBreast: 2, rabbitPiece: 4, carrotCoin: 7, chanterelleSlice: 7, garlicChop: 3, sorrelChop: 3, thymeLeaves: 2, blackberry: 6, juniperCrushed: 2, venisonDice: 9, porciniSlice: 6, rosemaryChop: 3 }[def.ing] || 3;
    const big = { butter: 0.32, troutFillet: 0.62, pheasantBreast: 0.36, rabbitPiece: 0.2, carrotCoin: 0.1, chanterelleSlice: 0.16, garlicChop: 0.3, sorrelChop: 0.3, thymeLeaves: 0.3, blackberry: 0.09, juniperCrushed: 0.3, venisonDice: 0.09, porciniSlice: 0.13, rosemaryChop: 0.25 }[def.ing] || 0.2;
    for (let i = 0; i < n; i++) {
      let u, v;
      if (this.pies) { const pi = i % 3; u = (pi - 1) * 0.62 + rand(-0.1, 0.1); v = rand(-0.15, 0.15); }
      else if (n === 1) { u = 0; v = 0; }
      else if (n === 2) { u = (i - 0.5) * 0.7; v = rand(-0.1, 0.1); }
      else { const a = rand(0, TAU), d = Math.sqrt(rand(0, 1)) * 0.65; u = Math.cos(a) * d; v = Math.sin(a) * d; }
      this.contents.push({ ing: def.ing, opt: Object.assign({}, def.opt || {}), u, v, rot: rand(-0.6, 0.6), s: big, y: -this.vr * 1.2 - i * 10, vy: 0, t: 0, melt: 0, pie: this.pies ? i % 3 : -1 });
    }
    if (this.heat > 0.4 && this.r.vessel === 'skillet') { Audio2.sfxSizzle(1.4); Audio2.sfxSizzle(1); }
    else if (this.liquid > 0.3) Audio2.sfxPlop();
    else Audio2.sfxPlop();
    for (let i = 0; i < 10; i++) this.steam.add({ kind: 'glow', x: this.vx + rand(-this.vr, this.vr) * 0.5, y: this.vy, vx: rand(-10, 10), vy: rand(-60, -30), life: rand(1.5, 2.5), size: rand(18, 34), color: '#ffffff', a: 0.16, fadeIn: true });
  }

  // ── Input ────────────────────────────────────────────────────────────────
  down(x, y) {
    const st = this.step; if (!st || st.finished) return;
    const T = st.def.type;
    this.downAt = { x, y, t: G.t };
    if (T === 'add') {
      const tr = st.tray;
      if (dist(x, y, tr.x, tr.y) < tr.s * 1.6) { tr.drag = true; tr.dx = x; tr.dy = y; Audio2.sfxUI(); }
      else if (this.inVessel(x, y)) { this.dropAdd(); }
    }
    if (T === 'stir' || T === 'simmer') { this.spoon = { x, y }; this.lastA = Math.atan2(y - this.vy, x - this.vx); }
    if (T === 'baste' && this.inVessel(x, y, 1.3)) {
      st.p++; this.spoon = { x, y, baste: 1 }; Tw.to(this.spoon, { baste: 0 }, 0.4);
      Audio2.sfxSizzle(1.2);
      for (let i = 0; i < 10; i++) this.fx.add({ kind: 'glow', x: x + rand(-20, 20), y: y + rand(-10, 10), vx: rand(-30, 30), vy: rand(-80, -20), g: 160, life: 0.7, size: rand(4, 8), color: '#ffd27a', add: true, a: 0.7 });
      this.brown = Math.min(1, this.brown + 0.03);
      if (st.p >= st.def.n) this.stepDone(1);
    }
    if (T === 'fold' && this.pies) {
      const i = this.pieAt(x, y);
      if (i >= 0 && this.pies[i].fold === 0) {
        Tw.to(this.pies[i], { fold: 1 }, 0.5, easeBack); Audio2.sfxLid(); Audio2.tone({ f: 600 + i * 120, vol: 0.06, d: 0.3, verb: 0.4 });
        st.p++; if (st.p >= st.def.n) this.stepDone(1);
      }
    }
    if (T === 'pour' && this.inVessel(x, y, 1.6)) st.pouring = true;
  }
  move(x, y) {
    const st = this.step; if (!st || st.finished) return;
    const T = st.def.type;
    if (T === 'add' && st.tray.drag) { st.tray.dx = x; st.tray.dy = y; }
    if ((T === 'stir' || T === 'simmer') && G.pointer.down) {
      this.spoon = { x, y };
      const a = Math.atan2(y - this.vy, x - this.vx);
      if (this.lastA !== undefined && this.inVessel(x, y, 1.3)) {
        let da = a - this.lastA; if (da > Math.PI) da -= TAU; if (da < -Math.PI) da += TAU;
        if (Math.abs(da) < 1) {
          this.stirAngle = (this.stirAngle || 0) + da;
          st.turns = (st.turns || 0) + Math.abs(da) / TAU;
          this.contents.forEach((q) => { const r = Math.hypot(q.u, q.v), aa = Math.atan2(q.v, q.u) + da * 0.6; q.u = Math.cos(aa) * r; q.v = Math.sin(aa) * r; q.rot += da * 0.5; });
          if (Math.random() < 0.15) Audio2.nz({ f: rand(800, 1600), q: 1, vol: 0.05, d: 0.12 });
          if (st.def.glaze) this.glaze = clamp(st.turns / st.def.turns);
          if (T === 'stir' && st.turns >= st.def.turns) this.stepDone(1);
          if (T === 'simmer' && st.catching && st.turns > st.catchTurns + 0.8) { st.catching = false; st.catchT = rand(2.5, 4); UI.hint('Low and slow. Stir if it starts to catch.'); }
        }
      }
      this.lastA = a;
    }
  }
  up(x, y) {
    const st = this.step; if (!st || st.finished) return;
    const T = st.def.type;
    if (T === 'add' && st.tray.drag) {
      st.tray.drag = false;
      if (this.inVessel(x, y, 1.4) || dist(x, y, st.tray.x, st.tray.y) < 12) this.dropAdd();
    }
    if (T === 'toss' && this.downAt) {
      const dy = y - this.downAt.y, dt = G.t - this.downAt.t;
      if (dy < -40 && dt < 0.7 && Math.abs(x - this.vx) < this.vr * 2) this.doToss();
      else if (G.pointer.moved < 10 && this.inVessel(x, y, 1.5)) this.doToss();
    }
    if (T === 'pour') st.pouring = false;
    this.spoon = null; this.lastA = undefined;
  }
  dropAdd() {
    const st = this.step;
    if (st.added) return;
    st.added = true;
    this.addContents(st.def);
    this.stepDone(1);
  }
  doToss() {
    const st = this.step;
    if (this.toss) return;
    this.toss = { t: 0 };
    Audio2.sfxWhoosh();
    Tw.to(this.toss, { t: 1 }, 0.75, (t) => t).then(() => {
      this.toss = null;
      if (st.def.flip) { this.flipped = !this.flipped; this.contents.forEach((q) => { if (q.ing === 'troutFillet') q.opt.skin = !q.opt.skin; }); }
      this.contents.forEach((q) => { q.u = clamp(q.u + rand(-0.15, 0.15), -0.7, 0.7); q.v = clamp(q.v + rand(-0.15, 0.15), -0.6, 0.6); q.rot += rand(-1, 1); });
      Audio2.sfxSizzle(1.3);
      for (let i = 0; i < 8; i++) this.fx.add({ kind: 'glow', x: this.vx + rand(-40, 40), y: this.vy, vx: rand(-60, 60), vy: rand(-120, -40), g: 300, life: 0.6, size: rand(3, 6), color: '#ffcf70', add: true });
      st.p++;
      if (st.p >= st.def.n) this.stepDone(1);
    });
  }
  pieAt(x, y) {
    for (let i = 0; i < 3; i++) { const px = this.vx + (i - 1) * this.vr * 0.62, py = this.vy; if (dist(x, y, px, py) < this.vr * 0.32) return i; }
    return -1;
  }
  serve() {
    const st = this.step;
    if (!st || st.def.type !== 'finish' || st.finished) return;
    const m = st.m, q = clamp(1 - Math.abs(m - 0.71) / 0.32, 0.25, 1);
    st.finished = true; st.q = q;
    this.scores.push(q);
    UI.clearAction(); UI.meter(null);
    Audio2.sfxLid(); Audio2.chime(0, 0);
    const cookQ = this.scores.reduce((a, b) => a + b, 0) / this.scores.length;
    game.cookQ = cookQ; game.finishQ = q; game.brown = this.brown;
    UI.caption(m > 0.88 ? 'A touch charred, but rustic' : m < 0.55 ? 'A little pale, but tender' : 'Perfectly golden');
    setTimeout(() => game.toPlate(this.r), 1300);
  }

  // ── Update ───────────────────────────────────────────────────────────────
  update(dt) {
    // fire
    const target = this.bellows ? 1 : 0.18;
    this.heat += (target - this.heat) * dt * (this.bellows ? 0.9 : 0.28);
    this.heat = clamp(this.heat, 0.05, 1);
    if (this.bellows && Math.random() < dt * 3) Audio2.sfxPuff();
    if (Audio2.fireGain && Audio2.ctx) Audio2.fireGain.gain.setTargetAtTime(0.25 + this.heat * 0.6, Audio2.ctx.currentTime, 0.3);
    this.spawnFire(dt);
    this.flames.update(dt); this.fx.update(dt); this.steam.update(dt);

    // contents settle into the vessel
    for (const q of this.contents) {
      q.t += dt;
      if (q.y < 0) { q.vy += 1800 * dt; q.y = Math.min(0, q.y + q.vy * dt); if (q.y === 0) { q.vy = 0; this.fx.burst(this.vx + q.u * this.vr, this.vy + q.v * this.vr * 0.42, 4, (i, x, y) => ({ x, y, vx: rand(-60, 60), vy: rand(-100, -40), g: 500, life: 0.5, size: 1.5, color: '#ffe2a0' })); } }
      if (q.ing === 'butter' && this.heat > 0.3) q.melt = Math.min(1, q.melt + dt * 0.25 * this.heat);
    }
    const cooking = this.contents.length > 0;
    // browning follows heat
    const st = this.step;
    if (cooking && st && st.def.type !== 'finish') this.brown = clamp(this.brown + dt * 0.012 * Math.max(0, this.heat - 0.3));
    // sizzle / bubble ambience
    if (cooking && this.heat > 0.35 && Math.random() < dt * 4 * this.heat) {
      if (this.r.vessel === 'pot' && this.liquid > 0.2) Audio2.sfxBubble(); else if (this.r.vessel === 'skillet') Audio2.sfxSizzle(0.3 + this.heat * 0.5);
    }
    if ((cooking || this.liquid > 0) && Math.random() < dt * (2 + this.heat * 6))
      this.steam.add({ kind: 'glow', x: this.vx + rand(-this.vr, this.vr) * 0.6, y: this.vy - 10, vx: rand(-6, 6), vy: rand(-50, -25), life: rand(2, 3.5), size: rand(16, 30), color: '#fff8ee', a: 0.08 + this.heat * 0.08, fadeIn: true, flutter: 0.6, seed: rand(0, 9) });

    if (!st || st.finished) return;
    const T = st.def.type;
    if (T === 'heat' || T === 'simmer') {
      const [lo, hi] = st.def.zone, inZone = this.heat >= lo && this.heat <= hi;
      if (inZone) st.p += dt; st.t += dt;
      if (T === 'simmer' && this.liquid > 0.2 && this.heat > 0.2 && Math.random() < dt * 6) Audio2.sfxBubble();
      if (T === 'simmer') {
        if (!st.catching) { st.catchT -= dt; if (st.catchT <= 0) { st.catching = true; st.catchTurns = st.turns || 0; st.catchAge = 0; UI.hint('It is catching on the bottom. Give it a stir!'); Audio2.sfxSizzle(0.6); } }
        else { st.catchAge += dt; if (Math.random() < dt * 6) this.steam.add({ kind: 'glow', x: this.vx + rand(-20, 20), y: this.vy, vx: rand(-5, 5), vy: rand(-40, -20), life: 1.6, size: rand(10, 20), color: '#6a5a4a', a: 0.25 }); }
      }
      UI.meter({ lo, hi, v: this.heat, p: clamp(st.p / st.def.secs) });
      if (st.p >= st.def.secs) {
        const eff = st.def.secs / Math.max(st.t, st.def.secs);
        let q = clamp(0.55 + eff * 0.45);
        if (T === 'simmer') q -= (st.catchPenalty || 0);
        UI.meter(null);
        this.stepDone(clamp(q, 0.4, 1));
      }
      if (T === 'simmer' && st.catching && st.catchAge > 3) { st.catchPenalty = (st.catchPenalty || 0) + 0.08; st.catchAge = 0; this.brown = Math.min(1, this.brown + 0.08); }
    }
    if (T === 'pour' && st.pouring) {
      this.liquid = Math.min(1, this.liquid + dt * 0.5);
      if (Math.random() < dt * 20) Audio2.nz({ type: 'lowpass', f: rand(800, 1600), vol: 0.06, d: 0.1 });
      if (this.liquid >= 1) this.stepDone(1);
    }
    if (T === 'finish') {
      st.m = clamp(st.m + dt * st.def.speed * (0.4 + this.heat * 0.9));
      this.brown = Math.max(this.brown, st.m);
      UI.meter({ finish: true, v: st.m });
      if (st.m >= 1) this.serve();
    }
  }

  spawnFire(dt) {
    const h = this.heat, fx = this.hx, fy = this.fireY, w = this.hw * 0.16;
    const n = dt * (30 + h * 110);
    for (let i = 0; i < n; i++) {
      if (Math.random() > n - i) break;
      const x = fx + rand(-w, w) * (0.4 + h * 0.6);
      this.flames.add({ kind: 'flame', x, y: fy - rand(0, 8), vx: (fx - x) * 0.6 + rand(-10, 10), vy: -rand(60, 120) * (0.6 + h * 1.1), life: rand(0.35, 0.8) * (0.6 + h * 0.8), size: rand(10, 20) * (0.6 + h * 0.9) * (this.hw / 700), drag: 0.99, add: true, a: 0.9,
        draw: (c, q, k) => {
          const s = q.size * (0.3 + k * 0.7);
          const g = c.createRadialGradient(0, 0, 0, 0, 0, s);
          g.addColorStop(0, k > 0.6 ? 'rgba(255,250,210,.95)' : 'rgba(255,210,110,.9)');
          g.addColorStop(0.4, k > 0.4 ? 'rgba(255,150,40,.7)' : 'rgba(230,90,30,.5)');
          g.addColorStop(1, 'rgba(160,30,10,0)');
          c.fillStyle = g; c.beginPath(); c.ellipse(0, -s * 0.4, s * 0.62, s * 1.3, 0, 0, TAU); c.fill();
        } });
    }
    if (Math.random() < dt * (1 + h * 10)) this.flames.add({ kind: 'spark', x: fx + rand(-w, w) * 0.6, y: fy - 10, vx: rand(-40, 40), vy: -rand(120, 260) * (0.5 + h), g: -20, life: rand(0.8, 1.8), size: 1.6, color: '#ffc870', add: true, flutter: 3, seed: rand(0, 9) });
  }

  // ── Draw ─────────────────────────────────────────────────────────────────
  draw(c) {
    const W = G.W, H = G.H, h = this.heat;
    if (this.d3) {
      c.clearRect(0, 0, W, H);
      this.steam.draw(c); this.fx.draw(c);
      const vg = c.createRadialGradient(this.hx, this.vy, Math.min(W, H) * 0.35, this.hx, this.vy, Math.max(W, H) * 0.85);
      vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(10,4,0,.5)'); c.fillStyle = vg; c.fillRect(0, 0, W, H);
      this.drawTray(c, true); this.drawHeatGauge(c);
      if (this.step && !this.step.finished) this.drawPrompt(c);
      return;
    }
    c.drawImage(this.bg, 0, 0, W, H);
    // glow inside the hearth
    c.save(); c.globalCompositeOperation = 'lighter';
    const fl = 0.85 + 0.15 * Math.sin(G.t * 13) * Math.sin(G.t * 7.3);
    softCircle(c, this.hx, this.fireY, this.hw * (0.35 + h * 0.3), '#ff8a30', (0.18 + h * 0.3) * fl);
    c.restore();
    this.drawLogs(c);
    this.flames.draw(c);
    this.drawVessel(c);
    this.steam.draw(c);
    this.fx.draw(c);
    // candle flames
    if (this.candles) for (const [x, y] of this.candles) {
      c.save(); c.globalCompositeOperation = 'lighter';
      softCircle(c, x, y - 6, 30, '#ffb85a', 0.25 + 0.05 * Math.sin(G.t * 9 + x));
      c.fillStyle = '#ffe9a8'; c.beginPath(); c.ellipse(x + Math.sin(G.t * 7 + x) * 0.8, y - 7, 2.4, 6, 0, 0, TAU); c.fill();
      c.restore();
    }
    // firelight wash over the room
    c.save(); c.globalCompositeOperation = 'soft-light';
    const g = c.createRadialGradient(this.hx, this.fireY, 0, this.hx, this.fireY, Math.max(W, H));
    g.addColorStop(0, `rgba(255,150,60,${(0.35 + h * 0.4) * fl})`); g.addColorStop(1, 'rgba(255,120,40,0)');
    c.fillStyle = g; c.fillRect(0, 0, W, H);
    c.restore();
    const vg = c.createRadialGradient(this.hx, this.vy, Math.min(W, H) * 0.3, this.hx, this.vy, Math.max(W, H) * 0.85);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, 'rgba(10,4,0,.65)');
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
    this.drawTray(c);
    this.drawHeatGauge(c);
    if (this.spoon && this.step && (this.step.def.type === 'stir' || this.step.def.type === 'simmer' || this.step.def.type === 'baste')) this.drawSpoon(c);
    if (this.step && !this.step.finished) this.drawPrompt(c);
  }

  drawLogs(c) {
    const x = this.hx, y = this.fy - 6, w = this.hw * 0.2, h = this.heat;
    for (const [rot, dx] of [[-0.18, -0.2], [0.18, 0.2], [0.02, 0]]) {
      c.save(); c.translate(x + dx * w * 0.6, y - (dx === 0 ? 12 : 0)); c.rotate(rot);
      const g = c.createLinearGradient(0, -12, 0, 12); g.addColorStop(0, '#6a4428'); g.addColorStop(1, '#2a160a');
      c.fillStyle = g; rrect(c, -w * 0.6, -11, w * 1.2, 22, 10); c.fill();
      c.strokeStyle = 'rgba(0,0,0,.3)'; c.lineWidth = 1; for (let i = 0; i < 5; i++) { c.beginPath(); c.moveTo(-w * 0.5 + i * w * 0.22, -10); c.lineTo(-w * 0.45 + i * w * 0.22, 10); c.stroke(); }
      // glowing embers on the log
      c.globalCompositeOperation = 'lighter';
      const eg = c.createLinearGradient(0, -11, 0, 11); eg.addColorStop(0, `rgba(255,120,30,${0.2 + h * 0.5})`); eg.addColorStop(1, 'rgba(255,60,10,0)');
      c.fillStyle = eg; rrect(c, -w * 0.45, -11, w * 0.9, 12, 6); c.fill();
      c.restore();
    }
    // ember bed
    c.save(); c.globalCompositeOperation = 'lighter';
    for (let i = 0; i < 14; i++) { const ex = x + Math.sin(i * 7.3) * w * 0.7, ey = y + 4 + Math.cos(i * 3.1) * 3; softCircle(c, ex, ey, 10, '#ff6a20', (0.3 + 0.3 * Math.sin(G.t * 3 + i)) * (0.4 + h)); }
    c.restore();
  }

  drawVessel(c) {
    const { vx, vy, vr } = this, V = this.r.vessel;
    let tossY = 0, tossRot = 0, contentsLift = 0;
    if (this.toss) { const t = this.toss.t; tossY = -Math.sin(t * Math.PI) * 10; contentsLift = Math.sin(t * Math.PI) * vr * 1.1; tossRot = Math.sin(t * Math.PI) * 0.12; }
    c.save(); c.translate(vx, vy + tossY); c.rotate(tossRot);
    if (V === 'skillet') {
      // handle
      const hg = c.createLinearGradient(0, -8, 0, 8); hg.addColorStop(0, '#3a3a3e'); hg.addColorStop(1, '#151518');
      c.fillStyle = hg; rrect(c, vr * 0.9, -9, vr * 1.05, 18, 8); c.fill();
      c.fillStyle = '#6a4428'; rrect(c, vr * 1.45, -8, vr * 0.55, 16, 7); c.fill();
      // body
      c.fillStyle = '#121214'; c.beginPath(); c.ellipse(0, 10, vr * 1.04, vr * 0.47, 0, 0, TAU); c.fill();
      const rg = c.createLinearGradient(0, -vr * 0.45, 0, vr * 0.45); rg.addColorStop(0, '#5a5a62'); rg.addColorStop(1, '#1a1a1e');
      c.fillStyle = rg; c.beginPath(); c.ellipse(0, 0, vr, vr * 0.44, 0, 0, TAU); c.fill();
      const ig = c.createRadialGradient(-vr * 0.2, -vr * 0.1, 0, 0, 0, vr); ig.addColorStop(0, '#3a3a40'); ig.addColorStop(1, '#141416');
      c.fillStyle = ig; c.beginPath(); c.ellipse(0, 2, vr * 0.9, vr * 0.38, 0, 0, TAU); c.fill();
      // heat glow on the base
      c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,110,40,${this.heat * 0.15})`; c.beginPath(); c.ellipse(0, 6, vr * 0.8, vr * 0.3, 0, 0, TAU); c.fill(); c.restore();
      this.drawContents(c, vr * 0.9, vr * 0.38, contentsLift);
      c.strokeStyle = 'rgba(255,255,255,.18)'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(0, 0, vr * 0.98, vr * 0.43, 0, Math.PI * 1.1, Math.PI * 1.7); c.stroke();
    } else if (V === 'pot') {
      // bail handle
      c.strokeStyle = '#1a1a1c'; c.lineWidth = 4; c.beginPath(); c.ellipse(0, -vr * 0.1, vr * 1.02, vr * 1.0, 0, Math.PI * 1.08, Math.PI * 1.92); c.stroke();
      const bg = c.createRadialGradient(-vr * 0.4, vr * 0.1, 0, 0, vr * 0.3, vr * 1.2); bg.addColorStop(0, '#4a4a50'); bg.addColorStop(1, '#0e0e10');
      c.fillStyle = bg; c.beginPath(); c.moveTo(-vr, 0); c.bezierCurveTo(-vr * 1.05, vr * 0.9, vr * 1.05, vr * 0.9, vr, 0); c.closePath(); c.fill();
      c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,110,40,${this.heat * 0.18})`; c.beginPath(); c.ellipse(0, vr * 0.6, vr * 0.7, vr * 0.12, 0, 0, TAU); c.fill(); c.restore();
      c.fillStyle = '#26262a'; c.beginPath(); c.ellipse(0, 0, vr, vr * 0.3, 0, 0, TAU); c.fill();
      c.fillStyle = '#0c0c0e'; c.beginPath(); c.ellipse(0, 2, vr * 0.9, vr * 0.25, 0, 0, TAU); c.fill();
      // stew liquid
      if (this.liquid > 0 || this.contents.length) {
        const L = this.liquid, b = this.brown;
        c.save(); c.beginPath(); c.ellipse(0, 2, vr * 0.9, vr * 0.25, 0, 0, TAU); c.clip();
        const lg = c.createRadialGradient(-vr * 0.2, -vr * 0.05, 0, 0, 0, vr);
        lg.addColorStop(0, mix(mix('#c9a46a', '#9a5a2a', b), '#3a2a20', 1 - L * 0.9)); lg.addColorStop(1, mix(mix('#7a4a22', '#4a2410', b), '#1a1210', 1 - L * 0.9));
        c.fillStyle = lg; c.fillRect(-vr, -vr, vr * 2, vr * 2);
        if (L > 0.2 && this.heat > 0.2) for (let i = 0; i < 6; i++) { const ph = (G.t * (0.6 + this.heat) + i * 0.37) % 1; c.strokeStyle = `rgba(255,230,190,${(1 - ph) * 0.35})`; c.lineWidth = 1; c.beginPath(); c.ellipse(Math.sin(i * 3.1) * vr * 0.5, Math.cos(i * 2.3) * vr * 0.1, 2 + ph * 8, 1 + ph * 3, 0, 0, TAU); c.stroke(); }
        this.drawContents(c, vr * 0.85, vr * 0.22, contentsLift, true);
        c.restore();
      }
      c.strokeStyle = 'rgba(255,255,255,.15)'; c.lineWidth = 1.5; c.beginPath(); c.ellipse(0, 0, vr, vr * 0.3, 0, Math.PI * 1.1, Math.PI * 1.7); c.stroke();
      if (this.step && this.step.def.type === 'pour' && this.step.pouring) this.drawJug(c, vr);
    } else {
      // hearthstone slab with three pastries
      const sg = c.createLinearGradient(0, -vr * 0.3, 0, vr * 0.3); sg.addColorStop(0, '#8a7c6e'); sg.addColorStop(1, '#4a4038');
      c.fillStyle = 'rgba(0,0,0,.35)'; c.beginPath(); c.ellipse(4, vr * 0.12, vr * 1.1, vr * 0.3, 0, 0, TAU); c.fill();
      c.fillStyle = sg; c.beginPath(); c.ellipse(0, 0, vr * 1.08, vr * 0.28, 0, 0, TAU); c.fill();
      c.save(); c.globalCompositeOperation = 'lighter'; c.fillStyle = `rgba(255,110,40,${this.heat * 0.2})`; c.beginPath(); c.ellipse(0, 0, vr, vr * 0.24, 0, 0, TAU); c.fill(); c.restore();
      for (let i = 0; i < 3; i++) {
        const px = (i - 1) * vr * 0.62, pie = this.pies[i];
        c.save(); c.translate(px, -vr * 0.06);
        if (pie.fold < 1) {
          c.save(); c.scale(1, 0.55); ING.pastry(c, vr * 0.42, { rolled: 0.7, cook: this.brown * 0.9 }); c.restore();
          this.contents.filter((q) => q.pie === i).forEach((q) => { if (q.y < 0) return; drawSprite(c, q.ing, q.u * vr * 0.1 - (i - 1) * 0, q.v * vr * 0.1, vr * q.s * 0.6, this.cookOpt(q), q.rot, 1 - pie.fold); });
        }
        if (pie.fold > 0) { c.save(); c.scale(pie.fold, pie.fold); ING.handPie(c, vr * 0.3, { cook: this.brown }); c.restore(); }
        c.restore();
        // falling pieces
        this.contents.filter((q) => q.pie === i && q.y < 0).forEach((q) => drawSprite(c, q.ing, px, q.y, vr * q.s * 0.6, this.cookOpt(q), q.rot));
      }
    }
    c.restore();
  }
  cookOpt(q) {
    const o = Object.assign({}, q.opt);
    const k = Math.round(Math.min(0.9, this.brown * (q.ing === 'butter' ? 0 : 1)) * 10) / 10;
    if (q.ing === 'butter') o.melt = Math.round(q.melt * 10) / 10;
    else o.cook = k;
    if (q.ing === 'pheasantBreast') o.glaze = Math.round(this.glaze * 5) / 5;
    return o;
  }
  drawContents(c, rx, ry, lift, stew) {
    for (const q of this.contents) {
      const x = q.u * rx, y = q.v * ry + q.y - lift * (0.6 + 0.4 * Math.sin(q.u * 4)) + (stew ? Math.sin(G.t * 2 + q.u * 5) * 2 : 0);
      const flipping = this.toss ? Math.cos(this.toss.t * Math.PI * (this.step && this.step.def.flip ? 1 : 2)) : 1;
      c.save(); c.translate(x, y); c.scale(1, 0.62 * (this.toss ? Math.abs(flipping) * 0.8 + 0.2 : 1));
      const s = this.vr * q.s;
      drawSprite(c, q.ing, 0, 0, s, this.cookOpt(q), q.rot);
      c.restore();
    }
    if (this.glaze > 0) { c.save(); c.globalAlpha = this.glaze * 0.5; c.fillStyle = '#5a1838'; c.beginPath(); c.ellipse(0, 4, rx * 0.8, ry * 0.7, 0, 0, TAU); c.fill(); c.restore(); }
    // butter foam
    const b = this.contents.find((q) => q.ing === 'butter');
    if (b && b.melt > 0.5 && this.heat > 0.35) for (let i = 0; i < 12; i++) { const a = i * 2.4 + G.t, d = (i % 4) / 4; c.fillStyle = 'rgba(255,240,190,.5)'; c.beginPath(); c.arc(Math.cos(a) * rx * 0.7 * d, Math.sin(a) * ry * 0.7 * d, 1.5 + (Math.sin(G.t * 9 + i) + 1) * 1.2, 0, TAU); c.fill(); }
  }
  drawJug(c, vr) {
    c.save(); c.translate(vr * 0.5, -vr * 0.9); c.rotate(-0.9);
    c.fillStyle = '#c9b89a'; rrect(c, -18, -30, 36, 50, 10); c.fill();
    c.fillStyle = '#9a8a6a'; c.fillRect(-18, -12, 36, 6);
    c.restore();
    c.strokeStyle = 'rgba(200,160,100,.8)'; c.lineWidth = 5; c.beginPath(); c.moveTo(vr * 0.2, -vr * 0.75); c.quadraticCurveTo(vr * 0.05, -vr * 0.4, 0, 0); c.stroke();
  }
  drawTray(c, guideOnly) {
    const st = this.step;
    if (!st || st.def.type !== 'add' || st.added) return;
    const tr = st.tray;
    const x = tr.drag ? tr.dx : tr.x, y = tr.drag ? tr.dy : tr.y + Math.sin(G.t * 2.5) * 4;
    if (!guideOnly) {
    c.save(); c.globalCompositeOperation = 'lighter'; softCircle(c, tr.x, tr.y, tr.s * 2.2, '#ffd890', 0.25 + 0.1 * Math.sin(G.t * 3)); c.restore();
    // bowl
    c.fillStyle = 'rgba(0,0,0,.3)'; c.beginPath(); c.ellipse(tr.x + 3, tr.y + tr.s * 0.6, tr.s * 1.25, tr.s * 0.4, 0, 0, TAU); c.fill();
    const g = c.createLinearGradient(tr.x - tr.s, 0, tr.x + tr.s, 0); g.addColorStop(0, '#e8dccb'); g.addColorStop(1, '#a89a86');
    c.fillStyle = g; c.beginPath(); c.ellipse(tr.x, tr.y + tr.s * 0.2, tr.s * 1.2, tr.s * 0.62, 0, 0, Math.PI); c.fill();
    c.fillStyle = '#4e5e6a'; c.beginPath(); c.ellipse(tr.x, tr.y + tr.s * 0.2, tr.s * 1.2, tr.s * 0.3, 0, 0, TAU); c.fill();
    drawSprite(c, st.def.ing, x, y, tr.s * 0.75, st.def.opt || {}, 0, 1, tr.drag ? 1.15 : 1);
    }
    if (!tr.drag) {
      // guiding arc toward the vessel
      c.strokeStyle = `rgba(255,240,210,${0.3 + 0.2 * Math.sin(G.t * 3)})`; c.setLineDash([4, 8]); c.lineDashOffset = -G.t * 30; c.lineWidth = 2;
      c.beginPath(); c.moveTo(tr.x, tr.y - tr.s); c.quadraticCurveTo((tr.x + this.vx) / 2, Math.min(tr.y, this.vy) - this.vr * 1.2, this.vx, this.vy - this.vr * 0.3); c.stroke(); c.setLineDash([]);
    }
  }
  drawHeatGauge(c) {
    const st = this.step;
    const x = G.W < G.H ? G.W - 26 : this.hx + this.hw * 0.6, y0 = this.fy - 20, hgt = Math.min(this.hw * 0.55, 260), y1 = y0 - hgt;
    c.save();
    c.fillStyle = 'rgba(20,10,5,.55)'; rrect(c, x - 9, y1 - 6, 18, hgt + 12, 9); c.fill();
    const g = c.createLinearGradient(0, y0, 0, y1); g.addColorStop(0, '#5a3a8a'); g.addColorStop(0.35, '#e0782a'); g.addColorStop(0.75, '#ffc04a'); g.addColorStop(1, '#fff6d8');
    if (st && (st.def.type === 'heat' || st.def.type === 'simmer')) {
      const [lo, hi] = st.def.zone;
      c.fillStyle = `rgba(160,255,170,${0.25 + 0.1 * Math.sin(G.t * 4)})`; rrect(c, x - 13, y0 - hi * hgt, 26, (hi - lo) * hgt, 6); c.fill();
      c.strokeStyle = 'rgba(190,255,200,.7)'; c.lineWidth = 1.5; rrect(c, x - 13, y0 - hi * hgt, 26, (hi - lo) * hgt, 6); c.stroke();
    }
    c.fillStyle = g; rrect(c, x - 5, y0 - this.heat * hgt, 10, this.heat * hgt, 5); c.fill();
    c.globalCompositeOperation = 'lighter'; softCircle(c, x, y0 - this.heat * hgt, 18, '#ffb060', 0.5);
    c.restore();
    c.fillStyle = 'rgba(255,240,220,.7)'; c.font = '600 10px ui-sans-serif, system-ui'; c.textAlign = 'center'; c.fillText('HEAT', x, y0 + 16);
  }
  drawSpoon(c) {
    const { x, y } = this.spoon;
    c.save(); c.translate(x, y); c.rotate(-0.6 + (this.spoon.baste || 0) * 0.6);
    c.fillStyle = 'rgba(0,0,0,.25)'; c.beginPath(); c.ellipse(6, 8, 16, 10, 0, 0, TAU); c.fill();
    const g = c.createLinearGradient(-10, 0, 10, 0); g.addColorStop(0, '#a06a3a'); g.addColorStop(1, '#e0b07a');
    c.fillStyle = g; c.beginPath(); c.ellipse(0, 0, 13, 17, 0, 0, TAU); c.fill();
    c.fillStyle = '#8a5a30'; rrect(c, -4, -100, 8, 88, 4); c.fill();
    c.restore();
  }
  drawPrompt(c) {
    const st = this.step, T = st.def.type;
    const k = (G.t % 1.4) / 1.4;
    if (T === 'stir' || (T === 'simmer' && st.catching)) {
      c.strokeStyle = `rgba(255,240,210,${0.55 * (1 - k * 0.5)})`; c.lineWidth = 2.5; c.setLineDash([3, 9]);
      c.beginPath(); c.ellipse(this.vx, this.vy, this.vr * 0.55, this.vr * 0.24, 0, G.t * 2, G.t * 2 + Math.PI * 1.6); c.stroke(); c.setLineDash([]);
      if (T === 'stir') UI.ring(c, this.vx + this.vr * 1.25, this.vy - this.vr * 0.55, 15, clamp((st.turns || 0) / st.def.turns));
    }
    if (T === 'toss') {
      const ay = this.vy - this.vr * 0.6 - k * 40;
      c.strokeStyle = `rgba(255,240,210,${1 - k})`; c.lineWidth = 3; c.lineCap = 'round';
      c.beginPath(); c.moveTo(this.vx - 12, ay + 12); c.lineTo(this.vx, ay); c.lineTo(this.vx + 12, ay + 12); c.stroke();
    }
    if (T === 'baste' || T === 'pour' || T === 'fold') {
      const pts = T === 'fold' ? [0, 1, 2].filter((i) => this.pies[i].fold === 0).map((i) => [this.vx + (i - 1) * this.vr * 0.62, this.vy - this.vr * 0.06]) : [[this.vx, this.vy]];
      for (const [x, y] of pts) { c.strokeStyle = `rgba(255,240,210,${1 - k})`; c.lineWidth = 2; c.beginPath(); c.ellipse(x, y, 16 + k * 30, 7 + k * 13, 0, 0, TAU); c.stroke(); }
      if (T === 'baste') UI.ring(c, this.vx + this.vr * 1.25, this.vy - this.vr * 0.55, 15, st.p / st.def.n);
      if (T === 'pour') UI.ring(c, this.vx + this.vr * 1.25, this.vy - this.vr * 0.55, 15, this.liquid);
    }
  }
}
