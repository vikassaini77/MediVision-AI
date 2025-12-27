import { Button } from "@/components/ui/button";
import { ArrowRight, Play } from "lucide-react";
import { Link } from "react-router-dom";

const HeroSection = () => {
  const scrollToFeatures = () => {
    document.getElementById("features")?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Background elements */}
      <div className="absolute inset-0 bg-gradient-dark" />
      
      {/* Animated grid pattern */}
      <div 
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px),
                           linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glowing orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-float" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-accent/10 rounded-full blur-3xl animate-float" style={{ animationDelay: "1.5s" }} />

      <div className="container relative z-10 px-4 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left content */}
          <div className="space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium animate-fade-in">
                <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                AI-Powered Medical Imaging
              </div>
              
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight animate-fade-in-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
                <span className="text-foreground">Explainable AI for</span>
                <br />
                <span className="bg-gradient-medical bg-clip-text text-transparent">Medical Imaging</span>
              </h1>
              
              <p className="text-lg md:text-xl text-muted-foreground max-w-xl mx-auto lg:mx-0 animate-fade-in-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
                Radiology-grade AI screening with transparency and clinical insight. 
                Powered by Grad-CAM explainability for trustworthy diagnostics.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start animate-fade-in-up opacity-0" style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}>
              <Link to="/dashboard">
                <Button variant="hero" className="w-full sm:w-auto">
                  Try Live Demo
                  <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
              <Button variant="hero-outline" onClick={scrollToFeatures} className="w-full sm:w-auto">
                <Play className="w-5 h-5" />
                Explore Features
              </Button>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-3 gap-6 pt-8 animate-fade-in-up opacity-0" style={{ animationDelay: "0.4s", animationFillMode: "forwards" }}>
              {[
                { value: "99.2%", label: "Accuracy" },
                { value: "< 2s", label: "Analysis Time" },
                { value: "100%", label: "Explainable" },
              ].map((stat) => (
                <div key={stat.label} className="text-center lg:text-left">
                  <div className="text-2xl md:text-3xl font-bold text-primary">{stat.value}</div>
                  <div className="text-sm text-muted-foreground">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Right content - Animated Medical Visual */}
          <div className="relative flex justify-center lg:justify-end animate-fade-in opacity-0" style={{ animationDelay: "0.5s", animationFillMode: "forwards" }}>
            <div className="relative w-full max-w-lg aspect-square">
              {/* Main container with glow */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-card to-secondary/50 border border-border shadow-glow-lg overflow-hidden">
                {/* Scan line effect */}
                <div className="absolute inset-0 scan-line" />
                
                {/* X-ray visualization */}
                <div className="absolute inset-8 flex items-center justify-center">
                  <svg
                    viewBox="0 0 200 200"
                    className="w-full h-full"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Chest outline */}
                    <path
                      d="M100 30 C60 30, 30 60, 30 100 C30 150, 50 170, 100 170 C150 170, 170 150, 170 100 C170 60, 140 30, 100 30"
                      className="stroke-primary/30 stroke-2 fill-none"
                    />
                    
                    {/* Ribcage lines */}
                    {[45, 60, 75, 90, 105, 120].map((y, i) => (
                      <path
                        key={y}
                        d={`M${50 + i * 2} ${y} Q100 ${y + 5}, ${150 - i * 2} ${y}`}
                        className="stroke-primary/20 stroke-1 fill-none"
                      />
                    ))}
                    
                    {/* Left Lung */}
                    <path
                      d="M70 55 C45 60, 35 85, 35 110 C35 145, 55 160, 75 160 C90 160, 95 145, 95 125 L95 75 C95 65, 85 55, 70 55"
                      className="fill-primary/5 stroke-primary/40 stroke-2"
                    />
                    
                    {/* Right Lung */}
                    <path
                      d="M130 55 C155 60, 165 85, 165 110 C165 145, 145 160, 125 160 C110 160, 105 145, 105 125 L105 75 C105 65, 115 55, 130 55"
                      className="fill-primary/5 stroke-primary/40 stroke-2"
                    />

                    {/* Heart */}
                    <ellipse
                      cx="100"
                      cy="105"
                      rx="18"
                      ry="22"
                      className="fill-primary/10 stroke-primary/50 stroke-2 animate-heartbeat"
                    />

                    {/* Grad-CAM Heatmap overlays */}
                    <ellipse
                      cx="60"
                      cy="100"
                      rx="22"
                      ry="30"
                      fill="url(#heroHeatmap1)"
                      className="animate-pulse opacity-70"
                      style={{ animationDuration: "3s" }}
                    />
                    <ellipse
                      cx="140"
                      cy="95"
                      rx="18"
                      ry="25"
                      fill="url(#heroHeatmap2)"
                      className="animate-pulse opacity-50"
                      style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
                    />

                    <defs>
                      <radialGradient id="heroHeatmap1" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(0, 80%, 55%)" stopOpacity="0.6" />
                        <stop offset="40%" stopColor="hsl(30, 90%, 55%)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="heroHeatmap2" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(45, 90%, 55%)" stopOpacity="0.5" />
                        <stop offset="60%" stopColor="hsl(80, 70%, 50%)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                </div>

                {/* Floating data points */}
                <div className="absolute top-6 right-6 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 animate-float" style={{ animationDelay: "0.5s" }}>
                  <div className="text-xs text-muted-foreground">AI Confidence</div>
                  <div className="text-lg font-bold text-primary">94.7%</div>
                </div>
                
                <div className="absolute bottom-6 left-6 bg-card/80 backdrop-blur-sm border border-border rounded-lg p-3 animate-float" style={{ animationDelay: "1s" }}>
                  <div className="text-xs text-muted-foreground">Risk Level</div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-risk-medium" />
                    <span className="text-sm font-medium text-foreground">Moderate</span>
                  </div>
                </div>
              </div>

              {/* Decorative rings */}
              <div className="absolute -inset-4 rounded-3xl border border-primary/10 animate-pulse" style={{ animationDuration: "4s" }} />
              <div className="absolute -inset-8 rounded-3xl border border-primary/5" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom gradient fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background to-transparent" />
    </section>
  );
};

export default HeroSection;
