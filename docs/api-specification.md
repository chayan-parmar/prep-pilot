# REST API Specification

> **Base URL:** `http://localhost:5000/api`  
> **Protocol:** HTTP/1.1 with JSON Payloads (`Content-Type: application/json`)  
> **Authentication:** Bearer Token via HTTP `Authorization` Header (`Bearer <JWT>`)

---

## 1. Global Standards & Conventions

### Standard Success Response Format
```json
{
  "success": true,
  "message": "Human-readable status description",
  "data": { ... } // Optional object or array
}
```

### Standard Error Response Format
```json
{
  "success": false,
  "message": "Descriptive error message"
}
```

### HTTP Status Code Mapping
- `200 OK`: Request succeeded.
- `201 Created`: Resource successfully created (e.g., registration).
- `400 Bad Request`: Missing mandatory parameters or invalid input format.
- `401 Unauthorized`: Missing, expired, or invalid JWT token.
- `403 Forbidden`: Authenticated user lacks required permissions.
- `404 Not Found`: Target resource not found.
- `500 Internal Server Error`: Unhandled exception or database failure.

---

## 2. Authentication Endpoints (Implemented)

### 2.1 Register User
Registers a new candidate account, hashes the password, creates a MongoDB user document, and issues a 7-day JWT.

- **URL:** `/auth/register`
- **Method:** `POST`
- **Auth Required:** No
- **Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "name": "Arjun Sharma",
  "email": "arjun@example.com",
  "password": "Password123!",
  "targetRole": "Frontend Developer"
}
```

#### Responses
- **201 Created**
  ```json
  {
    "success": true,
    "message": "User Registered Successfully",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65f2a1b9c8d3e4f5a6b7c8d9",
      "name": "Arjun Sharma",
      "email": "arjun@example.com",
      "targetRole": "Frontend Developer"
    }
  }
  ```
- **400 Bad Request** (Missing Fields)
  ```json
  {
    "success": false,
    "message": "Please fill all fields"
  }
  ```
- **400 Bad Request** (User Already Exists)
  ```json
  {
    "success": false,
    "message": "User already exists"
  }
  ```
- **500 Internal Server Error**
  ```json
  {
    "success": false,
    "message": "Error details..."
  }
  ```

---

### 2.2 Login User
Authenticates candidate credentials and returns a JWT access token.

- **URL:** `/auth/login`
- **Method:** `POST`
- **Auth Required:** No
- **Headers:** `Content-Type: application/json`

#### Request Body
```json
{
  "email": "arjun@example.com",
  "password": "Password123!"
}
```

#### Responses
- **200 OK**
  ```json
  {
    "success": true,
    "message": "Login Successful",
    "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "user": {
      "id": "65f2a1b9c8d3e4f5a6b7c8d9",
      "name": "Arjun Sharma",
      "email": "arjun@example.com",
      "targetRole": "Frontend Developer"
    }
  }
  ```
- **400 Bad Request** (Missing Credentials)
  ```json
  {
    "success": false,
    "message": "Please provide email and password"
  }
  ```
- **400 Bad Request** (User Not Found)
  ```json
  {
    "success": false,
    "message": "User not found"
  }
  ```
- **400 Bad Request** (Invalid Password)
  ```json
  {
    "success": false,
    "message": "Invalid password"
  }
  ```

---

### 2.3 Get Current User Profile
Retrieves the logged-in candidate's profile data excluding their hashed password.

- **URL:** `/auth/profile`
- **Method:** `GET`
- **Auth Required:** Yes
- **Headers:** 
  - `Authorization: Bearer <JWT>`

#### Responses
- **200 OK**
  ```json
  {
    "success": true,
    "message": "Welcome to your profile",
    "user": {
      "_id": "65f2a1b9c8d3e4f5a6b7c8d9",
      "name": "Arjun Sharma",
      "email": "arjun@example.com",
      "role": "student",
      "profileImage": "",
      "resume": "",
      "targetRole": "Frontend Developer",
      "createdAt": "2026-09-14T10:00:00.000Z",
      "updatedAt": "2026-09-14T10:00:00.000Z"
    }
  }
  ```
- **401 Unauthorized** (No token provided)
  ```json
  {
    "success": false,
    "message": "Not Authorized"
  }
  ```
- **401 Unauthorized** (Invalid/expired token)
  ```json
  {
    "success": false,
    "message": "Invalid Token"
  }
  ```
- **404 Not Found**
  ```json
  {
    "success": false,
    "message": "User not found"
  }
  ```

---

## 3. Planned Product Endpoints

### 3.1 Resume Analyzer Endpoints

#### `POST /api/resume/upload`
Uploads a candidate's resume (`.pdf` or `.docx`) via `multipart/form-data`.
- **Headers:** `Authorization: Bearer <JWT>`, `Content-Type: multipart/form-data`
- **Form Key:** `resumeFile`
- **Success (200):** Returns `{ success: true, fileUrl, fileName, extractedText }`

#### `POST /api/resume/analyze`
Submits extracted resume text and target role to AI for ATS parsing.
- **Headers:** `Authorization: Bearer <JWT>`, `Content-Type: application/json`
- **Body:** `{ resumeId: "...", targetRole: "Frontend Developer" }`
- **Success (200):**
  ```json
  {
    "success": true,
    "data": {
      "atsScore": 84,
      "skillsDetected": ["React", "JavaScript", "Tailwind CSS"],
      "missingKeywords": ["TypeScript", "Next.js", "Jest"],
      "suggestions": [
        {
          "section": "Experience",
          "originalText": "Worked on React components",
          "improvedText": "Architected 15+ modular React components improving page render performance by 28%",
          "rationale": "Quantifies business impact using action-oriented phrasing."
        }
      ]
    }
  }
  ```

---

### 3.2 AI Mock Interview Endpoints

#### `POST /api/interview/start`
Initializes a new mock interview session and returns the first question.
- **Headers:** `Authorization: Bearer <JWT>`
- **Body:** `{ targetRole: "Frontend Developer", mode: "technical", difficulty: "mid" }`
- **Success (201):**
  ```json
  {
    "success": true,
    "sessionId": "65f2c7a1e0b...",
    "firstQuestion": {
      "id": "q1",
      "questionText": "Can you explain how React 19 hooks manage re-renders under the hood?",
      "category": "technical"
    }
  }
  ```

#### `POST /api/interview/:id/answer`
Submits a candidate's verbal or typed response to question `N` and receives instant AI critique and question `N+1`.
- **Headers:** `Authorization: Bearer <JWT>`
- **Body:** `{ questionId: "q1", answerText: "React uses a fiber architecture..." }`
- **Success (200):**
  ```json
  {
    "success": true,
    "feedback": {
      "score": 88,
      "critique": "Solid explanation of fiber trees; could mention concurrency enhancements."
    },
    "nextQuestion": {
      "id": "q2",
      "questionText": "How would you optimize a large data table with 10,000 rows in React?"
    }
  }
  ```

#### `GET /api/interview/:id/report`
Fetches the complete session debrief, aggregate score, and strengths/weaknesses.
- **Headers:** `Authorization: Bearer <JWT>`
- **Success (200):** Returns full interview session metrics and transcript.

---

### 3.3 Coding Practice Endpoints

#### `GET /api/coding/problems`
Fetches a list of available coding practice problems with difficulty and tags.
- **Query Params:** `?difficulty=Medium&category=Arrays`
- **Success (200):** Returns array of coding challenge summaries.

#### `POST /api/coding/:id/run`
Executes candidate code against public test cases in an isolated sandbox.
- **Headers:** `Authorization: Bearer <JWT>`
- **Body:** `{ language: "javascript", code: "function twoSum(nums, target) { ... }" }`
- **Success (200):** `{ success: true, results: [{ input, expected, actual, passed }] }`
