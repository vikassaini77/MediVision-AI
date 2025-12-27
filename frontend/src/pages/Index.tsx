import { useState, useEffect } from "react";
import SplashScreen from "@/components/SplashScreen";
import Navbar from "@/components/landing/Navbar";
import HeroSection from "@/components/landing/HeroSection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import Footer from "@/components/landing/Footer";

const Index = () => {
  const [showSplash, setShowSplash] = useState(true);

  // Check if user has already seen splash in this session
  useEffect(() => {
    const hasSeenSplash = sessionStorage.getItem("hasSeenSplash");
    if (hasSeenSplash) {
      setShowSplash(false);
    }
  }, []);

  const handleSplashComplete = () => {
    sessionStorage.setItem("hasSeenSplash", "true");
    setShowSplash(false);
  };

  return (
    <>
      {showSplash && <SplashScreen onComplete={handleSplashComplete} />}
      
      <div className={`min-h-screen bg-background ${showSplash ? "opacity-0" : "opacity-100"} transition-opacity duration-500`}>
        <Navbar />
        <HeroSection />
        <FeaturesSection />
        <div id="how-it-works">
          <HowItWorksSection />
        </div>
        <Footer />
      </div>
    </>
  );
};

export default Index;
