# UI/UX Design System & Banani Parity Specification

> **Platform:** AI Interview OS (AI Interview Prep)  
> **Document Purpose:** Detailed design tokens, visual aesthetics, component architecture, and the visual parity protocol for the Banani UI reference.

---

## 1. Design Vision & Aesthetics

AI Interview OS is designed to convey **cutting-edge intelligence, professionalism, and high-performance craft**. The user interface rejects generic templates in favor of a sleek, dark-mode glassmorphic aesthetic inspired by next-generation developer platforms like Linear, Raycast, and Vercel.

### Core Visual Principles
1. **Curated Dark Theme:** Deep obsidian backgrounds (`#0f0f1a`, `#0b0b14`) paired with rich indigo/violet cards (`#13132a`, `#141424`) to eliminate visual fatigue and accentuate content.
2. **Luminous Accents:** Dual-tone primary lighting using Electric Violet (`#7c3aed` / `#8b5cf6`) and Cyan Glow (`#06b6d4`), deployed via blurred radial gradients and subtle border highlights.
3. **Glassmorphism & Depth:** Translucent cards featuring backdrop blurs (`backdrop-blur-md`), 1px semi-transparent borders (`border-[#2a2a3d]`), and multi-layered shadows.
4. **Distinctive Typography:** Technical, futuristic headings set in **Space Grotesk**, balanced with ultra-readable body text set in **Inter**.
5. **Micro-Interactions & Feedback:** Polished hover transforms, glowing borders, animated skeleton loaders, and interactive state indicators.

---

## 2. Design Tokens & Theme Setup

The client utilizes **Tailwind CSS v4** with CSS variables defined in `client/src/index.css`:

### Color Palette

| Token | CSS Variable / Hex | Usage / Visual Role |
| :--- | :--- | :--- |
| **Canvas Background** | `--background: #0f0f1a` / `#0b0b14` | Primary viewport background |
| **Card Background** | `--card: #13132a` / `#141424` | Elevates cards, panels, and modals |
| **Foreground Text** | `--foreground: #e8e8f0` | Primary reading text (high contrast) |
| **Muted Text** | `--muted-foreground: #6b6b8a` | Secondary descriptions, subheadings, timestamps |
| **Subtle Text** | `#52526b` / `#8e8ea8` | Input placeholders, helper captions, tertiary labels |
| **Border / Stroke** | `--border: #2a2a3d` / `#1e1e2e` | 1px clean separators and card borders |
| **Primary Accent** | `--primary: #7c3aed` / `#8b5cf6` | Primary action buttons, badges, active tabs |
| **Primary Glow** | `rgba(124, 58, 237, 0.25)` | Drop shadows and radiant radial halos |
| **Secondary Accent**| `--accent: #06b6d4` | Highlighted keywords, metrics, active states |
| **Success** | `--success: #10b981` | Positive ATS score, passed tests, ready status |
| **Warning** | `--warning: #f59e0b` | Moderate scores, recommendations, tips |
| **Danger / Error** | `--danger: #ef4444` | Form validation errors, failed test cases |

### Typography

```css
@import url("https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&family=Space+Grotesk:wght@500;600;700&display=swap");

:root {
  --font-headings: "Space Grotesk", sans-serif;
  --font-body: "Inter", sans-serif;
}
```

- **Headings (`Space Grotesk`):** Display sizes (Hero: `text-4xl` to `text-6xl`, Section Titles: `text-3xl`, Card Titles: `text-lg` to `text-xl`). Tracking tight (`tracking-tight`), semi-bold to bold.
- **Body & Controls (`Inter`):** Body paragraphs (`text-sm` to `text-base`, `leading-relaxed`), buttons (`text-sm`, `font-medium`), and tags/badges (`text-xs`).

---

## 3. Banani Design Parity & Section Architecture

The landing page must faithfully reproduce the Banani UI export. All components reside in `client/src/components/landing/` and assemble in `client/src/pages/landing/LandingPage.jsx`.

### Target Section Order
```
Navbar ➔ HeroSection ➔ Features ➔ HowItWorks ➔ Pricing ➔ Testimonials ➔ CTA ➔ Footer
```

### Component Details

#### 1. Navbar (`Navbar.jsx`)
- **Structure:** Sticky header with `backdrop-blur-md` and semi-transparent dark background (`#0f0f1a/80`).
- **Brand Identity:** Rounded square logo badge containing `"AI"` with purple background and shadow, followed by `"AI Interview OS"`.
- **Navigation Links:** Features, How It Works, Pricing, Resources with smooth anchor scrolling and subtle hover states.
- **Actions:** `"Sign In"` (ghost button) and `"Get Started Free"` (solid purple pill button linking to `/register`).

#### 2. Hero Section (`HeroSection.jsx`)
- **Eyebrow:** Pill badge (`"AI-Powered Interview Preparation"`) with subtle purple border and glowing dot.
- **Headline:** Bold multi-line title with high-contrast gradient text: `"Crack Interviews with the Power of AI"`.
- **Description:** Clean, centered paragraph explaining the value proposition.
- **Action Buttons:**
  - Primary CTA: `"Get Started Free"` with arrow icon and purple glow.
  - Secondary CTA: `"Watch Demo"` with play icon and translucent border.
- **Stats Bar:** 4-column metric counter (`10K+ Active Users`, `50K+ Mock Interviews`, `95% Satisfaction`, `4.9/5 Rating`).
- **Interactive Preview Mockup:**
  - Glass card simulating the live Interview Analysis interface.
  - Skill breakdown meters: Technical Skills (92%), Communication (78%), Problem Solving (85%).
  - Floating pill tags: `"72% Ready"`, `"145 Problems Solved"`, `"Mock Interview Ready"`.

