const axios = require("axios");

const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
const MAX_RETRIES = 2;
const RETRY_DELAY_MS = 2000;

/**
 * Generates a structured learning roadmap using AI.
 * Falls back gracefully to comprehensive curated roadmaps if AI is rate-limited or fails.
 */
async function generateRoadmap({ category, skillLevel, targetGoal }) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    console.warn("[RoadmapGenerator] OPENROUTER_API_KEY not configured. Using curated roadmap.");
    return getFallbackRoadmap({ category, skillLevel, targetGoal });
  }

  const model = process.env.OPENROUTER_MODEL || "liquid/lfm-2.5-2.6b:free";

  console.log(
    `[RoadmapGenerator] Attempting generation | Model: ${model} | Category: ${category} | Level: ${skillLevel}`
  );

  const prompt = `Generate a detailed learning roadmap for a ${skillLevel} learner who wants to master "${category}".
Their goal: "${targetGoal || "Become proficient in " + category}".

Create 5-6 milestones in logical order.
Respond with valid JSON only matching this exact structure:
{
  "title": "${category} Mastery Roadmap (${skillLevel})",
  "description": "Brief 1-2 sentence overview of this learning path",
  "estimatedDuration": "3-6 months",
  "milestones": [
    {
      "title": "Milestone title",
      "description": "What the learner will achieve (1-2 sentences)",
      "duration": "2-3 weeks",
      "topics": ["Topic 1", "Topic 2", "Topic 3"],
      "resources": [
        {
          "name": "Resource name",
          "url": "https://example.com",
          "type": "article"
        }
      ],
      "order": 0
    }
  ]
}`;

  const systemMsg =
    "You are an expert career coach and curriculum designer for software engineers. Always respond with raw valid JSON only matching the requested schema. No markdown formatting, backticks, or conversational preamble.";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      const body = {
        model,
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 2500,
      };

      const response = await axios.post(OPENROUTER_BASE, body, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5000",
          "X-Title": "PrepPilot",
          "Content-Type": "application/json",
        },
        timeout: 10000,
      });

      const message = response.data?.choices?.[0]?.message;
      const rawText = (message?.content || message?.reasoning || "").trim();

      if (!rawText || rawText.length < 10) {
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        break;
      }

      let cleaned = rawText.trim();
      const codeBlockMatch = cleaned.match(/```(?:json)?\s*([\s\S]*?)\s*```/);
      if (codeBlockMatch) {
        cleaned = codeBlockMatch[1].trim();
      } else {
        const firstBrace = cleaned.indexOf("{");
        const lastBrace = cleaned.lastIndexOf("}");
        if (firstBrace !== -1 && lastBrace !== -1 && lastBrace > firstBrace) {
          cleaned = cleaned.substring(firstBrace, lastBrace + 1);
        }
      }

      const parsed = JSON.parse(cleaned);

      if (!Array.isArray(parsed.milestones) || parsed.milestones.length === 0) {
        throw new Error("Missing milestones array in AI response");
      }

      console.log(
        `[RoadmapGenerator] Successfully generated AI roadmap with ${parsed.milestones.length} milestones`
      );

      const milestones = parsed.milestones.map((m, index) => ({
        title: m.title || `Phase ${index + 1}`,
        description: m.description || "",
        duration: m.duration || "2-3 weeks",
        topics: Array.isArray(m.topics) ? m.topics : [],
        resources: Array.isArray(m.resources)
          ? m.resources.map((r) => ({
              name: r.name || "Resource",
              url: r.url || "",
              type: ["article", "video", "course", "docs", "project"].includes(r.type)
                ? r.type
                : "article",
            }))
          : [],
        isCompleted: false,
        order: index,
      }));

      return {
        title: parsed.title || `${category} Learning Roadmap`,
        description: parsed.description || `Comprehensive path to master ${category}.`,
        estimatedDuration: parsed.estimatedDuration || "3-6 months",
        milestones,
      };
    } catch (error) {
      console.warn(
        `[RoadmapGenerator] Attempt ${attempt} warning:`,
        error.response?.data?.error?.message || error.message
      );
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  console.log(`[RoadmapGenerator] Delivering curated roadmap for "${category}" (${skillLevel}).`);
  return getFallbackRoadmap({ category, skillLevel, targetGoal });
}

