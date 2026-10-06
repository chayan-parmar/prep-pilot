const axios = require("axios");
const { GoogleGenerativeAI } = require("@google/generative-ai");
const OpenAI = require("openai");

/**
 * Generates dynamic, resume-specific AI feedback using OpenRouter, OpenAI, NVIDIA API, or Gemini.
 * Falls back gracefully to static suggestions if API calls fail or keys are unconfigured.
 */
async function generateFeedback({ resumeText, targetRole, matchedKeywords, missingKeywords, atsScore }) {
  const openrouterApiKey = process.env.OPENROUTER_API_KEY;
  const openaiApiKey = process.env.OPENAI_API_KEY;
  const nvidiaApiKey = process.env.NVIDIA_API_KEY;
  const geminiApiKey = process.env.GEMINI_API_KEY;

  if (openrouterApiKey) {
    return await generateFeedbackOpenRouter({ openrouterApiKey, resumeText, targetRole, matchedKeywords, missingKeywords, atsScore });
  } else if (openaiApiKey) {
    return await generateFeedbackOpenAI({ openaiApiKey, resumeText, targetRole, matchedKeywords, missingKeywords, atsScore });
  } else if (nvidiaApiKey) {
    return await generateFeedbackNvidia({ nvidiaApiKey, resumeText, targetRole, matchedKeywords, missingKeywords, atsScore });
  } else if (geminiApiKey) {
    return await generateFeedbackGemini({ geminiApiKey, resumeText, targetRole, matchedKeywords, missingKeywords, atsScore });
  } else {
    console.warn("[AIService] No AI API keys configured in .env. Using intelligent fallback suggestions.");
    return getFallbackSuggestions(resumeText, targetRole, matchedKeywords, missingKeywords, atsScore);
  }
}

const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

