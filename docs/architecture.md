# System Architecture Specification

> **Platform:** AI Interview OS  
> **Architecture Pattern:** Decoupled Modern MERN (MongoDB Atlas, Express, React, Node.js) with Modular AI Service Integration.

---

## 1. High-Level Architecture Overview

```
                                  +---------------------------------------+
                                  |            CLIENT (SPA)               |
                                  |  React 19 + Vite + Tailwind CSS v4    |
                                  +---------------------------------------+
                                           |                      ^
                             HTTP / JSON   |                      |  JSON / SSE
                             Bearer JWT    v                      |
                                  +---------------------------------------+
                                  |            SERVER (API)               |
                                  |      Node.js + Express 5 Core         |
                                  +---------------------------------------+
                                  /            |             \           \
                                 /             |              \           \
                                v              v               v           v
                     +--------------+   +--------------+   +---------+  +-------------+
                     | MongoDB      |   | LLM / AI     |   | Multer  |  | Code        |
                     | Atlas        |   | Engine       |   | Storage |  | Execution   |
                     | Database     |   | (Gemini/GPT) |   | (Upload)|  | Sandbox     |
                     +--------------+   +--------------+   +---------+  +-------------+
```

### Architectural Tenets
1. **Decoupled Client & Server:** Frontend and Backend run as independent services communicating solely via structured RESTful JSON APIs and token authentication.
2. **Stateless API:** The Express backend maintains zero in-memory session state; every protected request is authorized via self-contained, signed JSON Web Tokens (JWT).
3. **Layered Separation of Concerns:**
   - **Routes Layer:** URL mapping, HTTP method routing, and middleware injection.
   - **Controllers Layer:** Request parsing, validation, orchestration, and response shaping.
   - **Services Layer:** Heavy business logic, AI prompt formatting, resume parsing, and external API calls.
   - **Models Layer:** Mongoose schemas, document lifecycle hooks, and database queries.
4. **Resilient Network Config:** Built-in DNS fallback for cloud database clusters.

---

## 2. Frontend Architecture (Client)

### Technology Stack
- **Framework:** React 19 (Functional components with Hooks)
- **Bundler & Dev Server:** Vite 8
- **Styling:** Tailwind CSS v4 with `@tailwindcss/vite` and CSS custom properties
- **Routing:** React Router v7 (`BrowserRouter`, `Routes`, `Route`, `Navigate`)
- **Global State:** React Context API (`AuthContext`)
- **HTTP Transport:** Axios client with pre-configured interceptors

### Client Component Hierarchy

```
<App>
  └── <AuthProvider>                  # Global Auth State & Token Lifecycle
        └── <BrowserRouter>
              ├── <Toaster />         # Global Notification Portal
              └── <AppRoutes>
                    ├── Route: "/"          ──> <LandingPage />
                    │                             ├── <Navbar />
                    │                             ├── <HeroSection />
                    │                             ├── <Features />
                    │                             ├── <HowItWorks />
                    │                             ├── <Pricing />
                    │                             ├── <Testimonials />
                    │                             ├── <CTA />
                    │                             └── <Footer />
                    ├── Route: "/login"     ──> <LoginPage />
                    ├── Route: "/register"  ──> <RegisterPage />
                    └── Route: "/dashboard" ──> <DashboardPage /> (Protected)
```

### State Management & Lifecycle

```
[ User Action: Login / Register ]
               │
               ▼
[ AuthContext: Calls API Service ]
               │
               ▼
[ API Success: Token + User Received ]
               │
       ┌───────┴───────────────────────┐
       ▼                               ▼
[ Store in localStorage ]     [ Update Context State ]
   ("token" = <JWT>)           (user = {...}, isAuth = true)
       │                               │
       └───────────────┬───────────────┘
                       ▼
         [ Re-render Protected Routes ]
         [ Axios Interceptor injects   ]
         [ Authorization: Bearer <JWT> ]
```

#### Axios Request Interceptor (`client/src/services/api.js`)
All outgoing HTTP requests from the client pass through an automatic interceptor:
```javascript
API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);
```

---

## 3. Backend Architecture (Server)

### Technology Stack
- **Runtime:** Node.js (CommonJS module system)
- **Framework:** Express 5
- **Database ODM:** Mongoose 9
- **Security:** `bcryptjs`, `jsonwebtoken`, `cors`, `dotenv`
- **File Uploads:** `multer`

