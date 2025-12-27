export interface PredictionResult {
  case_id: string;
  prediction: "Normal" | "Pneumonia";
  confidence: number;
  risk_level: "Low" | "High";
  gradcam: string; // base64
}