async function generateFeedbackOpenRouter({ openrouterApiKey, resumeText, targetRole, matchedKeywords, missingKeywords, atsScore }) {
  const model = process.env.OPENROUTER_MODEL || "liquid/lfm-2.5-2.6b:free";
  const trimmedResume = resumeText.slice(0, 3000);

  console.log(`[ResumeAIService] Using model: ${model} | Target: ${targetRole} | ATS: ${atsScore}`);

  const prompt = `You are an expert technical resume coach. Analyze the following resume for a candidate targeting the role of "${targetRole}".

RESUME TEXT:
"""
${trimmedResume}
"""

CONTEXT:
- ATS Score: ${atsScore}/100
- Matched Keywords: ${matchedKeywords.join(", ") || "None"}
- Missing Keywords: ${missingKeywords.join(", ") || "None"}

Your task: Return a JSON object with this exact shape:
{
  "aiSummary": "2-3 sentence personalized summary of this candidate's background, strengths, and specific areas to improve for ${targetRole}.",
  "bulletSuggestions": [
    {
      "section": "Specific role or project name from this resume",
      "original": "A weak or vague bullet point statement from this resume",
      "improved": "A high-impact rewrite with strong action verbs, technical scope, and quantified metrics",
      "metricGain": "e.g. +35% latency reduction or 15k daily active users",
      "rationale": "One sentence explaining why this rewrite is significantly stronger"
    },
    {
      "section": "Specific role or project name from this resume",
      "original": "A second bullet statement from this resume",
      "improved": "A high-impact rewrite with strong action verbs and metrics",
      "metricGain": "Measurable impact metric",
      "rationale": "Why this rewrite works"
    },
    {
      "section": "Specific role or project name from this resume",
      "original": "A third bullet statement from this resume",
      "improved": "A high-impact rewrite with strong action verbs and keywords",
      "metricGain": "Measurable impact metric",
      "rationale": "Why this rewrite works"
    }
  ]
}

Rules:
- Make suggestions SPECIFIC to this candidate's actual projects, tools, and background.
- Keep improved bullets under 35 words.
- Always output raw valid JSON only matching the schema. No markdown formatting, backticks, or preamble.`;

  const systemMsg = "You are an expert technical resume reviewer and ATS optimizer. Always respond with raw valid JSON only matching the requested schema. No markdown formatting, backticks, or conversational preamble.";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[ResumeAIService] Attempt ${attempt}/${MAX_RETRIES}...`);

      const body = {
        model,
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      };

      if (attempt <= 2) {
        body.response_format = { type: "json_object" };
      }

      const response = await axios.post(OPENROUTER_BASE, body, {
        headers: {
          Authorization: `Bearer ${openrouterApiKey}`,
          "HTTP-Referer": "http://localhost:5000",
          "X-Title": "PrepPilot",
          "Content-Type": "application/json",
        },
        timeout: 65000,
      });

      const message = response.data?.choices?.[0]?.message;
      const rawText = (message?.content || message?.reasoning || "").trim();

      if (!rawText || rawText.length < 15) {
        console.warn(`[ResumeAIService] Empty/sparse response on attempt ${attempt}`);
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        break;
      }

      console.log(`[ResumeAIService] Got AI response length: ${rawText.length}`);

      const parsed = extractJson(rawText);
      if (parsed && (parsed.aiSummary || Array.isArray(parsed.bulletSuggestions))) {
        console.log("[ResumeAIService] Successfully generated dynamic live AI feedback!");
        return normalizeFeedback(parsed, resumeText, targetRole, matchedKeywords, missingKeywords, atsScore);
      }

      console.warn(`[ResumeAIService] Could not extract valid JSON on attempt ${attempt}`);
    } catch (error) {
      const status = error.response?.status;
      const isRateLimit = status === 429;
      const retryAfter = error.response?.data?.metadata?.retry_after_seconds || 5;

      if (isRateLimit && attempt < MAX_RETRIES) {
        const waitMs = (retryAfter + 2) * 1000;
        console.warn(`[ResumeAIService] Rate limited (429). Waiting ${waitMs / 1000}s before retry...`);
        await sleep(waitMs);
        continue;
      }

      console.warn(`[ResumeAIService] Attempt ${attempt} warning:`, error.response?.data?.error?.message || error.message);
      if (attempt < MAX_RETRIES) {
        await sleep(RETRY_DELAY_MS);
      }
    }
  }

  console.warn("[ResumeAIService] Using fallback suggestions after attempts completed.");
  return getFallbackSuggestions(resumeText, targetRole, matchedKeywords, missingKeywords, atsScore);
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function generateFeedbackOpenAI({ openaiApiKey, resumeText, targetRole, matchedKeywords, missingKeywords, atsScore }) {
  try {
    const openai = new OpenAI({ apiKey: openaiApiKey });
    const trimmedResume = resumeText.slice(0, 3000);

    const prompt = `
You are an expert technical resume coach. Analyze the following resume for a candidate targeting the role of "${targetRole}".

RESUME TEXT:
"""
${trimmedResume}
"""

CONTEXT:
- ATS Score: ${atsScore}/100
- Matched Keywords: ${matchedKeywords.join(", ") || "None"}
- Missing Keywords: ${missingKeywords.join(", ") || "None"}

Your task: Return a JSON object (no markdown, no code blocks, raw JSON only) with this exact shape:
{
  "aiSummary": "<2-3 sentence personalized summary of this specific resume's strengths and weaknesses for the ${targetRole} role>",
  "bulletSuggestions": [
    {
      "section": "<actual section or role found in this resume>",
      "original": "<a weak or vague bullet point from this actual resume, or a representative weak statement>",
      "improved": "<a stronger rewrite with action verbs, metrics, and keywords for ${targetRole}>",
      "metricGain": "<the improvement, e.g. +40% efficiency or Production-ready quality>",
      "rationale": "<one sentence explaining why this rewrite is stronger>"
    },
    {},
    {}
  ]
}

Rules:
- Make suggestions SPECIFIC to this resume content — reference actual technologies, roles, or projects you see
- The aiSummary must mention at least one specific skill or technology from the resume
- Provide exactly 3 bulletSuggestions
- Keep improved bullets under 35 words
- Output raw JSON only — no backticks, no markdown, no explanation outside the JSON
`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: "You are an expert technical resume reviewer. Always respond with raw valid JSON only without markdown formatting." },
        { role: "user", content: prompt },
      ],
      temperature: 0.2,
      response_format: { type: "json_object" },
    });

    const responseText = response.choices[0]?.message?.content?.trim() || "";
    const parsed = JSON.parse(responseText);

    if (!parsed.aiSummary || !Array.isArray(parsed.bulletSuggestions)) {
      throw new Error("Invalid OpenAI response structure");
    }

    return {
      aiSummary: parsed.aiSummary,
      bulletSuggestions: parsed.bulletSuggestions.slice(0, 3).map((s) => ({
        section: s.section || "General",
        original: s.original || "",
        improved: s.improved || "",
        metricGain: s.metricGain || "",
        rationale: s.rationale || "",
      })),
    };
  } catch (error) {
    console.error("[OpenAIService] AI feedback generation failed:", error.message);
    return {
      aiSummary: "",
      bulletSuggestions: getFallbackSuggestions(resumeText),
    };
  }
}

async function generateFeedbackNvidia({ nvidiaApiKey, resumeText, targetRole, matchedKeywords, missingKeywords, atsScore }) {
  try {
    const trimmedResume = resumeText.slice(0, 3000);

    const prompt = `
You are an expert technical resume coach. Analyze the following resume for a candidate targeting the role of "${targetRole}".

RESUME TEXT:
"""
${trimmedResume}
"""

CONTEXT:
- ATS Score: ${atsScore}/100
- Matched Keywords: ${matchedKeywords.join(", ") || "None"}
- Missing Keywords: ${missingKeywords.join(", ") || "None"}

Your task: Return a JSON object (no markdown, no code blocks, raw JSON only) with this exact shape:
{
  "aiSummary": "<2-3 sentence personalized summary of this specific resume's strengths and weaknesses for the ${targetRole} role>",
  "bulletSuggestions": [
    {
      "section": "<actual section or role found in this resume>",
      "original": "<a weak or vague bullet point from this actual resume, or a representative weak statement>",
      "improved": "<a stronger rewrite with action verbs, metrics, and keywords for ${targetRole}>",
      "metricGain": "<the improvement, e.g. +40% efficiency or Production-ready quality>",
      "rationale": "<one sentence explaining why this rewrite is stronger>"
    },
    {},
    {}
  ]
}

Rules:
- Make suggestions SPECIFIC to this resume content — reference actual technologies, roles, or projects you see
- The aiSummary must mention at least one specific skill or technology from the resume
- Provide exactly 3 bulletSuggestions
- Keep improved bullets under 35 words
- Output raw JSON only — no backticks, no markdown, no explanation outside the JSON
`;

    const response = await axios.post(
      "https://integrate.api.nvidia.com/v1/chat/completions",
      {
        model: "z-ai/glm-5.3-flash",
        messages: [
          { role: "system", content: "You are an expert technical resume reviewer. Always respond with raw valid JSON only without markdown formatting." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        top_p: 0.7,
        max_tokens: 1024,
      },
      {
        headers: {
          Authorization: `Bearer ${nvidiaApiKey}`,
          "Content-Type": "application/json",
        },
        timeout: 25000,
      }
    );

    const responseText = response.data?.choices?.[0]?.message?.content?.trim() || "";

    const cleaned = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.aiSummary || !Array.isArray(parsed.bulletSuggestions)) {
      throw new Error("Invalid NVIDIA AI response structure");
    }

    return {
      aiSummary: parsed.aiSummary,
      bulletSuggestions: parsed.bulletSuggestions.slice(0, 3).map((s) => ({
        section: s.section || "General",
        original: s.original || "",
        improved: s.improved || "",
        metricGain: s.metricGain || "",
        rationale: s.rationale || "",
      })),
    };
  } catch (error) {
    console.error("[NvidiaAIService] AI feedback generation failed:", error.response?.data || error.message);
    return {
      aiSummary: "",
      bulletSuggestions: getFallbackSuggestions(resumeText),
    };
  }
}

async function generateFeedbackGemini({ geminiApiKey, resumeText, targetRole, matchedKeywords, missingKeywords, atsScore }) {
  try {
    const genAI = new GoogleGenerativeAI(geminiApiKey);
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    const trimmedResume = resumeText.slice(0, 3000);

    const prompt = `
You are an expert technical resume coach. Analyze the following resume for a candidate targeting the role of "${targetRole}".

RESUME TEXT:
"""
${trimmedResume}
"""

CONTEXT:
- ATS Score: ${atsScore}/100
- Matched Keywords: ${matchedKeywords.join(", ") || "None"}
- Missing Keywords: ${missingKeywords.join(", ") || "None"}

Your task: Return a JSON object (no markdown, no code blocks, raw JSON only) with this exact shape:
{
  "aiSummary": "<2-3 sentence personalized summary of this specific resume's strengths and weaknesses for the ${targetRole} role>",
  "bulletSuggestions": [
    {
      "section": "<actual section or role found in this resume>",
      "original": "<a weak or vague bullet point from this actual resume, or a representative weak statement>",
      "improved": "<a stronger rewrite with action verbs, metrics, and keywords for ${targetRole}>",
      "metricGain": "<the improvement, e.g. +40% efficiency or Production-ready quality>",
      "rationale": "<one sentence explaining why this rewrite is stronger>"
    },
    {},
    {}
  ]
}

Rules:
- Make suggestions SPECIFIC to this resume content — reference actual technologies, roles, or projects you see
- The aiSummary must mention at least one specific skill or technology from the resume
- Provide exactly 3 bulletSuggestions
- Keep improved bullets under 35 words
- Output raw JSON only — no backticks, no markdown, no explanation outside the JSON
`;

    const result = await model.generateContent(prompt);
    const responseText = result.response.text().trim();

    const cleaned = responseText
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/```\s*$/i, "")
      .trim();

    const parsed = JSON.parse(cleaned);

    if (!parsed.aiSummary || !Array.isArray(parsed.bulletSuggestions)) {
      throw new Error("Invalid Gemini response structure");
    }

    return {
      aiSummary: parsed.aiSummary,
      bulletSuggestions: parsed.bulletSuggestions.slice(0, 3).map((s) => ({
        section: s.section || "General",
        original: s.original || "",
        improved: s.improved || "",
        metricGain: s.metricGain || "",
        rationale: s.rationale || "",
      })),
    };
  } catch (error) {
    console.error("[GeminiService] AI feedback generation failed:", error.message);
    return {
      aiSummary: "",
      bulletSuggestions: getFallbackSuggestions(resumeText),
    };
  }
}

