import { esc, productShot, tagList, liveLinks, mediaFrame, arrowRight, ctaBand } from './components.mjs';
import { caseArt } from './case-art.mjs';

// "100K+" → <span data-count="100">100</span>K+ so the number counts up (main.js).
const countUp = (v) => {
  const m = /^(\D*)(\d+)(.*)$/.exec(String(v));
  return m ? `${esc(m[1])}<span data-count="${m[2]}">${m[2]}</span>${esc(m[3])}` : esc(v);
};

// Returns only the sections that have something to show; empty ones are listed
// in an HTML comment so they're easy to find and fill in.
// Placeholder frames (media without a real image) are left out unless
// site.showPlaceholders is true, so the public site shows finished visuals only.
function resolveSections(p, sectionOrder, showPlaceholders) {
  const shown = [];
  const pending = [];
  for (const [key, title] of sectionOrder) {
    const raw = p.sections[key] || {};
    const s = showPlaceholders ? raw : { ...raw, media: (raw.media || []).filter((m) => m.src || m.compare || m.video) };
    const list = s.useContribution ? p.contribution : s.list;
    const has = (s.body && s.body.length) || (list && list.length) || (s.media && s.media.length);
    (has ? shown : pending).push({ key, title, ...s, list });
  }
  return { shown, pending };
}

// Objectives and key decisions read better as numbered cards than as bullets.
const CARD_LISTS = { objectives: 'Goal', decisions: 'Decision' };

function listBlock(s) {
  if (!s.list?.length) return '';
  const kind = CARD_LISTS[s.key];
  if (kind) {
    return `<ol class="cs-cards cs-cards--${s.key}" role="list">${s.list
      .map((l, j) => `<li class="cs-cardlet" style="--j:${j}" data-fade><span class="cs-cardlet-n">${kind} ${String(j + 1).padStart(2, '0')}</span><p>${esc(l)}</p></li>`)
      .join('')}</ol>`;
  }
  return `<ul class="cs-list" role="list">${s.list.map((l, j) => `<li style="--j:${j}"><svg class="tick" viewBox="0 0 20 20" aria-hidden="true"><circle cx="10" cy="10" r="9"/><path d="M6 10.4l2.7 2.7L14.2 7.6" pathLength="1"/></svg>${esc(l)}</li>`).join('')}</ul>`;
}

function sectionBlock(s, i, p) {
  const id = `s-${s.key}`;
  const body = (s.body || []).map((b, j) => `<p${s.key === 'introduction' && j === 0 ? ' class="cs-lead"' : ''}>${esc(b)}</p>`).join('');
  const list = listBlock(s);
  const isRole = s.key === 'role';
  const media = s.media?.length ? `<div class="cs-media">${s.media.map((m) => mediaFrame(m, p.slug)).join('')}</div>` : '';
  const n = String(i + 1).padStart(2, '0');
  return `<section class="cs-section cs-section--${s.key}${isRole ? ' cs-section--role' : ''}" id="${id}" aria-labelledby="${id}-t" data-cs-section>
    <div class="cs-section-head" data-fade>
      <p class="cs-index" aria-hidden="true">${n}</p>
      <h2 class="cs-title" id="${id}-t"><span class="sr-only">${n}. </span>${esc(s.title)}</h2>
    </div>
    <div class="cs-section-body" data-fade>
      ${isRole ? '<p class="eyebrow">My contribution</p>' : ''}
      ${body}${list}
      ${isRole && p.teamNote ? `<p class="cs-team-note">${esc(p.teamNote)}</p>` : ''}
    </div>
    ${media}
  </section>`;
}

