const { PDFParse } = require("pdf-parse");
const yauzl = require("yauzl");
const ResumeAnalysis = require("../models/ResumeAnalysis");
const User = require("../models/User");
const { generateFeedback } = require("../services/geminiService");

const ROLE_SKILL_BENCHMARKS = {
  "Full Stack Software Engineer": [
    "React.js",
    "Node.js",
    "JavaScript (ES6+)",
    "TypeScript",
    "Tailwind CSS",
    "MongoDB",
    "REST APIs",
    "Git & GitHub",
    "Redux",
    "Express",
    "Next.js",
    "Docker",
    "CI/CD",
    "GraphQL",
    "Redis",
    "Jest",
  ],
  "Frontend Developer": [
    "React.js",
    "JavaScript (ES6+)",
    "TypeScript",
    "HTML5 & CSS3",
    "Tailwind CSS",
    "Redux / State Management",
    "Responsive Design",
    "REST APIs",
    "Vite",
    "Webpack",
    "Jest / React Testing Library",
    "Web Performance",
    "Git",
  ],
  "Backend Developer": [
    "Node.js",
    "Express",
    "Python",
    "Java",
    "MongoDB",
    "PostgreSQL",
    "REST APIs",
    "GraphQL",
    "Docker",
    "Kubernetes",
    "Microservices",
    "Redis",
    "JWT Authentication",
    "CI/CD",
    "Git",
  ],
  "Data Scientist / AI Engineer": [
    "Python",
    "PyTorch",
    "TensorFlow",
    "Pandas",
    "NumPy",
    "Scikit-Learn",
    "SQL",
    "Machine Learning",
    "Deep Learning",
    "LLMs",
    "NLP",
    "Data Visualization",
    "Git",
  ],
  "DevOps / Cloud Engineer": [
    "Docker",
    "Kubernetes",
    "AWS",
    "Terraform",
    "CI/CD",
    "Linux",
    "Bash",
    "Python",
    "Prometheus",
    "Grafana",
    "Ansible",
    "Git",
  ],
};

const DEFAULT_SKILL_BENCHMARK = [
  "JavaScript",
  "Python",
  "React",
  "Node.js",
  "SQL",
  "Git",
  "REST APIs",
  "Docker",
  "Agile",
  "Problem Solving",
  "CI/CD",
  "System Design",
];

exports.analyzeResume = async (req, res) => {
  try {
    const targetRole = (req.body.targetRole || "Full Stack Software Engineer").trim();
    const fileName = req.file?.originalname || "Pasted_Resume.txt";
    const extractedText = await getResumeText(req, fileName);

    if (!extractedText || extractedText.trim().length < 25) {
      return res.status(400).json({
        success: false,
        message: "Could not extract enough readable resume text. Please upload a text-based PDF, DOCX, or TXT file.",
      });
    }

    const result = buildAnalysis({
      extractedText,
      fileName,
      targetRole,
      fileType: req.file?.mimetype || "text/plain",
      fileSize: req.file?.size || Buffer.byteLength(extractedText),
    });

    // Generate dynamic AI feedback from Gemini
    const aiFeedback = await generateFeedback({
      resumeText: extractedText,
      targetRole,
      matchedKeywords: result.matchedKeywords,
      missingKeywords: result.missingKeywords,
      atsScore: result.atsScore,
    });

    result.bulletSuggestions = aiFeedback.bulletSuggestions;
    result.aiSummary = aiFeedback.aiSummary;

    const analysis = await ResumeAnalysis.create({
      userId: req.user.id,
      ...result,
    });

    try {
      await User.findByIdAndUpdate(req.user.id, {
        resume: fileName,
        targetRole,
      });
    } catch (userErr) {
      console.warn("[ResumeController] Could not update user profile:", userErr.message);
    }

    return res.status(201).json({
      success: true,
      message: "Resume analyzed successfully",
      data: formatAnalysisResponse(analysis),
    });
  } catch (error) {
    console.error("Error analyzing resume:", error);
    return res.status(500).json({
      success: false,
      message: "Failed to parse resume file.",
      error: error.message,
    });
  }
};

exports.getResumeAnalyses = async (req, res) => {
  try {
    const analyses = await ResumeAnalysis.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20);

    return res.status(200).json({
      success: true,
      data: analyses.map(formatAnalysisResponse),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load resume analysis history.",
      error: error.message,
    });
  }
};

exports.getResumeAnalysisById = async (req, res) => {
  try {
    const analysis = await ResumeAnalysis.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!analysis) {
      return res.status(404).json({
        success: false,
        message: "Resume analysis not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: formatAnalysisResponse(analysis),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load resume analysis.",
      error: error.message,
    });
  }
};

exports.deleteResumeAnalysis = async (req, res) => {
  try {
    const deleted = await ResumeAnalysis.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!deleted) {
      return res.status(404).json({
        success: false,
        message: "Resume analysis not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Resume analysis deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete resume analysis.",
      error: error.message,
    });
  }
};