function getFallbackSuggestions(text, targetRole = "Software Engineer", matchedKeywords = [], missingKeywords = [], atsScore = 70) {
  const detectedProject = /react/i.test(text) ? "React" : /node|express/i.test(text) ? "Backend" : /python|ai|ml/i.test(text) ? "AI/ML" : "Software";
  const matchedSample = matchedKeywords.slice(0, 3).join(", ");
  const missingSample = missingKeywords.slice(0, 3).join(", ");

  let aiSummary = `Candidate demonstrates strong technical foundational competency with skills in ${matchedSample || "core technologies"}.`;
  if (missingSample) {
    aiSummary += ` To boost ATS score and interview callback rates for ${targetRole} positions, incorporate quantified metrics and key competencies like ${missingSample}.`;
  } else {
    aiSummary += ` For ${targetRole} screening, emphasize measurable production impacts, latency/performance wins, and cross-functional leadership.`;
  }

  const bulletSuggestions = [
    {
      section: `Work Experience — ${detectedProject} Role`,
      original: "Worked on application features and improved performance.",
      improved:
        "Architected reusable application features, reduced page-load latency by 35%, and improved release quality through focused component testing.",
      metricGain: "+35% latency improvement",
      rationale: "Uses a stronger action verb, names the technical scope, and adds measurable impact.",
    },
    {
      section: "Projects — API and Data Flow",
      original: "Created backend APIs and connected them to the database.",
      improved:
        "Engineered secure REST API workflows with validated inputs, indexed database queries, and reliable error handling for production-ready data access.",
      metricGain: "Production-ready API quality",
      rationale: "Highlights reliability, validation, and database quality instead of only listing tasks.",
    },
    {
      section: "Skills — Target Role Alignment",
      original: "Used modern tools to build web applications.",
      improved:
        `Delivered full-stack features with ${matchedSample || "modern frameworks"}, authentication, responsive UI, and role-focused performance optimization for ${targetRole}.`,
      metricGain: "Stronger keyword density",
      rationale: "Naturally includes ATS keywords while keeping the sentence readable for human recruiters.",
    },
  ];

  return { aiSummary, bulletSuggestions };
}

