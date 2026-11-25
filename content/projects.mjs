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
    // "At a glance" strip on the case study: real facts only (content, store listings).
    glance: [{ n: '7', l: 'product modules on one platform' }, { n: '3', l: 'surfaces: web portal, iOS & Android' }, { n: '100K+', l: 'Google Play downloads' }],
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
    // "At a glance" strip on the case study: real facts only (content, store listings).
    glance: [{ n: '7', l: 'products told on a single page' }, { n: '5', l: 'AI use cases in one interaction' }, { n: '6', l: 'step deployment journey' }],
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
    // "At a glance" strip on the case study: real facts only (content, store listings).
    glance: [{ n: '2', l: 'audiences served by one site' }, { n: '7', l: 'credential types, one section' }, { n: '8', l: 'industries with their own path' }],
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
    // "At a glance" strip on the case study: real facts only (content, store listings).
    glance: [{ n: '3', l: 'credential products: mobile, Wallet, QR' }, { n: '6', l: 'step credential flow, animated' }, { n: '0', l: 'rewiring for existing systems' }],
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
    // "At a glance" strip on the case study: real facts only (content, store listings).
    glance: [{ n: '3', l: 'tab navigation: Doors, Consoles, Help' }, { n: '2', l: 'stores: Google Play & App Store' }, { n: '100K+', l: 'Google Play downloads' }],
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
    // "At a glance" strip on the case study: real facts only (content, store listings).
    glance: [{ n: '2', l: 'devices, one badge: iPhone & Watch' }, { n: '5', l: 'hours of access with Power Reserve' }, { n: '4', l: 'steps to add a badge' }],
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
  {
    slug: 'hollowmere',
    // Personal project: kept out of the CV's "product case studies" count.
    personal: true,
    company: 'Personal project',
    play: '/play/hollowmere/',
    glance: [{ n: '4', l: 'suspects to interrogate' }, { n: '8', l: 'crime scene hotspots' }, { n: '3', l: 'investigation spaces: scene, lab, séance room' }],
    // Screenshot of the playable build at /play/hollowmere/, captured Nov 2026.
    shot: { base: '/assets/img/work/hollowmere', alt: 'Hollowmere field report for Case 01, The Solstice Vigil, with the four redesigned suspect portraits', caption: 'Hollowmere: Case 01 field report, from the playable build on this site, Nov 2026' },
    number: '07',
    name: 'Hollowmere',
    category: 'Personal Project / Game Design',
    year: '2026',
    summary:
      'A paranormal detective game that runs in the browser: walk a cursed crime scene, run occult lab scans and break suspects in a séance room, while your sanity slips.',
    role: 'Concept, game UX and interface design',
    links: [{ label: 'Play Hollowmere', href: '/play/hollowmere/' }],
    contribution: [
      'Game concept, case and story',
      'Game UX: investigation loop, sanity system and accusation flow',
      'Interface and visual design: dark occult UI, SVG scenes and portraits',
      'Motion and sound direction',
    ],
    tags: ['Game Design', 'Interaction Design', 'Motion', 'Web Audio', 'React'],
    theme: { accent: '#10b981', layout: 'wide' },
    sections: {
      introduction: {
        body: [
          'Hollowmere is a detective game about deaths that look supernatural and are not. It plays in the browser on this site, with no install.',
          'Case 2, The Folklorist, follows a serial killer who stages each murder as a famous monster from folklore, across ten levels that end in a timed confrontation on breaking ice with five endings.',
          'Crime scenes are real-time 3D sets built in three.js, lit by a torch that follows your pointer, with a recorded sound bed for every location. Gore and jumpscares can each be switched off.',
        ],
      },
      context: {
        body: [
          'Case OC-1221. On the night of the winter solstice, Professor Ambrose Vane is found dead in his locked study at Hollowmere Manor, sitting inside an unbroken salt circle. The mirror is shattered and his canary is dead. The household says the Grey Widow took him, just as she took Lord Hollowmere in 1887. Four living people also had reason to want him silent.',
        ],
      },
      objectives: {
        list: [
          'Make the player feel the house working against them, without hiding the real clues',
          'Give each space its own tool: hotspots at the scene, instruments in the lab, pressure in the séance room',
          'Let mistakes cost something, so guessing is never free',
        ],
      },
      role: { useContribution: true },
      final: {
        body: [
          'The crime scene is a top-down plan of the study, the upper landing and the servants’ corridor, with eight hotspots. Some objects are cursed, and looking at them costs sanity.',
          'The paranormal lab has a live EMF waveform, a UV sweep that reveals hidden marks and an EVP equaliser that decodes whispers, beside toxicology and trace analysis. The séance room holds four suspects with animated portraits that glitch when caught in a lie; presenting the right evidence triggers a contradiction or an anomaly.',
          'Case 2 adds a cinematic layer: letterboxed cold opens, film grain, and a torch the player shines around a dark scene that narrows and fails as sanity drops. A case board links the levels, and each solve adds a fragment to the killer’s profile.',
          'Sanity ties it together. As it drops, the vignette closes in, the heartbeat speeds up, and below 40% the interface itself starts to hallucinate. At zero you black out. A correct accusation shows the full timeline, the red herrings and a rank from S to C.',
        ],
        media: [
          { src: '/assets/img/work/hollowmere/crime-scene.webp', alt: 'Hollowmere crime scene: the study lit by the torch around the salt circle, with glowing hotspots and the Occult Case Log', caption: 'Cursed crime scene: sweep the torch to find eight hotspots', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/hollowmere/seance-room.webp', alt: 'Hollowmere séance room: Cordelia Marsh answers a question, beside her composure meter, motive and alibi', caption: 'Séance room: question suspects, then present evidence', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/hollowmere/lab.webp', alt: 'Hollowmere paranormal lab: a UV blacklight sweep of the shattered mirror reveals glowing runes and a lab result', caption: 'Paranormal lab: a UV sweep turns a clue into a lab result', width: 1440, height: 900, wide: true },
        ],
      },
      decisions: {
        list: [
          'Sanity as the single cost: cursed objects, irrelevant evidence and wrong accusations all draw from it',
          'The UI degrades with the player, so tension is shown, not told',
          'A case log that writes itself, so players chase leads instead of taking notes',
          'Every Case 1 suspect line voice-acted with local AI text-to-speech (Voicebox), with emotional direction and on-screen subtitles',
          'Recorded horror sound design (royalty-free Sonniss GDC library) layered over a live-generated drone and heartbeat that track sanity, with a mute toggle always in reach',
          'Jumpscares built on a dead-silence drop before the hit (stabs from DIGITALKEVN\'s Horror Mini Pack), with an opt-out toggle and flashes kept under three per second',
        ],
      },
    },
  },
  {
    slug: 'hearthwild',
    // Personal project: kept out of the CV's "product case studies" count.
    personal: true,
    company: 'Personal project',
    play: '/play/hearthwild/',
    glance: [{ n: '5', l: 'dishes, dawn to dusk' }, { n: '3', l: 'stages: forage, prepare, cook' }, { n: '6', l: 'kinds of prep: brush, chop, fillet, peel, grind, roll' }],
    // Screenshot of the playable build at /play/hearthwild/, captured Nov 2026.
    shot: { base: '/assets/img/work/hearthwild', alt: 'Hearthwild title screen: a thatched cottage at the edge of a 3D forest at dusk', caption: 'Hearthwild: title screen, from the playable build on this site, Nov 2026' },
    number: '08',
    name: 'Hearthwild',
    category: 'Personal Project / Game Design',
    year: '2026',
    summary:
      'A cozy cooking game that runs in the browser: forage and fish the wild, prepare at the board, then cook over the hearth, one dish for every hour of the day.',
    role: 'Concept, game UX, interface and motion design',
    links: [{ label: 'Play Hearthwild', href: '/play/hearthwild/' }],
    contribution: [
      'Game concept, recipes and day structure',
      'Game UX: three-stage loop and gesture-based mini-games',
      'Visual direction: painted landscapes, time-of-day lighting, kitchen and hearth scenes',
      'Motion and sound direction',
    ],
    tags: ['Game Design', 'Interaction Design', 'Motion', 'Web Audio', 'Canvas', 'Three.js'],
    theme: { accent: '#e0a24a', layout: 'wide' },
    sections: {
      introduction: {
        body: [
          'Hearthwild is a slow, cozy game about a chef who cooks only what the land gives. It plays in the browser on this site, on desktop and phone, with no install.',
          'Every dish moves through the same three stages: forage it, prepare it, cook it. Five dishes take you through one day, from chanterelle toast at dawn to venison hand pies at dusk, and the light, sky and sound change with the hour.',
        ],
      },
      objectives: {
        list: [
          'Make every stage feel tactile: you brush, slice, peel and stir with your own gestures',
          'Keep it calm: no timers that end the run, no failing a dish, only a better or rougher result',
          'Keep the hunt gentle in tone: patience and stillness, never anything graphic',
        ],
      },
      role: { useContribution: true },
      final: {
        body: [
          'Foraging happens in wide painted scenes you can pan across, with parallax layers, drifting mist, light shafts, butterflies or fireflies. Anything gatherable glows softly. Fishing is a float that dips and a line you keep in the green. Hunting is a quiet stalk: creep forward while the animal grazes, freeze when it looks up, then breathe with the ring before you let go.',
          'Preparation happens on a cutting board in window light. Each ingredient has its own gesture: brush soil off mushrooms, scale and fillet a trout along the spine, pluck a pheasant as feathers drift away, joint a rabbit along guide lines, peel carrots in long strokes, crush juniper with a pestle and roll out pastry.',
          'Cooking happens at a stone hearth. You work the bellows to keep the flame in a heat band, drag ingredients into the pan, stir in circles, flick to toss, baste, and pull the dish off at golden. The finished dish is then plated in real-time 3D, one piece at a time, under the light of that hour, and earns up to three stars in a recipe journal. After the fifth dish, all five come together on a candlelit table under the stars.',
        ],
        media: [
          { src: '/assets/img/work/hearthwild/forage.webp', alt: 'Hearthwild foraging in real-time 3D: chanterelles and wild garlic glowing in a birch meadow at first light', caption: 'Forage: chanterelles at first light, in real-time 3D', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/hearthwild/fish.webp', alt: 'Hearthwild: the stream below the alders in 3D, with trout and sorrel to find', caption: 'The stream below the alders: brook trout and sorrel', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/hearthwild/prep.webp', alt: 'Hearthwild preparation: jointing a rabbit on a wooden board by following dotted guide lines', caption: 'Prepare: jointing the rabbit at the board', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/hearthwild/cook.webp', alt: 'Hearthwild hearth: a skillet over the fire, a knob of butter to drop in and the bellows ready', caption: 'Cook: bellows, heat band and the golden window', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/hearthwild/plate.webp', alt: 'Hearthwild pheasant with blackberry and juniper, plated in 3D with a three-star rating', caption: 'The finished dish, plated in real-time 3D', width: 1440, height: 900, wide: true },
        ],
      },
      decisions: {
        list: [
          'One loop, three verbs: every recipe teaches forage, prepare, cook, so new dishes add variety without new rules',
          'The time of day is the level design: each dish has its own light, palette and soundscape',
          'Forgiving scoring: quality only changes the stars and the note on the plate, never whether you finish',
          'Recorded kitchen and foley sounds (royalty-free Sonniss GDC library) over live-generated wind, birdsong, stream, fire and a soft kalimba score',
          'Touch first: every gesture works with one finger, and the layout fits phone screens without sideways scrolling',
        ],
      },
    },
  },
  {
    slug: 'aetherbound',
    // Personal project: kept out of the CV's "product case studies" count.
    personal: true,
    company: 'Personal project',
    play: '/play/aetherbound/',
    glance: [{ n: '9', l: 'skills that level only by use' }, { n: '1 of 3', l: 'ability offers every 5 levels' }, { n: '7', l: 'quests in Chapter 1' }],
    // Screenshot of the playable build at /play/aetherbound/, captured Nov 2026.
    shot: { base: '/assets/img/work/aetherbound', alt: 'Aetherbound title screen: a Chapter 1 card beside a 3D diorama of the village, river and forest', caption: 'Aetherbound: title screen, from the playable build on this site, Nov 2026' },
    number: '09',
    name: 'Aetherbound',
    category: 'Personal Project / Game Design',
    year: '2026',
    summary:
      'An isekai RPG that runs in the browser as a tiny 3D diorama: die in 2026, wake up as a baby in a frontier village, and grow stronger by doing. A cold System called the Ledger records every swing, spell and herb.',
    role: 'Concept, story, game systems, UI and motion design',
    links: [{ label: 'Play Aetherbound', href: '/play/aetherbound/' }],
    contribution: [
      'Game concept, story and characters',
      'Progression design: learn-by-doing skills, character levels, ability offers, titles',
      'System UI: status window, skill trees, Ledger log, offers and quest tracker',
      'Opening cinematic, 3D diorama art direction and sound',
    ],
    tags: ['Game Design', 'Systems Design', 'UI Design', 'Narrative', 'three.js', 'Web Audio'],
    theme: { accent: '#c8323c', layout: 'wide' },
    sections: {
      introduction: {
        body: [
          'Aetherbound is an original isekai RPG. A man dies in 2026 and is reborn as Kayden Break, a baby in Thornwick, a frontier village at the edge of a monster-haunted forest. He keeps his adult memories, has magic from birth, and sees a cold, slightly sinister System called the Ledger that writes down everything he does.',
          'Chapter 1 covers his childhood. It plays in the browser on desktop and phone, with keyboard, mouse or touch controls. The world is built as one small floating model, like a tabletop diorama: soft shadows, a tilt-shift camera that keeps Kayden sharp, and light that turns from day to dusk the deeper he goes into the forest.',
        ],
      },
      objectives: {
        list: [
          'Make progress feel earned: skills grow only from doing the thing, so the way you play becomes your build',
          'Make the System a character, not just a menu: it has a voice, it gives orders, and it watches',
          'Keep it grounded and emotional: a family, a mentor, a sister to protect, and a second chance not to waste',
        ],
      },
      role: { useContribution: true },
      final: {
        body: [
          'The game opens in a rainy city at night, with a phone at 3% and unanswered messages from his mother. A bus, a kid on the crossing, and then a black void full of floating pages, one for every life. His is almost blank. The Ledger opens a new entry, and he wakes up as a newborn. His first input is clenching a tiny fist, and the Ledger offers him his first ability.',
          'Every skill levels only by use: sword hits, Water Bolts, healing real wounds, meditating to refill mana, tracking wolves, sneaking, foraging, chopping wood, and using knowledge from his first life. XP depends on how hard the target is, whether the action is new, and how close you are to dying, so grinding weak targets stops paying. Each skill level feeds the character level, each level gives a stat point, and every five levels the Ledger offers three abilities. You keep one and lose the rest.',
          'His family teaches the systems: his mother magic and healing, his father the sword, the old family hunter tracking and gathering, and a wandering mage pushes him into the forest. A fever in the village is solved with one piece of modern knowledge. The chapter ends at a stone circle in the deep forest, against the Ash Wolf Alpha that took his sister.',
        ],
        media: [
          { src: '/assets/img/work/aetherbound/boot.webp', alt: 'Aetherbound: the Ledger status window drawing itself over the cinematic opening, in a newborn\'s vision', caption: 'First boot: the Ledger appears at birth', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/aetherbound/village.webp', alt: 'Aetherbound: Thornwick village as a 3D diorama, with Kayden, his sister and their mother near the herb garden', caption: 'Thornwick, age 6, as a tabletop model', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/aetherbound/forest.webp', alt: 'Aetherbound: the river and its railed bridge in Thornwick, with ducks on the water and real reflections', caption: 'The river: ducks, fish and real reflections', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/aetherbound/alpha.webp', alt: 'Aetherbound: Kayden faces the Ash Wolf Alpha inside the stone circle in the forest', caption: 'The stone circle: facing the Ash Wolf Alpha', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/aetherbound/ledger.webp', alt: 'Aetherbound: the Ledger status tab with stats, title and unassigned stat points', caption: 'The Ledger: every skill levels by use', width: 1440, height: 900, wide: true },
          { src: '/assets/img/work/aetherbound/offer.webp', alt: 'Aetherbound: a Ledger offer of three abilities, pick one', caption: 'Every five levels: pick one ability, lose the rest', width: 1440, height: 900, wide: true },
        ],
      },
      decisions: {
        list: [
          'Learn by doing, with diminishing returns: XP = base x challenge x novelty x risk, so variety and danger are rewarded',
          'The System is unsettling on purpose: red log entries, Directives with a hidden "Failure: ???", and a trait that says "no effect"',
          'Family members teach the mechanics, so the tutorial is also the story',
          'A three-quarter camera on a long lens, with tilt-shift focus on Kayden, so one build reads on desktop, handheld and phone',
          'Trees between the camera and Kayden sink to stumps, so the forest never hides the player',
          'Ledger pop-ups appear in the world as little flip signs beside Kayden, in the one red accent kept for him and the Ledger',
          'The 3D models are built in code with three.js, and the sound is Web Audio plus a recorded narrator for the opening',
        ],
      },
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
  // Scrolling strip on the home page. Source: "Core Expertise" on the CV (Nov 2026).
  coreExpertise: [
    'UI/UX Design',
    'Product Design',
    'UX Research',
    'Competitor Analysis',
    'Design Systems',
    'Motion Design',
    'Interaction Design',
    'Wireframing',
    'Prototyping',
    'Branding',
    'Responsive Design',
    'SaaS Product Design',
  ],
};
