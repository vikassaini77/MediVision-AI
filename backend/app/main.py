from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from torchvision import transforms
from PIL import Image
import torch
import base64
import io
import uuid
import cv2

from app.model import load_model
from app.gradcam import GradCAM, create_heatmap
from app.schemas import PredictionResponse

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

app = FastAPI(title="MedVision AI Backend")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

model = load_model()
gradcam = GradCAM(model, model.layer4[-1])

transform = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

@app.post("/predict", response_model=PredictionResponse)
async def predict(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    x = transform(image).unsqueeze(0).to(DEVICE)
    x.requires_grad = True

    output = model(x)
    probs = torch.softmax(output, dim=1)
    pred_class = torch.argmax(probs, dim=1).item()
    confidence = probs[0][pred_class].item()

    model.zero_grad()
    output[0, pred_class].backward()

    cam = gradcam.generate()
    heatmap = create_heatmap(cam)

    _, buffer = cv2.imencode(".png", heatmap)
    gradcam_b64 = base64.b64encode(buffer).decode()

    label = "Pneumonia" if pred_class == 1 else "Normal"

    if label == "Pneumonia":
        if confidence >= 0.75:
            risk = "High"
        elif confidence >= 0.45:
            risk = "Medium"
        else:
            risk = "Low"
    else:
        risk = "Low"

    return {
        "case_id": str(uuid.uuid4()),
        "prediction": label,
        "confidence": float(confidence),
        "risk_level": risk,
        "gradcam": gradcam_b64
    }
