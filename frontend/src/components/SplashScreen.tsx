import { useEffect, useState } from "react";

interface SplashScreenProps {
  onComplete: () => void;
}

const SplashScreen = ({ onComplete }: SplashScreenProps) => {
  const [phase, setPhase] = useState<"initial" | "animate" | "fadeOut">("initial");

  useEffect(() => {
    // Start animation after a brief delay
    const animateTimer = setTimeout(() => setPhase("animate"), 100);
    
    // Begin fade out
    const fadeTimer = setTimeout(() => setPhase("fadeOut"), 2800);
    
    // Complete and unmount
    const completeTimer = setTimeout(onComplete, 3500);

    return () => {
      clearTimeout(animateTimer);
      clearTimeout(fadeTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center bg-background transition-opacity duration-700 ${
        phase === "fadeOut" ? "opacity-0" : "opacity-100"
      }`}
    >
      {/* Background gradient glow */}
      <div className="absolute inset-0 overflow-hidden">
        <div 
          className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-gradient-radial from-primary/20 via-primary/5 to-transparent transition-all duration-1000 ${
            phase === "animate" ? "scale-100 opacity-100" : "scale-50 opacity-0"
          }`}
        />
      </div>

      <div className="relative flex flex-col items-center gap-8">
        {/* Animated Lungs SVG */}
        <div className={`relative transition-all duration-1000 ${phase === "animate" ? "scale-100 opacity-100" : "scale-90 opacity-0"}`}>
          <svg
            viewBox="0 0 200 200"
            className="w-48 h-48"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Left Lung */}
            <path
              d="M70 60 C50 65, 35 85, 35 110 C35 140, 50 160, 70 165 C85 168, 90 160, 95 140 L95 80 C95 70, 85 60, 70 60"
              className={`fill-primary/20 stroke-primary stroke-2 transition-all duration-1000 ${
                phase === "animate" ? "opacity-100" : "opacity-0"
              }`}
              style={{
                strokeDasharray: 400,
                strokeDashoffset: phase === "animate" ? 0 : 400,
                transition: "stroke-dashoffset 1.5s ease-out, opacity 0.5s ease-out",
              }}
            />
            
            {/* Right Lung */}
            <path
              d="M130 60 C150 65, 165 85, 165 110 C165 140, 150 160, 130 165 C115 168, 110 160, 105 140 L105 80 C105 70, 115 60, 130 60"
              className={`fill-primary/20 stroke-primary stroke-2 transition-all duration-1000 ${
                phase === "animate" ? "opacity-100" : "opacity-0"
              }`}
              style={{
                strokeDasharray: 400,
                strokeDashoffset: phase === "animate" ? 0 : 400,
                transition: "stroke-dashoffset 1.5s ease-out 0.2s, opacity 0.5s ease-out",
              }}
            />
            
            {/* Trachea */}
            <path
              d="M100 35 L100 75 M95 75 L100 75 L105 75"
              className="stroke-primary stroke-2"
              style={{
                strokeDasharray: 50,
                strokeDashoffset: phase === "animate" ? 0 : 50,
                transition: "stroke-dashoffset 1s ease-out 0.4s",
              }}
            />
            
            {/* Bronchi */}
            <path
              d="M100 75 Q92 82, 85 90 M100 75 Q108 82, 115 90"
              className="stroke-primary stroke-2"
              style={{
                strokeDasharray: 40,
                strokeDashoffset: phase === "animate" ? 0 : 40,
                transition: "stroke-dashoffset 0.8s ease-out 0.6s",
              }}
            />

            {/* Grad-CAM Heatmap Effect */}
            <ellipse
              cx="55"
              cy="115"
              rx="20"
              ry="25"
              className={`transition-all duration-1000 ${
                phase === "animate" ? "opacity-60" : "opacity-0"
              }`}
              style={{
                fill: "url(#heatmapGradient)",
                filter: "blur(8px)",
                transitionDelay: "1s",
              }}
            />
            
            <ellipse
              cx="145"
              cy="110"
              rx="15"
              ry="20"
              className={`transition-all duration-1000 ${
                phase === "animate" ? "opacity-40" : "opacity-0"
              }`}
              style={{
                fill: "url(#heatmapGradient2)",
                filter: "blur(6px)",
                transitionDelay: "1.2s",
              }}
            />

            {/* Gradient Definitions */}
            <defs>
              <radialGradient id="heatmapGradient" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(0, 80%, 55%)" stopOpacity="0.8" />
                <stop offset="50%" stopColor="hsl(30, 90%, 55%)" stopOpacity="0.5" />
                <stop offset="100%" stopColor="hsl(60, 80%, 50%)" stopOpacity="0" />
              </radialGradient>
              <radialGradient id="heatmapGradient2" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="hsl(45, 90%, 55%)" stopOpacity="0.7" />
                <stop offset="100%" stopColor="hsl(120, 60%, 45%)" stopOpacity="0" />
              </radialGradient>
            </defs>
          </svg>

          {/* Pulse ring animation */}
          <div 
            className={`absolute inset-0 rounded-full border border-primary/30 transition-all duration-1000 ${
              phase === "animate" ? "animate-ping opacity-100" : "opacity-0"
            }`}
            style={{ animationDuration: "2s" }}
          />
        </div>

        {/* Text content */}
        <div className="text-center space-y-3">
          <h1 
            className={`text-4xl md:text-5xl font-bold tracking-tight transition-all duration-700 ${
              phase === "animate" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "0.8s" }}
          >
            <span className="text-foreground">Med</span>
            <span className="text-primary">Vision</span>
            <span className="text-foreground"> AI</span>
          </h1>
          
          <p 
            className={`text-muted-foreground text-lg transition-all duration-700 ${
              phase === "animate" ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
            }`}
            style={{ transitionDelay: "1s" }}
          >
            Explainable Intelligence for Medical Imaging
          </p>
        </div>

        {/* Loading indicator */}
        <div 
          className={`w-48 h-1 bg-secondary rounded-full overflow-hidden transition-opacity duration-500 ${
            phase === "animate" ? "opacity-100" : "opacity-0"
          }`}
          style={{ transitionDelay: "1.2s" }}
        >
          <div 
            className="h-full bg-gradient-medical rounded-full animate-progress"
            style={{ animationDelay: "1.4s", animationFillMode: "forwards" }}
          />
        </div>
      </div>
    </div>
  );
};

export default SplashScreen;
