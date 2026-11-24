// Hearthwild — stage 1: foraging, fishing and the quiet hunt.
'use strict';

class ForageScene {
  constructor(recipe) {
    this.r = recipe;
    this.P = SKY[recipe.time];
    this.fx = new Particles();
    this.ambient = new Particles();
    this.camX = 0; this.vx = 0; this.zoom = 1; this.focus = null;
    this.mode = 'explore';
    this.got = {};
    recipe.forage.forEach((f) => (this.got[f.id] = 0));
    this.flash = 0;
    this.items = [];
    this.buildItems();
  }

  buildItems() {
    const R = rng(this.r.biome.seed + 9);
    const used = [];
    const place = (fyMin, fyMax, avoid) => {
      for (let tries = 0; tries < 60; tries++) {
        const fx = R.r(0.05, 0.95), fy = R.r(fyMin, fyMax);
        if (avoid && fy > 0.18 && fy < 0.46) continue;
        if (used.every(([a, b]) => Math.abs(a - fx) > 0.06 || Math.abs(b - fy) > 0.18)) { used.push([fx, fy]); return [fx, fy]; }
      }
      return [R.r(0.05, 0.95), R.r(fyMin, fyMax)];
    };
    const stream = !!this.r.biome.stream;
    for (const f of this.r.forage) {
      if (f.hunt) { const [fx] = place(0.2, 0.3); this.items.push({ id: f.id, kind: 'animal', fx: clamp(fx, 0.55, 0.9), fy: 0.3, need: true, st: { head: 0, ear: 0, hop: 0, walk: 0, moving: 0 }, t: 0, state: 'graze', timer: R.r(2, 3.5) }); continue; }
      if (f.fish) { this.items.push({ id: f.id, kind: 'fish', fx: 0.62, fy: 0.32, need: true }); continue; }
      for (let i = 0; i < f.n + 1; i++) { const [fx, fy] = place(0.12, 0.95, stream); this.items.push({ id: f.id, kind: 'plant', fx, fy, need: true, ph: R.r(0, 6) }); }
    }
    for (const b of this.r.bonus) { const [fx, fy] = place(0.2, 0.95, stream); this.items.push({ id: b, kind: 'plant', fx, fy, bonus: true, ph: R.r(0, 6) }); }
  }

  enter() {
    Audio2.ambience(this.r.ambience);
    Audio2.mood = 1;
    UI.stage(1, 'Forage');
    UI.top(this.r.name, this.r.place + ' · ' + this.P.name);
    this.renderBasket();
    UI.hint('Drag to look around. Tap anything that glows.');
    UI.clearAction();
    // gentle intro pan
    this.camX = 0;
  }
  exit() { UI.hint(''); UI.clearAction(); UI.overlay(''); }

  resize() {
    const W = G.W, H = G.H;
    this.gy = Math.round(H * (W < H ? 0.5 : 0.54));
    this.worldW = Math.max(W * 1.3, H * 2.1);
    this.k = Math.min(H / 900, W / 520) * (W < H ? 1.05 : 1);
    const cfg = Object.assign({ groundY: this.gy }, this.r.biome);
    this.layers = paintLandscape(cfg, this.P, W, H, this.worldW);
    this.streamPts = cfg.streamPts;
    this.tufts = makeTufts(rng(this.r.biome.seed + 3), this.worldW, this.gy, H, Math.round(this.worldW / 7));
    this.camX = clamp(this.camX, 0, this.worldW - W);
    for (const it of this.items) {
      if (it.kind === 'fish' && this.streamPts) {
        const p = this.streamPts[Math.round(it.fx * (this.streamPts.length - 1))];
        it.wx = p[0]; it.wy = p[1];
      } else { it.wx = it.fx * this.worldW; it.wy = this.gy + (H - this.gy) * it.fy; }
      it.s = this.k * (42 + 52 * it.fy);
      if (it.kind === 'animal') it.s = this.k * (it.id === 'deer' ? 150 : it.id === 'pheasant' ? 95 : 70);
    }
    // seed ambient life
    this.ambient.clear();
  }

  renderBasket() {
    const list = this.r.forage.map((f) => ({ id: f.id, icon: BASKET_ICON[f.id] || f.id, have: this.got[f.id], need: f.n }));
    UI.basket(list);
  }

  done() { return this.r.forage.every((f) => this.got[f.id] >= f.n); }