### Layered Architecture

```
server/
├── config/
│   └── db.js            # Mongoose connection & DNS resolution
├── controllers/
│   ├── authController.js# Registration, Login, Profile controllers
│   ├── resumeController.js (planned)
│   └── interviewController.js (planned)
├── middleware/
│   ├── authMiddleware.js# Bearer token validation & req.user injection
│   └── errorMiddleware.js# Centralized error handler
├── models/
│   ├── User.js          # Core user model
│   ├── Resume.js        (planned)
│   └── Interview.js     (planned)
├── routes/
│   ├── authRoutes.js    # /api/auth routes
│   ├── resumeRoutes.js  (planned)
│   └── interviewRoutes.js (planned)
├── services/            # AI & Business logic abstraction
├── uploads/             # Temporary file storage for resume parsing
└── server.js            # Express server entry point
```

### Request Pipeline Flow

```
Incoming HTTP Request
         │
         ▼
[ CORS Middleware ] ──────────────► Validate allowed origins
         │
         ▼
[ Express.json() Body Parser ] ───► Parse JSON payloads (max limit configured)
         │
         ▼
[ Route Matcher ] ────────────────► E.g., /api/auth/profile
         │
         ▼
[ Auth Middleware (protect) ] ────► Extract Bearer token, jwt.verify(), inject req.user
         │
         ▼
[ Controller Execution ] ─────────► Execute query, business logic
         │
         ▼
[ JSON Response Formatter ] ──────► Return standardized { success, message, data }
```

---

## 4. Key End-to-End Data Flows

### A. Authentication & Session Initialization
1. Candidate submits credentials via `LoginPage` or `RegisterPage`.
2. Form fields are validated client-side via `react-hook-form`.
3. `authService.js` transmits `POST /api/auth/login` or `/register` to Express.
4. `authController.js` validates fields, checks MongoDB for duplicate/existing user, and verifies password using `bcrypt.compare`.
5. Upon verification, the server generates a signed JWT payload `{ id, email }` with a 7-day expiration (`expiresIn: "7d"`).
6. Client stores the token in `localStorage`, updates `AuthContext`, shows success toast, and routes the user to `/dashboard`.

### B. AI Resume Analysis Flow (Planned)
1. Candidate uploads resume (`.pdf`/`.docx`) on `/resume`.
2. Client sends multipart form data via Axios to `POST /api/resume/upload`.
3. Server `multer` middleware validates MIME type and file size (< 5MB) and temporarily buffers the file.
4. `resumeParserService` extracts raw text and feeds it into the AI prompt template.
5. AI model analyzes the resume against the target role:
   - Calculates ATS match score (0-100).
   - Extracts detected technical and soft skills.
   - Identifies critical missing keywords.
   - Generates bullet-point rewrite recommendations.
6. Result is persisted in the `ResumeAnalysis` MongoDB collection and returned to the client for interactive visualization.

### C. AI Mock Interview Flow (Planned)
1. Candidate selects target role, difficulty, and interview mode (Technical vs. Behavioral).
2. Client triggers `POST /api/interview/start`; server initializes an `InterviewSession` document and generates the opening question.
3. Candidate records audio/text answer in the browser interface.
4. Answer is transmitted to `POST /api/interview/:id/answer`.
5. AI evaluates:
   - Answer accuracy and depth
   - Structure (STAR methodology for behavioral)
   - Clarity and confidence
6. Server saves the step transcript and returns the next dynamic follow-up question.
7. Upon completion, a comprehensive debrief scorecard is calculated and archived in MongoDB.

---

## 5. Deployment & Infrastructure Strategy

| Component | Target Hosting Platform | Strategy |
| :--- | :--- | :--- |
| **Frontend Client** | Vercel / Netlify | Continuous deployment from Git; static SPA hosting with rewrite rules for client routing (`_redirects` / `vercel.json`). |
| **Backend API** | Render / Railway / AWS ECS | Containerized Node.js service with environment secret injection and automatic restart policies. |
| **Database** | MongoDB Atlas | Managed M3/Shared cluster with IP access lists and encrypted storage. |
| **File Storage** | AWS S3 / Cloudinary | Secure, signed object storage for uploaded resumes and candidate avatars. |
