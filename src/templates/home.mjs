import { esc, arrow, arrowRight, picture, productShot } from './components.mjs';

// One section heading style everywhere: small eyebrow, clear title, optional intro.
function head({ eyebrow, title, intro, id, dark = false, center = false }) {
  return `<header class="sec-head${center ? ' sec-head--center' : ''}" data-fade>
    <p class="eyebrow${dark ? ' eyebrow--dark' : ''}">${esc(eyebrow)}</p>
    <h2 class="sec-title" id="${id}">${title}</h2>
    ${intro ? `<p class="sec-intro">${esc(intro)}</p>` : ''}
  </header>`;
}

const mail = (site) => (site.contact.email ? `mailto:${esc(site.contact.email)}` : '#contact');

/* ── Hero ─────────────────────────────────────────────────────────────────── */
function hero(site, about) {
  return `<section class="hero" aria-labelledby="hero-title">
  <div class="wrap hero-grid">
    <div class="hero-copy" data-fade>
      ${site.availability?.enabled ? `<p class="pill"><span class="pill-dot" aria-hidden="true"></span>${esc(site.availability.label)}</p>` : ''}
      <h1 class="hero-title" id="hero-title">Designing <span class="accent">beyond</span> the interface.</h1>
      <p class="hero-lead">I’m ${esc(site.name)}, ${esc(site.title)} at Spintly. I turn research into clear, high-impact product experiences for enterprise SaaS — across web and mobile.</p>
      <div class="btn-row">
        <a class="btn btn-primary" href="#work">View my work ${arrowRight}</a>
        <a class="btn btn-secondary" href="${mail(site)}">Get in touch</a>
      </div>
      <dl class="hero-facts">
        <div><dt>Designing since</dt><dd>${esc(site.designingSince)}</dd></div>
        <div><dt>Product design</dt><dd>${esc(site.experienceYears)}+ years</dd></div>
        <div><dt>Based in</dt><dd>${esc(site.place.short)}</dd></div>
      </dl>
    </div>
    <figure class="hero-photo" data-fade>
      ${picture({ base: '/assets/img/about/portrait-photo', widths: [560, 1000], sizes: '(min-width: 960px) 34vw, 88vw', alt: about.portrait.alt, ratio: [1000, 1501], className: 'hero-img', priority: true })}
      <figcaption class="hero-badge"><strong>${esc(site.name)}</strong><span>${esc(site.title)} · Spintly</span></figcaption>
    </figure>
  </div>
</section>`;
}

/* ── Product areas strip ──────────────────────────────────────────────────── */
function areas(extra) {
  return `<section class="areas" aria-label="Product areas I design for">
  <div class="wrap areas-inner" data-fade>
    <p class="areas-label">Product areas I design for</p>
    <ul class="areas-list" role="list">${extra.productAreas.map((a) => `<li>${esc(a)}</li>`).join('')}</ul>
  </div>
</section>`;
}

/* ── Work ─────────────────────────────────────────────────────────────────── */
function workCard(p, i) {
  return `<article class="work-card${i === 0 ? ' work-card--lead' : ''}" aria-labelledby="w-${esc(p.slug)}" data-fade>
  <a class="work-visual" href="/work/${esc(p.slug)}/" tabindex="-1" aria-hidden="true">${productShot(p, { sizes: i === 0 ? '(min-width: 960px) 62vw, 92vw' : '(min-width: 960px) 46vw, 92vw' })}</a>
  <div class="work-text">
    <p class="work-meta"><span>${esc(p.number)}</span>${esc(p.category)}</p>
    <h3 class="work-title" id="w-${esc(p.slug)}"><a href="/work/${esc(p.slug)}/">${esc(p.name)}</a></h3>
    <p class="work-summary">${esc(p.summary)}</p>
    <p class="work-role"><strong>My role:</strong> ${esc(p.role)}</p>
    ${p.teamNote ? `<p class="work-team">${esc(p.teamNote)}</p>` : ''}
    <a class="text-link" href="/work/${esc(p.slug)}/">Read the case study ${arrowRight}<span class="sr-only">: ${esc(p.name)}</span></a>
  </div>
</article>`;
}

