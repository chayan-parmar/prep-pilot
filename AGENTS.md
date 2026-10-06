# AI Agent Directives — AI Interview Prep

This repository is **AI Interview OS**, a full-stack MERN platform for AI-powered interview preparation. All AI assistants working on this codebase must strictly observe the guidelines below.

---

## 1. Master Documentation Map

Before writing or modifying code, consult the authoritative specifications in `/docs`:
- Master Context: [`PROJECT_CONTEXT.md`](file:///c:/Users/chaya/OneDrive/Desktop/ai%20interview%20prep%20app/PROJECT_CONTEXT.md)
- UI/UX & Design Tokens: [`docs/ui-ux.md`](file:///c:/Users/chaya/OneDrive/Desktop/ai%20interview%20prep%20app/docs/ui-ux.md)
- Architecture & Patterns: [`docs/architecture.md`](file:///c:/Users/chaya/OneDrive/Desktop/ai%20interview%20prep%20app/docs/architecture.md)
- Database & Schemas: [`docs/database.md`](file:///c:/Users/chaya/OneDrive/Desktop/ai%20interview%20prep%20app/docs/database.md)
- API Specifications: [`docs/api-specification.md`](file:///c:/Users/chaya/OneDrive/Desktop/ai%20interview%20prep%20app/docs/api-specification.md)
- Security & Secrets: [`docs/security.md`](file:///c:/Users/chaya/OneDrive/Desktop/ai%20interview%20prep%20app/docs/security.md)

---

## 2. Prime Directives for This Repository

### 🎯 Immediate Active Priority
- **Do NOT proceed to Login or new feature development until the Landing Page visual match with the Banani design is fully completed.**
- Work section by section:
  1. Inspect the Banani reference screenshot alongside the rendered React screenshot.
  2. Identify discrepancies in typography, paddings, color tokens, card borders, badge styles, and glowing gradients.
  3. Adjust the corresponding component in `client/src/components/landing/`.
  4. Verify the rendering in browser before proceeding to the next section.

### 🎨 UI/UX & Design Alignment (Banani Source)
- **Do not invent generic or simple layouts.** The Banani UI export is the strict source of truth.
- Headings: `font-family: 'Space Grotesk', sans-serif;`
- Body text: `font-family: 'Inter', sans-serif;`
- Maintain dark-mode aesthetic with custom design tokens:
  - Background: `#0f0f1a` / `#0b0b14`
  - Cards: `#13132a` / `#141424`
  - Primary Purple: `#7c3aed` / `#8b5cf6`
  - Accent Cyan: `#06b6d4`
  - Subtle Borders: `#2a2a3d` / `#1e1e2e`
- Always use semantic HTML, accessible aria-labels, and keep data separated into configuration objects (e.g. `landingContent.js`).

### 🔒 Security & Credentials
- **NEVER expose live database credentials, passwords, or JWT secrets in code, logs, or documentation.**
- Keep all secrets strictly inside `server/.env`.
- Use placeholders (`<username>`, `<password>`) in all examples and docs.
- Enforce JWT authentication on all protected routes using `authMiddleware.js`.
- Always hash passwords with `bcryptjs` (salt rounds: 10).

### 🛠️ Backend Stability & DNS History
- The server contains a critical DNS workaround for Windows MongoDB Atlas resolution in `server/config/db.js`:
  ```javascript
  const dns = require("dns");
  dns.setServers(["1.1.1.1", "8.8.8.8"]);
  ```
  **Never remove or alter this code without explicit instruction.**
- Preserve existing working authentication routes (`/api/auth/register`, `/api/auth/login`, `/api/auth/profile`).

### 📦 Dependency Management
- Client dependencies belong in `client/package.json` (`npm install ...` run from `client`).
- Server dependencies belong in `server/package.json` (`npm install ...` run from `server`).
- When adding icons from `lucide-react`, double-check the icon name exists to avoid React runtime crashes.

### 📝 Code Modification Protocol
When proposing or making code changes:
1. State the exact absolute or relative file path.
2. Clearly describe what is being modified, added, or replaced.
3. Keep edits atomic and explain how to test and verify the change.
