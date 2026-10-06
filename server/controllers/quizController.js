const QuizAttempt = require("../models/QuizAttempt");
const { generateQuizQuestions } = require("../services/quizGeneratorService");

// POST /api/quiz/generate
// Generates 10 AI questions for a given topic + difficulty (does NOT save to DB)
exports.generateQuiz = async (req, res) => {
  try {
    const { topic, difficulty } = req.body;

    if (!topic || !difficulty) {
      return res.status(400).json({ success: false, message: "topic and difficulty are required." });
    }

    const validDifficulties = ["Easy", "Medium", "Hard"];
    if (!validDifficulties.includes(difficulty)) {
      return res.status(400).json({ success: false, message: "difficulty must be Easy, Medium, or Hard." });
    }

    const questions = await generateQuizQuestions({ topic, difficulty });

    return res.status(200).json({
      success: true,
      data: { topic, difficulty, questions },
    });
  } catch (error) {
    console.error("[QuizController] generateQuiz error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate quiz questions. Please try again.",
      error: error.message,
    });
  }
};

// POST /api/quiz/submit
// Saves a completed quiz attempt to MongoDB
exports.submitQuiz = async (req, res) => {
  try {
    const { topic, difficulty, timeTakenSeconds, answers } = req.body;
    // answers: [{ question, options, correctAnswer, userAnswer, explanation }]

    if (!topic || !difficulty || !Array.isArray(answers)) {
      return res.status(400).json({ success: false, message: "topic, difficulty, and answers are required." });
    }

    // Evaluate each answer
    let correctCount = 0;
    let wrongCount = 0;
    let skippedCount = 0;

    const questionResults = answers.map((a) => {
      const isSkipped = !a.userAnswer;
      const isCorrect = !isSkipped && a.userAnswer === a.correctAnswer;

      if (isSkipped) skippedCount++;
      else if (isCorrect) correctCount++;
      else wrongCount++;

      return {
        question: a.question,
        options: a.options || [],
        correctAnswer: a.correctAnswer,
        userAnswer: a.userAnswer || null,
        explanation: a.explanation || "",
        isCorrect,
      };
    });

    const totalQuestions = answers.length;
    const score = Math.round((correctCount / totalQuestions) * 100);

    const attempt = await QuizAttempt.create({
      userId: req.user.id,
      topic,
      difficulty,
      totalQuestions,
      correctCount,
      wrongCount,
      skippedCount,
      score,
      timeTakenSeconds: timeTakenSeconds || 0,
      questions: questionResults,
    });

    return res.status(201).json({
      success: true,
      message: "Quiz submitted successfully.",
      data: formatAttempt(attempt),
    });
  } catch (error) {
    console.error("[QuizController] submitQuiz error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to save quiz attempt.",
      error: error.message,
    });
  }
};

// GET /api/quiz/history
// Returns the user's last 20 quiz attempts
exports.getQuizHistory = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .limit(20)
      .select("-questions"); // exclude per-question data for the list view

    return res.status(200).json({
      success: true,
      data: attempts.map(formatAttempt),
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load quiz history.", error: error.message });
  }
};

// GET /api/quiz/stats
// Returns aggregated quiz stats for the dashboard
exports.getQuizStats = async (req, res) => {
  try {
    const attempts = await QuizAttempt.find({ userId: req.user.id }).select(
      "topic difficulty score correctCount totalQuestions createdAt"
    );

    if (attempts.length === 0) {
      return res.status(200).json({
        success: true,
        data: { totalAttempts: 0, averageScore: 0, bestScore: 0, totalCorrect: 0, topicBreakdown: [] },
      });
    }

    const totalAttempts = attempts.length;
    const averageScore = Math.round(attempts.reduce((sum, a) => sum + a.score, 0) / totalAttempts);
    const bestScore = Math.max(...attempts.map((a) => a.score));
    const totalCorrect = attempts.reduce((sum, a) => sum + a.correctCount, 0);

    // Group by topic for breakdown
    const topicMap = {};
    attempts.forEach((a) => {
      if (!topicMap[a.topic]) topicMap[a.topic] = { scores: [], count: 0 };
      topicMap[a.topic].scores.push(a.score);
      topicMap[a.topic].count++;
    });

    const topicBreakdown = Object.entries(topicMap).map(([topic, data]) => ({
      topic,
      count: data.count,
      avgScore: Math.round(data.scores.reduce((s, v) => s + v, 0) / data.scores.length),
    }));

    return res.status(200).json({
      success: true,
      data: { totalAttempts, averageScore, bestScore, totalCorrect, topicBreakdown },
    });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load quiz stats.", error: error.message });
  }
};

// GET /api/quiz/:id
// Returns a single quiz attempt with full question details (for results review)
exports.getQuizAttemptById = async (req, res) => {
  try {
    const attempt = await QuizAttempt.findOne({ _id: req.params.id, userId: req.user.id });
    if (!attempt) {
      return res.status(404).json({ success: false, message: "Quiz attempt not found." });
    }
    return res.status(200).json({ success: true, data: formatAttempt(attempt) });
  } catch (error) {
    return res.status(500).json({ success: false, message: "Failed to load quiz attempt.", error: error.message });
  }
};

function formatAttempt(attempt) {
  const src = attempt.toObject ? attempt.toObject() : attempt;
  return {
    id: src._id,
    topic: src.topic,
    difficulty: src.difficulty,
    totalQuestions: src.totalQuestions,
    correctCount: src.correctCount,
    wrongCount: src.wrongCount,
    skippedCount: src.skippedCount,
    score: src.score,
    timeTakenSeconds: src.timeTakenSeconds,
    questions: src.questions || [],
    completedAt: src.createdAt,
  };
}