function work(projects, extra) {
  return `<section class="section" id="work" aria-labelledby="work-title" data-section="work">
  <div class="wrap">
    ${head({ eyebrow: 'Selected work', title: 'Products I’ve helped shape.', intro: 'Enterprise access-control products at Spintly — from brand and website to web portals and mobile apps. Screenshots are of the live products.', id: 'work-title' })}
    <div class="work-grid">${projects.map(workCard).join('')}</div>
    <div class="archive" data-fade>
      <p class="eyebrow">Also in the archive</p>
      <p>${esc(extra.body)}</p>
    </div>
  </div>
</section>`;
}

/* ── About ────────────────────────────────────────────────────────────────── */
function aboutSection(about) {
  return `<section class="section section--soft" id="about" aria-labelledby="about-title" data-section="about">
  <div class="wrap">
    <div class="about-grid">
      ${head({ eyebrow: 'About', title: 'Research first. <span class="accent">Then pixels.</span>', id: 'about-title' })}
      <div class="about-copy" data-fade>
        <p class="about-lead">${esc(about.lead)}</p>
        ${about.body.map((b) => `<p>${esc(b)}</p>`).join('')}
        <blockquote class="quote">“${esc(about.philosophy)}”</blockquote>
      </div>
    </div>
    <ul class="card-grid card-grid--3" role="list">${about.principles
      .map((p, i) => `<li class="card" data-fade><span class="card-num">0${i + 1}</span><h3 class="card-title">${esc(p.title)}</h3><p>${esc(p.text)}</p></li>`)
      .join('')}</ul>
  </div>
</section>`;
}

/* ── Story ────────────────────────────────────────────────────────────────── */
function storySection(story) {
  return `<section class="section" id="story" aria-labelledby="story-title">
  <div class="wrap">
    ${head({ eyebrow: 'How I got here', title: 'From pixels to product.', id: 'story-title' })}
    <ol class="timeline" role="list">${story
      .map((c) => `<li class="timeline-item" data-fade>
        <p class="timeline-period">${esc(c.period)}</p>
        <p class="timeline-label">${esc(c.label)}</p>
        <h3 class="timeline-title">${esc(c.title)}</h3>
        <p>${esc(c.text)}</p>
      </li>`)
      .join('')}</ol>
  </div>
</section>`;
}