  // ── Input ────────────────────────────────────────────────────────────────
  toWorld(x, y) {
    if (this.zoom === 1 || !this.focus) return [x + this.camX, y];
    const f = this.focus;
    return [(x - G.W / 2) / this.zoom + f.x, (y - f.sy) / this.zoom + f.y];
  }
  down(x, y) {
    this.vx = 0; this.dragX = x; this.lastX = x; this.holding = true;
    if (this.mode === 'fish') this.fishDown();
    if (this.mode === 'aim') this.loose();
  }
  move(x) {
    if (this.mode === 'explore' && G.pointer.down) {
      const dx = x - this.lastX; this.lastX = x;
      this.camX = clamp(this.camX - dx, 0, this.worldW - G.W);
      this.vx = -dx / Math.max(G.dt, 0.008);
    }
  }
  up(x, y) {
    this.holding = false;
    if (this.mode === 'explore') {
      if (G.pointer.moved < 10) this.tap(x, y);
      else this.vx = clamp(this.vx, -2500, 2500);
    }
  }

  tap(x, y) {
    const [wx, wy] = this.toWorld(x, y);
    let best = null, bd = 1e9;
    for (const it of this.items) {
      if (it.taken || it.gone) continue;
      const cy = it.kind === 'animal' ? it.wy - it.s * 0.3 : it.kind === 'fish' ? it.wy : it.wy - it.s * 0.4;
      const d = dist(wx, wy, it.wx, cy), r = Math.max(36, it.kind === 'animal' ? it.s * 0.6 : it.s * 1.2);
      if (d < r && d < bd) { bd = d; best = it; }
    }
    if (!best) { Audio2.sfxRustle(); this.fx.burst(wx - this.camX, wy, 5, () => ({ x: x, y: y, vx: rand(-40, 40), vy: rand(-70, -20), g: 60, life: rand(0.6, 1), size: 2, color: this.P.grass })); return; }
    if (best.kind === 'plant') this.gather(best);
    else if (best.kind === 'animal') this.startStalk(best);
    else if (best.kind === 'fish') this.startFish(best);
  }

  gather(it) {
    it.taken = true;
    Audio2.sfxPick(); Audio2.sfxRustle();
    const sx = it.wx - this.camX, sy = it.wy - it.s * 0.4;
    for (let i = 0; i < 14; i++) this.fx.add({ kind: 'star', x: sx, y: sy, vx: rand(-90, 90), vy: rand(-140, -20), g: 120, life: rand(0.6, 1.1), size: rand(3, 6), color: pick(['#fff6c8', '#ffe08a', '#ffffff']), rot: rand(0, 3), vr: rand(-4, 4), add: true });
    for (let i = 0; i < 6; i++) this.fx.add({ x: sx, y: sy + it.s * 0.4, vx: rand(-60, 60), vy: rand(-80, -30), g: 200, life: 0.8, size: rand(1.5, 3), color: this.P.grassDark });
    this.flyToBasket(it.id, sx, sy, it.s, () => {
      if (it.bonus) { Save.data.finds[it.id] = 1; Save.store(); UI.toast('A little extra: ' + NAMES[it.id] + ' for the larder'); return; }
      this.got[it.id] = (this.got[it.id] || 0) + 1;
      this.renderBasket();
      this.checkDone();
    });
  }

  flyToBasket(id, sx, sy, s, cb) {
    const target = UI.basketPos(id);
    const icon = BASKET_ICON[id] || id;
    const o = { t: 0 };
    const fly = { x: sx, y: sy, s, icon };
    this.flying = this.flying || [];
    this.flying.push(fly);
    const cx = (sx + target[0]) / 2 + rand(-60, 60), cy = Math.min(sy, target[1]) - 120;
    Tw.to(o, { t: 1 }, 0.85, easeInOut).then(() => {
      this.flying.splice(this.flying.indexOf(fly), 1);
      UI.bump(id); Audio2.tone({ f: 1320, vol: 0.06, d: 0.25, verb: 0.5 });
      cb && cb();
    });
    fly.update = () => {
      const t = o.t, u = 1 - t;
      fly.x = u * u * sx + 2 * u * t * cx + t * t * target[0];
      fly.y = u * u * sy + 2 * u * t * cy + t * t * target[1];
      fly.scale = lerp(1.25, 0.35, t) * (t < 0.15 ? easeBack(t / 0.15) : 1);
      fly.rot = t * 2;
      if (Math.random() < 0.6) this.fx.add({ kind: 'glow', x: fly.x, y: fly.y, life: 0.5, size: 14, color: '#ffe9a8', add: true, a: 0.6 });
    };
  }

  checkDone() {
    if (this.done() && !this.finished) {
      this.finished = true;
      Audio2.chime(0, 5);
      UI.hint('');
      UI.toast('Basket full. Time to head home.');
      UI.action('Head home to the kitchen', () => game.toPrep(this.r));
    }
  }

