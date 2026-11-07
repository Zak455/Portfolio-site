// ─────────────────────────────────────────────────────────────────────────────
//  SITE IDENTITY & CONTACT
//  Edit this file to change your name, availability, links and SEO text.
//  After editing, run `npm run build` (Vercel does this automatically on push).
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  url: 'https://fuzailgfx.vercel.app',
  name: 'Fuzail Khan',
  brand: 'FUZAIL.',
  title: 'Senior UI Designer',
  designation: 'Senior UI Designer | Product & Visual Designer',
  company: 'Spintly India Private Limited',
  experienceYears: 3,
  location: 'India',

  // Availability badge in the hero and contact sections.
  // Set `enabled: false` to hide it entirely, or change the label.
  availability: {
    enabled: true,
    label: 'Open to opportunities',
  },

  hero: {
    headline: ['Designing', 'beyond the', 'interface.'],
    // Word(s) from the headline rendered in the editorial italic serif.
    accentWord: 'beyond',
    statement: 'I turn complex ideas into meaningful digital experiences through research, design and technology.',
    intro: "I'm Fuzail Khan — a Senior UI/UX Designer working across product experiences, visual identities and digital products.",
  },

  contact: {
    // TODO: add your email address (e.g. 'hello@yourdomain.com').
    // While this is null, contact CTAs point to LinkedIn instead.
    email: null,
    linkedin: 'https://www.linkedin.com/in/fuzail-360',
    github: 'https://github.com/Zak455',
    // TODO: add an up-to-date CV as src/assets/cv/fuzail-khan-cv.pdf and set:
    // cv: '/assets/cv/fuzail-khan-cv.pdf'
    // (The 2021 student CV in assets/source/ is intentionally not published.)
    cv: null,
  },

  seo: {
    description:
      'Fuzail Khan — Senior UI Designer, product & visual designer. Enterprise SaaS, mobile apps, websites, branding and motion. Designing beyond the interface.',
    ogImage: '/assets/img/meta/og.jpg',
  },
};
