import React from "react";
import ComingSoonPage from "../../components/common/ComingSoonPage";
import { BookOpen } from "lucide-react";

function LearnPage() {
  return (
    <ComingSoonPage
      title="Learn"
      icon={BookOpen}
      description="AI-curated learning paths with interactive lessons, code examples, and topic mastery tracking."
      features={[
        "Structured learning modules for every tech stack",
        "Interactive code examples and sandboxes",
        "AI-generated summaries and key takeaways",
        "Progress tracking with topic mastery badges",
      ]}
    />
  );
}

export default LearnPage;
