// Motion graphics: hand-built SVG animated with CSS only. They play while on
// screen (.is-playing, set by main.js) when motion is on; otherwise they show
// their finished state as a still illustration.

/* ── 01 Research: scattered notes cluster into three groups ─────────────── */
function researchSvg() {
  const centers = [[72, 98], [150, 98], [228, 98]];
  const offs = [[-26, -22], [0, -10], [-16, 8]];
  const fills = ['var(--mg-blue)', 'var(--mg-ink)', 'var(--mg-sky)'];
  // scatter start positions (relative to final), hand-placed so nothing collides
  const scatter = [[60, 50], [-40, 70], [30, -50], [-70, -40], [50, 60], [-20, -60], [-90, 40], [40, -55], [-60, 65]];
  let notes = '', k = 0;
  centers.forEach(([cx, cy], g) => {
    offs.forEach(([ox, oy]) => {
      const [sx, sy] = scatter[k];
      notes += `<rect class="mg-note" x="${cx + ox}" y="${cy + oy}" width="26" height="18" rx="4" fill="${fills[g]}" style="--sx:${sx}px;--sy:${sy}px;--d:${(k * 0.04).toFixed(2)}s"/>`;
      k++;
    });
  });
  return `<svg viewBox="0 0 300 200" role="img" aria-label="Research notes clustering into three themes">
    <rect width="300" height="200" rx="18" class="mg-bg"/>
    ${centers.map(([cx, cy]) => `<circle class="mg-zone" cx="${cx}" cy="${cy + 2}" r="44"/>`).join('')}
    ${notes}
    <g class="mg-tagline">${centers.map(([cx], i) => `<rect x="${cx - 18}" y="160" width="36" height="6" rx="3" class="mg-line" style="--d:${0.1 * i}s"/>`).join('')}</g>
  </svg>`;
}

/* ── 02 Structure: a wireframe draws itself ─────────────────────────────── */
function wireframeSvg() {
  const parts = [
    '<rect x="40" y="26" width="220" height="150" rx="12"/>',
    '<path d="M40 52H260"/>',
    '<rect x="58" y="68" width="88" height="68" rx="6"/>',
    '<path d="M58 68l88 68M146 68l-88 68"/>',
    '<path d="M162 74h80"/>',
    '<path d="M162 90h64"/>',
    '<path d="M162 106h48"/>',
    '<rect x="162" y="120" width="72" height="20" rx="10"/>',
    '<path d="M54 39h28"/>',
  ];
  return `<svg viewBox="0 0 300 200" role="img" aria-label="A wireframe being drawn">
    <rect width="300" height="200" rx="18" class="mg-bg"/>
    <g class="mg-grid">${[60, 100, 140, 180, 220, 260].map((x) => `<path d="M${x} 14V186"/>`).join('')}</g>
    <g class="mg-wire">${parts.map((p, i) => p.replace(/\/>$/, ` pathLength="1" style="--d:${(i * 0.12).toFixed(2)}s"/>`)).join('')}</g>
  </svg>`;
}

/* ── 03 Interface & motion: the finished UI, a cursor clicks it ─────────── */
function interfaceSvg() {
  return `<svg viewBox="0 0 300 200" role="img" aria-label="A finished interface card with a toggle and a button being clicked">
    <rect width="300" height="200" rx="18" class="mg-bg"/>
    <g class="mg-ui">
      <rect x="40" y="26" width="220" height="150" rx="12" class="mg-card"/>
      <path d="M52 26h196a12 12 0 0 1 12 12v14H40V38a12 12 0 0 1 12-12z" class="mg-head"/>
      <circle cx="56" cy="39" r="4" class="mg-dot"/><circle cx="68" cy="39" r="4" class="mg-dot"/>
      <circle cx="74" cy="84" r="16" class="mg-avatar"/>
      <rect x="100" y="74" width="78" height="8" rx="4" class="mg-fill"/>
      <rect x="100" y="88" width="54" height="8" rx="4" class="mg-fill mg-fill--soft"/>
      <g class="mg-toggle"><rect x="196" y="74" width="44" height="24" rx="12" class="mg-track"/><circle cx="208" cy="86" r="9" class="mg-knob"/></g>
      <g class="mg-btn"><rect x="96" y="128" width="108" height="30" rx="15" class="mg-btn-bg"/><text x="150" y="147.5" text-anchor="middle" class="mg-btn-text">Continue</text></g>
      <circle cx="150" cy="143" r="15" class="mg-ripple"/>
    </g>
    <path class="mg-cursor" d="M0 0v20l5.5-5.2 3.6 8 3.4-1.5-3.5-7.8h7.6z"/>
  </svg>`;
}

export function processGraphic() {
  const steps = [
    ['01', 'Research', 'Interviews, competitors and data, clustered into the themes that matter.', researchSvg()],
    ['02', 'Structure', 'Flows and wireframes that settle the hard questions before any polish.', wireframeSvg()],
    ['03', 'Interface & motion', 'The final UI, with interactions that explain themselves.', interfaceSvg()],
  ];
  return `<div class="mg mg-process" data-mg>
    ${steps
      .map(([n, t, d, svg], i) => `${i ? '<span class="mg-link" aria-hidden="true"><i></i></span>' : ''}<figure class="mg-step">
        <div class="mg-frame">${svg}</div>
        <figcaption><span class="mg-n">${n}</span><strong>${t}</strong><span>${d}</span></figcaption>
      </figure>`)
      .join('')}
  </div>`;
}

/* ── Small looping icons for the three service cards ────────────────────── */
const icons = [
  // Understand: a lens scans a flow and lights each node
  `<svg viewBox="0 0 120 64" aria-hidden="true" class="mg-icon mg-icon--scan">
    <path d="M18 32h84" class="i-line"/>
    <circle cx="18" cy="32" r="7" class="i-node" style="--d:0s"/><circle cx="60" cy="32" r="7" class="i-node" style="--d:.5s"/><circle cx="102" cy="32" r="7" class="i-node" style="--d:1s"/>
    <g class="i-lens"><circle cx="18" cy="28" r="13" class="i-glass"/><path d="M27 37l9 9" class="i-handle"/></g>
  </svg>`,
  // Shape: layout blocks drop into a grid
  `<svg viewBox="0 0 120 64" aria-hidden="true" class="mg-icon mg-icon--blocks">
    <rect x="8" y="6" width="66" height="22" rx="4" class="i-block" style="--d:0s"/>
    <rect x="80" y="6" width="32" height="52" rx="4" class="i-block i-block--blue" style="--d:.15s"/>
    <rect x="8" y="34" width="30" height="24" rx="4" class="i-block" style="--d:.3s"/>
    <rect x="44" y="34" width="30" height="24" rx="4" class="i-block" style="--d:.45s"/>
  </svg>`,
  // Move: a ball eases along a bezier curve
  `<svg viewBox="0 0 120 64" aria-hidden="true" class="mg-icon mg-icon--ease">
    <path d="M8 56H112M8 56V6" class="i-axis"/>
    <path d="M10 54C52 54 60 8 110 8" class="i-curve"/>
    <circle r="6" class="i-ball"/>
  </svg>`,
];
export const serviceIcon = (i) => icons[i % icons.length];
