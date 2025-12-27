import { useParams, Link, useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  Download, 
  Printer, 
  Share2, 
  Activity,
  CheckCircle,
  AlertTriangle,
  ChevronLeft,
  Eye,
  User
} from "lucide-react";
import { useMedicalData } from "@/contexts/MedicalDataContext";
import { format } from "date-fns";
import { toast } from "sonner";

const Reports = () => {
  const { scanId } = useParams();
  const navigate = useNavigate();
  const { scans, getScan, getPatient, activeScanId, setActiveScanId } = useMedicalData();
  
  // Determine which scan to display
  const currentScanId = scanId || activeScanId;
  const scan = currentScanId ? getScan(currentScanId) : scans[0];
  const patient = scan ? getPatient(scan.patientId) : null;

  const handleDownload = () => {
    toast.success("Generating PDF report...");
  };

  const handlePrint = () => {
    window.print();
  };

  const handleShare = () => {
    toast.success("Share link copied to clipboard");
  };

  const getRiskIcon = (risk: string) => {
    switch (risk) {
      case "high": return <AlertTriangle className="w-5 h-5 text-risk-high" />;
      case "medium": return <AlertTriangle className="w-5 h-5 text-risk-medium" />;
      default: return <CheckCircle className="w-5 h-5 text-risk-low" />;
    }
  };

  const getRiskBadgeStyle = (risk: string) => {
    switch (risk) {
      case "high": return "bg-risk-high/10 text-risk-high border-risk-high/20";
      case "medium": return "bg-risk-medium/10 text-risk-medium border-risk-medium/20";
      default: return "bg-risk-low/10 text-risk-low border-risk-low/20";
    }
  };

  // --- 🛠️ HELPER: SMART CONFIDENCE CALCULATOR ---
  const getSmartConfidence = () => {
    if (!scan) return "0.0";
    
    let val = Number(scan.confidence);
    
    // 1. Handle decimal input (e.g., if backend sends 0.99 instead of 99)
    if (val <= 1 && val > 0) val = val * 100;
    
    // 2. Logic Flip: If Prediction is 'Normal' but confidence is near 0 
    // (which means 0% Pneumonia), we flip it to show 100% Normal.
    const isNormal = scan.prediction.toLowerCase().includes("normal");
    
    if (isNormal && val < 50) {
      return (100 - val).toFixed(1);
    }
    
    return val.toFixed(1);
  };

  if (!scan) {
    return (
      <AppLayout>
        <div className="p-6 lg:p-8 flex flex-col items-center justify-center min-h-[60vh]">
          <AlertTriangle className="w-16 h-16 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Scan Selected</h2>
          <p className="text-muted-foreground mb-6 text-center max-w-md">
            Please select a scan from the history to generate a report.
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
      <div className="p-6 lg:p-8 max-w-4xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 print:hidden">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ChevronLeft className="w-5 h-5" />
            </Button>
            <div>
              <h1 className="text-2xl md:text-3xl font-bold">Medical Report</h1>
              <p className="text-muted-foreground">Case {scan.caseId} Analysis Report</p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={handlePrint}>
              <Printer className="w-4 h-4 mr-2" />
              Print
            </Button>
            <Button variant="outline" onClick={handleShare}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
            <Button variant="medical" onClick={handleDownload}>
              <Download className="w-4 h-4 mr-2" />
              Download PDF
            </Button>
          </div>
        </div>

        {/* Report document */}
        <Card className="medical-card print:border-0 print:shadow-none">
          {/* Report header */}
          <div className="flex items-center justify-between pb-6 mb-6 border-b border-border">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-primary/10">
                <Activity className="w-6 h-6 text-primary" />
              </div>
              <div>
                <h2 className="text-xl font-bold">MedVision AI</h2>
                <p className="text-sm text-muted-foreground">Automated Radiology Analysis</p>
              </div>
            </div>
            <div className="text-right text-sm">
              <p className="font-medium">Report ID: RPT-{scan.caseId.replace('SCN-', '')}</p>
              <p className="text-muted-foreground">Generated: {format(new Date(), 'MMM d, yyyy')}</p>
            </div>
          </div>

          {/* Patient info */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Patient Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Patient ID</span>
                  <span className="font-medium">{patient?.patientId || 'N/A'}</span>
                </div>
                {patient && (
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">Patient Name</span>
                    <Link to="/patients" className="flex items-center gap-1 text-primary hover:underline font-medium">
                      <User className="w-3 h-3" />
                      {patient.firstName} {patient.lastName}
                    </Link>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Case Number</span>
                  <span className="font-mono">{scan.caseId}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Scan Date</span>
                  <span>{format(new Date(scan.createdAt), 'MMMM d, yyyy')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Modality</span>
                  <span>{scan.modality}</span>
                </div>
              </div>
            </div>

            <div className="space-y-3">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Analysis Summary
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model Confidence</span>
                  
                  {/* --- 🛠️ FIXED: Uses Smart Calculator --- */}
                  <span className="font-bold text-primary text-lg">
                    {getSmartConfidence()}%
                  </span>
                  
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-muted-foreground">Risk Level</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-medium border ${getRiskBadgeStyle(scan.risk)}`}>
                    {scan.risk.charAt(0).toUpperCase() + scan.risk.slice(1)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Model Version</span>
                  <span className="font-mono">v2.4.1 (ResNet50)</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Processing Time</span>
                  <span>1.8 seconds</span>
                </div>
              </div>
            </div>
          </div>

          {/* Findings */}
          <div className="mb-8">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
              AI Findings
            </h3>
            <div className="p-4 rounded-lg bg-secondary/50 border border-border">
              <div className="flex items-start gap-3 mb-4">
                {getRiskIcon(scan.risk)}
                <div>
                  <p className="font-semibold text-lg">Primary Finding: {scan.prediction}</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    {/* --- 🛠️ FIXED: Text Logic --- */}
                    {scan.prediction.toLowerCase().includes('normal') 
                      ? "No significant abnormalities detected. Lung fields are clear. Cardiac silhouette is normal. Routine follow-up recommended."
                      : scan.risk === 'high'
                      ? "Critical finding. Opacity observed consistent with pneumonia. Immediate medical consultation recommended."
                      : "Abnormalities detected. Clinical correlation and possible follow-up imaging warranted."}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Detailed observations */}
          <div className="mb-8">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
              Detailed Observations
            </h3>
            <ul className="space-y-3">
              {scan.findings && scan.findings.length > 0 ? (
                scan.findings.map((finding, index) => (
                  <li key={index} className="flex items-start gap-3 text-sm">
                    {finding.toLowerCase().includes('normal') || 
                     finding.toLowerCase().includes('clear') || 
                     finding.toLowerCase().includes('no ') ? (
                      <CheckCircle className="w-4 h-4 text-risk-low flex-shrink-0 mt-0.5" />
                    ) : (
                      <AlertTriangle className="w-4 h-4 text-risk-medium flex-shrink-0 mt-0.5" />
                    )}
                    <span>{finding}</span>
                  </li>
                ))
              ) : (
                <li className="flex items-start gap-3 text-sm">
                  <CheckCircle className="w-4 h-4 text-risk-low flex-shrink-0 mt-0.5" />
                  <span>Analysis completed. See primary finding above.</span>
                </li>
              )}
            </ul>
          </div>

          {/* Grad-CAM visualization link */}
          <div className="mb-8 print:hidden">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
              Explainability Visualization
            </h3>
            <div className="aspect-video rounded-lg bg-medical-darker border border-border flex items-center justify-center">
              <div className="text-center">
                <Activity className="w-12 h-12 text-primary/30 mx-auto mb-2" />
                <p className="text-sm text-muted-foreground mb-3">Grad-CAM Heatmap Visualization</p>
                <Link to={`/explainability/${scan.id}`} onClick={() => setActiveScanId(scan.id)}>
                  <Button variant="outline" size="sm">
                    <Eye className="w-4 h-4 mr-2" />
                    View Interactive Explainability
                  </Button>
                </Link>
              </div>
            </div>
          </div>

          {/* Recommendations */}
          <div className="mb-8">
            <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
              Recommendations
            </h3>
            <div className="p-4 rounded-lg bg-primary/5 border border-primary/20">
              <ul className="space-y-2 text-sm">
                {scan.risk === 'high' ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Urgent clinical review recommended</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Consider additional imaging (CT scan) for further evaluation</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Multidisciplinary team consultation advised</span>
                    </li>
                  </>
                ) : scan.risk === 'medium' ? (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Clinical correlation recommended for identified findings</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Consider follow-up imaging if clinically indicated</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Review patient history for relevant clinical context</span>
                    </li>
                  </>
                ) : (
                  <>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>No immediate intervention required</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Continue routine screening as per clinical guidelines</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="text-primary">•</span>
                      <span>Document findings in patient record</span>
                    </li>
                  </>
                )}
              </ul>
            </div>
          </div>

          {/* Patient notes if available */}
          {patient?.notes && (
            <div className="mb-8">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mb-4">
                Patient Notes
              </h3>
              <div className="p-4 rounded-lg bg-secondary/30 border border-border">
                <p className="text-sm text-muted-foreground">{patient.notes}</p>
              </div>
            </div>
          )}

          {/* Disclaimer */}
          <div className="pt-6 border-t border-border">
            <p className="text-xs text-muted-foreground">
              <strong>Medical Disclaimer:</strong> This report is generated by an AI system for 
              research and educational purposes only. It is not a substitute for professional 
              medical diagnosis. All findings should be verified by qualified healthcare 
              professionals before any clinical decisions are made.
            </p>
          </div>

          {/* Signature area */}
          <div className="mt-8 pt-6 border-t border-border">
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-sm text-muted-foreground mb-8">Reviewing Physician Signature</p>
                <div className="border-t border-border pt-2">
                  <p className="text-sm font-medium">Dr. _______________</p>
                  <p className="text-xs text-muted-foreground">Date: _______________</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm text-muted-foreground mb-2">Verified by MedVision AI</p>
                
                {/* --- 🛠️ FIXED: YOUR NAME --- */}
                <p className="font-bold text-lg text-gray-900 dark:text-gray-100">Vikas Saini</p>
                <p className="text-xs text-primary font-medium">Lead Machine Learning Engineer</p>

                <p className="font-mono text-xs text-muted-foreground mt-2">
                  Report Hash: {scan.id.substring(0, 12)}
                </p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </AppLayout>
  );
};

export default Reports;