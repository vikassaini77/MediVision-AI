
from fastapi import FastAPI, UploadFile, File
from PIL import Image
import torch
import torchvision.transforms as T
import torchvision.models as models
import numpy as np
import cv2, io, base64
from model.grad_cam import GradCAM

app = FastAPI(title="MedVision AI")

model = models.resnet50(pretrained=True)
model.fc = torch.nn.Linear(model.fc.in_features, 2)
model.eval()

target_layer = model.layer4[-1]
cam_generator = GradCAM(model, target_layer)

transform = T.Compose([
    T.Resize((224,224)),
    T.ToTensor()
])

@app.post("/predict")
async def predict(file: UploadFile = File(...)):
    image = Image.open(io.BytesIO(await file.read())).convert("RGB")
    x = transform(image).unsqueeze(0)
    x.requires_grad = True

    outputs = model(x)
    probs = torch.softmax(outputs, dim=1)
    pred = probs.argmax().item()

    model.zero_grad()
    outputs[0, pred].backward()

    cam = cam_generator.generate()
    cam = cv2.resize(cam, (224,224))
    heatmap = cv2.applyColorMap(np.uint8(255 * cam), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    _, buffer = cv2.imencode(".png", heatmap)
    encoded = base64.b64encode(buffer).decode("utf-8")

    return {
        "prediction": int(pred),
        "confidence": float(probs[0, pred]),
        "grad_cam": encoded
    }
