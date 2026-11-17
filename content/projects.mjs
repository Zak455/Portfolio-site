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
    shot: { base: '/assets/img/work/optispaces', alt: 'OptiSpaces.ai web dashboard with hourly access analytics, KPI cards and module navigation', caption: 'OptiSpaces.ai web portal: dashboard (demo organisation), Nov 2026' },
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
          'The web dashboard opens on what an admin checks first: access analytics by hour, split into entry and exit and filterable by direction, period and door, beside cards for users, access points, today’s visitors and shifts. Below it, recent access history shows who came in or out, when, through which door and with which credential. Every module (activity logs, access, attendance, users, visitors, tenants, integrations, devices and settings) sits in one left-hand navigation.',
          'On mobile, the app keeps everyday actions one tap away: unlock a door, check in remotely with GPS attendance, approve or reject visitors, and open My Console to manage the organisation by role (admin, manager or user).',
        ],
        media: [
          { src: '/assets/img/work/optispaces/dashboard-overview.webp', alt: 'OptiSpaces.ai dashboard: hourly access analytics chart with entry and exit, and KPI cards for users, access points, visitors and shifts', caption: 'Web portal dashboard: access analytics and organisation overview (demo data)', width: 1440, height: 810, wide: true },
          { src: '/assets/img/work/optispaces/dashboard-access-history.webp', alt: 'OptiSpaces.ai recent access history table with name, date, access type, event type, direction, location and photos', caption: 'Recent access history: credential type, direction and door for every event (demo data)', width: 1440, height: 810, wide: true },
          { src: '/assets/img/work/optispaces/mobile-app.webp', alt: 'Four OptiSpaces.ai mobile app screens: door unlock, GPS remote check-in, My Console and visitor management', caption: 'Mobile app: unlock, remote check-in, My Console and visitor management (Google Play listing)', width: 1440, height: 820, wide: true },
        ],
      },
      decisions: { body: tbd },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'optispaces-website',
    // Screenshot of the staging site, captured Nov 2026 in the browser pane (2x tiles, stitched).
    shot: { base: '/assets/img/work/optispaces-website', alt: 'OptiSpaces.ai website hero: Securing the built world with AI', caption: 'Staging site: new OptiSpaces.ai website, captured Nov 2026' },
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
      visual: {
        body: tbd,
        media: [{ src: '/assets/img/work/optispaces-website/hero.webp', alt: 'OptiSpaces.ai website hero with the headline "Securing the built world with AI", a phone unlocking a Spintly reader and certification badges', caption: 'Hero: the platform idea, proof points and a product moment in one view', width: 1440, height: 900, wide: true }],
      },
      final: {
        body: [
          'The AI use cases section lets visitors switch between Overcrowding, Zone violation, PPE compliance, Vehicle pass & parking and Person of interest. Each one shows the same chain (cameras, AI detection, response, intelligence) and who it helps: the admin who configures it, the officer who responds and the executive who reads the trends.',
          'A six-step deployment timeline (approval, site survey, proposal, alignment, costing, execution) answers the "how do we get this?" question before a visitor has to ask sales.',
        ],
        media: [
          { src: '/assets/img/work/optispaces-website/software-suite.webp', alt: 'Software suite section: seven OptiSpaces.ai products shown as photo cards', caption: 'Software suite: seven connected products on one platform', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/optispaces-website/ai-use-cases.webp', alt: 'AI use cases section with tabs for overcrowding, zone violation, PPE compliance, vehicle pass and person of interest', caption: 'AI use cases: each one shown as cameras → detection → response → intelligence, and who it helps', width: 1440, height: 900, wide: true },
        ],
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
    // Screenshot of the new site on staging, captured Nov 2026 in the browser pane (2x tiles, stitched).
    shot: { base: '/assets/img/work/spintly-global-website', alt: 'New Spintly website hero: A Global Technology Platform for Access Control', caption: 'New Spintly website (staging), captured Nov 2026' },
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
        media: [
          { src: '/assets/img/work/spintly-global-website/credentials.webp', alt: 'Credentials section listing mobile, Apple Wallet, QR, card, PIN, face and fingerprint access beside a mobile unlock mock-up', caption: 'One reader, every credential: tabs for each credential type beside a live unlock mock-up', width: 1440, height: 900, wide: true },
        ],
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
    // Screenshot of the new Spintly site on staging (Scypher · Mobile Credentials), captured Nov 2026 (2x tiles, stitched).
    shot: { base: '/assets/img/work/scypher', alt: 'Scypher Mobile Credentials page: Mobile Access Control, Every Phone a Secure Key', caption: 'Scypher · Mobile Credentials page on the new Spintly website (staging), captured Nov 2026' },
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
      context: {
        body: [
          'Spintly’s software sits in two products: OptiSpaces.ai, the cloud suite for running buildings, and Scypher, for credential management. Scypher adds mobile, QR and Apple Wallet credentials to any existing access control system, so organisations can modernise how people get in without replacing the controllers and door hardware they already have.',
          'It serves three kinds of customer: enterprises that want mobile credentials without building backend infrastructure, system integrators enabling mobile access on the systems they deploy, and property and facility platforms embedding secure access into tenant and resident apps.',
        ],
      },
      problem: {
        body: [
          'Scypher and OptiSpaces.ai both deal with doors and credentials, so they are easy to confuse. The difference matters to a buyer: OptiSpaces.ai runs the whole building on Spintly hardware, while Scypher leaves the existing access control system in charge and only modernises the credentials.',
          'The brand and its pages had to make that one idea land fast, “your access logic stays the same”, and reassure enterprise buyers that there is no rewiring and no downtime.',
        ],
      },
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
      flows: {
        body: [
          'Scypher’s credential flow has six steps: the customer sets permissions in their access control system; the system requests credentials from the Spintly Credential Server; the controller is updated with them; the mobile app, built on the Spintly Mobile SDK, fetches the user’s credential; the user taps in over NFC, Bluetooth or QR; and the controller makes the access decision as it always has.',
          'The animation turns that flow into something a buyer can follow in a few seconds, showing which parts Spintly builds and manages and which stay with the integrator.',
        ],
        media: [
          { video: '/assets/video/scypher-credential-management.mp4', poster: '/assets/video/scypher-credential-management.webp', alt: 'Animation of the Scypher credential flow, from the access control system and credential server to the phone, reader and controller', caption: 'Credential management animation: how a credential travels from the cloud to the door', width: 1440, height: 1102, wide: true },
        ],
      },
      explorations: { body: tbd, media: [{ placeholder: 'Logo and identity explorations' }] },
      wireframes: { body: tbd },
      visual: { body: tbd, media: [{ placeholder: 'Brand system: logo, colour, typography', wide: true }] },
      final: {
        body: [
          'On the new Spintly website, Scypher has its own place in the Products menu beside OptiSpaces.ai, with three credential products under it: Mobile Credentials, Apple Wallet Access, and QR & Visitor Passes.',
          'Each product page leads with the outcome (“Every phone a secure key”) and backs it with the proof enterprise buyers look for: BLE and NFC, credentials issued or revoked in seconds, and no rewiring. A side-by-side comparison then answers the question every visitor asks: OptiSpaces.ai or Scypher?',
        ],
        media: [
          { src: '/assets/img/work/scypher/products-menu.webp', alt: 'Spintly Products menu with OptiSpaces.ai modules and the Scypher credential products: Mobile Credentials, Apple Wallet Access, and QR and Visitor Passes', caption: 'Products menu: Scypher positioned beside OptiSpaces.ai, with its three credential products', width: 1440, height: 1041, wide: true },
          { src: '/assets/img/work/scypher/comparison.webp', alt: 'Comparison table of OptiSpaces.ai and Scypher: what it is, who makes access decisions, hardware, credentials, modules and best for', caption: '“OptiSpaces.ai or Scypher”: one table that settles which product a buyer needs', width: 1440, height: 720, wide: true },
        ],
      },
      decisions: {
        list: [
          'Lead with reassurance: “Your access logic stays the same”, with no rewiring and no downtime',
          'Show the credential flow as an animation instead of a dense architecture diagram',
          'Mark which parts Spintly builds and which stay with the integrator',
          'Group the credential products under one Scypher name in navigation, separate from OptiSpaces.ai',
          'Answer “which one do I need?” with a direct comparison, not more marketing copy',
        ],
      },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'spintly-v3',
    // Built from the Google Play listing screenshots (app version 3.0), Nov 2026.
    shot: { base: '/assets/img/work/spintly-v3', alt: 'Three screens of the redesigned mobile app: access points, door unlocked and My Console', caption: 'V3 app screens from the Google Play listing (OptiSpaces.ai app, v3.0), Nov 2026' },
    number: '05',
    name: 'Spintly V3',
    category: 'Mobile Product Design',
    year: null,
    summary: 'Collaborating on the redesign of the Spintly V3 mobile app, with cleaner layouts, improved navigation and usability, and modern interaction patterns.',
    role: 'Mobile UI/UX in a collaborative redesign',
    contribution: ['Mobile UI/UX', 'Navigation and usability improvements', 'Interaction patterns', 'Product visual language and consistency'],
    teamNote: 'A collaborative redesign: I worked on the mobile UI/UX alongside the wider product team.',
    links: [
      { label: 'Google Play', href: 'https://play.google.com/store/apps/details?id=com.mrinq.smartaccess' },
      { label: 'App Store', href: 'https://apps.apple.com/in/app/optispaces-ai-by-spintly/id1462730510' },
    ],
    tags: ['Mobile', 'Access Control', 'Mobile Credentialing', 'Visitor Management'],
    object: 'device',
    theme: { accent: '#e8e8e8', layout: 'split-reverse' },
    sections: {
      introduction: { body: ['Spintly V3 is the redesign of the Spintly mobile application, which I collaborated on. It brings cleaner layouts, improved navigation and usability, and modern interaction patterns.'] },
      context: {
        body: [
          'The Spintly app is how employees, residents and admins open doors and manage access every day. With version 3, the app moved to the OptiSpaces.ai brand as Spintly’s software platform was rebranded, and it shipped on Google Play and the App Store.',
        ],
      },
      problem: {
        body: [
          'People use this app many times a day, often while walking up to a door. The redesign had to modernise the look and add new capabilities without breaking those habits: in the launch message’s words, “a new look, but same feel”.',
        ],
      },
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
      final: {
        body: [
          'V3 introduces a minimal design built for faster door operations. Access points are listed by site, and a successful unlock takes over the top of the screen with a clear green confirmation.',
          'Around that core, V3 adds remote check-in with GPS attendance, visitor management with approve and reject actions right in the list, My Console for managing the organisation by role, and in-app help with FAQs and support requests.',
        ],
        media: [
          { src: '/assets/img/work/spintly-v3/rebrand.webp', alt: 'Launch screens: Spintly app rebranded to OptiSpaces.ai, and "A new look but same feel"', caption: 'Launch: the Spintly app becomes OptiSpaces.ai, a new look with the same feel', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/spintly-v3/key-screens.webp', alt: 'Four V3 screens: remote GPS check-in, My Console, visitor management and help and support', caption: 'V3 key screens: remote check-in, My Console, visitor management and quick help (Google Play listing)', width: 1440, height: 820, wide: true },
        ],
      },
      decisions: {
        list: [
          'A new bottom navigation (Doors, Consoles, Help) so the most frequent task, opening a door, is always the home screen',
          'Full-width success state on unlock, readable at a glance while walking',
          'Role tabs (Admin, Manager, User) in My Console, so one app serves every role without clutter',
          'Inline approve and reject on visitor cards, so hosts act without opening each request',
          'GPS check-in in a bottom sheet, confirming the captured location before check-in',
        ],
      },
      implementation: { body: tbd },
      learnings: { body: tbd },
    },
  },
  {
    slug: 'apple-wallet-integration',
    // Screenshot of the new Spintly site on staging (Scypher · Apple Wallet Access), captured Nov 2026 (2x tiles, stitched).
    shot: { base: '/assets/img/work/apple-wallet-integration', alt: 'Apple Wallet Access page: Your iPhone Is Now Your Employee Badge, with a Spintly badge on iPhone and Apple Watch', caption: 'Scypher · Apple Wallet Access page on the new Spintly website (staging), captured Nov 2026' },
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
      context: {
        body: [
          'Spintly already supported many credentials: the mobile app, cards, QR codes, PIN and face recognition. Apple Wallet adds an employee badge people already carry: hold an iPhone or Apple Watch near the reader to unlock, with no app to open and no physical badge.',
          'Spintly launched employee badges in Apple Wallet for access control in India, and the badge is part of Scypher, Spintly’s credential management platform, alongside mobile credentials and QR visitor passes.',
        ],
      },
      problem: {
        body: [
          'A badge in Apple Wallet is a new idea for most employees and admins, and it raises the same questions every time: is it secure, does it work when the phone is locked or out of charge, and what happens if the phone is lost?',
          'The experience, and the way it is explained, had to answer those questions up front, so a badge in Wallet feels as dependable as the plastic card it replaces.',
        ],
      },
      objectives: {
        list: [
          'Let employees unlock with iPhone or Apple Watch in one tap',
          'Keep the built-in privacy and security of Apple Wallet',
          'Let admins issue and revoke badges from the dashboard',
          'Work alongside the app, card and QR credentials already in use',
        ],
      },
      role: { useContribution: true },
      team: {
        body: [
          'This was a cross-functional effort. Development and R&D teams engineered the integration; I contributed product experience considerations and the digital credential experience, working closely with them throughout.',
        ],
      },
      research: { body: tbd },
      competitors: { body: tbd },
      flows: {
        body: [
          'Adding the badge takes four steps: sign in to the employer’s app with employee credentials, follow the in-app instructions, tap Add to Apple Wallet, and finish on screen. The badge added to iPhone is added to the paired Apple Watch too, and from then on either one is held near the reader to get in.',
        ],
        media: [
          { src: '/assets/img/work/apple-wallet-integration/add-badge-and-card.webp', alt: 'Activating your employee badge on iPhone: four steps beside an iPhone and Apple Watch showing the Spintly badge added, and the branded badge card below', caption: 'Adding the badge: four steps, then the same badge on iPhone and Apple Watch, branded for the organisation', width: 1440, height: 900, wide: true },
        ],
      },
      explorations: { body: tbd },
      wireframes: { body: tbd },
      visual: { body: tbd, media: [{ placeholder: 'Badge card design explorations' }] },
      final: {
        body: [
          'The experience is built around five promises: access instantly from the Spintly app, badge in by holding iPhone or Apple Watch near the reader, keep working for up to five hours with Power Reserve, suspend the badge from Find My if a device is lost, and keep data private with the security of iPhone.',
          'Express Mode means people don’t need to wake or unlock the device, and the same badge opens office doors, restricted areas, turnstiles and secure printing.',
        ],
        media: [
          { src: '/assets/img/work/apple-wallet-integration/features.webp', alt: 'Employee Badge in Apple Wallet: five feature cards for instant access, easy badging, Power Reserve, Find My and iPhone security', caption: 'Five promises, each shown on the device it happens on', width: 1440, height: 738, wide: true },
          { src: '/assets/img/work/apple-wallet-integration/homepage-section.webp', alt: 'Spintly homepage section: Your Employee Badge in Apple Wallet, with benefits and a phone and watch showing the badge', caption: 'On the Spintly homepage: Apple Wallet presented as one credential among many', width: 1440, height: 684, wide: true },
        ],
      },
      decisions: {
        list: [
          'Answer the trust questions first: Express Mode, Power Reserve, Find My and privacy',
          'Show the badge on both iPhone and Apple Watch, since one badge works on both',
          'Make the badge card itself carry the organisation’s brand',
          'Present Apple Wallet alongside the app, card and QR credentials, not as a replacement for them',
        ],
      },
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
