import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { 
  Eye, 
  EyeOff, 
  Layers, 
  ZoomIn, 
  ZoomOut, 
  RotateCcw,
  Download,
  Maximize2,
  ChevronLeft,
  FileText,
  AlertTriangle,
  User
} from "lucide-react";
import { useMedicalData } from "@/contexts/MedicalDataContext";
import { format } from "date-fns";
import { toast } from "sonner";

type ViewMode = "original" | "gradcam" | "overlay";

const Explainability = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { scans, patients, getScan, getPatient, activeScanId, setActiveScanId } = useMedicalData();
  
  const [viewMode, setViewMode] = useState<ViewMode>("overlay");
  const [opacity, setOpacity] = useState([70]);
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Determine which scan to display
  const currentScanId = scanId || activeScanId;
  const scan = currentScanId ? getScan(currentScanId) : scans[0];
  const patient = scan ? getPatient(scan.patientId) : null;

  useEffect(() => {
    if (scanId) {
      setActiveScanId(scanId);
    }
  }, [scanId, setActiveScanId]);

  const handleExport = () => {
    toast.success("Exporting visualization...");
  };

  const handleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
    toast.info(isFullscreen ? "Exiting fullscreen" : "Entering fullscreen mode");
  };

  const getRiskBadgeStyle = (risk: string) => {
    switch (risk) {
      case "high": return "bg-risk-high/10 text-risk-high border-risk-high/20";
      case "medium": return "bg-risk-medium/10 text-risk-medium border-risk-medium/20";
      default: return "bg-risk-low/10 text-risk-low border-risk-low/20";
    }
  };

  if (!scan) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Scan Selected</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Please select a scan from the history or upload a new scan to view the explainability visualization.
          </p>
          <div className="flex gap-3">
            <Link to="/history">
              <Button variant="outline">View History</Button>
            </Link>
            <Link to="/upload">
              <Button variant="medical">Upload New Scan</Button>
            </Link>
          </div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className={`p-6 lg:p-8 space-y-6 ${isFullscreen ? 'fixed inset-0 z-50 bg-background' : ''}`}>
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Explainability Viewer</h1>
              <p className="text-muted-foreground">Grad-CAM visualization for case {scan.caseId}</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handleExport}>
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
            <Link to={`/reports/${scan.id}`}>
              <Button variant="outline">
                <FileText className="w-4 h-4 mr-2" />
                Report
              </Button>
            </Link>
            <Button variant="medical" onClick={handleFullscreen}>
              <Maximize2 className="w-4 h-4 mr-2" />
              {isFullscreen ? "Exit" : "Full Screen"}
            </Button>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-6">
          {/* Main viewer */}
          <Card className="medical-card lg:col-span-3 overflow-hidden">
            {/* Viewer toolbar */}
            <div className="flex flex-wrap items-center justify-between gap-4 mb-4 pb-4 border-b border-border">
              {/* View mode toggle */}
              <div className="flex rounded-lg bg-secondary p-1">
                {[
                  { mode: "original" as ViewMode, label: "Original", icon: Eye },
                  { mode: "gradcam" as ViewMode, label: "Grad-CAM", icon: Layers },
                  { mode: "overlay" as ViewMode, label: "Overlay", icon: EyeOff },
                ].map(({ mode, label, icon: Icon }) => (
                  <button
                    key={mode}
                    onClick={() => setViewMode(mode)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      viewMode === mode
                        ? "bg-primary text-primary-foreground"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span className="hidden sm:inline">{label}</span>
                  </button>
                ))}
              </div>

              {/* Zoom controls */}
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoom(Math.max(50, zoom - 25))}
                >
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm text-muted-foreground w-12 text-center">
                  {zoom}%
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoom(Math.min(200, zoom + 25))}
                >
                  <ZoomIn className="w-4 h-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setZoom(100)}
                >
                  <RotateCcw className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* Image canvas */}
            <div 
              className="relative bg-medical-darker rounded-xl overflow-hidden cursor-move"
              style={{ minHeight: isFullscreen ? "calc(100vh - 300px)" : "500px" }}
            >
              {/* Main visualization */}
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-300"
                style={{ transform: `scale(${zoom / 100})` }}
              >
                {/* If scan has image data, show it */}
                {scan.imageData ? (
                  <div className="relative w-full h-full flex items-center justify-center">
                    <img 
                      src={scan.imageData} 
                      alt="X-ray scan" 
                      className={`max-w-full max-h-full object-contain transition-opacity duration-300 ${
                        viewMode === "gradcam" ? "opacity-30" : "opacity-100"
                      }`}
                    />
                    {/* Grad-CAM overlay simulation */}
                    {(viewMode === "gradcam" || viewMode === "overlay") && (
                      <div 
                        className="absolute inset-0 flex items-center justify-center"
                        style={{ opacity: opacity[0] / 100 }}
                      >
                        <div className="w-32 h-40 rounded-full bg-gradient-radial from-risk-high/60 via-risk-medium/40 to-transparent blur-xl animate-pulse" />
                      </div>
                    )}
                  </div>
                ) : (
                  /* SVG fallback visualization */
                  <svg
                    viewBox="0 0 400 400"
                    className="w-full h-full max-w-lg"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    {/* Background chest X-ray representation */}
                    <rect width="400" height="400" fill="hsl(var(--medical-darker))" />
                    
                    {/* Chest outline */}
                    <path
                      d="M200 40 C100 40, 40 120, 40 200 C40 300, 100 360, 200 360 C300 360, 360 300, 360 200 C360 120, 300 40, 200 40"
                      className={`stroke-primary/40 stroke-2 fill-primary/5 transition-opacity duration-300 ${
                        viewMode === "gradcam" ? "opacity-30" : "opacity-100"
                      }`}
                    />
                    
                    {/* Ribcage simulation */}
                    {viewMode !== "gradcam" && [80, 110, 140, 170, 200, 230].map((y, i) => (
                      <path
                        key={y}
                        d={`M${80 + i * 5} ${y} Q200 ${y + 10}, ${320 - i * 5} ${y}`}
                        className="stroke-primary/20 stroke-1 fill-none"
                      />
                    ))}
                    
                    {/* Left Lung */}
                    <path
                      d="M140 100 C80 110, 60 160, 60 220 C60 300, 100 340, 150 340 C180 340, 190 300, 190 260 L190 140 C190 120, 170 100, 140 100"
                      className={`fill-primary/5 stroke-primary/50 stroke-2 transition-opacity duration-300 ${
                        viewMode === "gradcam" ? "opacity-30" : "opacity-100"
                      }`}
                    />
                    
                    {/* Right Lung */}
                    <path
                      d="M260 100 C320 110, 340 160, 340 220 C340 300, 300 340, 250 340 C220 340, 210 300, 210 260 L210 140 C210 120, 230 100, 260 100"
                      className={`fill-primary/5 stroke-primary/50 stroke-2 transition-opacity duration-300 ${
                        viewMode === "gradcam" ? "opacity-30" : "opacity-100"
                      }`}
                    />

                    {/* Heart */}
                    <ellipse
                      cx="200"
                      cy="210"
                      rx="40"
                      ry="50"
                      className={`fill-primary/10 stroke-primary/60 stroke-2 transition-opacity duration-300 ${
                        viewMode === "gradcam" ? "opacity-30" : "opacity-100"
                      }`}
                    />

                    {/* Grad-CAM Heatmap overlays */}
                    {(viewMode === "gradcam" || viewMode === "overlay") && (
                      <g style={{ opacity: opacity[0] / 100 }}>
                        {/* Primary detection area - high attention */}
                        <ellipse
                          cx={scan.risk === "high" ? 120 : 280}
                          cy="200"
                          rx={scan.risk === "high" ? 50 : 40}
                          ry={scan.risk === "high" ? 70 : 55}
                          fill="url(#heatmapRed)"
                          className="animate-pulse"
                          style={{ animationDuration: "3s" }}
                        />
                        
                        {/* Secondary area - medium attention */}
                        <ellipse
                          cx={scan.risk === "high" ? 280 : 120}
                          cy="190"
                          rx="40"
                          ry="55"
                          fill="url(#heatmapYellow)"
                          className="animate-pulse"
                          style={{ animationDuration: "3.5s", animationDelay: "0.5s" }}
                        />
                        
                        {/* Minor attention areas */}
                        <ellipse
                          cx="200"
                          cy="280"
                          rx="30"
                          ry="25"
                          fill="url(#heatmapGreen)"
                          className="animate-pulse"
                          style={{ animationDuration: "4s", animationDelay: "1s" }}
                        />
                      </g>
                    )}

                    {/* Gradient definitions */}
                    <defs>
                      <radialGradient id="heatmapRed" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(0, 80%, 55%)" stopOpacity="0.9" />
                        <stop offset="30%" stopColor="hsl(20, 90%, 55%)" stopOpacity="0.7" />
                        <stop offset="60%" stopColor="hsl(40, 90%, 55%)" stopOpacity="0.4" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="heatmapYellow" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(45, 90%, 55%)" stopOpacity="0.8" />
                        <stop offset="40%" stopColor="hsl(60, 85%, 50%)" stopOpacity="0.5" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </radialGradient>
                      <radialGradient id="heatmapGreen" cx="50%" cy="50%" r="50%">
                        <stop offset="0%" stopColor="hsl(90, 70%, 50%)" stopOpacity="0.6" />
                        <stop offset="60%" stopColor="hsl(120, 60%, 45%)" stopOpacity="0.3" />
                        <stop offset="100%" stopColor="transparent" stopOpacity="0" />
                      </radialGradient>
                    </defs>
                  </svg>
                )}
              </div>

              {/* Scan line effect */}
              {viewMode !== "original" && (
                <div className="absolute inset-0 pointer-events-none scan-line" />
              )}
            </div>
          </Card>

          {/* Controls panel */}
          <Card className="medical-card space-y-6">
            <div>
              <h3 className="font-semibold mb-4">Visualization Controls</h3>
              
              {/* Opacity slider */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <label className="text-sm text-muted-foreground">Heatmap Opacity</label>
                  <span className="text-sm font-mono">{opacity[0]}%</span>
                </div>
                <Slider
                  value={opacity}
                  onValueChange={setOpacity}
                  max={100}
                  min={0}
                  step={5}
                  className="w-full"
                  disabled={viewMode === "original"}
                />
              </div>
            </div>

            {/* Legend */}
            <div>
              <h3 className="font-semibold mb-4">Attention Legend</h3>
              <div className="space-y-2">
                {[
                  { color: "bg-risk-high", label: "High Attention", desc: "Critical areas" },
                  { color: "bg-risk-medium", label: "Medium Attention", desc: "Notable regions" },
                  { color: "bg-risk-low", label: "Low Attention", desc: "Normal areas" },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-3">
                    <div className={`w-4 h-4 rounded ${item.color}`} />
                    <div>
                      <p className="text-sm font-medium">{item.label}</p>
                      <p className="text-xs text-muted-foreground">{item.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Case info */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-4">Case Information</h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Case ID</span>
                  <span className="font-mono">{scan.caseId}</span>
                </div>
                {patient && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Patient</span>
                    <Link 
                      to="/patients" 
                      className="flex items-center gap-1 text-primary hover:underline"
                    >
                      <User className="w-3 h-3" />
                      {patient.firstName} {patient.lastName}
                    </Link>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Date</span>
                  <span>{format(new Date(scan.createdAt), 'MMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Confidence</span>
                  <span className="text-primary font-medium">{scan.confidence}%</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskBadgeStyle(scan.risk)}`}>
                    {scan.risk.charAt(0).toUpperCase() + scan.risk.slice(1)}
                  </span>
                </div>
              </div>
            </div>

            {/* Finding summary */}
            <div className="pt-4 border-t border-border">
              <h3 className="font-semibold mb-3">AI Observation</h3>
              <p className="text-sm text-muted-foreground mb-3">
                {scan.prediction}
              </p>
              {scan.findings && scan.findings.length > 0 && (
                <ul className="space-y-2">
                  {scan.findings.slice(0, 3).map((finding, i) => (
                    <li key={i} className="text-xs text-muted-foreground flex items-start gap-2">
                      <span className="text-primary mt-0.5">•</span>
                      {finding}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Medical disclaimer */}
            <div className="pt-4 border-t border-border">
              <p className="text-xs text-muted-foreground">
                <strong>Note:</strong> This visualization is for research and educational purposes. 
                Clinical decisions should be made by qualified professionals.
              </p>
            </div>
          </Card>
        </div>
      </div>
    </AppLayout>
  );
};

export default Explainability;