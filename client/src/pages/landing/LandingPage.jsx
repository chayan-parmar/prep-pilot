import Navbar from "../../components/landing/Navbar";
import HeroSection from "../../components/landing/HeroSection";
import Features from "../../components/landing/Features";
import HowItWorks from "../../components/landing/HowItWorks";
import Pricing from "../../components/landing/Pricing";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";
import { landingContent } from "./landingContent";

function LandingPage() {
  return (
    <div className="min-h-screen bg-[var(--background)] font-[var(--font-body)]">
      <Navbar brand={landingContent.brand} navItems={landingContent.navItems} />
      <HeroSection hero={landingContent.hero} />
      <Features section={landingContent.featuresSection} />
      <HowItWorks section={landingContent.processSection} />
      <Pricing section={landingContent.pricingSection} />
      <CTA cta={landingContent.cta} />
      <Footer brand={landingContent.brand} footer={landingContent.footer} />
    </div>
  );
}
export default LandingPage;
