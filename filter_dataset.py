import os
import pandas as pd
import shutil
from sklearn.model_selection import train_test_split
from tqdm import tqdm

# ===== CONFIG =====
CSV_PATH = "Data_Entry_2017_v2020.csv"
IMAGE_ROOT = "images_006/images"   # change if using images_004 or 005
OUTPUT_DIR = "data"
CLASSES = ["Normal", "Pneumonia"]
RANDOM_STATE = 42

# ==================

os.makedirs(OUTPUT_DIR, exist_ok=True)

df = pd.read_csv(CSV_PATH)

# Create label column
def get_label(label):
    if "Pneumonia" in label:
        return "Pneumonia"
    elif label == "No Finding":
        return "Normal"
    else:
        return None

df["class"] = df["Finding Labels"].apply(get_label)
df = df[df["class"].notna()]

print("Class distribution:")
print(df["class"].value_counts())

# Train / Val / Test split
train_df, temp_df = train_test_split(
    df, test_size=0.3, stratify=df["class"], random_state=RANDOM_STATE
)

val_df, test_df = train_test_split(
    temp_df, test_size=0.5, stratify=temp_df["class"], random_state=RANDOM_STATE
)

splits = {
    "train": train_df,
    "val": val_df,
    "test": test_df
}

# Create folders
for split in splits:
    for cls in CLASSES:
        os.makedirs(os.path.join(OUTPUT_DIR, split, cls), exist_ok=True)

# Copy images
def copy_images(split_df, split_name):
    for _, row in tqdm(split_df.iterrows(), total=len(split_df)):
        img_name = row["Image Index"]
        cls = row["class"]
        src = os.path.join(IMAGE_ROOT, img_name)
        dst = os.path.join(OUTPUT_DIR, split_name, cls, img_name)
        if os.path.exists(src):
            shutil.copy(src, dst)

for split_name, split_df in splits.items():
    print(f"Processing {split_name}...")
    copy_images(split_df, split_name)

print("✅ Dataset filtering & split completed successfully!")
