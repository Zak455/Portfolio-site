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
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.mrinq.smartaccess' },
    ],
    contribution: [
      'Product ideation',
      'Product identity, branding and visual direction',
      'UX architecture',
      'Interface design for the web portal and mobile application',
      'Product pages, experience and visual consistency',
    ],
    tags: ['Access Control', 'Time & Attendance', 'Visitor Management', 'Tenant Management', 'Locker Management', 'Elevator Access'],
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
          "OptiSpaces.ai is now the single platform for that suite: access control, visitor management, tenant management, video integration, locker access and elevator access run in one integrated product. The change spans both the mobile app (iOS and Android) and the web portal, so admins, operators, employees and residents get one consistent experience.",
        ],
      },
      problem: {
        body: [
          "Each product had grown up on its own: access control, attendance, visitors, tenants, video, lockers and elevators each came with its own screens and habits. For admins running a building, that meant switching between tools for one job. For employees and residents, it meant the experience changed depending on which product they touched.",
          'The opportunity was to make the suite feel like one platform: the same users, doors and credentials shared across every module, under one product name.',
        ],
      },
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
      final: {
        body: [
          'OptiSpaces.ai ships as a web portal for admins and operators and a mobile app on iOS and Android for everyone who uses the building. Both carry the same identity and patterns, so moving from the dashboard to the phone feels like one product.',
          'The suite covers seven connected modules: Access Control, Time & Attendance, Visitor Management, Tenant Management, Video Management, Elevator Access and Locker Access.',
        ],
        media: [{ placeholder: 'Final web portal: hero screen', wide: true }, { placeholder: 'Mobile application screens' }, { placeholder: 'Product page' }],
      },
      decisions: { body: tbd },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'optispaces-website',
    number: '02',
    name: 'OptiSpaces.ai Website',
    category: 'Website Design / Product Storytelling',
    year: null,
    summary:
      'Designing the new OptiSpaces.ai website, which presents the platform as an AI operating system for physical security: access control, video intelligence, visitors, tenants and attendance on one intelligence layer.',
    role: 'Website design: structure, UI & product storytelling',
    teamNote: 'In progress: the new site is on staging and not yet public.',
    contribution: [
      'Website structure and page flow',
      'UI design and interactive product moments',
      'Product storytelling for the AI and video platform',
      'Presenting seven software products on one page',
    ],
    tags: ['Website', 'AI Video Analytics', 'Access Control', 'Physical Security'],
    object: 'globe',
    theme: { accent: '#4f8cff', layout: 'split' },
    sections: {
      introduction: {
        body: [
          'The new OptiSpaces.ai website tells the story of the platform as an AI operating system for physical security. Wireless access control, video intelligence, visitor, tenant and attendance management share one intelligence layer, so every event tells the whole story.',
        ],
      },
      context: {
        body: [
          "OptiSpaces.ai grew from an access control suite into a platform that also understands video: Spintly EDGE AI turns existing IP cameras into smart cameras, with facial recognition, people counting, perimeter intrusion detection and licence plate recognition. The website needed to carry that shift without losing the access control story customers already knew.",
        ],
      },
      problem: {
        body: [
          'Physical security used to mean separate systems: access panels, video recorders, sensors and building software, each with its own screen, and control rooms full of feeds and alert fatigue. The site had to make "one platform, one pane of glass" feel concrete, not abstract.',
        ],
      },
      objectives: {
        list: [
          'Position OptiSpaces.ai as AI-based physical security, with access and video on one layer',
          'Present seven connected software products clearly on one page',
          'Make AI use cases tangible for admins, security officers and executives',
          'Explain deployment, from first site survey to full commissioning',
          'Build trust with certifications and a clear path to sales',
        ],
      },
      role: { useContribution: true },
      team: { body: tbd },
      research: { body: tbd },
      competitors: { body: tbd },
      flows: {
        body: [
          'The page moves from the big idea to proof: one platform, then the seven-product software suite, then why the architecture is faster and cheaper to install, then integrations, AI capabilities, AI use cases, deployment, certifications and contact.',
          'The platform idea is told as three verbs (Live, Understand, Remember): cameras, access events and alerts in real time; AI that detects, correlates and summarises incidents; and a searchable incident log with timelines and evidence.',
        ],
        media: [{ placeholder: 'Page structure: from platform idea to contact' }],
      },
      explorations: { body: tbd },
      wireframes: { body: tbd },
      visual: { body: tbd, media: [{ placeholder: 'Hero: "Securing the built world with AI"', wide: true }] },
      final: {
        body: [
          'The AI use cases section lets visitors switch between Overcrowding, Zone violation, PPE compliance, Vehicle pass & parking and Person of interest. Each one shows the same chain (cameras, AI detection, response, intelligence) and who it helps: the admin who configures it, the officer who responds and the executive who reads the trends.',
          'A six-step deployment timeline (approval, site survey, proposal, alignment, costing, execution) answers the "how do we get this?" question before a visitor has to ask sales.',
        ],
        media: [{ placeholder: 'Software suite: seven products on one platform', wide: true }, { placeholder: 'AI use cases: interactive switcher' }, { placeholder: 'Deployment timeline' }],
      },
      decisions: {
        list: [
          'Lead with one idea (access and video on one intelligence layer) before listing products',
          'Show every use case through the same detection → response → intelligence chain, so they read as one system',
          'Speak to three audiences (admin, officer, executive) inside each use case instead of one generic buyer',
          'Group AI capabilities by what they protect: identity, vehicles, movement and policy',
        ],
      },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'spintly-global-website',
    // Screenshot of the live page, captured Nov 2026 (tools: see README).
    shot: { base: '/assets/img/work/spintly-global-website', alt: 'Spintly global website hero section', caption: 'Live site: spintly.com global website, captured Nov 2026' },
    number: '03',
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
      context: {
        body: [
          'Spintly is a global technology platform for access control. It serves two very different audiences: teams who run buildings and want smarter, wireless security, and manufacturers who want to license the technology and build their own connected devices.',
          'The product range is wide: smart readers on a patented BLE mesh, the OptiSpaces.ai software suite, Scypher for credential management, and open APIs and SDKs for integrations.',
        ],
      },
      problem: {
        body: [
          'The site had to speak to both audiences without splitting into two websites, and explain hardware, software and platform clearly enough that a facility manager, an IT lead or an OEM could each find their path quickly.',
        ],
      },
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
      flows: {
        body: [
          'The homepage opens with a choice: Physical Security for teams who run buildings, or Technology Services for companies who build devices. Physical Security breaks down into Hardware, Software and Platform.',
          'From there the page builds the case in order: wireless readers, the BLE mesh, every credential type, the OptiSpaces.ai solutions, integrations, the partner programme, certifications, industries, customer stories and a demo form.',
        ],
        media: [{ placeholder: 'Sitemap / information architecture' }],
      },
      explorations: { body: tbd },
      wireframes: { body: tbd, media: [{ placeholder: 'Key page wireframes' }] },
      visual: { body: tbd },
      final: {
        body: [
          'The product is shown working rather than described. A live feed of access events (meeting room, floor, loading dock, each with the credential used) sits beside the BLE mesh story. A phone mock-up walks through a mobile unlock, from "Tap to unlock" to "Access granted".',
          'Credentials (mobile, Apple Wallet, QR, card, PIN, face and fingerprint) each get their own tab, and the seven OptiSpaces.ai modules sit in one tabbed section, so a lot of product fits on one page without becoming a wall of text.',
          'Industry cards cover eight sectors, from co-working and offices to healthcare, hospitality and construction, so each visitor can find their kind of space.',
        ],
        media: [{ placeholder: 'Homepage: final design', wide: true }, { placeholder: 'Credential tabs and mobile unlock mock-up' }, { placeholder: 'OptiSpaces.ai solutions section' }],
      },
      decisions: {
        list: [
          'Split the audience at the top (Physical Security vs Technology Services) instead of building two sites',
          'Show live product moments (access events, mobile unlock) rather than static feature lists',
          'Use tabs for credentials, solutions and integrations to keep a broad product range scannable',
          'Put certifications (SOC 2 Type II, ISO/IEC 27001, ISO 9001, FCC) close to the decision point for enterprise buyers',
        ],
      },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'scypher',
    // Screenshot of the live page, captured Nov 2026 (tools: see README).
    shot: { base: '/assets/img/work/scypher', alt: 'Scypher credential management platform page', caption: 'Live page: spintly.com/scypher, captured Nov 2026' },
    number: '04',
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
    number: '05',
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
    number: '06',
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
    'Tenant Management',
    'Video Management',
    'Mobile Credentialing',
    'Digital Credentials',
  ],
};
