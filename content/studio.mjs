// ─────────────────────────────────────────────────────────────────────────────
//  STORY, SERVICES & FAQ
//  Original copy, written only from facts in the CV and LinkedIn profile.
//  Edit freely — keep claims to things you can back up in an interview.
// ─────────────────────────────────────────────────────────────────────────────

// Three-part story scroll. Each chapter pins on screen while you scroll.
export const story = [
  {
    label: 'The maker',
    period: '2020 – 2023',
    // Drive the animated year counter in the journey section (end: null = now).
    years: [2020, 2023],
    title: 'Pixels first.',
    glyph: 'pen',
    highlights: ['Freelance on Fiverr', 'Head of media, Team Phoenix', 'Posters, brand & video'],
    text:
      'I started in 2020 as a freelance graphic designer on Fiverr and as head of media production for Team Phoenix: posters, brand visuals and video. Real clients, real deadlines, and a lot of learning what makes people stop and look.',
  },
  {
    label: 'The researcher',
    period: '2023 – 2025',
    years: [2023, 2025],
    title: 'Questions before pixels.',
    glyph: 'node',
    highlights: ['Web Designer → UI Designer', 'Competitor analysis', 'User flows & heuristics'],
    text:
      'At Spintly I grew from web designer to UI designer on complex access-control products. I learned to start with competitor analysis, user flows and heuristics, so the interface answers a real question instead of decorating one.',
  },
  {
    label: 'The product designer',
    period: '2025 – now',
    years: [2025, null],
    title: 'Research into high-impact interfaces.',
    glyph: 'cursor',
    highlights: ['Senior UI/UX Designer', 'OptiSpaces.ai · Scypher · V3', 'Web, mobile & motion'],
    text:
      'Today, as Senior UI/UX Designer, I connect research, product UI, branding and motion across web and mobile, and stay close to development and R&D so the work ships the way it was designed.',
  },
];

// "How I work" — three services for founders and teams.
export const services = [
  {
    n: '01',
    title: 'Understand it.',
    text: 'UX research, competitor analysis, heuristic reviews, user flows and information architecture. A clear picture before anything gets designed.',
    items: ['UX research', 'Competitor analysis', 'User flows & IA'],
  },
  {
    n: '02',
    title: 'Shape it.',
    text: 'Product UI for web and mobile, scalable design systems and brand identity. One visual language from the logo to the last component.',
    items: ['Product & web UI', 'Design systems', 'Brand identity'],
  },
  {
    n: '03',
    title: 'Move & prototype it.',
    text: 'Micro-interactions, onboarding animations and working browser prototypes in HTML, CSS, JS, React and Three.js, handed over with engineering precision.',
    items: ['Motion & micro-interactions', 'Code & AI prototypes', 'Developer handoff'],
  },
];

export const faq = [
  {
    q: 'What roles are you looking for?',
    a: 'Full-time Product Designer (IC3/Senior) and Design Engineer / Prototyping Designer roles on ambitious SaaS, mobile, AI or hardware-connected product teams.',
  },
  {
    q: 'Where are you based, and are you open to remote or relocation?',
    a: 'Based in Goa, India (UTC+5:30). Remote roles from Goa are preferred, and I’m open to relocating anywhere in India for the right product team.',
  },
  {
    q: 'What is your notice period?',
    a: '1 month (30 days). I can coordinate a smooth handover and start quickly.',
  },
  {
    q: 'Do you build your own prototypes in code?',
    a: 'Yes. Beyond Figma and After Effects, I build interactive web experiences and functional prototypes in HTML, CSS, JavaScript, React and Three.js—including this portfolio and the three playable browser prototypes on it.',
  },
  {
    q: 'How do you work with product managers and engineers?',
    a: 'Side by side from discovery to launch. With an engineering degree and 3+ years working directly with development and R&D teams, I share early, respect technical constraints and stay involved through implementation.',
  },
];
