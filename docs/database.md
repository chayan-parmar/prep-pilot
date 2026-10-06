# Database Architecture & Schema Specification

> **Database Platform:** MongoDB Atlas  
> **ODM:** Mongoose 9 (Node.js)  
> **Environment:** Cloud Cluster with DNS-over-HTTPS/Cloudflare fallback resolution.

---

## 1. Connection Architecture & DNS Resolution History

### Connection Setup (`server/config/db.js`)
The connection to MongoDB Atlas utilizes `mongoose.connect()` powered by a cloud connection string defined in `server/.env`.

```javascript
const mongoose = require("mongoose");
const dns = require("dns");

// Mandatory DNS Resolution Fix for Windows/Node.js SRV records
dns.setServers(["1.1.1.1", "8.8.8.8"]);

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("✅ MongoDB Connected Successfully");
  } catch (error) {
    console.log("❌ MongoDB Connection Failed");
    console.log(error);
    process.exit(1);
  }
};

module.exports = connectDB;
```

### Critical Troubleshooting Record: SRV DNS Resolution Issue
- **Symptom:** During initial local development on Windows, Node.js failed to resolve MongoDB Atlas SRV connection strings (`mongodb+srv://...`), throwing `querySrv ECONNREFUSED` or timeout errors.
- **Root Cause:** Certain local Windows network adapters or ISP DNS resolvers block or fail recursive SRV lookups required by Atlas.
- **Solution:** Injecting public DNS resolvers (`1.1.1.1` and `8.8.8.8`) using `dns.setServers(...)` directly prior to invoking `mongoose.connect()`.
- **Permanent Rule:** **Never delete or comment out `dns.setServers(["1.1.1.1", "8.8.8.8"])`.**

> [!WARNING]
> **Credential Protection:** The MongoDB connection string contains sensitive username and password credentials. Never check in `.env` to Git, and never write the actual database password into documentation or client-side files. Always use `<password>` placeholders in public references.

---

## 2. Implemented Database Models

### User Model (`server/models/User.js`)
Represents registered candidates and administrative accounts.

```javascript
const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match: [/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i, "Please provide a valid email"],
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minlength: [6, "Password must be at least 6 characters"],
    },
    role: {
      type: String,
      enum: ["student", "admin"],
      default: "student",
    },
    profileImage: {
      type: String,
      default: "",
    },
    resume: {
      type: String,
      default: "",
    },
    targetRole: {
      type: String,
      default: "",
      trim: true,
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

module.exports = mongoose.model("user", userSchema);
```

#### Field Schema Dictionary

| Field | Type | Attributes | Description |
| :--- | :--- | :--- | :--- |
| `_id` | `ObjectId` | Auto-generated | Unique document identifier |
| `name` | `String` | Required, Trimmed | Full name of the candidate |
| `email` | `String` | Required, Unique, Lowercase | Primary login identifier |
| `password` | `String` | Required, min: 6 | Bcrypt hashed string (never plaintext) |
| `role` | `String` | Enum: `['student', 'admin']` | Access privilege level |
| `profileImage`| `String` | Default: `""` | URL to stored profile avatar |
| `resume` | `String` | Default: `""` | File path or URL to latest resume |
| `targetRole` | `String` | Default: `""` | Chosen career track (e.g. Frontend Developer) |
| `createdAt` | `Date` | Managed by Mongoose | Registration timestamp |
| `updatedAt` | `Date` | Managed by Mongoose | Last modification timestamp |

---

## 3. Planned Models for Next Product Phases

### A. Resume Analysis Model (`ResumeAnalysis.js`)
Tracks uploaded resumes, ATS scores, and AI improvement recommendations.

```javascript
const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    fileName: {
      type: String,
      required: true,
    },
    fileUrl: {
      type: String,
      required: true,
    },
    targetRole: {
      type: String,
      required: true,
    },
    atsScore: {
      type: Number,
      min: 0,
      max: 100,
      required: true,
    },
    skillsDetected: [{ type: String }],
    missingKeywords: [{ type: String }],
    suggestions: [
      {
        section: String,
        originalText: String,
        improvedText: String,
        rationale: String,
      },
    ],
    rawAiResponse: {
      type: mongoose.Schema.Types.Mixed,
    },
  },
  { timestamps: true }
);
```

### B. Mock Interview Session Model (`InterviewSession.js`)
Records conversational interview simulations, questions asked, answers given, and evaluative feedback.

```javascript
const questionItemSchema = new mongoose.Schema({
  questionText: { type: String, required: true },
  category: { type: String, enum: ["technical", "behavioral", "system-design"] },
  candidateAnswer: { type: String, default: "" },
  audioTranscript: { type: String, default: "" },
  aiScore: { type: Number, min: 0, max: 100 },
  aiFeedback: { type: String, default: "" },
  durationSeconds: { type: Number, default: 0 },
});

const interviewSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    targetRole: { type: String, required: true },
    mode: { type: String, enum: ["technical", "behavioral", "mixed"], default: "technical" },
    difficulty: { type: String, enum: ["entry", "mid", "senior"], default: "mid" },
    status: { type: String, enum: ["in_progress", "completed", "aborted"], default: "in_progress" },
    overallScore: { type: Number, min: 0, max: 100 },
    questions: [questionItemSchema],
    feedbackSummary: {
      strengths: [String],
      weaknesses: [String],
      recommendations: [String],
    },
  },
  { timestamps: true }
);
```

### C. Coding Practice Models (`CodingProblem.js` & `Submission.js`)
Houses problem challenges and user code submissions.

```javascript
const codingProblemSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true },
    difficulty: { type: String, enum: ["Easy", "Medium", "Hard"], required: true },
    category: { type: String, required: true },
    description: { type: String, required: true },
    starterCode: {
      javascript: String,
      python: String,
      java: String,
    },
    testCases: [
      {
        input: String,
        expectedOutput: String,
        isHidden: { type: Boolean, default: false },
      },
    ],
  },
  { timestamps: true }
);

const submissionSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "user", required: true, index: true },
    problemId: { type: mongoose.Schema.Types.ObjectId, ref: "CodingProblem", required: true, index: true },
    language: { type: String, required: true },
    submittedCode: { type: String, required: true },
    status: { type: String, enum: ["Accepted", "Wrong Answer", "Time Limit Exceeded", "Runtime Error"], required: true },
    runtimeMs: Number,
    testsPassed: Number,
    totalTests: Number,
  },
  { timestamps: true }
);
```

---

## 4. Indexing & Optimization Strategy

1. **User Lookups:** Fast `findOne({ email })` queries rely on a unique index automatically created on the `email` field.
2. **Compound User History Queries:**
   - On `ResumeAnalysis`: `{ userId: 1, createdAt: -1 }` ensures fast retrieval of a candidate's latest uploaded resumes.
   - On `InterviewSession`: `{ userId: 1, createdAt: -1 }` guarantees sub-millisecond retrieval of the user's past interview sessions.
3. **Password Security Projections:** When querying user records for profile display or validation, always omit the hash:
   ```javascript
   const user = await User.findById(req.user.id).select("-password");
   ```
