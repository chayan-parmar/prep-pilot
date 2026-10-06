# AI Interview Prep — Complete Project Context & Memory

> **Single Source of Truth for Project Context, Architecture, Design Guidelines, and Rules.**  
> *Last Updated: September 2026*

---

## 1. Project Overview

**AI Interview OS** (AI Interview Prep) is a production-grade MERN-stack web application designed to help candidates thoroughly prepare for technical interviews. The platform combines personalized learning roadmaps, real-time AI mock interviews, resume ATS scoring and feedback, and coding challenges with instant feedback.

### Main Product Areas
1. **Landing Page:** High-conversion, Banani-designed marketing page showcasing features, process, pricing, and social proof.
2. **Authentication:** Secure Register and Login flows with JWT tokens, bcrypt password hashing, and role-based access.
3. **Dashboard:** Command center displaying user profile, interview readiness score, resume status, and quick-launch prep modules.
4. **Resume Analyzer:** ATS compatibility scoring, keyword gap analysis, AI-suggested bullet point enhancements, and PDF upload.
5. **AI Mock Interview:** Real-time conversational interview practice (Technical and HR modes), with instantaneous feedback, scoring, and transcripts.
6. **Coding Practice:** In-browser code editor with problem descriptions, test case runner, hints, and time complexity insights.
7. **Interview History & Analytics:** Detailed performance trends, past interview scores, and weak-area heatmaps.
8. **Profile:** Manage personal details, skills, target role, and uploaded resumes.
9. **Settings:** Account configuration, notification preferences, and privacy controls.

---

## 2. Technology Stack

### Frontend
- **Framework:** React 19 + Vite 8
- **Styling:** Tailwind CSS v4 (`@tailwindcss/vite`, `@theme` CSS variables)
- **Routing:** React Router v7 (`react-router-dom`)
- **State & Context:** React Context API (`AuthContext`)
- **HTTP Client:** Axios with Request Interceptor for automatic JWT injection
- **Icons:** Lucide React
- **Forms & Validation:** `react-hook-form`
- **Notifications:** `react-hot-toast`
- **Animations & Charts:** `framer-motion`, `recharts`

### Backend
- **Runtime:** Node.js (CommonJS)
- **Framework:** Express 5
- **Database:** MongoDB Atlas
- **ODM:** Mongoose 9
- **Authentication:** JSON Web Tokens (`jsonwebtoken`) & `bcryptjs` (10 rounds)
- **Environment & Security:** `dotenv`, `cors`, `express-validator`
- **File Uploads:** `multer` (configured for resume PDF/DOCX)

---

## 3. Repository Structure

```
ai interview prep app/
├── AGENTS.md                  # Instructions and memory rules for AI coding assistants
├── PROJECT_CONTEXT.md         # Master project context (this document)
├── assets/                    # Reference screenshots and design assets
├── docs/                      # Detailed specifications
│   ├── ui-ux.md               # UI/UX design system & Banani parity guide
│   ├── architecture.md        # System architecture, data flow & structure
│   ├── database.md            # MongoDB Atlas models, schemas & DNS fix
│   ├── api-specification.md   # Complete REST API specifications
│   └── security.md            # Security, secrets management & auth protocols
├── client/                    # Vite + React Frontend
│   ├── src/
│   │   ├── components/
│   │   │   ├── auth/          # SocialButtons, AuthCard
│   │   │   ├── common/        # Buttons, Inputs, Modal
│   │   │   ├── interview/     # Mock interview components
│   │   │   ├── landing/       # Navbar, HeroSection, Features, HowItWorks,
│   │   │   │                  # Pricing, Testimonials, CTA, Footer
│   │   │   ├── layouts/       # DashboardLayout, AuthLayout
│   │   │   └── ui/            # Reusable UI primitives
│   │   ├── context/
│   │   │   └── AuthContext.jsx # Authentication state & methods
│   │   ├── pages/
│   │   │   ├── landing/       # LandingPage.jsx & landingContent.js
│   │   │   ├── login/         # LoginPage.jsx
│   │   │   ├── register/      # RegisterPage.jsx
│   │   │   ├── dashboard/     # DashboardPage.jsx
│   │   │   ├── interview/     # InterviewPage.jsx (planned)
│   │   │   ├── resume/        # ResumePage.jsx (planned)
│   │   │   ├── profile/       # ProfilePage.jsx (planned)
│   │   │   └── settings/      # SettingsPage.jsx (planned)
│   │   ├── routes/
│   │   │   └── AppRoutes.jsx  # Application Route definitions
│   │   ├── services/
│   │   │   ├── api.js         # Axios instance with Bearer token interceptor
│   │   │   └── authService.js # registerUser, loginUser endpoints
│   │   ├── index.css          # Tailwind CSS tokens, fonts, root variables
│   │   ├── App.jsx            # Main App wrapper with Router & Toaster
│   │   └── main.jsx           # ReactDOM entry point
│   ├── package.json
│   └── vite.config.js
└── server/                    # Express + Node.js Backend
    ├── config/
    │   └── db.js              # MongoDB connection with DNS resolution fix
    ├── controllers/
    │   └── authController.js  # registerUser, loginUser
    ├── middleware/
    │   └── authMiddleware.js  # JWT Bearer token protection middleware
    ├── models/
    │   └── User.js            # Mongoose User model
    ├── routes/
    │   └── authRoutes.js      # /api/auth/register, /login, /profile
    ├── services/              # Business logic & AI integrations
    ├── uploads/               # Local resume upload temporary store
    ├── utils/                 # Helpers
    ├── server.js              # Express app bootstrap
    ├── package.json
    └── .env                   # Environment secrets (DO NOT COMMIT)
```