  // ── Hunt ────────────────────────────────────────────────────────────────
  startStalk(a) {
    this.mode = 'stalk'; this.target = a; this.prog = 0; this.spooked = 0;
    this.focus = { x: a.wx, y: a.wy - a.s * 0.3, sy: G.H * 0.55 };
    Tw.to(this, { zoom: 1.7 }, 1.2, easeInOut);
    Audio2.mood = 0.4;
    UI.hint('Hold to creep closer. Freeze when it looks up.');
    UI.overlay(`<div class="meter"><span>Distance</span><i><b id="stalkbar"></b></i></div>`);
  }
  updateStalk(dt) {
    const a = this.target;
    this.animalAI(a, dt);
    const bar = document.getElementById('stalkbar');
    if (this.mode === 'stalk') {
      if (this.holding && G.pointer.down && !a.fled) {
        this.prog += dt * 0.16;
        this.stepT = (this.stepT || 0) - dt;
        if (this.stepT <= 0) { this.stepT = 0.42; Audio2.sfxStep(); }
        if (a.state === 'alert' && a.t > 0.25) this.spook(a);
      }
      this.zoom = lerp(this.zoom, 1.7 + this.prog * 1.3, dt * 2);
      if (bar) bar.style.width = (this.prog * 100).toFixed(1) + '%';
      if (this.prog >= 1) this.startAim();
    }
  }
  animalAI(a, dt) {
    a.t += dt;
    const st = a.st;
    st.blink = (G.t % 3.7) < 0.12;
    if (a.state === 'graze') {
      st.head = lerp(st.head, 0.05 + 0.05 * Math.sin(G.t * 4), dt * 6); st.ear = lerp(st.ear, 0.2, dt * 5);
      if (a.id === 'pheasant') st.head = 0.3 + 0.3 * Math.max(0, Math.sin(G.t * 7));
      if (a.t > a.timer) { a.state = 'wary'; a.t = 0; }
    } else if (a.state === 'wary') {
      st.ear = 0.5 + 0.4 * Math.sin(a.t * 30); st.head = lerp(st.head, 0.35, dt * 4);
      if (a.t > 0.75) { a.state = 'alert'; a.t = 0; Audio2.sfxRustle(); }
    } else if (a.state === 'alert') {
      st.head = lerp(st.head, 1, dt * 10); st.ear = lerp(st.ear, 1, dt * 10);
      if (a.t > rand(1.3, 1.5)) { a.state = 'graze'; a.t = 0; a.timer = rand(1.6, 3.4); }
    } else if (a.state === 'flee') {
      st.hop = Math.abs(Math.sin(a.t * 9)) ; st.walk += dt * 14; st.moving = 1;
      a.wx += dt * a.s * 4.5;
      if (a.t > 1.3) { a.state = 'gone'; a.t = 0; }
    } else if (a.state === 'gone') {
      if (a.t > 1.8) { a.state = 'return'; a.t = 0; a.wx = a.homeX + a.s * 4; }
    } else if (a.state === 'return') {
      st.hop = Math.abs(Math.sin(a.t * 7)) * 0.6; st.walk += dt * 10; st.moving = 1;
      a.wx = lerp(a.homeX + a.s * 4, a.homeX, easeOut(clamp(a.t / 1.6)));
      if (a.t > 1.6) { a.state = 'graze'; a.t = 0; a.timer = rand(2, 3.5); st.hop = 0; st.moving = 0; a.fled = false; }
    }
    if (a.state !== 'flee' && a.state !== 'return') { st.hop = lerp(st.hop, 0, dt * 8); st.moving = 0; }
  }
  spook(a) {
    a.fled = true; a.homeX = a.homeX || a.wx; a.state = 'flee'; a.t = 0;
    this.prog = Math.max(0, this.prog - 0.35);
    Audio2.sfxRustle(); Audio2.sfxSoft();
    UI.toast('It bolted. Give it a moment, it will settle again.');
  }
  startAim() {
    this.mode = 'aim'; this.aimT = 0;
    UI.hint('Breathe with the ring. Tap when it is smallest.');
    UI.overlay('');
  }
  ringR() { const a = this.target; return a.s * (0.12 + 0.5 * Math.abs(Math.sin(this.aimT * 1.7))); }
  loose() {
    const a = this.target;
    if (a.state === 'flee' || a.state === 'gone' || a.state === 'return') return;
    const r = this.ringR(), q = 1 - clamp((r - a.s * 0.12) / (a.s * 0.5));
    Audio2.sfxBow();
    if (q > 0.62) {
      this.mode = 'taken';
      this.huntQ = q;
      Audio2.mood = 0.2;
      Tw.to(this, { flash: 1 }, 0.6, easeOut).then(async () => {
        a.taken = true; a.gone = true;
        UI.toast('With thanks to the ' + (a.id === 'deer' ? 'pines' : a.id === 'pheasant' ? 'hedgerow' : 'meadow') + '.');
        Audio2.chime(0, -5);
        await Tw.wait(0.5);
        Tw.to(this, { flash: 0 }, 1.4, easeInOut);
        Tw.to(this, { zoom: 1 }, 1.4, easeInOut);
        await Tw.wait(0.4);
        this.flyToBasket(a.id, G.W / 2, G.H * 0.5, this.k * 40, () => { this.got[a.id] = 1; this.renderBasket(); this.checkDone(); });
        await Tw.wait(1);
        this.mode = 'explore'; this.focus = null; Audio2.mood = 1;
        if (!this.finished) UI.hint('Drag to look around. Tap anything that glows.');
      });
      for (let i = 0; i < 40; i++) this.fx.add({ kind: 'star', x: G.W / 2 + rand(-80, 80), y: G.H * 0.5 + rand(-60, 60), vx: rand(-60, 60), vy: rand(-90, -10), life: rand(1, 2), size: rand(3, 7), color: pick(['#fff6d8', '#ffe2a0']), add: true, rot: 0, vr: 2 });
    } else {
      UI.toast('A little wide. It will come back.');
      a.homeX = a.homeX || a.wx;
      a.state = 'flee'; a.t = 0; a.fled = true;
      this.mode = 'stalk'; this.prog = 0.55;
      UI.hint('Hold to creep closer. Freeze when it looks up.');
      UI.overlay(`<div class="meter"><span>Distance</span><i><b id="stalkbar"></b></i></div>`);
    }
  }

