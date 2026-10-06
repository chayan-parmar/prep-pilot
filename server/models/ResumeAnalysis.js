const mongoose = require("mongoose");

const scoreBreakdownSchema = new mongoose.Schema(
  {
    formattingScore: { type: Number, min: 0, max: 100, required: true },
    keywordScore: { type: Number, min: 0, max: 100, required: true },
    impactScore: { type: Number, min: 0, max: 100, required: true },
    brevityScore: { type: Number, min: 0, max: 100, required: true },
  },
  { _id: false }
);

const bulletSuggestionSchema = new mongoose.Schema(
  {
    section: { type: String, default: "Experience" },
    original: { type: String, default: "" },
    improved: { type: String, default: "" },
    metricGain: { type: String, default: "" },
    rationale: { type: String, default: "" },
  },
  { _id: false }
);

const formatCheckSchema = new mongoose.Schema(
  {
    rule: { type: String, required: true },
    passed: { type: Boolean, required: true },
    detail: { type: String, required: true },
  },
  { _id: false }
);

const resumeAnalysisSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
      required: true,
      index: true,
    },
    fileName: { type: String, required: true },
    fileType: { type: String, default: "" },
    fileSize: { type: Number, default: 0 },
    targetRole: { type: String, required: true, trim: true },
    atsScore: { type: Number, min: 0, max: 100, required: true },
    scoreBreakdown: { type: scoreBreakdownSchema, required: true },
    matchedKeywords: [{ type: String }],
    missingKeywords: [{ type: String }],
    bulletSuggestions: [bulletSuggestionSchema],
    formatChecks: [formatCheckSchema],
    extractedTextPreview: { type: String, default: "" },
    wordCount: { type: Number, default: 0 },
    aiSummary: { type: String, default: "" },
  },
  { timestamps: true }
);

module.exports = mongoose.model("ResumeAnalysis", resumeAnalysisSchema);
