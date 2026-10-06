import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/dashboard/TopHeader";
import ReadinessDonut from "../../components/dashboard/ReadinessDonut";
import ProgressLineChart from "../../components/dashboard/ProgressLineChart";
import { getDashboardStatsApi } from "../../services/dashboardService";
import {
  Sparkles,
  Video,
  CheckCircle2,
  Code2,
  Info,
  Calendar,
  ChevronDown,
  BookOpen,
  FileText,
  HelpCircle,
  Flame,
  Check,
  Loader2,
  AlertTriangle,
} from "lucide-react";

function DashboardPage() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const userName = user?.name ? user.name.split(" ")[0] : "User";

  const [activeTab, setActiveTab] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Dashboard data state
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Today's Plan Checklist State (local/interactive only)
  const [tasks, setTasks] = useState([
    { id: 1, text: "Analyze Your Resume", completed: false },
    { id: 2, text: "Take 1 Quiz (10 Questions)", completed: false },
    { id: 3, text: "Review Quiz Results", completed: false },
    { id: 4, text: "Improve Weak Areas", completed: false },
  ]);

  // Fetch dashboard stats from backend
  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await getDashboardStatsApi();
        if (response.success) {
          setStats(response.data);

          // Auto-check tasks based on real data
          const data = response.data;
          setTasks((prev) =>
            prev.map((task) => {
              if (task.id === 1 && data.totalResumes > 0) return { ...task, completed: true };
              if (task.id === 2 && data.totalQuizzes > 0) return { ...task, completed: true };
              if (task.id === 3 && data.totalQuizzes > 0) return { ...task, completed: true };
              return task;
            })
          );
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const toggleTask = (id) => {
    setTasks(
      tasks.map((task) =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Loading State
  if (loading) {
    return (
      <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased">
        <div
          className={`fixed inset-y-0 left-0 z-50 transform ${
            sidebarOpen ? "translate-x-0" : "-translate-x-full"
          } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
        >
          <Sidebar activeItem={activeTab} onItemSelect={(item) => setActiveTab(item)} onCloseMobile={() => setSidebarOpen(false)} />
        </div>
        <div className="flex-1 flex flex-col min-w-0">
          <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 flex items-center justify-center">
            <div className="flex flex-col items-center gap-4 animate-pulse">
              <Loader2 className="w-10 h-10 text-[#7c3aed] animate-spin" />
              <p className="text-sm text-[#7e7e9a]">Loading your dashboard...</p>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // Derived data from stats (with safe fallbacks)
  const overallProgress = stats?.overallProgress ?? 0;
  const quizAccuracy = stats?.quizAccuracy ?? 0;
  const quizAccuracyChange = stats?.quizAccuracyChange ?? 0;
  const totalQuizzes = stats?.totalQuizzes ?? 0;
  const quizzesThisWeek = stats?.quizzesThisWeek ?? 0;
  const totalResumes = stats?.totalResumes ?? 0;
  const latestAtsScore = stats?.latestAtsScore ?? 0;
  const strengths = stats?.strengths ?? [];
  const weaknesses = stats?.weaknesses ?? [];
  const streakDays = stats?.streakDays ?? [];
  const streakCount = stats?.streakCount ?? 0;
  const recentActivity = stats?.recentActivity ?? [];
  const progressChart = stats?.progressChart ?? [];

  // Helper to render change indicator
  const renderChange = (value, suffix = "this week") => {
    if (value > 0) {
      return (
        <div className="text-xs font-semibold text-[#10b981] flex items-center gap-1">
          <span>📈</span> +{value}% {suffix}
        </div>
      );
    } else if (value < 0) {
      return (
        <div className="text-xs font-semibold text-[#ef4444] flex items-center gap-1">
          <span>📉</span> {value}% {suffix}
        </div>
      );
    }
    return (
      <div className="text-xs font-semibold text-[#7e7e9a] flex items-center gap-1">
        <span>➖</span> No change
      </div>
    );
  };

  // Icon for activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "quiz":
        return <HelpCircle className="w-4 h-4" />;
      case "resume":
        return <FileText className="w-4 h-4" />;
      case "interview":
        return <Video className="w-4 h-4" />;
      default:
        return <Sparkles className="w-4 h-4" />;
    }
  };

  const getScoreColor = (score) => {
    if (typeof score === "string") {
      if (score.includes("Great")) return "text-[#10b981]";
      if (score.includes("Good")) return "text-[#eab308]";
      return "text-[#ef4444]";
    }
    return "text-[#10b981]";
  };

  return (
    <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      {/* Sidebar Component (Desktop & Mobile Drawer) */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar activeItem={activeTab} onItemSelect={(item) => setActiveTab(item)} onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {/* Backdrop overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      {/* Main Container Area */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        {/* Top Header Navigation */}
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* Dashboard Main Content Body - padding: 24px */}
        <main className="dashboard flex-1 p-6 sm:p-8 max-w-[1440px] w-full mx-auto">
          {/* Top Greeting Section & Timeframe Picker */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h1 className="text-2xl sm:text-3xl font-headings font-bold text-white tracking-tight">
                Welcome back, {userName}
              </h1>
              <p className="text-xs sm:text-sm text-[#7e7e9a] mt-1">
                {totalQuizzes > 0 || totalResumes > 0
                  ? "Here's your real-time performance snapshot!"
                  : "Start taking quizzes and analyzing resumes to see your stats!"}
              </p>
            </div>

            {/* Dropdown Filter Pill */}
            <button className="inline-flex items-center gap-2.5 px-4 py-2.5 rounded-xl bg-[#131326] border border-[#22223a] text-xs font-semibold text-[#e8e8f0] hover:bg-[#181830] transition-colors cursor-pointer self-start sm:self-auto shadow-sm">
              <Calendar className="w-3.5 h-3.5 text-[#8e8ea8]" />
              <span>This Week</span>
              <ChevronDown className="w-3.5 h-3.5 text-[#8e8ea8]" />
            </button>
          </div>

          {/* Error Banner */}
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 flex items-center gap-3 text-xs text-[#ef4444]">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* ROW 1: stats-container (repeat(4, 1fr), gap: 24px, margin-bottom: 24px) */}
          <div className="stats-container grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
            {/* Card 1: Overall Progress */}
            <div className="card rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-4 hover:border-[#7c3aed]/40 transition-all duration-200 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#7e7e9a]">Overall Progress</span>
                <Sparkles className="w-4 h-4 text-[#a78bfa]" />
              </div>
              <div className="text-3xl font-headings font-bold text-[#a78bfa]">{overallProgress}%</div>
              {renderChange(quizAccuracyChange)}
            </div>

            {/* Card 2: Total Quizzes */}
            <div className="card rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-4 hover:border-[#7c3aed]/40 transition-all duration-200 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#7e7e9a]">Total Quizzes</span>
                <HelpCircle className="w-4 h-4 text-[#22d3ee]" />
              </div>
              <div className="text-3xl font-headings font-bold text-[#22d3ee]">{totalQuizzes}</div>
              <div className="text-xs font-semibold text-[#10b981] flex items-center gap-1">
                <span>📈</span> {quizzesThisWeek > 0 ? `+${quizzesThisWeek} this week` : "Take your first quiz!"}
              </div>
            </div>

            {/* Card 3: Quiz Accuracy */}
            <div className="card rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-4 hover:border-[#7c3aed]/40 transition-all duration-200 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#7e7e9a]">Quiz Accuracy</span>
                <CheckCircle2 className="w-4 h-4 text-[#10b981]" />
              </div>
              <div className="text-3xl font-headings font-bold text-[#10b981]">{quizAccuracy}%</div>
              {renderChange(quizAccuracyChange)}
            </div>

            {/* Card 4: Resume Score */}
            <div className="card rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-4 hover:border-[#7c3aed]/40 transition-all duration-200 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-[#7e7e9a]">Resume ATS Score</span>
                <FileText className="w-4 h-4 text-[#f97316]" />
              </div>
              <div className="text-3xl font-headings font-bold text-[#f97316]">
                {totalResumes > 0 ? latestAtsScore : "—"}
              </div>
              <div className="text-xs font-semibold text-[#7e7e9a] flex items-center gap-1">
                {totalResumes > 0
                  ? <><span>📄</span> {totalResumes} resume{totalResumes > 1 ? "s" : ""} analyzed</>
                  : <><span>📄</span> Upload your resume!</>}
              </div>
            </div>
          </div>

          {/* ROW 2: bottom-container (1.4fr 1fr, gap: 30px, margin-bottom: 24px) */}
          <div className="bottom-container grid grid-cols-1 lg:grid-cols-[1.4fr_1fr] gap-[30px] mb-6">
            {/* Left Card: Interview Readiness Score */}
            <div className="card rounded-[20px] p-6 sm:p-7 bg-[#131326] border border-[#22223a] space-y-6 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-headings font-bold text-white flex items-center gap-2">
                  Interview Readiness Score
                </h3>
                <Info className="w-4 h-4 text-[#7e7e9a] cursor-pointer hover:text-white" />
              </div>

              {/* Donut Chart Gauge & Action Button Component */}
              <ReadinessDonut score={overallProgress} targetScore={90} />
            </div>

            {/* Right Card: Strengths & Weaknesses */}
            <div className="card rounded-[20px] p-6 sm:p-7 bg-[#131326] border border-[#22223a] space-y-5 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-headings font-bold text-white">
                  Strengths & Weaknesses
                </h3>
                <div className="w-7 h-7 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center text-xs font-bold text-[#a78bfa]">
                  {userName[0]}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4 pt-1">
                {/* Top Strengths Column */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#10b981] block">
                    Top Strengths
                  </span>
                  <ul className="space-y-2 text-xs text-[#d1d1e0]">
                    {strengths.length > 0 ? (
                      strengths.map((s, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#10b981]" />
                          <span>{s}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#7e7e9a] italic">Take quizzes to discover</li>
                    )}
                  </ul>
                </div>

                {/* Weak Areas Column */}
                <div className="space-y-3">
                  <span className="text-xs font-bold text-[#ef4444] block">
                    Weak Areas
                  </span>
                  <ul className="space-y-2 text-xs text-[#d1d1e0]">
                    {weaknesses.length > 0 ? (
                      weaknesses.map((w, i) => (
                        <li key={i} className="flex items-center gap-2">
                          <span className="w-2 h-2 rounded-full bg-[#ef4444]" />
                          <span>{w}</span>
                        </li>
                      ))
                    ) : (
                      <li className="text-[#7e7e9a] italic">Keep practicing!</li>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* ROW 3: repeat(3, 1fr), gap: 24px, margin-bottom: 24px */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* Card 1: Study Streak */}
            <div className="card rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-5 shadow-xl shadow-black/20">
              <div>
                <h3 className="text-base font-headings font-bold text-white">Study Streak</h3>
                <p className="text-xs text-[#7e7e9a] mt-0.5">
                  {streakCount > 0
                    ? `${streakCount} day${streakCount > 1 ? "s" : ""} streak! Keep it up 🔥`
                    : "Start studying to build your streak!"}
                </p>
              </div>

              {/* 8 Flame Columns Grid */}
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-2 pt-2">
                {streakDays.map((item, idx) => (
                  <div
                    key={idx}
                    className="flex flex-col items-center gap-2 text-center"
                  >
                    <div
                      className={`w-8 h-10 rounded-xl flex items-center justify-center transition-all ${
                        item.active
                          ? "bg-[#ff7a00]/15 border border-[#ff7a00]/30 text-[#ff7a00] shadow-sm shadow-[#ff7a00]/10"
                          : "bg-[#18182e] border border-[#24243a] text-[#555570]"
                      }`}
                    >
                      <Flame
                        className={`w-4 h-4 ${
                          item.active ? "fill-[#ff7a00]" : ""
                        }`}
                      />
                    </div>
                    <span className="text-[10px] font-medium text-[#7e7e9a]">
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Card 2: Today's Plan */}
            <div className="card rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-5 flex flex-col justify-between shadow-xl shadow-black/20">
              <div>
                <h3 className="text-base font-headings font-bold text-white">Today's Plan</h3>
                <div className="space-y-2.5 pt-3">
                  {tasks.map((task) => (
                    <div
                      key={task.id}
                      onClick={() => toggleTask(task.id)}
                      className="flex items-center gap-3 cursor-pointer group"
                    >
                      <div
                        className={`w-4 h-4 rounded-md border flex items-center justify-center transition-colors ${
                          task.completed
                            ? "bg-[#10b981] border-[#10b981] text-white"
                            : "border-[#383852] group-hover:border-[#7c3aed]"
                        }`}
                      >
                        {task.completed && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                      <span
                        className={`text-xs font-medium transition-all ${
                          task.completed
                            ? "text-[#666680] line-through"
                            : "text-[#e8e8f0] group-hover:text-white"
                        }`}
                      >
                        {task.text}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                onClick={() => navigate("/quiz")}
                className="w-full py-2.5 bg-[#7c3aed] hover:bg-[#6d28d9] text-white text-xs font-semibold rounded-xl transition-all shadow-md shadow-[#7c3aed]/20 cursor-pointer"
              >
                Start Now
              </button>
            </div>

            {/* Card 3: Recommended for You */}
            <div className="card rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-4 shadow-xl shadow-black/20">
              <h3 className="text-base font-headings font-bold text-white">
                Recommended for You
              </h3>

              <div className="space-y-3 pt-1">
                {/* Dynamic recommendations based on weaknesses */}
                {weaknesses.length > 0 ? (
                  weaknesses.slice(0, 3).map((topic, idx) => (
                    <div
                      key={idx}
                      onClick={() => navigate("/quiz")}
                      className="p-3 rounded-2xl bg-[#17172e] border border-[#22223c] flex items-center gap-3 hover:border-[#7c3aed]/40 transition-colors cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center text-[#a78bfa] shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Practice: {topic}</h4>
                        <p className="text-[10px] text-[#7e7e9a] mt-0.5">Quiz • Improve weak area</p>
                      </div>
                    </div>
                  ))
                ) : (
                  <>
                    <div
                      onClick={() => navigate("/quiz")}
                      className="p-3 rounded-2xl bg-[#17172e] border border-[#22223c] flex items-center gap-3 hover:border-[#7c3aed]/40 transition-colors cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center text-[#a78bfa] shrink-0">
                        <HelpCircle className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Take Your First Quiz</h4>
                        <p className="text-[10px] text-[#7e7e9a] mt-0.5">Quiz • Get started</p>
                      </div>
                    </div>
                    <div
                      onClick={() => navigate("/resume-analyzer")}
                      className="p-3 rounded-2xl bg-[#17172e] border border-[#22223c] flex items-center gap-3 hover:border-[#7c3aed]/40 transition-colors cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center text-[#a78bfa] shrink-0">
                        <FileText className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Analyze Your Resume</h4>
                        <p className="text-[10px] text-[#7e7e9a] mt-0.5">Resume • ATS Check</p>
                      </div>
                    </div>
                    <div
                      onClick={() => navigate("/roadmap")}
                      className="p-3 rounded-2xl bg-[#17172e] border border-[#22223c] flex items-center gap-3 hover:border-[#7c3aed]/40 transition-colors cursor-pointer"
                    >
                      <div className="w-9 h-9 rounded-xl bg-[#7c3aed]/20 border border-[#7c3aed]/40 flex items-center justify-center text-[#a78bfa] shrink-0">
                        <BookOpen className="w-4 h-4" />
                      </div>
                      <div>
                        <h4 className="text-xs font-semibold text-white">Build Your Roadmap</h4>
                        <p className="text-[10px] text-[#7e7e9a] mt-0.5">Roadmap • Personalized</p>
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>

          {/* ROW 4: repeat(2, 1fr), gap: 24px */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Left Card: Recent Activity */}
            <div className="card rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-5 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-headings font-bold text-white">Recent Activity</h3>
                <button
                  onClick={() => navigate("/progress")}
                  className="text-xs font-semibold text-[#7c3aed] hover:text-[#a78bfa] transition-colors cursor-pointer"
                >
                  View All Activity
                </button>
              </div>

              <div className="space-y-3.5 pt-1">
                {recentActivity.length > 0 ? (
                  recentActivity.map((activity, idx) => (
                    <div
                      key={idx}
                      className={`flex items-center justify-between text-xs pb-3 ${
                        idx < recentActivity.length - 1 ? "border-b border-[#1e1e34]" : ""
                      } hover:bg-[#181830] p-1.5 -mx-1.5 rounded-xl transition-colors cursor-pointer`}
                      onClick={() => {
                        if (activity.type === "quiz") navigate("/quiz");
                        else if (activity.type === "resume") navigate("/resume-analyzer");
                      }}
                    >
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-xl bg-[#181830] border border-[#242440] flex items-center justify-center text-[#8e8ea8]">
                          {getActivityIcon(activity.type)}
                        </div>
                        <span className="font-medium text-white">
                          {activity.title}
                        </span>
                      </div>
                      <span className={`font-bold ${getScoreColor(activity.score)}`}>
                        {activity.score}
                      </span>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-[#7e7e9a] text-xs space-y-2">
                    <div className="text-2xl">📋</div>
                    <p>No activity yet. Start a quiz or analyze your resume!</p>
                  </div>
                )}
              </div>
            </div>

            {/* Right Card: Progress Overview Line Chart */}
            <div className="card rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-5 shadow-xl shadow-black/20">
              <div className="flex items-center justify-between">
                <h3 className="text-base font-headings font-bold text-white">
                  Progress Overview
                </h3>
                <button className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-[#171730] border border-[#242440] text-xs font-medium text-[#7e7e9a] hover:text-white cursor-pointer">
                  <span>This Week</span>
                  <ChevronDown className="w-3 h-3" />
                </button>
              </div>

              {/* Chart */}
              <div className="pt-2">
                <ProgressLineChart data={progressChart} />
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default DashboardPage;