  // ── Fishing ─────────────────────────────────────────────────────────────
  startFish(spot) {
    this.mode = 'fish'; this.spot = spot; this.fp = 'cast'; this.ft = 0; this.tension = 0.3; this.reel = 0; this.surge = 0;
    this.focus = { x: spot.wx, y: spot.wy, sy: G.H * 0.5 };
    Tw.to(this, { zoom: 2.2 }, 1.1, easeInOut);
    Audio2.sfxWhoosh();
    UI.hint('Wait for the float to dip under, then tap.');
  }
  fishDown() {
    if (this.fp === 'wait') {
      if (this.bite > 0) { this.fp = 'reel'; this.ft = 0; Audio2.sfxSplash(0.6); UI.hint('Hold to reel. Keep the line in the green, ease off when it pulls.'); UI.overlay(''); }
      else { Audio2.sfxSoft(); UI.toast('Too soon. Let it take the bait.'); this.biteAt = this.ft + rand(1.5, 2.5); }
    }
  }
  updateFish(dt) {
    this.ft += dt;
    const spot = this.spot;
    if (this.fp === 'cast' && this.ft > 0.9) { this.fp = 'wait'; this.ft = 0; this.biteAt = rand(2, 4); this.bite = 0; Audio2.sfxPlop(); this.ripple(spot.wx, spot.wy); }
    if (this.fp === 'wait') {
      if (this.bite > 0) { this.bite -= dt; if (this.bite <= 0) { this.biteAt = this.ft + rand(1.5, 3); UI.toast('It slipped the hook. Patience.'); } }
      else if (this.ft > this.biteAt) { this.bite = 0.95; Audio2.sfxSplash(0.5); this.ripple(spot.wx, spot.wy); this.ripple(spot.wx, spot.wy, 0.2); UI.hint('Now! Tap!'); }
      else if (Math.random() < dt * 0.8) this.ripple(spot.wx + rand(-6, 6), spot.wy, 0, 0.4);
    }
    if (this.fp === 'reel') {
      this.surge -= dt;
      if (this.surge <= 0) { this.surge = rand(0.6, 1.6); this.pull = rand(0.25, 0.9); }
      const holding = G.pointer.down;
      this.tension += (holding ? 0.75 : -0.55) * dt + this.pull * 0.45 * dt * (Math.sin(this.ft * 5) * 0.5 + 0.6);
      this.tension = clamp(this.tension, 0, 1);
      const inZone = this.tension > 0.33 && this.tension < 0.72;
      if (inZone) this.reel += dt * 0.2; else this.reel = Math.max(0, this.reel - dt * 0.06);
      this.fishQ = (this.fishQ || 0) + (inZone ? dt : 0); this.fishT = (this.fishT || 0) + dt;
      if (holding && Math.random() < dt * 22) Audio2.sfxReel();
      if (Math.random() < dt * 3) this.ripple(spot.wx + rand(-20, 20), spot.wy + rand(-4, 4), 0, 0.6);
      if (this.reel >= 1) this.landFish();
    }
  }
  landFish() {
    this.fp = 'landed';
    const spot = this.spot; spot.taken = true;
    Audio2.sfxSplash(1.2); Audio2.chime(0, 2);
    const sx = G.W / 2, sy = G.H * 0.5;
    for (let i = 0; i < 40; i++) this.fx.add({ x: sx + rand(-30, 30), y: sy, vx: rand(-200, 200), vy: rand(-380, -120), g: 700, life: rand(0.6, 1.2), size: rand(1.5, 4), color: pick(['#e8f6ff', '#bfe3ff', '#ffffff']), a: 0.9 });
    this.leap = { t: 0 };
    Tw.to(this.leap, { t: 1 }, 1.3, easeOut).then(() => {
      this.leap = null;
      this.flyToBasket('trout', sx, sy - 120, this.k * 40, () => { this.got.trout = 1; this.renderBasket(); this.checkDone(); });
      Tw.to(this, { zoom: 1 }, 1.2, easeInOut).then(() => { this.mode = 'explore'; this.focus = null; if (!this.finished) UI.hint('Drag to look around. Tap anything that glows.'); });
    });
    UI.toast('A speckled brook trout. Beautiful.');
  }
  ripple(x, y, delay = 0, a = 1) {
    this.ripples = this.ripples || [];
    this.ripples.push({ x, y, t: -delay, a });
  }

