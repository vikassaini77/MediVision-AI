import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader
import numpy as np
import matplotlib.pyplot as plt
import cv2
import os
from sklearn.metrics import confusion_matrix, classification_report
from tqdm import tqdm

# ================= CONFIG =================
DATA_DIR = "data/test"  # Make sure this points to your test folder
MODEL_PATH = "resnet50_pneumonia.pth"
BATCH_SIZE = 8
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
SAVE_CAM_DIR = "gradcam_results"
os.makedirs(SAVE_CAM_DIR, exist_ok=True)
# ==========================================

print(f"Using device: {DEVICE}")

# Transforms
tf = transforms.Compose([
    transforms.Resize((224,224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

# Dataset
dataset = datasets.ImageFolder(DATA_DIR, transform=tf)
loader = DataLoader(dataset, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)

class_names = dataset.classes
print("Classes:", class_names)

# Load model
model = models.resnet50(weights=None)
model.fc = nn.Linear(model.fc.in_features, 2)
try:
    model.load_state_dict(torch.load(MODEL_PATH, map_location=DEVICE))
except FileNotFoundError:
    print(f"❌ Error: Could not find model file '{MODEL_PATH}'. Please train first.")
    exit()

model = model.to(DEVICE)
model.eval()

# ================= TESTING =================
y_true, y_pred = [], []

print("Running evaluation on test set...")
with torch.no_grad():
    for imgs, labels in tqdm(loader, desc="Testing"):
        imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
        outputs = model(imgs)
        preds = outputs.argmax(dim=1)
        y_true.extend(labels.cpu().numpy())
        y_pred.extend(preds.cpu().numpy())

print("\nConfusion Matrix:")
print(confusion_matrix(y_true, y_pred))

print("\nClassification Report:")
print(classification_report(y_true, y_pred, target_names=class_names, zero_division=0))

# ================= GRAD-CAM =================
class GradCAM:
    def __init__(self, model, target_layer):
        self.model = model
        self.gradients = None
        self.activations = None

        target_layer.register_forward_hook(self.save_activation)
        # CHANGED: Use register_full_backward_hook to avoid warnings
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
        # Avoid division by zero
        cam /= (cam.max() + 1e-8)
        return cam

cam_generator = GradCAM(model, model.layer4[-1])

print("\nGenerating Grad-CAM samples...")

count = 0
# We iterate through the dataset directly to get individual images
for img, label in tqdm(dataset, desc="Grad-CAM"):
    if count >= 10:  # Increased limit to 10 samples
        break

    x = img.unsqueeze(0).to(DEVICE)
    x.requires_grad = True

    output = model(x)
    pred = output.argmax(dim=1)

    model.zero_grad()
    output[0, pred].backward()

    cam = cam_generator.generate()
    cam = cv2.resize(cam, (224,224))
    heatmap = cv2.applyColorMap(np.uint8(255*cam), cv2.COLORMAP_JET)
    heatmap = cv2.cvtColor(heatmap, cv2.COLOR_BGR2RGB)

    img_np = img.permute(1,2,0).numpy()
    img_np = (img_np - img_np.min()) / (img_np.max() - img_np.min())

    # Create overlay
    overlay = 0.6 * img_np + 0.4 * (heatmap / 255.0)
    
    # --- FIX: Clip values to valid range [0, 1] ---
    overlay = np.clip(overlay, 0, 1)

    plt.imsave(
        f"{SAVE_CAM_DIR}/sample_{count}_{class_names[label]}_pred_{class_names[pred.item()]}.png",
        overlay
    )

    count += 1

print("\n✅ Testing & Grad-CAM generation complete!")
print(f"Grad-CAM images saved in: {SAVE_CAM_DIR}/")