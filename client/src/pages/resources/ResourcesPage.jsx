import React from "react";
import ComingSoonPage from "../../components/common/ComingSoonPage";
import { Folder } from "lucide-react";

function ResourcesPage() {
  return (
    <ComingSoonPage
      title="Resources"
      icon={Folder}
      description="A curated library of articles, videos, cheat sheets, and interview prep materials — all organized by topic."
      features={[
        "Topic-wise curated articles and video tutorials",
        "Downloadable cheat sheets for quick revision",
        "Company-specific interview guides",
        "Community-contributed resources and tips",
      ]}
    />
  );
}

export default ResourcesPage;
