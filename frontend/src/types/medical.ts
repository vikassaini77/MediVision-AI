// Core medical data types for MedVision AI

export interface Patient {
  id: string;
  patientId: string; // External patient ID (e.g., hospital ID)
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Scan {
  id: string;
  caseId: string; // Display case ID like "SCN-2847"
  patientId: string;
  imageData?: string; // Base64 encoded image
  fileName: string;
  fileSize: number;
  modality: string;
  prediction: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  findings: string[];
  status: 'pending' | 'analyzing' | 'complete' | 'error';
  createdAt: string;
  analyzedAt?: string;
}

export interface AnalysisResult {
  prediction: string;
  confidence: number;
  risk: 'low' | 'medium' | 'high';
  findings: string[];
  attentionAreas: AttentionArea[];
}

export interface AttentionArea {
  id: string;
  cx: number;
  cy: number;
  rx: number;
  ry: number;
  intensity: 'high' | 'medium' | 'low';
  label: string;
}

// Mock analysis results for demo purposes
export const mockAnalysisResults: AnalysisResult[] = [
  {
    prediction: "Potential Opacity Detected",
    confidence: 94.7,
    risk: "medium",
    findings: [
      "Mild opacity in left lower lobe",
      "Heart size within normal limits",
      "No pleural effusion detected",
      "Costophrenic angles appear clear"
    ],
    attentionAreas: [
      { id: "area1", cx: 120, cy: 200, rx: 50, ry: 70, intensity: "high", label: "Left lower lobe opacity" },
      { id: "area2", cx: 280, cy: 190, rx: 40, ry: 55, intensity: "medium", label: "Right lung minor finding" }
    ]
  },
  {
    prediction: "Normal Chest X-Ray",
    confidence: 98.2,
    risk: "low",
    findings: [
      "No acute cardiopulmonary abnormality",
      "Heart size within normal limits",
      "Lungs are clear bilaterally",
      "No pleural effusion"
    ],
    attentionAreas: [
      { id: "area1", cx: 200, cy: 200, rx: 30, ry: 30, intensity: "low", label: "Normal cardiac shadow" }
    ]
  },
  {
    prediction: "Consolidation Detected",
    confidence: 91.5,
    risk: "high",
    findings: [
      "Dense consolidation in right middle lobe",
      "Air bronchograms visible",
      "Possible pneumonic process",
      "Clinical correlation recommended"
    ],
    attentionAreas: [
      { id: "area1", cx: 280, cy: 180, rx: 60, ry: 50, intensity: "high", label: "Right middle lobe consolidation" },
      { id: "area2", cx: 120, cy: 220, rx: 35, ry: 40, intensity: "low", label: "Left lung clear" }
    ]
  },
  {
    prediction: "Possible Pleural Effusion",
    confidence: 87.3,
    risk: "medium",
    findings: [
      "Blunting of left costophrenic angle",
      "Possible small pleural effusion",
      "Heart size borderline enlarged",
      "Follow-up imaging recommended"
    ],
    attentionAreas: [
      { id: "area1", cx: 100, cy: 320, rx: 45, ry: 35, intensity: "high", label: "Left costophrenic angle" },
      { id: "area2", cx: 200, cy: 210, rx: 50, ry: 60, intensity: "medium", label: "Cardiac silhouette" }
    ]
  }
];

// Generate a random case ID
export const generateCaseId = (): string => {
  const num = Math.floor(Math.random() * 9000) + 1000;
  return `SCN-${num}`;
};

// Generate a random patient ID
export const generatePatientId = (): string => {
  const num = Math.floor(Math.random() * 900000) + 100000;
  return `PT-${num}`;
};

// Get a random mock analysis result
export const getRandomAnalysis = (): AnalysisResult => {
  return mockAnalysisResults[Math.floor(Math.random() * mockAnalysisResults.length)];
};
