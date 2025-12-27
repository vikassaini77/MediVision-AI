# 🔐 Security Policy — MedVision AI

MedVision AI is a healthcare-focused AI system.  
Security, privacy, and responsible AI usage are treated as first-class concerns.

---

## 🛡️ Credential & Secret Management

- ❌ No secrets are committed to version control
- ✅ `.env` files are excluded via `.gitignore`
- ✅ MongoDB credentials are stored in environment variables
- ✅ JWT secrets are stored securely and never hard-coded

---

## 🔑 Authentication & Authorization

- JWT-based authentication architecture
- Access tokens required for protected routes
- Role-based access control planned:
  - Radiologist
  - Physician
  - Administrator
- No anonymous access to medical reports

---

## 🧠 AI Safety & Responsible Use

- Model outputs include confidence scores
- Explainability provided via Grad-CAM
- AI does **not** make automated clinical decisions
- Human review is required for all predictions

---

## 📄 Medical & Data Privacy Disclaimer

- This project is intended for **research and educational purposes only**
- Not approved for clinical diagnosis
- No real patient data should be uploaded
- All sample data is synthetic or publicly available

---

## 🧪 Dependency & Code Safety

- Dependencies are managed via `requirements.txt`
- CI pipeline checks code quality on every push
- Linting enforced for Python and frontend code

---

## 🚨 Reporting Security Issues

If you discover a security vulnerability:

- Do **NOT** open a public issue
- Contact the repository owner directly
- Responsible disclosure is appreciated

---

## 🔄 Security Roadmap

Planned improvements:
- Refresh token rotation
- Audit logging
- Rate limiting
- DICOM anonymization
- HIPAA/GDPR alignment
