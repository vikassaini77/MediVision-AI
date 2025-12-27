import Navbar from "@/components/landing/Navbar";
import Footer from "@/components/landing/Footer";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { 
  Brain, 
  Cpu, 
  Eye, 
  Shield, 
  Zap, 
  Database,
  ArrowRight,
  Check
} from "lucide-react";
import { Link } from "react-router-dom";

const techStack = [
  {
    icon: Brain,
    title: "Deep Learning Architecture",
    description: "State-of-the-art convolutional neural networks specifically designed for medical imaging analysis.",
    features: [
      "ResNet-50 backbone with custom attention mechanisms",
      "Transfer learning from ImageNet + medical datasets",
      "Multi-scale feature extraction for varying pathology sizes",
      "Ensemble methods for robust predictions"
    ]
  },
  {
    icon: Eye,
    title: "Grad-CAM Explainability",
    description: "Gradient-weighted Class Activation Mapping provides visual explanations for AI decisions.",
    features: [
      "Pixel-level attention visualization",
      "Layer-wise relevance propagation",
      "Saliency map generation",
      "Confidence-weighted heatmaps"
    ]
  },
  {
    icon: Database,
    title: "Training Data",
    description: "Trained on diverse, validated medical imaging datasets from leading institutions.",
    features: [
      "1M+ chest X-ray images",
      "Multi-institutional validation",
      "Demographic diversity for equitable AI",
      "Expert radiologist annotations"
    ]
  },
  {
    icon: Shield,
    title: "Security & Compliance",
    description: "Enterprise-grade security with full healthcare regulatory compliance.",
    features: [
      "HIPAA compliant architecture",
      "End-to-end encryption (AES-256)",
      "SOC 2 Type II certified",
      "GDPR data protection ready"
    ]
  },
  {
    icon: Zap,
    title: "Performance",
    description: "Optimized for real-time clinical workflows with minimal latency.",
    features: [
      "Sub-2 second inference time",
      "GPU-accelerated processing",
      "Horizontal scaling for high volume",
      "99.9% uptime SLA"
    ]
  },
  {
    icon: Cpu,
    title: "Integration",
    description: "Seamless integration with existing healthcare IT infrastructure.",
    features: [
      "DICOM compatibility",
      "HL7 FHIR APIs",
      "PACS integration",
      "EMR/EHR connectivity"
    ]
  }
];

const Technology = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-dark" />
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl" />
        
        <div className="container relative z-10 px-4 md:px-6 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium mb-6">
            Under the Hood
          </div>
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
            <span className="text-foreground">The Technology Behind</span>
            <br />
            <span className="bg-gradient-medical bg-clip-text text-transparent">MedVision AI</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8">
            Deep learning meets clinical transparency. Built with radiologists, 
            for radiologists, using the latest advances in explainable AI.
          </p>
          <Link to="/dashboard">
            <Button variant="hero">
              Experience It Live
              <ArrowRight className="w-5 h-5" />
            </Button>
          </Link>
        </div>
      </section>

      {/* Tech stack grid */}
      <section className="py-20">
        <div className="container px-4 md:px-6">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techStack.map((tech, index) => (
              <Card 
                key={tech.title}
                className="medical-card group animate-fade-in-up opacity-0"
                style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
              >
                <div className="p-3 rounded-lg bg-primary/10 text-primary w-fit mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                  <tech.icon className="w-6 h-6" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{tech.title}</h3>
                <p className="text-muted-foreground mb-4">{tech.description}</p>
                <ul className="space-y-2">
                  {tech.features.map((feature) => (
                    <li key={feature} className="flex items-start gap-2 text-sm">
                      <Check className="w-4 h-4 text-primary flex-shrink-0 mt-0.5" />
                      <span className="text-muted-foreground">{feature}</span>
                    </li>
                  ))}
                </ul>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Architecture diagram section */}
      <section className="py-20 bg-secondary/20">
        <div className="container px-4 md:px-6">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">System Architecture</h2>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              End-to-end pipeline designed for clinical reliability and real-time performance.
            </p>
          </div>

          <div className="max-w-4xl mx-auto">
            <Card className="medical-card overflow-hidden">
              <div className="p-8">
                {/* Simple architecture flow */}
                <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                  {[
                    { label: "Image Input", icon: Database, desc: "DICOM / PNG / JPEG" },
                    { label: "Preprocessing", icon: Cpu, desc: "Normalization & Augmentation" },
                    { label: "CNN Inference", icon: Brain, desc: "ResNet + Attention" },
                    { label: "Grad-CAM", icon: Eye, desc: "Explainability" },
                    { label: "Output", icon: Shield, desc: "Prediction + Heatmap" },
                  ].map((step, index) => (
                    <div key={step.label} className="flex items-center gap-4">
                      <div className="text-center">
                        <div className="p-3 rounded-lg bg-primary/10 text-primary mx-auto mb-2">
                          <step.icon className="w-6 h-6" />
                        </div>
                        <p className="font-medium text-sm">{step.label}</p>
                        <p className="text-xs text-muted-foreground">{step.desc}</p>
                      </div>
                      {index < 4 && (
                        <ArrowRight className="w-5 h-5 text-primary hidden md:block" />
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA section */}
      <section className="py-20">
        <div className="container px-4 md:px-6 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to See It in Action?</h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-xl mx-auto">
            Experience the power of explainable AI for medical imaging. 
            Try our live demo with sample chest X-rays.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/dashboard">
              <Button variant="hero">
                Launch Demo
                <ArrowRight className="w-5 h-5" />
              </Button>
            </Link>
            <Link to="/">
              <Button variant="hero-outline">
                Back to Home
              </Button>
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Technology;
