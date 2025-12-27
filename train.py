import torch
import torch.nn as nn
from torchvision import datasets, transforms, models
from torch.utils.data import DataLoader, WeightedRandomSampler
from torch.optim import Adam
import os
import numpy as np
from tqdm import tqdm

# ================= CONFIG =================
DATA_DIR = "data"
BATCH_SIZE = 8
EPOCHS = 15  # We need more epochs for fine-tuning
LR = 1e-5    # ⚠️ VERY LOW LR is crucial when unfreezing
NUM_CLASSES = 2
DEVICE = "cuda" if torch.cuda.is_available() else "cpu"
# ⚠️ SAVING AS THE ORIGINAL NAME SO YOUR TEST SCRIPT WORKS AUTOMATICALLY
MODEL_SAVE_PATH = "resnet50_pneumonia.pth" 
# ==========================================

print(f"Using device: {DEVICE}")

# Transforms: STRONGER AUGMENTATION
train_tf = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.RandomHorizontalFlip(),
    transforms.RandomRotation(15), 
    transforms.ColorJitter(brightness=0.2, contrast=0.2),
    transforms.RandomAffine(degrees=0, translate=(0.1, 0.1), scale=(0.9, 1.1)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

val_tf = transforms.Compose([
    transforms.Resize((224, 224)),
    transforms.ToTensor(),
    transforms.Normalize([0.485,0.456,0.406],[0.229,0.224,0.225])
])

# Datasets
train_ds = datasets.ImageFolder(os.path.join(DATA_DIR, "train"), transform=train_tf)
val_ds   = datasets.ImageFolder(os.path.join(DATA_DIR, "val"), transform=val_tf)

# ================= SAMPLER LOGIC =================
class_count = [train_ds.targets.count(t) for t in range(len(train_ds.classes))]
print(f"Class Counts: {class_count}")

class_weights = 1. / torch.tensor(class_count, dtype=torch.float)
sample_weights = np.array([class_weights[t] for t in train_ds.targets])
sample_weights = torch.from_numpy(sample_weights)

sampler = WeightedRandomSampler(weights=sample_weights, num_samples=len(sample_weights), replacement=True)

train_loader = DataLoader(train_ds, batch_size=BATCH_SIZE, sampler=sampler, num_workers=0)
val_loader   = DataLoader(val_ds, batch_size=BATCH_SIZE, shuffle=False, num_workers=0)
# =================================================

# Model
model = models.resnet50(weights="IMAGENET1K_V1")

# --- ⚠️ UNFREEZE EVERYTHING ---
for param in model.parameters():
    param.requires_grad = True  # Let the WHOLE model learn new features

model.fc = nn.Linear(model.fc.in_features, NUM_CLASSES)
model = model.to(DEVICE)

# Optimizer
optimizer = Adam(model.parameters(), lr=LR)
criterion = nn.CrossEntropyLoss()
scaler = torch.amp.GradScaler('cuda')

# ================= TRAIN LOOP =================
best_val_recall = 0.0 

for epoch in range(EPOCHS):
    model.train()
    train_loss = 0
    
    loop = tqdm(train_loader, desc=f"Epoch {epoch+1}/{EPOCHS}")

    for imgs, labels in loop:
        imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
        optimizer.zero_grad()

        with torch.amp.autocast('cuda'):
            outputs = model(imgs)
            loss = criterion(outputs, labels)

        scaler.scale(loss).backward()
        scaler.step(optimizer)
        scaler.update()

        train_loss += loss.item()
        loop.set_postfix(loss=loss.item())

    # Validation
    model.eval()
    correct = 0
    total = 0
    pneumonia_correct = 0
    pneumonia_total = 0

    with torch.no_grad():
        for imgs, labels in val_loader:
            imgs, labels = imgs.to(DEVICE), labels.to(DEVICE)
            outputs = model(imgs)
            preds = outputs.argmax(dim=1)
            
            correct += (preds == labels).sum().item()
            total += labels.size(0)
            
            # Track Pneumonia specifically (Class 1)
            mask = (labels == 1) 
            pneumonia_total += mask.sum().item()
            pneumonia_correct += (preds[mask] == labels[mask]).sum().item()

    val_acc = correct / total
    p_recall = pneumonia_correct / (pneumonia_total + 1e-6)
    
    print(f"Epoch [{epoch+1}/{EPOCHS}] | Loss: {train_loss:.2f} | Overall Acc: {val_acc:.4f} | Pneumonia Recall: {p_recall:.4f}")

    # Save if Pneumonia Recall improves
    if p_recall >= best_val_recall:
        best_val_recall = p_recall
        torch.save(model.state_dict(), MODEL_SAVE_PATH)
        print(f"--> Model Saved! Best Recall: {best_val_recall:.4f}")

print("✅ Training complete")