export function caseStudyPage({ site, project: p, next, sectionOrder }) {
  const { shown, pending } = resolveSections(p, sectionOrder, site.showPlaceholders);
  const toc = shown
    .map((s, i) => `<li><a href="#s-${s.key}" data-toc="s-${s.key}"><span>${String(i + 1).padStart(2, '0')}</span>${esc(s.title)}</a></li>`)
    .join('');
  return `<article class="cs">
  ${site.showPlaceholders ? `<!-- Sections waiting for content (edit content/projects.mjs): ${pending.map((s) => s.title).join(', ') || 'none'} -->` : ''}
  <header class="cs-hero">
    <div class="wrap">
      <nav class="crumbs" aria-label="Breadcrumb"><a href="/#work">Work</a><span aria-hidden="true">/</span><span aria-current="page">${esc(p.name)}</span></nav>
      <div class="cs-head-grid">
        <div class="cs-head-copy">
          <p class="eyebrow" data-fade>${esc(p.number)} · ${esc(p.category)}</p>
          <h1 class="cs-name" data-fade>${esc(p.name)}</h1>
          <p class="cs-summary" data-fade>${esc(p.summary)}</p>
        </div>
        <div data-fade>${caseArt(p)}</div>
      </div>
      <dl class="cs-facts" data-fade>
        <div><dt>My role</dt><dd>${esc(p.role)}</dd></div>
        <div><dt>Company</dt><dd>${esc(p.company || site.company)}</dd></div>
        ${p.year ? `<div><dt>Year</dt><dd>${esc(p.year)}</dd></div>` : ''}
        <div><dt>Areas</dt><dd>${tagList(p.tags)}</dd></div>
        ${p.links?.length ? `<div><dt>Live</dt><dd>${liveLinks(p.links)}</dd></div>` : ''}
      </dl>
    </div>
    <div class="wrap cs-cover" data-fade style="view-transition-name:shot-${esc(p.slug)}">${productShot(p, { priority: true, caption: true, sizes: '(min-width: 1200px) 1140px, 94vw' })}</div>
    ${p.glance?.length ? `<div class="wrap"><ul class="cs-glance" role="list" aria-label="At a glance">${p.glance.map((g) => `<li data-fade><b>${countUp(g.n)}</b><span class="cs-glance-l">${esc(g.l)}</span></li>`).join('')}</ul></div>` : ''}
  </header>

  <div class="cs-layout wrap">
    <aside class="cs-aside" aria-label="Case study sections">
      <div class="cs-aside-inner">
        <p class="cs-aside-label">On this page</p>
        <ol class="toc" role="list">${toc}</ol>
        <div class="cs-progress" aria-hidden="true"><span data-cs-progress></span></div>
      </div>
    </aside>
    <div class="cs-content">
      ${shown.map((s, i) => sectionBlock(s, i, p) + (i === 3 && shown.length > 6 ? ctaBand(site, { inline: true, eyebrow: 'Enjoying this case study?', title: 'Let’s talk about what I could design for you.', text: 'Senior UI/UX Designer, open to new roles. Email me or grab the one-page CV.' }) : '')).join('')}
      ${ctaBand(site, { inline: true, tone: 'tint', eyebrow: 'Want the full story?', title: 'I’ll walk you through the process on a call.', text: 'Research, explorations, wireframes and the decisions behind this work: happy to share the details live.' })}
    </div>
  </div>

  <nav class="next wrap" aria-label="Next project">
    <a class="next-card" href="/work/${esc(next.slug)}/">
      <span class="next-text">
        <span class="eyebrow">Next project</span>
        <span class="next-name">${esc(next.name)}</span>
        <span class="next-cat">${esc(next.category)}</span>
        <span class="text-link">View case study ${arrowRight}</span>
      </span>
      <span class="next-visual" aria-hidden="true">${productShot(next, { sizes: '(min-width: 960px) 40vw, 90vw' })}</span>
    </a>
  </nav>
</article>`;
}

export function notFoundPage() {
  return `<section class="nf wrap">
    <p class="eyebrow">404</p>
    <h1 class="nf-title">Page not found.</h1>
    <p>This page doesn’t exist, but the work does.</p>
    <a class="btn btn-primary" href="/">Back to home ${arrowRight}</a>
  </section>`;
}
