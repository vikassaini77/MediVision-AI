import { Brain, Shield, Activity, Lock, FlaskConical, Eye } from "lucide-react";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

const features = [
  {
    icon: Brain,
    title: "Explainable AI (Grad-CAM)",
    description: "Visual heatmaps showing exactly what the AI sees, enabling clinical transparency.",
    details: "Our Grad-CAM implementation provides gradient-weighted class activation mapping, highlighting the regions of medical images that most influence the AI's decision. This transparency is crucial for clinical adoption and regulatory compliance.",
  },
  {
    icon: Eye,
    title: "Medical Transparency",
    description: "Every prediction comes with detailed reasoning and confidence intervals.",
    details: "We believe AI should augment, not replace, clinical judgment. Our transparency features include confidence scores, alternative diagnoses consideration, and clear visualization of the decision-making process.",
  },
  {
    icon: Activity,
    title: "Risk-Based Screening",
    description: "Intelligent triage with low, medium, and high-risk categorization.",
    details: "Our risk stratification system prioritizes cases requiring immediate attention. The algorithm considers multiple factors including abnormality severity, location, and clinical significance to assign risk levels.",
  },
  {
    icon: Lock,
    title: "Privacy-First Design",
    description: "HIPAA-compliant architecture with end-to-end encryption.",
    details: "Patient data security is paramount. All images are processed with state-of-the-art encryption, and our system is designed to comply with HIPAA, GDPR, and other international healthcare data regulations.",
  },
  {
    icon: FlaskConical,
    title: "Research-Grade Models",
    description: "Trained on millions of validated medical images from leading institutions.",
    details: "Our models are developed in collaboration with radiologists from top medical centers. Training data includes diverse patient populations to ensure equitable performance across demographics.",
  },
  {
    icon: Shield,
    title: "Clinical Validation",
    description: "Extensively validated against expert radiologist consensus.",
    details: "Every model undergoes rigorous clinical validation including multi-reader studies, retrospective analysis, and prospective trials. We maintain ongoing monitoring for model drift and performance degradation.",
  },
];

const FeaturesSection = () => {
  const [selectedFeature, setSelectedFeature] = useState<typeof features[0] | null>(null);

  return (
    <section id="features" className="py-24 relative">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-b from-background via-secondary/20 to-background" />
      
      <div className="container relative z-10 px-4 md:px-6">
        {/* Section header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6 animate-fade-in">
            Advanced Capabilities
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-4 animate-fade-in-up opacity-0" style={{ animationDelay: "0.1s", animationFillMode: "forwards" }}>
            Built for Clinical Excellence
          </h2>
          <p className="text-lg text-muted-foreground animate-fade-in-up opacity-0" style={{ animationDelay: "0.2s", animationFillMode: "forwards" }}>
            Every feature designed with radiologists, for radiologists. 
            Combining cutting-edge AI with practical clinical workflows.
          </p>
        </div>

        {/* Features grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <button
              key={feature.title}
              onClick={() => setSelectedFeature(feature)}
              className="medical-card text-left group cursor-pointer animate-fade-in-up opacity-0"
              style={{ animationDelay: `${0.1 * (index + 3)}s`, animationFillMode: "forwards" }}
            >
              <div className="flex items-start gap-4">
                <div className="p-3 rounded-lg bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  <feature.icon className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold mb-2 group-hover:text-primary transition-colors">
                    {feature.title}
                  </h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              </div>
              
              {/* Hover indicator */}
              <div className="mt-4 flex items-center gap-2 text-primary text-sm opacity-0 group-hover:opacity-100 transition-opacity">
                <span>Learn more</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Feature detail modal */}
      <Dialog open={!!selectedFeature} onOpenChange={() => setSelectedFeature(null)}>
        <DialogContent className="bg-card border-border">
          <DialogHeader>
            <div className="flex items-center gap-3 mb-2">
              {selectedFeature && (
                <div className="p-2 rounded-lg bg-primary/10 text-primary">
                  <selectedFeature.icon className="w-5 h-5" />
                </div>
              )}
              <DialogTitle className="text-xl">{selectedFeature?.title}</DialogTitle>
            </div>
            <DialogDescription className="text-muted-foreground text-base leading-relaxed">
              {selectedFeature?.details}
            </DialogDescription>
          </DialogHeader>
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default FeaturesSection;
