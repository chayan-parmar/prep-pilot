import React, { useState, useEffect, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/dashboard/TopHeader";
import { toast } from "react-hot-toast";
import { generateQuizApi, submitQuizApi } from "../../services/quizService";
import {
  Clock,
  X,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Flag,
  RotateCcw,
  Sparkles,
  Loader2,
  Trophy,
  Target,
  Zap,
  BookOpen,
  Code2,
  Database,
  Cpu,
  Globe,
  ArrowRight,
  SkipForward,
} from "lucide-react";

const TOPICS = [
  { id: "JavaScript", label: "JavaScript", icon: Code2, color: "#f59e0b" },
  { id: "React", label: "React", icon: Sparkles, color: "#06b6d4" },
  { id: "Node.js", label: "Node.js", icon: Zap, color: "#10b981" },
  { id: "Python", label: "Python", icon: Code2, color: "#3b82f6" },
  { id: "DSA", label: "DSA", icon: Cpu, color: "#8b5cf6" },
  { id: "System Design", label: "System Design", icon: Globe, color: "#ec4899" },
  { id: "TypeScript", label: "TypeScript", icon: Code2, color: "#60a5fa" },
  { id: "SQL & Databases", label: "SQL & Databases", icon: Database, color: "#f97316" },
];

const DIFFICULTIES = [
  { id: "Easy", label: "Easy", desc: "Basic concepts & syntax", color: "#10b981", bg: "#10b981/15", border: "#10b981/40" },
  { id: "Medium", label: "Medium", desc: "Patterns & intermediate", color: "#f59e0b", bg: "#f59e0b/15", border: "#f59e0b/40" },
  { id: "Hard", label: "Hard", desc: "Advanced & edge cases", color: "#ef4444", bg: "#ef4444/15", border: "#ef4444/40" },
];

const QUIZ_TIME = 10 * 60; // 10 minutes in seconds

function QuizPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Quiz");

  // Screen state: "setup" | "quiz" | "results"
  const [screen, setScreen] = useState("setup");

  // Setup state
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState(null);
  const [generating, setGenerating] = useState(false);

  // Quiz state
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState({}); // { [questionIndex]: "A" | "B" | ... }
  const [timeLeft, setTimeLeft] = useState(QUIZ_TIME);
  const [quizStartTime, setQuizStartTime] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const timerRef = useRef(null);

  // Results state
  const [results, setResults] = useState(null);

  // Timer logic
  useEffect(() => {
    if (screen !== "quiz") return;
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current);
          handleSubmitQuiz(true); // auto-submit on timeout
          return 0;
        }
        return t - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [screen]);

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60).toString().padStart(2, "0");
    const s = (secs % 60).toString().padStart(2, "0");
    return `${m}:${s}`;
  };

  const handleGenerateQuiz = async () => {
    if (!selectedTopic || !selectedDifficulty) {
      toast.error("Please select a topic and difficulty.");
      return;
    }
    setGenerating(true);
    try {
      const res = await generateQuizApi({ topic: selectedTopic, difficulty: selectedDifficulty });
      setQuestions(res.data.questions);
      setUserAnswers({});
      setCurrentIndex(0);
      setTimeLeft(QUIZ_TIME);
      setQuizStartTime(Date.now());
      setScreen("quiz");
    } catch (err) {
      toast.error(err.message || "Failed to generate quiz. Please try again.");
    } finally {
      setGenerating(false);
    }
  };

  const handleSelectAnswer = (key) => {
    setUserAnswers((prev) => ({ ...prev, [currentIndex]: key }));
  };

  const handleSkip = () => {
    if (currentIndex < questions.length - 1) setCurrentIndex((i) => i + 1);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    } else {
      handleSubmitQuiz(false);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) setCurrentIndex((i) => i - 1);
  };

  const handleSubmitQuiz = useCallback(async (timedOut = false) => {
    clearInterval(timerRef.current);
    setSubmitting(true);

    const timeTakenSeconds = quizStartTime ? Math.round((Date.now() - quizStartTime) / 1000) : QUIZ_TIME;
    const answers = questions.map((q, idx) => ({
      question: q.question,
      options: q.options,
      correctAnswer: q.correctAnswer,
      userAnswer: userAnswers[idx] || null,
      explanation: q.explanation,
    }));

    try {
      const res = await submitQuizApi({
        topic: selectedTopic,
        difficulty: selectedDifficulty,
        timeTakenSeconds,
        answers,
      });
      setResults(res.data);
      setScreen("results");
      if (timedOut) toast("â° Time's up! Quiz auto-submitted.", { icon: "â°" });
    } catch (err) {
      toast.error("Failed to save results. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }, [questions, userAnswers, selectedTopic, selectedDifficulty, quizStartTime]);

  // Derived stats during quiz
  const correctCount = Object.entries(userAnswers).filter(([idx, ans]) => ans === questions[idx]?.correctAnswer).length;
  const wrongCount = Object.entries(userAnswers).filter(([idx, ans]) => ans && ans !== questions[idx]?.correctAnswer).length;
  const answeredCount = Object.values(userAnswers).filter(Boolean).length;
  const accuracy = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0;

  // â”€â”€â”€ SETUP SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  if (screen === "setup") {
    return (
      <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
        <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <Sidebar activeItem={activeTab} onItemSelect={(item) => setActiveTab(item)} onCloseMobile={() => setSidebarOpen(false)} />
        </div>
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" />}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-6 sm:p-8 max-w-[900px] w-full mx-auto space-y-8">
            {/* Header */}
            <div>
              <h1 className="text-2xl sm:text-3xl font-headings font-bold text-white tracking-tight flex items-center gap-3">
                <Sparkles className="w-7 h-7 text-[#7c3aed]" />
                AI Quiz Generator
              </h1>
              <p className="text-sm text-[#7e7e9a] mt-1">Gemini AI generates 10 unique questions tailored to your topic and level.</p>
            </div>

            {/* Topic Selection */}
            <div className="space-y-4">
              <h2 className="text-sm font-headings font-bold text-white uppercase tracking-wider">1. Choose a Topic</h2>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                {TOPICS.map((t) => {
                  const Icon = t.icon;
                  const isSelected = selectedTopic === t.id;
                  return (
                    <button
                      key={t.id}
                      id={`topic-${t.id.replace(/\s+/g, "-").toLowerCase()}`}
                      onClick={() => setSelectedTopic(t.id)}
                      className={`flex flex-col items-center gap-2 p-4 rounded-2xl border transition-all cursor-pointer ${
                        isSelected
                          ? "bg-[#7c3aed]/20 border-[#7c3aed] shadow-lg shadow-[#7c3aed]/20"
                          : "bg-[#131326] border-[#22223a] hover:border-[#383854]"
                      }`}
                    >
                      <Icon className="w-5 h-5" style={{ color: isSelected ? "#a78bfa" : t.color }} />
                      <span className={`text-xs font-semibold ${isSelected ? "text-white" : "text-[#9e9eb8]"}`}>{t.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Difficulty Selection */}
            <div className="space-y-4">
              <h2 className="text-sm font-headings font-bold text-white uppercase tracking-wider">2. Select Difficulty</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {DIFFICULTIES.map((d) => {
                  const isSelected = selectedDifficulty === d.id;
                  return (
                    <button
                      key={d.id}
                      id={`difficulty-${d.id.toLowerCase()}`}
                      onClick={() => setSelectedDifficulty(d.id)}
                      className={`p-5 rounded-2xl border text-left transition-all cursor-pointer ${
                        isSelected
                          ? `border-[${d.border}] bg-[${d.bg}] shadow-lg`
                          : "bg-[#131326] border-[#22223a] hover:border-[#383854]"
                      }`}
                      style={isSelected ? { borderColor: d.color + "66", backgroundColor: d.color + "18" } : {}}
                    >
                      <span className="text-base font-headings font-bold block" style={{ color: isSelected ? d.color : "#e8e8f0" }}>{d.label}</span>
                      <span className="text-xs text-[#7e7e9a] mt-1 block">{d.desc}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Info bar + Generate button */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-4 pt-2">
              <div className="flex items-center gap-4 text-xs text-[#7e7e9a]">
                <span className="flex items-center gap-1.5"><BookOpen className="w-3.5 h-3.5" /> 10 questions</span>
                <span className="flex items-center gap-1.5"><Clock className="w-3.5 h-3.5" /> 10 min timer</span>
                <span className="flex items-center gap-1.5"><Sparkles className="w-3.5 h-3.5 text-[#7c3aed]" /> Powered by OpenRouter AI</span>
              </div>
              <button
                id="generate-quiz-btn"
                onClick={handleGenerateQuiz}
                disabled={!selectedTopic || !selectedDifficulty || generating}
                className="sm:ml-auto flex items-center gap-2 px-8 py-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-50 disabled:cursor-not-allowed text-sm font-bold text-white transition-all shadow-lg shadow-[#7c3aed]/30 cursor-pointer"
              >
                {generating ? (
                  <><Loader2 className="w-4 h-4 animate-spin" /> Generating questions...</>
                ) : (
                  <><Sparkles className="w-4 h-4" /> Generate Quiz<ArrowRight className="w-4 h-4" /></>
                )}
              </button>
            </div>
          </main>
        </div>
      </div>
    );
  }

  // --- RESULTS SCREEN ---
  if (screen === "results" && results) {
    const scoreColor = results.score >= 80 ? "#10b981" : results.score >= 50 ? "#f59e0b" : "#ef4444";
    const scoreLabel = results.score >= 80 ? "Excellent! 🎉" : results.score >= 50 ? "Good effort! 💪" : "Keep practicing! 📚";

    return (
      <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
        <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
          <Sidebar activeItem={activeTab} onItemSelect={(item) => setActiveTab(item)} onCloseMobile={() => setSidebarOpen(false)} />
        </div>
        {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" />}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
          <main className="flex-1 p-6 sm:p-8 max-w-[900px] w-full mx-auto space-y-6">
            {/* Score Card */}
            <div className="rounded-[24px] p-8 bg-gradient-to-br from-[#1a1040] to-[#131326] border border-[#7c3aed]/30 text-center space-y-4">
              <Trophy className="w-12 h-12 mx-auto" style={{ color: scoreColor }} />
              <div>
                <p className="text-4xl font-headings font-bold" style={{ color: scoreColor }}>{results.score}%</p>
                <p className="text-lg font-headings font-semibold text-white mt-1">{scoreLabel}</p>
                <p className="text-sm text-[#7e7e9a] mt-1">{selectedTopic} Â· {selectedDifficulty}</p>
              </div>
              <div className="grid grid-cols-3 gap-4 max-w-sm mx-auto pt-2">
                <div className="p-3 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 text-center">
                  <p className="text-2xl font-bold text-[#10b981]">{results.correctCount}</p>
                  <p className="text-[11px] text-[#7e7e9a]">Correct</p>
                </div>
                <div className="p-3 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-center">
                  <p className="text-2xl font-bold text-[#ef4444]">{results.wrongCount}</p>
                  <p className="text-[11px] text-[#7e7e9a]">Wrong</p>
                </div>
                <div className="p-3 rounded-xl bg-[#f59e0b]/10 border border-[#f59e0b]/30 text-center">
                  <p className="text-2xl font-bold text-[#f59e0b]">{results.skippedCount}</p>
                  <p className="text-[11px] text-[#7e7e9a]">Skipped</p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button
                id="retake-quiz-btn"
                onClick={() => setScreen("setup")}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl border border-[#7c3aed]/40 bg-[#7c3aed]/10 text-sm font-semibold text-[#a78bfa] hover:bg-[#7c3aed]/20 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" /> Take Another Quiz
              </button>
              <button
                id="dashboard-btn"
                onClick={() => navigate("/dashboard")}
                className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-sm font-semibold text-white transition-colors shadow-lg shadow-[#7c3aed]/20 cursor-pointer"
              >
                Back to Dashboard <ArrowRight className="w-4 h-4" />
              </button>
            </div>

            {/* Question Review */}
            <div className="space-y-4">
              <h2 className="text-sm font-headings font-bold text-white uppercase tracking-wider">Question Review</h2>
              {results.questions.map((q, idx) => (
                <div key={idx} className={`rounded-[20px] p-6 border space-y-4 ${q.isCorrect ? "bg-[#0d1f17] border-[#10b981]/30" : q.userAnswer ? "bg-[#1f0d0d] border-[#ef4444]/30" : "bg-[#131326] border-[#22223a]"}`}>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-bold text-[#7e7e9a]">Q{idx + 1}</span>
                      {q.isCorrect ? <CheckCircle2 className="w-4 h-4 text-[#10b981]" /> : q.userAnswer ? <XCircle className="w-4 h-4 text-[#ef4444]" /> : <Flag className="w-4 h-4 text-[#f59e0b]" />}
                      <span className="text-xs font-semibold" style={{ color: q.isCorrect ? "#10b981" : q.userAnswer ? "#ef4444" : "#f59e0b" }}>
                        {q.isCorrect ? "Correct" : q.userAnswer ? "Wrong" : "Skipped"}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm font-semibold text-white">{q.question}</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {q.options.map((opt) => {
                      const key = opt[0]; // "A", "B", "C", "D"
                      const isCorrect = key === q.correctAnswer;
                      const isUserWrong = key === q.userAnswer && !isCorrect;
                      return (
                        <div key={key} className={`p-3 rounded-xl text-xs font-medium border ${isCorrect ? "bg-[#10b981]/15 border-[#10b981]/50 text-[#10b981]" : isUserWrong ? "bg-[#ef4444]/10 border-[#ef4444]/40 text-[#ef4444]" : "bg-[#17172e] border-[#22223c] text-[#7e7e9a]"}`}>
                          {opt}
                        </div>
                      );
                    })}
                  </div>
                  {q.explanation && (
                    <p className="text-xs text-[#a78bfa] bg-[#7c3aed]/10 border border-[#7c3aed]/20 rounded-xl p-3">
                      <span className="font-bold">Explanation: </span>{q.explanation}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </main>
        </div>
      </div>
    );
  }

  // â”€â”€â”€ QUIZ SCREEN â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€â”€
  const currentQ = questions[currentIndex];
  const selectedAnswer = userAnswers[currentIndex] || null;
  const isLastQuestion = currentIndex === questions.length - 1;
  const diffColor = selectedDifficulty === "Easy" ? "#10b981" : selectedDifficulty === "Medium" ? "#f59e0b" : "#ef4444";

  return (
    <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      <div className={`fixed inset-y-0 left-0 z-50 transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"} lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}>
        <Sidebar activeItem={activeTab} onItemSelect={(item) => setActiveTab(item)} onCloseMobile={() => setSidebarOpen(false)} />
      </div>
      {sidebarOpen && <div onClick={() => setSidebarOpen(false)} className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm" />}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />
        <main className="flex-1 p-6 sm:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Header Row */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl sm:text-3xl font-headings font-bold text-white tracking-tight">{selectedTopic} Quiz</h1>
              <p className="text-xs sm:text-sm text-[#7e7e9a] mt-1">Question {currentIndex + 1} of {questions.length}</p>
            </div>
            <div className="flex items-center gap-3">
              <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-[#131326] border text-xs font-semibold ${timeLeft < 60 ? "border-[#ef4444]/50 text-[#ef4444]" : "border-[#22223a] text-[#f59e0b]"}`}>
                <Clock className="w-4 h-4" />
                <span>{formatTime(timeLeft)}</span>
              </div>
              <button
                id="exit-quiz-btn"
                onClick={() => { clearInterval(timerRef.current); setScreen("setup"); }}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl border border-[#ef4444]/40 bg-[#ef4444]/10 text-xs font-semibold text-[#ef4444] hover:bg-[#ef4444]/20 transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" /> Exit
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full bg-[#131326] h-2 rounded-full overflow-hidden border border-[#22223a]">
            <div
              className="bg-gradient-to-r from-[#7c3aed] to-[#a78bfa] h-full rounded-full transition-all duration-300"
              style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
            />
          </div>

          {/* Main 2-Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-[1fr_300px] gap-6">
            {/* Left â€” Question Box */}
            <div className="rounded-[20px] p-6 sm:p-8 bg-[#131326] border border-[#22223a] space-y-6 shadow-xl shadow-black/20 flex flex-col justify-between">
              <div className="space-y-6">
                {/* Badges */}
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="px-3 py-1 rounded-full bg-[#7c3aed]/20 border border-[#7c3aed]/40 text-xs font-semibold text-[#a78bfa]">{selectedTopic}</span>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold border" style={{ color: diffColor, borderColor: diffColor + "66", backgroundColor: diffColor + "18" }}>{selectedDifficulty}</span>
                  <span className="px-3 py-1 rounded-full bg-[#181830] border border-[#242440] text-xs font-medium text-[#7e7e9a] flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-[#7c3aed]" /> Gemini AI
                  </span>
                </div>

                {/* Question */}
                <h2 className="text-lg sm:text-xl font-headings font-bold text-white leading-relaxed">{currentQ?.question}</h2>

                {/* Options */}
                <div className="space-y-3 pt-2">
                  {currentQ?.options.map((opt) => {
                    const key = opt[0]; // "A", "B", "C", "D"
                    const isSelected = selectedAnswer === key;
                    return (
                      <div
                        key={key}
                        id={`option-${key}`}
                        onClick={() => handleSelectAnswer(key)}
                        className={`flex items-center gap-3 p-4 rounded-xl border transition-all cursor-pointer ${
                          isSelected
                            ? "bg-[#7c3aed]/15 border-[#7c3aed] text-white shadow-md shadow-[#7c3aed]/10"
                            : "bg-[#17172e] border-[#22223c] text-[#d1d1e0] hover:border-[#383854]"
                        }`}
                      >
                        <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${isSelected ? "bg-[#7c3aed] text-white" : "bg-[#22223a] text-[#7e7e9a]"}`}>
                          {key}
                        </div>
                        <span className="text-sm">{opt.slice(3)}</span>
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-[#7c3aed] ml-auto" />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Navigation Controls */}
              <div className="flex items-center justify-between pt-6 border-t border-[#1e1e34] gap-2">
                <button
                  id="prev-btn"
                  onClick={handlePrev}
                  disabled={currentIndex === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl border border-[#22223a] bg-[#17172e] text-xs font-semibold text-[#e8e8f0] hover:bg-[#1f1f3a] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" /> Previous
                </button>

                <button
                  id="skip-btn"
                  onClick={handleSkip}
                  disabled={isLastQuestion}
                  className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-[#22223a] bg-transparent text-xs font-semibold text-[#7e7e9a] hover:text-white hover:border-[#383854] disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
                >
                  <SkipForward className="w-3.5 h-3.5" /> Skip
                </button>

                {isLastQuestion ? (
                  <button
                    id="submit-quiz-btn"
                    onClick={() => handleSubmitQuiz(false)}
                    disabled={submitting}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#10b981] hover:bg-[#059669] text-xs font-bold text-white transition-all shadow-md shadow-[#10b981]/30 disabled:opacity-60 cursor-pointer"
                  >
                    {submitting ? <><Loader2 className="w-4 h-4 animate-spin" /> Submitting...</> : <><Target className="w-4 h-4" /> Submit Quiz</>}
                  </button>
                ) : (
                  <button
                    id="next-btn"
                    onClick={handleNext}
                    className="flex items-center gap-2 px-6 py-2.5 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] text-xs font-semibold text-white transition-all shadow-md shadow-[#7c3aed]/30 cursor-pointer"
                  >
                    Next <ChevronRight className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="space-y-5">
              {/* Live Score */}
              <div className="rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-4 shadow-xl shadow-black/20">
                <h3 className="text-sm font-headings font-bold text-white">Live Score</h3>
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { label: "Correct", value: correctCount, color: "#7c3aed" },
                    { label: "Wrong", value: wrongCount, color: "#ef4444" },
                    { label: "Answered", value: answeredCount, color: "#22d3ee" },
                    { label: "Remaining", value: questions.length - answeredCount, color: "#f59e0b" },
                  ].map((s) => (
                    <div key={s.label} className="p-3.5 rounded-xl bg-[#17172e] border border-[#22223c] text-center">
                      <span className="text-2xl font-bold block" style={{ color: s.color }}>{s.value}</span>
                      <span className="text-[11px] text-[#7e7e9a] font-medium">{s.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Accuracy Donut */}
              <div className="rounded-[20px] p-6 bg-[#131326] border border-[#22223a] space-y-3 shadow-xl shadow-black/20 flex flex-col items-center text-center">
                <h3 className="text-sm font-headings font-bold text-white self-start">Accuracy</h3>
                <div className="relative w-28 h-28 flex items-center justify-center my-1">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path className="text-[#22223a]" strokeWidth="3.5" stroke="currentColor" fill="none" d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" />
                    <path
                      strokeDasharray={`${accuracy}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke={accuracy >= 80 ? "#10b981" : accuracy >= 50 ? "#f59e0b" : "#ef4444"}
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xl font-bold font-headings text-white">{accuracy}%</span>
                </div>
              </div>

              {/* Question Navigation Grid */}
              <div className="rounded-[20px] p-5 bg-[#131326] border border-[#22223a] space-y-3 shadow-xl shadow-black/20">
                <h3 className="text-sm font-headings font-bold text-white">Questions</h3>
                <div className="grid grid-cols-5 gap-2">
                  {questions.map((_, idx) => {
                    const ans = userAnswers[idx];
                    const isCorrectQ = ans === questions[idx]?.correctAnswer;
                    const isCurrent = idx === currentIndex;
                    return (
                      <button
                        key={idx}
                        id={`q-nav-${idx}`}
                        onClick={() => setCurrentIndex(idx)}
                        className={`h-8 w-full rounded-lg text-xs font-bold transition-all cursor-pointer border ${
                          isCurrent ? "bg-[#7c3aed] border-[#7c3aed] text-white" :
                          ans ? (isCorrectQ ? "bg-[#10b981]/20 border-[#10b981]/50 text-[#10b981]" : "bg-[#ef4444]/15 border-[#ef4444]/40 text-[#ef4444]") :
                          "bg-[#17172e] border-[#22223c] text-[#7e7e9a] hover:border-[#383854]"
                        }`}
                      >
                        {idx + 1}
                      </button>
                    );
                  })}
                </div>
                <div className="flex items-center gap-3 pt-1 text-[10px] text-[#7e7e9a]">
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#7c3aed]" /> Current</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#10b981]/50" /> Answered</span>
                  <span className="flex items-center gap-1"><span className="w-2 h-2 rounded-sm bg-[#17172e] border border-[#22223c]" /> Unanswered</span>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default QuizPage;