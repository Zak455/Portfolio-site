// ─────────────────────────────────────────────────────────────────────────────
//  ATS-SAFE CV page (/cv/ats/): strict single-column A4 resume designed for
//  Workday, Greenhouse, Lever & iCIMS parsers. Built from the same content/.
// ─────────────────────────────────────────────────────────────────────────────
import { esc } from './components.mjs';

const PDF = '/assets/cv/Fuzail-Khan-CV-ATS.pdf';

export function cvAtsPage({ site, experience, education, publications, certifications, capabilities, tools, coreExpertise }) {
  const c = site.contact;
  const host = site.url.replace(/^https?:\/\//, '');
  const [main, ...earlier] = experience;
  const ai = capabilities.find((g) => /AI/.test(g.title));

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${esc(site.name)} · ATS Resume · ${esc(site.title)}</title>
  <meta name="description" content="ATS-friendly single-column resume of ${esc(site.name)}, ${esc(site.title)}.">
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <style>
    @font-face { font-family: 'Inter'; src: url('/assets/fonts/inter-var.woff2') format('woff2'); font-weight: 100 900; font-display: swap; }
    * { box-sizing: border-box; }
    body { margin: 0; background: #e9edf3; color: #111827; font: 400 10.2px/1.44 Inter, Arial, Helvetica, sans-serif; -webkit-font-smoothing: antialiased; }
    a { color: #1d4ed8; text-decoration: none; }
    .bar { position: sticky; top: 0; z-index: 2; display: flex; justify-content: center; flex-wrap: wrap; gap: 10px; padding: 14px 16px; background: rgba(233,237,243,.92); backdrop-filter: blur(10px); }
    .bar a, .bar button { font: 600 14px Inter, sans-serif; padding: 10px 18px; border-radius: 999px; border: 1px solid #cfd5df; background: #fff; color: #111827; cursor: pointer; }
    .bar .primary { background: #111827; border-color: #111827; color: #fff; }
    .page { width: 210mm; min-height: 297mm; margin: 8px auto 40px; padding: 12mm 14mm; background: #fff; box-shadow: 0 24px 60px rgba(16,24,40,.15); }
    header { border-bottom: 1.5px solid #111827; padding-bottom: 8px; margin-bottom: 10px; }
    h1 { margin: 0; font-size: 21px; font-weight: 800; letter-spacing: -.02em; color: #0b0d12; }
    .subtitle { margin: 2px 0 5px; font-size: 11px; font-weight: 600; color: #1f2937; }
    .contact { margin: 0; font-size: 9.8px; color: #374151; line-height: 1.5; }
    section { margin-bottom: 10px; }
    section:last-child { margin-bottom: 0; }
    h2 { margin: 0 0 5px; font-size: 10px; font-weight: 700; letter-spacing: .09em; text-transform: uppercase; color: #0b0d12; border-bottom: 1px solid #d1d5db; padding-bottom: 2.5px; }
    p { margin: 0 0 4px; color: #1f2937; }
    .row { display: flex; justify-content: space-between; align-items: baseline; gap: 12px; }
    h3 { margin: 0; font-size: 10.8px; font-weight: 700; color: #0b0d12; }
    .meta { font-size: 9.5px; color: #4b5563; white-space: nowrap; }
    .progression { margin: 2px 0 5px; font-size: 9.6px; color: #374151; }
    ul { margin: 3px 0 0; padding-left: 16px; }
    li { margin-bottom: 3px; color: #1f2937; }
    .item { margin-bottom: 6px; }
    .item:last-child { margin-bottom: 0; }
    .skills-list { margin: 0; padding: 0; list-style: none; }
    .skills-list li { margin-bottom: 2.5px; }
    .skills-list strong { color: #0b0d12; }
    @page { size: A4; margin: 0; }
    @media print {
      body { background: none; }
      .bar { display: none; }
      .page { margin: 0; box-shadow: none; min-height: 0; }
    }
  </style>
</head>
<body>
  <nav class="bar" aria-label="ATS CV actions">
    <a href="/">← Portfolio</a>
    <a href="/cv/">Visual CV</a>
    <a class="primary" href="${PDF}" download>Download ATS PDF</a>
    <button type="button" onclick="window.print()">Print</button>
  </nav>

  <main class="page">
    <header>
      <h1>${esc(site.name)}</h1>
      <p class="subtitle">Senior Product Designer &amp; UI/UX Designer · Design Systems, Motion &amp; Interactive Code Prototyping</p>
      <p class="contact">
        Goa, India (Remote Preferred · Open to Relocation Across India · Notice Period: 1 Month)<br>
        ${c.email ? `<a href="mailto:${esc(c.email)}">${esc(c.email)}</a>` : ''} · ${esc(c.phone)} · Portfolio: <a href="${esc(site.url)}">${esc(host)}</a> · LinkedIn: <a href="${esc(c.linkedin)}">linkedin.com/in/fuzail-360</a> · GitHub: <a href="${esc(c.github)}">github.com/Zak455</a>
      </p>
    </header>

    <section>
      <h2>Summary</h2>
      <p>Senior Product &amp; UI/UX Designer with 3+ years designing enterprise B2B SaaS, mobile applications (100K+ downloads), and hardware-connected digital experiences, backed by 6+ years in visual design and an Electronics &amp; Communication Engineering degree. Owns end-to-end product design from UX research, competitor benchmarking, and information architecture to scalable design systems, motion design, and interactive browser prototypes in HTML, CSS, JavaScript, React, and Three.js.</p>
    </section>

    <section>
      <h2>Experience</h2>
      <div class="item">
        <div class="row">
          <h3>Spintly India Private Limited — Senior UI/UX Designer</h3>
          <span class="meta">Mar 2023 – Present · Goa, India</span>
        </div>
        <p class="progression"><strong>Progression (4 roles in 3.5 years):</strong> Web Designer (Mar 2023 – Aug 2023) → UI / Graphic Designer (Aug 2023 – Aug 2025) → Senior User Interface Designer (Aug 2025 – Jan 2026) → Senior UI/UX Designer (Jan 2026 – Present)</p>
        <ul>
          <li><strong>OptiSpaces.ai Platform &amp; Company-Wide Design System (2026):</strong> Audited legacy “SaaS solutions” workflows and built a company-wide design system (brand clearspace, typography, button sizing, spacing, padding) unifying 7 enterprise modules (Access, Attendance, Visitors, Tenants, Video, Lockers, Elevators) across web portal, iOS, and Android.</li>
          <li><strong>Spintly V3 Mobile App &amp; Mobile Design System (2025 · 100K+ Play Store Downloads):</strong> Co-designed the iOS/Android redesign and built a dedicated V3 mobile component system; iterated components directly with QA and engineering, cutting months from the release timeline while shipping streamlined 3-tab navigation, GPS attendance, and inline visitor approvals.</li>
          <li><strong>Apple Wallet Employee Badge Integration (2024):</strong> Collaborated closely with development and R&amp;D teams to shape the digital credential provisioning flow and trust messaging (Express Mode, 5-hour Power Reserve, Find My suspension), launched in India on iPhone and Apple Watch.</li>
          <li><strong>Spintly Global Website (Live at spintly.com, 2026):</strong> Led competitor benchmarking (Verkada, Brivo, Kisi, HID, Avigilon, Swiftlane, Apple), dual-audience information architecture, reusable UI components, and weekly developer/QA handoff cycles through live launch.</li>
          <li><strong>Scypher Credential Management Rebrand (2026):</strong> Rebranded and redesigned Spintly’s standalone enterprise credential platform, aligning UI/UX, product differentiation, and animated 6-step architecture storytelling for enterprise buyers and system integrators.</li>
          <li><strong>Cross-Functional Velocity, Motion &amp; AI Prototyping:</strong> Navigated legacy flows, tech-stack limits, and tight timelines through weekly cross-team iterations and AI-assisted rapid prototyping alongside micro-interactions and onboarding animations.</li>
        </ul>
      </div>

      ${earlier.map((e) => `<div class="item">
        <div class="row">
          <h3>${esc(e.company)} — ${esc(e.role)}</h3>
          <span class="meta">${esc(e.period)}</span>
        </div>
        ${e.summary ? `<p>${esc(e.summary)}</p>` : ''}
      </div>`).join('\n      ')}
    </section>

    <section>
      <h2>Design Engineering &amp; Interactive Prototypes (Personal Builds)</h2>
      <ul>
        <li><strong>Custom Zero-Dependency Portfolio &amp; Static Site Generator (${esc(host)}):</strong> Designed and engineered a fast, accessible portfolio with custom CSS view transitions, scroll-driven interactions, reduced-motion support, and automated asset/PDF tooling in Node.js.</li>
        <li><strong>Playable Browser Prototypes (Hollowmere, Hearthwild, Aetherbound — 2026):</strong> Designed and coded three interactive browser experiences using React, Three.js, HTML5 Canvas, Web Audio, and AI-assisted workflows to test spatial 3D UI, HUD systems, gesture micro-interactions, and responsive touch/desktop layouts.</li>
      </ul>
    </section>

    <section>
      <h2>Skills &amp; Tools</h2>
      <ul class="skills-list">
        <li><strong>Product &amp; UX Design:</strong> ${esc(coreExpertise.join(', '))}, Information Architecture, User Flows, Heuristic Evaluation, Accessibility (WCAG).</li>
        <li><strong>Design &amp; Prototyping Tools:</strong> ${esc(tools.map((t) => t.name).join(', '))}, Interactive Prototyping, Micro-interactions, Motion Specs, Developer Handoff.</li>
        <li><strong>AI-Assisted Design Workflow:</strong> ${esc((ai?.items || []).join(', '))}.</li>
      </ul>
    </section>

    <section>
      <h2>Education, Publication &amp; Certifications</h2>
      ${education.map((e) => `<div class="item">
        <div class="row">
          <h3>${esc(e.degree)} — ${esc(e.school)}</h3>
          <span class="meta">${esc(e.period)}</span>
        </div>
      </div>`).join('')}
      ${publications.length ? `<p><strong>Publication:</strong> ${esc(publications[0])}</p>` : ''}
      ${certifications.length ? `<p><strong>Certifications:</strong> ${esc(certifications.join(' · '))}</p>` : ''}
    </section>
  </main>
</body>
</html>
`;
}
