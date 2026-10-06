import React from "react";
import ComingSoonPage from "../../components/common/ComingSoonPage";
import { Code2 } from "lucide-react";

function CodingPracticePage() {
  return (
    <ComingSoonPage
      title="Coding Practice"
      icon={Code2}
      description="Solve curated DSA problems with an integrated code editor, AI hints, and step-by-step solutions."
      features={[
        "Built-in code editor with multi-language support",
        "100+ curated problems from real interview rounds",
        "AI-powered hints and solution explanations",
        "Timed practice mode to simulate real interviews",
      ]}
    />
  );
}

export default CodingPracticePage;
