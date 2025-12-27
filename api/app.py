from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import torch
import torch.nn as nn
from torchvision import models, transforms
from PIL import Image
import numpy as np
import cv2
import io
import base64

app = FastAPI(title="MedVision AI")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

# ---------- Model ----------
model = models.resnet50(weights=None)
model.fc = nn.Linear(model.fc.in_features, 2)
model.load_state_dict(torch.load("resnet50_pneumonia.pth", map_location=DEVICE))
model.to(DEVICE)
model.eval()

# ---------- Transforms ----------
tf = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

# ---------- Grad-CAM ----------
class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.gradients = None
        self.activations = None
        target_layer.register_forward_hook(self.save_activation)
        target_layer.register_full_backward_hook(self.save_gradient)

    def save_activation(self, module, input, output):
        self.activations = output

    def save_gradient(self, module, grad_input, grad_output):
        self.gradients = grad_output[0]

    def generate(self):
        weights = self.gradients.mean(dim=(2,3), keepdim=True)
        cam = (weights * self.activations).sum(dim=1).squeeze()
        cam = cam.detach().cpu().numpy()
        cam = np.maximum(cam, 0)
        cam /= cam.max() + 1e-8
        return cam

cam_generator = GradCAM(model, model.layer4[-1])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    img_tensor = tf(image).unsqueeze(0).to(DEVICE)
    img_tensor.requires_grad = True

    output = model(img_tensor)
    probs = torch.softmax(output, dim=1)
    pred_class = torch.argmax(probs, dim=1).item()
    confidence = probs[0][pred_class].item()

    # Grad-CAM
    model.zero_grad()
    output[0][pred_class].backward()
    cam = cam_generator.generate()
    cam = cv2.resize(cam, (224,224))
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    heatmap_b64 = base64.b64encode(
        cv2.imencode(".png", heatmap)[1]
    ).decode()

    label = "Pneumonia" if pred_class == 1 else "Normal"
    risk = "High" if confidence > 0.6 and label == "Pneumonia" else "Low"

    return {
        "prediction": label,
        "confidence": round(confidence, 3),
        "risk_level": risk,
        "gradcam": heatmap_b64
    }
