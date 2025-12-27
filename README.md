# 🏥 MedVision AI — Explainable Medical Imaging Platform

MedVision AI is a **production-style healthcare AI platform** designed to assist clinicians in analyzing chest X-ray images using **deep learning and explainable AI (XAI)**.

The system combines a trained convolutional neural network with **Grad-CAM visual explanations**, a **medical-grade web interface**, and a **scalable backend architecture** inspired by real hospital AI workflows.

> ⚠️ This system is intended for research and educational purposes only and does **not** replace professional medical diagnosis.

---

## 🚀 Key Features

### 🧠 Artificial Intelligence
- ResNet-based CNN for chest X-ray classification
- Binary classification: **Normal vs Pneumonia**
- GPU-supported inference
- Confidence score using softmax probabilities

### 🔍 Explainable AI (XAI)
- Grad-CAM heatmaps
- Visual explanation of model focus regions
- Improves clinical transparency and trust

### 🌐 Web Platform
- Professional radiology-style dark UI
- Upload → Analyze → Report workflow
- Interactive explainability view
- Medical-style PDF reports

### 🔐 Authentication (Architecture Ready)
- Login, Sign up, Forgot & Reset password UI
- JWT-based backend design
- MongoDB integration ready
- Role-based system planned (Radiologist, Physician, Admin)

### 🧱 Scalable Backend
- FastAPI-based REST APIs
- Modular architecture (Auth, ML, Database)
- MongoDB Atlas compatible
- GPU / CPU auto-detection

---

## 🏗️ System Architecture
Frontend (React + TypeScript)
|
| HTTP (JSON / Image Upload)
v
Backend (FastAPI)
├── Auth Module (JWT, MongoDB)
├── ML Inference (PyTorch, Grad-CAM)
└── Report Generation
|
v
MongoDB Atlas
---

## 🧠 Machine Learning Details

- **Model**: ResNet (fine-tuned)
- **Framework**: PyTorch
- **Input**: Chest X-ray image (JPG/PNG)
- **Output**:
  - Prediction label
  - Confidence score
  - Risk level
  - Grad-CAM heatmap

### Evaluation
- Confusion Matrix
- Precision / Recall / F1-score
- GPU-accelerated training & inference

---

## ⚙️ Tech Stack

### Frontend
- React + TypeScript
- Tailwind CSS
- ShadCN UI
- React Router
- Context API

### Backend
- FastAPI
- PyTorch
- Torchvision
- OpenCV
- Pydantic
- JWT (python-jose)
- Passlib (bcrypt)

### Database
- MongoDB Atlas

---

## 🧪 How to Run Locally

### 1️⃣ Clone Repository
```bash
git clone https://github.com/your-username/medvision-ai.git
cd medvision-ai
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux
2️⃣ Backend Setup
Create virtual environment
python -m venv venv
venv\Scripts\activate   # Windows
# source venv/bin/activate  # macOS/Linux

Install dependencies
pip install -r requirements.txt

Environment variables

Create .env file:

MONGO_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/medvision
JWT_SECRET=your_super_secret_key

Run backend
uvicorn backend.app.main:app --reload


Backend will be available at:

http://127.0.0.1:8000


Swagger UI:

http://127.0.0.1:8000/docs

3️⃣ Frontend Setup
cd frontend
npm install
npm run dev


Frontend runs at:

http://localhost:5173

📄 Medical Disclaimer

This software is intended for research and educational use only.
It is not approved for clinical diagnosis and must not be used as a substitute for professional medical judgment.

All predictions should be reviewed by qualified healthcare professionals.

🛣️ Future Roadmap

DICOM (.dcm) support

Multi-disease classification

Role-based access control

Audit logs (HIPAA/GDPR inspired)

Human-in-the-loop AI corrections

Cloud deployment (AWS / GCP)

Model monitoring & drift detection

👨‍💻 Author

Vikas Saini
Machine Learning Engineer
Focus: Healthcare AI, Computer Vision, Explainable AI

⭐ Acknowledgements

NIH Chest X-ray Dataset

PyTorch Community

FastAPI

Open-source medical AI research


---

# 📄 `requirements.txt` (BACKEND)

Create a file named **`requirements.txt`** and paste this:

```txt
fastapi
uvicorn
pydantic
python-dotenv

# Machine Learning
torch
torchvision
numpy
opencv-python
pillow

# Explainability
matplotlib

# Authentication & Security
python-jose
passlib[bcrypt]
email-validator

# Database
pymongo

# Utilities
uuid


⚠️ Note:
uuid is part of Python standard library — it won’t install anything but keeping it here is okay for clarity.

✅ FINAL CHECK BEFORE PUSHING TO GITHUB

Do this once:

git status
git add README.md requirements.txt
git commit -m "Add project documentation and backend requirements"
git push