---

## 4. Backend Foundation Status

The backend foundation is **operational, connected to MongoDB Atlas, and fully tested**:
- **MongoDB Atlas Connection:** Verified and stable.
- **User Model:** Stores `name`, `email` (unique, lowercase), `password` (hashed), `role`, `profileImage`, `resume`, `targetRole`, and timestamps.
- **Registration API (`POST /api/auth/register`):** Validates input, checks for duplicate email, hashes passwords with `bcryptjs` (10 rounds), returns 7-day signed JWT and sanitized user object.
- **Login API (`POST /api/auth/login`):** Validates input, matches email, checks password with `bcrypt.compare`, returns 7-day signed JWT and user object.
- **Protected Profile Route (`GET /api/auth/profile`):** Protected by `authMiddleware.js`, decodes JWT `Bearer <token>`, fetches user without password.

### Critical Troubleshooting History: MongoDB Atlas DNS Resolution
On Windows development environments, Node.js can fail to resolve MongoDB Atlas SRV connection strings (`querySrv ECONNREFUSED`).
**Fix:** In `server/config/db.js`:
```javascript
const dns = require("dns");
dns.setServers(["1.1.1.1", "8.8.8.8"]);
```
> [!IMPORTANT]
> Always preserve this DNS fix in `server/config/db.js`. Never remove it.

### Critical Security Rule: Sensitive Credentials & Passwords
- `.env` contains the MongoDB connection string (`MONGO_URI`) and `JWT_SECRET`.
- **Never print or expose actual passwords or live secrets in documentation, chat, or commit logs.**
- Always use placeholders like `mongodb+srv://<username>:<password>@cluster0.mongodb.net/ai_interview_db`.

---

## 5. Frontend Foundation Status

- React 19 + Vite 8 setup is working.
- React Router v7 routes configured in `client/src/routes/AppRoutes.jsx`:
  - `/` → `LandingPage`
  - `/login` → `LoginPage`
  - `/register` → `RegisterPage`
  - `/dashboard` → `DashboardPage`
- Axios configured in `client/src/services/api.js` with base URL `http://localhost:5000/api` and request interceptor for `Authorization: Bearer <token>`.
- `AuthContext.jsx` manages `user`, `token`, `isAuthenticated`, `login`, `register`, `logout`.
- Toast notifications handled globally via `react-hot-toast` in `App.jsx`.

---

## 6. Landing Page & Banani Design Alignment Rules

1. **Design Reference:** The landing page design is sourced directly from a Banani export.
2. **Visual Fidelity:** The React implementation must **closely reproduce the Banani design**:
   - Exact layout, spacing, and component hierarchy
   - Typography: **Space Grotesk** for headings, **Inter** for body
   - Custom palette: Background `#0f0f1a`, Cards `#13132a`, Primary `#7c3aed`, Accent `#06b6d4`, Borders `#2a2a3d`
   - Glowing radial gradients, badge pills, glassmorphic cards, micro-animations
3. **Target Component Order:**
   1. `Navbar`
   2. `HeroSection`
   3. `Features`
   4. `HowItWorks`
   5. `Pricing`
   6. `Testimonials`
   7. `CTA`
   8. `Footer`
4. **Current Status:** Landing page components are structured, but visual alignment is still being refined.
5. **Immediate Protocol:**
   - User provides two screenshots: (1) Banani original UI, (2) Current React output.
   - Compare side-by-side.
   - Fix visual differences section by section.
   - **Do NOT proceed to new feature branches or alter login until landing page visuals match.**

---

## 7. Development & Troubleshooting Rules

- **Dependency Location:** Install frontend dependencies in `client/` and backend dependencies in `server/`. Never mix them.
- **Icon Imports:** Import only valid, existing icons from `lucide-react`. Always verify the export name to prevent React blank white-screen crashes.
- **Component Modularity:** Avoid monolithic JSX files. Use data-driven arrays (e.g. `landingContent.js`) to render repeating cards and lists.
- **Backend Integrity:** Preserve existing working backend functionality. Do not modify working endpoints unless explicitly requested.
- **Step-by-Step Isolation:** Make targeted, incremental edits with exact file paths and test steps.
