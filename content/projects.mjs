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
    number: '01',
    name: 'OptiSpaces.ai',
    category: 'SaaS Product Design / Rebranding',
    year: null, // e.g. '2024'
    summary:
      "Ideating, designing and rebranding Spintly's software suite into OptiSpaces.ai — one product identity across web, mobile and product pages.",
    role: 'Product identity, visual direction & SaaS product design',
    contribution: [
      'Product identity and visual direction',
      'SaaS product design',
      'Mobile application design',
      'Web portal and product pages',
      'Product experience and visual consistency',
    ],
    tags: ['Access Control', 'Time & Attendance', 'Locker Management', 'Visitor Management'],
    object: 'layers',
    theme: { accent: '#c6ff3d', layout: 'wide' },
    sections: {
      introduction: {
        body: [
          "OptiSpaces.ai is the identity I ideated, designed and brought to life for Spintly's software suite — bringing its product experiences under a single, coherent brand.",
        ],
      },
      context: {
        body: [
          "Spintly builds smart access and workspace products — access control, time & attendance, locker management, elevator access, visitor management and mobile credentials. The software suite needed an identity that could carry all of it.",
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
      explorations: { body: tbd, media: [{ placeholder: 'Early identity explorations — wordmark and visual direction sketches' }, { placeholder: 'Alternative directions considered' }] },
      wireframes: { body: tbd },
      visual: { body: tbd, media: [{ placeholder: 'Visual direction board — colour, type, components' }] },
      final: { body: tbd, media: [{ placeholder: 'Final web portal — hero screen', wide: true }, { placeholder: 'Mobile application screens' }, { placeholder: 'Product page' }] },
      decisions: { body: tbd },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'spintly-global-website',
    number: '02',
    name: 'Spintly Global Website',
    category: 'Website Design / UX Research',
    year: null,
    summary:
      "Transforming Spintly's website into a global-facing digital experience — grounded in competitor analysis and UX research.",
    role: 'UX research, information architecture & UI design',
    contribution: [
      'Competitor analysis',
      'UX research',
      'Website experience and information architecture',
      'UI design',
      'Visual presentation and product communication',
    ],
    tags: ['Website', 'UX Research', 'Information Architecture'],
    object: 'globe',
    theme: { accent: '#d9dee8', layout: 'split' },
    sections: {
      introduction: {
        body: ["A redesign of Spintly's website to present the company and its product range to a global audience."],
      },
      context: { body: tbd },
      problem: { body: tbd },
      objectives: {
        list: [
          'Understand how comparable companies present similar products',
          'Structure the site so a global audience can find the right product quickly',
          'Communicate the products clearly and visually',
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
      final: { body: tbd, media: [{ placeholder: 'Homepage — final design', wide: true }, { placeholder: 'Product page — final design' }] },
      decisions: { body: tbd },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'scypher',
    number: '03',
    name: 'Scypher',
    category: 'Branding / Product Design',
    year: null,
    summary:
      "Rebranding Spintly's credential management platform as Scypher — a distinct identity for enterprise software.",
    role: 'Product branding & visual identity',
    contribution: [
      'Product branding',
      'Visual identity',
      'Enterprise software positioning',
      'Interface and visual consistency',
    ],
    tags: ['Digital Credentials', 'Mobile Credentialing', 'Enterprise'],
    object: 'rings',
    theme: { accent: '#c6ff3d', layout: 'offset' },
    sections: {
      introduction: {
        body: ["Scypher is the rebrand of Spintly's credential management platform — giving it its own identity and positioning as enterprise software."],
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
      visual: { body: tbd, media: [{ placeholder: 'Brand system — logo, colour, typography', wide: true }] },
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
    summary: 'Rebranding the Spintly mobile application into its V3 experience — a refreshed visual language and interface.',
    role: 'Mobile UI/UX & product visual language',
    contribution: ['Mobile UI/UX', 'Product visual language', 'Interface design', 'Experience consistency'],
    tags: ['Mobile', 'Access Control', 'Mobile Credentialing'],
    object: 'device',
    theme: { accent: '#e8e8e8', layout: 'split-reverse' },
    sections: {
      introduction: { body: ['The V3 rebrand of the Spintly mobile application.'] },
      context: { body: tbd },
      problem: { body: tbd },
      objectives: {
        list: ['Refresh the product’s visual language', 'Redesign the interface for V3', 'Keep the experience consistent across the app'],
      },
      role: { useContribution: true },
      team: { body: tbd },
      research: { body: tbd },
      competitors: { body: tbd },
      flows: { body: tbd, media: [{ placeholder: 'Core app flows' }] },
      explorations: { body: tbd },
      wireframes: { body: tbd },
      visual: { body: tbd },
      final: { body: tbd, media: [{ placeholder: 'Before / after — previous app vs V3', wide: true }, { placeholder: 'V3 key screens' }] },
      decisions: { body: tbd },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'apple-wallet-integration',
    number: '05',
    name: 'Apple Wallet Integration',
    category: 'Product Experience / Collaboration',
    year: null,
    summary:
      'Collaborating with development and R&D teams to bring Apple Wallet integration to the product ecosystem.',
    role: 'Product experience & engineering collaboration',
    contribution: [
      'Product experience considerations',
      'Digital credential experience',
      'Engineering and R&D collaboration',
    ],
    tags: ['Digital Credentials', 'Mobile Credentialing'],
    object: 'cards',
    theme: { accent: '#c6ff3d', layout: 'wide' },
    // Team project: the integration itself was engineered by development & R&D.
    teamNote: 'A team effort — the integration was engineered by development and R&D; my part was the product and credential experience.',
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
      final: { body: tbd, media: [{ placeholder: 'Credential experience — final design', wide: true }] },
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
