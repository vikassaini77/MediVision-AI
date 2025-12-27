from pydantic import BaseModel

class PredictionResponse(BaseModel):
    case_id: str
    prediction: str
    confidence: float
    risk_level: str
    gradcam: str