function extractJson(text) {
  if (!text) return null;
  let cleaned = text.trim();
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
  try {
    return JSON.parse(cleaned);
  } catch (e) {
    return null;
  }
}

function normalizeFeedback(parsed, resumeText, targetRole, matchedKeywords, missingKeywords, atsScore) {
  const fallbacks = getFallbackSuggestions(resumeText, targetRole, matchedKeywords, missingKeywords, atsScore);
  const rawList = Array.isArray(parsed?.bulletSuggestions)
    ? parsed.bulletSuggestions
    : Array.isArray(parsed?.suggestions)
    ? parsed.suggestions
    : [];

  const bulletSuggestions = rawList.slice(0, 3).map((s, idx) => {
    const fb = fallbacks.bulletSuggestions[idx] || fallbacks.bulletSuggestions[0];
    return {
      section: s.section || fb.section,
      original: s.original || s.before || s.weak || fb.original,
      improved: s.improved || s.suggestion || s.rewrite || s.after || fb.improved,
      metricGain: s.metricGain || s.metric || s.gain || fb.metricGain,
      rationale: s.rationale || s.reason || s.explanation || fb.rationale,
    };
  });

  while (bulletSuggestions.length < 3) {
    bulletSuggestions.push(fallbacks.bulletSuggestions[bulletSuggestions.length] || fallbacks.bulletSuggestions[0]);
  }

  return {
    aiSummary: parsed?.aiSummary || parsed?.summary || fallbacks.aiSummary,
    bulletSuggestions,
  };
}

module.exports = { generateFeedback };

