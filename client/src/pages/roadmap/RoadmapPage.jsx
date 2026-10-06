import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/dashboard/TopHeader";
import {
  generateRoadmapApi,
  getRoadmapsApi,
  getRoadmapByIdApi,
  toggleMilestoneApi,
  deleteRoadmapApi,
} from "../../services/roadmapService";
import toast from "react-hot-toast";
import {
  GitFork,
  Sparkles,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  CheckCircle2,
  Circle,
  Clock,
  BookOpen,
  Video,
  Code2,
  FileText,
  ExternalLink,
  Trash2,
  Plus,
  Loader2,
  ArrowLeft,
  Target,
  Layers,
  Zap,
  GraduationCap,
  Map,
  Globe,
  Shield,
  Database,
  Smartphone,
  Brain,
  Server,
  Monitor,
} from "lucide-react";

const CATEGORIES = [
  { name: "Frontend Development", icon: Monitor, color: "#7c3aed", description: "React, Vue, Angular, CSS, HTML5" },
  { name: "Backend Development", icon: Server, color: "#06b6d4", description: "Node.js, Python, Java, APIs, REST" },
  { name: "Full-Stack Development", icon: Layers, color: "#8b5cf6", description: "End-to-end web development" },
  { name: "Data Structures & Algorithms", icon: Brain, color: "#10b981", description: "Arrays, Trees, DP, Graphs" },
  { name: "System Design", icon: GitFork, color: "#f59e0b", description: "Scalability, Architecture, HLD/LLD" },
  { name: "Machine Learning", icon: Sparkles, color: "#ec4899", description: "ML, Deep Learning, NLP, AI" },
  { name: "DevOps & Cloud", icon: Globe, color: "#14b8a6", description: "AWS, Docker, Kubernetes, CI/CD" },
  { name: "Mobile Development", icon: Smartphone, color: "#f97316", description: "React Native, Flutter, iOS, Android" },
  { name: "Cybersecurity", icon: Shield, color: "#ef4444", description: "Security, Pen Testing, Cryptography" },
  { name: "Database Engineering", icon: Database, color: "#6366f1", description: "SQL, NoSQL, Redis, MongoDB" },
];

const SKILL_LEVELS = [
  { name: "Beginner", desc: "New to this topic, starting from scratch", color: "#10b981" },
  { name: "Intermediate", desc: "Some experience, know the basics", color: "#f59e0b" },
  { name: "Advanced", desc: "Experienced, looking to master advanced concepts", color: "#ef4444" },
];

const RESOURCE_ICONS = {
  article: FileText,
  video: Video,
  course: GraduationCap,
  docs: BookOpen,
  project: Code2,
};

