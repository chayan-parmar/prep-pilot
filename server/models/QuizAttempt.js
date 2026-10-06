const mongoose = require("mongoose");

const questionResultSchema = new mongoose.Schema(
  {
    question: { type: String, required: true },
    options: [{ type: String }],
    correctAnswer: { type: String, required: true },
    userAnswer: { type: String, default: null }, // null = skipped
    explanation: { type: String, default: "" },
    isCorrect: { type: Boolean, default: false },
  },
  { _id: false }
);

const quizAttemptSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    topic: { type: String, required: true, trim: true },
    difficulty: {
      type: String,
      enum: ["Easy", "Medium", "Hard"],
      required: true,
    },
    totalQuestions: { type: Number, default: 10 },
    correctCount: { type: Number, default: 0 },
    wrongCount: { type: Number, default: 0 },
    skippedCount: { type: Number, default: 0 },
    score: { type: Number, min: 0, max: 100, default: 0 }, // percentage
    timeTakenSeconds: { type: Number, default: 0 },
    questions: [questionResultSchema],
  },
  { timestamps: true }
);

// Compound index for fast user history retrieval
quizAttemptSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("QuizAttempt", quizAttemptSchema);
