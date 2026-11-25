// Aetherbound: player, creatures, NPCs, projectiles, particles.
(function () {
  const W = AB.World, L = AB.Ledger;
  const E = {};

  // ---------- Character drawing (top-down 3/4) ----------
  E.drawChar = function (ctx, x, y, o) {
    const s = o.scale || 1;
    const bob = o.moving ? Math.sin(o.t * 14) * 1.5 : 0;
    ctx.save(); ctx.translate(x, y);
    if (o.flash) ctx.globalAlpha = 0.55;
    ctx.fillStyle = 'rgba(0,0,0,0.38)'; ctx.beginPath(); ctx.ellipse(0, 2, 11 * s, 4.5 * s, 0, 0, 7); ctx.fill();
    // Legs.
    ctx.fillStyle = '#1a1416';
    const lg = o.moving ? Math.sin(o.t * 14) * 3 : 0;
    ctx.fillRect(-5 * s, -8 * s + lg, 4 * s, 9 * s - lg); ctx.fillRect(1 * s, -8 * s - lg, 4 * s, 9 * s + lg);
    // Body / cloak.
    ctx.fillStyle = o.body;
    ctx.beginPath(); ctx.moveTo(-9 * s, -6 * s + bob); ctx.lineTo(-7 * s, -24 * s + bob); ctx.lineTo(7 * s, -24 * s + bob); ctx.lineTo(9 * s, -6 * s + bob); ctx.closePath(); ctx.fill();
    if (o.trim) { ctx.fillStyle = o.trim; ctx.fillRect(-9 * s, -8 * s + bob, 18 * s, 2 * s); }
    // Head.
    ctx.fillStyle = o.skin || '#d7b48f'; ctx.beginPath(); ctx.arc(0, -30 * s + bob, 8 * s, 0, 7); ctx.fill();
    ctx.fillStyle = o.hair;
    const fx = Math.cos(o.face || 0), fy = Math.sin(o.face || 0);
    ctx.beginPath(); ctx.arc(-fx * 1.5 * s, -32 * s + bob - fy * 1.5 * s, 8.2 * s, Math.PI * 0.95, Math.PI * 2.05); ctx.fill();
    if (fy > -0.3) { // eyes when facing camera-ish
      ctx.fillStyle = '#1a1410';
      ctx.fillRect(-3.5 * s + fx * 2 * s, -30 * s + bob, 1.6 * s, 2 * s); ctx.fillRect(2 * s + fx * 2 * s, -30 * s + bob, 1.6 * s, 2 * s);
    }
    if (o.extra) o.extra(ctx, s, bob);
    ctx.restore();
  };

  // ---------- Particles and floating text ----------
  E.particles = []; E.texts = [];
  E.burst = function (x, y, color, n, speed, life) {
    for (let i = 0; i < n; i++) {
      const a = Math.random() * 6.28, v = (0.3 + Math.random()) * (speed || 80);
      E.particles.push({ x, y, vx: Math.cos(a) * v, vy: Math.sin(a) * v - 20, life: life || 0.6, max: life || 0.6, color, r: 1.5 + Math.random() * 2 });
    }
  };
  E.float = function (x, y, text, color, big) { E.texts.push({ x, y, text, color: color || '#e8e1d3', life: 1, big }); };
  E.updateFx = function (dt) {
    E.particles = E.particles.filter(p => (p.life -= dt) > 0);
    for (const p of E.particles) { p.x += p.vx * dt; p.y += p.vy * dt; p.vy += 60 * dt; p.vx *= 0.96; }
    E.texts = E.texts.filter(t => (t.life -= dt) > 0);
    for (const t of E.texts) t.y -= 30 * dt;
  };
  E.drawFx = function (ctx) {
    for (const p of E.particles) { ctx.globalAlpha = p.life / p.max; ctx.fillStyle = p.color; ctx.fillRect(p.x - p.r / 2, p.y - p.r / 2, p.r, p.r); }
    ctx.globalAlpha = 1;
    ctx.textAlign = 'center';
    for (const t of E.texts) {
      ctx.globalAlpha = Math.min(1, t.life * 2);
      ctx.font = (t.big ? '700 16px' : '700 12px') + ' "JetBrains Mono", monospace';
      ctx.fillStyle = '#000'; ctx.fillText(t.text, t.x + 1, t.y + 1);
      ctx.fillStyle = t.color; ctx.fillText(t.text, t.x, t.y);
    }
    ctx.globalAlpha = 1;
  };

  // ---------- Movement with collision ----------
  function moveBody(b, dx, dy, r) {
    if (dx && !W.solidAt(b.x + dx, b.y, r)) b.x += dx;
    if (dy && !W.solidAt(b.x, b.y + dy, r)) b.y += dy;
  }
  E.moveBody = moveBody;

  // ---------- Player ----------
  E.Player = function (x, y) {
    Object.assign(this, { x, y, r: 9, face: Math.PI / 2, moving: false, atkCd: 0, castCd: 0, healCd: 0, swing: 0, inv: 0, still: 0, dashT: 0, dashCd: 0, senseT: 0, senseCd: 0, secondWindUsed: false, t: 0, hurtFlash: 0 });
  };
  E.Player.prototype.draw = function (ctx) {
    const p = this;
    const sw = p.swing;
    E.drawChar(ctx, p.x, p.y, {
      body: '#7a2a2e', trim: '#e8e1d3', hair: '#2a1d14', scale: 0.82, face: p.face, moving: p.moving, t: p.t, flash: p.inv > 0 && Math.floor(p.t * 20) % 2 === 0,
      extra: (c, s, bob) => {
        // Wooden sword, swinging through an arc.
        const base = p.face + (sw > 0 ? (sw / 0.22 - 0.5) * 2.2 : 0.9);
        c.save(); c.translate(0, -18 * s + bob); c.rotate(base);
        c.fillStyle = L.S.flags.swordUp ? '#c9ccd1' : '#8a6a44'; c.fillRect(6, -2, 22, 4);
        c.fillStyle = '#3a2c20'; c.fillRect(2, -4, 4, 8);
        c.restore();
        if (sw > 0) {
          c.strokeStyle = `rgba(232,225,211,${sw / 0.22 * 0.6})`; c.lineWidth = 3;
          c.beginPath(); c.arc(0, -16 * s, 34, p.face - 1.1, p.face + 1.1); c.stroke();
        }
      },
    });
    if (p.dashT > 0) E.burst(p.x, p.y - 6, 'rgba(124,198,255,0.8)', 2, 30, 0.3);
  };

  // ---------- Enemies ----------
  E.Enemy = function (type, x, y) {
    const d = AB.ENEMIES[type];
    Object.assign(this, { type, d, x, y, hx: x, hy: y, hp: d.hp, r: d.r, state: 'idle', aware: false, wanderT: Math.random() * 2, wx: 0, wy: 0, atkCd: 0, lunge: 0, flash: 0, t: Math.random() * 10, kb: { x: 0, y: 0 }, dead: false, respawn: 0, howls: 0, stealthT: 0 });
  };
  E.Enemy.prototype.update = function (dt, g) {
    const e = this, p = g.player;
    e.t += dt;
    if (e.dead) {
      if (e.d.boss) return;
      e.respawn -= dt;
      if (e.respawn <= 0 && Math.hypot(p.x - e.hx, p.y - e.hy) > 420) { e.dead = false; e.hp = e.d.hp; e.x = e.hx; e.y = e.hy; e.aware = false; }
      return;
    }
    if (e.flash > 0) e.flash -= dt;
    // Knockback.
    if (Math.abs(e.kb.x) + Math.abs(e.kb.y) > 1) { moveBody(e, e.kb.x * dt, e.kb.y * dt, e.r * 0.6); e.kb.x *= 0.86; e.kb.y *= 0.86; }
    const dx = p.x - e.x, dy = p.y - e.y, dist = Math.hypot(dx, dy);
    const aggro = e.d.aggro * (g.aggroMult || 1);
    if (!e.aware && dist < aggro && g.alive) { e.aware = true; if (e.type === 'wolf' || e.type === 'alpha') AB.Audio.sfx('howl'); }
    if (e.aware && dist > aggro * 2.4) e.aware = false;
    e.atkCd -= dt;
    let sp = e.d.speed;
    if (!e.aware) {
      e.wanderT -= dt;
      if (e.wanderT <= 0) { e.wanderT = 1.5 + Math.random() * 2.5; const a = Math.random() * 6.28; e.wx = Math.cos(a); e.wy = Math.sin(a); if (Math.random() < 0.4) e.wx = e.wy = 0; }
      if (Math.hypot(e.x - e.hx, e.y - e.hy) > 120) { const a = Math.atan2(e.hy - e.y, e.hx - e.x); e.wx = Math.cos(a); e.wy = Math.sin(a); }
      moveBody(e, e.wx * sp * 0.35 * dt, e.wy * sp * 0.35 * dt, e.r * 0.6);
      return;
    }
    // Slimes hop.
    if (e.type === 'slime') {
      const hop = (Math.sin(e.t * 5) + 1) / 2;
      sp *= hop * 1.8;
    }
    if (e.lunge > 0) {
      e.lunge -= dt;
      moveBody(e, e.lx * 330 * dt, e.ly * 330 * dt, e.r * 0.6);
    } else if (dist > e.r + 12) {
      moveBody(e, dx / dist * sp * dt, dy / dist * sp * dt, e.r * 0.6);
    }
    if (e.type !== 'slime' && e.atkCd <= 0 && dist < 110 && dist > 30 && e.lunge <= 0) {
      e.lunge = 0.22; e.lx = dx / dist; e.ly = dy / dist; e.atkCd = e.d.boss ? 1.3 : 1.8;
    }
    if (dist < e.r + p.r + 4 && (e.type === 'slime' ? e.atkCd <= 0 : e.lunge > 0 || e.atkCd <= 0)) {
      g.hurtPlayer(e.d.dmg, e);
      e.atkCd = Math.max(e.atkCd, e.type === 'slime' ? 1.2 : 0.9);
      e.lunge = 0;
    }
    // Alpha calls the pack at 60% and 30%.
    if (e.d.boss && e.howls < 2 && e.hp < e.d.hp * (e.howls === 0 ? 0.6 : 0.3)) {
      e.howls++;
      AB.Audio.sfx('howl');
      AB.UI.log('The Alpha calls its pack.', 'warn');
      for (let i = 0; i < 2; i++) {
        const w = new E.Enemy('wolf', e.x + (i ? 80 : -80), e.y + 60);
        w.aware = true; w.summoned = true; g.enemies.push(w);
      }
    }
  };
  E.Enemy.prototype.draw = function (ctx, g) {
    const e = this;
    if (e.dead) return;
    ctx.save(); ctx.translate(e.x, e.y);
    const fl = e.flash > 0;
    ctx.fillStyle = 'rgba(0,0,0,0.4)'; ctx.beginPath(); ctx.ellipse(0, 3, e.r * 1.1, e.r * 0.45, 0, 0, 7); ctx.fill();
    if (e.type === 'slime') {
      const sq = 1 + Math.sin(e.t * 5) * 0.12;
      ctx.fillStyle = fl ? '#e8e1d3' : e.d.color;
      ctx.beginPath(); ctx.ellipse(0, -e.r * 0.8 / sq, e.r * sq, e.r * 0.85 / sq, 0, 0, 7); ctx.fill();
      ctx.fillStyle = 'rgba(255,255,255,0.25)'; ctx.beginPath(); ctx.arc(-4, -e.r * 1.1, 3, 0, 7); ctx.fill();
      ctx.fillStyle = '#101010'; ctx.fillRect(-4, -e.r * 0.9, 2, 3); ctx.fillRect(2, -e.r * 0.9, 2, 3);
    } else {
      const dir = g.player.x < e.x ? -1 : 1;
      const k = e.r / 13;
      ctx.scale(dir * k, k);
      const run = e.aware ? Math.sin(e.t * 16) * 3 : 0;
      ctx.fillStyle = fl ? '#e8e1d3' : e.d.color;
      // Body.
      ctx.beginPath(); ctx.ellipse(0, -12, 16, 8, 0, 0, 7); ctx.fill();
      // Head.
      ctx.beginPath(); ctx.moveTo(10, -18); ctx.lineTo(24, -14); ctx.lineTo(22, -8); ctx.lineTo(10, -8); ctx.closePath(); ctx.fill();
      ctx.beginPath(); ctx.moveTo(12, -18); ctx.lineTo(14, -26); ctx.lineTo(17, -18); ctx.fill();
      // Tail and legs.
      ctx.beginPath(); ctx.moveTo(-14, -14); ctx.lineTo(-26, -20 + run); ctx.lineTo(-14, -10); ctx.fill();
      ctx.fillRect(-10, -6, 3, 6 + run); ctx.fillRect(-4, -6, 3, 6 - run); ctx.fillRect(4, -6, 3, 6 + run); ctx.fillRect(9, -6, 3, 6 - run);
      // Ash streaks.
      ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(-8, -18, 12, 2);
      // Eye.
      ctx.fillStyle = '#ff2a3a'; ctx.fillRect(18, -15, 2.5, 2.5);
      if (e.d.boss) { ctx.fillStyle = 'rgba(255,42,58,0.25)'; ctx.beginPath(); ctx.arc(19, -14, 6, 0, 7); ctx.fill(); }
    }
    ctx.restore();
    // HP bar + appraise label.
    const showBar = e.hp < e.d.hp || L.has('appraise') || e.d.boss;
    if (showBar) {
      const w = e.d.boss ? 60 : 28, y = e.y - e.r * 2 - 14;
      ctx.fillStyle = 'rgba(0,0,0,0.7)'; ctx.fillRect(e.x - w / 2 - 1, y - 1, w + 2, 5);
      ctx.fillStyle = '#c8323c'; ctx.fillRect(e.x - w / 2, y, w * Math.max(0, e.hp / e.d.hp), 3);
      if (L.has('appraise') || e.d.boss) {
        ctx.font = '700 10px "JetBrains Mono", monospace'; ctx.textAlign = 'center'; ctx.fillStyle = '#e8e1d3';
        ctx.fillText(`${e.d.name} · Lv ${e.d.lvl}`, e.x, y - 4);
      }
    }
  };

  // ---------- Projectiles ----------
  E.Bolt = function (x, y, a, dmg) { Object.assign(this, { x, y, vx: Math.cos(a) * 380, vy: Math.sin(a) * 380, dmg, life: 0.9, dead: false }); };
  E.Bolt.prototype.update = function (dt, g) {
    const b = this;
    b.life -= dt; b.x += b.vx * dt; b.y += b.vy * dt;
    if (Math.random() < 0.7) E.particles.push({ x: b.x, y: b.y, vx: 0, vy: 0, life: 0.3, max: 0.3, color: 'rgba(124,198,255,0.8)', r: 3 });
    if (b.life <= 0) { b.dead = true; return; }
    if (W.solidAt(b.x, b.y + 8, 2) && !W.inWater(b.x, b.y + 8)) { b.dead = true; E.burst(b.x, b.y, '#7cc6ff', 8, 60); AB.Audio.sfx('splash'); return; }
    for (const e of g.enemies) {
      if (e.dead) continue;
      if (Math.hypot(e.x - b.x, e.y - e.r - b.y) < e.r + 6) {
        b.dead = true; g.damageEnemy(e, b.dmg, 'magic', Math.atan2(b.vy, b.vx));
        E.burst(b.x, b.y, '#7cc6ff', 12, 90); AB.Audio.sfx('splash');
        return;
      }
    }
    const d = W.dummy;
    if (Math.hypot(d.x - b.x, d.y - 18 - b.y) < 14) { b.dead = true; d.hitFlash = 6; E.burst(b.x, b.y, '#7cc6ff', 8, 60); AB.Audio.sfx('splash'); L.skillXP('water', 2, { target: 1 }); }
  };
  E.Bolt.prototype.draw = function (ctx) {
    ctx.fillStyle = 'rgba(124,198,255,0.3)'; ctx.beginPath(); ctx.arc(this.x, this.y, 9, 0, 7); ctx.fill();
    ctx.fillStyle = '#e6f6ff'; ctx.beginPath(); ctx.arc(this.x, this.y, 4, 0, 7); ctx.fill();
  };

  // ---------- NPCs ----------
  E.NPC = function (def) { Object.assign(this, def, { x: def.x * AB.TILE, y: def.y * AB.TILE, t: Math.random() * 5, visible: true, face: Math.PI / 2 }); };
  E.NPC.prototype.draw = function (ctx, g) {
    if (!this.visible) return;
    this.t += 1 / 60;
    const child = this.id === 'mira';
    const p = g.player;
    this.face = Math.atan2(p.y - this.y, p.x - this.x);
    E.drawChar(ctx, this.x, this.y, {
      body: this.color, hair: this.hair, scale: child ? 0.66 : (this.id === 'garrick' ? 1.08 : 1), face: this.face, t: this.t, moving: false,
      trim: this.id === 'sable' ? '#c8323c' : null,
      extra: this.id === 'sable' ? (c, s) => { c.fillStyle = '#16121f'; c.beginPath(); c.moveTo(-10 * s, -34 * s); c.lineTo(0, -54 * s); c.lineTo(10 * s, -34 * s); c.closePath(); c.fill(); } : null,
    });
    // Quest marker.
    const mark = g.npcMarker(this.id);
    if (mark) {
      const y = this.y - (child ? 40 : 52) + Math.sin(g.t * 4) * 3;
      ctx.font = '800 16px Cinzel, serif'; ctx.textAlign = 'center';
      ctx.fillStyle = '#000'; ctx.fillText(mark, this.x + 1, y + 1);
      ctx.fillStyle = mark === '!' ? '#e8b04a' : '#c8323c'; ctx.fillText(mark, this.x, y);
    }
  };

  AB.Ent = E;
})();
