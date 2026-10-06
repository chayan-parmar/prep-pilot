import React from "react";
import ComingSoonPage from "../../components/common/ComingSoonPage";
import { Sparkles } from "lucide-react";

function AIMentorPage() {
  return (
    <ComingSoonPage
      title="AI Mentor"
      icon={Sparkles}
      description="Your personal AI career coach — get instant answers, study guidance, and interview strategy tailored to your profile."
      features={[
        "24/7 AI chat mentor for interview prep questions",
        "Personalized study schedules based on your weak areas",
        "Real-time feedback on your mock interview answers",
        "Career guidance and resume improvement suggestions",
      ]}
    />
  );
}

export default AIMentorPage;
