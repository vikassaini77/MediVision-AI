import torch
import torch.nn as nn
from torchvision import models

DEVICE = "cuda" if torch.cuda.is_available() else "cpu"

def load_model():
    model = models.resnet50(weights=None)
    model.fc = nn.Linear(model.fc.in_features, 2)
    model.load_state_dict(
        torch.load("models/resnet50_pneumonia.pth", map_location=DEVICE)
    )
    model.to(DEVICE)
    model.eval()
    return model
