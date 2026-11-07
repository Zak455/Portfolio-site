// ─────────────────────────────────────────────────────────────────────────────
//  ABOUT, EXPERIENCE, CAPABILITIES, TOOLS
// ─────────────────────────────────────────────────────────────────────────────

export const about = {
  lead: "I'm a multidisciplinary designer working where product, experience, visual communication and technology meet.",
  body: [
    'My work spans product design, UX research, visual identity, websites, mobile applications and motion design — mostly inside enterprise SaaS, where the products are complex and the details matter.',
    'I enjoy understanding complex products, finding the opportunity inside them and translating it into experiences that are intuitive and visually compelling. I can take a product from research and ideation through interface design and branding, and stay in the room with development teams while it gets built.',
  ],
  philosophy: 'Great design exists where usability, aesthetics and purpose meet.',
  principles: [
    { title: 'Understand first', text: 'Research, competitor analysis and product context before pixels.' },
    { title: 'Make it coherent', text: 'One visual language from brand to interface to marketing.' },
    { title: 'Build it together', text: 'Design decisions made with development and R&D, not handed over the wall.' },
  ],
  collaboration:
    'I work closely with developers, R&D and stakeholders — sharing early, explaining the reasoning behind decisions and adjusting to engineering realities.',
  portrait: { src: '/assets/img/about/portrait', alt: 'Portrait of Fuzail Khan' },
};

// No dates are shown because none have been provided — add them as e.g. '2022 — Present'.
export const experience = [
  {
    company: 'Spintly India Private Limited',
    role: 'Senior UI Designer',
    period: 'Current', // TODO: e.g. '2022 — Present'
    summary:
      'Designing across Spintly’s smart access products — from product UI and brand to website and marketing.',
    focus: [
      'Competitor and UX research',
      'Product and UI design',
      'Motion design',
      'Graphic design',
      'Product branding and rebranding',
      'Cross-functional collaboration with development and R&D',
    ],
    highlights: [
      'Ideated, designed and rebranded the software suite into OptiSpaces.ai',
      'Redesigned the Spintly website for a global audience',
      'Rebranded the credential management platform as Scypher',
      'Designed the Spintly V3 mobile app rebrand',
      'Contributed the product experience to the Apple Wallet integration',
    ],
  },
  {
    company: 'Sociomagic',
    role: 'Lead Graphic Designer',
    period: 'Earlier', // TODO: add dates
    summary: 'Designed the company logo, intro video, social media posts, project launch ad and website illustrations.',
    focus: [],
    highlights: [],
  },
  {
    company: 'Happy Investments',
    role: 'Graphic Designer · Commission',
    period: 'Earlier', // TODO: add dates
    summary: 'Posters, business cards, banners, logos and brochures for the company.',
    focus: [],
    highlights: [],
  },
];

export const capabilities = [
  {
    index: '01',
    title: 'Product & UX',
    items: ['UX Research', 'Competitor Analysis', 'Information Architecture', 'User Flows', 'Wireframing', 'Prototyping', 'Product Thinking'],
  },
  {
    index: '02',
    title: 'Interface Design',
    items: ['SaaS Interfaces', 'Web UI', 'Mobile UI', 'Responsive Design', 'Design Systems', 'Visual Hierarchy'],
  },
  {
    index: '03',
    title: 'Visual Design',
    items: ['Brand Identity', 'Rebranding', 'Graphic Design', 'Art Direction', 'Marketing Creatives', 'Presentations'],
  },
  {
    index: '04',
    title: 'Motion & Technology',
    items: ['Motion Graphics', 'Animation', 'Interaction Design', 'Web Development Collaboration'],
  },
];

// level: 3 = Advanced, 2 = Intermediate, 1 = Familiarity
export const tools = [
  { name: 'Figma', level: 3, label: 'Advanced' },
  { name: 'Canva', level: 3, label: 'Advanced' },
  { name: 'Adobe Photoshop', level: 2, label: 'Intermediate' },
  { name: 'Adobe Illustrator', level: 2, label: 'Intermediate' },
  { name: 'After Effects', level: 1, label: 'Familiarity' },
];
