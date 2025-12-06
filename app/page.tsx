"use client";

import FAQSection from "@/features/landing/components/faq-section";
import FeaturesSection from "@/features/landing/components/features-section";
import HeroSection from "@/features/landing/components/hero-section";

const Dashboard = () => {
  return (
    <div className="relative">
      <HeroSection />
      <FeaturesSection />
      <FAQSection />
    </div>
  );
};

export default Dashboard;
