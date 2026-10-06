const express = require("express");
const multer = require("multer");
const router = express.Router();
const protect = require("../middleware/authMiddleware");
const {
  analyzeResume,
  getResumeAnalyses,
  getResumeAnalysisById,
  deleteResumeAnalysis,
} = require("../controllers/resumeController");

const storage = multer.memoryStorage();
const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const allowedTypes = [
      "application/pdf",
      "application/x-pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "application/msword",
      "text/plain",
      "application/octet-stream",
    ];

    const fileName = (file.originalname || "").toLowerCase();
    if (
      allowedTypes.includes(file.mimetype) ||
      fileName.endsWith(".pdf") ||
      fileName.endsWith(".docx") ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".txt")
    ) {
      cb(null, true);
      return;
    }

    cb(new Error("Invalid file format. Only PDF, DOCX, and TXT files are accepted."));
  },
});

const handleResumeUpload = (req, res, next) => {
  upload.single("resume")(req, res, (err) => {
    if (err instanceof multer.MulterError) {
      return res.status(400).json({
        success: false,
        message: err.code === "LIMIT_FILE_SIZE"
          ? "File size exceeds 10MB limit."
          : `Upload error: ${err.message}`,
      });
    } else if (err) {
      return res.status(400).json({
        success: false,
        message: err.message || "Failed to process resume file upload.",
      });
    }
    next();
  });
};

router.post("/analyze", protect, handleResumeUpload, analyzeResume);
router.get("/history", protect, getResumeAnalyses);
router.get("/:id", protect, getResumeAnalysisById);
router.delete("/:id", protect, deleteResumeAnalysis);

module.exports = router;
