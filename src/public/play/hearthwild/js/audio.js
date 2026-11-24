// Hearthwild — sound. Live-generated ambience and music, plus a few recorded clips.
'use strict';

const Audio2 = {
  ctx: null, master: null, music: null, amb: null, sfx: null, verb: null,
  on: true, buffers: {}, loops: {}, noise: null, started: false,

  unlock() {
    if (this.ctx) { if (this.ctx.state === 'suspended') this.ctx.resume(); return; }
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = (this.ctx = new AC());
    this.master = ctx.createGain(); this.master.gain.value = this.on ? 0.9 : 0;
    const comp = ctx.createDynamicsCompressor(); comp.threshold.value = -14; comp.ratio.value = 3;
    this.master.connect(comp); comp.connect(ctx.destination);
    this.music = ctx.createGain(); this.music.gain.value = 0.34; this.music.connect(this.master);
    this.amb = ctx.createGain(); this.amb.gain.value = 0.55; this.amb.connect(this.master);
    this.sfx = ctx.createGain(); this.sfx.gain.value = 0.8; this.sfx.connect(this.master);
    // Small room reverb from generated impulse.
    this.verb = ctx.createConvolver();
    const len = ctx.sampleRate * 2.6, ir = ctx.createBuffer(2, len, ctx.sampleRate);
    for (let ch = 0; ch < 2; ch++) { const d = ir.getChannelData(ch); for (let i = 0; i < len; i++) d[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / len, 3.2); }
    this.verb.buffer = ir;
    const vg = ctx.createGain(); vg.gain.value = 0.5; this.verb.connect(vg); vg.connect(this.master);
    // White noise buffer used by most synth voices.
    const nb = ctx.createBuffer(1, ctx.sampleRate * 2, ctx.sampleRate), nd = nb.getChannelData(0);
    for (let i = 0; i < nd.length; i++) nd[i] = Math.random() * 2 - 1;
    this.noise = nb;
    this.loadAll();
    this.startMusic();
  },

  setOn(v) {
    this.on = v;
    if (this.master) this.master.gain.setTargetAtTime(v ? 0.9 : 0, this.ctx.currentTime, 0.2);
  },

  async loadAll() {
    const files = ['fire', 'rinse', 'pop', 'lid', 'click', 'wood', 'branch'];
    for (const f of files) {
      try {
        const r = await fetch('audio/' + f + '.mp3');
        if (!r.ok) continue;
        const b = await r.arrayBuffer();
        this.buffers[f] = await new Promise((res, rej) => this.ctx.decodeAudioData(b, res, rej));
      } catch (_) {}
    }
    if (this.wantAmb) this.ambience(this.wantAmb);
  },

  play(name, { vol = 1, rate = 1, offset = 0, dur, dest } = {}) {
    if (!this.ctx || !this.buffers[name]) return false;
    const s = this.ctx.createBufferSource(); s.buffer = this.buffers[name]; s.playbackRate.value = rate;
    const g = this.ctx.createGain(); g.gain.value = vol;
    s.connect(g); g.connect(dest || this.sfx);
    s.start(0, offset, dur);
    return true;
  },

  // ── Synth voices ──────────────────────────────────────────────────────────
  nz({ type = 'bandpass', f = 1000, q = 1, vol = 0.3, a = 0.005, d = 0.15, dest, f2, when = 0 } = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when;
    const s = this.ctx.createBufferSource(); s.buffer = this.noise;
    const fl = this.ctx.createBiquadFilter(); fl.type = type; fl.frequency.setValueAtTime(f, t); fl.Q.value = q;
    if (f2) fl.frequency.exponentialRampToValueAtTime(f2, t + a + d);
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + a); g.gain.exponentialRampToValueAtTime(0.0008, t + a + d);
    s.connect(fl); fl.connect(g); g.connect(dest || this.sfx);
    s.start(t, Math.random() * 1.5, a + d + 0.05);
  },
  tone({ f = 440, f2, type = 'sine', vol = 0.2, a = 0.005, d = 0.3, dest, verb = 0, when = 0 } = {}) {
    if (!this.ctx) return;
    const t = this.ctx.currentTime + when;
    const o = this.ctx.createOscillator(); o.type = type; o.frequency.setValueAtTime(f, t);
    if (f2) o.frequency.exponentialRampToValueAtTime(f2, t + a + d);
    const g = this.ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(vol, t + a); g.gain.exponentialRampToValueAtTime(0.0008, t + a + d);
    o.connect(g); g.connect(dest || this.sfx);
    if (verb) { const v = this.ctx.createGain(); v.gain.value = verb; g.connect(v); v.connect(this.verb); }
    o.start(t); o.stop(t + a + d + 0.05);
  },

  // Named effects used by the game.
  sfxPick() { if (!this.play('pop', { vol: 0.55, rate: rand(0.95, 1.15) })) this.tone({ f: 660, f2: 990, d: 0.12, vol: 0.15 }); this.chime(0.06); },
  sfxRustle() { if (!this.play('branch', { vol: 0.35, rate: rand(0.9, 1.2), offset: rand(0, 1.2), dur: 0.45 })) this.nz({ f: 2500, q: 0.6, vol: 0.12, d: 0.25 }); },
  sfxStep() { this.nz({ type: 'lowpass', f: 900, vol: 0.12, a: 0.01, d: 0.12 }); this.nz({ f: 3000, q: 0.8, vol: 0.04, d: 0.1, when: 0.02 }); },
  sfxChop() { this.nz({ type: 'lowpass', f: 1400, vol: 0.5, a: 0.002, d: 0.08 }); this.tone({ f: 140, f2: 70, vol: 0.35, d: 0.12 }); this.play('wood', { vol: 0.25, rate: 1.5 }); },
  sfxKnifeTap() { this.tone({ f: 2400, f2: 1800, type: 'triangle', vol: 0.05, d: 0.08 }); this.nz({ type: 'lowpass', f: 700, vol: 0.2, d: 0.06 }); },
  sfxScrub() { this.nz({ f: rand(2500, 4500), q: 1.2, vol: 0.07, a: 0.01, d: 0.09 }); },
  sfxGrind() { this.nz({ f: rand(600, 1100), q: 2, vol: 0.12, a: 0.01, d: 0.12 }); },
  sfxSlice() { this.nz({ type: 'highpass', f: 3000, f2: 6000, vol: 0.12, a: 0.02, d: 0.25 }); },
  sfxSplash(v = 1) { this.nz({ type: 'lowpass', f: 2500, f2: 500, vol: 0.35 * v, a: 0.005, d: 0.45 }); this.nz({ f: 5000, q: 0.5, vol: 0.12 * v, d: 0.3, when: 0.05 }); },
  sfxPlop() { this.tone({ f: 300, f2: 900, vol: 0.18, d: 0.08 }); this.play('rinse', { vol: 0.25, offset: rand(0.2, 1.5), dur: 0.35 }); },
  sfxSizzle(v = 1) { this.nz({ type: 'highpass', f: 4500, vol: 0.18 * v, a: 0.02, d: rand(0.5, 1.1) }); },
  sfxBubble() { const f = rand(180, 420); this.tone({ f, f2: f * 2.4, vol: 0.08, a: 0.002, d: 0.07 }); },
  sfxPuff() { this.nz({ type: 'lowpass', f: 500, f2: 1600, vol: 0.4, a: 0.05, d: 0.35, dest: this.amb }); },
  sfxWhoosh() { this.nz({ f: 400, f2: 2400, q: 1, vol: 0.25, a: 0.08, d: 0.3 }); },
  sfxBow() { this.tone({ f: 180, f2: 90, type: 'triangle', vol: 0.18, d: 0.25 }); this.nz({ f: 1800, f2: 600, q: 0.7, vol: 0.18, a: 0.01, d: 0.35, when: 0.02 }); },
  sfxReel() { this.tone({ f: rand(1500, 1900), type: 'square', vol: 0.012, a: 0.001, d: 0.025 }); },
  sfxTear() { this.nz({ f: 1800, q: 0.9, vol: 0.12, a: 0.01, d: 0.18 }); },
  sfxUI() { if (!this.play('click', { vol: 0.35 })) this.tone({ f: 900, vol: 0.08, d: 0.06 }); },
  sfxPage() { this.nz({ f: 3500, f2: 1500, q: 0.4, vol: 0.12, a: 0.03, d: 0.3 }); },
  sfxLid() { this.play('lid', { vol: 0.5 }); },
  chime(when = 0, base = 0) {
    const notes = [0, 4, 7, 12];
    notes.forEach((n, i) => this.tone({ f: 784 * Math.pow(2, (n + base) / 12), vol: 0.06, d: 0.9, when: when + i * 0.06, verb: 0.6 }));
  },
  sfxStar(i) { this.tone({ f: 880 * Math.pow(2, [0, 4, 7][i] / 12), type: 'triangle', vol: 0.12, d: 1.4, verb: 0.8 }); this.tone({ f: 1760 * Math.pow(2, [0, 4, 7][i] / 12), vol: 0.05, d: 1.2, verb: 0.8 }); },
  sfxGood() { this.chime(0, 0); },
  sfxSoft() { this.tone({ f: 330, f2: 300, vol: 0.08, d: 0.4, verb: 0.4 }); },

  // ── Ambience beds ─────────────────────────────────────────────────────────
  // kind: 'forest' | 'stream' | 'kitchen' | 'night' | 'quiet'
  ambience(kind) {
    this.wantAmb = kind;
    if (!this.ctx) return;
    const t = this.ctx.currentTime;
    for (const k in this.loops) { const L = this.loops[k]; L.g.gain.setTargetAtTime(0, t, 0.8); setTimeout(() => L.stop(), 4000); delete this.loops[k]; }
    const add = (name, node) => (this.loops[name] = node);
    if (kind === 'forest' || kind === 'stream' || kind === 'night' || kind === 'meadow') add('wind', this.windBed(kind === 'night' ? 0.10 : 0.16));
    if (kind === 'stream') add('water', this.waterBed(0.32));
    if (kind === 'kitchen') add('fire', this.fireBed(0.5));
    if (kind === 'kitchenQuiet') add('fire', this.fireBed(0.18));
    if (kind === 'night') add('crickets', this.cricketBed(0.05));
    clearInterval(this.birdTimer);
    if (kind === 'forest' || kind === 'stream' || kind === 'meadow') {
      this.birdTimer = setInterval(() => { if (Math.random() < 0.45) this.bird(); }, 1400);
    } else if (kind === 'night') {
      this.birdTimer = setInterval(() => { if (Math.random() < 0.08) this.owl(); }, 2000);
    }
  },
  windBed(vol) {
    const ctx = this.ctx, s = ctx.createBufferSource(); s.buffer = this.noise; s.loop = true;
    const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 500; f.Q.value = 0.3;
    const lfo = ctx.createOscillator(); lfo.frequency.value = 0.07; const lg = ctx.createGain(); lg.gain.value = 260; lfo.connect(lg); lg.connect(f.frequency);
    const g = ctx.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(vol, ctx.currentTime, 1.5);
    s.connect(f); f.connect(g); g.connect(this.amb); s.start(); lfo.start();
    return { g, stop: () => { try { s.stop(); lfo.stop(); } catch (_) {} } };
  },
  waterBed(vol) {
    const ctx = this.ctx, g = ctx.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(vol, ctx.currentTime, 1.5); g.connect(this.amb);
    const nodes = [];
    [[700, 1.2, 0.5], [1800, 2, 0.35], [3600, 3, 0.2]].forEach(([fr, q, v], i) => {
      const s = ctx.createBufferSource(); s.buffer = this.noise; s.loop = true; s.playbackRate.value = 0.9 + i * 0.07;
      const f = ctx.createBiquadFilter(); f.type = 'bandpass'; f.frequency.value = fr; f.Q.value = q;
      const lfo = ctx.createOscillator(); lfo.frequency.value = 0.3 + i * 0.41; const lg = ctx.createGain(); lg.gain.value = fr * 0.35; lfo.connect(lg); lg.connect(f.frequency);
      const vg = ctx.createGain(); vg.gain.value = v; s.connect(f); f.connect(vg); vg.connect(g); s.start(); lfo.start(); nodes.push(s, lfo);
    });
    const babble = setInterval(() => { if (Math.random() < 0.7) { const fr = rand(500, 1400); this.tone({ f: fr, f2: fr * rand(1.3, 1.9), vol: 0.025, a: 0.003, d: 0.05, dest: g }); } }, 90);
    return { g, stop: () => { clearInterval(babble); nodes.forEach((n) => { try { n.stop(); } catch (_) {} }); } };
  },
  fireBed(vol) {
    const ctx = this.ctx, g = ctx.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(vol, ctx.currentTime, 1); g.connect(this.amb);
    let src = null, timer = null;
    if (this.buffers.fire) {
      src = ctx.createBufferSource(); src.buffer = this.buffers.fire; src.loop = true; src.connect(g); src.start();
    } else {
      const s = ctx.createBufferSource(); s.buffer = this.noise; s.loop = true;
      const f = ctx.createBiquadFilter(); f.type = 'lowpass'; f.frequency.value = 180;
      const vg = ctx.createGain(); vg.gain.value = 0.7; s.connect(f); f.connect(vg); vg.connect(g); s.start(); src = s;
      timer = setInterval(() => { if (Math.random() < 0.6) this.nz({ f: rand(1500, 5000), q: 3, vol: rand(0.04, 0.22), a: 0.001, d: rand(0.01, 0.05), dest: g }); }, 70);
    }
    this.fireGain = g;
    return { g, stop: () => { clearInterval(timer); try { src.stop(); } catch (_) {} } };
  },
  cricketBed(vol) {
    const ctx = this.ctx, g = ctx.createGain(); g.gain.value = 0; g.gain.setTargetAtTime(vol, ctx.currentTime, 2); g.connect(this.amb);
    const timer = setInterval(() => {
      for (let i = 0; i < 3; i++) this.tone({ f: 4200 + Math.random() * 300, vol: 0.5, a: 0.004, d: 0.03, dest: g, when: i * 0.06 });
    }, 900);
    return { g, stop: () => clearInterval(timer) };
  },
  bird() {
    if (!this.ctx) return;
    const type = (Math.random() * 3) | 0, base = rand(2200, 4200), n = 2 + ((Math.random() * 5) | 0);
    const g = this.ctx.createGain(); g.gain.value = rand(0.02, 0.06);
    const pan = this.ctx.createStereoPanner ? this.ctx.createStereoPanner() : null;
    if (pan) { pan.pan.value = rand(-0.8, 0.8); g.connect(pan); pan.connect(this.amb); } else g.connect(this.amb);
    const v = this.ctx.createGain(); v.gain.value = 0.4; g.connect(v); v.connect(this.verb);
    for (let i = 0; i < n; i++) {
      const w = i * (type === 0 ? 0.11 : type === 1 ? 0.18 : 0.08);
      if (type === 0) this.tone({ f: base, f2: base * 1.5, vol: 1, a: 0.01, d: 0.06, dest: g, when: w });
      else if (type === 1) this.tone({ f: base * 1.3, f2: base * 0.8, vol: 1, a: 0.01, d: 0.12, dest: g, when: w });
      else this.tone({ f: base * (i % 2 ? 1.2 : 1), vol: 0.8, a: 0.005, d: 0.05, dest: g, when: w });
    }
  },
  owl() {
    [0, 0.5, 0.75].forEach((w, i) => this.tone({ f: i ? 380 : 420, f2: i ? 360 : 380, vol: 0.05, a: 0.06, d: i ? 0.5 : 0.3, dest: this.amb, when: w, verb: 0.6 }));
  },

  // ── Generative music: a soft kalimba and pad that wander a pentatonic scale ──
  startMusic() {
    if (this.started) return;
    this.started = true;
    const scale = [0, 2, 4, 7, 9, 12, 14, 16, 19, 21];
    const chords = [[0, 4, 7], [-3, 0, 4], [-7, -3, 0], [-5, -1, 2]];
    let step = 0, chord = 0;
    const root = 261.63;
    const tick = () => {
      if (!this.ctx) return;
      const mood = this.mood || 1;
      if (step % 16 === 0) {
        chord = (chord + 1) % chords.length;
        chords[chord].forEach((n) => this.pad(root / 2 * Math.pow(2, n / 12), 6.5));
      }
      if (Math.random() < 0.42 * mood) {
        const n = scale[(Math.random() * scale.length) | 0] + (Math.random() < 0.3 ? 12 : 0);
        this.kalimba(root * Math.pow(2, n / 12));
      }
      step++;
    };
    this.musicTimer = setInterval(tick, 420);
  },
  kalimba(f) {
    const ctx = this.ctx, t = ctx.currentTime;
    const o = ctx.createOscillator(); o.type = 'sine'; o.frequency.value = f;
    const o2 = ctx.createOscillator(); o2.type = 'sine'; o2.frequency.value = f * 4.02;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.11, t + 0.004); g.gain.exponentialRampToValueAtTime(0.0005, t + 1.8);
    const g2 = ctx.createGain(); g2.gain.setValueAtTime(0.04, t); g2.gain.exponentialRampToValueAtTime(0.0005, t + 0.25);
    o.connect(g); o2.connect(g2); g2.connect(g); g.connect(this.music);
    const v = ctx.createGain(); v.gain.value = 0.7; g.connect(v); v.connect(this.verb);
    o.start(t); o2.start(t); o.stop(t + 2); o2.stop(t + 2);
  },
  pad(f, dur) {
    const ctx = this.ctx, t = ctx.currentTime;
    const g = ctx.createGain(); g.gain.setValueAtTime(0, t); g.gain.linearRampToValueAtTime(0.03, t + 2); g.gain.linearRampToValueAtTime(0, t + dur);
    const fl = ctx.createBiquadFilter(); fl.type = 'lowpass'; fl.frequency.value = 900;
    [-6, 6].forEach((det) => { const o = ctx.createOscillator(); o.type = 'triangle'; o.frequency.value = f; o.detune.value = det; o.connect(fl); o.start(t); o.stop(t + dur + 0.1); });
    fl.connect(g); g.connect(this.music);
    const v = ctx.createGain(); v.gain.value = 0.6; g.connect(v); v.connect(this.verb);
  },
};
