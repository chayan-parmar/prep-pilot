import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/dashboard/TopHeader";
import { getQuizHistoryApi, getQuizStatsApi } from "../../services/quizService";
import toast from "react-hot-toast";
import {
  BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer,
  PieChart, Pie, Cell, LineChart, Line, CartesianGrid, Area, AreaChart,
} from "recharts";
import {
  TrendingUp,
  Trophy,
  Target,
  Brain,
  Clock,
  CheckCircle2,
  XCircle,
  SkipForward,
  Flame,
  Award,
  Loader2,
  BarChart3,
  Calendar,
  ChevronDown,
  ChevronUp,
  HelpCircle,
  Zap,
} from "lucide-react";

const CHART_COLORS = ["#7c3aed", "#06b6d4", "#10b981", "#f59e0b", "#ec4899", "#8b5cf6", "#14b8a6", "#f97316"];
const PIE_COLORS = ["#10b981", "#ef4444", "#f59e0b"];

function ProgressPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [history, setHistory] = useState([]);
  const [expandedAttempt, setExpandedAttempt] = useState(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const [statsResult, historyResult] = await Promise.all([
        getQuizStatsApi(),
        getQuizHistoryApi(),
      ]);
      if (statsResult.success) setStats(statsResult.data);
      if (historyResult.success) setHistory(historyResult.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Prepare chart data
  const topicChartData = stats?.topicBreakdown?.map((t, i) => ({
    name: t.topic.length > 14 ? t.topic.substring(0, 14) + "…" : t.topic,
    fullName: t.topic,
    score: t.avgScore,
    count: t.count,
    fill: CHART_COLORS[i % CHART_COLORS.length],
  })) || [];

  // Score over time (from history, reversed to chronological)
  const scoreOverTime = [...history]
    .reverse()
    .map((h, i) => ({
      name: `#${i + 1}`,
      score: h.score,
      topic: h.topic,
      date: new Date(h.completedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" }),
    }));

  // Difficulty distribution from history
  const difficultyCount = { Easy: 0, Medium: 0, Hard: 0 };
  history.forEach((h) => {
    if (difficultyCount[h.difficulty] !== undefined) difficultyCount[h.difficulty]++;
  });
  const difficultyData = Object.entries(difficultyCount)
    .filter(([_, v]) => v > 0)
    .map(([name, value]) => ({ name, value }));

  // Overall accuracy pie
  const totalCorrect = history.reduce((s, h) => s + (h.correctCount || 0), 0);
  const totalWrong = history.reduce((s, h) => s + (h.wrongCount || 0), 0);
  const totalSkipped = history.reduce((s, h) => s + (h.skippedCount || 0), 0);
  const accuracyData = [
    { name: "Correct", value: totalCorrect },
    { name: "Wrong", value: totalWrong },
    { name: "Skipped", value: totalSkipped },
  ].filter((d) => d.value > 0);

  const CustomTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-[#1a1a30] border border-[#2a2a3d] rounded-xl px-4 py-2.5 shadow-xl">
          <p className="text-xs font-semibold text-white">{payload[0].payload.fullName || payload[0].payload.name}</p>
          <p className="text-[11px] text-[#a78bfa]">
            {payload[0].name === "score" ? `Avg Score: ${payload[0].value}%` : `${payload[0].name}: ${payload[0].value}`}
          </p>
        </div>
      );
    }
    return null;
  };

  const formatTime = (seconds) => {
    if (!seconds) return "0s";
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return m > 0 ? `${m}m ${s}s` : `${s}s`;
  };

  return (
    <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar activeItem="Progress" onItemSelect={() => {}} onCloseMobile={() => setSidebarOpen(false)} />
      </div>
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-6 sm:p-8 max-w-[1440px] w-full mx-auto">
          {/* Page header */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-headings font-bold text-white tracking-tight flex items-center gap-3">
                <TrendingUp className="w-7 h-7 text-[#a78bfa]" />
                Your Progress
              </h1>
              <p className="text-xs sm:text-sm text-[#7e7e9a] mt-1">
                Track your quiz performance, growth, and mastery across topics
              </p>
            </div>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-32 space-y-4">
              <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
              <p className="text-xs text-[#7e7e9a]">Loading your progress data...</p>
            </div>
          ) : !stats || stats.totalAttempts === 0 ? (
            /* Empty state */
            <div className="flex flex-col items-center justify-center py-32 space-y-5">
              <div className="w-24 h-24 rounded-3xl bg-[#131326] border border-[#22223a] flex items-center justify-center">
                <BarChart3 className="w-10 h-10 text-[#3a3a5a]" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-lg font-headings font-bold text-white">No Quiz Data Yet</h2>
                <p className="text-sm text-[#7e7e9a] max-w-sm">
                  Take your first quiz to start seeing your progress here. Your scores, trends, and topic mastery will appear once you complete a quiz.
                </p>
              </div>
              <button
                onClick={() => window.location.href = "/quiz"}
                className="px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#7c3aed]/30 cursor-pointer"
              >
                Take Your First Quiz
              </button>
            </div>
          ) : (
            <>
              {/* Stats cards row */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-8">
                {/* Total Quizzes */}
                <div className="rounded-2xl p-5 bg-[#131326] border border-[#22223a] hover:border-[#7c3aed]/40 transition-all duration-200 shadow-xl shadow-black/20 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-medium text-[#7e7e9a] uppercase tracking-wider">Total Quizzes</span>
                    <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/15 flex items-center justify-center group-hover:bg-[#7c3aed]/25 transition-colors">
                      <HelpCircle className="w-4.5 h-4.5 text-[#a78bfa]" />
                    </div>
                  </div>
                  <p className="text-3xl font-headings font-bold text-white">{stats.totalAttempts}</p>
                  <p className="text-[10px] text-[#5e5e7a] mt-1">quizzes completed</p>
                </div>

                {/* Average Score */}
                <div className="rounded-2xl p-5 bg-[#131326] border border-[#22223a] hover:border-[#06b6d4]/40 transition-all duration-200 shadow-xl shadow-black/20 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-medium text-[#7e7e9a] uppercase tracking-wider">Average Score</span>
                    <div className="w-9 h-9 rounded-xl bg-[#06b6d4]/15 flex items-center justify-center group-hover:bg-[#06b6d4]/25 transition-colors">
                      <Target className="w-4.5 h-4.5 text-[#06b6d4]" />
                    </div>
                  </div>
                  <p className="text-3xl font-headings font-bold text-[#06b6d4]">{stats.averageScore}%</p>
                  <div className="w-full h-1.5 rounded-full bg-[#1a1a30] mt-2">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#06b6d4] to-[#14b8a6] transition-all duration-1000"
                      style={{ width: `${stats.averageScore}%` }}
                    />
                  </div>
                </div>

                {/* Best Score */}
                <div className="rounded-2xl p-5 bg-[#131326] border border-[#22223a] hover:border-[#10b981]/40 transition-all duration-200 shadow-xl shadow-black/20 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-medium text-[#7e7e9a] uppercase tracking-wider">Best Score</span>
                    <div className="w-9 h-9 rounded-xl bg-[#10b981]/15 flex items-center justify-center group-hover:bg-[#10b981]/25 transition-colors">
                      <Trophy className="w-4.5 h-4.5 text-[#10b981]" />
                    </div>
                  </div>
                  <p className="text-3xl font-headings font-bold text-[#10b981]">{stats.bestScore}%</p>
                  <p className="text-[10px] text-[#5e5e7a] mt-1">personal best</p>
                </div>

                {/* Total Correct */}
                <div className="rounded-2xl p-5 bg-[#131326] border border-[#22223a] hover:border-[#f59e0b]/40 transition-all duration-200 shadow-xl shadow-black/20 group">
                  <div className="flex items-center justify-between mb-3">
                    <span className="text-[11px] font-medium text-[#7e7e9a] uppercase tracking-wider">Correct Answers</span>
                    <div className="w-9 h-9 rounded-xl bg-[#f59e0b]/15 flex items-center justify-center group-hover:bg-[#f59e0b]/25 transition-colors">
                      <Zap className="w-4.5 h-4.5 text-[#f59e0b]" />
                    </div>
                  </div>
                  <p className="text-3xl font-headings font-bold text-[#f59e0b]">{stats.totalCorrect}</p>
                  <p className="text-[10px] text-[#5e5e7a] mt-1">questions answered correctly</p>
                </div>
              </div>

              {/* Charts Row */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Score Trend Chart */}
                <div className="rounded-2xl p-6 bg-[#131326] border border-[#22223a] shadow-xl shadow-black/20">
                  <h3 className="text-sm font-headings font-bold text-white mb-1 flex items-center gap-2">
                    <TrendingUp className="w-4 h-4 text-[#a78bfa]" />
                    Score Trend
                  </h3>
                  <p className="text-[10px] text-[#5e5e7a] mb-5">Your quiz scores over time</p>
                  {scoreOverTime.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <AreaChart data={scoreOverTime}>
                        <defs>
                          <linearGradient id="scoreGradient" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#7c3aed" stopOpacity={0.3} />
                            <stop offset="95%" stopColor="#7c3aed" stopOpacity={0} />
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e32" />
                        <XAxis
                          dataKey="date"
                          tick={{ fill: "#5e5e7a", fontSize: 10 }}
                          axisLine={{ stroke: "#1e1e32" }}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fill: "#5e5e7a", fontSize: 10 }}
                          axisLine={{ stroke: "#1e1e32" }}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Area
                          type="monotone"
                          dataKey="score"
                          stroke="#7c3aed"
                          strokeWidth={2.5}
                          fill="url(#scoreGradient)"
                          dot={{ fill: "#7c3aed", strokeWidth: 2, r: 4 }}
                          activeDot={{ r: 6, fill: "#a78bfa", stroke: "#7c3aed", strokeWidth: 2 }}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-xs text-[#5e5e7a] text-center py-12">No data yet</p>
                  )}
                </div>

                {/* Topic Performance Bar Chart */}
                <div className="rounded-2xl p-6 bg-[#131326] border border-[#22223a] shadow-xl shadow-black/20">
                  <h3 className="text-sm font-headings font-bold text-white mb-1 flex items-center gap-2">
                    <Brain className="w-4 h-4 text-[#06b6d4]" />
                    Topic Mastery
                  </h3>
                  <p className="text-[10px] text-[#5e5e7a] mb-5">Average score per topic</p>
                  {topicChartData.length > 0 ? (
                    <ResponsiveContainer width="100%" height={220}>
                      <BarChart data={topicChartData} barSize={28}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#1e1e32" />
                        <XAxis
                          dataKey="name"
                          tick={{ fill: "#5e5e7a", fontSize: 9 }}
                          axisLine={{ stroke: "#1e1e32" }}
                          tickLine={false}
                        />
                        <YAxis
                          domain={[0, 100]}
                          tick={{ fill: "#5e5e7a", fontSize: 10 }}
                          axisLine={{ stroke: "#1e1e32" }}
                          tickLine={false}
                        />
                        <Tooltip content={<CustomTooltip />} />
                        <Bar dataKey="score" radius={[6, 6, 0, 0]}>
                          {topicChartData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.fill} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  ) : (
                    <p className="text-xs text-[#5e5e7a] text-center py-12">No data yet</p>
                  )}
                </div>
              </div>

              {/* Row 2: Accuracy + Difficulty */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
                {/* Accuracy Pie */}
                <div className="rounded-2xl p-6 bg-[#131326] border border-[#22223a] shadow-xl shadow-black/20">
                  <h3 className="text-sm font-headings font-bold text-white mb-1 flex items-center gap-2">
                    <Target className="w-4 h-4 text-[#10b981]" />
                    Overall Accuracy
                  </h3>
                  <p className="text-[10px] text-[#5e5e7a] mb-5">Correct vs Wrong vs Skipped</p>
                  {accuracyData.length > 0 ? (
                    <div className="flex items-center gap-8">
                      <ResponsiveContainer width={160} height={160}>
                        <PieChart>
                          <Pie
                            data={accuracyData}
                            cx="50%"
                            cy="50%"
                            innerRadius={45}
                            outerRadius={70}
                            paddingAngle={3}
                            dataKey="value"
                            stroke="none"
                          >
                            {accuracyData.map((_, i) => (
                              <Cell key={`cell-${i}`} fill={PIE_COLORS[i]} />
                            ))}
                          </Pie>
                        </PieChart>
                      </ResponsiveContainer>
                      <div className="space-y-3">
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#10b981]" />
                          <div>
                            <p className="text-xs font-semibold text-white">{totalCorrect} Correct</p>
                            <p className="text-[10px] text-[#5e5e7a]">
                              {totalCorrect + totalWrong + totalSkipped > 0
                                ? Math.round((totalCorrect / (totalCorrect + totalWrong + totalSkipped)) * 100)
                                : 0}% accuracy
                            </p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#ef4444]" />
                          <div>
                            <p className="text-xs font-semibold text-white">{totalWrong} Wrong</p>
                          </div>
                        </div>
                        <div className="flex items-center gap-3">
                          <div className="w-3 h-3 rounded-full bg-[#f59e0b]" />
                          <div>
                            <p className="text-xs font-semibold text-white">{totalSkipped} Skipped</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <p className="text-xs text-[#5e5e7a] text-center py-12">No data yet</p>
                  )}
                </div>

                {/* Difficulty Distribution */}
                <div className="rounded-2xl p-6 bg-[#131326] border border-[#22223a] shadow-xl shadow-black/20">
                  <h3 className="text-sm font-headings font-bold text-white mb-1 flex items-center gap-2">
                    <Flame className="w-4 h-4 text-[#f59e0b]" />
                    Difficulty Breakdown
                  </h3>
                  <p className="text-[10px] text-[#5e5e7a] mb-5">Quizzes by difficulty level</p>
                  <div className="space-y-4">
                    {[
                      { level: "Easy", count: difficultyCount.Easy, color: "#10b981", bg: "#10b981" },
                      { level: "Medium", count: difficultyCount.Medium, color: "#f59e0b", bg: "#f59e0b" },
                      { level: "Hard", count: difficultyCount.Hard, color: "#ef4444", bg: "#ef4444" },
                    ].map((d) => {
                      const total = history.length || 1;
                      const pct = Math.round((d.count / total) * 100);
                      return (
                        <div key={d.level} className="space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="text-xs font-medium text-white">{d.level}</span>
                            <span className="text-[11px] text-[#7e7e9a]">
                              {d.count} quiz{d.count !== 1 ? "zes" : ""} ({pct}%)
                            </span>
                          </div>
                          <div className="w-full h-2.5 rounded-full bg-[#1a1a30]">
                            <div
                              className="h-full rounded-full transition-all duration-1000"
                              style={{ width: `${pct}%`, backgroundColor: d.bg }}
                            />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Quiz History Table */}
              <div className="rounded-2xl bg-[#131326] border border-[#22223a] shadow-xl shadow-black/20 overflow-hidden">
                <div className="p-6 border-b border-[#1e1e32]">
                  <h3 className="text-sm font-headings font-bold text-white flex items-center gap-2">
                    <Clock className="w-4 h-4 text-[#a78bfa]" />
                    Recent Quiz History
                  </h3>
                  <p className="text-[10px] text-[#5e5e7a] mt-1">Your last 20 quiz attempts</p>
                </div>

                {history.length === 0 ? (
                  <div className="p-12 text-center">
                    <p className="text-xs text-[#5e5e7a]">No quiz attempts yet</p>
                  </div>
                ) : (
                  <div className="divide-y divide-[#1e1e32]">
                    {history.map((attempt) => {
                      const isExpanded = expandedAttempt === attempt.id;
                      const scoreColor =
                        attempt.score >= 80 ? "#10b981" : attempt.score >= 50 ? "#f59e0b" : "#ef4444";
                      const diffColor =
                        attempt.difficulty === "Easy"
                          ? "#10b981"
                          : attempt.difficulty === "Medium"
                          ? "#f59e0b"
                          : "#ef4444";

                      return (
                        <div key={attempt.id}>
                          <button
                            onClick={() => setExpandedAttempt(isExpanded ? null : attempt.id)}
                            className="w-full flex items-center gap-4 p-4 sm:p-5 hover:bg-[#18182e] transition-colors cursor-pointer text-left"
                          >
                            {/* Score badge */}
                            <div
                              className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shrink-0"
                              style={{
                                background: `${scoreColor}15`,
                                color: scoreColor,
                              }}
                            >
                              {attempt.score}%
                            </div>

                            {/* Info */}
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-white truncate">{attempt.topic}</p>
                              <div className="flex items-center gap-3 mt-1">
                                <span
                                  className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                                  style={{ background: `${diffColor}15`, color: diffColor }}
                                >
                                  {attempt.difficulty}
                                </span>
                                <span className="text-[10px] text-[#5e5e7a] flex items-center gap-1">
                                  <CheckCircle2 className="w-3 h-3 text-[#10b981]" />
                                  {attempt.correctCount}/{attempt.totalQuestions}
                                </span>
                                <span className="text-[10px] text-[#5e5e7a] flex items-center gap-1">
                                  <Clock className="w-3 h-3" />
                                  {formatTime(attempt.timeTakenSeconds)}
                                </span>
                              </div>
                            </div>

                            {/* Date + expand */}
                            <div className="hidden sm:block text-right shrink-0">
                              <p className="text-[11px] text-[#7e7e9a]">
                                {new Date(attempt.completedAt).toLocaleDateString("en-US", {
                                  month: "short",
                                  day: "numeric",
                                  year: "numeric",
                                })}
                              </p>
                            </div>
                            {isExpanded ? (
                              <ChevronUp className="w-4 h-4 text-[#5e5e7a] shrink-0" />
                            ) : (
                              <ChevronDown className="w-4 h-4 text-[#5e5e7a] shrink-0" />
                            )}
                          </button>

                          {/* Expanded details */}
                          {isExpanded && (
                            <div className="px-5 pb-5 space-y-3 bg-[#0f0f1c]">
                              <div className="grid grid-cols-3 gap-3">
                                <div className="p-3 rounded-xl bg-[#131326] border border-[#1e1e32] text-center">
                                  <CheckCircle2 className="w-4 h-4 text-[#10b981] mx-auto mb-1" />
                                  <p className="text-lg font-bold text-[#10b981]">{attempt.correctCount}</p>
                                  <p className="text-[9px] text-[#5e5e7a]">Correct</p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#131326] border border-[#1e1e32] text-center">
                                  <XCircle className="w-4 h-4 text-[#ef4444] mx-auto mb-1" />
                                  <p className="text-lg font-bold text-[#ef4444]">{attempt.wrongCount}</p>
                                  <p className="text-[9px] text-[#5e5e7a]">Wrong</p>
                                </div>
                                <div className="p-3 rounded-xl bg-[#131326] border border-[#1e1e32] text-center">
                                  <SkipForward className="w-4 h-4 text-[#f59e0b] mx-auto mb-1" />
                                  <p className="text-lg font-bold text-[#f59e0b]">{attempt.skippedCount}</p>
                                  <p className="text-[9px] text-[#5e5e7a]">Skipped</p>
                                </div>
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </>
          )}
        </main>
      </div>
    </div>
  );
}

export default ProgressPage;