  // ── Update & draw ────────────────────────────────────────────────────────
  update(dt) {
    if (this.mode === 'explore' && !G.pointer.down) {
      this.camX = clamp(this.camX + this.vx * dt, 0, this.worldW - G.W);
      this.vx *= Math.pow(0.04, dt);
    }
    if (this.mode === 'stalk' || this.mode === 'aim' || this.mode === 'taken') this.updateStalk(dt);
    if (this.mode === 'aim') this.aimT += dt;
    if (this.mode === 'fish') this.updateFish(dt);
    for (const it of this.items) if (it.kind === 'animal' && this.mode === 'explore' && !it.taken) this.animalAI(it, dt);
    if (this.flying) this.flying.forEach((f) => f.update());
    if (this.ripples) for (let i = this.ripples.length - 1; i >= 0; i--) { const r = this.ripples[i]; r.t += dt; if (r.t > 1.6) this.ripples.splice(i, 1); }
    this.spawnAmbient(dt);
    this.fx.update(dt); this.ambient.update(dt);
  }

  spawnAmbient(dt) {
    const P = this.P, W = G.W, H = G.H;
    const night = this.r.time === 'dusk', gold = this.r.time === 'golden';
    if (Math.random() < dt * (night ? 6 : 3)) {
      // pollen motes / fireflies (screen space)
      if (night) this.ambient.add({ kind: 'glow', x: rand(0, W), y: rand(this.gy - 40, H), vx: rand(-12, 12), vy: rand(-14, 4), life: rand(3, 6), size: rand(6, 12), color: '#e9ff9a', add: true, fadeIn: true, flutter: 2, seed: rand(0, 9), a: 0.9 });
      else this.ambient.add({ kind: 'glow', x: rand(0, W), y: rand(0, H), vx: rand(4, 18), vy: rand(-6, 6), life: rand(4, 7), size: rand(2, 4), color: P.rim, add: true, fadeIn: true, flutter: 1, seed: rand(0, 9), a: 0.8 });
    }
    if (Math.random() < dt * (gold ? 1.6 : this.r.time === 'dawn' ? 0.4 : 0.6) && !night) {
      const col = gold ? pick(['#e8963c', '#c8642a', '#f2c25a']) : pick(['#8fbf5a', '#b6d27a', '#e6c85a']);
      this.ambient.add({ kind: 'leaf', x: rand(-20, W), y: -10, vx: rand(10, 40), vy: rand(30, 55), life: rand(8, 12), rot: rand(0, 6), vr: rand(-2, 2), flutter: 1.4, seed: rand(0, 9), drag: 1, fadeIn: true, a: 0.95,
        draw: (c, q) => { c.fillStyle = col; c.beginPath(); c.ellipse(0, 0, 7 * this.k + 2, 3 * this.k + 1.2, 0, 0, TAU); c.fill(); c.strokeStyle = 'rgba(0,0,0,.15)'; c.lineWidth = 0.7; c.beginPath(); c.moveTo(-6, 0); c.lineTo(6, 0); c.stroke(); } });
    }
    if (!night && (this.r.time === 'morning' || this.r.time === 'noon') && Math.random() < dt * 0.25) {
      const col = pick(['#ffffff', '#ffd76a', '#b9a4ff', '#9fd4ff']);
      this.ambient.add({ kind: 'bfly', x: -20, y: rand(this.gy, H * 0.9), vx: rand(30, 60), vy: rand(-10, 10), life: 14, flutter: 3, seed: rand(0, 9), drag: 1, a: 1,
        draw: (c, q) => { const f = Math.abs(Math.sin(G.t * 16 + q.seed)); c.fillStyle = col; for (const sd of [-1, 1]) { c.beginPath(); c.ellipse(sd * 4 * f, -2, 4.5 * f + 0.5, 3.4, sd * 0.4, 0, TAU); c.fill(); } c.fillStyle = '#3a2a1a'; c.fillRect(-0.6, -4, 1.2, 6); } });
    }
  }

