import { esc, arrow, pixelBand, pixelGlyph, splitChars } from './components.mjs';

const navItems = [
  ['Work', '/#work', 'work'],
  ['About', '/#about', 'about'],
  ['Services', '/#services', 'services'],
  ['Experience', '/#experience', 'experience'],
  ['Contact', '#contact', 'contact'],
];

const mailOr = (site, fallback) => (site.contact.email ? `mailto:${site.contact.email}` : fallback);

/* ── Top bar ──────────────────────────────────────────────────────────────── */
export function nav(site, { home = true } = {}) {
  const href = (h) => (home || h.startsWith('#') ? h.replace('/#', '#') : h);
  const links = navItems
    .map(([label, h, id], i) => `<li><a class="menu-link" href="${href(h)}" data-nav="${id}"><span class="menu-idx">0${i + 1}</span><span class="menu-text">${label}</span></a></li>`)
    .join('');
  return `<a class="skip" href="#main">Skip to content</a>
<header class="bar" data-nav-root>
  <a class="bar-brand" href="${home ? '#top' : '/'}" aria-label="FUZAIL. — home">
    <span class="bar-logo">${pixelGlyph('f', { cell: 3 })}</span>
    <span class="bar-name mono">Fuzail.</span>
  </a>
  <button class="bar-grid mono" type="button" aria-pressed="false" data-grid-toggle>
    Grid <span data-grid-state>Off</span>
  </button>
  <button class="bar-grid bar-sound mono" type="button" aria-pressed="false" data-sound-toggle>
    Sound <span data-sound-state>Off</span>
  </button>
  <div class="bar-strip">${pixelBand({ seq: ['anchor', 'cross', 'node', 'cross'], cell: 2, className: 'band--strip' })}</div>
  ${site.availability?.enabled ? `<p class="bar-status mono"><span class="status-dot" aria-hidden="true"></span>${esc(site.availability.label)}</p>` : ''}
  <button class="bar-menu mono" type="button" aria-expanded="false" aria-controls="menu" data-menu-btn>
    <span data-menu-label>Menu</span>
  </button>
  <div class="menu" id="menu" data-menu hidden>
    <div class="menu-inner">
      <nav aria-label="Primary"><ol class="menu-list" role="list">${links}</ol></nav>
      <div class="menu-aside">
        <p class="mono menu-label">Direct</p>
        ${site.contact.email ? `<a class="menu-contact" href="mailto:${esc(site.contact.email)}">${esc(site.contact.email)}</a>` : ''}
        <a class="menu-contact" href="${esc(site.contact.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>
        ${site.contact.cv ? `<a class="menu-contact" href="${esc(site.contact.cv)}" target="_blank" rel="noopener">View CV ↗</a>` : ''}
        <p class="mono menu-label">${esc(site.place.city)} · ${esc(site.place.coords)}</p>
      </div>
    </div>
    ${pixelBand({ className: 'menu-band' })}
  </div>
</header>`;
}

/* ── Footer = contact (on every page) ─────────────────────────────────────── */
export function footer(site) {
  const c = site.contact;
  const year = new Date().getFullYear();
  return `<footer class="foot" id="contact" data-section="contact" aria-labelledby="contact-title">
  ${pixelBand({ seq: ['f', 'cross', 'node', 'cross', 'pen', 'cross', 'anchor', 'cross'] })}
  <p class="caption wrap mono">Frame 10 · “Contact” — drawn on a 4px grid in ${esc(site.place.short)}</p>
  <div class="foot-inner wrap">
    <p class="mono foot-kicker">Have something interesting in mind? Good work starts with a conversation.</p>
    <h2 class="foot-title" id="contact-title">
      <a class="foot-cta" href="${mailOr(site, c.linkedin)}"${c.email ? '' : ' target="_blank" rel="noopener"'}>
        <span class="foot-cta-line">Let’s make</span>
        <span class="foot-cta-line">something <span class="foot-cta-tail"><span class="foot-cta-em">real.</span><span class="foot-cta-arrow" aria-hidden="true">${arrow}</span></span></span>
      </a>
    </h2>
    <div class="foot-grid">
      <div class="foot-col">
        <p class="mono foot-label">Based in ${esc(site.place.short)} · ${esc(site.place.timezone)}</p>
        <a class="btn-pixel" href="${mailOr(site, c.linkedin)}"${c.email ? '' : ' target="_blank" rel="noopener"'}>${c.email ? 'Send an email' : 'Message on LinkedIn'} ${arrow}</a>
        ${c.email ? `<button class="copy-btn mono" type="button" data-copy="${esc(c.email)}"><span data-copy-label>Copy email</span></button>` : ''}
      </div>
      <div class="foot-col">
        <p class="mono foot-label">Direct</p>
        ${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''}
        ${c.cv ? `<a href="${esc(c.cv)}" target="_blank" rel="noopener">View CV ↗</a>` : ''}
      </div>
      <div class="foot-col">
        <p class="mono foot-label">Elsewhere</p>
        <a href="${esc(c.linkedin)}" target="_blank" rel="noopener">LinkedIn ↗</a>
        ${c.github ? `<a href="${esc(c.github)}" target="_blank" rel="noopener">GitHub ↗</a>` : ''}
        <span>${esc(site.title)} @ ${esc(site.company.replace(' India Private Limited', ''))}</span>
      </div>
    </div>
    <p class="foot-mark" aria-hidden="true" data-foot-mark>FUZAIL.</p>
    <div class="foot-meta mono">
      <span>© ${year} ${esc(site.name)}</span>
      <span>Static HTML · GSAP · No frameworks</span>
      <a href="#top">Back to top ↑</a>
    </div>
  </div>
  ${pixelBand({ seq: ['node', 'anchor', 'f', 'anchor', 'node', 'cursor'], className: 'band--end' })}
  <p class="caption wrap mono caption--end">${esc(site.place.city)} · ${esc(site.place.coords)} · ${esc(site.brand)} Designing beyond the interface.</p>
</footer>`;
}

