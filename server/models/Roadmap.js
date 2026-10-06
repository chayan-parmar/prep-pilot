const mongoose = require("mongoose");

const milestoneSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    description: { type: String, default: "" },
    duration: { type: String, default: "" }, // e.g. "1-2 weeks"
    topics: [{ type: String }],
    resources: [
      {
        name: { type: String },
        url: { type: String, default: "" },
        type: { type: String, enum: ["article", "video", "course", "docs", "project"], default: "article" },
      },
    ],
    isCompleted: { type: Boolean, default: false },
    order: { type: Number, default: 0 },
  },
  { _id: true }
);

const roadmapSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    title: { type: String, required: true, trim: true },
    description: { type: String, default: "" },
    category: {
      type: String,
      enum: [
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
      ],
      default: "Other",
    },
    skillLevel: {
      type: String,
      enum: ["Beginner", "Intermediate", "Advanced"],
      default: "Beginner",
    },
    targetGoal: { type: String, default: "" }, // e.g. "Get a frontend developer job"
    estimatedDuration: { type: String, default: "" }, // e.g. "3-6 months"
    milestones: [milestoneSchema],
    completedMilestones: { type: Number, default: 0 },
    totalMilestones: { type: Number, default: 0 },
    progressPercent: { type: Number, min: 0, max: 100, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// Compound index for fast retrieval
roadmapSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Roadmap", roadmapSchema);
