const axios = require("axios");

const OPENROUTER_BASE = "https://openrouter.ai/api/v1/chat/completions";
const MAX_RETRIES = 3;
const RETRY_DELAY_MS = 5000;

/**
 * Generates 10 MCQ quiz questions for a given topic and difficulty using OpenRouter.
 * Returns an array of normalized question objects.
 * Includes retry logic for rate-limited free-tier models.
 */
async function generateQuizQuestions({ topic, difficulty }) {
  const apiKey = process.env.OPENROUTER_API_KEY;

  if (!apiKey) {
    throw new Error("OPENROUTER_API_KEY is not configured in .env");
  }

  const model = process.env.OPENROUTER_MODEL || "liquid/lfm-2.5-2.6b:free";

  console.log(`[QuizGenerator] Using model: ${model} | Topic: ${topic} | Difficulty: ${difficulty}`);

  const prompt = `Generate 10 ${difficulty} level multiple-choice questions about ${topic} for a software engineering quiz.
Keep explanations concise (1-2 sentences).

Respond with valid JSON matching this exact structure:
{
  "questions": [
    {
      "question": "Clear question text?",
      "options": {
        "A": "Option A text",
        "B": "Option B text",
        "C": "Option C text",
        "D": "Option D text"
      },
      "correctAnswer": "A",
      "explanation": "Brief 1-sentence reason why A is correct."
    }
  ]
}`;

  const systemMsg = "You are an expert technical interview quiz generator. Always respond with raw valid JSON only matching the requested schema. No markdown formatting, backticks, or conversational preamble.";

  for (let attempt = 1; attempt <= MAX_RETRIES; attempt++) {
    try {
      console.log(`[QuizGenerator] Attempt ${attempt}/${MAX_RETRIES}...`);

      const body = {
        model,
        messages: [
          { role: "system", content: systemMsg },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
        max_tokens: 4000,
      };
      // Use response_format on first 2 attempts, drop it on last retry for compatibility
      if (attempt <= 2) {
        body.response_format = { type: "json_object" };
      }

      const response = await axios.post(OPENROUTER_BASE, body, {
        headers: {
          Authorization: `Bearer ${apiKey}`,
          "HTTP-Referer": process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : "http://localhost:5000",
          "X-Title": "PrepPilot",
          "Content-Type": "application/json",
        },
        timeout: 65000,
      });

      const rawText = response.data?.choices?.[0]?.message?.content?.trim() || "";
      console.log("[QuizGenerator] Raw response length:", rawText.length);

      if (!rawText || rawText.length < 10) {
        console.warn(`[QuizGenerator] Empty/null response on attempt ${attempt}`);
        if (attempt < MAX_RETRIES) {
          await sleep(RETRY_DELAY_MS);
          continue;
        }
        throw new Error("AI returned empty response after all retries.");
      }

      console.log("[QuizGenerator] First 150 chars:", rawText.slice(0, 150));

      // Robust JSON extraction
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

      if (!Array.isArray(parsed.questions) || parsed.questions.length === 0) {
        throw new Error("OpenRouter returned invalid question format: missing questions array");
      }

      console.log(`[QuizGenerator] Successfully generated ${parsed.questions.length} questions`);

      // Normalize into a clean flat format
      return parsed.questions.slice(0, 10).map((q) => {
        const opts = q.options || {};
        return {
          question: q.question,
          options: [
            `A. ${opts.A || opts.a || ""}`,
            `B. ${opts.B || opts.b || ""}`,
            `C. ${opts.C || opts.c || ""}`,
            `D. ${opts.D || opts.d || ""}`,
          ],
          correctAnswer: (q.correctAnswer || "A").toUpperCase().trim(),
          explanation: q.explanation || "",
        };
      });
    } catch (error) {
      const status = error.response?.status;
      const isRateLimit = status === 429;
      const retryAfter = error.response?.data?.metadata?.retry_after_seconds || 5;

      if (isRateLimit && attempt < MAX_RETRIES) {
        const waitMs = (retryAfter + 2) * 1000;
        console.warn(`[QuizGenerator] Rate limited (429). Waiting ${waitMs / 1000}s before retry...`);
        await sleep(waitMs);
        continue;
      }

      if (error.response) {
        console.error("[QuizGenerator] OpenRouter HTTP error:", error.response.status, JSON.stringify(error.response.data));
      } else {
        console.error("[QuizGenerator] Error:", error.message);
      }

      if (attempt >= MAX_RETRIES) {
        throw new Error(
          isRateLimit
            ? "AI service is rate limited. Please wait a moment and try again."
            : error.message || "Failed to generate quiz questions."
        );
      }
    }
  }
}

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

module.exports = { generateQuizQuestions };
