// Aetherbound: keyboard, mouse and touch input.
(function () {
  const I = {
    keys: {}, pressed: {}, mouse: { x: 0, y: 0, used: false, l: false, r: false },
    joy: { x: 0, y: 0, active: false }, touch: false,
  };

  const map = {
    KeyW: 'up', ArrowUp: 'up', KeyS: 'down', ArrowDown: 'down', KeyA: 'left', ArrowLeft: 'left', KeyD: 'right', ArrowRight: 'right',
    KeyJ: 'attack', KeyK: 'cast', KeyH: 'heal', KeyE: 'use', KeyF: 'use', Enter: 'confirm', Space: 'dash', KeyQ: 'ability',
    Tab: 'ledger', KeyI: 'ledger', KeyL: 'ledger', Escape: 'escape', KeyM: 'mute',
  };

  addEventListener('keydown', e => {
    const a = map[e.code];
    if (!a) return;
    if (['Tab', 'Space', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.code)) e.preventDefault();
    if (!I.keys[a]) I.pressed[a] = true;
    I.keys[a] = true;
  });
  addEventListener('keyup', e => { const a = map[e.code]; if (a) I.keys[a] = false; });
  addEventListener('blur', () => { I.keys = {}; });

  I.bindCanvas = function (canvas) {
    canvas.addEventListener('mousemove', e => {
      const r = canvas.getBoundingClientRect();
      I.mouse.x = e.clientX - r.left; I.mouse.y = e.clientY - r.top; I.mouse.used = true;
    });
    canvas.addEventListener('mousedown', e => {
      if (I.touch) return;
      const r = canvas.getBoundingClientRect();
      I.mouse.x = e.clientX - r.left; I.mouse.y = e.clientY - r.top; I.mouse.used = true;
      if (e.button === 0) I.pressed.attack = true;
      if (e.button === 2) I.pressed.cast = true;
    });
    canvas.addEventListener('contextmenu', e => e.preventDefault());
  };

  // Virtual joystick + buttons for touch screens.
  I.bindTouch = function (root) {
    const pad = root.querySelector('#joy');
    const knob = root.querySelector('#joyKnob');
    let id = null, cx = 0, cy = 0;
    const R = 46;
    pad.addEventListener('touchstart', e => {
      const t = e.changedTouches[0]; id = t.identifier;
      const r = pad.getBoundingClientRect(); cx = r.left + r.width / 2; cy = r.top + r.height / 2;
      I.joy.active = true; move(t); e.preventDefault();
    }, { passive: false });
    const move = t => {
      let dx = t.clientX - cx, dy = t.clientY - cy;
      const d = Math.hypot(dx, dy);
      if (d > R) { dx = dx / d * R; dy = dy / d * R; }
      knob.style.transform = `translate(${dx}px, ${dy}px)`;
      I.joy.x = dx / R; I.joy.y = dy / R;
    };
    addEventListener('touchmove', e => {
      for (const t of e.changedTouches) if (t.identifier === id) { move(t); e.preventDefault(); }
    }, { passive: false });
    const end = e => {
      for (const t of e.changedTouches) if (t.identifier === id) {
        id = null; I.joy.active = false; I.joy.x = I.joy.y = 0; knob.style.transform = '';
      }
    };
    addEventListener('touchend', end); addEventListener('touchcancel', end);
    root.querySelectorAll('[data-act]').forEach(b => {
      b.addEventListener('touchstart', e => { I.pressed[b.dataset.act] = true; I.keys[b.dataset.act] = true; e.preventDefault(); }, { passive: false });
      b.addEventListener('touchend', e => { I.keys[b.dataset.act] = false; e.preventDefault(); }, { passive: false });
      b.addEventListener('click', () => { I.pressed[b.dataset.act] = true; });
    });
  };

  addEventListener('touchstart', () => { if (!I.touch) { I.touch = true; document.body.classList.add('touch'); } }, { passive: true });

  I.axis = function () {
    let x = (I.keys.right ? 1 : 0) - (I.keys.left ? 1 : 0);
    let y = (I.keys.down ? 1 : 0) - (I.keys.up ? 1 : 0);
    if (I.joy.active) { x = I.joy.x; y = I.joy.y; if (Math.hypot(x, y) < 0.2) x = y = 0; }
    const d = Math.hypot(x, y);
    if (d > 1) { x /= d; y /= d; }
    return { x, y };
  };

  I.take = function (a) { const v = !!I.pressed[a]; I.pressed[a] = false; return v; };
  I.endFrame = function () { I.pressed = {}; };

  AB.Input = I;
})();