/* ── Services (dark) ──────────────────────────────────────────────────────── */
function servicesSection(services) {
  return `<section class="section section--dark" id="services" aria-labelledby="services-title" data-section="services">
  <div class="wrap">
    ${head({ eyebrow: 'Services', title: 'How I can help.', intro: 'Three ways I work with product teams and founders — together or on their own.', id: 'services-title', dark: true })}
    <ol class="card-grid card-grid--3" role="list">${services
      .map((s) => `<li class="card card--dark" data-fade>
        <span class="card-num">${esc(s.n)}</span>
        <h3 class="card-title">${esc(s.title)}</h3>
        <p>${esc(s.text)}</p>
        <ul class="chips chips--dark" role="list">${s.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul>
      </li>`)
      .join('')}</ol>
  </div>
</section>`;
}

/* ── FAQ ──────────────────────────────────────────────────────────────────── */
function faqSection(faq, site) {
  return `<section class="section" id="faq" aria-labelledby="faq-title">
  <div class="wrap faq-grid">
    <div>
      ${head({ eyebrow: 'FAQ', title: 'Before we begin.', id: 'faq-title' })}
      <a class="text-link" href="${mail(site)}" data-fade>Something else? Ask me ${arrow}</a>
    </div>
    <div class="accordion" data-fade>${faq
      .map((f, i) => `<details class="acc-item"${i === 0 ? ' open' : ''}><summary><span>${esc(f.q)}</span><span class="acc-icon" aria-hidden="true"></span></summary><p>${esc(f.a)}</p></details>`)
      .join('')}</div>
  </div>
</section>`;
}

/* ── Toolkit ──────────────────────────────────────────────────────────────── */
function toolkit(capabilities, tools) {
  return `<section class="section section--soft" id="toolkit" aria-labelledby="toolkit-title">
  <div class="wrap">
    ${head({ eyebrow: 'Toolkit', title: 'What I bring to a team.', id: 'toolkit-title' })}
    <div class="card-grid card-grid--2">
      ${capabilities.map((c) => `<div class="card" data-fade><h3 class="card-title">${esc(c.title)}</h3><ul class="chips" role="list">${c.items.map((i) => `<li>${esc(i)}</li>`).join('')}</ul></div>`).join('')}
      <div class="card" data-fade><h3 class="card-title">Tools</h3><ul class="chips" role="list">${tools.map((t) => `<li>${esc(t.name)}<span class="chip-note"> · ${esc(t.label)}</span></li>`).join('')}</ul></div>
    </div>
  </div>
</section>`;
}

/* ── Experience ───────────────────────────────────────────────────────────── */
function experienceSection(experience) {
  const rows = experience
    .map((e, i) => {
      const current = /present/i.test(e.period);
      const role = e.roles?.length ? e.roles[0].title : e.role;
      const detail = [
        e.summary ? `<p>${esc(e.summary)}</p>` : '',
        e.roles?.length ? `<ol class="xp-roles" role="list">${e.roles.map((r) => `<li><span>${esc(r.title)}</span><span class="xp-dim">${esc(r.period)}</span></li>`).join('')}</ol>` : '',
        e.highlights?.length ? `<p class="xp-label">Selected work</p><ul class="xp-list" role="list">${e.highlights.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : '',
        e.focus?.length ? `<p class="xp-label">Focus</p><ul class="xp-list" role="list">${e.focus.map((h) => `<li>${esc(h)}</li>`).join('')}</ul>` : '',
      ].join('');
      const top = `<span class="xp-company">${esc(e.company)}${current ? ' <span class="xp-now">Current</span>' : ''}</span>
        <span class="xp-role">${esc(role)}</span>
        <span class="xp-period">${esc(e.period)}</span>`;
      return detail.trim()
        ? `<li><details class="xp"${i === 0 ? ' open' : ''}><summary class="xp-row">${top}<span class="acc-icon" aria-hidden="true"></span></summary><div class="xp-detail">${detail}</div></details></li>`
        : `<li><div class="xp"><div class="xp-row">${top}<span></span></div></div></li>`;
    })
    .join('');
  return `<section class="section" id="experience" aria-labelledby="xp-title" data-section="experience">
  <div class="wrap">
    ${head({ eyebrow: 'Experience', title: 'Where I’ve worked.', id: 'xp-title' })}
    <ol class="xp-list-wrap" role="list" data-fade>${rows}</ol>
  </div>
</section>`;
}

/* ── Credentials ──────────────────────────────────────────────────────────── */
function credentials(education, publications, certifications) {
  const items = [
    ...education.map((e) => ({ type: 'education', label: 'Degree', title: e.degree, by: `${e.school} · ${e.period}` })),
    ...publications.map((t) => ({ type: 'publication', label: 'Publication', title: t, by: '' })),
    ...certifications.map((t) => {
      const [title, by = ''] = t.split(' — ');
      return { type: 'certification', label: 'Certificate', title, by };
    }),
  ];
  const n = (t) => items.filter((i) => i.type === t).length;
  const tabs = [['all', 'All', items.length], ['education', 'Education', n('education')], ['publication', 'Publication', n('publication')], ['certification', 'Certifications', n('certification')]];
  return `<section class="section section--soft" id="credentials" aria-labelledby="creds-title">
  <div class="wrap">
    ${head({ eyebrow: 'Credentials', title: 'Education & learning.', id: 'creds-title' })}
    <div class="tabs" role="toolbar" aria-label="Filter credentials" data-filter>
      ${tabs.map(([k, l, c], i) => `<button type="button" class="tab" data-filter-key="${k}" aria-pressed="${i === 0}">${l} <span>${c}</span></button>`).join('')}
    </div>
    <ul class="cred-list" role="list">${items
      .map((it) => `<li class="cred" data-type="${it.type}"><span class="cred-type">${esc(it.label)}</span><span class="cred-title">${esc(it.title)}</span><span class="cred-by">${esc(it.by)}</span></li>`)
      .join('')}</ul>
  </div>
</section>`;
}

export function homePage({ site, projects, additionalWork, about, experience, education = [], publications = [], certifications = [], capabilities, tools, story = [], services = [], faq = [] }) {
  return [
    hero(site, about),
    areas(additionalWork),
    work(projects, additionalWork),
    aboutSection(about),
    storySection(story),
    servicesSection(services),
    toolkit(capabilities, tools),
    experienceSection(experience),
    credentials(education, publications, certifications),
    faqSection(faq, site),
  ].join('\n');
}
