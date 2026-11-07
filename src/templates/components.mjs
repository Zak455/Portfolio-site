// Reusable presentation components. They only receive data — no content lives here.

export const esc = (s = '') =>
  String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const attrs = (o) =>
  Object.entries(o)
    .filter(([, v]) => v !== undefined && v !== null && v !== false)
    .map(([k, v]) => (v === true ? k : `${k}="${esc(v)}"`))
    .join(' ');

/* ── Brand ─────────────────────────────────────────────────────────────────── */

// The FUZAIL. wordmark. The F carries the brand "cut" (sheared terminal) and the
// full stop is the accent. Letters are individually wrapped for motion.
export function wordmark({ className = '', animate = false } = {}) {
  const letters = ['F', 'U', 'Z', 'A', 'I', 'L'];
  return `<span class="wm ${className}" aria-hidden="true">${letters
    .map((l, i) => `<span class="wm-l${i === 0 ? ' wm-f' : ''}"${animate ? ' data-wm' : ''}>${l}</span>`)
    .join('')}<span class="wm-l wm-dot"${animate ? ' data-wm' : ''}>.</span></span>`;
}

export const brandLink = (href = '/') =>
  `<a class="brand" href="${href}" aria-label="FUZAIL. — home">${wordmark()}</a>`;

export function availability(site, extra = '') {
  if (!site.availability?.enabled) return '';
  return `<p class="status ${extra}"><span class="status-dot" aria-hidden="true"></span>${esc(site.availability.label)}</p>`;
}

/* ── Typography ────────────────────────────────────────────────────────────── */

// A section heading: mono index + label, display title with an optional italic accent word.
export function sectionHeading({ index, label, title, accent, id, intro, level = 2 }) {
  const t = accent ? esc(title).replace(esc(accent), `<em>${esc(accent)}</em>`) : esc(title);
  return `<header class="section-head" data-reveal>
    <p class="eyebrow"><span class="eyebrow-index">(${esc(index)})</span><span>${esc(label)}</span></p>
    <h${level} class="section-title"${id ? ` id="${id}"` : ''}><span class="mask"><span class="mask-inner">${t}</span></span></h${level}>
    ${intro ? `<p class="section-intro">${esc(intro)}</p>` : ''}
  </header>`;
}

export const arrow = `<svg class="icon-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M5 19 19 5M9 5h10v10" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;
export const arrowRight = `<svg class="icon-arrow" viewBox="0 0 24 24" aria-hidden="true" focusable="false"><path d="M3 12h17M14 6l6 6-6 6" fill="none" stroke="currentColor" stroke-width="1.5"/></svg>`;

export function button({ href, label, variant = 'primary', external = false, icon = arrow, download }) {
  return `<a ${attrs({
    class: `btn btn-${variant}`,
    href,
    target: external ? '_blank' : undefined,
    rel: external ? 'noopener' : undefined,
    download,
  })}><span class="btn-label" data-label="${esc(label)}">${esc(label)}</span>${icon}${external ? '<span class="sr-only"> (opens in a new tab)</span>' : ''}</a>`;
}

/* ── Images ────────────────────────────────────────────────────────────────── */

export function picture({ base, widths, sizes, alt, ratio, className = '', lazy = true, priority = false }) {
  const srcset = widths.map((w) => `${base}-${w}.webp ${w}w`).join(', ');
  const src = `${base}-${widths[widths.length - 1]}.webp`;
  return `<img ${attrs({
    class: className,
    src,
    srcset,
    sizes,
    alt,
    width: ratio?.[0],
    height: ratio?.[1],
    loading: lazy && !priority ? 'lazy' : undefined,
    decoding: 'async',
    fetchpriority: priority ? 'high' : undefined,
  })}>`;
}

const objectWidths = { monogram: [800, 1400] };
export function objectImage(name, { sizes = '(min-width: 960px) 40vw, 80vw', className = 'object', priority = false } = {}) {
  return picture({
    base: `/assets/img/objects/${name}`,
    widths: objectWidths[name] || [600, 1000],
    sizes,
    alt: '',
    ratio: [1000, 1000],
    className,
    priority,
    lazy: !priority,
  });
}

/* ── Project cover (shared by home showcase, case study hero & next-project) ─ */

export function projectCover(p, { priority = false, sizes } = {}) {
  return `<div class="cover cover--${esc(p.object)}" style="--cover-accent:${esc(p.theme?.accent || '#c6ff3d')}">
    <span class="cover-num" aria-hidden="true">${esc(p.number)}</span>
    <span class="cover-grid" aria-hidden="true"></span>
    <span class="cover-light" aria-hidden="true"></span>
    <div class="cover-object" data-parallax>${objectImage(p.object, { priority, sizes: sizes || '(min-width: 960px) 45vw, 90vw', className: 'cover-img' })}</div>
    <span class="cover-tag" aria-hidden="true">${esc(p.category)}</span>
    <span class="cover-name" aria-hidden="true">${esc(p.name)}</span>
  </div>`;
}

export const tagList = (tags = []) =>
  tags.length ? `<ul class="tags" role="list">${tags.map((t) => `<li>${esc(t)}</li>`).join('')}</ul>` : '';

/* ── Placeholder for missing visuals — deliberately obvious ───────────────── */

export function mediaFrame(m, slug) {
  if (m.src) {
    return `<figure class="media${m.wide ? ' media--wide' : ''}" data-reveal="image">
      <div class="media-frame"><img src="${esc(m.src)}" alt="${esc(m.alt || '')}" loading="lazy" decoding="async"${m.width ? ` width="${m.width}" height="${m.height}"` : ''}></div>
      ${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ''}
    </figure>`;
  }
  if (m.compare?.before && m.compare?.after) {
    return `<figure class="media media--wide compare" data-compare data-reveal="image">
      <div class="media-frame compare-frame">
        <img src="${esc(m.compare.after)}" alt="${esc(m.compare.afterAlt || 'After')}" loading="lazy">
        <div class="compare-before"><img src="${esc(m.compare.before)}" alt="${esc(m.compare.beforeAlt || 'Before')}" loading="lazy"></div>
        <input class="compare-range" type="range" min="0" max="100" value="50" aria-label="Compare before and after">
        <span class="compare-handle" aria-hidden="true"></span>
      </div>
      ${m.caption ? `<figcaption>${esc(m.caption)}</figcaption>` : ''}
    </figure>`;
  }
  return `<figure class="media media--placeholder${m.wide ? ' media--wide' : ''}" data-reveal="image">
    <div class="media-frame">
      <span class="ph-label">Visual placeholder</span>
      <span class="ph-brief">${esc(m.placeholder)}</span>
      <span class="ph-path">Replace in content/projects.mjs → ${esc(slug)}</span>
    </div>
  </figure>`;
}
