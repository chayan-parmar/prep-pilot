<div align="center">

# 🚀 PrepPilot — AI Interview OS

### Your AI-Powered Interview Preparation Command Center

[![MIT License](https://img.shields.io/badge/License-MIT-7c3aed.svg?style=for-the-badge)](LICENSE)
[![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=white)](https://react.dev)
[![Node.js](https://img.shields.io/badge/Node.js-Express_5-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/atlas)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

**PrepPilot** is a full-stack MERN application that helps candidates ace their technical interviews through AI-powered mock interviews, smart resume analysis, personalized learning roadmaps, and adaptive quizzes.

[Features](#-features) · [Tech Stack](#-tech-stack) · [Getting Started](#-getting-started) · [API Reference](#-api-reference) · [Project Structure](#-project-structure) · [Contributing](#-contributing)

</div>

---

## ✨ Features

| Module | Description | Status |
|--------|-------------|--------|
| 🏠 **Landing Page** | High-conversion marketing page with glassmorphic design, animated sections, pricing tiers, and testimonials | ✅ Live |
| 🔐 **Authentication** | Secure JWT-based register/login with bcrypt password hashing | ✅ Live |
| 📊 **Dashboard** | Command center with interview readiness score, progress charts, quick-launch modules, and activity feed | ✅ Live |
| 📄 **Resume Analyzer** | Upload PDF/DOCX resumes for ATS compatibility scoring, keyword gap analysis, and AI-suggested improvements | ✅ Live |
| 🧠 **AI Quiz Engine** | AI-generated quizzes tailored to your target role and skill level with instant feedback and explanations | ✅ Live |
| 🗺️ **Learning Roadmap** | Personalized, AI-generated study plans based on your target role, experience, and timeline | ✅ Live |
| ⚙️ **Settings** | Account configuration, profile management, and notification preferences | ✅ Live |
| 🎙️ **AI Mock Interview** | Real-time conversational interview practice with scoring and feedback | 🔜 Coming Soon |
| 💻 **Coding Practice** | In-browser code editor with problems, test runner, and complexity analysis | 🔜 Coming Soon |
| 🤖 **AI Mentor** | Personal AI mentor for career guidance and interview strategy | 🔜 Coming Soon |
| 🔍 **Job Analyzer** | Analyze job descriptions and get tailored preparation recommendations | 🔜 Coming Soon |

---

## 🛠️ Tech Stack

### Frontend
- **React 19** + **Vite 8** — Lightning-fast development and builds
- **Tailwind CSS v4** — Utility-first styling with custom design tokens
- **React Router v7** — Client-side routing with protected routes
- **Framer Motion** — Smooth animations and page transitions
- **Recharts** — Interactive data visualizations and progress charts
- **Axios** — HTTP client with JWT interceptor
- **Lucide React** — Beautiful, consistent icon library
- **React Hook Form** — Performant form handling and validation
- **React Hot Toast** — Elegant notification system

### Backend
- **Node.js** + **Express 5** — RESTful API server
- **MongoDB Atlas** + **Mongoose 9** — Cloud database with ODM
- **JWT** + **bcryptjs** — Secure authentication (10 salt rounds)
- **Multer** — File upload handling (PDF/DOCX resumes)
- **Google Generative AI** — AI-powered features (quiz generation, roadmaps, resume analysis)
- **PDF Parse** — Resume document parsing
- **Express Validator** — Request validation and sanitization

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18.x
- **npm** ≥ 9.x
- **MongoDB Atlas** account ([Create Free Cluster](https://www.mongodb.com/atlas))

### 1. Clone the repository

```bash
git clone https://github.com/chayan-parmar/prep-pilot.git
cd prep-pilot
```

### 2. Set up the Backend

```bash
cd server
npm install
```

Create a `.env` file in the `server/` directory (use `.env.example` as a template):

```env
PORT=5000
MONGO_URI=mongodb+srv://<username>:<password>@your-cluster.mongodb.net/ai-interview-prep?retryWrites=true&w=majority
JWT_SECRET=your_jwt_secret_here
OPENROUTER_API_KEY=your_openrouter_api_key_here
OPENROUTER_MODEL=liquid/lfm-2.5-2.6b:free
```

Start the backend server:

```bash
npm run dev
```

> The server runs on `http://localhost:5000`

### 3. Set up the Frontend

Open a **new terminal**:

```bash
cd client
npm install
npm run dev
```

> The client runs on `http://localhost:5173`

### 4. Open the app

Navigate to **http://localhost:5173** in your browser. 🎉

---

## 📡 API Reference

All API endpoints are prefixed with `/api`.

### Auth Routes — `/api/auth`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/register` | Register a new user | ❌ |
| `POST` | `/login` | Login and receive JWT | ❌ |
| `GET` | `/profile` | Get authenticated user profile | ✅ |

### Resume Routes — `/api/resume`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/analyze` | Upload and analyze a resume | ✅ |
| `GET` | `/history` | Get past resume analyses | ✅ |

### Quiz Routes — `/api/quiz`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/generate` | Generate AI-powered quiz | ✅ |
| `POST` | `/submit` | Submit quiz attempt | ✅ |
| `GET` | `/history` | Get quiz attempt history | ✅ |

### Roadmap Routes — `/api/roadmap`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `POST` | `/generate` | Generate personalized roadmap | ✅ |
| `GET` | `/` | Get saved roadmaps | ✅ |

### Dashboard Routes — `/api/dashboard`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `GET` | `/stats` | Get dashboard statistics | ✅ |

### Settings Routes — `/api/settings`

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| `PUT` | `/profile` | Update user profile | ✅ |
| `PUT` | `/password` | Change password | ✅ |

> **Auth ✅** = Requires `Authorization: Bearer <token>` header

---

## 📁 Project Structure

```
prep-pilot/
├── README.md
├── .gitignore
├── PROJECT_CONTEXT.md              # Master project context
├── docs/                           # Detailed specifications
│   ├── api-specification.md
│   ├── architecture.md
│   ├── database.md
│   ├── security.md
│   └── ui-ux.md
│
├── client/                         # ⚛️ React Frontend
│   ├── public/
│   ├── src/
│   │   ├── assets/                 # Images and static assets
│   │   ├── components/
│   │   │   ├── auth/               # Social login buttons
│   │   │   ├── common/             # Shared UI components
│   │   │   ├── dashboard/          # Sidebar, charts, header
│   │   │   └── landing/            # Navbar, Hero, Features, etc.
│   │   ├── context/
│   │   │   └── AuthContext.jsx     # Auth state management
│   │   ├── pages/                  # Page-level components
│   │   │   ├── landing/
│   │   │   ├── login/
│   │   │   ├── register/
│   │   │   ├── dashboard/
│   │   │   ├── quiz/
│   │   │   ├── resume/
│   │   │   ├── roadmap/
│   │   │   └── settings/
│   │   ├── routes/                 # App routing & protected routes
│   │   ├── services/               # API service layers
│   │   ├── index.css               # Global styles & design tokens
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── package.json
│   └── vite.config.js
│
└── server/                         # 🟢 Express Backend
    ├── config/
    │   └── db.js                   # MongoDB connection + DNS fix
    ├── controllers/                # Request handlers
    ├── middleware/
    │   └── authMiddleware.js       # JWT verification
    ├── models/                     # Mongoose schemas
    │   ├── User.js
    │   ├── QuizAttempt.js
    │   ├── ResumeAnalysis.js
    │   └── Roadmap.js
    ├── routes/                     # Express route definitions
    ├── services/                   # Business logic & AI integrations
    ├── .env.example                # Environment variable template
    ├── server.js                   # App entry point
    └── package.json
```

---

## 🎨 Design System

PrepPilot uses a custom dark-mode-first design system:

| Token | Value | Usage |
|-------|-------|-------|
| Background | `#0f0f1a` | Page backgrounds |
| Card Surface | `#13132a` | Cards and panels |
| Primary Purple | `#7c3aed` | CTA buttons, highlights |
| Accent Cyan | `#06b6d4` | Secondary accents, links |
| Subtle Border | `#2a2a3d` | Card borders, dividers |
| Heading Font | Space Grotesk | All headings |
| Body Font | Inter | Body text, labels |

---

## 🔒 Security

- All passwords hashed with **bcryptjs** (10 salt rounds)
- **JWT tokens** for stateless authentication (7-day expiry)
- Protected routes enforce `Authorization: Bearer <token>` headers
- `.env` files are **never committed** — use `.env.example` as a template
- CORS enabled for cross-origin requests
- Input validation via **express-validator**

---

## 🤝 Contributing

Contributions are welcome! Here's how to get started:

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature/amazing-feature`
3. **Commit** your changes: `git commit -m "Add amazing feature"`
4. **Push** to the branch: `git push origin feature/amazing-feature`
5. **Open** a Pull Request

### Development Guidelines
- Install frontend dependencies in `client/`, backend dependencies in `server/`
- Verify `lucide-react` icon names before importing to avoid blank-screen crashes
- Keep components modular — use data-driven arrays for repeating elements
- Never modify the DNS fix in `server/config/db.js`

---

## 📄 License

This project is licensed under the **MIT License** — see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ by [Chayan Parmar](https://github.com/chayan-parmar)**

⭐ Star this repo if you find it useful!

</div>