async function getResumeText(req, fileName) {
  if (req.file?.buffer) {
    const lowerName = (fileName || "").toLowerCase();
    const mime = (req.file.mimetype || "").toLowerCase();

    if (mime.includes("pdf") || lowerName.endsWith(".pdf")) {
      return extractPdfText(req.file.buffer);
    }

    if (
      mime.includes("word") ||
      mime.includes("officedocument") ||
      lowerName.endsWith(".docx") ||
      lowerName.endsWith(".doc")
    ) {
      return extractDocxText(req.file.buffer);
    }

    return req.file.buffer.toString("utf-8");
  }

  return req.body.resumeText || "";
}

function buildAnalysis({ extractedText, fileName, targetRole, fileType, fileSize }) {
  const normalizedText = extractedText.replace(/\s+/g, " ").trim();
  const textUpper = normalizedText.toUpperCase();
  const benchmarkSkills = ROLE_SKILL_BENCHMARKS[targetRole] || DEFAULT_SKILL_BENCHMARK;
  const matchedKeywords = [];
  const missingKeywords = [];

  benchmarkSkills.forEach((skill) => {
    const cleanSkill = skill.split(" ")[0].replace(/[^a-z0-9#+]/gi, "").toUpperCase();
    if (textUpper.includes(skill.toUpperCase()) || (cleanSkill.length > 2 && textUpper.includes(cleanSkill))) {
      matchedKeywords.push(skill);
    } else {
      missingKeywords.push(skill);
    }
  });

  const keywordMatchRatio = matchedKeywords.length / benchmarkSkills.length;
  const keywordScore = Math.min(98, Math.max(45, Math.round(keywordMatchRatio * 100)));

  let formattingScore = 82;
  if (fileName.endsWith(".pdf") || fileName.endsWith(".docx")) formattingScore += 6;
  if (normalizedText.length > 300) formattingScore += 5;
  if (/\b(email|linkedin|github|portfolio)\b|@/i.test(normalizedText)) formattingScore += 4;
  formattingScore = Math.min(98, formattingScore);

  const metricMatches =
    (normalizedText.match(/\d+%/g) || []).length +
    (normalizedText.match(/\$\d+/g) || []).length +
    (normalizedText.match(/\d+\+/g) || []).length;
  const impactScore = Math.min(96, Math.max(55, 62 + metricMatches * 7));

  const wordCount = normalizedText.split(/\s+/).filter(Boolean).length;
  let brevityScore = 82;
  if (wordCount >= 250 && wordCount <= 800) brevityScore = 94;
  else if (wordCount > 800) brevityScore = 76;
  else if (wordCount < 150) brevityScore = 68;

  const atsScore = Math.round(
    formattingScore * 0.25 + keywordScore * 0.35 + impactScore * 0.25 + brevityScore * 0.15
  );

  return {
    fileName,
    fileType,
    fileSize,
    targetRole,
    atsScore,
    scoreBreakdown: {
      formattingScore,
      keywordScore,
      impactScore,
      brevityScore,
    },
    matchedKeywords,
    missingKeywords,
    bulletSuggestions: generateBulletSuggestions(normalizedText),
    formatChecks: buildFormatChecks({ fileName, normalizedText, metricMatches, matchedKeywords, benchmarkSkills, targetRole }),
    extractedTextPreview: normalizedText.slice(0, 1200),
    wordCount,
  };
}

function buildFormatChecks({ fileName, normalizedText, metricMatches, matchedKeywords, benchmarkSkills, targetRole }) {
  const hasContact = /@|\bgithub\b|\blinkedin\b|\bportfolio\b/i.test(normalizedText);
  const hasSections = /\b(experience|projects|education|skills)\b/i.test(normalizedText);
  const hasActionVerbs = /\b(achieved|architected|built|created|designed|developed|engineered|implemented|improved|led|optimized|reduced|shipped)\b/i.test(normalizedText);

  return [
    {
      rule: "Standard File Format (.pdf / .docx / .txt)",
      passed: /\.(pdf|docx|txt)$/i.test(fileName),
      detail: `Detected file extension: ${fileName.split(".").pop() || "unknown"}`,
    },
    {
      rule: "ATS Clear Text Extractability",
      passed: normalizedText.length > 250,
      detail: normalizedText.length > 250 ? "Readable text layer extracted successfully" : "Text layer is short or sparse",
    },
    {
      rule: "Core Resume Sections",
      passed: hasSections,
      detail: hasSections ? "Found common sections such as experience, projects, education, or skills" : "Add clear section headings for ATS scanners",
    },
    {
      rule: "Quantified Metrics",
      passed: metricMatches > 1,
      detail: metricMatches > 0 ? `Identified ${metricMatches} numerical achievements or metrics` : "No measurable results found",
    },
    {
      rule: "Target Keyword Coverage",
      passed: matchedKeywords.length >= Math.ceil(benchmarkSkills.length * 0.5),
      detail: `Matched ${matchedKeywords.length} of ${benchmarkSkills.length} competencies for ${targetRole}`,
    },
    {
      rule: "Contact Information Header",
      passed: hasContact,
      detail: hasContact ? "Found email or professional profile links" : "Add email, LinkedIn, GitHub, or portfolio links",
    },
    {
      rule: "Bullet Point Action Verbs",
      passed: hasActionVerbs,
      detail: hasActionVerbs ? "Strong engineering action verbs detected" : "Start bullets with stronger action verbs",
    },
  ];
}

function generateBulletSuggestions(text) {
  const detectedProject = /react/i.test(text) ? "React" : /node|express/i.test(text) ? "Backend" : "Software";

  return [
    {
      section: `Work Experience - ${detectedProject} Role`,
      original: "Worked on application features and improved performance.",
      improved: "Architected reusable application features, reduced page-load latency by 35%, and improved release quality through focused component testing.",
      metricGain: "+35% latency improvement",
      rationale: "Uses a stronger action verb, names the technical scope, and adds measurable impact.",
    },
    {
      section: "Projects - API and Data Flow",
      original: "Created backend APIs and connected them to the database.",
      improved: "Engineered secure REST API workflows with validated inputs, indexed database queries, and reliable error handling for production-ready data access.",
      metricGain: "Production-ready API quality",
      rationale: "Highlights reliability, validation, and database quality instead of only listing tasks.",
    },
    {
      section: "Skills - Target Role Alignment",
      original: "Used modern tools to build web applications.",
      improved: "Delivered full-stack features with React, Node.js, MongoDB, authentication, responsive UI, and role-focused performance optimization.",
      metricGain: "Stronger keyword density",
      rationale: "Naturally includes ATS keywords while keeping the sentence readable for human recruiters.",
    },
  ];
}

function formatAnalysisResponse(analysis) {
  const source = analysis.toObject ? analysis.toObject() : analysis;
  return {
    id: source._id,
    fileName: source.fileName,
    fileType: source.fileType,
    fileSize: source.fileSize,
    targetRole: source.targetRole,
    atsScore: source.atsScore,
    formattingScore: source.scoreBreakdown?.formattingScore,
    keywordScore: source.scoreBreakdown?.keywordScore,
    impactScore: source.scoreBreakdown?.impactScore,
    brevityScore: source.scoreBreakdown?.brevityScore,
    matchedKeywords: source.matchedKeywords || [],
    missingKeywords: source.missingKeywords || [],
    bulletSuggestions: source.bulletSuggestions || [],
    formatChecks: source.formatChecks || [],
    extractedTextPreview: source.extractedTextPreview || "",
    wordCount: source.wordCount || 0,
    aiSummary: source.aiSummary || "",
    analyzedAt: source.createdAt,
  };
}

async function extractPdfText(buffer) {
  const parser = new PDFParse({ data: buffer, verbosity: 0 });
  try {
    const result = await parser.getText();
    // pdf-parse v2 getText() returns { pages: [...], text } or an object with text
    if (typeof result === "string") return result;
    if (result && typeof result.text === "string") return result.text;
    // If pages array, join text from each page
    if (result && Array.isArray(result.pages)) {
      return result.pages.map((p) => p.text || "").join("\n");
    }
    return "";
  } catch (err) {
    console.error("[ResumeController] PDF extraction error:", err.message);
    return "";
  } finally {
    try { await parser.destroy(); } catch (_) { /* ignore destroy errors */ }
  }
}
function extractDocxText(buffer) {
  return new Promise((resolve, reject) => {
    yauzl.fromBuffer(buffer, { lazyEntries: true }, (zipErr, zipfile) => {
      if (zipErr) {
        reject(zipErr);
        return;
      }

      let documentXml = "";
      let settled = false;

      zipfile.readEntry();
      zipfile.on("entry", (entry) => {
        if (entry.fileName === "word/document.xml") {
          zipfile.openReadStream(entry, (streamErr, stream) => {
            if (streamErr) {
              reject(streamErr);
              return;
            }

            stream.on("data", (chunk) => {
              documentXml += chunk.toString("utf8");
            });
            stream.on("end", () => {
              settled = true;
              zipfile.close();
              resolve(stripDocxXml(documentXml));
            });
          });
        } else {
          zipfile.readEntry();
        }
      });

      zipfile.on("end", () => {
        if (!settled) resolve("");
      });
      zipfile.on("error", reject);
    });
  });
}

function stripDocxXml(xml) {
  return xml
    .replace(/<w:tab\/>/g, " ")
    .replace(/<\/w:p>/g, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, " ")
    .trim();
}


