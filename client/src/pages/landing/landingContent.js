export const landingContent = {
  brand: {
    name: "PrepPilot",
    mark: "PP",
  },
  navItems: [
    { label: "Features", href: "#features" },
    { label: "How It Works", href: "#how-it-works" },
    { label: "Pricing", href: "#pricing" },
    { label: "Resources", href: "#resources" },
  ],
  hero: {
    eyebrow: "AI-Powered Interview Preparation",
    title: "Crack Interviews",
    highlightedTitle: "with the Power of AI",
    description:
      "Analyze your resume, get personalized roadmaps, practice with AI, and land your dream job. Your all-in-one interview preparation platform.",
    primaryCta: { label: "Get Started Free", to: "/register" },
    secondaryCta: { label: "Watch Demo" },
    stats: [
      { value: "10K+", label: "Active Users" },
      { value: "50K+", label: "Mock Interviews" },
      { value: "95%", label: "Satisfaction Rate" },
      { value: "4.9/5", label: "User Rating" },
    ],
    analysis: {
      title: "Interview Analysis",
      rows: [
        { label: "Technical Skills", value: "92%", color: "var(--success)" },
        { label: "Communication", value: "78%", color: "#06b6d4" },
        { label: "Problem Solving", value: "85%", color: "var(--warning)" },
      ],
      insight: "AI: Strong JS skills detected!",
    },
    floatingCards: [
      { type: "readiness", label: "72% Ready", className: "left-3 top-3" },
      {
        type: "code",
        label: "145 Problems Solved",
        className: "bottom-14 left-5",
      },
      {
        type: "mock",
        label: "Mock Interview Ready",
        className: "bottom-5 right-7 border-[var(--primary)] bg-[var(--primary)]",
      },
    ],
  },
  featuresSection: {
    eyebrow: "Powerful Features",
    title: "Everything You Need to Succeed",
    description:
      "From resume analysis to mock interviews - our AI handles it all so you can focus on what matters.",
    features: [
      {
        icon: "resume",
        color: "purple",
        title: "Resume Analyzer",
        description:
          "Upload your resume and get AI-powered analysis with ATS score, skill gaps, and improvement suggestions.",
      },
      {
        icon: "roadmap",
        color: "teal",
        title: "Personalized Roadmap",
        description:
          "Get a custom learning roadmap based on your target role, current skills, and timeline.",
      },
      {
        icon: "interview",
        color: "green",
        title: "AI Mock Interview",
        description:
          "Practice with an AI interviewer that gives real-time feedback on your answers, tone, and confidence.",
      },
      {
        icon: "coding",
        color: "amber",
        title: "Coding Practice",
        description:
          "Solve real interview problems with an AI-powered code editor and detailed explanations.",
      },
      {
        icon: "mentor",
        color: "purple",
        title: "AI Mentor",
        description:
          "Chat with your personal AI mentor anytime for guidance, tips, and career advice.",
      },
      {
        icon: "analytics",
        color: "teal",
        title: "Progress Analytics",
        description:
          "Track your growth with detailed analytics, streaks, and performance reports over time.",
      },
    ],
  },
  processSection: {
    eyebrow: "Simple Process",
    title: "How It Works",
    steps: [
      {
        number: "01",
        title: "Upload Resume",
        description: "Upload your resume and job description to get started.",
        icon: "upload",
      },
      {
        number: "02",
        title: "AI Analysis",
        description: "Our AI analyzes your profile and creates a personalized plan.",
        icon: "analysis",
      },
      {
        number: "03",
        title: "Practice & Learn",
        description: "Follow your roadmap, take quizzes, and practice coding.",
        icon: "practice",
      },
      {
        number: "04",
        title: "Get Hired",
        description: "Walk into interviews with confidence and land your dream job.",
        icon: "hired",
      },
    ],
  },
  pricingSection: {
    eyebrow: "Pricing",
    title: "Simple, Transparent Pricing",
    description: "Start free, upgrade when you need more.",
    plans: [
      {
        title: "Starter",
        price: "0",
        //description: "Perfect to try the platform",
        features: [
          "5 Mock Interviews/month",
          "Resume Analysis",
          "Basic Roadmap",
          "10 Coding Problems",
        ],
        variant: "default",
        ctaLabel: "Start Free",
      },
      {
        title: "Pro",
        price: "19",
        // description: "For serious interview prep",
        features: [
          "Unlimited Mock Interviews",
          "Advanced AI Mentor",
          "Full Roadmap",
          "Unlimited Coding",
          "Progress Analytics",
        ],
        variant: "featured",
        ctaLabel: "Get Started",
      },
      {
        title: "Teams",
        price: "49",
        //description: "For cohorts and teams",
        features: [
          "Everything in Pro",
          "Team Dashboard",
          "Admin Controls",
          "Priority Support",
          "Custom Branding",
        ],
        variant: "default",
        ctaLabel: "Start Free",
      },
    ],
  },
  cta: {
    title: "Ready to Crack Your Next Interview?",
    description:
      "Join 10,000+ professionals who landed their dream jobs using PrepPilot.",
    primaryCta: { label: "Start for Free", to: "/register" },
    secondaryCta: { label: "Talk to Sales" },
  },
  footer: {
    links: [
      { label: "Privacy Policy", href: "#" },
      { label: "Terms of Service", href: "#" },
      { label: "Contact", href: "#" },
    ],
    copyright: "2024 PrepPilot. All rights reserved.",
  },
};
