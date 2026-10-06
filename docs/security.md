# Security Architecture & Protocols

> **Platform:** AI Interview OS  
> **Security Objective:** Protecting candidate data, securing AI interactions, safeguarding database credentials, and enforcing strict authentication boundaries.

---

## 1. Secrets Management & Credential Protection

### The Zero-Exposure Credential Policy
MongoDB Atlas credentials and JWT signing keys represent the keys to the kingdom.

> [!CAUTION]
> **Strict Policy:**
> 1. **NEVER** hardcode or commit actual MongoDB connection strings, usernames, or passwords in Git or code repositories.
> 2. **NEVER** expose live database credentials in documentation, markdown files, PR summaries, or agent conversations.
> 3. Always use `.env` files locally and environment secrets managers in cloud environments.
> 4. In all documentation, examples, and logs, replace real credentials with placeholders:
>    `mongodb+srv://<db_username>:<db_password>@cluster0.mongodb.net/ai_interview_db`

### `.gitignore` Enforcement
Verify that both root and subfolders explicitly ignore secret artifacts:
```gitignore
# Environment files
.env
.env.local
.env.production

# Dependencies
node_modules/

# Build artifacts & temp files
dist/
uploads/*
!uploads/.gitkeep
```

---

## 2. Authentication & Authorization Protocols

### A. Password Security (Bcrypt Hashing)
- **Algorithm:** `bcryptjs` with a work factor of **10 salt rounds**.
- Plaintext passwords are never persisted to MongoDB under any circumstances.
- **Hashing on Registration (`server/controllers/authController.js`):**
  ```javascript
  const hashedPassword = await bcrypt.hash(password, 10);
  ```
- **Comparison on Login:**
  ```javascript
  const isMatch = await bcrypt.compare(password, user.password);
  ```

### B. JSON Web Tokens (JWT)
- **Signature Algorithm:** HMAC SHA256 (`HS256`).
- **Signing Secret:** Stored in `process.env.JWT_SECRET`.
- **Payload:** Minimal claims to avoid payload leakage:
  ```json
  {
    "id": "65f2a1b9c8d3e4f5a6b7c8d9",
    "email": "arjun@example.com"
  }
  ```
- **Expiration:** Configured for `7d` (7 days).
- **Client Storage:** Currently persisted in client `localStorage` and injected via Axios request interceptor `Authorization: Bearer <token>`.
  > *Future Production Recommendation:* Migrate refresh tokens to `httpOnly`, `Secure`, `SameSite=Strict` cookies to mitigate XSS-based token theft.

### C. Server-Side Route Protection (`server/middleware/authMiddleware.js`)
- Protects private endpoints (`/api/auth/profile`, `/api/interview/*`, `/api/resume/*`).
- Validates the presence of the `Bearer` prefix.
- Verifies the signature and expiration using `jwt.verify()`.
- Attaches the decoded user identity (`req.user`) to the Express request object for downstream controllers.

```javascript
const protect = (req, res, next) => {
  try {
    let token;
    if (req.headers.authorization && req.headers.authorization.startsWith("Bearer")) {
      token = req.headers.authorization.split(" ")[1];
    }
    if (!token) {
      return res.status(401).json({ success: false, message: "Not Authorized" });
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ success: false, message: "Invalid Token" });
  }
};
```

---

## 3. Input Validation & Injection Mitigation

### A. NoSQL Injection Prevention
- MongoDB queries use typed Mongoose schema definitions.
- Avoid passing raw user input objects directly into MongoDB query operators (e.g. `{ $gt: "" }`).
- All queries explicitly query known schema properties (`User.findOne({ email })`).

### B. Cross-Site Scripting (XSS) Prevention
- React automatically escapes strings rendered in JSX templates.
- Avoid using `dangerouslySetInnerHTML` for candidate resumes or AI transcripts unless run through a DOM sanitizer such as `DOMPurify`.
- User input is trimmed and validated before database persistence.

### C. Input Validation (`express-validator` & `react-hook-form`)
- **Client-Side:** `react-hook-form` validates email regex format and minimum 6-character passwords before dispatching requests.
- **Server-Side:** Controller guards check that mandatory fields are present and reject unvalidated bodies with `400 Bad Request`.

---

## 4. File Upload Security (Resume Analyzer)

When handling candidate resume documents, the following security guardrails apply:

1. **File Type Restriction:** Only allow `.pdf` and `.docx` formats. Reject executable files, shell scripts, or archive formats (`.exe`, `.sh`, `.zip`, `.js`).
   ```javascript
   const fileFilter = (req, file, cb) => {
     const allowedMimeTypes = [
       "application/pdf",
       "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
     ];
     if (allowedMimeTypes.includes(file.mimetype)) {
       cb(null, true);
     } else {
       cb(new Error("Invalid file type. Only PDF and DOCX documents are allowed."), false);
     }
   };
   ```
2. **File Size Limits:** Cap resume uploads at **5MB** to prevent server buffer exhaustion and Denial-of-Service attacks:
   ```javascript
   const upload = multer({
     storage,
     limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
     fileFilter,
   });
   ```
3. **Randomized File Names:** Never save uploaded files using the user's raw client filename to prevent directory traversal (`../../etc/passwd`). Generate random UUIDs:
   ```javascript
   const filename = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}.pdf`;
   ```

---

## 5. Network & API Security

### A. CORS Configuration
In development, CORS is configured to accept localhost requests. In production, lock down allowed origins to the specific deployed client domain:
```javascript
const corsOptions = {
  origin: process.env.NODE_ENV === "production" 
    ? ["https://ai-interview-os.vercel.app"] 
    : ["http://localhost:5173", "http://localhost:3000"],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
};
app.use(cors(corsOptions));
```

### B. Rate Limiting (Brute-Force Defense)
To prevent brute-force credential stuffing on `/api/auth/login` and `/api/auth/register`, integrate `express-rate-limit`:
```javascript
const rateLimit = require("express-rate-limit");

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 login/register requests per windowMs
  message: {
    success: false,
    message: "Too many authentication attempts from this IP. Please try again after 15 minutes.",
  },
});

app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
```

### C. Security HTTP Headers
In production, attach `helmet` middleware to enforce secure HTTP response headers (disabling `X-Powered-By`, setting `X-Content-Type-Options: nosniff`, and enforcing strict framing protections).
