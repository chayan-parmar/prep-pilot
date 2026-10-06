const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
  createRoadmap,
  getRoadmaps,
  getRoadmapById,
  toggleMilestone,
  deleteRoadmap,
} = require("../controllers/roadmapController");

// All roadmap routes require authentication
router.post("/generate", authMiddleware, createRoadmap);
router.get("/", authMiddleware, getRoadmaps);
router.get("/:id", authMiddleware, getRoadmapById);
router.patch("/:id/milestone/:milestoneId/toggle", authMiddleware, toggleMilestone);
router.delete("/:id", authMiddleware, deleteRoadmap);

module.exports = router;
