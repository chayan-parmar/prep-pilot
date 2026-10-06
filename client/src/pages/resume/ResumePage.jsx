import { useEffect, useRef, useState } from "react";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/dashboard/TopHeader";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import {
  analyzeResumeApi,
  deleteResumeAnalysisApi,
  getResumeAnalysisApi,
  getResumeHistoryApi,
} from "../../services/resumeService";
import {
  AlertTriangle,
  Award,
  Briefcase,
  Check,
  CheckCircle2,
  ChevronDown,
  Copy,
  Eye,
  FileText,
  History,
  RefreshCw,
  ShieldCheck,
  Sparkles,
  Target,
  Trash2,
  TrendingUp,
  UploadCloud,
  XCircle,
} from "lucide-react";

const defaultTargetRole = "Full Stack Software Engineer";

const TARGET_ROLES = [
  "Frontend Developer",
  "Backend Developer",
  "Fullstack Developer",
  "Full Stack Software Engineer",
  "Mobile Developer",
  "DevOps Engineer",
  "Data Scientist",
  "Product Manager",
  "QA Engineer",
  "Cloud Architect",
  "Machine Learning Engineer",
  "Cybersecurity Analyst",
  "UI/UX Designer",
  "Other",
];

function ResumePage() {
  const { user } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Resume Analyzer");

  // Initialize target role from user profile, detecting preset vs custom
  const userRole = user?.targetRole || defaultTargetRole;
  const initialIsPreset = TARGET_ROLES.includes(userRole);
  const [targetRole, setTargetRole] = useState(initialIsPreset ? userRole : "Other");
  const [customRoleInput, setCustomRoleInput] = useState(initialIsPreset ? "" : userRole);

  const [file, setFile] = useState(null);
  const [resumeText, setResumeText] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isHistoryLoading, setIsHistoryLoading] = useState(true);
  const [analysisData, setAnalysisData] = useState(null);
  const [history, setHistory] = useState([]);
  const [copiedIndex, setCopiedIndex] = useState(null);
  const [copiedKeyword, setCopiedKeyword] = useState(null);
  const fileInputRef = useRef(null);

  // Helper to resolve the actual role string from dropdown + custom input
  const getResolvedRole = () => {
    if (targetRole === "Other") return customRoleInput.trim() || defaultTargetRole;
    return targetRole.trim() || defaultTargetRole;
  };

  useEffect(() => {
    async function loadInitialHistory() {
      try {
        setIsHistoryLoading(true);
        const res = await getResumeHistoryApi();
        const items = res.data || [];
        setHistory(items);
        if (items.length > 0) {
          setAnalysisData(items[0]);
          setTargetRole(items[0].targetRole || defaultTargetRole);
        }
      } catch (error) {
        toast.error(error.message || "Could not load resume history.");
      } finally {
        setIsHistoryLoading(false);
      }
    }

    loadInitialHistory();
  }, []);

  const processFileUpload = (selectedFile) => {
    const validTypes = [
      "application/pdf",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
      "text/plain",
    ];

    if (
      !validTypes.includes(selectedFile.type) &&
      !selectedFile.name.endsWith(".pdf") &&
      !selectedFile.name.endsWith(".docx") &&
      !selectedFile.name.endsWith(".txt")
    ) {
      toast.error("Please upload a PDF, DOCX, or TXT file.");
      return;
    }

    if (selectedFile.size > 10 * 1024 * 1024) {
      toast.error("File size exceeds the 10MB limit.");
      return;
    }

    setFile(selectedFile);
  };

  const handleFileSelect = (event) => {
    if (event.target.files?.[0]) {
      processFileUpload(event.target.files[0]);
    }
  };

  const handleDrop = (event) => {
    event.preventDefault();
    setIsDragging(false);
    if (event.dataTransfer.files?.[0]) {
      processFileUpload(event.dataTransfer.files[0]);
    }
  };

  const handleAnalyze = async () => {
    if (!file && resumeText.trim().length < 25) {
      toast.error("Upload a resume file or paste at least a few lines of resume text.");
      return;
    }

    const formData = new FormData();
    if (file) formData.append("resume", file);
    if (resumeText.trim()) formData.append("resumeText", resumeText.trim());
    formData.append("targetRole", getResolvedRole());

    try {
      setIsAnalyzing(true);
      toast.loading("Parsing resume and running ATS analysis...", { id: "resume-analyze" });
      const res = await analyzeResumeApi(formData);
      if (res.success && res.data) {
        setAnalysisData(res.data);
        setHistory((current) => [res.data, ...current.filter((item) => item.id !== res.data.id)]);
        toast.success("Resume analyzed and saved successfully.", { id: "resume-analyze" });
      }
    } catch (error) {
      toast.error(error.message || "Failed to analyze resume.", { id: "resume-analyze" });
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistory = async (analysisId) => {
    try {
      const res = await getResumeAnalysisApi(analysisId);
      if (res.success && res.data) {
        setAnalysisData(res.data);
        setTargetRole(res.data.targetRole || defaultTargetRole);
      }
    } catch (error) {
      toast.error(error.message || "Failed to open analysis.");
    }
  };

  const handleDeleteHistory = async (analysisId) => {
    try {
      await deleteResumeAnalysisApi(analysisId);
      const nextHistory = history.filter((item) => item.id !== analysisId);
      setHistory(nextHistory);
      if (analysisData?.id === analysisId) {
        setAnalysisData(nextHistory[0] || null);
      }
      toast.success("Analysis deleted.");
    } catch (error) {
      toast.error(error.message || "Failed to delete analysis.");
    }
  };

  const handleCopyBullet = (text, index) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    toast.success("Copied improved bullet point.");
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const handleCopyKeyword = (keyword) => {
    navigator.clipboard.writeText(keyword);
    setCopiedKeyword(keyword);
    toast.success(`Copied ${keyword}.`);
    setTimeout(() => setCopiedKeyword(null), 1800);
  };

  const scoreLabel = getScoreLabel(analysisData?.atsScore || 0);

  return (
    <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      <div
        className={`fixed inset-y-0 left-0 z-50 transform ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        } lg:relative lg:translate-x-0 transition-transform duration-300 ease-in-out`}
      >
        <Sidebar activeItem={activeTab} onItemSelect={(item) => setActiveTab(item)} onCloseMobile={() => setSidebarOpen(false)} />
      </div>

      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/60 z-40 lg:hidden backdrop-blur-sm"
        />
      )}

      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-6 sm:p-8 max-w-[1440px] w-full mx-auto space-y-8">
          <section className="flex flex-col xl:flex-row xl:items-center justify-between gap-5 pb-2 border-b border-[#1c1c32]">
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-[#a78bfa] mb-1">
                <Sparkles className="w-4 h-4 text-[#7c3aed]" />
                <span>AI-POWERED ATS RESUME AUDITOR</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-headings font-bold text-white tracking-tight">
                Resume Analyzer & ATS Optimizer
              </h1>
              <p className="text-xs sm:text-sm text-[#7e7e9a] mt-1 max-w-2xl">
                Upload or paste your resume to get ATS scoring, keyword gaps, formatting checks, and recruiter-ready bullet rewrites saved to your account.
              </p>
            </div>

            <div className="flex items-center gap-3 bg-[#131326] border border-[#22223a] px-4 py-2.5 rounded-2xl shrink-0">
              <Briefcase className="w-4 h-4 text-[#7c3aed]" />
              <div className="flex flex-col gap-1.5">
                <span className="text-[10px] uppercase font-bold text-[#6b6b8a] tracking-wider">Target Job Role</span>
                <div className="relative">
                  <select
                    value={targetRole}
                    onChange={(e) => {
                      setTargetRole(e.target.value);
                      if (e.target.value !== "Other") setCustomRoleInput("");
                    }}
                    className="bg-transparent text-xs font-semibold text-white focus:outline-none appearance-none cursor-pointer pr-5 w-56"
                  >
                    {TARGET_ROLES.map((role) => (
                      <option key={role} value={role} className="bg-[#131326] text-white">
                        {role}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-3 h-3 text-[#6b6b8a] absolute right-0 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
                {targetRole === "Other" && (
                  <input
                    type="text"
                    value={customRoleInput}
                    onChange={(e) => setCustomRoleInput(e.target.value)}
                    className="bg-transparent text-xs font-semibold text-white focus:outline-none w-56 border-b border-[#2a2a3d] pb-0.5 placeholder-[#5e5e7a]"
                    placeholder="Type your custom role..."
                  />
                )}
              </div>
              <Target className="w-4 h-4 text-[#06b6d4]" />
            </div>
          </section>

          <section className="grid grid-cols-1 xl:grid-cols-[1.2fr_0.8fr] gap-6">
            <div className="rounded-[24px] p-6 sm:p-8 bg-[#131326] border border-[#22223a] shadow-xl space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <h2 className="text-lg font-headings font-bold text-white flex items-center gap-2">
                    <UploadCloud className="w-5 h-5 text-[#7c3aed]" />
                    Upload Resume
                  </h2>
                  <p className="text-xs text-[#7e7e9a] mt-0.5">
                    PDF, DOCX, or TXT files up to 10MB. You can also paste raw resume text below.
                  </p>
                </div>
                {file && (
                  <div className="flex items-center gap-2 bg-[#181832] border border-[#282848] px-3.5 py-1.5 rounded-xl text-xs font-medium text-[#e8e8f0]">
                    <FileText className="w-4 h-4 text-[#a78bfa]" />
                    <span className="truncate max-w-[180px]">{file.name}</span>
                    <button
                      onClick={() => setFile(null)}
                      className="text-[#ef4444] hover:text-[#fca5a5] text-xs font-semibold ml-2 cursor-pointer"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>

              <div
                onDragOver={(event) => {
                  event.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-3 ${
                  isDragging
                    ? "border-[#7c3aed] bg-[#7c3aed]/10 scale-[1.01]"
                    : "border-[#262642] bg-[#0f0f1c]/60 hover:border-[#7c3aed]/60 hover:bg-[#16162e]"
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.txt"
                  onChange={handleFileSelect}
                  className="hidden"
                />
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#7c3aed]/20 to-[#06b6d4]/20 border border-[#7c3aed]/40 flex items-center justify-center text-[#a78bfa] shadow-lg shadow-[#7c3aed]/10">
                  {isAnalyzing ? <RefreshCw className="w-7 h-7 animate-spin" /> : <UploadCloud className="w-7 h-7" />}
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">
                    {file ? file.name : "Drag and drop your resume here, or click to browse"}
                  </p>
                  <p className="text-xs text-[#7e7e9a] mt-1">Supports PDF, DOCX, and TXT files</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold uppercase tracking-wider text-[#7e7e9a]">
                  Or paste resume text
                </label>
                <textarea
                  value={resumeText}
                  onChange={(event) => setResumeText(event.target.value)}
                  rows={7}
                  className="w-full rounded-2xl bg-[#0f0f1c] border border-[#242442] px-4 py-3 text-sm text-white placeholder:text-[#555570] focus:outline-none focus:border-[#7c3aed] resize-none"
                  placeholder="Paste resume text here if you do not want to upload a file..."
                />
              </div>

              <button
                onClick={handleAnalyze}
                disabled={isAnalyzing}
                className="inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-[#7c3aed] hover:bg-[#6d28d9] disabled:opacity-60 disabled:cursor-not-allowed text-sm font-bold text-white shadow-lg shadow-[#7c3aed]/25 transition-colors cursor-pointer"
              >
                {isAnalyzing ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
                <span>{isAnalyzing ? "Analyzing..." : "Analyze Resume"}</span>
              </button>
            </div>

            <div className="rounded-[24px] p-6 bg-[#131326] border border-[#22223a] shadow-xl space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-headings font-bold text-white flex items-center gap-2">
                  <History className="w-5 h-5 text-[#22d3ee]" />
                  Analysis History
                </h2>
                {isHistoryLoading && <RefreshCw className="w-4 h-4 text-[#7c3aed] animate-spin" />}
              </div>

              {history.length === 0 && !isHistoryLoading ? (
                <div className="rounded-2xl bg-[#0f0f1c] border border-[#1e1e34] p-5 text-sm text-[#8e8ea8]">
                  No saved analyses yet. Run your first resume scan to see it here.
                </div>
              ) : (
                <div className="space-y-3 max-h-[460px] overflow-y-auto pr-1">
                  {history.map((item) => (
                    <div
                      key={item.id}
                      className={`p-4 rounded-2xl border transition-colors ${
                        analysisData?.id === item.id
                          ? "bg-[#1a1733] border-[#7c3aed]/60"
                          : "bg-[#0f0f1c] border-[#1e1e34] hover:border-[#383854]"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="text-xs font-bold text-white truncate">{item.fileName}</p>
                          <p className="text-[11px] text-[#7e7e9a] mt-1 truncate">{item.targetRole}</p>
                          <p className="text-[10px] text-[#565674] mt-1">{formatDate(item.analyzedAt)}</p>
                        </div>
                        <div className="text-right shrink-0">
                          <span className="text-lg font-headings font-bold text-[#a78bfa]">{item.atsScore}%</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 mt-3">
                        <button
                          onClick={() => handleSelectHistory(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#181830] hover:bg-[#22223a] text-[11px] font-semibold text-[#e8e8f0] cursor-pointer"
                        >
                          <Eye className="w-3 h-3" />
                          View
                        </button>
                        <button
                          onClick={() => handleDeleteHistory(item.id)}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#ef4444]/10 hover:bg-[#ef4444]/20 text-[11px] font-semibold text-[#f87171] cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </section>

          {!analysisData ? (
            <section className="rounded-[24px] p-8 bg-[#131326] border border-[#22223a] text-center shadow-xl">
              <ShieldCheck className="w-10 h-10 text-[#7c3aed] mx-auto mb-3" />
              <h2 className="text-lg font-headings font-bold text-white">Ready for your first ATS scan</h2>
              <p className="text-sm text-[#8e8ea8] mt-2 max-w-xl mx-auto">
                Your results will appear here with score breakdowns, missing keywords, formatting checks, and bullet rewrites.
              </p>
            </section>
          ) : (
            <ResultsPanel
              analysisData={analysisData}
              scoreLabel={scoreLabel}
              copiedIndex={copiedIndex}
              copiedKeyword={copiedKeyword}
              onCopyBullet={handleCopyBullet}
              onCopyKeyword={handleCopyKeyword}
            />
          )}
        </main>
      </div>
    </div>
  );
}

function ResultsPanel({ analysisData, scoreLabel, copiedIndex, copiedKeyword, onCopyBullet, onCopyKeyword }) {
  return (
    <>
      <section className="grid grid-cols-1 lg:grid-cols-[1fr_2fr] gap-6">
        <div className="rounded-[24px] p-6 sm:p-7 bg-[#131326] border border-[#22223a] flex flex-col justify-between space-y-6 shadow-xl">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-headings font-bold text-white flex items-center gap-2">
              <Award className="w-4 h-4 text-[#a78bfa]" />
              Overall ATS Match
            </h3>
            <span className={`px-2.5 py-1 rounded-full border text-[11px] font-bold ${scoreLabel.className}`}>
              {scoreLabel.label}
            </span>
          </div>

          <div className="flex flex-col items-center justify-center py-2">
            <div className="relative w-44 h-44 flex items-center justify-center">
              <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" className="stroke-[#1d1d36]" strokeWidth="10" fill="transparent" />
                <circle
                  cx="50"
                  cy="50"
                  r="40"
                  className="stroke-[#7c3aed] transition-all duration-1000 ease-out"
                  strokeWidth="10"
                  strokeDasharray={2 * Math.PI * 40}
                  strokeDashoffset={2 * Math.PI * 40 * (1 - analysisData.atsScore / 100)}
                  strokeLinecap="round"
                  fill="transparent"
                />
              </svg>
              <div className="absolute flex flex-col items-center text-center">
                <span className="text-4xl font-headings font-extrabold text-white tracking-tight">
                  {analysisData.atsScore}<span className="text-lg text-[#a78bfa]">%</span>
                </span>
                <span className="text-[11px] font-medium text-[#7e7e9a] mt-0.5">Match Score</span>
              </div>
            </div>
          </div>

          <div className="text-xs text-[#8e8ea8] text-center leading-relaxed space-y-1">
            <p>
              Scanned <strong className="text-white">{analysisData.fileName}</strong> for <strong className="text-[#a78bfa]">{analysisData.targetRole}</strong>.
            </p>
            <p>{analysisData.wordCount || 0} words parsed.</p>
          </div>
        </div>

        <div className="rounded-[24px] p-6 sm:p-7 bg-[#131326] border border-[#22223a] space-y-5 shadow-xl">
          <h3 className="text-base font-headings font-bold text-white flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#22d3ee]" />
            ATS Audit Sub-Scores
          </h3>
          <ScoreBar label="Formatting & Structural Parse" score={analysisData.formattingScore} color="from-[#10b981] to-[#34d399]" />
          <ScoreBar label="Target Keyword Density" score={analysisData.keywordScore} color="from-[#f59e0b] to-[#fbbf24]" />
          <ScoreBar label="Impact & Quantified Accomplishments" score={analysisData.impactScore} color="from-[#7c3aed] to-[#a78bfa]" />
          <ScoreBar label="Brevity & Strong Action Verbs" score={analysisData.brevityScore} color="from-[#06b6d4] to-[#22d3ee]" />
        </div>
      </section>

      <section className="rounded-[24px] p-6 sm:p-8 bg-[#131326] border border-[#22223a] space-y-6 shadow-xl">
        <div>
          <h3 className="text-base font-headings font-bold text-white flex items-center gap-2">
            <Target className="w-4 h-4 text-[#f59e0b]" />
            Keyword Gap Analysis
          </h3>
          <p className="text-xs text-[#7e7e9a] mt-0.5">Click missing keywords to copy them into your resume skills section.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <KeywordList title="Detected Skills & Keywords" items={analysisData.matchedKeywords} type="matched" />
          <KeywordList title="Missing High-Impact Keywords" items={analysisData.missingKeywords} type="missing" copiedKeyword={copiedKeyword} onCopyKeyword={onCopyKeyword} />
        </div>
      </section>

      {analysisData.aiSummary && (
        <section className="rounded-[24px] p-6 sm:p-8 bg-gradient-to-br from-[#1a1040] to-[#131326] border border-[#7c3aed]/40 space-y-3 shadow-xl">
          <div className="flex items-center gap-2">
            <span className="w-7 h-7 rounded-full bg-[#7c3aed]/20 flex items-center justify-center shrink-0">
              <Sparkles className="w-4 h-4 text-[#a78bfa]" />
            </span>
            <h3 className="text-sm font-headings font-bold text-white">AI Resume Insight</h3>
            <span className="text-[10px] font-bold text-[#a78bfa] bg-[#7c3aed]/10 border border-[#7c3aed]/30 px-2 py-0.5 rounded-full">Powered by AI</span>
          </div>
          <p className="text-sm text-[#c4b5fd] leading-relaxed pl-9">{analysisData.aiSummary}</p>
        </section>
      )}

      <section className="rounded-[24px] p-6 sm:p-8 bg-[#131326] border border-[#22223a] space-y-6 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="text-base font-headings font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-[#7c3aed]" />
              Bullet Point Rewriter
            </h3>
            <p className="text-xs text-[#7e7e9a] mt-0.5">Rewrite weak bullets with stronger scope, action verbs, and measurable impact.</p>
          </div>
          <span className="text-xs font-semibold text-[#a78bfa] bg-[#7c3aed]/10 border border-[#7c3aed]/30 px-3 py-1 rounded-full self-start sm:self-auto">
            {analysisData.bulletSuggestions?.length || 0} recommendations
          </span>
        </div>

        <div className="space-y-4">
          {(analysisData.bulletSuggestions || []).map((item, index) => (
            <div key={`${item.section}-${index}`} className="p-5 rounded-2xl bg-[#0f0f1c] border border-[#22223c] space-y-4 hover:border-[#7c3aed]/40 transition-colors">
              <div className="flex items-center justify-between gap-3">
                <span className="text-xs font-bold text-[#a78bfa]">{item.section}</span>
                <span className="px-2.5 py-1 rounded-md bg-[#10b981]/15 text-[#10b981] border border-[#10b981]/30 text-[10px] font-bold">{item.metricGain}</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-xl bg-[#141426] border border-[#22223a] space-y-1.5">
                  <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#ef4444]">Original Bullet</span>
                  <p className="text-xs text-[#a0a0ba] leading-relaxed font-mono">"{item.original}"</p>
                </div>
                <div className="p-3.5 rounded-xl bg-[#191932] border border-[#7c3aed]/40 space-y-2">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[10px] font-extrabold uppercase tracking-wider text-[#10b981] flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      Improved Version
                    </span>
                    <button
                      onClick={() => onCopyBullet(item.improved, index)}
                      className="inline-flex items-center gap-1.5 text-[11px] font-semibold text-[#a78bfa] hover:text-white bg-[#7c3aed]/20 px-2.5 py-1 rounded-lg transition-colors cursor-pointer"
                    >
                      {copiedIndex === index ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3" />}
                      <span>{copiedIndex === index ? "Copied" : "Copy"}</span>
                    </button>
                  </div>
                  <p className="text-xs text-white leading-relaxed font-semibold">"{item.improved}"</p>
                </div>
              </div>
              <p className="text-[11px] text-[#7e7e9a] italic">Why this works: {item.rationale}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[24px] p-6 sm:p-8 bg-[#131326] border border-[#22223a] space-y-6 shadow-xl">
        <div>
          <h3 className="text-base font-headings font-bold text-white flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-[#10b981]" />
            ATS Formatting Checklist
          </h3>
          <p className="text-xs text-[#7e7e9a] mt-0.5">Checks whether your file can be read cleanly by automated tracking systems.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {(analysisData.formatChecks || []).map((check, index) => (
            <div key={`${check.rule}-${index}`} className="p-4 rounded-xl bg-[#0f0f1c] border border-[#1e1e34] flex items-start gap-3">
              <div className="mt-0.5 shrink-0">
                {check.passed ? <CheckCircle2 className="w-4 h-4 text-[#10b981]" /> : <XCircle className="w-4 h-4 text-[#ef4444]" />}
              </div>
              <div>
                <h4 className={`text-xs font-semibold ${check.passed ? "text-white" : "text-[#ef4444]"}`}>{check.rule}</h4>
                <p className="text-[11px] text-[#7e7e9a] mt-0.5">{check.detail}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ScoreBar({ label, score = 0, color }) {
  return (
    <div className="space-y-1.5">
      <div className="flex justify-between text-xs font-semibold gap-4">
        <span className="text-white">{label}</span>
        <span className="text-[#a78bfa]">{score}%</span>
      </div>
      <div className="w-full h-2.5 rounded-full bg-[#181830] border border-[#242440] overflow-hidden">
        <div className={`h-full bg-gradient-to-r ${color} rounded-full transition-all duration-700`} style={{ width: `${Math.min(100, Math.max(0, score))}%` }} />
      </div>
    </div>
  );
}

function KeywordList({ title, items = [], type, copiedKeyword, onCopyKeyword }) {
  const isMatched = type === "matched";
  return (
    <div className="space-y-3 p-5 rounded-2xl bg-[#0f0f1c] border border-[#1e1e34]">
      <div className={`flex items-center gap-2 text-xs font-bold ${isMatched ? "text-[#10b981]" : "text-[#ef4444]"}`}>
        {isMatched ? <CheckCircle2 className="w-4 h-4" /> : <AlertTriangle className="w-4 h-4" />}
        <span>{title} ({items.length})</span>
      </div>
      <div className="flex flex-wrap gap-2 pt-1">
        {items.length === 0 ? (
          <span className="text-xs text-[#7e7e9a]">Nothing to show yet.</span>
        ) : (
          items.map((keyword) =>
            isMatched ? (
              <span key={keyword} className="px-3 py-1.5 rounded-xl bg-[#10b981]/10 border border-[#10b981]/30 text-xs font-semibold text-[#34d399] flex items-center gap-1.5">
                <Check className="w-3 h-3 text-[#10b981]" />
                {keyword}
              </span>
            ) : (
              <button
                key={keyword}
                onClick={() => onCopyKeyword(keyword)}
                className="px-3 py-1.5 rounded-xl bg-[#ef4444]/10 border border-[#ef4444]/30 text-xs font-semibold text-[#f87171] hover:bg-[#ef4444]/20 transition-all cursor-pointer flex items-center gap-1.5 group"
              >
                <span>+ {keyword}</span>
                {copiedKeyword === keyword ? <Check className="w-3 h-3 text-[#10b981]" /> : <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />}
              </button>
            )
          )
        )}
      </div>
    </div>
  );
}

function getScoreLabel(score) {
  if (score >= 85) {
    return { label: "Strong Match", className: "bg-[#10b981]/15 text-[#10b981] border-[#10b981]/30" };
  }
  if (score >= 70) {
    return { label: "Good Match", className: "bg-[#f59e0b]/15 text-[#f59e0b] border-[#f59e0b]/30" };
  }
  return { label: "Needs Work", className: "bg-[#ef4444]/15 text-[#ef4444] border-[#ef4444]/30" };
}

function formatDate(value) {
  if (!value) return "Just now";
  return new Intl.DateTimeFormat("en", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(new Date(value));
}

export default ResumePage;

