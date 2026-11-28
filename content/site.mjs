// ─────────────────────────────────────────────────────────────────────────────
//  SITE IDENTITY & CONTACT
//  Edit this file to change your name, availability, links and SEO text.
//  After editing, run `npm run build` (Vercel does this automatically on push).
// ─────────────────────────────────────────────────────────────────────────────

export const site = {
  url: 'https://fuzailgfx.vercel.app',
  name: 'Fuzail Khan',
  brand: 'FUZAIL.',
  title: 'Senior Product & UI/UX Designer',
  designation: 'Senior Product Designer · UI/UX, Systems, Motion & Design Engineering',
  company: 'Spintly India Private Limited',
  experienceYears: 3,
  location: 'Goa, India',
  workMode: 'Remote (Goa, India) · Open to relocation across India',
  noticePeriod: '1 month',
  // Shown in the corner labels and footer caption.
  place: { short: 'Goa, IN · Remote', city: 'Madgaon, Goa', coords: '15°16′N 73°57′E', timezone: 'UTC+5:30' },
  designingSince: 2020,

  // Availability badge in the hero and contact sections.
  // Set `enabled: false` to hide it entirely, or change the label.
  availability: {
    enabled: true,
    label: 'Open to Product & Design Engineering roles · 1-month notice',
  },

  // Show the dashed "Visual placeholder" frames in case studies.
  // Keep false for the public site; set true while drafting to see what's missing.
  showPlaceholders: false,

  hero: {
    headline: ['Designing', 'beyond the', 'interface.'],
    // Word(s) from the headline rendered in the editorial italic serif.
    accentWord: 'beyond',
    statement: 'I turn complex ideas into meaningful digital experiences through research, design and technology.',
    intro: "I'm Fuzail Khan, a Senior Product & UI/UX Designer working across enterprise SaaS, mobile products, design systems and interactive code prototypes.",
  },

  contact: {
    // While email is null, contact CTAs point to LinkedIn instead.
    email: 'fuzailgfx@gmail.com',
    linkedin: 'https://www.linkedin.com/in/fuzail-360',
    github: 'https://github.com/Zak455',
    // Shown on the CV only. The site shows a WhatsApp button instead of the number.
    phone: '+91 73509 20817',
    // WhatsApp: number in international format, digits only, and the message it opens with.
    whatsapp: '917350920817',
    whatsappText: 'Hi Fuzail, I came across your portfolio and would like to talk about a role.',
    // CV page built from content/ (src/templates/cv.mjs); its PDF lives in src/assets/cv/.
    // Set to null to hide the CV links.
    cv: '/cv/',
    cvPdf: '/assets/cv/Fuzail-Khan-CV.pdf',
    cvAts: '/cv/ats/',
    cvAtsPdf: '/assets/cv/Fuzail-Khan-CV-ATS.pdf',
  },

  seo: {
    description:
      'Fuzail Khan is a Senior Product & UI/UX Designer based in Goa, India (open to remote & India roles). Enterprise SaaS, mobile apps, design systems, motion and interactive prototyping in code.',
    ogImage: '/assets/img/meta/og.jpg',
  },
};
