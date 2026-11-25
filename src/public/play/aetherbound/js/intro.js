// Aetherbound: the opening. 2026 city, the accident, the Ledger, rebirth, first boot.
(function () {
  const I = {};
  let t = 0, done = null, phase = 'city', waitFist = false, fistT = -1, montageT = -1, offerShown = false;
  let rain = [], pages = [], windows = [];
  const subs = [
    [0.8, 6.5, 'Thirty-four years old. Same rain, same street, same excuses.'],
    [6.8, 13.0, 'My mother kept calling. I kept meaning to call back.'],
    [15.2, 18.6, 'A kid on the crossing. Headlights. I moved before I thought.'],
    [23.0, 28.5, 'So this is what dying looks like. A filing system.'],
    [29.0, 35.0, 'My page was almost empty. I had wasted all of it.'],
    [37.0, 41.5, 'Warm. Loud. Someone was crying, and I realised it was me.'],
    [41.8, 46.0, 'A woman sang words I did not know. One of them was my new name.'],
  ];
  const notes = [
    [2.0, 'Mom', 'Are you eating okay?'],
    [4.5, 'Mom', 'Call me back when you can.'],
    [7.5, 'Mom', 'Your dad asked about you.'],
    [10.0, 'System', 'Battery 3%'],
  ];

  function rand(a, b) { return a + Math.random() * (b - a); }

  I.start = function (cb) {
    done = cb; t = 0; phase = 'city'; waitFist = false; fistT = -1; montageT = -1; offerShown = false;
    rain = Array.from({ length: 220 }, () => ({ x: Math.random(), y: Math.random(), s: rand(0.6, 1.4) }));
    pages = Array.from({ length: 40 }, (_, i) => ({ x: Math.random(), y: Math.random(), z: rand(0.3, 1.2), r: rand(-0.4, 0.4), vr: rand(-0.2, 0.2), id: i }));
    windows = Array.from({ length: 140 }, () => ({ b: Math.floor(Math.random() * 9), x: Math.random(), y: Math.random(), on: Math.random() < 0.35 }));
    AB.Audio.ambience('rain');
    I.cues = {};
  };

  function cue(name, at, fn) { if (t >= at && !I.cues[name]) { I.cues[name] = true; fn(); } }

  I.skip = function () {
    if (phase === 'boot' && !offerShown) { offerShown = true; birthOffer(); return; }
    if (phase === 'boot' || phase === 'montage') { if (AB.UI.offerOpen()) return; finish(); return; }
    t = 46; phase = 'boot'; AB.Audio.ambience('void');
  };

  function finish() { const d = done; done = null; AB.Audio.ambience(null); if (d) d(); }

  function birthOffer() {
    AB.Ledger.S.offers = [];
    AB.Ledger.queueOffer('Birth gift');
    const o = AB.Ledger.S.offers.shift();
    AB.UI.showOffer(o, a => { AB.Ledger.takeAbility(a); phase = 'montage'; montageT = 0; });
  }

  I.input = function () {
    if (phase === 'boot' && waitFist && fistT < 0) {
      fistT = 0; AB.Audio.sfx('skill');
      AB.Ledger.skillXP('manaSense', 30, {});
    }
  };

  I.update = function (dt) {
    t += dt;
    if (phase === 'city') {
      cue('brake', 14.6, () => AB.Audio.sfx('brake'));
      cue('impact', 19.0, () => { AB.Audio.sfx('impact'); AB.Audio.ambience(null); });
      if (t > 21.5) { phase = 'void'; AB.Audio.ambience('void'); AB.Audio.sfx('glitch'); }
    } else if (phase === 'void') {
      cue('g2', 26, () => AB.Audio.sfx('glitch'));
      cue('g3', 31, () => AB.Audio.sfx('glitch'));
      if (t > 36) { phase = 'birth'; AB.Audio.ambience(null); }
    } else if (phase === 'birth') {
      if (Math.floor(t / 0.9) !== Math.floor((t - dt) / 0.9)) AB.Audio.sfx('heartbeat');
      if (t > 46.5) { phase = 'boot'; AB.Audio.ambience('void'); AB.Audio.sfx('glitch'); }
    } else if (phase === 'boot') {
      if (t > 52 && !waitFist) waitFist = true;
      if (fistT >= 0) { fistT += dt; if (fistT > 1.8 && !offerShown) { offerShown = true; birthOffer(); } }
    } else if (phase === 'montage') {
      montageT += dt;
      if (montageT > 10.5) finish();
    }
  };

  // ---------- Drawing ----------
  I.draw = function (ctx, w, h) {
    ctx.fillStyle = '#000'; ctx.fillRect(0, 0, w, h);
    if (phase === 'city') drawCity(ctx, w, h);
    else if (phase === 'void') drawVoid(ctx, w, h);
    else if (phase === 'birth') drawBirth(ctx, w, h);
    else if (phase === 'boot') drawBoot(ctx, w, h);
    else if (phase === 'montage') drawMontage(ctx, w, h);
    // Subtitles.
    for (const [a, b, s] of subs) if (t >= a && t <= b) subtitle(ctx, w, h, s, Math.min(1, (t - a) * 2, (b - t) * 2));
  };

  function subtitle(ctx, w, h, s, al) {
    ctx.globalAlpha = Math.max(0, al);
    ctx.font = `italic ${Math.max(15, Math.min(22, w / 45))}px "Cormorant Garamond", Georgia, serif`;
    ctx.textAlign = 'center';
    ctx.fillStyle = 'rgba(0,0,0,0.6)';
    const tw = ctx.measureText(s).width;
    ctx.fillRect(w / 2 - tw / 2 - 14, h - 92, tw + 28, 34);
    ctx.fillStyle = '#e8e1d3'; ctx.fillText(s, w / 2, h - 69);
    ctx.globalAlpha = 1;
  }

  function drawCity(ctx, w, h) {
    const g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, '#05060a'); g.addColorStop(1, '#141824');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const pan = t * 6;
    // Buildings, two layers.
    for (let layer = 0; layer < 2; layer++) {
      const n = 9, bw = w / 6;
      for (let i = 0; i < n; i++) {
        const x = ((i * bw * 1.1 - pan * (layer + 1)) % (n * bw * 1.1) + n * bw * 1.1) % (n * bw * 1.1) - bw;
        const bh = h * (0.35 + ((i * 37 + layer * 13) % 7) / 14) * (layer ? 1 : 0.8);
        ctx.fillStyle = layer ? '#0b0d14' : '#10131c';
        ctx.fillRect(x, h * 0.72 - bh, bw * 0.9, bh);
        for (const wi of windows) if (wi.b === i && wi.on) {
          ctx.fillStyle = layer ? 'rgba(255,200,120,0.55)' : 'rgba(150,180,255,0.25)';
          ctx.fillRect(x + 8 + wi.x * (bw * 0.9 - 20), h * 0.72 - bh + 10 + wi.y * (bh - 30), 6, 8);
        }
      }
    }
    // Street, crossing, reflections.
    ctx.fillStyle = '#0a0b10'; ctx.fillRect(0, h * 0.72, w, h * 0.28);
    ctx.fillStyle = 'rgba(232,225,211,0.12)';
    for (let i = 0; i < 9; i++) ctx.fillRect(w * 0.3 + i * w * 0.045, h * 0.8, w * 0.025, h * 0.12);
    // Streetlight + neon sign.
    ctx.fillStyle = 'rgba(255,190,110,0.08)'; ctx.beginPath(); ctx.moveTo(w * 0.15, h * 0.3); ctx.lineTo(w * 0.05, h); ctx.lineTo(w * 0.27, h); ctx.fill();
    ctx.fillStyle = `rgba(200,50,60,${0.5 + Math.sin(t * 9) * 0.2 * (Math.random() < 0.05 ? 0 : 1)})`;
    ctx.font = '700 22px "JetBrains Mono", monospace'; ctx.textAlign = 'left'; ctx.fillText('OPEN 24H', w * 0.68, h * 0.42);
    // Kid on the crossing and the man.
    if (t > 13) {
      ctx.fillStyle = '#1b1b22';
      ctx.fillRect(w * 0.55, h * 0.78, 10, 26); ctx.beginPath(); ctx.arc(w * 0.55 + 5, h * 0.77, 7, 0, 7); ctx.fill();
      const mx = t > 16 ? w * 0.45 + Math.min(1, (t - 16) / 1.5) * w * 0.08 : w * 0.45;
      ctx.fillRect(mx, h * 0.74, 14, 42); ctx.beginPath(); ctx.arc(mx + 7, h * 0.73, 9, 0, 7); ctx.fill();
    }
    // Headlights.
    if (t > 14) {
      const k = Math.min(1, (t - 14) / 5);
      const hx = w * (1.1 - k * 0.5), r = 30 + k * w * 0.6;
      const lg = ctx.createRadialGradient(hx, h * 0.8, 0, hx, h * 0.8, r);
      lg.addColorStop(0, `rgba(255,255,240,${0.4 + k * 0.6})`); lg.addColorStop(1, 'rgba(255,255,240,0)');
      ctx.fillStyle = lg; ctx.fillRect(0, 0, w, h);
    }
    // Rain.
    ctx.strokeStyle = 'rgba(170,190,220,0.35)'; ctx.lineWidth = 1;
    ctx.beginPath();
    for (const r of rain) {
      const y = ((r.y + t * 0.9 * r.s) % 1) * h, x = (r.x * w + y * 0.12) % w;
      ctx.moveTo(x, y); ctx.lineTo(x - 2, y + 14 * r.s);
    }
    ctx.stroke();
    // Phone in hand.
    if (t < 14) {
      const pw = Math.min(260, w * 0.34), ph = pw * 1.25, px = w - pw - 30, py = h - ph - 110;
      ctx.fillStyle = 'rgba(12,12,16,0.92)'; ctx.fillRect(px, py, pw, ph);
      ctx.strokeStyle = '#2a2a33'; ctx.strokeRect(px, py, pw, ph);
      ctx.font = '12px "JetBrains Mono", monospace'; ctx.textAlign = 'left';
      ctx.fillStyle = '#c8323c'; ctx.fillText('3%', px + pw - 34, py + 18);
      ctx.fillStyle = '#9a958c'; ctx.fillText('23:47 · Wed', px + 12, py + 18);
      let ny = py + 40;
      for (const [at, who, msg] of notes) {
        if (t < at) continue;
        ctx.fillStyle = 'rgba(255,255,255,0.06)'; ctx.fillRect(px + 10, ny, pw - 20, 44);
        ctx.fillStyle = who === 'System' ? '#c8323c' : '#e8e1d3'; ctx.font = '700 12px "JetBrains Mono", monospace'; ctx.fillText(who, px + 18, ny + 17);
        ctx.fillStyle = '#b8b2a6'; ctx.font = '12px "JetBrains Mono", monospace'; ctx.fillText(msg, px + 18, ny + 34);
        ny += 52;
      }
    }
    // White flash, then black.
    if (t > 18.6) {
      const k = t < 19.2 ? (t - 18.6) / 0.6 : Math.max(0, 1 - (t - 19.2) / 0.8);
      ctx.fillStyle = `rgba(255,255,255,${k})`; ctx.fillRect(0, 0, w, h);
      if (t > 20) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, (t - 20) / 0.5)})`; ctx.fillRect(0, 0, w, h); }
    }
  }

  function drawPage(ctx, x, y, s, r, label, hot) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(r); ctx.scale(s, s);
    ctx.fillStyle = hot ? '#e8e1d3' : 'rgba(232,225,211,0.16)'; ctx.fillRect(-30, -40, 60, 80);
    ctx.fillStyle = hot ? 'rgba(0,0,0,0.5)' : 'rgba(0,0,0,0.35)';
    for (let i = 0; i < 9; i++) ctx.fillRect(-22, -30 + i * 7, 30 + ((i * 13) % 14), 2);
    if (label) { ctx.fillStyle = '#c8323c'; ctx.font = '700 7px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.fillText(label, 0, 36); }
    ctx.restore();
  }

  function drawVoid(ctx, w, h) {
    const lt = t - 21.5;
    for (const p of pages) {
      const z = p.z;
      const x = ((p.x + Math.sin(lt * 0.1 + p.id) * 0.02) * w);
      const y = ((p.y - lt * 0.02 * z + 2) % 1) * h;
      const label = p.id % 9 === 3 ? `ENTRY 2026-Δ-${String(p.id).padStart(2, '0')}` : null;
      ctx.globalAlpha = Math.min(1, lt / 2) * (0.3 + z * 0.5);
      drawPage(ctx, x, y, z * 1.2, p.r + lt * p.vr, label, false);
    }
    ctx.globalAlpha = 1;
    // His page, centre.
    if (lt > 6) {
      const k = Math.min(1, (lt - 6) / 2);
      ctx.globalAlpha = k; drawPage(ctx, w / 2, h * 0.42, 2.4, 0, 'ENTRY 2026-Δ-00', true); ctx.globalAlpha = 1;
    }
    const lines = [[1.5, '[SUBJECT EXPIRED]'], [4.0, 'Cause: blunt trauma. Others recorded: 7.'], [8.0, 'Record review: 34 years. Mostly blank.'], [11.5, 'Opening new entry.']];
    ctx.textAlign = 'center';
    let y = h * 0.72;
    for (const [at, s] of lines) {
      if (lt < at) continue;
      const n = Math.min(s.length, Math.floor((lt - at) * 28));
      const glitch = Math.random() < 0.04;
      ctx.font = '700 16px "JetBrains Mono", monospace';
      ctx.fillStyle = glitch ? '#e8e1d3' : '#c8323c';
      ctx.fillText(s.slice(0, n) + (n < s.length ? '█' : ''), w / 2 + (glitch ? rand(-4, 4) : 0), y);
      y += 26;
    }
  }

  function drawBirth(ctx, w, h) {
    const lt = t - 36;
    const g = ctx.createRadialGradient(w / 2, h * 0.4, 10, w / 2, h * 0.4, Math.max(w, h) * (0.4 + lt * 0.04));
    g.addColorStop(0, `rgba(255,214,160,${Math.min(1, lt / 2)})`); g.addColorStop(0.5, 'rgba(160,90,60,0.6)'); g.addColorStop(1, 'rgba(20,10,10,1)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    // Blurry faces / shapes.
    ctx.filter = 'blur(18px)';
    ctx.fillStyle = 'rgba(80,50,40,0.6)'; ctx.beginPath(); ctx.arc(w * 0.45 + Math.sin(lt) * 10, h * 0.35, Math.min(w, h) * 0.18, 0, 7); ctx.fill();
    ctx.fillStyle = 'rgba(201,164,106,0.6)'; ctx.beginPath(); ctx.arc(w * 0.45 + Math.sin(lt) * 10, h * 0.26, Math.min(w, h) * 0.16, Math.PI, 0); ctx.fill();
    ctx.filter = 'none';
    // Tiny hands.
    const hy = h * 0.92 - Math.min(1, lt / 3) * h * 0.12;
    ctx.fillStyle = '#e0b090';
    for (const sx of [-1, 1]) {
      const x = w / 2 + sx * w * 0.14;
      ctx.beginPath(); ctx.ellipse(x, hy, 34, 26, 0, 0, 7); ctx.fill();
      for (let f = 0; f < 4; f++) { ctx.beginPath(); ctx.ellipse(x - 22 + f * 14, hy - 26, 7, 12, 0, 0, 7); ctx.fill(); }
      ctx.beginPath(); ctx.ellipse(x - sx * 34, hy - 6, 8, 14, sx * 0.8, 0, 7); ctx.fill();
    }
    // Unknown words.
    if (lt > 5) {
      ctx.globalAlpha = Math.min(1, (lt - 5));
      ctx.font = '24px "Cormorant Garamond", Georgia, serif'; ctx.textAlign = 'center'; ctx.fillStyle = '#3a2418';
      ctx.fillText('ᚲᚨᛃᛞᛖᚾ · ᛗᛁ ᛚᛁᛏᛚᛖ ᛚᛁᚷᚺᛏ', w / 2, h * 0.16);
      ctx.globalAlpha = 1;
    }
    if (lt > 9.5) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, (lt - 9.5) * 2)})`; ctx.fillRect(0, 0, w, h); }
  }

  function drawBoot(ctx, w, h) {
    const lt = t - 46.5;
    ctx.fillStyle = '#050506'; ctx.fillRect(0, 0, w, h);
    // Faint warm room behind the glass.
    const g = ctx.createRadialGradient(w / 2, h / 2, 10, w / 2, h / 2, Math.max(w, h));
    g.addColorStop(0, 'rgba(90,50,30,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, w, h);
    const S = AB.Ledger.S;
    const lines = [
      '╔═ LEDGER · SUBJECT 2026-Δ-00 ══════════╗',
      `  NAME     ${S.name.toUpperCase()}`,
      '  AGE      0',
      '  LEVEL    1',
      '  HP 4/4   MANA 1/1',
      '  ORIGIN   Earthborn',
      '  TRAIT    Ledger-Marked (no effect)',
      '  STATUS   Infant. Helpless. Watched.',
      '╚══════════════════════════════════════╝',
    ];
    const fs = Math.max(12, Math.min(18, w / 42));
    ctx.font = `${fs}px "JetBrains Mono", monospace`; ctx.textAlign = 'left';
    const bw = ctx.measureText(lines[0]).width;
    const x0 = w / 2 - bw / 2, y0 = h * 0.26;
    lines.forEach((s, i) => {
      const at = i * 0.45;
      if (lt < at) return;
      const n = Math.min(s.length, Math.floor((lt - at) * 60));
      const glitch = Math.random() < 0.03;
      ctx.fillStyle = i === 0 || i === lines.length - 1 ? '#c8323c' : (i === 6 ? '#e8b04a' : '#e8e1d3');
      ctx.fillText(s.slice(0, n), x0 + (glitch ? rand(-3, 3) : 0), y0 + i * fs * 1.5);
    });
    if (waitFist) {
      ctx.textAlign = 'center';
      if (fistT < 0) {
        ctx.globalAlpha = 0.6 + Math.sin(t * 4) * 0.4;
        ctx.fillStyle = '#c8323c'; ctx.font = `700 ${fs}px "JetBrains Mono", monospace`;
        ctx.fillText(AB.Input.touch ? '[DIRECTIVE] Clench your fist. (tap)' : '[DIRECTIVE] Clench your fist. (Space / click)', w / 2, y0 + 11 * fs * 1.5);
        ctx.globalAlpha = 1;
      } else {
        ctx.fillStyle = '#7cc6ff'; ctx.font = `700 ${fs + 2}px "JetBrains Mono", monospace`;
        ctx.fillText('[Mana Sense +1]   A faint warmth answers.', w / 2, y0 + 11 * fs * 1.5);
        ctx.fillStyle = 'rgba(124,198,255,0.2)';
        ctx.beginPath(); ctx.arc(w / 2, h * 0.86, 30 + fistT * 40, 0, 7); ctx.fill();
      }
    }
  }

  function drawMontage(ctx, w, h) {
    const beats = [[0, 'Age 1', 'First words. Nobody expects them to be this clear.'], [2.5, 'Age 3', 'A sister is born. Mira. She grabs my finger and does not let go.'], [5.0, 'Age 5', 'Secret spell practice behind the barn. The Ledger counts every one.'], [7.5, 'Age 6', 'Thornwick. A frontier village at the edge of the Ashwood.']];
    let cur = beats[0];
    for (const b of beats) if (montageT >= b[0]) cur = b;
    const lt = montageT - cur[0];
    const al = Math.min(1, lt * 2, (2.5 - lt) * 2 + (cur === beats[3] ? 9 : 0));
    ctx.fillStyle = '#050506'; ctx.fillRect(0, 0, w, h);
    ctx.globalAlpha = Math.max(0, al);
    ctx.textAlign = 'center';
    ctx.fillStyle = '#c8323c'; ctx.font = `800 ${Math.min(56, w / 12)}px Cinzel, serif`; ctx.fillText(cur[1].toUpperCase(), w / 2, h * 0.45);
    ctx.fillStyle = '#e8e1d3'; ctx.font = `italic ${Math.max(16, Math.min(24, w / 40))}px "Cormorant Garamond", Georgia, serif`; ctx.fillText(cur[2], w / 2, h * 0.45 + 48);
    ctx.globalAlpha = 1;
    if (montageT > 9.6) { ctx.fillStyle = `rgba(0,0,0,${Math.min(1, (montageT - 9.6) / 0.9)})`; ctx.fillRect(0, 0, w, h); }
  }

  I.phase = () => phase;
  AB.Intro = I;
})();
