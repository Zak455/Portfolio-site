// ─────────────────────────────────────────────────────────────────────────────
//  PORTFOLIO INTERVIEW DECK (/deck/): 21-slide 16:9 interactive presentation
//  + Presenter Notes (N) + 45-min Pacing Timer + Interview Prep Kit (P)
//  + 16:9 landscape PDF export (src/assets/cv/Fuzail-Khan-Portfolio-Deck.pdf).
// ─────────────────────────────────────────────────────────────────────────────
import { esc } from './components.mjs';

const PDF = '/assets/cv/Fuzail-Khan-Portfolio-Deck.pdf';

const SLIDES = [
  {
    id: 'cover',
    act: 'Intro',
    time: '0:00 – 1:00',
    theme: 'dark',
    notes: [
      'Open warm, confident, and structured: set expectations for the next 45 minutes.',
      'Say: "I’ll walk you through two deep dives—unifying 7 enterprise SaaS modules in OptiSpaces.ai, and building our V3 mobile design system with QA—followed by a 3-minute look at how I prototype in code and motion, leaving ~10 minutes for Q&A."',
      'Ask upfront: "Would you prefer questions as we go, or at the end of each case study?" (Strong senior signal.)',
    ],
    html: (site) => `
      <div class="sl-cover">
        <div class="sl-cover-top">
          <span class="sl-pill"><i class="dot"></i>Portfolio Walkthrough · 45 Min</span>
          <span class="sl-mono">2024 – 2026 · Selected Work</span>
        </div>
        <div class="sl-cover-main">
          <p class="sl-eyebrow">Fuzail Khan · ${esc(site.title)}</p>
          <h1 class="sl-h1">Turning complex enterprise systems into clear, scalable products.</h1>
          <p class="sl-lead">Enterprise B2B SaaS · Mobile Design Systems (100K+) · Hardware/OS UX · Motion &amp; Code Prototyping</p>
        </div>
        <div class="sl-cover-foot">
          <div class="sl-who">
            <img src="/assets/img/about/portrait-photo-560.webp" alt="Fuzail Khan" width="52" height="52">
            <div><strong>${esc(site.name)}</strong><span>Goa, India · Remote preferred &amp; open across India · 1-month notice</span></div>
          </div>
          <div class="sl-agenda-mini">
            <span><b>01</b> OptiSpaces.ai (16m)</span>
            <span><b>02</b> Spintly V3 &amp; Systems (14m)</span>
            <span><b>03</b> Web, Motion &amp; Code (4m)</span>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'arc',
    act: 'Intro',
    time: '1:00 – 2:00',
    theme: 'light',
    notes: [
      'Keep this to 60 seconds—establish slope, engineering credibility, and real ownership.',
      'Highlight the 4-role progression in 3.5 years at Spintly: you earned trust quickly and expanded from marketing web to owning full enterprise SaaS architecture and two design systems.',
      'Mention your Electronics & Communication Engineering degree: it is why you collaborate fluently with R&D, QA, and frontend engineers—and why you build working React/Three.js prototypes.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">00 · Background &amp; Slope</p>
        <h2 class="sl-h2">Engineering foundation. Rapid product ownership.</h2>
        <div class="sl-kpis">
          <div class="sl-kpi"><b>4 roles</b><span>Internal progression in 3.5 yrs at Spintly</span></div>
          <div class="sl-kpi"><b>7 modules</b><span>Unified into OptiSpaces.ai web &amp; mobile</span></div>
          <div class="sl-kpi"><b>100K+</b><span>Google Play installs on Spintly V3 app</span></div>
          <div class="sl-kpi"><b>2 systems</b><span>Company-wide web + dedicated V3 mobile DS</span></div>
        </div>
        <div class="sl-ladder">
          <div class="sl-step"><span>Mar – Aug 2023</span><strong>Web Designer</strong><p>Marketing sites &amp; visual craft foundations</p></div>
          <div class="sl-step"><span>Aug 2023 – Aug 2025</span><strong>UI / Graphic Designer</strong><p>Product UI, Apple Wallet R&amp;D, mobile V3</p></div>
          <div class="sl-step"><span>Aug 2025 – Jan 2026</span><strong>Senior UI Designer</strong><p>Dedicated V3 mobile design system &amp; QA loops</p></div>
          <div class="sl-step sl-step--now"><span>Jan 2026 – Present</span><strong>Senior UI/UX Designer</strong><p>OptiSpaces.ai, company DS, live spintly.com</p></div>
        </div>
        <p class="sl-footnote">B.E. Electronics &amp; Communication Engineering · Published ML/SEO paper · Prototypes directly in HTML/CSS/JS, React &amp; Three.js</p>
      </div>`,
  },
  {
    id: 'opti-title',
    act: 'Deep Dive 01 · OptiSpaces.ai',
    time: '2:00 – 3:30',
    theme: 'dark',
    notes: [
      'Transition cleanly into Deep Dive #1: OptiSpaces.ai (2026).',
      'Frame the business context: Spintly powers physical security for enterprise clients like JLL, WeWork, Honeywell, CapitaLand, and Tata Consumer Products.',
      'Point to the platform unification visual: previously Spintly sold fragmented "SaaS solutions"—OptiSpaces.ai brought 7 modules under one intelligent platform across web portal, iOS, and Android.',
    ],
    html: () => `
      <div class="sl-split sl-split--dark">
        <div class="sl-col">
          <p class="sl-eyebrow">Deep Dive 01 · Enterprise B2B SaaS (2026)</p>
          <h2 class="sl-h2">OptiSpaces.ai: Unifying 7 enterprise modules into one platform.</h2>
          <p class="sl-p">From fragmented legacy “SaaS solutions” to one intent-focused web portal, mobile identity, and company-wide design system.</p>
          <ul class="sl-bullets">
            <li><b>My Role:</b> Legacy UX audit, competitor benchmarking, UX architecture, company-wide design system &amp; portal UI</li>
            <li><b>Scope:</b> Access, Attendance, Visitors, Tenants + new Video, Lockers &amp; Elevators</li>
            <li><b>Team:</b> Weekly cross-functional iterations with engineering, R&amp;D, QA &amp; leadership</li>
          </ul>
        </div>
        <div class="sl-media-box">
          <video class="sl-video" src="/assets/video/spintly-to-optispaces.mp4" poster="/assets/video/spintly-to-optispaces.webp" muted loop playsinline autoplay></video>
          <img class="sl-print-poster" src="/assets/img/work/optispaces/dashboard-overview.webp" alt="OptiSpaces.ai platform overview">
        </div>
      </div>`,
  },
  {
    id: 'opti-problem',
    act: 'Deep Dive 01 · OptiSpaces.ai',
    time: '3:30 – 5:30',
    theme: 'light',
    notes: [
      'Start with the messy reality—hiring managers want to see how you diagnose problems before touching Figma.',
      'Explain your audit of Spintly’s old "SaaS solutions" dashboard: primitive UI, core modules (Access, Attendance, Visitors, Tenants) had grown inconsistently, lacked clear in-product details/instructions, and couldn’t absorb 3 brand-new modules (Video, Lockers, Elevators).',
      'Keep it crisp: define the two user groups—building admins running daily operations on web, and employees/residents unlocking doors on mobile.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">01 · Problem &amp; Legacy UX Audit</p>
        <h2 class="sl-h2">Seven building workflows trapped in a fragmented legacy portal.</h2>
        <div class="sl-compare">
          <div class="sl-card sl-card--muted">
            <span class="sl-tag sl-tag--warn">Before · Legacy “SaaS Solutions”</span>
            <h3>Primitive, disconnected &amp; hard to scale</h3>
            <ul class="sl-list">
              <li>Core modules (Access, Attendance, Visitors, Tenants) evolved independently with inconsistent layouts and interaction habits.</li>
              <li>Sparse contextual details and instructions forced admins to rely on trial-and-error or support calls for routine setups.</li>
              <li>No scalable navigation or design-system foundation to onboard Video, Locker, and Elevator management cleanly.</li>
            </ul>
          </div>
          <div class="sl-card sl-card--accent">
            <span class="sl-tag sl-tag--blue">Target · OptiSpaces.ai Platform</span>
            <h3>One coherent operating system for buildings</h3>
            <ul class="sl-list">
              <li>Shared entity model: one set of sites, users, doors, and credentials flowing seamlessly across all 7 modules.</li>
              <li>Clearer in-flow guidance and scannable data tables without overwhelming experienced operators.</li>
              <li>One unified visual &amp; component language across the web portal, iOS/Android app, and live marketing pages.</li>
            </ul>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'opti-bench',
    act: 'Deep Dive 01 · OptiSpaces.ai',
    time: '5:30 – 7:30',
    theme: 'light',
    notes: [
      'Show domain fluency: name the exact 7 global leaders you benchmarked—Verkada, Brivo, Kisi, HID, Avigilon, Swiftlane, and Apple.',
      'Do NOT just list brand names—state the 3 specific UX insights you extracted and applied to OptiSpaces.ai.',
      'Bonus for Verkada/Honeywell/Cisco interviews: this immediately signals you already understand their category’s UX bar.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">01 · Competitive Benchmarking</p>
        <h2 class="sl-h2">Studying 7 category &amp; hardware-ecosystem benchmarks.</h2>
        <div class="sl-chips-row">
          <span>Verkada</span><span>Brivo</span><span>Kisi</span><span>HID</span><span>Avigilon</span><span>Swiftlane</span><span>Apple</span>
        </div>
        <div class="sl-grid-3">
          <div class="sl-card">
            <span class="sl-num">Insight 01</span>
            <h3>Multi-module clarity over nesting</h3>
            <p>Best-in-class enterprise security portals keep primary modules visible in one persistent left rail instead of burying tools inside nested app switchers.</p>
          </div>
          <div class="sl-card">
            <span class="sl-num">Insight 02</span>
            <h3>Data density with visual calm</h3>
            <p>Operators scan logs, rosters, and alerts for hours. High contrast, disciplined spacing, and semantic status pills beat decorative widgets every time.</p>
          </div>
          <div class="sl-card">
            <span class="sl-num">Insight 03</span>
            <h3>Hardware-to-cloud transparency</h3>
            <p>Apple and Swiftlane prove that physical-access UX succeeds when users immediately trust device state, credential type, and fallback behaviour.</p>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'opti-tradeoff',
    act: 'Deep Dive 01 · OptiSpaces.ai',
    time: '7:30 – 10:30',
    theme: 'light',
    notes: [
      'THIS IS YOUR HIGHEST SENIOR-SIGNAL SLIDE. Spend a full 2.5–3 minutes here.',
      'Walk through the two extremes you explored and deliberately rejected:',
      '1) Heavily graphical / visual-first approach: looked flashy in executive decks, but slowed down daily building admins scanning tables and rosters.',
      '2) Dense technical / instruction-heavy approach: stuffed long helper text into an already complex enterprise SaaS interface, causing cognitive overload.',
      'Explain why you advocated for the intent-focused middle ground—and how that decision became the north star for the entire software portal.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">01 · Explorations &amp; Key Tradeoff</p>
        <h2 class="sl-h2">Two directions we rejected—and why the middle ground won.</h2>
        <div class="sl-grid-3 sl-grid-3--tradeoff">
          <div class="sl-card sl-card--rejected">
            <span class="sl-tag sl-tag--red">Tabled · Direction A</span>
            <h3>Full Graphical Approach</h3>
            <p>Heavy visual widgets, illustrative cards, and decorative containers across operational views.</p>
            <p class="sl-why"><b>Why we dropped it:</b> Looked impressive at a glance, but added visual weight and reduced data scannability for admins reviewing hundreds of daily events.</p>
          </div>
          <div class="sl-card sl-card--rejected">
            <span class="sl-tag sl-tag--red">Tabled · Direction B</span>
            <h3>Dense Technical Approach</h3>
            <p>Packing exhaustive inline instructions, tooltips, and raw technical controls onto every screen.</p>
            <p class="sl-why"><b>Why we dropped it:</b> Congested an already complex SaaS interface—slowing down power users without genuinely simplifying first-time setup.</p>
          </div>
          <div class="sl-card sl-card--chosen">
            <span class="sl-tag sl-tag--green">Shipped · Chosen Direction</span>
            <h3>Intent-Focused Middle Ground</h3>
            <p>Clean hierarchy, scannable operational tables, progressive disclosure, and concise guidance exactly where rules are configured.</p>
            <p class="sl-why"><b>Why it won:</b> Balanced first-time admin clarity with high-frequency operational speed—and scaled across all 7 modules.</p>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'opti-dash',
    act: 'Deep Dive 01 · OptiSpaces.ai',
    time: '10:30 – 13:00',
    theme: 'light',
    notes: [
      'Walk through the shipped web portal: start with Dashboard Overview (left) and Access Management / Live Access History (right).',
      'Point out intentional UX choices: admins open straight onto hourly Entry vs. Exit analytics + live KPI cards (Users, Access Points, Visitors, Shifts).',
      'On Access History, point out the expanded persistent left rail, live indicator, inline column filters (Date, ID, Access Type, Direction, Door), and scannable Entry/Exit status pills.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">01 · Shipped Enterprise Portal · Core Operations</p>
        <h2 class="sl-h2">One persistent architecture from live overview to granular audit logs.</h2>
        <div class="sl-shots-2">
          <figure class="sl-shot">
            <img src="/assets/img/work/optispaces/dashboard-overview.webp" alt="OptiSpaces.ai dashboard overview">
            <figcaption><b>Dashboard Home:</b> Hourly entry/exit analytics paired with organisation KPI cards &amp; site switcher.</figcaption>
          </figure>
          <figure class="sl-shot">
            <img src="/assets/img/work/optispaces/dashboard-access-history.webp" alt="OptiSpaces.ai Access Management live history">
            <figcaption><b>Access Management:</b> Live event stream with inline column filters, credential icons &amp; entry/exit states.</figcaption>
          </figure>
        </div>
      </div>`,
  },
  {
    id: 'opti-complex',
    act: 'Deep Dive 01 · OptiSpaces.ai',
    time: '13:00 – 15:30',
    theme: 'light',
    notes: [
      'Show how the intent-focused pattern handles true B2B enterprise complexity.',
      'Spotlight the 31-day color-coded Shift Management roster matrix (left): clear shift legend (GS, WO, CH, DH), bulk assignment, inline cell dropdowns, and nested Attendance navigation.',
      'Call out Visitor Management (top right) for clean configuration/custom-attribute UX, and the 3-step Overtime Policy wizard (bottom right) for breaking complex multi-stage setup into digestible steps.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">01 · Shipped Enterprise Portal · Complex Workflows</p>
        <h2 class="sl-h2">Taming high-density rosters, custom configurations &amp; guided wizards.</h2>
        <div class="sl-bento-shots">
          <figure class="sl-shot sl-shot--tall">
            <img src="/assets/img/work/optispaces/shift-roster.webp" alt="31-day colour-coded shift roster matrix">
            <figcaption><b>Shift Management Roster:</b> 31-day colour-coded matrix with bulk assign &amp; clear legends.</figcaption>
          </figure>
          <div class="sl-bento-col">
            <figure class="sl-shot">
              <img src="/assets/img/work/optispaces/visitor-setup.webp" alt="Visitor Management check-in setup">
              <figcaption><b>Visitor Setup:</b> Modular check-in fields &amp; custom attribute builder.</figcaption>
            </figure>
            <figure class="sl-shot">
              <img src="/assets/img/work/optispaces/overtime-policy.webp" alt="3-step Overtime Policy wizard">
              <figcaption><b>Overtime Policy Wizard:</b> Progressive 3-step setup instead of one crowded form.</figcaption>
            </figure>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'opti-system',
    act: 'Deep Dive 01 · OptiSpaces.ai',
    time: '15:30 – 17:00',
    theme: 'light',
    notes: [
      'Highlight that you didn’t just design screens—you built a company-wide design system from brand foundations (OptiSpaces.ai logo, clearspace, and motion reveal) down to UI tokens (color ramps, Inter type scale, button sizing, spacing, and padding).',
      'Connect this directly to business leverage: every new module and every page of spintly.com now pulls from one coherent system.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">01 · Brand Identity &amp; Company-Wide Design System</p>
        <h2 class="sl-h2">One visual language from logo clearspace to portal components.</h2>
        <div class="sl-shots-2">
          <figure class="sl-shot">
            <video class="sl-video" src="/assets/video/optispaces-logo-reveal.mp4" poster="/assets/video/optispaces-logo-reveal.webp" muted loop playsinline autoplay></video>
            <img class="sl-print-poster" src="/assets/video/optispaces-logo-reveal.webp" alt="OptiSpaces.ai logo reveal">
            <figcaption><b>Brand in Motion:</b> OptiSpaces.ai powered by Spintly identity &amp; motion reveal.</figcaption>
          </figure>
          <figure class="sl-shot">
            <img src="/assets/img/work/spintly-v3/design-system-foundations.webp" alt="Design system foundations">
            <figcaption><b>System Foundations:</b> Brand &amp; state colour ramps, Inter type hierarchy, elevation &amp; logo rules.</figcaption>
          </figure>
        </div>
      </div>`,
  },
  {
    id: 'opti-constraints',
    act: 'Deep Dive 01 · OptiSpaces.ai',
    time: '17:00 – 18:00',
    theme: 'light',
    notes: [
      'Wrap Deep Dive #1 with maturity: talk honestly about constraints AND what you would improve next.',
      'Mention navigating legacy flows, tech stack limits, leadership feedback, and tight timelines simultaneously using weekly cross-team iterations and AI-assisted rapid prototyping.',
      'Drop your senior "What I’d improve next" reflection: role-personalized dashboard views (Security Officer vs. HR Admin) and keyboard shortcuts on the 31-day Shift Roster.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">01 · Real Constraints, Collaboration &amp; Reflection</p>
        <h2 class="sl-h2">Shipping under real enterprise constraints—and what’s next.</h2>
        <div class="sl-compare">
          <div class="sl-card">
            <span class="sl-tag sl-tag--blue">How We Delivered</span>
            <h3>Constraints navigated in production</h3>
            <ul class="sl-list">
              <li><b>Legacy flows &amp; tech-stack limits:</b> Designed progressive improvements that respected existing backend contracts and customer habits.</li>
              <li><b>Tight timelines &amp; stakeholder alignment:</b> Ran weekly cross-functional review loops with engineering, QA, and leadership.</li>
              <li><b>AI-assisted rapid prototyping:</b> Used AI workflows to explore and test layout variants fast before committing engineering sprints.</li>
            </ul>
          </div>
          <div class="sl-card sl-card--muted">
            <span class="sl-tag sl-tag--dark">If I Had 2 More Sprints</span>
            <h3>Honest next-stage improvements</h3>
            <ul class="sl-list">
              <li><b>Role-adaptive dashboards:</b> Surface live EDGE AI / door alerts first for Security Officers, and attendance exceptions first for HR Admins.</li>
              <li><b>Power-user roster speed:</b> Add keyboard range-selection and inline bulk rules for 500+ employee shift matrices.</li>
              <li><b>Deeper telemetry:</b> Pair live flows with funnel &amp; task-completion instrumentation across modules.</li>
            </ul>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'v3-title',
    act: 'Deep Dive 02 · Spintly V3 Mobile',
    time: '18:00 – 19:30',
    theme: 'dark',
    notes: [
      'Pivot to Deep Dive #2: Spintly V3 Mobile App & Dedicated Mobile Design System (2025).',
      'Set the core design tension immediately: "Over 100K+ Play Store users open this app 4–8 times a day, often one-handed while walking up to a locked door. We had to modernize the entire visual system and add new modules without breaking muscle memory—a new look, same feel."',
    ],
    html: () => `
      <div class="sl-split sl-split--dark">
        <div class="sl-col">
          <p class="sl-eyebrow">Deep Dive 02 · Mobile Product &amp; Design System (2025)</p>
          <h2 class="sl-h2">Spintly V3: Rebuilding a 100K+ daily-use app—and taking months off delivery.</h2>
          <p class="sl-p">A dedicated mobile design system powering the live OptiSpaces.ai iOS &amp; Android app, iterated directly alongside QA and mobile engineering.</p>
          <ul class="sl-bullets">
            <li><b>Scale:</b> 100K+ Google Play downloads · Live on Apple App Store &amp; Google Play</li>
            <li><b>Tension:</b> Modernise UI &amp; add new modules without breaking daily door-unlock habits</li>
            <li><b>Breakthrough:</b> Component-level QA iteration cut months from the release timeline</li>
          </ul>
        </div>
        <div class="sl-media-box">
          <img src="/assets/img/work/spintly-v3/rebrand.webp" alt="Spintly V3 mobile app rebrand to OptiSpaces.ai">
        </div>
      </div>`,
  },
  {
    id: 'v3-ux',
    act: 'Deep Dive 02 · Spintly V3 Mobile',
    time: '19:30 – 22:00',
    theme: 'light',
    notes: [
      'Walk through the 5 concrete mobile UX decisions visible right in the shipped screens:',
      '1) 3-tab bottom bar (Doors, Consoles, Help) so opening a door is always the home screen.',
      '2) Full-width green unlock confirmation—readable in peripheral vision while walking.',
      '3) Role tabs (Admin / Manager / User) inside My Console so one app serves everyone cleanly.',
      '4) Inline Approve / Reject directly on visitor cards—no extra detail screen needed.',
      '5) GPS attendance check-in inside a bottom sheet confirming location before submission.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">02 · Everyday Mobile UX Decisions</p>
        <h2 class="sl-h2">Designed for one-handed speed while walking up to a door.</h2>
        <div class="sl-split-wide">
          <figure class="sl-shot">
            <img src="/assets/img/work/spintly-v3/key-screens.webp" alt="Spintly V3 key screens">
            <figcaption>Shipped iOS &amp; Android flows: GPS remote check-in, My Console, inline visitor approvals &amp; help.</figcaption>
          </figure>
          <ol class="sl-decisions">
            <li><b>01 · 3-Tab Bottom Bar</b><span>Doors, Consoles &amp; Help—highest-frequency task always on home.</span></li>
            <li><b>02 · Glanceable Unlock State</b><span>Full-width green confirmation readable mid-stride.</span></li>
            <li><b>03 · Role-Segmented Console</b><span>Admin, Manager &amp; User tabs keep one app clutter-free.</span></li>
            <li><b>04 · Inline Visitor Actions</b><span>Approve or reject directly on the card in one tap.</span></li>
            <li><b>05 · Bottom-Sheet GPS Check-in</b><span>Confirms captured location in context without page jumps.</span></li>
          </ol>
        </div>
      </div>`,
  },
  {
    id: 'v3-foundations',
    act: 'Deep Dive 02 · Spintly V3 Mobile',
    time: '22:00 – 24:00',
    theme: 'light',
    notes: [
      'Explain WHY you built a separate, dedicated mobile design system rather than shrinking web SaaS components onto phones.',
      'Walk through the foundations sheet: Brand & Parent Brand color scales, accessible semantic State colors (White, Grey, Info, Success, Warning, Error), Inter H1–H7 mobile typography scale with explicit line heights, 6-step elevation shadows, and logo rules.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">02 · Dedicated V3 Mobile Design System · Foundations</p>
        <h2 class="sl-h2">Purpose-built mobile tokens: colour ramps, type scale &amp; elevation.</h2>
        <figure class="sl-shot sl-shot--hero">
          <img src="/assets/img/work/spintly-v3/design-system-foundations.webp" alt="Spintly V3 mobile design system foundations">
          <figcaption>Brand &amp; semantic state tokens, Inter H1–H7 type scale, 6-level elevation shadows, and brand mark guidelines.</figcaption>
        </figure>
      </div>`,
  },
  {
    id: 'v3-components',
    act: 'Deep Dive 02 · Spintly V3 Mobile',
    time: '24:00 – 27:00',
    theme: 'light',
    notes: [
      'Let this slide breathe—hiring managers and Staff Designers LOVE seeing real component-state matrices!',
      'Call out the exact engineering rigor shown here:',
      '• Buttons: Primary, Secondary, Tertiary × Default / Pressed / Disabled × 6 semantic palettes × 3 sizes.',
      '• Input Fields: Explicit 16px mobile floor (prevents iOS Safari auto-zoom!) × Default / Active / Filled / Disabled / Error × Standard, OTP, Caption, Country-code Combo, and Multi-Select.',
      '• Badges: Consistent size, dot, icon, and semantic colour rules.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">02 · Dedicated V3 Mobile Design System · Component Matrices</p>
        <h2 class="sl-h2">Exhaustive states upfront—so engineers never guess edge cases.</h2>
        <figure class="sl-shot sl-shot--hero">
          <img src="/assets/img/work/spintly-v3/design-system-components.webp" alt="Buttons, Input Fields and Badges component matrices">
          <figcaption>Multi-state Buttons, Input Fields (16px mobile floor, OTP, combo, error states) &amp; semantic Badge matrices.</figcaption>
        </figure>
      </div>`,
  },
  {
    id: 'v3-qa',
    act: 'Deep Dive 02 · Spintly V3 Mobile',
    time: '27:00 – 30:30',
    theme: 'light',
    notes: [
      'SPOTLIGHT TWO HUGE SENIOR SIGNALS ON THIS SLIDE:',
      '1) Point directly to the orange "Handoff Card" in the bottom-right corner: "Instead of asking mobile devs to code a custom loader from scratch, I prototyped the feel in Figma and attached a ready-to-drop Lottie asset link."',
      '2) Tell your QA velocity story: "We didn’t wait for finished screens to bring in QA. Iterating directly on individual components with QA surfaced layout, touch-target, and state issues early—shaving months off our overall release timeline."',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">02 · Mobile Patterns, Developer Handoff &amp; QA Velocity</p>
        <h2 class="sl-h2">Iterating components directly with QA took months off delivery.</h2>
        <div class="sl-split-wide sl-split-wide--img">
          <figure class="sl-shot">
            <img src="/assets/img/work/spintly-v3/design-system-mobile-patterns.webp" alt="Mobile navigation, steppers, controls and Lottie handoff card">
            <figcaption>Bottom nav, steppers, switches, top app bar, tabs, loading indicators &amp; explicit Lottie developer handoff notes.</figcaption>
          </figure>
          <div class="sl-callout-col">
            <div class="sl-card sl-card--accent">
              <span class="sl-tag sl-tag--blue">Engineering Empathy</span>
              <h3>Lottie Handoff Cards</h3>
              <p>Prototyped loading feel in Figma, then documented direct Lottie links so devs shipped smooth motion in minutes—not days of custom animation code.</p>
            </div>
            <div class="sl-card sl-card--chosen">
              <span class="sl-tag sl-tag--green">Operational Impact</span>
              <h3>QA Embedded at Component Level</h3>
              <p>Testing every reusable component with QA across multiple functional iterations caught edge cases early and cut months of late-stage rework.</p>
            </div>
          </div>
        </div>
      </div>`,
  },
  {
    id: 'apple-wallet',
    act: 'Deep Dive 02 · Ecosystem Bonus',
    time: '30:30 – 32:00',
    theme: 'light',
    notes: [
      'Spend 90 seconds on Apple Wallet—this proves cross-functional R&D & hardware/OS credibility.',
      'Be transparent about team ownership: development and R&D engineered the integration; you shaped the digital credential experience and onboarding/trust UX.',
      'Highlight the core UX insight: employees won’t leave plastic badges behind unless 3 trust fears are answered upfront—Express Mode (no unlock needed), 5-hour Power Reserve (dead battery), and Find My suspension (lost phone).',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">02 · Cross-Functional R&amp;D · Apple Wallet in India (2024)</p>
        <h2 class="sl-h2">Designing trust into hardware &amp; OS-level employee badges.</h2>
        <div class="sl-shots-2">
          <figure class="sl-shot">
            <img src="/assets/img/work/apple-wallet-integration/add-badge-and-card.webp" alt="4-step Apple Wallet badge activation on iPhone and Apple Watch">
            <figcaption><b>4-Step Provisioning:</b> Branded corporate badge synced seamlessly to iPhone &amp; paired Apple Watch.</figcaption>
          </figure>
          <figure class="sl-shot">
            <img src="/assets/img/work/apple-wallet-integration/features.webp" alt="Apple Wallet five trust promises">
            <figcaption><b>Trust as UX:</b> Express Mode, 5-hr Power Reserve, Find My suspension &amp; iPhone privacy answered upfront.</figcaption>
          </figure>
        </div>
      </div>`,
  },
  {
    id: 'web-scale',
    act: 'Act 03 · Web Systems & Motion',
    time: '32:00 – 33:30',
    theme: 'light',
    notes: [
      'Show how your design system scaled externally to live web platforms in 2026:',
      'Left: Spintly Global Website—now live at www.spintly.com—serving two distinct audiences (Physical Security buyers vs. OEM Technology Services) with interactive credential tabs.',
      'Right: The new OptiSpaces.ai v3 multi-page website system scaling cleanly across 6+ dedicated product pages (including Cisco Meraki video integration).',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">03 · Scalable Web Systems (2026)</p>
        <h2 class="sl-h2">Live at spintly.com—and scaling across 7 OptiSpaces.ai product pages.</h2>
        <div class="sl-shots-2">
          <figure class="sl-shot">
            <img src="/assets/img/work/spintly-global-website/credentials.webp" alt="Live spintly.com interactive credentials section">
            <figcaption><b>Spintly Global (Live · spintly.com):</b> Dual-audience IA &amp; interactive credential tabs built on reusable components.</figcaption>
          </figure>
          <figure class="sl-shot">
            <img src="/assets/img/work/optispaces-website/product-pages-grid.webp" alt="Six dedicated OptiSpaces.ai product landing pages">
            <figcaption><b>OptiSpaces.ai v3 Web System:</b> Six dedicated product pages powered by one modular layout architecture.</figcaption>
          </figure>
        </div>
      </div>`,
  },
  {
    id: 'scypher-motion',
    act: 'Act 03 · Web Systems & Motion',
    time: '33:30 – 34:30',
    theme: 'light',
    notes: [
      'Play 8 seconds of the Scypher credential-flow animation.',
      'Explain the strategic problem: buyers confused Scypher (credential layer on existing access hardware) with OptiSpaces.ai (full Spintly building suite).',
      'Replacing a dense static architecture diagram with a 6-step motion flow + side-by-side comparison table made "no rewiring, your access logic stays the same" land in 10 seconds.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">03 · Motion &amp; Enterprise Positioning · Scypher (2026)</p>
        <h2 class="sl-h2">Replacing dense B2B architecture diagrams with clear motion.</h2>
        <div class="sl-shots-2">
          <figure class="sl-shot">
            <video class="sl-video" src="/assets/video/scypher-credential-management.mp4" poster="/assets/video/scypher-credential-management.webp" muted loop playsinline autoplay></video>
            <img class="sl-print-poster" src="/assets/video/scypher-credential-management.webp" alt="Scypher credential management animation">
            <figcaption><b>6-Step Animated Flow:</b> Shows exactly what Spintly manages vs. what stays with the integrator.</figcaption>
          </figure>
          <figure class="sl-shot">
            <img src="/assets/img/work/scypher/comparison.webp" alt="OptiSpaces.ai vs Scypher comparison table">
            <figcaption><b>Instant Clarity:</b> Direct OptiSpaces.ai vs. Scypher matrix settling buyer confusion in one scan.</figcaption>
          </figure>
        </div>
      </div>`,
  },
  {
    id: 'design-eng',
    act: 'Act 03 · Design Engineering',
    time: '34:30 – 36:00',
    theme: 'dark',
    notes: [
      'THIS IS YOUR WILDCARD DIFFERENTIATOR (especially for Atlassian, Microsoft, Postman, PostHog, Adobe, Rippling, and Design Engineer loops!).',
      'Show that beyond Figma and After Effects, you code directly: you engineered your own zero-dependency Node static portfolio + 3 playable browser prototypes (Aetherbound, Hollowmere, Hearthwild) using React, Three.js, Canvas, Web Audio, and AI workflows.',
      'Connect it back to product teams: "Building real interactive state machines in code makes my handoffs tighter, my prototypes faster, and my collaboration with engineers effortless."',
    ],
    html: () => `
      <div class="sl-pad sl-pad--dark">
        <p class="sl-eyebrow">03 · Beyond Figma · Design Engineering &amp; AI Prototyping</p>
        <h2 class="sl-h2">Shipping real interactive systems in React, Three.js &amp; Web Audio.</h2>
        <div class="sl-grid-3 sl-grid-3--media">
          <figure class="sl-shot sl-shot--dark">
            <img src="/assets/img/work/aetherbound/ledger.webp" alt="Aetherbound 3D diorama RPG and Ledger HUD">
            <figcaption><b>Aetherbound:</b> 3D Three.js diorama, learn-by-doing RPG progression &amp; clean HUD architecture.</figcaption>
          </figure>
          <figure class="sl-shot sl-shot--dark">
            <img src="/assets/img/work/hollowmere/crime-scene.webp" alt="Hollowmere 3D paranormal detective game">
            <figcaption><b>Hollowmere:</b> Real-time 3D torch lighting, reactive sanity UI degradation &amp; AI-voiced suspects.</figcaption>
          </figure>
          <figure class="sl-shot sl-shot--dark">
            <img src="/assets/img/work/hearthwild/cook.webp" alt="Hearthwild gesture-based cozy cooking prototype">
            <figcaption><b>Hearthwild:</b> One-finger touch/desktop gesture micro-interactions &amp; real-time 3D plating.</figcaption>
          </figure>
        </div>
        <p class="sl-footnote sl-footnote--dark">Plus this portfolio: zero-dependency Node static generator, custom CSS view transitions, reduced-motion support &amp; automated dual-CV PDF pipeline.</p>
      </div>`,
  },
  {
    id: 'summary',
    act: 'Close',
    time: '36:00 – 36:45',
    theme: 'light',
    notes: [
      'Bring it all home cleanly in 45 seconds before opening Q&A.',
      'Reinforce the 4 pillars you bring to a high-performing product team so the interviewer leaves with a crystal-clear mental headline of you.',
    ],
    html: () => `
      <div class="sl-pad">
        <p class="sl-eyebrow">Summary · What I Bring to Your Product Team</p>
        <h2 class="sl-h2">Research-backed product thinking, design systems &amp; code execution.</h2>
        <div class="sl-grid-2">
          <div class="sl-card"><span class="sl-num">01 · Enterprise SaaS Depth</span><h3>Taming multi-module complexity</h3><p>Audit legacy workflows, benchmark category leaders, weigh tradeoffs openly, and ship clean high-density portals.</p></div>
          <div class="sl-card"><span class="sl-num">02 · Design Systems &amp; QA Velocity</span><h3>Built to accelerate engineering</h3><p>Exhaustive component matrices, explicit Lottie handoff specs, and QA-embedded iteration that removes months of rework.</p></div>
          <div class="sl-card"><span class="sl-num">03 · Motion &amp; Narrative Craft</span><h3>Making complex tech intuitive</h3><p>After Effects motion, micro-interactions, and interactive product storytelling that convert enterprise buyers and delight daily users.</p></div>
          <div class="sl-card"><span class="sl-num">04 · Design Engineering &amp; AI</span><h3>Prototyping beyond static frames</h3><p>Engineering degree + live HTML/CSS/JS, React, Three.js, and AI-assisted rapid prototyping to validate feel before build.</p></div>
        </div>
      </div>`,
  },
  {
    id: 'qa',
    act: 'Q&A',
    time: '36:45 – 45:00',
    theme: 'dark',
    notes: [
      'Leave this clean contact slide up during Q&A so your links and availability stay visible.',
      'Hit "P" on your keyboard (or Prep Kit button) anytime during rehearsal to review your 5 Staff-Designer Q&A answers, STAR stories, and CTC Pivot script.',
      'Close the interview with 2 sharp reverse-questions: (1) "What’s the hardest UX or systems bottleneck your design team is trying to solve over the next 6 months?" (2) "How closely do designers collaborate with engineers and QA here?"',
    ],
    html: (site) => `
      <div class="sl-cover sl-cover--end">
        <div class="sl-cover-top">
          <span class="sl-pill"><i class="dot"></i>Open for Questions &amp; Live Deep Dives</span>
          <span class="sl-mono">Thank you</span>
        </div>
        <div class="sl-cover-main">
          <p class="sl-eyebrow">Let’s talk</p>
          <h1 class="sl-h1">Questions, tradeoffs, or a live Figma / code walkthrough?</h1>
          <p class="sl-lead">Happy to dive deeper into any flow, component matrix, or interactive prototype.</p>
        </div>
        <div class="sl-cover-foot">
          <div class="sl-who">
            <img src="/assets/img/about/portrait-photo-560.webp" alt="Fuzail Khan" width="52" height="52">
            <div><strong>${esc(site.name)}</strong><span>${esc(site.contact.email)} · ${esc(site.url.replace(/^https?:\/\//, ''))} · 1-month notice</span></div>
          </div>
          <div class="sl-agenda-mini">
            <span>LinkedIn: linkedin.com/in/fuzail-360</span>
            <span>GitHub: github.com/Zak455</span>
          </div>
        </div>
      </div>`,
  },
];

export function deckPage({ site }) {
  const notesJson = JSON.stringify(
    SLIDES.map((s, i) => ({ n: i + 1, act: s.act, time: s.time, notes: s.notes }))
  ).replace(/</g, '\\u003c');

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <meta name="robots" content="noindex, nofollow">
  <title>${esc(site.name)} · 45-Min Portfolio Interview Deck</title>
  <link rel="icon" href="/favicon.svg" type="image/svg+xml">
  <style>
    @font-face { font-family: 'Inter'; src: url('/assets/fonts/inter-var.woff2') format('woff2'); font-weight: 100 900; font-display: swap; }
    @font-face { font-family: 'JetBrains Mono'; src: url('/assets/fonts/jetbrains-mono-400.woff2') format('woff2'); font-weight: 400; font-display: swap; }
    :root {
      --bg: #0b0d12; --surface: #141720; --ink: #0b0d12; --ink-2: #475063; --ink-3: #6b7280;
      --line: #e4e7ec; --soft: #f4f6f9; --blue: #2563eb; --blue-2: #4f8cff; --tint: #eaf1ff;
      --font: 'Inter', system-ui, -apple-system, sans-serif;
      --mono: 'JetBrains Mono', ui-monospace, monospace;
    }
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; height: 100%; background: var(--bg); color: #f3f4f6; font-family: var(--font); -webkit-font-smoothing: antialiased; }
    h1, h2, h3, p, ul, ol, figure { margin: 0; }
    ul, ol { padding: 0; list-style: none; }
    img, video { display: block; max-width: 100%; }

    /* Screen presentation shell */
    .shell { display: grid; grid-template-rows: 1fr auto; height: 100vh; overflow: hidden; }
    .stage-wrap { position: relative; display: grid; place-items: center; padding: 18px 20px 10px; min-height: 0; overflow: hidden; }
    .stage-grid { display: grid; grid-template-columns: 1fr; width: 100%; height: 100%; gap: 16px; align-items: center; justify-items: center; min-height: 0; }
    .shell.has-notes .stage-grid { grid-template-columns: minmax(0, 1fr) 360px; }

    /* Scaled 16:9 canvas (1280x720 coordinate system) */
    .viewport { position: relative; width: 100%; height: 100%; display: grid; place-items: center; min-width: 0; min-height: 0; }
    .slide {
      display: none; width: 1280px; height: 720px; border-radius: 16px; overflow: hidden;
      background: #fff; color: var(--ink); box-shadow: 0 28px 80px rgba(0,0,0,.55);
      transform-origin: center center;
    }
    .slide.is-active { display: block; }
    .slide--dark { background: #0a0c12; color: #f8fafc; }
    .sl-print-poster { display: none; }

    /* Slide typography & layout primitives (calibrated to 1280x720) */
    .sl-pad { height: 100%; padding: 42px 54px 36px; display: flex; flex-direction: column; gap: 18px; }
    .sl-pad--dark { background: radial-gradient(700px 360px at 85% -10%, rgba(79,140,255,.22), transparent 65%), #0a0c12; color: #f8fafc; }
    .sl-eyebrow { font: 700 13px/1 var(--mono); letter-spacing: .09em; text-transform: uppercase; color: var(--blue); }
    .slide--dark .sl-eyebrow { color: var(--blue-2); }
    .sl-h1 { font-size: 58px; font-weight: 800; letter-spacing: -.042em; line-height: 1.03; max-width: 18ch; }
    .sl-h2 { font-size: 36px; font-weight: 800; letter-spacing: -.034em; line-height: 1.1; }
    .sl-lead { font-size: 21px; line-height: 1.45; color: #b5bfd1; max-width: 48ch; }
    .sl-p { font-size: 18px; line-height: 1.5; color: #b5bfd1; }
    .sl-mono { font: 500 13px/1 var(--mono); color: #94a3b8; }

    /* Cover / End slides */
    .sl-cover {
      height: 100%; padding: 44px 60px; display: flex; flex-direction: column; justify-content: space-between;
      background: radial-gradient(800px 440px at 90% 5%, rgba(79,140,255,.35), transparent 65%),
                  radial-gradient(500px 320px at 10% 95%, rgba(37,99,235,.22), transparent 65%), #0a0c12;
      color: #fff;
    }
    .sl-cover-top { display: flex; justify-content: space-between; align-items: center; }
    .sl-pill { display: inline-flex; align-items: center; gap: 9px; padding: 8px 16px; border-radius: 999px; background: rgba(79,140,255,.16); border: 1px solid rgba(79,140,255,.35); font-size: 14px; font-weight: 600; color: #dbeafe; }
    .sl-pill .dot { width: 8px; height: 8px; border-radius: 50%; background: #34d399; box-shadow: 0 0 0 4px rgba(52,211,153,.25); }
    .sl-cover-main { display: grid; gap: 18px; }
    .sl-cover-foot { display: flex; justify-content: space-between; align-items: center; padding-top: 22px; border-top: 1px solid rgba(255,255,255,.12); }
    .sl-who { display: flex; align-items: center; gap: 14px; }
    .sl-who img { width: 52px; height: 52px; border-radius: 50%; object-fit: cover; object-position: 50% 22%; border: 2px solid rgba(255,255,255,.22); }
    .sl-who strong { display: block; font-size: 17px; }
    .sl-who span { font-size: 14px; color: #a7b2c6; }
    .sl-agenda-mini { display: flex; gap: 22px; font-size: 14px; color: #cbd5e1; }
    .sl-agenda-mini b { color: var(--blue-2); font-family: var(--mono); margin-right: 4px; }

    /* KPIs & Career Ladder */
    .sl-kpis { display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px; margin-top: 4px; }
    .sl-kpi { padding: 20px 22px; border-radius: 14px; background: var(--soft); border: 1px solid var(--line); }
    .sl-kpi b { display: block; font-size: 38px; font-weight: 800; letter-spacing: -.04em; color: var(--blue); line-height: 1.05; }
    .sl-kpi span { display: block; margin-top: 6px; font-size: 14px; color: var(--ink-2); line-height: 1.35; }
    .sl-ladder { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; flex: 1; align-items: stretch; }
    .sl-step { padding: 20px; border-radius: 14px; border: 1px solid var(--line); background: #fff; display: flex; flex-direction: column; gap: 8px; }
    .sl-step span { font: 500 12px/1 var(--mono); color: var(--ink-3); }
    .sl-step strong { font-size: 19px; letter-spacing: -.02em; }
    .sl-step p { font-size: 14.5px; color: var(--ink-2); line-height: 1.45; }
    .sl-step--now { background: var(--tint); border-color: #b7cdf8; }
    .sl-step--now strong { color: var(--blue); }
    .sl-footnote { font-size: 14px; color: var(--ink-3); padding-top: 8px; border-top: 1px solid var(--line); }
    .sl-footnote--dark { color: #94a3b8; border-top-color: #242936; }

    /* Split dark act openers */
    .sl-split--dark {
      height: 100%; padding: 46px 54px; display: grid; grid-template-columns: 1fr 1.08fr; gap: 40px; align-items: center;
      background: radial-gradient(640px 380px at 85% 10%, rgba(79,140,255,.25), transparent 65%), #0a0c12; color: #fff;
    }
    .sl-col { display: grid; gap: 16px; }
    .sl-bullets { display: grid; gap: 10px; margin-top: 6px; }
    .sl-bullets li { font-size: 15.5px; line-height: 1.45; color: #cbd5e1; padding-left: 16px; position: relative; }
    .sl-bullets li::before { content: ''; position: absolute; left: 0; top: 8px; width: 7px; height: 7px; border-radius: 2px; background: var(--blue-2); transform: rotate(45deg); }
    .sl-bullets b { color: #fff; }
    .sl-media-box { border-radius: 16px; overflow: hidden; border: 1px solid rgba(255,255,255,.14); box-shadow: 0 24px 60px rgba(0,0,0,.45); background: #141720; }
    .sl-media-box img, .sl-media-box video { width: 100%; height: auto; display: block; }

    /* Cards & Grids */
    .sl-compare, .sl-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; flex: 1; }
    .sl-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 18px; flex: 1; }
    .sl-card { padding: 24px 26px; border-radius: 16px; border: 1px solid var(--line); background: #fff; display: flex; flex-direction: column; gap: 12px; }
    .sl-card h3 { font-size: 21px; letter-spacing: -.02em; line-height: 1.2; }
    .sl-card p { font-size: 15.5px; line-height: 1.5; color: var(--ink-2); }
    .sl-card--muted { background: var(--soft); }
    .sl-card--accent { background: linear-gradient(150deg, var(--tint), #fff 60%); border-color: #c5d7fb; }
    .sl-card--rejected { background: #fafafa; border-style: dashed; border-color: #d6dae2; }
    .sl-card--chosen { background: linear-gradient(150deg, #ecfdf5, #fff 62%); border-color: #a7f3d0; box-shadow: 0 12px 30px -16px rgba(16,185,129,.25); }
    .sl-why { margin-top: auto; padding-top: 12px; border-top: 1px solid var(--line); font-size: 14.5px !important; }
    .sl-num { font: 700 13px/1 var(--mono); color: var(--blue); text-transform: uppercase; }
    .sl-tag { align-self: flex-start; padding: 5px 11px; border-radius: 999px; font: 700 12px/1 var(--mono); text-transform: uppercase; letter-spacing: .04em; }
    .sl-tag--warn { background: #fef3c7; color: #92400e; }
    .sl-tag--blue { background: var(--tint); color: var(--blue); }
    .sl-tag--red { background: #fee2e2; color: #991b1b; }
    .sl-tag--green { background: #d1fae5; color: #065f46; }
    .sl-tag--dark { background: #1f2430; color: #fff; }
    .sl-list { display: grid; gap: 12px; }
    .sl-list li { font-size: 15.5px; line-height: 1.48; color: var(--ink-2); padding-left: 16px; position: relative; }
    .sl-list li::before { content: ''; position: absolute; left: 0; top: 9px; width: 6px; height: 6px; border-radius: 50%; background: var(--blue); }
    .sl-list b { color: var(--ink); }

    /* Benchmark chips */
    .sl-chips-row { display: flex; flex-wrap: wrap; gap: 10px; }
    .sl-chips-row span { padding: 8px 18px; border-radius: 999px; background: var(--ink); color: #fff; font-weight: 600; font-size: 15px; }

    /* Screenshots & galleries */
    .sl-shots-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 22px; flex: 1; min-height: 0; align-items: start; }
    .sl-shot { display: flex; flex-direction: column; border-radius: 14px; overflow: hidden; border: 1px solid var(--line); background: var(--soft); height: 100%; min-height: 0; }
    .sl-shot img, .sl-shot video { width: 100%; flex: 1; min-height: 0; object-fit: contain; background: #fff; }
    .sl-shot figcaption { padding: 11px 15px; font-size: 13.5px; line-height: 1.38; color: var(--ink-2); background: #fff; border-top: 1px solid var(--line); }
    .sl-shot figcaption b { color: var(--ink); }
    .sl-shot--hero { flex: 1; min-height: 0; }
    .sl-shot--dark { background: #141720; border-color: #262c3a; }
    .sl-shot--dark img { background: #0f1219; }
    .sl-shot--dark figcaption { background: #141720; color: #cbd5e1; border-top-color: #262c3a; }
    .sl-shot--dark figcaption b { color: #fff; }

    .sl-bento-shots { display: grid; grid-template-columns: 1.45fr 1fr; gap: 18px; flex: 1; min-height: 0; }
    .sl-bento-col { display: grid; grid-template-rows: 1fr 1fr; gap: 16px; min-height: 0; }

    .sl-split-wide { display: grid; grid-template-columns: 1.35fr 1fr; gap: 22px; flex: 1; min-height: 0; }
    .sl-split-wide--img { grid-template-columns: 1.55fr 1fr; }
    .sl-decisions { display: grid; gap: 10px; align-content: center; }
    .sl-decisions li { padding: 12px 15px; border-radius: 12px; background: var(--soft); border: 1px solid var(--line); }
    .sl-decisions b { display: block; font-size: 14.5px; color: var(--ink); margin-bottom: 2px; }
    .sl-decisions span { font-size: 13.5px; color: var(--ink-2); line-height: 1.35; }
    .sl-callout-col { display: grid; gap: 16px; align-content: center; }

    /* Presenter Notes Sidebar */
    .notes-pane {
      display: none; height: 100%; max-height: calc(100vh - 88px); overflow-y: auto;
      background: var(--surface); border: 1px solid #262b38; border-radius: 16px; padding: 20px;
      flex-direction: column; gap: 14px;
    }
    .shell.has-notes .notes-pane { display: flex; }
    .notes-head { display: flex; justify-content: space-between; align-items: center; border-bottom: 1px solid #262b38; padding-bottom: 12px; }
    .notes-head b { font-size: 13px; letter-spacing: .08em; text-transform: uppercase; color: var(--blue-2); font-family: var(--mono); }
    .notes-time { font: 600 12px/1 var(--mono); padding: 4px 9px; border-radius: 999px; background: rgba(79,140,255,.15); color: #cfe0ff; }
    .notes-act { font-size: 15px; font-weight: 700; color: #fff; }
    .notes-list { display: grid; gap: 12px; }
    .notes-list li { font-size: 14px; line-height: 1.55; color: #d1d8e6; padding-left: 14px; position: relative; }
    .notes-list li::before { content: '›'; position: absolute; left: 0; color: var(--blue-2); font-weight: 700; }

    /* Bottom Control Bar */
    .bar {
      display: flex; align-items: center; justify-content: space-between; gap: 12px; flex-wrap: wrap;
      padding: 10px 20px 14px; background: #0f121a; border-top: 1px solid #222735;
    }
    .bar-grp { display: flex; align-items: center; gap: 8px; flex-wrap: wrap; }
    .b {
      display: inline-flex; align-items: center; gap: 6px; padding: 8px 13px; border-radius: 999px;
      background: #1a1f2c; border: 1px solid #2b3244; color: #e5e9f2; font: 600 13px/1 var(--font);
      text-decoration: none; cursor: pointer; transition: background .15s, border-color .15s;
    }
    .b:hover { background: #242b3d; border-color: #3f4a63; }
    .b--blue { background: var(--blue); border-color: var(--blue); color: #fff; }
    .b--blue:hover { background: #1d4fd8; }
    .b.is-on { background: rgba(79,140,255,.22); border-color: var(--blue-2); color: #dbeafe; }
    .counter { font: 600 13px/1 var(--mono); color: #94a3b8; min-width: 68px; text-align: center; }
    .prog { position: fixed; top: 0; left: 0; right: 0; height: 3px; background: rgba(255,255,255,.08); z-index: 40; }
    .prog span { display: block; height: 100%; background: var(--blue-2); transition: width .25s ease; }

    /* Interview Prep Kit Modal (P) */
    .prep-modal {
      position: fixed; inset: 0; z-index: 60; display: none; place-items: center;
      background: rgba(5,7,12,.82); backdrop-filter: blur(8px); padding: 20px;
    }
    .prep-modal.is-open { display: grid; }
    .prep-box {
      width: min(980px, 100%); max-height: 88vh; display: flex; flex-direction: column;
      background: #121620; border: 1px solid #2a3142; border-radius: 20px; overflow: hidden; color: #e5e9f2;
    }
    .prep-top { display: flex; justify-content: space-between; align-items: center; padding: 18px 24px; border-bottom: 1px solid #242a38; }
    .prep-top h2 { font-size: 19px; letter-spacing: -.02em; }
    .prep-tabs { display: flex; gap: 8px; padding: 12px 24px; border-bottom: 1px solid #242a38; flex-wrap: wrap; background: #0e111a; }
    .prep-tab { padding: 7px 14px; border-radius: 999px; border: 1px solid #2c3345; background: transparent; color: #9aa5b8; font: 600 13px var(--font); cursor: pointer; }
    .prep-tab.is-active { background: var(--blue); border-color: var(--blue); color: #fff; }
    .prep-body { padding: 22px 24px; overflow-y: auto; display: grid; gap: 14px; }
    .prep-panel { display: none; gap: 14px; }
    .prep-panel.is-active { display: grid; }
    .qa-card { padding: 16px 18px; border-radius: 14px; background: #191e2b; border: 1px solid #293145; }
    .qa-card b { display: block; color: #fff; font-size: 15px; margin-bottom: 6px; }
    .qa-card p { font-size: 14px; line-height: 1.55; color: #c5cedf; }
    .qa-card .hl-pill { display: inline-block; font: 600 11.5px var(--mono); color: #93c5fd; margin-bottom: 5px; text-transform: uppercase; }

    /* Print / 16:9 Landscape PDF Export */
    @page { size: 1280px 720px; margin: 0; }
    @media print {
      html, body { height: auto; background: #fff; }
      .bar, .notes-pane, .prog, .prep-modal { display: none !important; }
      .shell, .stage-wrap, .stage-grid, .viewport { display: block !important; height: auto !important; padding: 0 !important; overflow: visible !important; }
      .slide {
        display: block !important; width: 1280px !important; height: 720px !important;
        transform: none !important; border-radius: 0 !important; box-shadow: none !important;
        page-break-after: always; break-after: page;
      }
      .slide:last-child { page-break-after: auto; break-after: auto; }
      .sl-video { display: none !important; }
      .sl-print-poster { display: block !important; width: 100%; height: 100%; object-fit: contain; }
      * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    }
  </style>
</head>
<body>
  <div class="prog" aria-hidden="true"><span id="prog" style="width:4.76%"></span></div>
  <div class="shell has-notes" id="shell">
    <div class="stage-wrap">
      <div class="stage-grid">
        <div class="viewport" id="viewport">
          ${SLIDES.map((s, i) => `<section class="slide${s.theme === 'dark' ? ' slide--dark' : ''}${i === 0 ? ' is-active' : ''}" data-slide="${i}">${s.html(site)}</section>`).join('\n          ')}
        </div>
        <aside class="notes-pane" id="notesPane" aria-label="Presenter notes">
          <div class="notes-head">
            <b>Presenter Notes</b>
            <span class="notes-time" id="noteTime">0:00 – 1:00</span>
          </div>
          <div class="notes-act" id="noteAct">Intro</div>
          <ul class="notes-list" id="noteList"></ul>
        </aside>
      </div>
    </div>

    <nav class="bar" aria-label="Presentation controls">
      <div class="bar-grp">
        <a class="b" href="/">← Portfolio</a>
        <button class="b" id="prevBtn" type="button">← Prev</button>
        <span class="counter" id="counter">01 / ${SLIDES.length}</span>
        <button class="b" id="nextBtn" type="button">Next →</button>
      </div>
      <div class="bar-grp">
        <button class="b" id="timerBtn" type="button" title="Click to start/pause, double-click to reset">⏱ 45:00</button>
        <button class="b is-on" id="notesBtn" type="button">Notes (N)</button>
        <button class="b" id="prepBtn" type="button">Prep Kit (P)</button>
        <button class="b" id="fsBtn" type="button">Fullscreen (F)</button>
        <a class="b b--blue" href="${PDF}" download>Download 16:9 PDF</a>
      </div>
    </nav>
  </div>

  <!-- Interview Prep Kit Modal -->
  <div class="prep-modal" id="prepModal" role="dialog" aria-modal="true" aria-label="Interview Prep Kit">
    <div class="prep-box">
      <div class="prep-top">
        <h2>Interview Prep Kit · Q&amp;A, Whiteboard, STAR &amp; CTC Script</h2>
        <button class="b" id="closePrep" type="button">Close (Esc)</button>
      </div>
      <div class="prep-tabs" role="tablist">
        <button class="prep-tab is-active" data-tab="qa" type="button">5 Staff-Designer Traps</button>
        <button class="prep-tab" data-tab="wb" type="button">45-Min Whiteboard &amp; Critique</button>
        <button class="prep-tab" data-tab="star" type="button">6 Spintly STAR Stories</button>
        <button class="prep-tab" data-tab="ctc" type="button">CTC Pivot Script (₹4.2L → ₹16–26L+)</button>
      </div>
      <div class="prep-body">
        <div class="prep-panel is-active" data-panel="qa">
          <div class="qa-card"><b>1. “What was strictly YOUR decision vs. your team’s?”</b><p>Be direct: Engineering &amp; R&amp;D built the backend/hardware and leadership set business scope. I owned the legacy UX audit, 7-competitor benchmarking, the middle-ground dashboard direction, both Figma design systems (foundations, component matrices, Lottie handoff specs), and the live spintly.com IA.</p></div>
          <div class="qa-card"><b>2. “What didn’t work on the first try?”</b><p>Cite the two tabled OptiSpaces directions (heavily graphical vs. instruction-heavy technical) and how V3 mobile components went through multiple iterations directly with QA before holding up across iOS &amp; Android.</p></div>
          <div class="qa-card"><b>3. “How did you measure success without full analytics?”</b><p>Never invent % metrics. Point to real shipped signals: unifying 7 fragmented modules into one portal, shipping V3 to 100K+ Play Store installs without breaking daily unlock habits, shaving months off delivery via QA-embedded component iteration, and launching spintly.com live on a reusable system.</p></div>
          <div class="qa-card"><b>4. “When did engineering push back on your design?”</b><p>Use legacy flow / tech-stack constraints on OptiSpaces or Apple Wallet OS limits—explain how you listened first, adapted (or swapped custom coded motion for a ready-to-drop Lottie asset), and protected UX clarity while hitting launch dates.</p></div>
          <div class="qa-card"><b>5. “With 2 more sprints on OptiSpaces.ai, what would you improve?”</b><p>(1) Role-adaptive dashboards (Security Officer alerts vs. HR Attendance exceptions) and (2) keyboard range-selection &amp; bulk shortcuts on the 31-day Shift Roster for 500+ employee buildings.</p></div>
        </div>
        <div class="prep-panel" data-panel="wb">
          <div class="qa-card"><span class="hl-pill">45-Min Whiteboarding Split</span><b>5 · 5 · 10 · 15 · 10 Timing Framework</b><p><b>0–5m:</b> Clarify business goal, platform &amp; constraints → <b>5–10m:</b> Lock 1 primary persona + 2 JTBD → <b>10–20m:</b> Map user journey &amp; circle #1 pain point → <b>20–35m:</b> Sketch 2 divergent ideas, pick 1, wireframe 3–4 screens + 1 error/edge state → <b>35–45m:</b> Success metrics, accessibility &amp; V2 rollout.</p></div>
          <div class="qa-card"><span class="hl-pill">4 Practice Prompts</span><b>Drill These Timed Before Month 3</b><p>1) AI incident-triage copilot for a physical-security control room (Verkada/Honeywell). 2) Multi-site visitor check-in during corporate rush hour (Uber/Atlassian). 3) Unified role &amp; permission onboarding for a 6-module B2B SaaS suite (Rippling/Freshworks). 4) Zero-friction shift-swap &amp; overtime mobile flow (Deel/Swiggy).</p></div>
          <div class="qa-card"><span class="hl-pill">30-Min App Critique</span><b>5-Layer Critique Lens (Practice on Maps, Uber, Slack, Apple Wallet)</b><p>1) User &amp; Business Goal → 2) Information Architecture → 3) Visual Hierarchy &amp; Accessibility → 4) Interaction &amp; Motion Feedback → 5) Tradeoffs (“Why did the team make this imperfect choice?”) + 1 measurable improvement.</p></div>
        </div>
        <div class="prep-panel" data-panel="star">
          <div class="qa-card"><b>1. Handling Ambiguity (0→1):</b><p>Audited Spintly’s primitive “SaaS solutions” dashboard, benchmarked 7 global competitors, and aligned leadership on unifying 7 modules into OptiSpaces.ai.</p></div>
          <div class="qa-card"><b>2. Cross-Functional Speed:</b><p>Embedded QA directly into Spintly V3 component iterations rather than waiting for final builds—surfacing edge cases early and cutting months off release timelines.</p></div>
          <div class="qa-card"><b>3. Hard Technical Constraints:</b><p>Partnered with R&amp;D on Apple Wallet employee badges in India, translating strict NFC/BLE/OS rules into clear trust UX (Express Mode, 5-hr Power Reserve, Find My).</p></div>
          <div class="qa-card"><b>4. Influencing Leadership:</b><p>Walked leadership through why both graphical and instruction-heavy extremes would fail admins—winning buy-in for an intent-focused middle ground and company-wide design system.</p></div>
          <div class="qa-card"><b>5. Engineering Empathy:</b><p>Added explicit Lottie developer handoff cards inside Figma and built working React/Three.js prototypes so engineers ship exact interaction feel without guesswork.</p></div>
          <div class="qa-card"><b>6. High-Slope Growth:</b><p>Promoted across 4 roles in 3.5 years (Web Designer → Senior UI/UX Designer) by stepping up to lead flagship bets (V3, Apple Wallet, OptiSpaces.ai, Scypher, spintly.com).</p></div>
        </div>
        <div class="prep-panel" data-panel="ctc">
          <div class="qa-card"><span class="hl-pill">Never Anchor at ₹45–50k/mo!</span><b>Exact Recruiter Screen Pivot Script</b><p>“My current CTC is ₹4.2 LPA because I joined out of college in Goa and grew internally across 4 roles to Senior UI/UX Designer—owning a company-wide design system, a 7-module enterprise SaaS portal, a 100K+ mobile app redesign, and an Apple Wallet R&amp;D launch. I’m interviewing strictly for market-band Product Designer roles aligned with your internal band for this level (typically ₹16–26 LPA depending on scope and equity), and I can join on a 1-month notice.”</p></div>
          <div class="qa-card"><span class="hl-pill">Your 3 Real Target Bands</span><b>Know Your Numbers Before Every Call</b><p><b>Floor:</b> ₹10–12 LPA (₹80k–95k/mo · 2.5–3× current) · <b>Sweet Spot (Well-Known India Product &amp; GCCs):</b> ₹16–26 LPA (₹1.2L–1.9L/mo · 4–6× current) · <b>Stretch (Big Tech / Remote Global):</b> ₹28–45+ LPA. Lead with Band-Paying companies (Atlassian, Microsoft, Adobe, Honeywell, Cisco, Verkada, GitLab, Deel, PostHog, BrowserStack, Postman) and use your 1-month notice as a fast-track lever.</p></div>
        </div>
      </div>
    </div>
  </div>

  <script>
    const NOTES = ${notesJson};
    const slides = [...document.querySelectorAll('.slide')];
    const shell = document.getElementById('shell');
    const viewport = document.getElementById('viewport');
    const counter = document.getElementById('counter');
    const prog = document.getElementById('prog');
    const noteTime = document.getElementById('noteTime');
    const noteAct = document.getElementById('noteAct');
    const noteList = document.getElementById('noteList');
    const notesBtn = document.getElementById('notesBtn');
    const prepModal = document.getElementById('prepModal');
    let cur = 0;

    function fit() {
      const r = viewport.getBoundingClientRect();
      const s = Math.min(r.width / 1280, r.height / 720, 1);
      slides.forEach((el) => { el.style.transform = 'scale(' + s + ')'; });
    }
    function go(i) {
      cur = (i + slides.length) % slides.length;
      slides.forEach((el, idx) => el.classList.toggle('is-active', idx === cur));
      counter.textContent = String(cur + 1).padStart(2, '0') + ' / ' + slides.length;
      prog.style.width = (((cur + 1) / slides.length) * 100).toFixed(2) + '%';
      const n = NOTES[cur];
      noteTime.textContent = n.time;
      noteAct.textContent = n.act;
      noteList.innerHTML = n.notes.map((t) => '<li>' + t + '</li>').join('');
      history.replaceState(null, '', '#slide-' + (cur + 1));
    }

    document.getElementById('prevBtn').onclick = () => go(cur - 1);
    document.getElementById('nextBtn').onclick = () => go(cur + 1);
    notesBtn.onclick = () => { shell.classList.toggle('has-notes'); notesBtn.classList.toggle('is-on'); setTimeout(fit, 30); };
    document.getElementById('fsBtn').onclick = () => {
      if (!document.fullscreenElement) document.documentElement.requestFullscreen?.();
      else document.exitFullscreen?.();
    };
    document.getElementById('prepBtn').onclick = () => prepModal.classList.add('is-open');
    document.getElementById('closePrep').onclick = () => prepModal.classList.remove('is-open');
    prepModal.onclick = (e) => { if (e.target === prepModal) prepModal.classList.remove('is-open'); };

    document.querySelectorAll('.prep-tab').forEach((btn) => {
      btn.onclick = () => {
        document.querySelectorAll('.prep-tab').forEach((b) => b.classList.toggle('is-active', b === btn));
        document.querySelectorAll('.prep-panel').forEach((p) => p.classList.toggle('is-active', p.dataset.panel === btn.dataset.tab));
      };
    });

    // 45-min countdown timer
    let secs = 45 * 60, tick = null;
    const timerBtn = document.getElementById('timerBtn');
    const renderTime = () => {
      const m = String(Math.floor(secs / 60)).padStart(2, '0');
      const s = String(secs % 60).padStart(2, '0');
      timerBtn.textContent = (tick ? '⏸ ' : '⏱ ') + m + ':' + s;
    };
    timerBtn.onclick = () => {
      if (tick) { clearInterval(tick); tick = null; }
      else { tick = setInterval(() => { if (secs > 0) secs--; renderTime(); }, 1000); }
      timerBtn.classList.toggle('is-on', !!tick);
      renderTime();
    };
    timerBtn.ondblclick = () => { clearInterval(tick); tick = null; secs = 45 * 60; timerBtn.classList.remove('is-on'); renderTime(); };

    window.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') { prepModal.classList.remove('is-open'); return; }
      if (prepModal.classList.contains('is-open')) return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); go(cur + 1); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); go(cur - 1); }
      else if (e.key.toLowerCase() === 'n') notesBtn.click();
      else if (e.key.toLowerCase() === 'p') prepModal.classList.toggle('is-open');
      else if (e.key.toLowerCase() === 'f') document.getElementById('fsBtn').click();
    });
    window.addEventListener('resize', fit);
    const hashMatch = /^#slide-(\d+)$/.exec(location.hash);
    go(hashMatch ? Math.min(SLIDES.length - 1, Math.max(0, Number(hashMatch[1]) - 1)) : 0);
    fit();
  </script>
</body>
</html>`;
}