function RoadmapPage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // View state: "selector" | "generating" | "list" | "detail"
  const [view, setView] = useState("list");

  // Form state
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedLevel, setSelectedLevel] = useState(null);
  const [targetGoal, setTargetGoal] = useState("");
  const [generating, setGenerating] = useState(false);

  // Data state
  const [roadmaps, setRoadmaps] = useState([]);
  const [activeRoadmap, setActiveRoadmap] = useState(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingDetail, setLoadingDetail] = useState(false);
  const [expandedMilestone, setExpandedMilestone] = useState(null);
  const [togglingMilestone, setTogglingMilestone] = useState(null);

  useEffect(() => {
    loadRoadmaps();
  }, []);

  const loadRoadmaps = async () => {
    try {
      setLoadingList(true);
      const result = await getRoadmapsApi();
      if (result.success) setRoadmaps(result.data);
    } catch (error) {
      toast.error(error.message);
    } finally {
      setLoadingList(false);
    }
  };

  const handleGenerate = async () => {
    if (!selectedCategory || !selectedLevel) {
      toast.error("Please select a category and skill level.");
      return;
    }
    try {
      setGenerating(true);
      setView("generating");
      const result = await generateRoadmapApi({
        category: selectedCategory,
        skillLevel: selectedLevel,
        targetGoal: targetGoal.trim(),
      });
      if (result.success) {
        toast.success("Roadmap generated!");
        setActiveRoadmap(result.data);
        setView("detail");
        // Refresh list in background
        loadRoadmaps();
      }
    } catch (error) {
      toast.error(error.message);
      setView("selector");
    } finally {
      setGenerating(false);
    }
  };

  const handleOpenDetail = async (id) => {
    try {
      setLoadingDetail(true);
      setView("detail");
      const result = await getRoadmapByIdApi(id);
      if (result.success) {
        setActiveRoadmap(result.data);
      }
    } catch (error) {
      toast.error(error.message);
      setView("list");
    } finally {
      setLoadingDetail(false);
    }
  };

  const handleToggleMilestone = async (milestoneId) => {
    if (!activeRoadmap || togglingMilestone) return;
    try {
      setTogglingMilestone(milestoneId);
      const result = await toggleMilestoneApi(activeRoadmap.id, milestoneId);
      if (result.success) {
        setActiveRoadmap(result.data);
        toast.success(result.message);
      }
    } catch (error) {
      toast.error(error.message);
    } finally {
      setTogglingMilestone(null);
    }
  };

  const handleDeleteRoadmap = async (id) => {
    if (!window.confirm("Delete this roadmap? This action cannot be undone.")) return;
    try {
      const result = await deleteRoadmapApi(id);
      if (result.success) {
        toast.success("Roadmap deleted.");
        setRoadmaps((prev) => prev.filter((r) => r.id !== id));
        if (activeRoadmap?.id === id) {
          setActiveRoadmap(null);
          setView("list");
        }
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const resetSelector = () => {
    setSelectedCategory(null);
    setSelectedLevel(null);
    setTargetGoal("");
    setView("selector");
  };

  return (
    <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      {/* Sidebar */}
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar activeItem="Roadmap" onItemSelect={() => {}} onCloseMobile={() => setSidebarOpen(false)} />
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
          {/* ═══════════════ LIST VIEW ═══════════════ */}
          {view === "list" && (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
                <div>
                  <h1 className="text-2xl sm:text-3xl font-headings font-bold text-white tracking-tight flex items-center gap-3">
                    <Map className="w-7 h-7 text-[#a78bfa]" />
                    Learning Roadmaps
                  </h1>
                  <p className="text-xs sm:text-sm text-[#7e7e9a] mt-1">
                    AI-powered learning paths tailored to your goals
                  </p>
                </div>
                <button
                  onClick={resetSelector}
                  className="inline-flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#7c3aed]/30 cursor-pointer self-start sm:self-auto"
                >
                  <Plus className="w-4 h-4" />
                  Create New Roadmap
                </button>
              </div>

              {loadingList ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
                  <p className="text-xs text-[#7e7e9a]">Loading your roadmaps...</p>
                </div>
              ) : roadmaps.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-5">
                  <div className="w-24 h-24 rounded-3xl bg-[#131326] border border-[#22223a] flex items-center justify-center">
                    <Map className="w-10 h-10 text-[#3a3a5a]" />
                  </div>
                  <div className="text-center space-y-2">
                    <h2 className="text-lg font-headings font-bold text-white">No Roadmaps Yet</h2>
                    <p className="text-sm text-[#7e7e9a] max-w-sm">
                      Create your first AI-powered learning roadmap to get a structured path to mastery.
                    </p>
                  </div>
                  <button
                    onClick={resetSelector}
                    className="px-6 py-3 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white rounded-xl text-sm font-semibold transition-all shadow-md shadow-[#7c3aed]/30 cursor-pointer"
                  >
                    Create Your First Roadmap
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-5">
                  {roadmaps.map((roadmap) => {
                    const catInfo = CATEGORIES.find((c) => c.name === roadmap.category) || CATEGORIES[0];
                    const CatIcon = catInfo.icon;
                    const pct = roadmap.progressPercent || 0;
                    return (
                      <div
                        key={roadmap.id}
                        className="rounded-2xl bg-[#131326] border border-[#22223a] hover:border-[#7c3aed]/40 transition-all duration-200 shadow-xl shadow-black/20 overflow-hidden group"
                      >
                        {/* Progress bar at top */}
                        <div className="h-1 bg-[#1a1a30]">
                          <div
                            className="h-full transition-all duration-700"
                            style={{
                              width: `${pct}%`,
                              background: `linear-gradient(90deg, ${catInfo.color}, ${catInfo.color}cc)`,
                            }}
                          />
                        </div>

                        <div className="p-5">
                          <div className="flex items-start justify-between mb-3">
                            <div
                              className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                              style={{ background: `${catInfo.color}15` }}
                            >
                              <CatIcon className="w-5 h-5" style={{ color: catInfo.color }} />
                            </div>
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleDeleteRoadmap(roadmap.id);
                              }}
                              className="p-1.5 rounded-lg text-[#5e5e7a] hover:text-[#ef4444] hover:bg-[#ef4444]/10 transition-colors opacity-0 group-hover:opacity-100 cursor-pointer"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>

                          <h3 className="text-sm font-headings font-bold text-white mb-1 line-clamp-2">
                            {roadmap.title}
                          </h3>
                          <p className="text-[11px] text-[#7e7e9a] line-clamp-2 mb-4">
                            {roadmap.description}
                          </p>

                          <div className="flex items-center gap-3 mb-4">
                            <span
                              className="text-[10px] font-medium px-2 py-0.5 rounded-md"
                              style={{ background: `${catInfo.color}15`, color: catInfo.color }}
                            >
                              {roadmap.skillLevel}
                            </span>
                            <span className="text-[10px] text-[#5e5e7a] flex items-center gap-1">
                              <Clock className="w-3 h-3" />
                              {roadmap.estimatedDuration}
                            </span>
                          </div>

                          <div className="flex items-center justify-between">
                            <div className="flex-1 mr-4">
                              <div className="flex justify-between text-[10px] text-[#7e7e9a] mb-1">
                                <span>{roadmap.completedMilestones}/{roadmap.totalMilestones} phases</span>
                                <span style={{ color: catInfo.color }}>{pct}%</span>
                              </div>
                              <div className="w-full h-1.5 rounded-full bg-[#1a1a30]">
                                <div
                                  className="h-full rounded-full transition-all duration-700"
                                  style={{
                                    width: `${pct}%`,
                                    background: catInfo.color,
                                  }}
                                />
                              </div>
                            </div>
                            <button
                              onClick={() => handleOpenDetail(roadmap.id)}
                              className="px-3 py-1.5 rounded-lg text-[10px] font-semibold text-white hover:bg-[#7c3aed]/20 transition-colors cursor-pointer"
                              style={{ background: `${catInfo.color}20`, color: catInfo.color }}
                            >
                              View
                            </button>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </>
          )}

          {/* ═══════════════ SELECTOR VIEW ═══════════════ */}
          {view === "selector" && (
            <>
              <button
                onClick={() => setView("list")}
                className="inline-flex items-center gap-2 text-xs text-[#7e7e9a] hover:text-white transition-colors mb-6 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Roadmaps
              </button>

              <div className="text-center mb-10">
                <h1 className="text-2xl sm:text-3xl font-headings font-bold text-white tracking-tight">
                  Create Your Learning Roadmap
                </h1>
                <p className="text-sm text-[#7e7e9a] mt-2 max-w-lg mx-auto">
                  Choose what you want to learn and our AI will generate a personalized, step-by-step roadmap for you.
                </p>
              </div>

              {/* Step 1: Category */}
              <div className="mb-10">
                <h2 className="text-sm font-headings font-bold text-white mb-1 flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-[10px] font-bold flex items-center justify-center">
                    1
                  </span>
                  What do you want to learn?
                </h2>
                <p className="text-[11px] text-[#5e5e7a] mb-5 ml-8">Select a domain or technology area</p>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-3">
                  {CATEGORIES.map((cat) => {
                    const CatIcon = cat.icon;
                    const isSelected = selectedCategory === cat.name;
                    return (
                      <button
                        key={cat.name}
                        onClick={() => setSelectedCategory(cat.name)}
                        className={`p-4 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                          isSelected
                            ? "shadow-lg"
                            : "border-[#22223a] hover:border-[#3a3a5a] bg-[#131326]"
                        }`}
                        style={
                          isSelected
                            ? {
                                borderColor: cat.color,
                                background: `${cat.color}10`,
                                boxShadow: `0 0 20px ${cat.color}20`,
                              }
                            : {}
                        }
                      >
                        <CatIcon
                          className="w-6 h-6 mb-2.5"
                          style={{ color: isSelected ? cat.color : "#5e5e7a" }}
                        />
                        <p className="text-xs font-semibold text-white mb-0.5">{cat.name}</p>
                        <p className="text-[10px] text-[#5e5e7a]">{cat.description}</p>
                        {isSelected && (
                          <div
                            className="w-5 h-5 rounded-full flex items-center justify-center mt-2"
                            style={{ background: cat.color }}
                          >
                            <CheckCircle2 className="w-3 h-3 text-white" />
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Step 2: Skill level */}
              {selectedCategory && (
                <div className="mb-10 animate-fadeIn">
                  <h2 className="text-sm font-headings font-bold text-white mb-1 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-[10px] font-bold flex items-center justify-center">
                      2
                    </span>
                    What's your current level?
                  </h2>
                  <p className="text-[11px] text-[#5e5e7a] mb-5 ml-8">
                    We'll tailor the roadmap to match your experience
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-2xl">
                    {SKILL_LEVELS.map((level) => {
                      const isSelected = selectedLevel === level.name;
                      return (
                        <button
                          key={level.name}
                          onClick={() => setSelectedLevel(level.name)}
                          className={`p-5 rounded-xl border-2 transition-all duration-200 cursor-pointer text-left ${
                            isSelected
                              ? "shadow-lg"
                              : "border-[#22223a] hover:border-[#3a3a5a] bg-[#131326]"
                          }`}
                          style={
                            isSelected
                              ? {
                                  borderColor: level.color,
                                  background: `${level.color}10`,
                                  boxShadow: `0 0 20px ${level.color}20`,
                                }
                              : {}
                          }
                        >
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center mb-3"
                            style={{ background: `${level.color}20` }}
                          >
                            <Target className="w-4 h-4" style={{ color: level.color }} />
                          </div>
                          <p className="text-sm font-semibold text-white mb-1">{level.name}</p>
                          <p className="text-[10px] text-[#5e5e7a]">{level.desc}</p>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* Step 3: Goal + Generate */}
              {selectedCategory && selectedLevel && (
                <div className="mb-10 animate-fadeIn">
                  <h2 className="text-sm font-headings font-bold text-white mb-1 flex items-center gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#7c3aed] text-white text-[10px] font-bold flex items-center justify-center">
                      3
                    </span>
                    What's your goal? (Optional)
                  </h2>
                  <p className="text-[11px] text-[#5e5e7a] mb-5 ml-8">
                    Tell us what you want to achieve so the AI can customize the roadmap
                  </p>

                  <div className="max-w-xl space-y-5">
                    <input
                      type="text"
                      value={targetGoal}
                      onChange={(e) => setTargetGoal(e.target.value)}
                      className="w-full px-4 py-3.5 rounded-xl bg-[#131326] border border-[#22223a] text-sm text-white placeholder-[#5e5e7a] focus:outline-none focus:border-[#7c3aed] focus:ring-1 focus:ring-[#7c3aed]/30 transition-all"
                      placeholder="e.g. Get a frontend developer job at a FAANG company"
                    />

                    {/* Summary */}
                    <div className="p-4 rounded-xl bg-[#131326] border border-[#22223a] space-y-2">
                      <p className="text-xs font-semibold text-[#a0a0b8]">Your Roadmap Configuration:</p>
                      <div className="flex flex-wrap gap-2">
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-[#7c3aed]/15 text-[#a78bfa]">
                          {selectedCategory}
                        </span>
                        <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-[#06b6d4]/15 text-[#06b6d4]">
                          {selectedLevel}
                        </span>
                        {targetGoal.trim() && (
                          <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-[#10b981]/15 text-[#10b981]">
                            {targetGoal.trim().length > 40 ? targetGoal.trim().substring(0, 40) + "…" : targetGoal.trim()}
                          </span>
                        )}
                      </div>
                    </div>

                    <button
                      onClick={handleGenerate}
                      className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white rounded-xl text-sm font-semibold transition-all shadow-lg shadow-[#7c3aed]/30 cursor-pointer"
                    >
                      <Sparkles className="w-4 h-4" />
                      Generate Roadmap with AI
                    </button>
                  </div>
                </div>
              )}
            </>
          )}

          {/* ═══════════════ GENERATING VIEW ═══════════════ */}
          {view === "generating" && (
            <div className="flex flex-col items-center justify-center py-32 space-y-6">
              <div className="relative">
                <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-[#7c3aed] to-[#8b5cf6] flex items-center justify-center animate-pulse">
                  <Sparkles className="w-8 h-8 text-white" />
                </div>
                <div className="absolute -inset-4 rounded-[32px] border-2 border-[#7c3aed]/30 animate-ping" />
              </div>
              <div className="text-center space-y-2">
                <h2 className="text-lg font-headings font-bold text-white">Generating Your Roadmap</h2>
                <p className="text-sm text-[#7e7e9a] max-w-sm">
                  Our AI is crafting a personalized learning path for{" "}
                  <span className="text-[#a78bfa] font-semibold">{selectedCategory}</span>...
                </p>
                <p className="text-[11px] text-[#5e5e7a]">This usually takes 15-30 seconds</p>
              </div>
              <div className="flex gap-1.5">
                {[0, 1, 2, 3, 4].map((i) => (
                  <div
                    key={i}
                    className="w-2 h-2 rounded-full bg-[#7c3aed] animate-bounce"
                    style={{ animationDelay: `${i * 0.15}s` }}
                  />
                ))}
              </div>
            </div>
          )}

          {/* ═══════════════ DETAIL VIEW ═══════════════ */}
          {view === "detail" && (
            <>
              <button
                onClick={() => {
                  setView("list");
                  setActiveRoadmap(null);
                  setExpandedMilestone(null);
                }}
                className="inline-flex items-center gap-2 text-xs text-[#7e7e9a] hover:text-white transition-colors mb-6 cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                Back to Roadmaps
              </button>

              {loadingDetail ? (
                <div className="flex flex-col items-center justify-center py-32 space-y-4">
                  <Loader2 className="w-8 h-8 text-[#7c3aed] animate-spin" />
                  <p className="text-xs text-[#7e7e9a]">Loading roadmap details...</p>
                </div>
              ) : activeRoadmap ? (
                <>
                  {/* Header */}
                  <div className="rounded-2xl bg-[#131326] border border-[#22223a] p-6 sm:p-8 mb-6 shadow-xl shadow-black/20 relative overflow-hidden">
                    {/* Background glow */}
                    <div className="absolute -top-20 -right-20 w-40 h-40 bg-[#7c3aed]/10 rounded-full blur-3xl pointer-events-none" />

                    <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4 relative">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-3">
                          {(() => {
                            const catInfo = CATEGORIES.find((c) => c.name === activeRoadmap.category) || CATEGORIES[0];
                            const CatIcon = catInfo.icon;
                            return (
                              <div
                                className="w-11 h-11 rounded-xl flex items-center justify-center"
                                style={{ background: `${catInfo.color}15` }}
                              >
                                <CatIcon className="w-5.5 h-5.5" style={{ color: catInfo.color }} />
                              </div>
                            );
                          })()}
                          <div className="flex gap-2">
                            <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-[#7c3aed]/15 text-[#a78bfa]">
                              {activeRoadmap.category}
                            </span>
                            <span className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-[#06b6d4]/15 text-[#06b6d4]">
                              {activeRoadmap.skillLevel}
                            </span>
                          </div>
                        </div>
                        <h1 className="text-xl sm:text-2xl font-headings font-bold text-white mb-2">
                          {activeRoadmap.title}
                        </h1>
                        <p className="text-xs text-[#7e7e9a] max-w-2xl">{activeRoadmap.description}</p>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <p className="text-2xl font-headings font-bold text-[#a78bfa]">
                            {activeRoadmap.progressPercent}%
                          </p>
                          <p className="text-[10px] text-[#5e5e7a]">
                            {activeRoadmap.completedMilestones}/{activeRoadmap.totalMilestones} phases
                          </p>
                        </div>
                        <div className="relative w-16 h-16">
                          <svg className="w-16 h-16 -rotate-90" viewBox="0 0 64 64">
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              fill="none"
                              stroke="#1e1e32"
                              strokeWidth="5"
                            />
                            <circle
                              cx="32"
                              cy="32"
                              r="28"
                              fill="none"
                              stroke="#7c3aed"
                              strokeWidth="5"
                              strokeLinecap="round"
                              strokeDasharray={`${(activeRoadmap.progressPercent / 100) * 175.93} 175.93`}
                            />
                          </svg>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 mt-5">
                      <span className="text-[11px] text-[#7e7e9a] flex items-center gap-1.5">
                        <Clock className="w-3.5 h-3.5" />
                        {activeRoadmap.estimatedDuration}
                      </span>
                      {activeRoadmap.targetGoal && (
                        <span className="text-[11px] text-[#7e7e9a] flex items-center gap-1.5">
                          <Target className="w-3.5 h-3.5" />
                          {activeRoadmap.targetGoal}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Milestones Timeline */}
                  <div className="space-y-4">
                    <h2 className="text-sm font-headings font-bold text-white flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#a78bfa]" />
                      Learning Phases
                    </h2>

                    <div className="relative">
                      {/* Timeline line */}
                      <div className="absolute left-[23px] top-0 bottom-0 w-0.5 bg-[#1e1e32]" />

                      <div className="space-y-3">
                        {activeRoadmap.milestones?.map((milestone, index) => {
                          const isExpanded = expandedMilestone === milestone._id;
                          const isToggling = togglingMilestone === milestone._id;

                          return (
                            <div key={milestone._id} className="relative pl-12">
                              {/* Timeline node */}
                              <button
                                onClick={() => handleToggleMilestone(milestone._id)}
                                disabled={isToggling}
                                className="absolute left-0 top-5 z-10 cursor-pointer disabled:cursor-wait"
                              >
                                {isToggling ? (
                                  <Loader2 className="w-[18px] h-[18px] text-[#7c3aed] animate-spin ml-[14px]" />
                                ) : milestone.isCompleted ? (
                                  <div className="w-[18px] h-[18px] rounded-full bg-[#10b981] flex items-center justify-center ml-[14px] shadow-md shadow-[#10b981]/30">
                                    <CheckCircle2 className="w-3 h-3 text-white" />
                                  </div>
                                ) : (
                                  <div className="w-[18px] h-[18px] rounded-full border-2 border-[#3a3a5a] bg-[#0b0b14] ml-[14px] hover:border-[#7c3aed] transition-colors" />
                                )}
                              </button>

                              <div
                                className={`rounded-2xl border transition-all duration-200 shadow-xl shadow-black/20 overflow-hidden ${
                                  milestone.isCompleted
                                    ? "bg-[#10b981]/5 border-[#10b981]/20"
                                    : "bg-[#131326] border-[#22223a] hover:border-[#7c3aed]/30"
                                }`}
                              >
                                <button
                                  onClick={() =>
                                    setExpandedMilestone(isExpanded ? null : milestone._id)
                                  }
                                  className="w-full flex items-center gap-4 p-5 cursor-pointer text-left"
                                >
                                  <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-2 mb-1">
                                      <span className="text-[10px] font-bold text-[#5e5e7a] uppercase">
                                        Phase {index + 1}
                                      </span>
                                      <span className="text-[10px] text-[#5e5e7a] flex items-center gap-1">
                                        <Clock className="w-3 h-3" />
                                        {milestone.duration}
                                      </span>
                                      {milestone.isCompleted && (
                                        <span className="text-[10px] font-medium px-2 py-0.5 rounded-md bg-[#10b981]/15 text-[#10b981]">
                                          Completed ✓
                                        </span>
                                      )}
                                    </div>
                                    <h3
                                      className={`text-sm font-semibold mb-1 ${
                                        milestone.isCompleted ? "text-[#10b981]" : "text-white"
                                      }`}
                                    >
                                      {milestone.title}
                                    </h3>
                                    <p className="text-[11px] text-[#7e7e9a] line-clamp-2">
                                      {milestone.description}
                                    </p>
                                  </div>
                                  {isExpanded ? (
                                    <ChevronUp className="w-4 h-4 text-[#5e5e7a] shrink-0" />
                                  ) : (
                                    <ChevronDown className="w-4 h-4 text-[#5e5e7a] shrink-0" />
                                  )}
                                </button>

                                {/* Expanded content */}
                                {isExpanded && (
                                  <div className="px-5 pb-5 border-t border-[#1e1e32] pt-4 space-y-5">
                                    {/* Topics */}
                                    {milestone.topics?.length > 0 && (
                                      <div>
                                        <p className="text-[10px] font-semibold text-[#a0a0b8] uppercase tracking-wider mb-2.5">
                                          Topics to Cover
                                        </p>
                                        <div className="flex flex-wrap gap-2">
                                          {milestone.topics.map((topic, ti) => (
                                            <span
                                              key={ti}
                                              className="text-[10px] font-medium px-2.5 py-1 rounded-lg bg-[#7c3aed]/10 text-[#a78bfa] border border-[#7c3aed]/20"
                                            >
                                              {topic}
                                            </span>
                                          ))}
                                        </div>
                                      </div>
                                    )}

                                    {/* Resources */}
                                    {milestone.resources?.length > 0 && (
                                      <div>
                                        <p className="text-[10px] font-semibold text-[#a0a0b8] uppercase tracking-wider mb-2.5">
                                          Recommended Resources
                                        </p>
                                        <div className="space-y-2">
                                          {milestone.resources.map((resource, ri) => {
                                            const ResIcon =
                                              RESOURCE_ICONS[resource.type] || FileText;
                                            const typeColors = {
                                              article: "#06b6d4",
                                              video: "#ef4444",
                                              course: "#f59e0b",
                                              docs: "#10b981",
                                              project: "#7c3aed",
                                            };
                                            const color = typeColors[resource.type] || "#7e7e9a";

                                            return (
                                              <div
                                                key={ri}
                                                className="flex items-center gap-3 p-3 rounded-xl bg-[#0b0b14] border border-[#1e1e32] hover:border-[#2a2a3d] transition-colors"
                                              >
                                                <div
                                                  className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                                                  style={{ background: `${color}15` }}
                                                >
                                                  <ResIcon className="w-4 h-4" style={{ color }} />
                                                </div>
                                                <div className="flex-1 min-w-0">
                                                  <p className="text-xs font-medium text-white truncate">
                                                    {resource.name}
                                                  </p>
                                                  <p
                                                    className="text-[10px] font-medium capitalize"
                                                    style={{ color }}
                                                  >
                                                    {resource.type}
                                                  </p>
                                                </div>
                                                {resource.url && (
                                                  <a
                                                    href={resource.url}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-[#5e5e7a] hover:text-white transition-colors"
                                                  >
                                                    <ExternalLink className="w-3.5 h-3.5" />
                                                  </a>
                                                )}
                                              </div>
                                            );
                                          })}
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                </>
              ) : (
                <p className="text-xs text-[#5e5e7a] text-center py-16">Roadmap not found.</p>
              )}
            </>
          )}
        </main>
      </div>

      {/* Fade-in animation style */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.4s ease-out;
        }
      `}</style>
    </div>
  );
}

export default RoadmapPage;
