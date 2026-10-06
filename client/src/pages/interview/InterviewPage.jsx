import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/dashboard/Sidebar";
import TopHeader from "../../components/dashboard/TopHeader";
import {
  Video,
  ArrowLeft,
  Lock,
  CheckCircle2,
  Zap,
  Crown,
  Sparkles,
  Mic,
  Brain,
  MessageSquare,
  BarChart3,
  Star,
} from "lucide-react";

function InterviewPage() {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("Mock Interview");
  const [selectedPlan, setSelectedPlan] = useState("pro");

  const plans = [
    {
      id: "starter",
      name: "Starter",
      price: "0",
      period: "forever",
      description: "Try the basics",
      features: [
        "2 mock interviews per month",
        "Text-based Q&A format",
        "Basic feedback summary",
        "3 interview topics",
      ],
      cta: "Current Plan",
      disabled: true,
      variant: "default",
    },
    {
      id: "pro",
      name: "Pro",
      price: "19",
      period: "/month",
      description: "For serious prep",
      features: [
        "Unlimited mock interviews",
        "Voice-based AI interviewer",
        "Real-time feedback & scoring",
        "All interview topics & roles",
        "Detailed performance analytics",
        "Custom difficulty levels",
      ],
      cta: "Upgrade to Pro",
      disabled: false,
      variant: "featured",
      badge: "MOST POPULAR",
    },
    {
      id: "teams",
      name: "Teams",
      price: "49",
      period: "/month",
      description: "For cohorts & bootcamps",
      features: [
        "Everything in Pro",
        "Team dashboard & tracking",
        "Admin controls & invites",
        "Priority support",
        "Custom interview templates",
        "Bulk analytics export",
      ],
      cta: "Contact Sales",
      disabled: false,
      variant: "default",
    },
  ];

  const interviewFeatures = [
    {
      icon: Mic,
      title: "Voice-Based Interviews",
      description: "Talk naturally with our AI interviewer — just like a real interview",
    },
    {
      icon: Brain,
      title: "Adaptive Difficulty",
      description: "Questions adjust based on your performance in real time",
    },
    {
      icon: MessageSquare,
      title: "Real-Time Feedback",
      description: "Get instant feedback on clarity, depth, and technical accuracy",
    },
    {
      icon: BarChart3,
      title: "Performance Analytics",
      description: "Detailed scoring across communication, technical skills, and confidence",
    },
  ];

  return (
    <div className="min-h-screen bg-[#0b0b14] text-[#e8e8f0] flex font-sans antialiased selection:bg-[#7c3aed] selection:text-white">
      {/* Sidebar */}
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

      {/* Main */}
      <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
        <TopHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        <main className="flex-1 p-6 sm:p-8 max-w-[1200px] w-full mx-auto space-y-8">
          {/* Back button */}
          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-2 text-xs font-medium text-[#7e7e9a] hover:text-white transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Dashboard</span>
          </button>

          {/* Hero Section */}
          <div className="relative rounded-[24px] p-8 sm:p-10 bg-[#131326] border border-[#22223a] shadow-2xl shadow-black/30 overflow-hidden text-center space-y-5">
            {/* Background glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-[#7c3aed]/8 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -right-24 w-56 h-56 bg-[#06b6d4]/8 rounded-full blur-3xl pointer-events-none" />

            {/* Icon */}
            <div className="relative mx-auto w-20 h-20 rounded-2xl bg-gradient-to-br from-[#7c3aed]/20 to-[#06b6d4]/20 border border-[#7c3aed]/30 flex items-center justify-center">
              <Video className="w-9 h-9 text-[#a78bfa]" />
              <div className="absolute -top-1.5 -right-1.5 w-7 h-7 rounded-full bg-gradient-to-r from-[#f59e0b] to-[#f97316] flex items-center justify-center shadow-lg shadow-[#f59e0b]/30">
                <Crown className="w-3.5 h-3.5 text-white" />
              </div>
            </div>

            <div className="space-y-3 relative">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f59e0b]/15 border border-[#f59e0b]/30 text-[11px] font-semibold text-[#f59e0b]">
                <Zap className="w-3.5 h-3.5 fill-[#f59e0b]" />
                <span>PRO FEATURE</span>
              </div>

              <h1 className="text-2xl sm:text-3xl font-headings font-bold text-white">
                AI Mock Interviews
              </h1>

              <p className="text-sm text-[#8e8ea8] leading-relaxed max-w-md mx-auto">
                Practice with a realistic AI interviewer that adapts to your role, asks follow-ups, and gives you detailed performance reports.
              </p>
            </div>
          </div>

          {/* Feature Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {interviewFeatures.map((feat, i) => {
              const Icon = feat.icon;
              return (
                <div
                  key={i}
                  className="rounded-[20px] p-5 bg-[#131326] border border-[#22223a] flex items-start gap-4 hover:border-[#7c3aed]/30 transition-colors shadow-lg shadow-black/10"
                >
                  <div className="w-10 h-10 rounded-xl bg-[#7c3aed]/15 border border-[#7c3aed]/25 flex items-center justify-center text-[#a78bfa] shrink-0">
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-white">{feat.title}</h3>
                    <p className="text-xs text-[#7e7e9a] mt-1 leading-relaxed">{feat.description}</p>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Pricing Cards */}
          <div className="space-y-5">
            <div className="text-center space-y-2">
              <h2 className="text-xl font-headings font-bold text-white">
                Choose Your Plan
              </h2>
              <p className="text-xs text-[#7e7e9a]">
                Unlock unlimited mock interviews and supercharge your prep
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {plans.map((plan) => (
                <div
                  key={plan.id}
                  onClick={() => !plan.disabled && setSelectedPlan(plan.id)}
                  className={`relative rounded-[20px] p-6 border transition-all duration-200 cursor-pointer space-y-5 ${
                    plan.variant === "featured"
                      ? "bg-gradient-to-b from-[#1a1440] to-[#131326] border-[#7c3aed]/50 shadow-xl shadow-[#7c3aed]/10 scale-[1.02]"
                      : "bg-[#131326] border-[#22223a] hover:border-[#7c3aed]/30"
                  } ${selectedPlan === plan.id ? "ring-2 ring-[#7c3aed]/50" : ""}`}
                >
                  {/* Badge */}
                  {plan.badge && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] text-[10px] font-bold text-white tracking-wider shadow-lg shadow-[#7c3aed]/30">
                      {plan.badge}
                    </div>
                  )}

                  {/* Plan Header */}
                  <div className="space-y-1">
                    <h3 className="text-base font-headings font-bold text-white">{plan.name}</h3>
                    <p className="text-[11px] text-[#7e7e9a]">{plan.description}</p>
                  </div>

                  {/* Price */}
                  <div className="flex items-baseline gap-1">
                    <span className="text-3xl font-headings font-bold text-white">${plan.price}</span>
                    <span className="text-xs text-[#7e7e9a]">{plan.period}</span>
                  </div>

                  {/* Features */}
                  <ul className="space-y-2.5">
                    {plan.features.map((feat, i) => (
                      <li key={i} className="flex items-start gap-2.5 text-xs text-[#d1d1e0]">
                        <CheckCircle2
                          className={`w-4 h-4 shrink-0 mt-0.5 ${
                            plan.variant === "featured" ? "text-[#7c3aed]" : "text-[#10b981]"
                          }`}
                        />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>

                  {/* CTA Button */}
                  <button
                    disabled={plan.disabled}
                    className={`w-full py-3 rounded-xl text-xs font-semibold transition-all ${
                      plan.disabled
                        ? "bg-[#1e1e34] text-[#555570] cursor-not-allowed border border-[#2a2a40]"
                        : plan.variant === "featured"
                        ? "bg-gradient-to-r from-[#7c3aed] to-[#8b5cf6] hover:from-[#6d28d9] hover:to-[#7c3aed] text-white shadow-lg shadow-[#7c3aed]/30 hover:shadow-[#7c3aed]/50 cursor-pointer transform hover:scale-[1.02] active:scale-[0.98]"
                        : "bg-[#1e1e34] hover:bg-[#262642] text-white border border-[#2a2a40] cursor-pointer"
                    }`}
                  >
                    {plan.cta}
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Social Proof */}
          <div className="rounded-[20px] p-6 bg-[#131326] border border-[#22223a] shadow-lg shadow-black/10">
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4">
                <div className="flex -space-x-2">
                  {["#7c3aed", "#06b6d4", "#10b981", "#f97316"].map((color, i) => (
                    <div
                      key={i}
                      className="w-8 h-8 rounded-full border-2 border-[#131326] flex items-center justify-center text-white text-[10px] font-bold"
                      style={{ backgroundColor: color }}
                    >
                      {["A", "S", "R", "M"][i]}
                    </div>
                  ))}
                </div>
                <div>
                  <p className="text-xs font-semibold text-white">Trusted by 10,000+ professionals</p>
                  <div className="flex items-center gap-1 mt-0.5">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 text-[#f59e0b] fill-[#f59e0b]" />
                    ))}
                    <span className="text-[11px] text-[#7e7e9a] ml-1">4.9/5 rating</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2 text-[11px] text-[#7e7e9a]">
                <Lock className="w-3.5 h-3.5 text-[#10b981]" />
                <span>Secure payment • Cancel anytime</span>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default InterviewPage;
