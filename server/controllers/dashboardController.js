const QuizAttempt = require("../models/QuizAttempt");
const ResumeAnalysis = require("../models/ResumeAnalysis");

// GET /api/dashboard/stats
// Returns aggregated dashboard data for the logged-in user
exports.getDashboardStats = async (req, res) => {
  try {
    const userId = req.user.id;

    // ── Fetch all quiz attempts ──
    const quizAttempts = await QuizAttempt.find({ userId })
      .sort({ createdAt: -1 })
      .select("topic difficulty score correctCount wrongCount skippedCount totalQuestions timeTakenSeconds createdAt");

    // ── Fetch all resume analyses ──
    const resumeAnalyses = await ResumeAnalysis.find({ userId })
      .sort({ createdAt: -1 })
      .select("fileName targetRole atsScore matchedKeywords missingKeywords createdAt");

    // ── Quiz Stats ──
    const totalQuizzes = quizAttempts.length;
    const totalCorrect = quizAttempts.reduce((sum, a) => sum + a.correctCount, 0);
    const totalQuestions = quizAttempts.reduce((sum, a) => sum + a.totalQuestions, 0);
    const quizAccuracy = totalQuestions > 0 ? Math.round((totalCorrect / totalQuestions) * 100) : 0;
    const averageQuizScore = totalQuizzes > 0
      ? Math.round(quizAttempts.reduce((sum, a) => sum + a.score, 0) / totalQuizzes)
      : 0;

    // ── Weekly comparison for quiz accuracy ──
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const twoWeeksAgo = new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);

    const thisWeekQuizzes = quizAttempts.filter(a => new Date(a.createdAt) >= oneWeekAgo);
    const lastWeekQuizzes = quizAttempts.filter(a => {
      const d = new Date(a.createdAt);
      return d >= twoWeeksAgo && d < oneWeekAgo;
    });

    const thisWeekAccuracy = thisWeekQuizzes.length > 0
      ? Math.round(thisWeekQuizzes.reduce((s, a) => s + a.score, 0) / thisWeekQuizzes.length)
      : null;
    const lastWeekAccuracy = lastWeekQuizzes.length > 0
      ? Math.round(lastWeekQuizzes.reduce((s, a) => s + a.score, 0) / lastWeekQuizzes.length)
      : null;

    const quizAccuracyChange = (thisWeekAccuracy !== null && lastWeekAccuracy !== null)
      ? thisWeekAccuracy - lastWeekAccuracy
      : 0;

    const quizzesThisWeek = thisWeekQuizzes.length;

    // ── Resume Stats ──
    const totalResumes = resumeAnalyses.length;
    const latestResume = resumeAnalyses.length > 0 ? resumeAnalyses[0] : null;
    const latestAtsScore = latestResume?.atsScore || 0;

    // ── Overall Progress (weighted: quiz avg + resume ATS) ──
    let overallProgress = 0;
    if (totalQuizzes > 0 && totalResumes > 0) {
      overallProgress = Math.round((averageQuizScore * 0.6) + (latestAtsScore * 0.4));
    } else if (totalQuizzes > 0) {
      overallProgress = averageQuizScore;
    } else if (totalResumes > 0) {
      overallProgress = latestAtsScore;
    }

    // ── Strengths & Weaknesses (from quiz topic breakdown + resume keywords) ──
    const topicMap = {};
    quizAttempts.forEach(a => {
      if (!topicMap[a.topic]) topicMap[a.topic] = { scores: [], count: 0 };
      topicMap[a.topic].scores.push(a.score);
      topicMap[a.topic].count++;
    });

    const topicBreakdown = Object.entries(topicMap).map(([topic, data]) => ({
      topic,
      count: data.count,
      avgScore: Math.round(data.scores.reduce((s, v) => s + v, 0) / data.scores.length),
    }));

    // Sort by avgScore: top strengths vs weaknesses
    const sortedTopics = [...topicBreakdown].sort((a, b) => b.avgScore - a.avgScore);
    const strengths = sortedTopics.slice(0, 4).map(t => t.topic);
    const weaknesses = sortedTopics.slice(-3).reverse().map(t => t.topic);

    // Also incorporate matched/missing keywords from latest resume
    const resumeStrengths = latestResume?.matchedKeywords?.slice(0, 4) || [];
    const resumeWeaknesses = latestResume?.missingKeywords?.slice(0, 3) || [];

    // Merge: quiz topic strengths + resume matched keywords (deduplicated)
    const mergedStrengths = [...new Set([...strengths, ...resumeStrengths])].slice(0, 4);
    const mergedWeaknesses = [...new Set([...weaknesses, ...resumeWeaknesses])].slice(0, 3);

    // ── Study Streak (days with quiz/resume activity in the last 8 days) ──
    const streakDays = [];
    for (let i = 7; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const hasQuizActivity = quizAttempts.some(a => {
        const d = new Date(a.createdAt);
        return d >= dayStart && d < dayEnd;
      });
      const hasResumeActivity = resumeAnalyses.some(a => {
        const d = new Date(a.createdAt);
        return d >= dayStart && d < dayEnd;
      });

      streakDays.push({
        date: dayStart.toISOString().split("T")[0],
        label: i === 0 ? "Today" : dayStart.toLocaleDateString("en-US", { day: "numeric", month: "short" }),
        active: hasQuizActivity || hasResumeActivity,
      });
    }

    // Calculate consecutive streak count
    let streakCount = 0;
    for (let i = streakDays.length - 1; i >= 0; i--) {
      if (streakDays[i].active) streakCount++;
      else break;
    }

    // ── Recent Activity (last 5 quiz + resume events) ──
    const recentActivity = [];
    quizAttempts.slice(0, 5).forEach(a => {
      recentActivity.push({
        type: "quiz",
        title: `Completed Quiz on ${a.topic}`,
        score: `${a.score}%`,
        date: a.createdAt,
      });
    });
    resumeAnalyses.slice(0, 3).forEach(a => {
      const matchLabel = a.atsScore >= 80 ? "Great Match" : a.atsScore >= 60 ? "Good Match" : "Needs Work";
      recentActivity.push({
        type: "resume",
        title: `Resume Analyzed — ${a.targetRole}`,
        score: matchLabel,
        date: a.createdAt,
      });
    });
    // Sort by date descending
    recentActivity.sort((a, b) => new Date(b.date) - new Date(a.date));

    // ── Progress Chart (last 7 days quiz scores) ──
    const progressChart = [];
    for (let i = 6; i >= 0; i--) {
      const dayStart = new Date(now);
      dayStart.setHours(0, 0, 0, 0);
      dayStart.setDate(dayStart.getDate() - i);
      const dayEnd = new Date(dayStart);
      dayEnd.setDate(dayEnd.getDate() + 1);

      const dayQuizzes = quizAttempts.filter(a => {
        const d = new Date(a.createdAt);
        return d >= dayStart && d < dayEnd;
      });

      const dayLabel = dayStart.toLocaleDateString("en-US", { weekday: "short" });
      const avgScore = dayQuizzes.length > 0
        ? Math.round(dayQuizzes.reduce((s, a) => s + a.score, 0) / dayQuizzes.length)
        : null;

      progressChart.push({
        day: dayLabel,
        score: avgScore,
      });
    }

    return res.status(200).json({
      success: true,
      data: {
        overallProgress,
        quizAccuracy,
        quizAccuracyChange,
        totalQuizzes,
        quizzesThisWeek,
        totalResumes,
        latestAtsScore,
        averageQuizScore,
        strengths: mergedStrengths,
        weaknesses: mergedWeaknesses,
        streakDays,
        streakCount,
        recentActivity: recentActivity.slice(0, 6),
        progressChart,
        topicBreakdown,
      },
    });
  } catch (error) {
    console.error("[DashboardController] getDashboardStats error:", error.message);
    return res.status(500).json({
      success: false,
      message: "Failed to load dashboard stats.",
      error: error.message,
    });
  }
};
