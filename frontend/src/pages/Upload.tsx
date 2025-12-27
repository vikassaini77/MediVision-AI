import { useState, useCallback, useEffect } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  Upload as UploadIcon, 
  FileImage, 
  X, 
  CheckCircle, 
  AlertCircle,
  Loader2,
  Eye,
  RefreshCw,
  UserPlus,
  User
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { useMedicalData } from "@/contexts/MedicalDataContext";
import { getRandomAnalysis } from "@/types/medical";

type UploadState = "idle" | "uploading" | "analyzing" | "complete" | "error";

const Upload = () => {
  // ⚠️ ADDED 'updateScan' HERE
  const { patients, addScan, updateScan, activePatientId, setActivePatientId, setActiveScanId } = useMedicalData();
  
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [state, setState] = useState<UploadState>("idle");
  const [progress, setProgress] = useState(0);
  const [analysisResult, setAnalysisResult] = useState<ReturnType<typeof getRandomAnalysis> | null>(null);
  const [currentScanId, setCurrentScanId] = useState<string | null>(null);
  const [dragActive, setDragActive] = useState(false);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(activePatientId);
  const navigate = useNavigate();

  useEffect(() => {
    if (activePatientId) {
      setSelectedPatientId(activePatientId);
    }
  }, [activePatientId]);

  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  }, []);

  const processFile = useCallback((file: File) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please upload an image file");
      return;
    }
    
    setFile(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      setPreview(e.target?.result as string);
    };
    reader.readAsDataURL(file);
    setState("idle");
    setAnalysisResult(null);
    setCurrentScanId(null);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  }, [processFile]);

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  }, [processFile]);

  // --- 🛠️ FIXED FUNCTION STARTS HERE ---
  const runAnalysis = async () => {
    if (!selectedPatientId) {
      toast.error("Please select a patient first");
      return;
    }

    if (!file) {
      toast.error("Please upload an image first");
      return;
    }

    setState("uploading");
    setProgress(0);

    // Simulate upload progress
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(r => setTimeout(r, 80));
      setProgress(i);
    }

    setState("analyzing");

    // 1. Create the scan record (Initially Analyzing)
    const newScan = addScan({
      patientId: selectedPatientId,
      imageData: preview || undefined,
      fileName: file.name,
      fileSize: file.size,
      modality: "Chest X-Ray (PA)",
      prediction: "Analyzing...",
      confidence: 0, // 0 is fine here because status is 'analyzing'
      risk: "low",
      findings: [],
      status: "analyzing",
    });

    setCurrentScanId(newScan.id);
    
    // Simulate AI analysis delay
    await new Promise(r => setTimeout(r, 2000));

    // 2. Generate Result
    const mockResult = getRandomAnalysis();
    
    // 3. Update Local State (So you see it now)
    setAnalysisResult(mockResult);
    setState("complete");

    // 4. ⚠️ CRITICAL FIX: Update the Global Context/Database
    // This ensures Dashboard and History show the correct numbers later
    updateScan(newScan.id, {
      status: "complete",
      prediction: mockResult.prediction,
      confidence: mockResult.confidence, // This saves the 98% (or whatever) to context
      risk: mockResult.risk,
      findings: mockResult.findings
    });
    
    toast.success("Analysis complete!");
  };
  // --- 🛠️ FIXED FUNCTION ENDS HERE ---

  const clearUpload = () => {
    setFile(null);
    setPreview(null);
    setState("idle");
    setProgress(0);
    setAnalysisResult(null);
    setCurrentScanId(null);
  };

  const handleViewExplainability = () => {
    if (currentScanId) {
      setActiveScanId(currentScanId);
      navigate(`/explainability/${currentScanId}`);
    } else {
      navigate("/explainability");
    }
  };

  const getRiskColor = (risk: string) => {
    switch (risk) {
      case "high": return "text-risk-high bg-risk-high/10 border-risk-high/20";
      case "medium": return "text-risk-medium bg-risk-medium/10 border-risk-medium/20";
      default: return "text-risk-low bg-risk-low/10 border-risk-low/20";
    }
  };

  const selectedPatient = patients.find(p => p.id === selectedPatientId);

  return (
    <AppLayout>
      <div className="p-6 lg:p-8 max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Upload & Analyze</h1>
          <p className="text-muted-foreground">Upload chest X-ray images for AI-powered analysis</p>
        </div>

        {/* Patient Selection */}
        <Card className="medical-card">
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <User className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Link scan to patient</p>
                <p className="font-medium">
                  {selectedPatient 
                    ? `${selectedPatient.firstName} ${selectedPatient.lastName} (${selectedPatient.patientId})`
                    : "No patient selected"
                  }
                </p>
              </div>
            </div>
            
            <div className="flex-1 flex gap-3 w-full sm:w-auto sm:justify-end">
              <Select
                value={selectedPatientId || ""}
                onValueChange={(value) => {
                  setSelectedPatientId(value);
                  setActivePatientId(value);
                }}
              >
                <SelectTrigger className="w-full sm:w-[250px] bg-secondary border-border">
                  <SelectValue placeholder="Select a patient..." />
                </SelectTrigger>
                <SelectContent>
                  {patients.map((patient) => (
                    <SelectItem key={patient.id} value={patient.id}>
                      {patient.firstName} {patient.lastName} ({patient.patientId})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button variant="outline" onClick={() => navigate("/patients")}>
                <UserPlus className="w-4 h-4 mr-2" />
                New Patient
              </Button>
            </div>
          </div>
        </Card>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Upload zone */}
          <Card className="medical-card">
            <h2 className="text-lg font-semibold mb-4">Upload Image</h2>
            
            {!preview ? (
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={`
                  relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300
                  ${dragActive 
                    ? "border-primary bg-primary/5" 
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                  }
                `}
              >
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                
                <div className="flex flex-col items-center gap-4">
                  <div className={`p-4 rounded-xl bg-primary/10 transition-colors ${dragActive ? "bg-primary/20" : ""}`}>
                    <UploadIcon className="w-8 h-8 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium mb-1">
                      {dragActive ? "Drop your image here" : "Drag & drop your X-ray"}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      or click to browse • DICOM, PNG, JPEG supported
                    </p>
                  </div>
                </div>
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image preview */}
                <div className="relative rounded-xl overflow-hidden bg-medical-darker border border-border">
                  <img
                    src={preview}
                    alt="X-ray preview"
                    className="w-full h-auto max-h-80 object-contain"
                  />
                  
                  {state !== "complete" && (
                    <button
                      onClick={clearUpload}
                      className="absolute top-3 right-3 p-2 rounded-lg bg-background/80 hover:bg-background transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}

                  {/* Analysis overlay */}
                  {(state === "uploading" || state === "analyzing") && (
                    <div className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center">
                      <div className="text-center">
                        <Loader2 className="w-10 h-10 text-primary animate-spin mx-auto mb-3" />
                        <p className="font-medium">
                          {state === "uploading" ? "Uploading..." : "AI Analyzing..."}
                        </p>
                        {state === "uploading" && (
                          <div className="mt-3 w-48 h-2 bg-secondary rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-gradient-medical transition-all duration-300"
                              style={{ width: `${progress}%` }}
                            />
                          </div>
                        )}
                        {state === "analyzing" && (
                          <p className="text-sm text-muted-foreground mt-2">
                            Processing with Grad-CAM...
                          </p>
                        )}
                      </div>
                    </div>
                  )}
                </div>

                {/* File info */}
                <div className="flex items-center justify-between p-3 rounded-lg bg-secondary/50">
                  <div className="flex items-center gap-3">
                    <FileImage className="w-5 h-5 text-muted-foreground" />
                    <div>
                      <p className="text-sm font-medium truncate max-w-[200px]">{file?.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {file && (file.size / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                  </div>
                  {state === "complete" && (
                    <CheckCircle className="w-5 h-5 text-risk-low" />
                  )}
                </div>

                {/* Action buttons */}
                <div className="flex gap-3">
                  {state === "idle" && (
                    <Button 
                      variant="medical" 
                      className="flex-1"
                      onClick={runAnalysis}
                      disabled={!selectedPatientId}
                    >
                      {!selectedPatientId ? "Select Patient First" : "Analyze Image"}
                    </Button>
                  )}
                  {state === "complete" && (
                    <>
                      <Button 
                        variant="medical" 
                        className="flex-1"
                        onClick={handleViewExplainability}
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        View Explainability
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={clearUpload}
                      >
                        <RefreshCw className="w-4 h-4" />
                      </Button>
                    </>
                  )}
                </div>
              </div>
            )}
          </Card>

          {/* Results panel */}
          <Card className="medical-card">
            <h2 className="text-lg font-semibold mb-4">Analysis Results</h2>
            
            {!analysisResult ? (
              <div className="flex flex-col items-center justify-center h-80 text-center">
                <div className="p-4 rounded-xl bg-secondary mb-4">
                  <AlertCircle className="w-8 h-8 text-muted-foreground" />
                </div>
                <p className="text-muted-foreground">
                  {!selectedPatientId 
                    ? "Select a patient and upload an image to see analysis results"
                    : "Upload an image to see analysis results"
                  }
                </p>
              </div>
            ) : (
              <div className="space-y-6 animate-fade-in">
                {/* Confidence ring */}
                <div className="flex items-center gap-6">
                  <div className="relative w-24 h-24">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 36 36">
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="hsl(var(--secondary))"
                        strokeWidth="2"
                      />
                      <circle
                        cx="18"
                        cy="18"
                        r="16"
                        fill="none"
                        stroke="hsl(var(--primary))"
                        strokeWidth="2"
                        strokeDasharray={`${analysisResult.confidence} 100`}
                        strokeLinecap="round"
                        className="animate-draw-path"
                        style={{ animationDuration: "1.5s" }}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="text-xl font-bold">{analysisResult.confidence}%</span>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground mb-1">AI Confidence</p>
                    <p className="font-semibold text-lg">{analysisResult.prediction}</p>
                  </div>
                </div>

                {/* Risk badge */}
                <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${getRiskColor(analysisResult.risk)}`}>
                  <span className={`w-2 h-2 rounded-full ${analysisResult.risk === "high" ? "bg-risk-high" : analysisResult.risk === "medium" ? "bg-risk-medium" : "bg-risk-low"}`} />
                  <span className="font-medium capitalize">{analysisResult.risk} Risk</span>
                </div>

                {/* Findings */}
                <div>
                  <h3 className="font-medium mb-3">Key Findings</h3>
                  <ul className="space-y-2">
                    {analysisResult.findings.map((finding, index) => (
                      <li 
                        key={index}
                        className="flex items-start gap-2 text-sm animate-fade-in-up opacity-0"
                        style={{ animationDelay: `${index * 0.1}s`, animationFillMode: "forwards" }}
                      >
                        <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-muted-foreground">{finding}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Patient info */}
                {selectedPatient && (
                  <div className="pt-4 border-t border-border">
                    <h3 className="font-medium mb-2">Linked Patient</h3>
                    <p className="text-sm text-muted-foreground">
                      {selectedPatient.firstName} {selectedPatient.lastName} ({selectedPatient.patientId})
                    </p>
                  </div>
                )}

                {/* Actions */}
                <div className="pt-4 border-t border-border flex gap-3">
                  <Button variant="outline" className="flex-1" onClick={() => navigate("/reports")}>
                    Generate Report
                  </Button>
                  <Button variant="ghost" onClick={clearUpload}>
                    New Scan
                  </Button>
                </div>
              </div>
            )}
          </Card>
        </div>

        {/* Medical disclaimer */}
        <div className="p-4 rounded-lg bg-secondary/50 border border-border">
          <p className="text-xs text-muted-foreground text-center">
            <strong>Medical Disclaimer:</strong> This analysis is for research and educational purposes only 
            and should not replace professional medical diagnosis. Always consult qualified healthcare professionals.
          </p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Upload;