  drawWorld(c) {
    const W = G.W, H = G.H, P = this.P;
    const cam = this.camX;
    const px = (G.pointer.x / W - 0.5) * 10;
    // parallax layers
    for (const L of this.layers) {
      const ox = -cam * L.par - (L.par < 1 ? px * L.par : 0);
      c.drawImage(L.cv, ox, 0, L.w, H);
    }
    // god rays
    if (this.r.time !== 'dusk') {
      c.save(); c.globalCompositeOperation = 'lighter';
      const sx = W * P.sunX - cam * 0.02, sy = this.gy * P.sunY;
      for (let i = 0; i < 6; i++) {
        const a = Math.PI / 2 + (P.sunX > 0.5 ? 0.35 : -0.35) + (i - 2.5) * 0.16 + Math.sin(G.t * 0.15 + i) * 0.03;
        const len = H * 1.4, w = 40 + i * 12;
        const ex = sx + Math.cos(a) * len, ey = sy + Math.sin(a) * len;
        const g = c.createLinearGradient(sx, sy, ex, ey);
        const al = (0.05 + 0.03 * Math.sin(G.t * 0.4 + i * 1.7)) * (this.r.time === 'noon' ? 0.6 : 1);
        g.addColorStop(0, rgba(P.light, al)); g.addColorStop(1, rgba(P.light, 0));
        c.fillStyle = g; c.beginPath(); c.moveTo(sx, sy);
        c.lineTo(ex + Math.cos(a + Math.PI / 2) * w * 4, ey + Math.sin(a + Math.PI / 2) * w * 4);
        c.lineTo(ex - Math.cos(a + Math.PI / 2) * w * 4, ey - Math.sin(a + Math.PI / 2) * w * 4); c.fill();
      }
      c.restore();
    }
    c.save();
    c.translate(-cam, 0);
    // stream shimmer
    if (this.streamPts) {
      c.save(); c.globalCompositeOperation = 'lighter';
      for (let i = 0; i < this.streamPts.length; i += 1) {
        const p = this.streamPts[i];
        if (p[0] < cam - 40 || p[0] > cam + W + 40) continue;
        for (let j = 0; j < 3; j++) {
          const ph = (G.t * 0.6 + i * 0.37 + j * 0.33) % 1;
          const x = p[0] + ph * 20, y = p[1] + (j - 1) * p[2] * 0.25 + Math.sin(G.t * 2 + i) * 1.5;
          c.strokeStyle = rgba(P.light, 0.35 * Math.sin(ph * Math.PI));
          c.lineWidth = 1.4; c.beginPath(); c.moveTo(x - 6, y); c.lineTo(x + 6, y); c.stroke();
        }
      }
      c.restore();
    }
    if (this.ripples) for (const r of this.ripples) {
      if (r.t < 0) continue;
      const k = r.t / 1.6;
      c.strokeStyle = `rgba(255,255,255,${(1 - k) * 0.6 * r.a})`; c.lineWidth = 1.5;
      c.beginPath(); c.ellipse(r.x, r.y, 6 + k * 40, 2 + k * 12, 0, 0, TAU); c.stroke();
    }
    // merge tufts + items by depth
    const vis = [];
    for (const t of this.tufts) if (t.x > cam - 40 && t.x < cam + W + 40) vis.push({ y: t.y, t });
    for (const it of this.items) if (!it.gone && !(it.taken && it.kind !== 'animal')) vis.push({ y: it.wy, it });
    vis.sort((a, b) => a.y - b.y);
    const wind = 2 + Math.sin(G.t * 0.5) * 1.2;
    for (const v of vis) {
      if (v.t) drawTuft(c, v.t, P, wind);
      else this.drawItem(c, v.it);
    }
    c.restore();
  }