#### 3. Features Section (`Features.jsx` & `FeatureCard.jsx`)
- **Header:** Eyebrow `"Powerful Features"`, H2 `"Everything You Need to Succeed"`, and explanatory subtext.
- **Grid Layout:** 3-column responsive card grid (2-column on tablet, 1-column on mobile).
- **Cards:**
  - Resume Analyzer (ATS score, skill gaps)
  - Personalized Roadmap (Target-role tailored tracks)
  - AI Mock Interview (Real-time feedback on answers & tone)
  - Coding Practice (Real-time code evaluation)
  - AI Mentor (24/7 conversational coaching)
  - Progress Analytics (Score trends, heatmaps, streaks)
- **Styling:** Dynamic icon containers with colored translucent backgrounds matching their thematic accent color.

#### 4. How It Works (`HowItWorks.jsx` & `HowItWorksStep.jsx`)
- **Step Flow:** 4 sequential stages:
  1. `01` - Upload Resume
  2. `02` - AI Analysis & Roadmap
  3. `03` - Practice & Learn
  4. `04` - Get Hired
- **Visuals:** Circular badge numbers with border rings, connecting gradient lines indicating progression.

#### 5. Pricing Section (`Pricing.jsx` & `PricingCard.jsx`)
- **Tiers:**
  - **Starter ($0/mo):** 5 mock interviews/mo, basic resume analysis, 10 coding problems.
  - **Pro ($19/mo - FEATURED):** Unlimited mock interviews, full AI mentor, full roadmap, unlimited coding, priority analytics. Highlighted with purple glow border, "Popular" tag, and filled button.
  - **Teams ($49/mo):** Everything in Pro plus cohort dashboard, admin controls, custom branding.
- **Feature Lists:** Bullet items with custom checkmark icons and transparent divider lines.

#### 6. Testimonials Section (`Testimonials.jsx` & `TestimonialCard.jsx`)
- **Quotes:** Real engineer testimonials with 5-star rating arrays (`#f59e0b`).
- **Author Identity:** Name, current role, and company badge (e.g. "Software Engineer @ Google").
- **Card Framing:** Dark card with soft top-left purple rim lighting.

#### 7. Call To Action (`CTA.jsx`)
- **Container:** High-impact banner card with dual radial glow backdrops (`#7c3aed` and `#06b6d4`).
- **Content:** Compelling headline, social proof text, and immediate registration action button.

#### 8. Footer (`Footer.jsx`)
- **Branding:** Logo and mission tagline.
- **Navigation:** Legal links (Privacy Policy, Terms of Service), Contact, Social links.
- **Copyright:** Clear attribution and copyright notice.

---

## 4. Visual Parity Verification Protocol

To achieve 100% fidelity to the Banani reference design, execute the following protocol:

```
+-------------------------------------------------------------+
| Step 1: Capture Banani UI Reference Screenshot              |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| Step 2: Capture Live React Rendered Screenshot              |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| Step 3: Run Section-by-Section Visual Diff                  |
| - Typography (Font sizes, line heights, weights)            |
| - Color Tokens (Background darkness, border contrast)       |
| - Layout & Spacing (Margins, paddings, column gaps)         |
| - Details (Corner radius, badge pills, glow gradients)      |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| Step 4: Apply Atomic CSS / Component Fixes                  |
+-------------------------------------------------------------+
                              |
                              v
+-------------------------------------------------------------+
| Step 5: Verify in Browser Before Moving to Next Section     |
+-------------------------------------------------------------+
```

> [!IMPORTANT]
> **Active Rule:** Do not proceed to login/registration modifications or new feature flows until the landing page matches the Banani design reference.

---

## 5. Specifications for Future Application Views

### Dashboard (`/dashboard`)
- **Top Navigation:** Sticky bar with user avatar, greeting, notification bell, and sign-out button.
- **Metric Cards:** 4 summary widgets (Readiness Index %, Resumes Analyzed, Interviews Completed, Coding Streak).
- **Target Role Progress:** Roadmap progression timeline showing current module and next recommended challenge.
- **Quick Action Triggers:** "Start Mock Interview" and "Upload Resume for ATS Check".

### Resume Analyzer (`/resume`)
- **Upload Zone:** Drag-and-drop zone with animated upload indicator supporting `.pdf` and `.docx` (Max 5MB).
- **ATS Gauge:** Circular SVG gauge showing 0-100 score with color transition (Red < 60, Yellow 60-80, Green > 80).
- **Analysis Tabs:**
  - *Matched Keywords:* Green pill tags with frequency.
  - *Missing Critical Keywords:* Red pill tags with one-click copy.
  - *Bullet Point Enhancements:* Side-by-side comparison ("Before" vs AI "Recommended Action-Oriented Phrasing").

### AI Mock Interview Room (`/interview`)
- **Dual Display:** Left panel for AI Interviewer avatar/voice waveforms, Right panel for candidate camera/audio preview.
- **Question HUD:** Clean card displaying the current question, category tag (e.g. System Design, Behavioral), and timer.
- **Speech-to-Text Live Transcript:** Real-time answer transcription with mic mute/unmute control.
- **Instant Debrief:** On completion, generate categorized scorecards for Technical Correctness, Delivery Tone, and Structure (STAR method).

### Coding Practice Sandbox (`/coding`)
- **Split-Screen Interface:** Left 40% problem statement, test cases, and constraints; Right 60% code editor with syntax highlighting.
- **Control Bar:** Language selector (`JavaScript`, `Python`, `Java`, `C++`), Theme selector, "Run Tests" and "Submit Code".
- **Results Drawer:** Collapsible bottom drawer showing test suite output (Passed/Failed test cases, runtime, memory, AI hints).
