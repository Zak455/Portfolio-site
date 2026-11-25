// Aetherbound: main loop, combat, quests and story for Chapter 1 (Childhood).
(function () {
  const T = AB.TILE, W = AB.World, L = AB.Ledger, U = AB.UI, E = AB.Ent, IN = AB.Input, AU = AB.Audio;
  const G = { state: 'title', t: 0, enemies: [], npcs: [], bolts: [], cam: { x: 0, y: 0 }, scale: 1, senseT: 0, alive: true, hurtT: 9, fadeA: 0 };
  AB.Game = G;
  let canvas, ctx, vw = 0, vh = 0, dpr = 1, last = 0, saveT = 0, titleT = 0;

  // ---------- Setup ----------
  G.boot = function () {
    canvas = document.getElementById('game');
    ctx = canvas.getContext('2d');
    W.init();
    U.init();
    if (AB.R3) AB.R3.init();
    IN.bindCanvas(canvas);
    IN.bindTouch(document.getElementById('touch'));
    addEventListener('resize', resize); resize();
    document.getElementById('btnNew').addEventListener('click', () => newGame());
    const cont = document.getElementById('btnContinue');
    cont.hidden = !L.hasSave();
    cont.addEventListener('click', () => continueGame());
    document.getElementById('btnSkip').addEventListener('click', () => AB.Intro.skip());
    document.getElementById('btnRestart').addEventListener('click', () => { L.wipe(); location.reload(); });
    canvas.addEventListener('pointerdown', () => { if (G.state === 'intro') AB.Intro.input(); });
    // Debug/screenshot hooks: ?scene=play|intro|end&lvl=n
    const q = new URLSearchParams(location.search);
    if (q.get('scene') === 'play') { setTimeout(() => startPlay(true, q), 50); }
    if (q.get('scene') === 'intro') setTimeout(() => newGame(), 50);
    requestAnimationFrame(loop);
  };

  function resize() {
    dpr = Math.min(2, devicePixelRatio || 1);
    vw = innerWidth; vh = innerHeight;
    canvas.width = vw * dpr; canvas.height = vh * dpr;
    canvas.style.width = vw + 'px'; canvas.style.height = vh + 'px';
    G.scale = Math.max(1, Math.min(2, Math.min(vw / 760, vh / 470)));
  }

  function newGame() {
    AU.init();
    L.wipe();
    document.getElementById('title').hidden = true;
    document.getElementById('btnSkip').hidden = false;
    G.state = 'intro';
    AB.Intro.start(() => { document.getElementById('btnSkip').hidden = true; startPlay(false); });
  }
  function continueGame() {
    AU.init();
    L.load();
    document.getElementById('title').hidden = true;
    startPlay(false, null, true);
  }

  function startPlay(debug, q, loaded) {
    document.getElementById('title').hidden = true;
    const S = L.S;
    if (debug) {
      AU.init();
      const lvl = +(q.get('lvl') || 1);
      for (let i = 1; i < lvl; i++) { S.level++; S.statPts++; }
      if (q.get('ab')) q.get('ab').split(',').forEach(a => S.abilities.push(a));
      ['q_walk', 'q_water', 'q_sword', 'q_hesk', 'q_slime', 'q_fever'].slice(0, +(q.get('done') || 0)).forEach(id => S.quests[id] = 'done');
      if (S.quests.q_water === 'done') S.skills.healing.unlocked = true;
      if (S.quests.q_hesk === 'done') { S.skills.tracking.unlocked = true; S.flags.hatchet = true; }
      if (S.quests.q_sword === 'done') S.flags.swordUp = true;
      if (q.get('sk')) Object.keys(S.skills).forEach(k => { if (S.skills[k].unlocked) S.skills[k].lvl = +q.get('sk'); });
      S.hp = L.maxHp(); S.mp = L.maxMp();
      if (q.get('x')) S.pos = { x: +q.get('x') * T, y: +q.get('y') * T };
    }
    G.player = new E.Player(S.pos ? S.pos.x : W.HOME.x, S.pos ? S.pos.y : W.HOME.y);
    if (!loaded && !debug) { S.hp = L.maxHp(); S.mp = L.maxMp(); }
    G.npcs = AB.NPCS.map(d => new E.NPC(d));
    spawnEnemies();
    W.herbs.forEach(h => { if (!h.alive) h.regrow = 40; });
    W.deadTrees.forEach(d => { if (!d.alive) d.regrow = 120; });
    if (!S.quests.q_walk) S.quests.q_walk = 'active';
    placeMira();
    G.state = 'play'; if (AB.R3 && AB.R3.ok) AB.R3.reset();
    document.getElementById('hud').hidden = false;
    document.getElementById('touch').hidden = false;
    AU.ambience('forest');
    U.updateHud();
    if (!loaded && !debug) {
      U.banner('THORNWICK', 'Age 6 · the edge of the Ashwood', 4200);
      setTimeout(() => U.showDialogue([
        { who: 'Kayden', thought: true, text: 'Six years in this body. I still wake up expecting my phone.' },
        { who: 'Kayden', thought: true, text: 'The Ledger never left. It counts everything I do. Every swing, every spell, every herb I pick.' },
        { who: 'LEDGER', text: '[DIRECTIVE] Stand on your own feet. Walk to your mother in the garden.' },
        { who: 'Kayden', thought: true, text: 'WASD or arrow keys to move. E to talk and gather. Tab opens the Ledger.' },
      ]), 900);
    } else if (loaded) U.banner('THORNWICK', 'The Ledger remembers', 2600);
  }

  function spawnEnemies() {
    G.enemies = [];
    const slimes = [[51, 9], [53, 14], [50, 27], [55, 31], [52, 36], [57, 24], [58, 9], [54, 40], [17, 45], [12, 46]];
    slimes.forEach(([x, y]) => G.enemies.push(new E.Enemy('slime', (x + 0.5) * T, (y + 0.5) * T)));
    const wolves = [[66, 20], [70, 28], [68, 48], [74, 33], [80, 26], [63, 41], [83, 50]];
    wolves.forEach(([x, y]) => G.enemies.push(new E.Enemy('wolf', (x + 0.5) * T, (y + 0.5) * T)));
  }

  function placeMira() {
    const S = L.S, mira = G.npcs.find(n => n.id === 'mira');
    if (S.quests.q_mira === 'active' && !S.flags.alphaDead) { mira.x = W.CIRCLE.x + 20; mira.y = W.CIRCLE.y - 10; }
    else if (S.flags.alphaDead) { mira.x = 22.5 * T; mira.y = 18.8 * T; }
  }

  // ---------- Quests ----------
  const Q = id => L.S.quests[id];
  function startQuest(id) { if (!L.S.quests[id]) { L.S.quests[id] = 'active'; const q = AB.QUESTS.find(x => x.id === id); U.log(`New ${q.kind === 'Directive' ? 'Directive' : 'quest'}: ${q.title}`, q.kind === 'Directive' ? 'warn' : 'new'); setBase(id); L.save(); } }
  function finishQuest(id) {
    if (L.S.quests[id] === 'done') return;
    L.S.quests[id] = 'done';
    const q = AB.QUESTS.find(x => x.id === id);
    U.log(`Complete: ${q.title}`, 'title');
    if (q.kind === 'Directive') {
      L.S.statPts++; U.log('Directive reward: +1 stat point', 'level');
      if (L.S.debt > 0) { L.S.debt = 0; U.log('Ledger Debt repaid.', 'new'); }
    }
    AU.sfx('level');
    L.save();
  }
  function setBase(id) {
    const c = L.S.counts, f = L.S.flags;
    if (id === 'q_water') f.castBase = c.casts;
    if (id === 'q_sword') f.dummyBase = c.dummy;
    if (id === 'q_hesk') { f.herbBase = c.herbs; f.chopBase = c.chops; }
    if (id === 'q_slime') f.slimeBase = c.slimes;
  }
  G.questProgress = function (id) {
    const c = L.S.counts, f = L.S.flags;
    if (id === 'q_water') return `Cast Water Bolt: ${Math.min(10, c.casts - (f.castBase || 0))} / 10`;
    if (id === 'q_sword') return `Dummy hits: ${Math.min(20, c.dummy - (f.dummyBase || 0))} / 20`;
    if (id === 'q_hesk') return `Herbs ${Math.min(6, c.herbs - (f.herbBase || 0))} / 6 · Dead trees ${Math.min(3, c.chops - (f.chopBase || 0))} / 3`;
    if (id === 'q_slime') return `Slimes east of the river: ${Math.min(6, c.slimes - (f.slimeBase || 0))} / 6`;
    if (id === 'q_fever') return f.wellSeen ? 'Tell your mother what you found at the well.' : 'Ask around, then look at the village well.';
    if (id === 'q_mira') return f.alphaDead ? 'Bring Mira home.' : 'Follow the red tracks east to the stone circle.';
    if (id === 'q_walk') return 'Walk to your mother in the garden.';
    return null;
  };
  function ready(id) {
    const c = L.S.counts, f = L.S.flags;
    if (Q(id) !== 'active') return false;
    if (id === 'q_water') return c.casts - f.castBase >= 10;
    if (id === 'q_sword') return c.dummy - f.dummyBase >= 20;
    if (id === 'q_hesk') return c.herbs - f.herbBase >= 6 && c.chops - f.chopBase >= 3;
    if (id === 'q_slime') return c.slimes - f.slimeBase >= 6;
    if (id === 'q_fever') return !!f.wellSeen;
    return false;
  }

  G.npcMarker = function (id) {
    const done = x => Q(x) === 'done';
    if (id === 'elowen') { if (Q('q_walk') === 'active') return '!'; if (ready('q_water') || ready('q_fever')) return '?'; }
    if (id === 'garrick') { if (done('q_water') && !Q('q_sword')) return '!'; if (ready('q_sword')) return '?'; }
    if (id === 'hesk') { if (done('q_water') && !Q('q_hesk')) return '!'; if (ready('q_hesk')) return '?'; }
    if (id === 'villager') { if (done('q_water') && !Q('q_fever')) return '!'; }
    if (id === 'sable') { if (done('q_sword') && done('q_hesk') && !Q('q_slime')) return '!'; if (ready('q_slime')) return '?'; }
    if (id === 'mira') { if (Q('q_mira') === 'active' && L.S.flags.alphaDead) return '?'; }
    return null;
  };

  // The quest shown in the tracker, and where it points.
  G.currentQuest = function () {
    const order = ['q_mira', 'q_walk', 'q_water', 'q_slime', 'q_sword', 'q_hesk', 'q_fever'];
    for (const id of order) if (Q(id) === 'active') { const q = AB.QUESTS.find(x => x.id === id); return Object.assign({}, q, { progress: ready(id) ? 'Done. Report back.' : G.questProgress(id) }); }
    const avail = G.npcs.find(n => G.npcMarker(n.id) === '!');
    if (avail) return { kind: 'World', title: 'Someone needs you', progress: `Talk to ${avail.name} (marked !)` };
    return null;
  };
  G.questTarget = function () {
    const n = G.npcs.find(n => G.npcMarker(n.id));
    if (Q('q_mira') === 'active' && !L.S.flags.alphaDead) return W.CIRCLE;
    if (n) return n;
    if (Q('q_slime') === 'active') return { x: 54 * T, y: 22 * T };
    if (Q('q_fever') === 'active' && !L.S.flags.wellSeen) return W.well;
    return null;
  };

  // ---------- Talking ----------
  function talk(n) {
    const S = L.S, f = S.flags, say = (lines, done) => U.showDialogue(lines, done);
    const K = (text, thought) => ({ who: 'Kayden', text, thought });
    const N = text => ({ who: n.name, text });
    if (n.id === 'elowen') {
      if (Q('q_walk') === 'active') return say([
        N('There you are. Walking on your own already, and without falling into the herb bed. I am impressed.'),
        K('If only she knew I had thirty-four years of practice.', true),
        N('I saw you behind the barn yesterday, Kayden. Water dancing in your hands. Children your age cannot do that.'),
        N('So let us do it properly. Push the water out, aim it, let it go. Ten times. I will watch.'),
        { who: 'LEDGER', text: 'Water Bolt: K or right-click. Casting costs mana. Mana returns faster while you stand still.' },
      ], () => { finishQuest('q_walk'); startQuest('q_water'); });
      if (ready('q_water')) return say([
        N('Ten clean bolts. Your father will pretend he is not proud.'),
        N('One more thing. Water can close wounds as well as open them. Hold the warmth inside your palm, like this.'),
        { who: 'LEDGER', text: 'New skill: Healing Magic. Heal with H. XP comes from real wounds you close.' },
        N('Your father wants you in the yard. And Old Hesk was asking for you.'),
      ], () => { finishQuest('q_water'); L.unlockSkill('healing'); });
      if (ready('q_fever')) return say([
        K('Mother. The well water is green and stagnant. Everyone drinks it raw. That is why they are sick.'),
        N('Green water has always been green water, Kayden.'),
        K('If we boil it first, the fever stops. The heat kills what is in it. Small things. Too small to see.'),
        N('...Where do you learn these things? Fine. I will tell the miller. If it works, I will tell the whole village.'),
        { who: 'LEDGER', text: '[EARTHBORN] Knowledge applied. Science +. Recorded.' },
      ], () => { finishQuest('q_fever'); L.unlockSkill('science'); L.skillXP('science', 60, { key: 'boil' }); f.wellClean = true; L.grantTitle('physician'); });
      return say([N(pick(['Mind the slimes by the river. They sting worse than nettles.', 'Your sister follows you everywhere. Be a good example, will you?', 'Rest when you are hurt. Healing is not weakness.']))]);
    }
    if (n.id === 'garrick') {
      if (Q('q_water') === 'done' && !Q('q_sword')) return say([
        { who: n.name, text: 'Magic, magic. Your mother says you are some kind of prodigy. Good. Prodigies still bleed.' },
        { who: n.name, text: 'Steel first, spells second. Hit that dummy twenty times. Feet apart. Swing from the hips.' },
        { who: 'LEDGER', text: 'Attack: J or left-click. The dummy can only teach the basics. Real enemies teach more.' },
      ], () => startQuest('q_sword'));
      if (ready('q_sword')) return say([
        { who: n.name, text: 'Ha! Not bad. Not good either, but not bad.' },
        { who: n.name, text: 'Here. My first blade, cut down for small hands. Iron, not wood. Do not make me regret it.' },
        { who: 'LEDGER', text: 'Weapon upgraded: Cut-down Iron Sword (+3 damage).' },
      ], () => { finishQuest('q_sword'); f.swordUp = true; });
      return say([{ who: n.name, text: pick(['The dummy will not hit back. Wolves will.', 'Keep your guard up. And keep your sister away from the river.', 'East of the bridge is the Ashwood. You are not ready for the deep part.']) }]);
    }
    if (n.id === 'hesk') {
      if (Q('q_water') === 'done' && !Q('q_hesk')) return say([
        { who: n.name, text: 'Eh? Young master! Come to help an old man?' },
        { who: n.name, text: 'Six herbs for your mother\'s salves. Silverleaf, duskberry, bellcap, any will do. They glow a bit if you look right.' },
        { who: n.name, text: 'And three dead trees for firewood. The Ledger thing of yours marks them, you said? Red boxes? Strange child. Take my hatchet.' },
        { who: 'LEDGER', text: 'Gather with E. Chop dead trees by attacking them.' },
      ], () => { startQuest('q_hesk'); f.hatchet = true; });
      if (ready('q_hesk')) return say([
        { who: n.name, text: 'Good haul! Now listen. A hunter reads the ground before he reads the sky.' },
        { who: n.name, text: 'Wolves leave tracks. Four toes, one pad. Follow fresh ones and they lead you to the den.' },
        { who: 'LEDGER', text: 'New skill: Tracking. Fresh tracks now show in red. Walk along them to learn.' },
      ], () => { finishQuest('q_hesk'); L.unlockSkill('tracking'); });
      return say([{ who: n.name, text: pick(['Eh? Speak up!', 'Ash wolves came closer this year. Something is driving them.', 'Your grandfather could track a deer across stone. You have his eyes.']) }]);
    }
    if (n.id === 'villager') {
      if (Q('q_water') === 'done' && !Q('q_fever')) return say([
        { who: n.name, text: 'Young Break. Half the village has the fever. My wife, the smith\'s boys, now the baker.' },
        { who: n.name, text: 'Your mother does what she can, but it keeps coming back. Like a curse on Thornwick.' },
        K('Fever that keeps coming back, in a whole village at once... Something they all share.', true),
      ], () => startQuest('q_fever'));
      return say([{ who: n.name, text: f.wellClean ? 'Boiled water! Who would have thought. The fever is gone. Bless you, boy.' : 'Mind how you go.' }]);
    }
    if (n.id === 'sable') {
      if (Q('q_sword') === 'done' && Q('q_hesk') === 'done' && !Q('q_slime')) return say([
        { who: n.name, text: 'So you are the Break child. Your mother wrote to me. Six years old and casting without words.' },
        { who: n.name, text: 'I do not teach dummies. I teach through living things. The bog slimes east of the bridge will do.' },
        { who: n.name, text: 'Six of them. Use magic, steel, whatever you have. And Kayden...' },
        { who: n.name, text: 'Do you ever see words that are not there? Red ones?' },
        K('She knows. Or she suspects.', true),
        { who: 'LEDGER', text: '[DIRECTIVE] Cull the bog. Kill 6 slimes. Reward: +1 stat point. Failure: ???' },
      ], () => startQuest('q_slime'));
      if (ready('q_slime')) return say([
        { who: n.name, text: 'Six. Clean work. You learn faster than anyone I have taught. Faster than is natural.' },
        { who: n.name, text: 'Whatever is writing about you, child, it is not finished with you.' },
      ], () => { finishQuest('q_slime'); triggerMira(); });
      return say([{ who: n.name, text: pick(['Magic is a muscle. Use it until it aches.', 'Mana returns faster when you are still. Breathe.', 'Do not trust anything that offers you power for free.']) }]);
    }
    if (n.id === 'mira') {
      if (Q('q_mira') === 'active' && f.alphaDead) return endChapter();
      return say([{ who: n.name, text: pick(['Kay! Show me the water trick again!', 'Hesk says there are wolves as big as horses. Is that true?', 'When I grow up I am going to be a knight AND a mage.']) }]);
    }
  }
  function pick(a) { return a[Math.floor(Math.random() * a.length)]; }

  function triggerMira() {
    setTimeout(() => {
      AU.sfx('howl');
      U.showDialogue([
        { who: 'Old Hesk', text: 'Young master! Mira! She went after a wolf pup, east, past the bridge! I could not keep up!' },
        { who: 'LEDGER', text: '[DIRECTIVE] Find Mira. Follow the tracks to the stone circle. Failure: kin lost.' },
        { who: 'Kayden', thought: true, text: 'Not again. I am not losing a family twice.' },
      ], () => { startQuest('q_mira'); placeMira(); });
    }, 600);
  }

  function endChapter() {
    U.showDialogue([
      { who: 'Mira Break', text: 'Kay... you came. The big one, it was going to... and you... the water...' },
      { who: 'Kayden', text: 'I have you. Hold on to me. We are going home.' },
      { who: 'LEDGER', text: '[ENTRY] Subject protected kin at risk to self. Unexpected. Revising projections.' },
      { who: 'Sable Vorne', text: 'Six years old, and an Alpha dead in the stone circle. The Ledger will want to know you much better now.' },
      { who: 'Sable Vorne', text: 'I am leaving Thornwick, child. When you are older, come and find me. I have questions. So will you.' },
    ], () => {
      finishQuest('q_mira');
      L.save();
      G.state = 'end';
      const S = L.S;
      const sk = Object.keys(S.skills).filter(k => S.skills[k].unlocked).map(k => `${AB.SKILLS[k].name} ${S.skills[k].lvl}`).join(' · ');
      document.getElementById('endStats').innerHTML = `
        <div><b>${S.level}</b><span>Level</span></div><div><b>${S.counts.slimes + S.counts.wolves + 1}</b><span>Creatures slain</span></div>
        <div><b>${Object.keys(S.titles).length}</b><span>Titles</span></div><div><b>${S.counts.deaths}</b><span>Deaths</span></div>`;
      document.getElementById('endSkills').textContent = sk;
      document.getElementById('endAbilities').textContent = S.abilities.map(a => AB.ABILITIES[a].name).join(' · ') || 'None';
      document.getElementById('end').hidden = false;
      document.getElementById('hud').hidden = true;
      document.getElementById('touch').hidden = true;
    });
  }

  // ---------- Combat ----------
  G.hurtPlayer = function (dmg, src) {
    const p = G.player, S = L.S;
    if (p.inv > 0 || !G.alive) return;
    let d = dmg * (L.has('ironSkin') ? 0.75 : 1) * (1 - Math.min(0.3, S.stats.vit * 0.015));
    S.hp -= d; p.inv = 0.7; G.hurtT = 0; p.hurtFlash = 0.25;
    const a = Math.atan2(p.y - src.y, p.x - src.x);
    E.moveBody(p, Math.cos(a) * 18, Math.sin(a) * 18, p.r);
    E.float(p.x, p.y - 40, '-' + Math.round(d), '#ff6a6a');
    AU.sfx('hurt'); G.shake = 6;
    if (S.hp <= 0) {
      if (L.has('secondWind') && !p.secondWindUsed) { p.secondWindUsed = true; S.hp = 1; U.log('Second Wind. Not yet.', 'warn'); return; }
      die();
    }
  };

  function die() {
    const S = L.S;
    G.alive = false; S.hp = 0; S.counts.deaths++;
    AU.sfx('die');
    U.log('Subject expired. Again.', 'warn');
    setTimeout(() => {
      S.debt = 1; S.hp = L.maxHp(); S.mp = L.maxMp();
      G.player.x = W.HOME.x; G.player.y = W.HOME.y; G.player.secondWindUsed = false;
      const alpha = G.enemies.find(e => e.d.boss); if (alpha && !alpha.dead) { alpha.hp = alpha.d.hp; alpha.howls = 0; alpha.aware = false; alpha.x = alpha.hx; alpha.y = alpha.hy; }
      G.enemies = G.enemies.filter(e => !e.summoned);
      G.alive = true;
      U.banner('LEDGER DEBT', 'You woke in your bed. Skills earn 10% less XP until you finish a Directive.', 4200);
    }, 1600);
  }

  G.damageEnemy = function (e, dmg, src, ang) {
    const S = L.S;
    let crit = false;
    if (src === 'sword' && L.has('keenEdge') && Math.random() < 0.2) { dmg *= 2; crit = true; }
    if (S.title === 'slimeBane' && e.type === 'slime') dmg *= 1.15;
    if (S.title === 'wolfbane' && e.d.kind === 'beast') dmg *= 1.1;
    dmg = Math.round(dmg);
    e.hp -= dmg; e.flash = 0.12; e.aware = true;
    e.kb.x = Math.cos(ang) * (e.d.boss ? 60 : 260); e.kb.y = Math.sin(ang) * (e.d.boss ? 60 : 260);
    E.float(e.x, e.y - e.r * 2 - 4, (crit ? 'CRIT ' : '') + dmg, crit ? '#e8b04a' : '#ffffff', crit);
    if (src === 'sword') L.skillXP('oneHand', 5, { target: e.d.lvl, key: 'sword:' + e.type });
    else L.skillXP('water', 6, { target: e.d.lvl, key: 'bolt:' + e.type });
    if (e.hp <= 0) killEnemy(e);
  };

  function killEnemy(e) {
    const S = L.S;
    e.dead = true; e.respawn = e.type === 'slime' ? 35 : 55;
    E.burst(e.x, e.y - e.r, e.type === 'slime' ? '#7ab85a' : '#55555e', 20, 120, 0.8);
    S.bestiary[e.type] = (S.bestiary[e.type] || 0) + 1;
    if (S.bestiary[e.type] === 1) U.log(`Bestiary: ${e.d.name} recorded`, 'new');
    if (e.type === 'slime') S.counts.slimes++;
    if (e.type === 'wolf') S.counts.wolves++;
    L.charXP(e.d.xp);
    if (e.summoned) G.enemies = G.enemies.filter(x => x !== e);
    if (e.d.boss) {
      S.flags.alphaDead = true;
      L.grantTitle('wolfbane');
      U.banner('ASH WOLF ALPHA', 'Slain', 3000);
      U.log('Directive update: bring Mira home. (Talk to her)', 'warn');
      G.enemies.filter(x => x.summoned).forEach(x => { x.dead = true; });
    }
    L.checkTitles();
  }

  function aimAngle() {
    const p = G.player;
    if (IN.mouse.used && !IN.touch && AB.R3 && AB.R3.ok) {
      const gp = AB.R3.ground(IN.mouse.x, IN.mouse.y);
      if (gp) return Math.atan2(gp.y - p.y, gp.x - p.x);
    }
    if (IN.mouse.used && !IN.touch) {
      const sx = (p.x - G.cam.x) * G.scale, sy = (p.y - 14 - G.cam.y) * G.scale;
      return Math.atan2(IN.mouse.y - sy, IN.mouse.x - sx);
    }
    let best = null, bd = 280;
    for (const e of G.enemies) { if (e.dead) continue; const d = Math.hypot(e.x - p.x, e.y - p.y); if (d < bd) { bd = d; best = e; } }
    if (best) return Math.atan2(best.y - best.r - (p.y - 14), best.x - p.x);
    return p.face;
  }

  function attack() {
    const p = G.player, S = L.S;
    if (p.atkCd > 0) return;
    p.atkCd = 0.38; p.swing = 0.22;
    p.face = aimAngle();
    AU.sfx('swing');
    const reach = 50, dmg = L.swordDmg();
    let hit = false;
    for (const e of G.enemies) {
      if (e.dead) continue;
      const dx = e.x - p.x, dy = (e.y - e.r * 0.6) - (p.y - 12), d = Math.hypot(dx, dy);
      if (d > reach + e.r) continue;
      let da = Math.atan2(dy, dx) - p.face; da = Math.atan2(Math.sin(da), Math.cos(da));
      if (Math.abs(da) > 1.15 && d > e.r + 8) continue;
      G.damageEnemy(e, dmg, 'sword', Math.atan2(dy, dx)); hit = true;
    }
    if (hit) AU.sfx('hit');
    // Dummy.
    const dm = W.dummy, dd = Math.hypot(dm.x - p.x, dm.y - p.y);
    if (dd < 52) {
      let da = Math.atan2(dm.y - p.y, dm.x - p.x) - p.face; da = Math.atan2(Math.sin(da), Math.cos(da));
      if (Math.abs(da) < 1.3 || dd < 24) {
        dm.hitFlash = 6; AU.sfx('thud'); S.counts.dummy++;
        E.burst(dm.x, dm.y - 20, '#b09060', 5, 60);
        L.skillXP('oneHand', 4, { target: 1 });
      }
    }
    // Dead trees.
    for (const d of W.deadTrees) {
      if (!d.alive) continue;
      const dist = Math.hypot(d.x - p.x, d.y - p.y);
      if (dist > 54) continue;
      if (!S.flags.hatchet) { if (!G._noHatchet) { G._noHatchet = true; U.log('Too thick for a sword. Old Hesk has a hatchet.', 'warn'); } continue; }
      d.hp--; AU.sfx('chop'); E.burst(d.x, d.y - 20, '#6a5040', 8, 70);
      L.skillXP('woodcutting', 5, { key: 'chop' });
      if (d.hp <= 0) {
        d.alive = false; d.regrow = 150; d.hp = 3; S.counts.chops++;
        L.skillXP('woodcutting', 10, { key: 'fell' });
        E.float(d.x, d.y - 40, '+1 firewood', '#e8b04a');
      }
      break;
    }
  }

  function cast() {
    const p = G.player, S = L.S;
    if (p.castCd > 0) return;
    if (S.mp < 5) { if (!G._oom || G.t - G._oom > 2) { G._oom = G.t; E.float(p.x, p.y - 44, 'No mana', '#7cc6ff'); } return; }
    S.mp -= 5; p.castCd = 0.32;
    const a = aimAngle(); p.face = a;
    const n = L.has('splitBolt') ? 3 : 1;
    for (let i = 0; i < n; i++) G.bolts.push(new E.Bolt(p.x + Math.cos(a) * 14, p.y - 16 + Math.sin(a) * 14, a + (i - (n - 1) / 2) * 0.22, L.boltDmg()));
    AU.sfx('cast');
    S.counts.casts++;
    L.skillXP('water', 1.5, { key: 'cast' });
    L.skillXP('manaSense', 0.8, {});
    L.checkTitles();
  }

  function heal() {
    const p = G.player, S = L.S;
    if (!S.skills.healing.unlocked || p.healCd > 0) return;
    const cost = L.healCost();
    if (S.mp < cost) { E.float(p.x, p.y - 44, 'No mana', '#7cc6ff'); return; }
    const missing = L.maxHp() - S.hp;
    if (missing < 1) { E.float(p.x, p.y - 44, 'Not hurt', '#e8e1d3'); return; }
    S.mp -= cost; p.healCd = 0.8;
    const amt = Math.min(missing, L.healAmt());
    S.hp += amt; S.counts.healed += amt;
    E.float(p.x, p.y - 44, '+' + Math.round(amt), '#8fe08f');
    E.burst(p.x, p.y - 16, '#8fe08f', 14, 50);
    AU.sfx('heal');
    L.skillXP('healing', amt * 0.6, { key: 'heal' });
    L.skillXP('manaSense', 0.8, {});
    L.checkTitles();
  }

  // ---------- Update ----------
  function update(dt) {
    G.t += dt;
    const S = L.S, p = G.player;
    U.tickDialogue(dt);
    // Modal states first.
    if (IN.take('escape')) { if (U.ledgerOpen()) U.closeLedger(); }
    if (IN.take('mute')) document.getElementById('btnMute').click();
    if (U.offerOpen()) return;
    if (S.offers.length && !U.dialogueActive()) { const o = S.offers.shift(); U.showOffer(o, a => L.takeAbility(a)); return; }
    if (IN.take('ledger')) { if (U.ledgerOpen()) U.closeLedger(); else U.openLedger(); }
    if (U.ledgerOpen()) return;
    if (U.dialogueActive()) {
      U.prompt(null);
      if (IN.take('use') || IN.take('confirm') || IN.take('attack') || IN.take('dash')) U.advance();
      return;
    }
    if (!G.alive) return;

    // Movement.
    const ax = IN.axis();
    const sp = L.speed() * (p.dashT > 0 ? 3.2 : 1);
    p.moving = ax.x !== 0 || ax.y !== 0;
    if (p.moving) { p.face = Math.atan2(ax.y, ax.x); p.still = 0; } else p.still += dt;
    if (p.dashT > 0) { p.dashT -= dt; E.moveBody(p, Math.cos(p.face) * sp * dt, Math.sin(p.face) * sp * dt, p.r); }
    else E.moveBody(p, ax.x * sp * dt, ax.y * sp * dt, p.r);
    p.t += dt;
    p.atkCd -= dt; p.castCd -= dt; p.healCd -= dt; p.inv -= dt; p.dashCd -= dt; p.senseCd -= dt;
    if (p.swing > 0) p.swing -= dt;
    G.hurtT += dt;

    // Actions.
    if (IN.take('attack')) attack();
    if (IN.take('cast')) cast();
    if (IN.take('heal')) heal();
    if (IN.take('dash') && L.has('aquaDash') && p.dashCd <= 0 && S.mp >= 8) { S.mp -= 8; p.dashT = 0.16; p.dashCd = 0.6; AU.sfx('splash'); L.skillXP('water', 1, { key: 'dash' }); }
    if (IN.take('ability') && L.has('bloodSense') && p.senseCd <= 0) { G.senseT = 6; p.senseCd = 14; AU.sfx('heartbeat'); U.log('Blood Sense: the forest pulses red.', 'skill'); }
    if (G.senseT > 0) G.senseT -= dt;

    // Regen + meditation.
    const regen = (1.4 + S.stats.int * 0.2) * (L.has('manaFont') ? 1.6 : 1) * (p.still > 1 ? 2 : 1);
    if (S.mp < L.maxMp()) {
      S.mp = Math.min(L.maxMp(), S.mp + regen * dt);
      if (p.still > 1.2) { G._med = (G._med || 0) + dt; if (G._med > 1) { G._med = 0; L.skillXP('manaSense', 1.6, { key: 'meditate' }); } }
    }
    if (G.hurtT > 5 && S.hp < L.maxHp()) S.hp = Math.min(L.maxHp(), S.hp + 0.6 * dt);

    // Interaction prompt.
    let near = null, nd = 56;
    for (const n of G.npcs) { if (!n.visible) continue; const d = Math.hypot(n.x - p.x, n.y - p.y); if (d < nd) { nd = d; near = { type: 'npc', o: n }; } }
    for (const h of W.herbs) { if (!h.alive) continue; const d = Math.hypot(h.x - p.x, h.y - p.y); if (d < Math.min(nd, 36)) { nd = d; near = { type: 'herb', o: h }; } }
    if (Math.hypot(W.well.x - p.x, W.well.y - p.y) < 48 && Q('q_fever') === 'active' && !S.flags.wellSeen) near = { type: 'well' };
    const verb = IN.touch ? 'Tap USE' : 'E';
    U.prompt(near ? (near.type === 'npc' ? `${verb} · Talk to ${near.o.name}` : near.type === 'herb' ? `${verb} · Gather ${near.o.kind}` : `${verb} · Look into the well`) : null);
    if (IN.take('use') && near) {
      if (near.type === 'npc') { AU.sfx('ui'); talk(near.o); }
      else if (near.type === 'herb') {
        const h = near.o; h.alive = false; h.regrow = 50;
        const y = L.has('herbalist') ? 2 : 1;
        S.counts.herbs += y; AU.sfx('pick');
        E.float(h.x, h.y - 20, `+${y} ${h.kind}`, '#b8e0a0'); E.burst(h.x, h.y - 6, '#b8e0a0', 8, 50);
        L.skillXP('foraging', 7, { key: 'herb:' + h.k });
      } else if (near.type === 'well') {
        S.flags.wellSeen = true;
        U.showDialogue([
          { who: 'Kayden', thought: true, text: 'Green scum. Dead leaves. A rat, maybe, down there. And everyone drinks it straight.' },
          { who: 'Kayden', thought: true, text: 'Thirty-four years of a useless life, and I still remember one thing from school. Boil your water.' },
          { who: 'LEDGER', text: '[EARTHBORN] Modern knowledge detected. Tell your mother.' },
        ]);
      }
    }

    // Enemies, bolts.
    for (const e of G.enemies) e.update(dt, G);
    G.bolts.forEach(b => b.update(dt, G)); G.bolts = G.bolts.filter(b => !b.dead);

    // Stealth: moving close to creatures that have not noticed you.
    G.aggroMult = 1 - Math.min(0.45, S.skills.stealth.lvl * 0.02);
    for (const e of G.enemies) {
      if (e.dead || e.aware) continue;
      const d = Math.hypot(e.x - p.x, e.y - p.y);
      if (d < e.d.aggro * 1.5 && p.moving) { e.stealthT += dt; if (e.stealthT > 1) { e.stealthT = 0; L.skillXP('stealth', 2, { target: e.d.lvl }); } }
    }

    // Tracking.
    if (S.skills.tracking.unlocked) {
      for (const tr of W.tracks) {
        if (tr.seen) { tr.seenT = (tr.seenT || 0) + dt; if (tr.seenT > 90) { tr.seen = false; tr.seenT = 0; } continue; }
        if (Math.hypot(tr.x - p.x, tr.y - p.y) < 26) { tr.seen = true; L.skillXP('tracking', 3, { target: 3 }); }
      }
    }

    // Regrowth.
    W.herbs.forEach(h => { if (!h.alive) { h.regrow -= dt; if (h.regrow <= 0 && Math.hypot(h.x - p.x, h.y - p.y) > 200) h.alive = true; } });
    W.deadTrees.forEach(d => { if (!d.alive) { d.regrow -= dt; if (d.regrow <= 0 && Math.hypot(d.x - p.x, d.y - p.y) > 260) d.alive = true; } });

    // Alpha spawns when you reach the circle.
    if (Q('q_mira') === 'active' && !S.flags.alphaDead && !G.enemies.some(e => e.d.boss) && Math.hypot(p.x - W.CIRCLE.x, p.y - W.CIRCLE.y) < 330) {
      const a = new E.Enemy('alpha', W.CIRCLE.x - 40, W.CIRCLE.y + 30); a.aware = true; G.enemies.push(a);
      AU.sfx('howl'); U.banner('ASH WOLF ALPHA', 'Level 9 · it stands over Mira', 3000); G.shake = 10;
    }

    // Quest readiness pings.
    for (const id of ['q_water', 'q_sword', 'q_hesk', 'q_slime']) if (ready(id) && !S.flags['ping_' + id]) { S.flags['ping_' + id] = true; U.log('Objective complete. Report back.', 'new'); }

    E.updateFx(dt);
    if (G.shake > 0) G.shake -= dt * 30;
    saveT += dt; if (saveT > 15) { saveT = 0; L.save(); }
    S.time += dt;
  }

  G.fx = { levelUp() { const p = G.player; if (!p) return; E.burst(p.x, p.y - 20, '#e8b04a', 30, 140, 1); E.float(p.x, p.y - 56, 'LEVEL UP', '#e8b04a', true); } };

  // ---------- Draw ----------
  function draw(dt) {
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.imageSmoothingEnabled = true;
    const R3 = AB.R3 && AB.R3.ok ? AB.R3 : null;
    if (R3) {
      R3.mode = G.state === 'title' ? 'title' : G.state === 'intro' ? 'off' : 'play';
      R3.frame(G, dt || 1 / 60);
      if (G.state === 'title') { ctx.clearRect(0, 0, vw, vh); return; }
      if (G.state !== 'intro') return drawOverlay3d(R3);
    }
    if (G.state === 'title') return drawTitle();
    if (G.state === 'intro') { AB.Intro.draw(ctx, vw, vh); return; }
    const s = G.scale, p = G.player;
    const sw = vw / s, sh = vh / s;
    G.cam.x = Math.max(0, Math.min(W.W * T - sw, p.x - sw / 2));
    G.cam.y = Math.max(0, Math.min(W.H * T - sh, p.y - 20 - sh / 2));
    const shx = G.shake > 0 ? (Math.random() - 0.5) * G.shake : 0, shy = G.shake > 0 ? (Math.random() - 0.5) * G.shake : 0;
    ctx.setTransform(dpr * s, 0, 0, dpr * s, shx * dpr, shy * dpr);
    const cam = { x: Math.round(G.cam.x * s) / s, y: Math.round(G.cam.y * s) / s };
    W.drawGround(ctx, cam, Math.ceil(sw) + 1, Math.ceil(sh) + 1, G.t);
    ctx.translate(-cam.x, -cam.y);
    const st = { t: G.t, cam, vw: sw, vh: sh, px: p.x, py: p.y, fadeNear: true, ledgerMarks: !!L.S.flags.hatchet, tracksVisible: L.S.skills.tracking.unlocked, wellClean: !!L.S.flags.wellClean };
    W.drawTracks(ctx, st);
    W.drawHerbs(ctx, st);
    const list = W.sortables(cam, sw, sh);
    list.push({ y: p.y, draw: c => p.draw(c) });
    G.npcs.forEach(n => list.push({ y: n.y, draw: c => n.draw(c, G) }));
    G.enemies.forEach(e => { if (!e.dead) list.push({ y: e.y, draw: c => e.draw(c, G) }); });
    list.sort((a, b) => a.y - b.y);
    for (const it of list) it.draw(ctx, it.o, st);
    G.bolts.forEach(b => b.draw(ctx));
    // Blood Sense outlines through trees.
    if (G.senseT > 0) {
      ctx.strokeStyle = `rgba(255,42,58,${Math.min(1, G.senseT) * 0.8})`; ctx.lineWidth = 2;
      G.enemies.forEach(e => { if (!e.dead) { ctx.beginPath(); ctx.arc(e.x, e.y - e.r, e.r + 6 + Math.sin(G.t * 8) * 2, 0, 7); ctx.stroke(); } });
    }
    E.drawFx(ctx);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    // Forest darkness + vignette.
    const depth = W.depth(p.x);
    const sx = (p.x - cam.x) * s, sy = (p.y - 16 - cam.y) * s;
    const g = ctx.createRadialGradient(sx, sy, 60 * s, sx, sy, Math.max(vw, vh) * 0.75);
    g.addColorStop(0, 'rgba(4,4,10,0)');
    g.addColorStop(1, `rgba(4,4,10,${0.45 + depth * 0.45})`);
    ctx.fillStyle = g; ctx.fillRect(0, 0, vw, vh);
    ctx.fillStyle = `rgba(40,20,30,${0.08 + depth * 0.12})`; ctx.fillRect(0, 0, vw, vh);
    if (p.hurtFlash > 0) { p.hurtFlash -= 1 / 60; ctx.fillStyle = `rgba(200,30,40,${p.hurtFlash})`; ctx.fillRect(0, 0, vw, vh); }
    if (!G.alive) { ctx.fillStyle = 'rgba(0,0,0,0.75)'; ctx.fillRect(0, 0, vw, vh); ctx.fillStyle = '#c8323c'; ctx.font = '800 28px Cinzel, serif'; ctx.textAlign = 'center'; ctx.fillText('SUBJECT EXPIRED', vw / 2, vh / 2); }
  }

  // 3D mode: the model is drawn by AB.R3; this canvas only carries particles, numbers, health bars and markers.
  function drawOverlay3d(R3) {
    const p = G.player;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.clearRect(0, 0, vw, vh);
    if (!p) return;
    // particles: an affine fit of the ground plane around Kayden
    const m = R3.overlayTransform(p.x, p.y, 0.45);
    ctx.setTransform(dpr * m[0], dpr * m[1], dpr * m[2], dpr * m[3], dpr * m[4], dpr * m[5]);
    for (const q of E.particles) { ctx.globalAlpha = q.life / q.max; ctx.fillStyle = q.color; ctx.fillRect(q.x - q.r / 2, q.y - q.r / 2, q.r, q.r); }
    ctx.globalAlpha = 1;
    const k = Math.hypot(m[0], m[1]);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.textAlign = 'center';
    // Blood Sense: red rings on every enemy, seen through trees
    if (G.senseT > 0) {
      ctx.strokeStyle = `rgba(200,50,60,${Math.min(1, G.senseT) * 0.9})`; ctx.lineWidth = 2.5;
      G.enemies.forEach(e => { if (e.dead) return; const s = R3.project(e.x, e.y, 0.05); const r = (e.r + 8 + Math.sin(G.t * 8) * 2) * k; ctx.beginPath(); ctx.ellipse(s.x, s.y, r, r * 0.7, 0, 0, 7); ctx.stroke(); });
    }
    // enemy health bars and appraise labels
    G.enemies.forEach(e => {
      if (e.dead) return;
      const showBar = e.hp < e.d.hp || L.has('appraise') || e.d.boss;
      if (!showBar) return;
      const s = R3.project(e.x, e.y, e.type === 'slime' ? 0.55 : (e.d.boss ? 1.25 : 0.95));
      const w = e.d.boss ? 64 : 34, y = s.y - 8;
      ctx.fillStyle = 'rgba(246,241,231,0.95)'; roundRect(s.x - w / 2 - 2, y - 2, w + 4, 8, 4); ctx.fill();
      ctx.fillStyle = '#c8323c'; roundRect(s.x - w / 2, y, Math.max(2, w * Math.max(0, e.hp / e.d.hp)), 4, 2); ctx.fill();
      if (L.has('appraise') || e.d.boss) {
        ctx.font = '600 12px Fredoka, sans-serif'; ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(246,241,231,0.95)'; ctx.fillStyle = '#1d2530';
        const txt = `${e.d.name} · Lv ${e.d.lvl}`; ctx.strokeText(txt, s.x, y - 6); ctx.fillText(txt, s.x, y - 6);
      }
    });
    // quest markers over villagers
    ctx.font = '600 22px Fredoka, sans-serif';
    G.npcs.forEach(n => {
      if (n.visible === false) return; const mark = G.npcMarker(n.id); if (!mark) return;
      const s = R3.project(n.x, n.y, n.id === 'mira' ? 1.05 : 1.5); const y = s.y - 6 + Math.sin(G.t * 4) * 3;
      ctx.fillStyle = '#f6f1e7'; ctx.beginPath(); ctx.arc(s.x, y - 7, 13, 0, 7); ctx.fill();
      ctx.lineWidth = 2; ctx.strokeStyle = mark === '!' ? '#d99a2b' : '#c8323c'; ctx.stroke();
      ctx.fillStyle = mark === '!' ? '#d99a2b' : '#c8323c'; ctx.fillText(mark, s.x, y + 1);
    });
    // floating numbers and words
    for (const t of E.texts) {
      const s = R3.project(t.x, t.y, 0.6);
      ctx.globalAlpha = Math.min(1, t.life * 2);
      ctx.font = (t.big ? '600 20px' : '600 15px') + ' Fredoka, sans-serif';
      ctx.lineWidth = 4; ctx.strokeStyle = 'rgba(29,37,48,0.85)'; ctx.strokeText(t.text, s.x, s.y);
      ctx.fillStyle = t.color; ctx.fillText(t.text, s.x, s.y);
    }
    ctx.globalAlpha = 1;
    if (p.hurtFlash > 0) { p.hurtFlash -= 1 / 60; const g = ctx.createRadialGradient(vw / 2, vh / 2, Math.min(vw, vh) * 0.3, vw / 2, vh / 2, Math.max(vw, vh) * 0.75); g.addColorStop(0, 'rgba(200,50,60,0)'); g.addColorStop(1, `rgba(200,50,60,${Math.min(0.7, p.hurtFlash * 1.4)})`); ctx.fillStyle = g; ctx.fillRect(0, 0, vw, vh); }
    if (!G.alive) { ctx.fillStyle = 'rgba(29,37,48,0.55)'; ctx.fillRect(0, 0, vw, vh); ctx.fillStyle = '#f6f1e7'; ctx.font = '600 34px Fredoka, sans-serif'; ctx.fillText('SUBJECT EXPIRED', vw / 2, vh / 2); }
  }
  function roundRect(x, y, w, h, r) { ctx.beginPath(); if (ctx.roundRect) ctx.roundRect(x, y, w, h, r); else ctx.rect(x, y, w, h); }

  // Title backdrop: drifting ledger pages and embers.
  const tpages = Array.from({ length: 34 }, (_, i) => ({ x: Math.random(), y: Math.random(), z: 0.3 + Math.random(), r: Math.random() - 0.5, id: i }));
  function drawTitle() {
    titleT += 1 / 60;
    ctx.fillStyle = '#060608'; ctx.fillRect(0, 0, vw, vh);
    const g = ctx.createRadialGradient(vw / 2, vh * 0.6, 10, vw / 2, vh * 0.6, Math.max(vw, vh) * 0.7);
    g.addColorStop(0, 'rgba(120,30,40,0.35)'); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(0, 0, vw, vh);
    for (const p of tpages) {
      const x = p.x * vw + Math.sin(titleT * 0.3 + p.id) * 20, y = ((p.y - titleT * 0.015 * p.z) % 1 + 1) % 1 * vh;
      ctx.save(); ctx.translate(x, y); ctx.rotate(p.r + titleT * 0.05 * (p.id % 2 ? 1 : -1)); ctx.scale(p.z, p.z);
      ctx.globalAlpha = 0.12 + p.z * 0.12;
      ctx.fillStyle = '#e8e1d3'; ctx.fillRect(-26, -34, 52, 68);
      ctx.fillStyle = 'rgba(0,0,0,0.5)'; for (let i = 0; i < 8; i++) ctx.fillRect(-18, -24 + i * 7, 26 + (i * 7) % 10, 2);
      ctx.restore();
    }
    ctx.globalAlpha = 1;
    for (let i = 0; i < 40; i++) {
      const x = (i * 97.3 % 1) * vw + Math.sin(titleT + i) * 12, y = vh - ((titleT * (20 + i % 7 * 8) + i * 53) % (vh + 40));
      ctx.fillStyle = `rgba(232,${120 + i % 5 * 20},70,${0.3 + (i % 3) * 0.2})`; ctx.fillRect(x, y, 2, 2);
    }
  }

  // ---------- Loop ----------
  function loop(now) {
    const dt = Math.min(0.05, (now - last) / 1000 || 0.016);
    last = now;
    if (G.state === 'intro') {
      if (IN.take('dash') || IN.take('confirm') || IN.take('attack') || IN.take('use')) AB.Intro.input();
      if (IN.take('escape')) AB.Intro.skip();
      if (!AB.UI.offerOpen()) AB.Intro.update(dt);
    } else if (G.state === 'play') {
      update(dt);
      if (Math.floor(G.t * 10) !== Math.floor((G.t - dt) * 10)) { U.updateHud(); U.setQuest(G.currentQuest()); U.drawMinimap(G); }
    }
    draw(dt);
    IN.endFrame();
    requestAnimationFrame(loop);
  }

  addEventListener('load', G.boot);
})();
