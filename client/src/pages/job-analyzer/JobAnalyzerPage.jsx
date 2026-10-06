import React from "react";
import ComingSoonPage from "../../components/common/ComingSoonPage";
import { Briefcase } from "lucide-react";

function JobAnalyzerPage() {
  return (
    <ComingSoonPage
      title="Job Analyzer"
      icon={Briefcase}
      description="AI-powered job description analysis — match your skills to real job postings and get tailored preparation plans."
      features={[
        "Paste any job URL or description for instant analysis",
        "Skill gap identification with personalized study plans",
        "Company-specific interview pattern insights",
        "Salary benchmarking and market position analysis",
      ]}
    />
  );
}

export default JobAnalyzerPage;
