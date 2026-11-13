// ─────────────────────────────────────────────────────────────────────────────
//  SELECTED WORK + CASE STUDIES
//
//  Each project renders a showcase row on the home page and a full case study
//  at /work/<slug>/.
//
//  Writing rules this file follows (keep them when you edit):
//    • No invented metrics, user numbers, awards or testimonials.
//    • "My contribution" is only what I did; team work is described as team work.
//
//  `links`: optional live links [{ label, href }] shown on the project and case study.
//
//  Case study sections:
//    • A section with `body: null` and no `media` is NOT shown on the site.
//      Fill in `body` (an array of paragraphs) and/or `list` to publish it.
//    • `media` entries are image frames. Until `src` is set, they render as a
//      clearly marked placeholder with the `placeholder` text as the brief.
//      To add a real image: put it in src/assets/img/work/<slug>/ and set
//      { src: '/assets/img/work/<slug>/file.webp', alt: '...', caption: '...' }
// ─────────────────────────────────────────────────────────────────────────────

const tbd = null; // marks a section waiting for your write-up

export const projects = [
  {
    slug: 'optispaces',
    // Screenshot of the live page, captured Nov 2026 (tools: see README).
    shot: { base: '/assets/img/work/optispaces', alt: 'OptiSpaces.ai dashboard sign-in page', caption: 'Live product: dashboard.optispaces.ai sign-in, captured Nov 2026' },
    number: '01',
    name: 'OptiSpaces.ai',
    category: 'SaaS Product Design / Rebranding',
    year: null, // e.g. '2024'
    summary:
      "Contributing to the ideation, branding, UX architecture and interface design of OptiSpaces.ai, which brings Spintly's software suite under one product identity, across web and mobile.",
    role: 'Ideation, branding, UX architecture & interface design',
    links: [
      { label: 'OptiSpaces.ai dashboard', href: 'https://dashboard.optispaces.ai/login' },
      { label: 'App Store', href: 'https://apps.apple.com/in/app/optispaces-ai-by-spintly/id1462730510' },
    ],
    contribution: [
      'Product ideation',
      'Product identity, branding and visual direction',
      'UX architecture',
      'Interface design for the web portal and mobile application',
      'Product pages, experience and visual consistency',
    ],
    tags: ['Access Control', 'Time & Attendance', 'Locker Management', 'Visitor Management'],
    object: 'layers',
    theme: { accent: '#4f8cff', layout: 'wide' },
    sections: {
      introduction: {
        body: [
          "OptiSpaces.ai brings Spintly's software suite under a single, coherent product brand. I contributed to its ideation, branding, UX architecture and interface design across mobile and web.",
        ],
      },
      context: {
        body: [
          "Spintly builds smart access and workspace products: access control, time & attendance, locker management, elevator access, visitor management and mobile credentials. The software suite needed an identity that could carry all of it.",
        ],
      },
      problem: { body: tbd },
      objectives: {
        list: [
          'Define a product identity and visual direction for the suite',
          'Design the SaaS product, mobile application and web portal',
          'Keep the experience and visual language consistent across every surface',
        ],
      },
      role: { useContribution: true },
      team: {
        body: [
          'Delivered within Spintly’s product organisation, working with development and R&D teams who engineered the platform.',
        ],
      },
      research: { body: tbd },
      competitors: { body: tbd },
      flows: { body: tbd, media: [{ placeholder: 'User flows / information architecture of the OptiSpaces.ai platform' }] },
      explorations: { body: tbd, media: [{ placeholder: 'Early identity explorations: wordmark and visual direction sketches' }, { placeholder: 'Alternative directions considered' }] },
      wireframes: { body: tbd },
      visual: { body: tbd, media: [{ placeholder: 'Visual direction board: colour, type, components' }] },
      final: { body: tbd, media: [{ placeholder: 'Final web portal: hero screen', wide: true }, { placeholder: 'Mobile application screens' }, { placeholder: 'Product page' }] },
      decisions: { body: tbd },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'spintly-global-website',
    // Screenshot of the live page, captured Nov 2026 (tools: see README).
    shot: { base: '/assets/img/work/spintly-global-website', alt: 'Spintly global website hero section', caption: 'Live site: spintly.com global website, captured Nov 2026' },
    number: '02',
    name: 'Spintly Global Website',
    category: 'Website Design / UX Research',
    year: null,
    summary:
      "Leading the redesign of Spintly's website into a modern, global digital experience, grounded in UX research, competitor analysis and scalable UI systems.",
    role: 'Led the redesign: UX research, information architecture & UI',
    links: [{ label: 'Visit the website', href: 'https://spintly.com/global-site-v2/' }],
    contribution: [
      'Competitor analysis',
      'UX research',
      'Website experience and information architecture',
      'UI design and scalable UI systems',
      'Visual presentation and product communication',
    ],
    tags: ['Website', 'UX Research', 'Information Architecture'],
    object: 'globe',
    theme: { accent: '#d9dee8', layout: 'split' },
    sections: {
      introduction: {
        body: ["I led the redesign of Spintly's website, turning it into a modern, global digital experience for the company and its product range, built on UX research, competitor analysis and scalable UI systems."],
      },
      context: { body: tbd },
      problem: { body: tbd },
      objectives: {
        list: [
          'Understand how comparable companies present similar products',
          'Structure the site so a global audience can find the right product quickly',
          'Communicate the products clearly and visually',
          'Build the UI on a scalable system that can grow with the site',
        ],
      },
      role: { useContribution: true },
      team: { body: tbd },
      research: { body: tbd, media: [{ placeholder: 'UX research synthesis' }] },
      competitors: { body: tbd, media: [{ placeholder: 'Competitor analysis matrix' }] },
      flows: { body: tbd, media: [{ placeholder: 'Sitemap / information architecture' }] },
      explorations: { body: tbd },
      wireframes: { body: tbd, media: [{ placeholder: 'Key page wireframes' }] },
      visual: { body: tbd },
      final: { body: tbd, media: [{ placeholder: 'Homepage: final design', wide: true }, { placeholder: 'Product page: final design' }] },
      decisions: { body: tbd },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'scypher',
    // Screenshot of the live page, captured Nov 2026 (tools: see README).
    shot: { base: '/assets/img/work/scypher', alt: 'Scypher credential management platform page', caption: 'Live page: spintly.com/scypher, captured Nov 2026' },
    number: '03',
    name: 'Scypher',
    category: 'Branding / Product Design',
    year: null,
    summary:
      "Rebranding and redesigning Spintly's credential management platform as Scypher, aligning UI/UX, product positioning and marketing visuals.",
    role: 'Rebrand & redesign: UI/UX, positioning & marketing visuals',
    links: [{ label: 'Scypher', href: 'https://spintly.com/scypher/' }],
    contribution: [
      'Product branding and visual identity',
      'UI/UX redesign',
      'Product positioning for enterprise software',
      'Marketing visuals',
    ],
    tags: ['Digital Credentials', 'Mobile Credentialing', 'Enterprise'],
    object: 'rings',
    theme: { accent: '#4f8cff', layout: 'offset' },
    sections: {
      introduction: {
        body: ["Scypher is the rebrand and redesign of Spintly's credential management platform. I aligned its UI/UX, product positioning and marketing visuals into one identity, to improve usability and how the platform is positioned."],
      },
      context: { body: tbd },
      problem: { body: tbd },
      objectives: {
        list: [
          'Create a distinct product brand for the credential management platform',
          'Position it clearly as enterprise software',
          'Carry the identity consistently into the interface',
        ],
      },
      role: { useContribution: true },
      team: { body: tbd },
      research: { body: tbd },
      competitors: { body: tbd },
      flows: { body: tbd },
      explorations: { body: tbd, media: [{ placeholder: 'Logo and identity explorations' }] },
      wireframes: { body: tbd },
      visual: { body: tbd, media: [{ placeholder: 'Brand system: logo, colour, typography', wide: true }] },
      final: { body: tbd, media: [{ placeholder: 'Scypher interface applying the new identity' }, { placeholder: 'Brand applications' }] },
      decisions: { body: tbd },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'spintly-v3',
    number: '04',
    name: 'Spintly V3',
    category: 'Mobile Product Design',
    year: null,
    summary: 'Collaborating on the redesign of the Spintly V3 mobile app, with cleaner layouts, improved navigation and usability, and modern interaction patterns.',
    role: 'Mobile UI/UX in a collaborative redesign',
    contribution: ['Mobile UI/UX', 'Navigation and usability improvements', 'Interaction patterns', 'Product visual language and consistency'],
    teamNote: 'A collaborative redesign: I worked on the mobile UI/UX alongside the wider product team.',
    tags: ['Mobile', 'Access Control', 'Mobile Credentialing'],
    object: 'device',
    theme: { accent: '#e8e8e8', layout: 'split-reverse' },
    sections: {
      introduction: { body: ['Spintly V3 is the redesign of the Spintly mobile application, which I collaborated on. It brings cleaner layouts, improved navigation and usability, and modern interaction patterns.'] },
      context: { body: tbd },
      problem: { body: tbd },
      objectives: {
        list: ['Improve navigation and usability', 'Introduce cleaner layouts and modern interaction patterns', 'Keep the experience consistent across the app'],
      },
      role: { useContribution: true },
      team: { body: ['The V3 redesign was a team effort; I collaborated on the mobile UI/UX within it.'] },
      research: { body: tbd },
      competitors: { body: tbd },
      flows: { body: tbd, media: [{ placeholder: 'Core app flows' }] },
      explorations: { body: tbd },
      wireframes: { body: tbd },
      visual: { body: tbd },
      final: { body: tbd, media: [{ placeholder: 'Before / after: previous app vs V3', wide: true }, { placeholder: 'V3 key screens' }] },
      decisions: { body: tbd },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'apple-wallet-integration',
    // Screenshot of the live page, captured Nov 2026 (tools: see README).
    shot: { base: '/assets/img/work/apple-wallet-integration', alt: 'Spintly Apple Wallet page hero', caption: 'Live page: spintly.com/apple-wallet-india, captured Nov 2026' },
    number: '05',
    name: 'Apple Wallet Integration',
    category: 'Product Experience / Collaboration',
    year: null,
    summary:
      'Working with development and R&D teams to support Apple Wallet integration within the Spintly ecosystem.',
    role: 'Product experience & engineering collaboration',
    links: [{ label: 'Apple Wallet at Spintly', href: 'https://spintly.com/apple-wallet-india/' }],
    contribution: [
      'Product experience considerations',
      'Digital credential experience',
      'Engineering and R&D collaboration',
    ],
    tags: ['Digital Credentials', 'Mobile Credentialing'],
    object: 'cards',
    theme: { accent: '#4f8cff', layout: 'wide' },
    // Team project: the integration itself was engineered by development & R&D.
    teamNote: 'A team effort. The integration was engineered by development and R&D; my part was the product and credential experience.',
    sections: {
      introduction: {
        body: ['Bringing Apple Wallet integration to the product ecosystem, so credentials can live where people already keep their cards.'],
      },
      context: { body: tbd },
      problem: { body: tbd },
      objectives: { body: tbd },
      role: { useContribution: true },
      team: {
        body: [
          'This was a cross-functional effort. Development and R&D teams engineered the integration; I contributed product experience considerations and the digital credential experience, working closely with them throughout.',
        ],
      },
      research: { body: tbd },
      competitors: { body: tbd },
      flows: { body: tbd, media: [{ placeholder: 'Credential provisioning flow' }] },
      explorations: { body: tbd },
      wireframes: { body: tbd },
      visual: { body: tbd },
      final: { body: tbd, media: [{ placeholder: 'Credential experience: final design', wide: true }] },
      decisions: { body: tbd },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
];

// Order and titles of the case study storytelling structure.
export const sectionOrder = [
  ['introduction', 'Introduction'],
  ['context', 'Context & background'],
  ['problem', 'Problem & opportunity'],
  ['objectives', 'Objectives'],
  ['role', 'My role'],
  ['team', 'Team collaboration'],
  ['research', 'Research & discovery'],
  ['competitors', 'Competitor analysis'],
  ['flows', 'User flows & information architecture'],
  ['explorations', 'Early explorations'],
  ['wireframes', 'Wireframes'],
  ['visual', 'Visual direction'],
  ['final', 'Final design'],
  ['decisions', 'Key design decisions'],
  ['implementation', 'Collaboration & implementation'],
  ['learnings', 'Results & learnings'],
];

// Additional work shown below the main showcase.
export const additionalWork = {
  title: 'Also in the archive',
  body: 'Marketing campaigns, event branding, promotional creatives, presentations and graphic design for Spintly and OptiSpaces.ai.',
  items: ['Marketing campaigns', 'Event branding', 'Promotional creatives', 'Presentations', 'Graphic design'],
  productAreas: [
    'Access Control',
    'Time & Attendance',
    'Locker Management',
    'Elevator Access',
    'Hotel Access Control',
    'Visitor Management',
    'Mobile Credentialing',
    'Digital Credentials',
  ],
};
