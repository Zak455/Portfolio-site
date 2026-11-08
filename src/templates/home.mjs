import {
  esc, arrow, arrowRight, objectImage, picture, pixelBand, pixelGlyph, splitWords, splitChars, liveLinks,
} from './components.mjs';

// Giant section title with a frame caption above it — every section reads like
// an artboard on a canvas: "Frame 03 · “Toolkit”".
function frameHead({ n, name, title, count, id, tone = '' }) {
  return `<header class="frame-head ${tone}">
    <p class="caption mono">Frame ${n} · “${esc(name)}”</p>
    <div class="frame-row">
      <h2 class="giant" id="${id}" data-giant>${splitChars(title)}</h2>
      ${count ? `<p class="mono frame-count">${esc(count)}</p>` : ''}
    </div>
  </header>`;
}

/* ── Hero ─────────────────────────────────────────────────────────────────── */
function hero(site, about) {
  const since = String(site.designingSince).slice(-2);
  return `<section class="hero" aria-labelledby="hero-name" data-hero>
  <div class="hero-grid wrap">
    <div class="hero-left" data-fade>
      <p class="badge badge--solid mono">${esc(site.title)} @ Spintly</p>
      <p class="badge mono">UX Strategy · UI · Motion · Visual</p>
      <p class="hero-intro">${esc(site.name)} — turning research into high-impact interfaces, from ${esc(site.place.city)}.</p>
      <p class="hero-tag">Designing <em>beyond</em> the interface.</p>
      <div class="hero-links">
        <a class="link-arrow mono" href="#work">Selected work ${arrowRight}</a>
        <a class="link-arrow mono" href="${site.contact.email ? `mailto:${esc(site.contact.email)}` : '#contact'}">Let’s collaborate ${arrow}</a>
      </div>
    </div>
    <figure class="hero-portrait" data-portrait>
      ${pixelBand({ seq: ['anchor', 'cross', 'f', 'cross'], cell: 3, className: 'band--portrait' })}
      <div class="portrait-frame">
        ${picture({ base: about.portrait.src, widths: [560, 1000], sizes: '(min-width: 960px) 30vw, 70vw', alt: about.portrait.alt, ratio: [1000, 1501], className: 'portrait-img', priority: true })}
        <span class="portrait-dots" aria-hidden="true"></span>
        <span class="portrait-sel" aria-hidden="true"><i></i><i></i><i></i><i></i><b class="mono">Fuzail Khan · 1000 × 1500</b></span>
      </div>
      ${pixelBand({ seq: ['cross', 'f', 'cross', 'anchor'], cell: 3, className: 'band--portrait' })}
      <a class="scroll-cue mono" href="#story">Scroll</a>
    </figure>
    <div class="hero-right" data-fade>
      <p class="mono">Designing since</p>
      <p class="hero-since">’${since}</p>
    </div>
  </div>
  <h1 class="hero-name" id="hero-name"><span class="sr-only">${esc(site.name)} — ${esc(site.title)}</span>
    <span class="hero-name-l" aria-hidden="true" data-name-l>FUZ</span><span class="hero-name-r" aria-hidden="true" data-name-r>AIL.</span>
  </h1>
</section>`;
}

/* ── Story: three chapters that pin and swap as you scroll ────────────────── */
function storySection(story) {
  const chapters = story
    .map((c, i) => `<article class="chapter${i === 0 ? ' is-active' : ''}" data-chapter="${i}" aria-labelledby="ch-${i}">
      <p class="mono chapter-meta"><span>${String(i + 1).padStart(2, '0')}</span>${esc(c.label)} · ${esc(c.period)}</p>
      <h3 class="chapter-title" id="ch-${i}">${esc(c.title)}</h3>
      <p class="chapter-text">${esc(c.text)}</p>
    </article>`)
    .join('');
  return `<section class="story" id="story" aria-labelledby="story-title" data-story style="--chapters:${story.length}">
  <div class="story-pin">
    <div class="wrap story-inner">
      <div class="story-side">
        <p class="caption mono">Frame 02 · “Story”</p>
        <h2 class="story-heading" id="story-title">Researcher.<br>Designer.<br><em>Maker.</em></h2>
        <ol class="story-steps" role="list" aria-hidden="true">${story.map((c, i) => `<li data-step="${i}"${i === 0 ? ' class="is-active"' : ''}><span class="mono">${String(i + 1).padStart(2, '0')}</span>${pixelGlyph(c.glyph, { cell: 3 })}</li>`).join('')}</ol>
        <p class="mono story-hint">Scroll to unfold ↓</p>
      </div>
      <div class="story-stage">${chapters}</div>
    </div>
  </div>
</section>`;
}