function getFallbackRoadmap({ category, skillLevel = "Beginner", targetGoal = "" }) {
  const goalText = targetGoal.trim() ? ` focused on "${targetGoal}"` : "";

  const CURRICULUMS = {
    "Frontend Development": [
      {
        title: "Modern JavaScript & Web Foundations",
        description: "Master ES6+ syntax, asynchronous programming, DOM APIs, and CSS layout engines.",
        duration: "2-3 weeks",
        topics: ["ES6+ syntax & Closures", "Promises, async/await & Fetch", "DOM Manipulation & Event Bubbling", "Flexbox & CSS Grid Mastery"],
        resources: [
          { name: "JavaScript.info Modern Tutorial", url: "https://javascript.info", type: "docs" },
          { name: "MDN Web Docs: Web Foundations", url: "https://developer.mozilla.org", type: "article" },
          { name: "Interactive JS Coding Playground", url: "https://codepen.io", type: "project" },
        ],
      },
      {
        title: "React.js Core & Component Lifecycle",
        description: "Build robust single-page applications with declarative React components and modern hooks.",
        duration: "3-4 weeks",
        topics: ["Component Composition & Props", "useState, useEffect, useMemo", "Custom Hooks & Reusable Logic", "React Router v6 Navigation"],
        resources: [
          { name: "Official React 19 Documentation", url: "https://react.dev", type: "docs" },
          { name: "React Course by freeCodeCamp", url: "https://youtube.com", type: "video" },
          { name: "Full-Stack Portfolio Project", url: "https://github.com", type: "project" },
        ],
      },
      {
        title: "State Management & Server Synchronization",
        description: "Scale applications using global state managers and performant caching layers.",
        duration: "2-3 weeks",
        topics: ["Context API & Zustand", "TanStack React Query / SWR", "Client Cache Invalidation", "Form Handling with Zod / React Hook Form"],
        resources: [
          { name: "TanStack Query Official Guides", url: "https://tanstack.com/query", type: "docs" },
          { name: "State Management Patterns Guide", url: "https://kentcdodds.com/blog", type: "article" },
        ],
      },
      {
        title: "UI Systems, Tailwind CSS & Accessibility",
        description: "Implement accessible, responsive design systems with sleek dark-mode aesthetics.",
        duration: "2 weeks",
        topics: ["Tailwind CSS Utility Architecture", "WCAG 2.1 Accessibility Standards", "Radix UI / Headless UI Patterns", "Framer Motion Micro-Interactions"],
        resources: [
          { name: "Tailwind CSS v4 Documentation", url: "https://tailwindcss.com", type: "docs" },
          { name: "WebAIM Accessibility Checklist", url: "https://webaim.org", type: "article" },
        ],
      },
      {
        title: "Performance, Testing & Production Deployment",
        description: "Benchmark Core Web Vitals, write unit/integration tests, and deploy to Vercel/Netlify.",
        duration: "2-3 weeks",
        topics: ["Vitest & React Testing Library", "Lighthouse & Core Web Vitals", "Code Splitting & Bundle Analyzer", "CI/CD & Cloud Deployment"],
        resources: [
          { name: "Web.dev Performance Deep Dive", url: "https://web.dev", type: "article" },
          { name: "Testing JavaScript Applications", url: "https://testing-library.com", type: "course" },
        ],
      },
    ],
    "Backend Development": [
      {
        title: "Runtime Foundations & Express Architecture",
        description: "Master Node.js event loop, asynchronous I/O, middleware patterns, and routing.",
        duration: "3 weeks",
        topics: ["Node.js Event Loop & Streams", "Express 5 Router & Middleware", "RESTful API Conventions", "Error Handling & Logging Pipelines"],
        resources: [
          { name: "Node.js Official Documentation", url: "https://nodejs.org", type: "docs" },
          { name: "Express Framework Guide", url: "https://expressjs.com", type: "article" },
        ],
      },
      {
        title: "Data Modeling & Database Architecture",
        description: "Design relational and document schemas with indexing and query optimization.",
        duration: "3 weeks",
        topics: ["PostgreSQL Relational Modeling", "MongoDB & Mongoose Schemas", "Indexing & Query Execution Plans", "Connection Pooling & Transactions"],
        resources: [
          { name: "PostgreSQL Tutorial & Exercises", url: "https://postgresqltutorial.com", type: "course" },
          { name: "MongoDB University Developer Track", url: "https://university.mongodb.com", type: "course" },
        ],
      },
      {
        title: "Authentication, Security & Session Management",
        description: "Implement zero-trust security, JWT authentication, and OWASP best practices.",
        duration: "2-3 weeks",
        topics: ["JWT & HttpOnly Cookie Tokens", "Bcrypt Password Hashing", "Rate Limiting & Helmet Security", "CORS & CSRF Mitigation"],
        resources: [
          { name: "OWASP API Security Top 10", url: "https://owasp.org", type: "article" },
          { name: "Auth0 Security Principles", url: "https://auth0.com/blog", type: "article" },
        ],
      },
      {
        title: "Caching, Message Queues & Performance",
        description: "Accelerate throughput using Redis caching and asynchronous job queues.",
        duration: "3 weeks",
        topics: ["Redis Caching Strategies", "BullMQ / RabbitMQ Job Queues", "Database Connection Optimization", "Load Testing with k6"],
        resources: [
          { name: "Redis Documentation & Patterns", url: "https://redis.io", type: "docs" },
          { name: "k6 Load Testing Guide", url: "https://k6.io", type: "docs" },
        ],
      },
      {
        title: "Containerization & Cloud Infrastructure",
        description: "Containerize services with Docker, manage environment secrets, and set up CI/CD.",
        duration: "2-3 weeks",
        topics: ["Docker Multi-Stage Builds", "Docker Compose Orchestration", "GitHub Actions CI/CD Pipeline", "AWS ECS / DigitalOcean Deployments"],
        resources: [
          { name: "Docker Curriculum for Engineers", url: "https://docker-curriculum.com", type: "course" },
          { name: "AWS Cloud Practitioner Guide", url: "https://aws.amazon.com", type: "article" },
        ],
      },
    ],
    "Data Structures & Algorithms": [
      {
        title: "Algorithmic Complexity & Linear Structures",
        description: "Understand Big-O analysis and master arrays, strings, two pointers, and sliding window.",
        duration: "2-3 weeks",
        topics: ["Time & Space Big-O Analysis", "Two Pointer & Fast/Slow Pointers", "Sliding Window Maximum & Substrings", "Hash Maps & Frequency Arrays"],
        resources: [
          { name: "NeetCode 150 Core Curriculum", url: "https://neetcode.io", type: "course" },
          { name: "Visualgo Algorithm Visualizer", url: "https://visualgo.net", type: "project" },
        ],
      },
      {
        title: "Linked Lists, Stacks & Queues",
        description: "Master pointer manipulations, monotonic stacks, and breadth-first queue traversals.",
        duration: "2-3 weeks",
        topics: ["Singly & Doubly Linked List Operations", "Monotonic Stack Problems", "Queue Design & Deques", "Parentheses & Expression Evaluation"],
        resources: [
          { name: "LeetCode Patterns Guide", url: "https://leetcode.com", type: "docs" },
          { name: "GeeksforGeeks DS Deep Dives", url: "https://geeksforgeeks.org", type: "article" },
        ],
      },
      {
        title: "Trees, Binary Search Trees & Heaps",
        description: "Implement recursive tree traversals, level-order scans, and priority queues.",
        duration: "3 weeks",
        topics: ["Preorder, Inorder, Postorder DFS", "Level-Order BFS Traversals", "Binary Search Tree Validations", "Min/Max Heaps & Top-K Elements"],
        resources: [
          { name: "Tree Algorithms on Tech Interview Handbook", url: "https://techinterviewhandbook.org", type: "article" },
        ],
      },
      {
        title: "Graphs: BFS, DFS & Shortest Path",
        description: "Solve adjacency lists, cycle detection, topological sorts, and Dijkstra's algorithm.",
        duration: "3-4 weeks",
        topics: ["Connected Components & Island Traversal", "Topological Sort & Kahn's Algorithm", "Dijkstra & Shortest Path", "Disjoint Set Union (Union-Find)"],
        resources: [
          { name: "Algorithms by Robert Sedgewick", url: "https://coursera.org", type: "course" },
        ],
      },
      {
        title: "Dynamic Programming & Interview Mastery",
        description: "Demystify memoization, bottom-up DP tables, and optimal interview communication.",
        duration: "4 weeks",
        topics: ["1D DP: Fibonacci, Climbing Stairs, House Robber", "2D DP: Grid Paths, Knapsack, LCS", "Interval & Partition DP", "Mock Technical Interview Practice"],
        resources: [
          { name: "Dynamic Programming for Coding Interviews", url: "https://educative.io", type: "course" },
          { name: "Pramp Peer Mock Interviews", url: "https://pramp.com", type: "project" },
        ],
      },
    ],
    "System Design": [
      {
        title: "Scalability Fundamentals & Networking",
        description: "Master horizontal scaling, DNS, TCP/IP, HTTP/3, and load balancers.",
        duration: "2-3 weeks",
        topics: ["Latency vs Throughput & SLA/SLO", "DNS Resolution & CDN Edge Caching", "Layer 4 vs Layer 7 Load Balancers", "Stateless Architecture Patterns"],
        resources: [
          { name: "System Design Primer by Donne Martin", url: "https://github.com/donnemartin/system-design-primer", type: "docs" },
        ],
      },
      {
        title: "Distributed Data Storage & CAP Theorem",
        description: "Understand data replication, partitioning, consistency models, and ACID vs BASE.",
        duration: "3 weeks",
        topics: ["CAP Theorem & PACELC", "Database Sharding & Consistent Hashing", "Master-Replica Replication", "SQL vs NoSQL Decision Matrix"],
        resources: [
          { name: "Designing Data-Intensive Applications", url: "https://dataintensive.net", type: "course" },
        ],
      },
      {
        title: "Caching Layers & Message Brokers",
        description: "Implement high-throughput caching and asynchronous event-driven streaming.",
        duration: "3 weeks",
        topics: ["Cache-Aside, Write-Through & Write-Back", "Kafka & RabbitMQ Architecture", "Idempotent Event Processing", "Dead Letter Queues & Retry Strategies"],
        resources: [
          { name: "Kafka Architecture Guide", url: "https://kafka.apache.org", type: "docs" },
        ],
      },
      {
        title: "Classic System Design Architectures",
        description: "Design real-world distributed architectures: URL Shortener, Twitter, Uber, Netflix.",
        duration: "4 weeks",
        topics: ["TinyURL & Rate Limiter Design", "Twitter Feed Generation Architecture", "Uber Location Tracking System", "YouTube / Netflix Video Transcoding"],
        resources: [
          { name: "ByteByteGo System Design Channel", url: "https://youtube.com", type: "video" },
          { name: "Grokking Modern System Design", url: "https://educative.io", type: "course" },
        ],
      },
    ],
  };

  // Select matching category or default to Full-Stack
  const milestonesRaw = CURRICULUMS[category] || CURRICULUMS["Frontend Development"];

  const milestones = milestonesRaw.map((m, idx) => ({
    title: m.title,
    description: m.description,
    duration: m.duration,
    topics: m.topics,
    resources: m.resources,
    isCompleted: false,
    order: idx,
  }));

  return {
    title: `${category} Learning Roadmap (${skillLevel})`,
    description: `Structured, milestone-by-milestone curriculum designed to take you to a professional level in ${category}${goalText}.`,
    estimatedDuration: "3-5 months",
    milestones,
  };
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { generateRoadmap };
