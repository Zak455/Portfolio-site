// ─────────────────────────────────────────────────────────────────────────────
//  SITE IDENTITY & CONTACT
//  Edit this file to change your name, availability, links and SEO text.
//  After editing, run `npm run build` (Vercel does this automatically on push).
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  url: 'https://fuzailgfx.vercel.app',
  name: 'Fuzail Khan',
  brand: 'FUZAIL.',
  title: 'Senior UI/UX Designer',
  designation: 'Senior UI/UX Designer · UX Strategy, UI, Motion & Visual Design',
  company: 'Spintly India Private Limited',
  experienceYears: 3,
  location: 'Goa, India',
  // Shown in the corner labels and footer caption.
  place: { short: 'Goa, IN', city: 'Madgaon, Goa', coords: '15°16′N 73°57′E', timezone: 'UTC+5:30' },
  designingSince: 2020,

  // Availability badge in the hero and contact sections.
  // Set `enabled: false` to hide it entirely, or change the label.
  availability: {
    enabled: true,
    label: 'Open to opportunities',
  },

  // Show the dashed "Visual placeholder" frames in case studies.
  // Keep false for the public site; set true while drafting to see what's missing.
  showPlaceholders: false,

  hero: {
    headline: ['Designing', 'beyond the', 'interface.'],
    // Word(s) from the headline rendered in the editorial italic serif.
    accentWord: 'beyond',
    statement: 'I turn complex ideas into meaningful digital experiences through research, design and technology.',
    intro: "I'm Fuzail Khan, a Senior UI/UX Designer working across product experiences, visual identities and digital products.",
  },

  contact: {
    // While email is null, contact CTAs point to LinkedIn instead.
    email: 'fuzailgfx@gmail.com',
    linkedin: 'https://www.linkedin.com/in/fuzail-360',
    github: 'https://github.com/Zak455',
    phone: '+91 73509 20817',
    // CV page built from content/ (src/templates/cv.mjs); its PDF lives in src/assets/cv/.
    // Set to null to hide the CV links.
    cv: '/cv/',
    cvPdf: '/assets/cv/Fuzail-Khan-CV.pdf',
  },

  seo: {
    description:
      'Fuzail Khan is a Senior UI/UX Designer in Goa, India. UX strategy, competitor analysis, UI, motion and visual design for enterprise SaaS. Turning research into high-impact interfaces.',
    ogImage: '/assets/img/meta/og.jpg',
  },
};
