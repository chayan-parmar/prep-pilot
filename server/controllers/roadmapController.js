const Roadmap = require("../models/Roadmap");
const { generateRoadmap } = require("../services/roadmapGeneratorService");

// POST /api/roadmap/generate
// Generates an AI-powered learning roadmap and saves it to DB
exports.createRoadmap = async (req, res) => {
  try {
    const { category, skillLevel, targetGoal } = req.body;

    if (!category || !skillLevel) {
      return res.status(400).json({
        success: false,
        message: "category and skillLevel are required.",
      });
    }

    const validCategories = [
      "Frontend Development",
      "Backend Development",
      "Full-Stack Development",
      "Data Structures & Algorithms",
      "System Design",
      "Machine Learning",
      "DevOps & Cloud",
      "Mobile Development",
      "Cybersecurity",
      "Database Engineering",
      "Other",
    ];

    if (!validCategories.includes(category)) {
      return res.status(400).json({
        success: false,
        message: "Invalid category.",
      });
    }

    const validLevels = ["Beginner", "Intermediate", "Advanced"];
    if (!validLevels.includes(skillLevel)) {
      return res.status(400).json({
        success: false,
        message: "skillLevel must be Beginner, Intermediate, or Advanced.",
      });
    }

    // Generate roadmap via AI
    const aiResult = await generateRoadmap({ category, skillLevel, targetGoal });

    // Save to database
    const roadmap = await Roadmap.create({
      userId: req.user.id,
      title: aiResult.title,
      description: aiResult.description,
      category,
      skillLevel,
      targetGoal: targetGoal || "",
      estimatedDuration: aiResult.estimatedDuration,
      milestones: aiResult.milestones,
      totalMilestones: aiResult.milestones.length,
      completedMilestones: 0,
      progressPercent: 0,
    });

    return res.status(201).json({
      success: true,
      message: "Roadmap generated successfully.",
      data: formatRoadmap(roadmap),
    });
  } catch (error) {
    console.error("[RoadmapController] createRoadmap error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to generate roadmap. Please try again.",
      error: error.message,
    });
  }
};

// GET /api/roadmap
// Returns all roadmaps for the user
exports.getRoadmaps = async (req, res) => {
  try {
    const roadmaps = await Roadmap.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .select("-milestones"); // Exclude milestones for list view

    return res.status(200).json({
      success: true,
      data: roadmaps.map(formatRoadmap),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load roadmaps.",
      error: error.message,
    });
  }
};

// GET /api/roadmap/:id
// Returns a single roadmap with full milestone details
exports.getRoadmapById = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found.",
      });
    }

    return res.status(200).json({
      success: true,
      data: formatRoadmap(roadmap),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to load roadmap.",
      error: error.message,
    });
  }
};

// PATCH /api/roadmap/:id/milestone/:milestoneId/toggle
// Toggles a milestone's completion status
exports.toggleMilestone = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOne({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found.",
      });
    }

    const milestone = roadmap.milestones.id(req.params.milestoneId);
    if (!milestone) {
      return res.status(404).json({
        success: false,
        message: "Milestone not found.",
      });
    }

    // Toggle completion
    milestone.isCompleted = !milestone.isCompleted;

    // Recalculate progress
    const completed = roadmap.milestones.filter((m) => m.isCompleted).length;
    roadmap.completedMilestones = completed;
    roadmap.progressPercent = Math.round(
      (completed / roadmap.totalMilestones) * 100
    );

    await roadmap.save();

    return res.status(200).json({
      success: true,
      message: milestone.isCompleted
        ? "Milestone completed!"
        : "Milestone uncompleted.",
      data: formatRoadmap(roadmap),
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to update milestone.",
      error: error.message,
    });
  }
};

// DELETE /api/roadmap/:id
// Deletes a roadmap
exports.deleteRoadmap = async (req, res) => {
  try {
    const roadmap = await Roadmap.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.id,
    });

    if (!roadmap) {
      return res.status(404).json({
        success: false,
        message: "Roadmap not found.",
      });
    }

    return res.status(200).json({
      success: true,
      message: "Roadmap deleted successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Failed to delete roadmap.",
      error: error.message,
    });
  }
};

function formatRoadmap(roadmap) {
  const src = roadmap.toObject ? roadmap.toObject() : roadmap;
  return {
    id: src._id,
    title: src.title,
    description: src.description,
    category: src.category,
    skillLevel: src.skillLevel,
    targetGoal: src.targetGoal,
    estimatedDuration: src.estimatedDuration,
    milestones: src.milestones || [],
    completedMilestones: src.completedMilestones,
    totalMilestones: src.totalMilestones,
    progressPercent: src.progressPercent,
    isActive: src.isActive,
    createdAt: src.createdAt,
  };
}