/* ── About: inspector panel + reading paragraph ───────────────────────────── */
function aboutSection(site, about) {
  const rows = [
    ['Layer', site.name],
    ['Role', site.title],
    ['Company', site.company],
    ['Location', site.place.city],
    ['Position', site.place.coords],
    ['Designing since', String(site.designingSince)],
    ['Product design', `${site.experienceYears}+ years`],
    ['Status', site.availability?.enabled ? site.availability.label : '—'],
  ];
  return `<section class="about section" id="about" aria-labelledby="about-title" data-section="about">
  <div class="wrap about-grid">
    <aside class="inspector" aria-label="Profile details" data-reveal>
      <div class="inspector-head mono"><span>${pixelGlyph('node', { cell: 2 })} Inspector</span><span>Frame 04</span></div>
      <dl>${rows.map(([k, v]) => `<div><dt class="mono">${esc(k)}</dt><dd>${esc(v)}</dd></div>`).join('')}</dl>
      <div class="inspector-swatches mono"><span class="sw sw--lime"></span>C6FF3D <span class="sw sw--ink"></span>0A0A0B</div>
    </aside>
    <div class="about-copy">
      <p class="caption mono">Frame 04 · “About”</p>
      <h2 class="sr-only" id="about-title">About</h2>
      <p class="reading" data-words>Hello! ${splitWords(about.lead)} ${splitWords(about.body[0])}</p>
      <p class="about-body" data-reveal>${esc(about.body[1])}</p>
      <blockquote class="quote" data-reveal><p>“${esc(about.philosophy)}”</p></blockquote>
      <ol class="principles" role="list">${about.principles
        .map((p, i) => `<li data-reveal><span class="mono">0${i + 1}</span><h3>${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`)
        .join('')}</ol>
      <p class="collab" data-reveal><span class="mono">How I collaborate</span>${esc(about.collaboration)}</p>
    </div>
  </div>
</section>`;
}

/* ── Toolkit ──────────────────────────────────────────────────────────────── */
function toolkit(capabilities, tools) {
  const total = capabilities.reduce((n, c) => n + c.items.length, 0) + tools.length;
  const groups = capabilities
    .map((c) => `<div class="tk-row" data-reveal><p class="mono tk-label">${esc(c.title)}</p>
      <ul class="chips" role="list">${c.items.map((i) => `<li>${pixelGlyph('cross', { cell: 1 })}${esc(i)}</li>`).join('')}</ul></div>`)
    .join('');
  const toolRow = `<div class="tk-row" data-reveal><p class="mono tk-label">Tools</p>
    <ul class="chips" role="list">${tools.map((t) => `<li><span>${esc(t.name)}</span><span class="chip-level mono" title="${esc(t.label)}">${'■'.repeat(t.level)}${'□'.repeat(3 - t.level)}<span class="sr-only"> — ${esc(t.label)}</span></span></li>`).join('')}</ul></div>`;
  return `<section class="toolkit section--flush" id="toolkit" aria-labelledby="toolkit-title" data-section="toolkit">
  ${pixelBand({ seq: ['cursor', 'cross', 'pen', 'cross', 'node', 'cross'] })}
  <div class="field">
    <div class="wrap">${frameHead({ n: '05', name: 'Toolkit', title: 'Toolkit', count: `${total} skills · ${capabilities.length + 1} disciplines`, id: 'toolkit-title' })}</div>
  </div>
  <div class="wrap tk-body">${groups}${toolRow}</div>
</section>`;
}

/* ── Work: pinned horizontal carousel (native swipe on touch / no motion) ── */
function workCard(p) {
  return `<article class="card" aria-labelledby="w-${esc(p.slug)}" data-card>
  <a class="card-visual" href="/work/${esc(p.slug)}/" tabindex="-1" aria-hidden="true">
    ${pixelBand({ seq: ['f', 'cross', 'anchor', 'cross'], cell: 3, className: 'band--card' })}
    <span class="work-canvas" style="--accent:${esc(p.theme?.accent || '#c6ff3d')}">
      <span class="work-num">${esc(p.number)}</span>
      <span class="work-obj">${objectImage(p.object, { sizes: '(min-width: 960px) 34vw, 80vw', className: 'work-img' })}</span>
      <span class="work-sel"><i></i><i></i><i></i><i></i></span>
    </span>
    <span class="work-view mono">Explore project ${arrow}</span>
  </a>
  <div class="card-text">
    <p class="mono work-meta">${esc(p.number)} · ${esc(p.category)}</p>
    <h3 class="work-title" id="w-${esc(p.slug)}"><a href="/work/${esc(p.slug)}/">${esc(p.name)}</a></h3>
    <p class="work-summary">${esc(p.summary)}</p>
    ${p.teamNote ? `<p class="work-team">${esc(p.teamNote)}</p>` : ''}
    <p class="mono work-role">My role — ${esc(p.role)}</p>
    ${liveLinks(p.links)}
    <a class="link-arrow mono" href="/work/${esc(p.slug)}/">Read the case ${arrowRight}<span class="sr-only">: ${esc(p.name)}</span></a>
  </div>
</article>`;
}

function work(projects, extra) {
  const total = String(projects.length).padStart(2, '0');
  return `<section class="work" id="work" aria-labelledby="work-title" data-section="work">
  <div class="wrap work-head">
    ${frameHead({ n: '03', name: 'Work', title: 'Work', count: `${total} projects`, id: 'work-title' })}
  </div>
  <div class="carousel" data-carousel>
    <div class="carousel-bar wrap">
      <p class="mono carousel-count" aria-live="polite"><b data-carousel-index>01</b> / ${total}</p>
      <p class="mono carousel-hint">Scroll to discover →</p>
      <div class="carousel-progress" aria-hidden="true"><span data-carousel-progress></span></div>
    </div>
    <div class="carousel-viewport" data-carousel-viewport tabindex="0" aria-label="Selected projects — scroll or swipe horizontally">
      <div class="carousel-track" data-carousel-track>${projects.map(workCard).join('')}<div class="card card--end" aria-hidden="true"><p class="mono">End of selected work</p><p class="card-end-title">More in the archive ↓</p></div></div>
    </div>
  </div>
  <div class="wrap">
    <div class="archive" data-reveal>
      <p class="mono">Also in the archive</p>
      <p>${esc(extra.body)}</p>
      <ul class="tags" role="list">${extra.productAreas.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
    </div>
  </div>
</section>`;
}

/* ── Services + FAQ ───────────────────────────────────────────────────────── */
function servicesSection(services, faq, site) {
  return `<section class="services section" id="services" aria-labelledby="services-title" data-section="services">
  <div class="wrap">
    ${frameHead({ n: '06', name: 'Services', title: 'How I work', id: 'services-title' })}
    <ol class="svc-list" role="list">${services
      .map((s) => `<li class="svc" data-reveal>
        <p class="mono svc-n">${esc(s.n)} /</p>
        <h3 class="svc-title">${esc(s.title)}</h3>
        <p class="svc-text">${esc(s.text)}</p>
        <ul class="tags" role="list">${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </li>`)
      .join('')}</ol>
    <div class="faq" id="faq">
      <div class="faq-side" data-reveal>
        <p class="caption mono">Frame 07 · “FAQ”</p>
        <h3 class="faq-title">Before we begin — <em>a few answers.</em></h3>
        <a class="link-arrow mono" href="${site.contact.email ? `mailto:${esc(site.contact.email)}` : '#contact'}">Something else? Ask me ${arrow}</a>
      </div>
      <div class="faq-list" data-reveal>${faq
        .map((f, i) => `<details class="faq-item"${i === 0 ? ' open' : ''}><summary><span class="mono">${String(i + 1).padStart(2, '0')}</span><span class="faq-q">${esc(f.q)}</span><span class="xp-toggle" aria-hidden="true"></span></summary><p class="faq-a">${esc(f.a)}</p></details>`)
        .join('')}</div>
    </div>
  </div>
</section>`;
}

/* ── Experience table ─────────────────────────────────────────────────────── */
function experienceSection(experience) {
  const rows = experience
    .map((e, i) => {
      const current = /present/i.test(e.period);
      const status = current ? 'On duty' : 'Logged';
      const role = e.roles?.length ? e.roles[0].title : e.role;
      const detail = [
        e.summary ? `<p class="xp-summary">${esc(e.summary)}</p>` : '',
        e.roles?.length
          ? `<ol class="xp-roles" role="list">${e.roles.map((r, j) => `<li${j === 0 ? ' class="is-current"' : ''}><span class="mono">${esc(r.period)}</span><span>${esc(r.title)}</span></li>`).join('')}</ol>`
          : '',
        e.highlights?.length ? `<div><p class="mono xp-label">Selected work</p><ul class="xp-list" role="list">${e.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></div>` : '',
        e.focus?.length ? `<div><p class="mono xp-label">Focus</p><ul class="xp-list" role="list">${e.focus.map((h) => `<li>${esc(h)}</li>`).join('')}</ul></div>` : '',
      ].join('');
      const hasDetail = detail.trim().length > 0;
      const summaryRow = `<span class="mono xp-no">${String(i + 1).padStart(2, '0')}</span>
          <span class="xp-company">${esc(e.company)}</span>
          <span class="mono xp-role">${esc(role)}</span>
          <span class="mono xp-period">${esc(e.period)}</span>
          <span class="mono xp-status${current ? ' is-on' : ''}"><i aria-hidden="true"></i>${status}</span>`;
      return hasDetail
        ? `<li data-reveal><details class="xp"${i === 0 ? ' open' : ''}><summary class="xp-row">${summaryRow}<span class="xp-toggle" aria-hidden="true"></span></summary><div class="xp-detail">${detail}</div></details></li>`
        : `<li data-reveal><div class="xp"><div class="xp-row">${summaryRow}<span class="xp-toggle xp-toggle--none" aria-hidden="true"></span></div></div></li>`;
    })
    .join('');
  return `<section class="experience section--flush" id="experience" aria-labelledby="xp-title" data-section="experience">
  ${pixelBand({ seq: ['node', 'cross', 'f', 'cross', 'node', 'pen'] })}
  <div class="wrap section-pad">
    ${frameHead({ n: '08', name: 'Experience', title: 'Experience', count: `${String(experience.length).padStart(2, '0')} entries`, id: 'xp-title' })}
    <div class="xp-head mono" aria-hidden="true"><span>No.</span><span>Company</span><span>Role</span><span>Period</span><span>Status</span><span></span></div>
    <ol class="xp-table" role="list">${rows}</ol>
  </div>
</section>`;
}

/* ── Credentials (education, publication, certifications) ─────────────────── */
function credentials(education, publications, certifications) {
  const items = [
    ...education.map((e) => ({ type: 'education', label: 'Degree', date: e.period, title: e.degree, by: e.school })),
    ...publications.map((t) => ({ type: 'publication', label: 'Publication', date: '—', title: t, by: '' })),
    ...certifications.map((t) => {
      const [title, by = ''] = t.split(' — ');
      return { type: 'certification', label: 'Certificate', date: '—', title, by };
    }),
  ];
  const count = (t) => String(items.filter((i) => i.type === t).length).padStart(2, '0');
  const tabs = [
    ['all', 'All', String(items.length).padStart(2, '0')],
    ['education', 'Education', count('education')],
    ['publication', 'Publication', count('publication')],
    ['certification', 'Certifications', count('certification')],
  ];
  return `<section class="creds section" id="credentials" aria-labelledby="creds-title">
  <div class="wrap">
    ${frameHead({ n: '09', name: 'Credentials', title: 'Credentials', id: 'creds-title' })}
    <div class="tabs" role="toolbar" aria-label="Filter credentials" data-filter>
      ${tabs.map(([k, l, n], i) => `<button type="button" class="tab mono" data-filter-key="${k}" aria-pressed="${i === 0}">${l} <span>${n}</span></button>`).join('')}
    </div>
    <ol class="cred-list" role="list" data-reveal>${items
      .map((it) => `<li class="cred" data-type="${it.type}"><span class="mono cred-date">${esc(it.date)}</span><span class="cred-title">${esc(it.title)}</span><span class="cred-by">${esc(it.by)}</span><span class="mono cred-type">${esc(it.label)}</span></li>`)
      .join('')}</ol>
  </div>
</section>`;
}

/* ── Playground (compact until there's work to show) ──────────────────────── */
function playgroundSection(items) {
  if (items.length) {
    return `<section class="section" id="playground" aria-labelledby="lab-title"><div class="wrap">
      ${frameHead({ n: '09b', name: 'Playground', title: 'Playground', count: `${items.length} experiments`, id: 'lab-title' })}
      <ul class="lab-grid" role="list">${items.map((it) => `<li data-reveal="image">${picture({ base: it.image, widths: it.widths, sizes: '(min-width: 960px) 33vw, 92vw', alt: `${it.title} — ${it.medium}`, ratio: it.ratio })}<p class="mono">${esc(it.title)} · ${esc(it.medium)}</p></li>`).join('')}</ul>
    </div></section>`;
  }
  return `<section class="lab-empty" id="playground" aria-label="Playground">
    <div class="wrap lab-empty-row" data-reveal>
      <p class="mono">Frame 09b · “Playground”</p>
      <p class="lab-empty-text">Motion, type and interface experiments are on the artboard. ${pixelGlyph('cursor', { cell: 2 })}</p>
      <p class="mono">Coming soon</p>
    </div>
  </section>`;
}

export function homePage({ site, projects, additionalWork, about, experience, education = [], publications = [], certifications = [], capabilities, tools, playground, story = [], services = [], faq = [] }) {
  return [
    hero(site, about),
    storySection(story),
    work(projects, additionalWork),
    aboutSection(site, about),
    toolkit(capabilities, tools),
    servicesSection(services, faq, site),
    experienceSection(experience),
    credentials(education, publications, certifications),
    playgroundSection(playground),
  ].join('\n');
}