  drawItem(c, it) {
    const P = this.P;
    if (it.kind === 'plant') {
      const bob = Math.sin(G.t * 1.6 + it.ph) * 0.04;
      // glow halo
      const pulse = 0.5 + 0.5 * Math.sin(G.t * 2.2 + it.ph);
      c.save(); c.globalCompositeOperation = 'lighter';
      softCircle(c, it.wx, it.wy - it.s * 0.5, it.s * (1.5 + pulse * 0.3), it.bonus ? '#ffd6f0' : P.rim, 0.2 + pulse * 0.12);
      c.restore();
      c.fillStyle = 'rgba(20,30,10,.25)'; c.beginPath(); c.ellipse(it.wx, it.wy, it.s * 0.7, it.s * 0.16, 0, 0, TAU); c.fill();
      const dy = it.id === 'carrot' || it.id === 'thyme' || it.id === 'rosemary' || it.id === 'juniper' ? -it.s * 0.35 : -it.s * 0.55;
      drawSprite(c, it.id, it.wx, it.wy + dy, it.s * 0.6, {}, bob, 1);
      if (Math.random() < 0.02) this.fx.add({ kind: 'star', x: it.wx - this.camX + rand(-it.s, it.s) * 0.6, y: it.wy - it.s * rand(0.3, 1), life: 0.9, size: rand(2, 4), color: '#fffbe0', add: true, vy: -10 });
    } else if (it.kind === 'animal') {
      c.save();
      const alpha = it.taken ? 0 : 1;
      c.globalAlpha = alpha;
      c.fillStyle = 'rgba(20,25,10,.28)'; c.beginPath(); c.ellipse(it.wx, it.wy, it.s * 0.45, it.s * 0.07, 0, 0, TAU); c.fill();
      c.translate(it.wx, it.wy);
      if (it.state === 'return') c.scale(-1, 1);
      if (it.id === 'rabbit') drawRabbit(c, it.s, it.st);
      else if (it.id === 'pheasant') drawPheasant(c, it.s, it.st);
      else drawDeer(c, it.s, it.st);
      c.restore();
      if (this.mode === 'explore' && !it.taken) {
        // soft beckoning ring
        const k = (G.t % 2.2) / 2.2;
        c.strokeStyle = rgba(P.rim, (1 - k) * 0.5); c.lineWidth = 1.5;
        c.beginPath(); c.ellipse(it.wx, it.wy, it.s * (0.4 + k * 0.4), it.s * (0.08 + k * 0.08), 0, 0, TAU); c.stroke();
      }
    } else if (it.kind === 'fish' && !it.taken) {
      const k = (G.t % 2.6) / 2.6;
      c.save(); c.globalCompositeOperation = 'lighter';
      softCircle(c, it.wx, it.wy, 40 * this.k, P.rim, 0.25 + 0.15 * Math.sin(G.t * 2));
      c.restore();
      c.strokeStyle = `rgba(255,255,255,${(1 - k) * 0.7})`; c.lineWidth = 1.4;
      c.beginPath(); c.ellipse(it.wx, it.wy, 8 + k * 30, 3 + k * 9, 0, 0, TAU); c.stroke();
      // a shadowy fish shape under water
      c.save(); c.globalAlpha = 0.25; c.translate(it.wx + Math.sin(G.t * 0.7) * 14, it.wy + 2); c.scale(1, 0.4); drawTrout(c, 16 * this.k, { flex: 1 }); c.restore();
    }
  }

  drawForeground(c) {
    const W = G.W, H = G.H, P = this.P;
    // dark foreground leaves at the edges, moving faster than the world
    const off = -this.camX * 1.25;
    const R = rng(this.r.biome.seed + 77);
    const n = Math.ceil(this.worldW / 500) + 2;
    for (let i = 0; i < n; i++) {
      const x = i * 520 + R.r(0, 200) + off;
      if (x < -300 || x > W + 300) { R(); R(); continue; }
      const top = R() < 0 && false;
      const y = top ? -20 : H + 30, s = R.r(150, 260) * this.k;
      c.save(); c.translate(x, y); c.rotate(top ? Math.PI + R.r(-0.5, 0.5) : R.r(-0.5, 0.5) + Math.sin(G.t * 0.7 + i) * 0.03);
      c.globalAlpha = 0.85;
      for (let j = 0; j < 4; j++) { c.save(); c.rotate(-0.8 + j * 0.5); leaf(c, 0, 0, s, s * 0.26, mix(P.grassDark, '#000000', 0.45), P.grassDark); c.restore(); }
      c.restore();
    }
    // vignette + warm grade
    const vg = c.createRadialGradient(W / 2, H * 0.55, Math.min(W, H) * 0.35, W / 2, H * 0.55, Math.max(W, H) * 0.85);
    vg.addColorStop(0, 'rgba(0,0,0,0)'); vg.addColorStop(1, rgba(mix(P.grassDark, '#000000', 0.6), this.r.time === 'dusk' ? 0.6 : 0.42));
    c.fillStyle = vg; c.fillRect(0, 0, W, H);
  }

  draw(c) {
    const W = G.W, H = G.H;
    c.save();
    if (this.zoom !== 1 && this.focus) {
      // zoom about focus point (world coords) placed at screen (W/2, sy)
      const f = this.focus;
      const camShift = f.x - this.camX;
      c.translate(W / 2, f.sy);
      c.scale(this.zoom, this.zoom);
      c.translate(-camShift, -f.y);
    }
    this.drawWorld(c);
    if (this.mode === 'fish' || (this.focus && this.spot && this.mode !== 'explore')) this.drawFishing(c);
    c.restore();

    if (this.mode === 'aim') this.drawAim(c);
    if (this.leap) this.drawLeap(c);
    this.ambient.draw(c);
    this.drawForeground(c);
    if (this.flying) for (const f of this.flying) drawSprite(c, f.icon, f.x, f.y, f.s * 0.6, {}, f.rot, 1, f.scale);
    this.fx.draw(c);
    if (this.flash > 0) {
      c.fillStyle = `rgba(255,244,220,${this.flash * 0.85})`; c.fillRect(0, 0, W, H);
    }
  }

