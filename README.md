# 🏥 PulseHealth — Unified Smart Patient Health & Emergency Access Platform

PulseHealth is a medical technology platform designed for longitudinal health record tracking, instant doctor clinical reviews, and zero-login emergency rescue.

---

## 🌟 Key Features

1. **Patient Health Dashboard**:
   - Patient profile with ABHA Health ID integration.
   - Blood Group badge, Organ Donor status, and emergency contacts with 1-tap phone dials.
   - Real-time vitals monitoring (Blood Pressure, Fasting Sugar, Heart Rate, SpO2).
   - Active medications list with dosage instructions, low-pill supply progress bars, and automatic 3-day refill alerts.

2. **AI Document OCR & Biomarker Extraction**:
   - Drag-and-drop file uploader for medical PDFs and images.
   - Camera snapshot simulation.
   - Real-time AI processing extracting clinical biomarkers, dates, and test ranges with automated verification.

3. **QR Code & 24-Hour Doctor Access**:
   - Dynamic QR code generation powered by randomized, non-reusable UUID tokens.
   - Live 24-hour expiration countdown timer.
   - Permission scoping (Full Record, Lab Reports, Emergency Only) with instant revocation.
   - Live access audit trail logging clinician names, hospitals, and access timestamps.

4. **Doctor Clinical Portal & Safety Rules**:
   - High-priority drug-allergy contraindication banner (anaphylaxis prevention for Penicillin/Sulfa drugs).
   - Interactive prescription safety checker verifying drugs in real time.
   - Interactive longitudinal trend graphs for Blood Sugar, BP, and Cholesterol.
   - Filterable timeline of past lab panels, ECGs, and scans.

5. **Zero-Login Emergency Mode (SOS)**:
   - Ultra high-contrast, zero-passcode rescue screen for first responders and ER trauma units.
   - 72px Blood Group hero display with compatible donor unit guide.
   - Strictly prohibited allergies and contraindications in high-visibility red.
   - 1-tap emergency speed dial for Ambulance (108), primary emergency contact, and consulting cardiologist.
   - Live emergency GPS beacon broadcaster.

6. **Multilingual & Voice Synthesis**:
   - Seamless language switching: **English**, **Hindi (हिंदी)**, **Kannada (ಕನ್ನಡ)**, and **Tamil (தமிழ்)**.
   - Natural speech synthesis via Web Speech API with audio equalizer wave animation and speed adjustments.

---

## 🏗️ Tech Stack

- **Frontend**: React 19, TypeScript, Tailwind CSS, Lucide React, `qrcode.react`, Vite
- **Backend**: Python 3.12, FastAPI (Async), Pydantic v2, Uvicorn, Supabase Python Client
- **Database & Storage**: Supabase PostgreSQL with Row Level Security (RLS) and Storage Buckets
- **AI / OCR**: Vision LLM Pipeline & Deterministic Clinical Rule Engine

---

## 🚀 Getting Started

### 1. Prerequisites
- Node.js (v18+)
- Python (v3.10+)

### 2. Frontend Setup
```bash
# Install dependencies
npm install

# Start Vite dev server
npm run dev
```
Frontend runs at: `http://localhost:5173`

### 3. Backend Setup
```bash
# Navigate to backend and install requirements
cd backend
pip install -r requirements.txt

# Run FastAPI backend with Uvicorn
python -m uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
```
Backend API runs at: `http://127.0.0.1:8000`  
Interactive Swagger Docs: `http://127.0.0.1:8000/docs`

### 4. Running Backend Automated Tests
```bash
python backend/test_api.py
```

---

## 🔒 Security & Compliance
- **Zero Raw Data in QR**: QR codes only transmit cryptographically random UUID session tokens.
- **Strict 24-Hour Expiration**: All generated access tokens automatically invalidate after 24 hours.
- **Row Level Security (RLS)**: PostgreSQL policies prevent unauthorized data access.
- **Audit Logging**: All access events capture timestamps, role, and IP address.
