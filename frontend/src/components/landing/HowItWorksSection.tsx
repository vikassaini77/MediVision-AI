import { Upload, Cpu, Eye, FileText } from "lucide-react";
import { useEffect, useState, useRef } from "react";

const steps = [
  {
    icon: Upload,
    title: "Upload X-ray",
    description: "Securely upload chest X-ray images in DICOM, PNG, or JPEG format.",
  },
  {
    icon: Cpu,
    title: "AI Analysis",
    description: "Deep learning models analyze the image for abnormalities in seconds.",
  },
  {
    icon: Eye,
    title: "Explainability",
    description: "Grad-CAM heatmaps reveal exactly what the AI detected.",
  },
  {
    icon: FileText,
    title: "Risk & Report",
    description: "Receive detailed reports with risk stratification and findings.",
  },
];

const HowItWorksSection = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [isInView, setIsInView] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
        }
      },
      { threshold: 0.3 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!isInView) return;

    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isInView]);

  return (
    <section ref={sectionRef} className="py-24 relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background to-secondary/10" />
      
      {/* Animated background lines */}
      <div className="absolute inset-0 opacity-5">
        <div 
          className="absolute inset-0"
          style={{
            backgroundImage: `repeating-linear-gradient(
              90deg,
              hsl(var(--primary)) 0px,
              hsl(var(--primary)) 1px,
              transparent 1px,
              transparent 100px
            )`,
          }}
        />
      </div>

      <div className="container relative z-10 px-4 md:px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            Seamless Workflow
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            How It Works
          </h2>
          <p className="text-lg text-muted-foreground">
            From upload to diagnosis in four simple steps. 
            Designed to integrate naturally into clinical workflows.
          </p>
        </div>

        {/* Steps visualization */}
        <div className="max-w-5xl mx-auto">
          {/* Desktop view */}
          <div className="hidden md:block">
            {/* Connection line */}
            <div className="relative mb-8">
              <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-border -translate-y-1/2" />
              <div 
                className="absolute top-1/2 left-0 h-0.5 bg-gradient-medical -translate-y-1/2 transition-all duration-700"
                style={{ width: `${((activeStep + 1) / steps.length) * 100}%` }}
              />
            </div>

            {/* Step indicators */}
            <div className="grid grid-cols-4 gap-4 mb-12">
              {steps.map((step, index) => (
                <button
                  key={step.title}
                  onClick={() => setActiveStep(index)}
                  className="relative flex flex-col items-center group"
                >
                  {/* Icon circle */}
                  <div 
                    className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-all duration-500 ${
                      index <= activeStep 
                        ? "bg-gradient-medical shadow-glow" 
                        : "bg-card border border-border"
                    }`}
                  >
                    <step.icon 
                      className={`w-7 h-7 transition-colors ${
                        index <= activeStep ? "text-primary-foreground" : "text-muted-foreground"
                      }`}
                    />
                    
                    {/* Active pulse */}
                    {index === activeStep && (
                      <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-30" />
                    )}
                  </div>

                  {/* Step number */}
                  <div 
                    className={`absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold transition-colors ${
                      index <= activeStep 
                        ? "bg-primary text-primary-foreground" 
                        : "bg-secondary text-muted-foreground"
                    }`}
                  >
                    {index + 1}
                  </div>

                  {/* Label */}
                  <h3 
                    className={`mt-4 font-semibold transition-colors ${
                      index === activeStep ? "text-primary" : "text-foreground"
                    }`}
                  >
                    {step.title}
                  </h3>
                  <p className="text-sm text-muted-foreground text-center mt-2 max-w-[200px]">
                    {step.description}
                  </p>
                </button>
              ))}
            </div>
          </div>

          {/* Mobile view */}
          <div className="md:hidden space-y-4">
            {steps.map((step, index) => (
              <div
                key={step.title}
                className={`medical-card flex items-start gap-4 transition-all duration-300 ${
                  index === activeStep ? "border-primary/50 shadow-glow-sm" : ""
                }`}
              >
                <div 
                  className={`flex-shrink-0 w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                    index <= activeStep 
                      ? "bg-gradient-medical" 
                      : "bg-secondary"
                  }`}
                >
                  <step.icon 
                    className={`w-5 h-5 ${
                      index <= activeStep ? "text-primary-foreground" : "text-muted-foreground"
                    }`}
                  />
                </div>
                <div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-sm text-muted-foreground">{step.description}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Animated demo preview */}
          <div className="mt-12 rounded-2xl bg-card border border-border overflow-hidden shadow-glow-sm">
            <div className="flex items-center gap-2 px-4 py-3 bg-secondary/50 border-b border-border">
              <div className="w-3 h-3 rounded-full bg-risk-high/50" />
              <div className="w-3 h-3 rounded-full bg-risk-medium/50" />
              <div className="w-3 h-3 rounded-full bg-risk-low/50" />
              <span className="ml-2 text-sm text-muted-foreground font-mono">analysis-preview</span>
            </div>
            
            <div className="p-8 flex items-center justify-center min-h-[200px]">
              <div className="text-center">
                <div className="inline-flex items-center gap-3 mb-4">
                  {steps.map((step, index) => (
                    <div
                      key={step.title}
                      className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        index === activeStep 
                          ? "bg-primary w-8" 
                          : index < activeStep 
                            ? "bg-primary/50" 
                            : "bg-muted"
                      }`}
                    />
                  ))}
                </div>
                <div className="flex items-center justify-center gap-3 text-primary">
                  {(() => {
                    const StepIcon = steps[activeStep].icon;
                    return (
                      <>
                        <StepIcon className="w-8 h-8 animate-pulse" />
                        <span className="text-xl font-semibold">{steps[activeStep].title}</span>
                      </>
                    );
                  })()}
                </div>
                <p className="mt-2 text-muted-foreground">{steps[activeStep].description}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HowItWorksSection;
