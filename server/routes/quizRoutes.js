const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  generateQuiz,
  submitQuiz,
  getQuizHistory,
  getQuizStats,
  getQuizAttemptById,
} = require("../controllers/quizController");

// All quiz routes require authentication
router.post("/generate", authMiddleware, generateQuiz);
router.post("/submit", authMiddleware, submitQuiz);
router.get("/history", authMiddleware, getQuizHistory);
router.get("/stats", authMiddleware, getQuizStats);
router.get("/:id", authMiddleware, getQuizAttemptById);

module.exports = router;