/* ── Intro splash (home only, once per session, JS + motion only) ─────────── */
export function intro(site) {
  return `<div class="intro" data-intro aria-hidden="true">
  <div class="intro-top mono"><span>${esc(site.brand)} — Studio</span><span>${esc(site.place.short)}<br>${esc(site.place.coords)}</span></div>
  <div class="intro-center">
    <span class="intro-mark">${pixelGlyph('f', { cell: 10 })}</span>
    <span class="intro-word">${splitChars('Hello.')}</span>
  </div>
  <div class="intro-bottom">
    <p class="mono">Setting up the artboard · Frame 01 “Hello” <span data-intro-count>00</span>%</p>
    ${pixelBand({ className: 'intro-band' })}
  </div>
</div>`;
}

export function layout({ site, title, description, path = '/', body, home = true, assetVersion = '', ogImage, bodyClass = '' }) {
  const url = site.url + path;
  const og = site.url + (ogImage || site.seo.ogImage);
  const fullTitle = title ? `${title} — ${site.brand}` : `${site.name} — ${site.title}`;
  const desc = description || site.seo.description;
  const v = assetVersion ? `?v=${assetVersion}` : '';
  return `<!doctype html>
<html lang="en">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>${esc(fullTitle)}</title>
<meta name="description" content="${esc(desc)}">
<link rel="canonical" href="${esc(url)}">
<meta name="theme-color" content="#0a0a0b">
<meta name="color-scheme" content="dark">
<meta property="og:type" content="website">
<meta property="og:site_name" content="${esc(site.brand)}">
<meta property="og:title" content="${esc(fullTitle)}">
<meta property="og:description" content="${esc(desc)}">
<meta property="og:url" content="${esc(url)}">
<meta property="og:image" content="${esc(og)}">
<meta property="og:image:width" content="1200">
<meta property="og:image:height" content="630">
<meta name="twitter:card" content="summary_large_image">
<meta name="twitter:title" content="${esc(fullTitle)}">
<meta name="twitter:description" content="${esc(desc)}">
<meta name="twitter:image" content="${esc(og)}">
<link rel="icon" href="/favicon.svg" type="image/svg+xml">
<link rel="icon" href="/favicon-32.png" sizes="32x32" type="image/png">
<link rel="apple-touch-icon" href="/apple-touch-icon.png">
<link rel="preload" href="/assets/fonts/archivo-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/assets/fonts/inter-var.woff2" as="font" type="font/woff2" crossorigin>
<link rel="stylesheet" href="/assets/css/main.css${v}">
<script>
  // Progressive enhancement: content is visible by default; motion only hides
  // things once JS + motion are allowed, with a failsafe if scripts never run.
  (function (d) {
    var r = d.documentElement; r.classList.add('js');
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) r.classList.add('motion');
    try { if (localStorage.getItem('fz-grid') === '1') r.classList.add('show-grid'); } catch (e) {}
    try { if (${home ? 'true' : 'false'} && !sessionStorage.getItem('fz-intro') && r.classList.contains('motion')) r.classList.add('intro-on'); } catch (e) {}
    setTimeout(function () { if (!window.__motion) r.classList.add('motion-failed'); }, 3500);
  })(document);
</script>
<script type="application/ld+json">${JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: site.name,
    jobTitle: site.title,
    worksFor: { '@type': 'Organization', name: site.company },
    address: { '@type': 'PostalAddress', addressRegion: 'Goa', addressCountry: 'IN' },
    url: site.url,
    sameAs: [site.contact.linkedin, site.contact.github].filter(Boolean),
  })}</script>
</head>
<body class="${bodyClass}" id="top">
${home ? intro(site) : ''}
<div class="grid-overlay" aria-hidden="true"><div class="wrap grid-cols">${'<span></span>'.repeat(12)}</div></div>
${nav(site, { home })}
<main id="main">
${body}
</main>
${footer(site)}
<script src="/assets/js/vendor/gsap.min.js${v}" defer></script>
<script src="/assets/js/vendor/ScrollTrigger.min.js${v}" defer></script>
<script src="/assets/js/main.js${v}" defer></script>
</body>
</html>
`;
}