  drawFishing(c) {
    if (!this.spot || this.fp === 'landed') return;
    const s = this.spot, k = this.k;
    // rod line from bottom-left of view to the float
    const f = this.focus;
    const vx0 = this.camX + (f.x - this.camX) - (G.W / 2) / this.zoom;
    const vy1 = f.y + (G.H - f.sy) / this.zoom;
    const rodX = vx0 + 30 / this.zoom, rodY = vy1;
    let bx = s.wx, by = s.wy;
    if (this.fp === 'cast') { const t = clamp(this.ft / 0.9); bx = lerp(rodX, s.wx, easeOut(t)); by = lerp(rodY - 200, s.wy, t) - Math.sin(t * Math.PI) * 80; }
    const dip = this.bite > 0 ? 6 : this.fp === 'reel' ? 3 + Math.sin(this.ft * 20) * 2 : Math.sin(G.t * 2.5) * 1.2;
    c.strokeStyle = 'rgba(255,255,255,.55)'; c.lineWidth = 0.8 / this.zoom;
    c.beginPath(); c.moveTo(rodX, rodY); c.quadraticCurveTo((rodX + bx) / 2, Math.min(rodY, by) - (this.fp === 'reel' ? 10 * (1 - this.tension) : 40), bx, by + dip); c.stroke();
    // float
    c.fillStyle = '#e8483a'; c.beginPath(); c.arc(bx, by + dip - 2, 3, Math.PI, 0); c.fill();
    c.fillStyle = '#fff'; c.beginPath(); c.arc(bx, by + dip - 2, 3, 0, Math.PI); c.fill();
    if (this.fp === 'reel') {
      // tension arc gauge around the float
      const r = 26, a0 = Math.PI * 1.1, a1 = Math.PI * 1.9;
      c.lineCap = 'round';
      c.lineWidth = 4; c.strokeStyle = 'rgba(30,30,30,.35)'; c.beginPath(); c.arc(bx, by - 6, r, a0, a1); c.stroke();
      c.strokeStyle = 'rgba(140,230,150,.9)'; c.beginPath(); c.arc(bx, by - 6, r, lerp(a0, a1, 0.33), lerp(a0, a1, 0.72)); c.stroke();
      const ta = lerp(a0, a1, this.tension);
      c.fillStyle = '#fff'; c.beginPath(); c.arc(bx + Math.cos(ta) * r, by - 6 + Math.sin(ta) * r, 3.2, 0, TAU); c.fill();
      // catch progress ring
      c.lineWidth = 2; c.strokeStyle = 'rgba(255,240,200,.9)'; c.beginPath(); c.arc(bx, by - 6, r + 7, -Math.PI / 2, -Math.PI / 2 + TAU * this.reel); c.stroke();
    }
  }

  drawAim(c) {
    const a = this.target, W = G.W;
    const x = W / 2, y = this.focus.sy;
    const r = this.ringR() * this.zoom;
    const q = 1 - clamp((this.ringR() - a.s * 0.12) / (a.s * 0.5));
    c.save();
    c.strokeStyle = q > 0.62 ? 'rgba(255,240,190,.95)' : 'rgba(255,255,255,.6)';
    c.lineWidth = 2;
    c.beginPath(); c.arc(x, y, r, 0, TAU); c.stroke();
    c.setLineDash([3, 6]); c.beginPath(); c.arc(x, y, a.s * 0.12 * this.zoom, 0, TAU); c.stroke(); c.setLineDash([]);
    c.globalCompositeOperation = 'lighter';
    softCircle(c, x, y, r * 1.2, '#fff3cf', q > 0.62 ? 0.2 : 0.06);
    c.restore();
  }

  drawLeap(c) {
    const t = this.leap.t, x = G.W / 2 + t * 40, y = G.H * 0.5 - Math.sin(t * Math.PI) * G.H * 0.22;
    c.save(); c.translate(x, y); c.rotate(-0.8 + t * 1.6); c.scale(1.6, 1.6);
    drawTrout(c, 40 * this.k, { flex: 1 });
    c.restore();
    c.save(); c.globalCompositeOperation = 'lighter'; softCircle(c, x, y, 120, '#fff4d0', 0.25 * (1 - t)); c.restore();
  }
}
