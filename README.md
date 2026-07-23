# 🩺 ISIC 2024 - AI Skin Cancer Detection & Analysis

An AI-powered web application and machine learning pipeline for skin lesion analysis and early detection, built on the **ISIC 2024 Skin Lesion Dataset**. 

This project combines deep learning model training with an interactive, privacy-focused Next.js web application that runs real-time inference directly in the browser via TensorFlow.js.

---

## ✨ Features

- **⚡ Client-Side On-Device Inference**: Runs the deep learning model directly in the user's browser using `@tensorflow/tfjs`. No image upload to external servers required.
- **🔍 Lesion Analysis & Risk Scoring**: Upload or capture skin lesion images to receive confidence breakdown and risk category analysis.
- **🔒 Privacy-First Architecture**: Sensitive medical images remain on the client device during analysis.
- **📊 Scan History & Tracking**: Log past scans with Firebase sync to track lesion changes over time.
- **🩺 Doctor & Clinic Locator**: Find nearby dermatologists and medical professionals for professional consultation.
- **📚 Educational Hub**: Learn about skin cancer signs (ABCDE rule), prevention, and early detection tips.

---

## 🛠️ Tech Stack

### Frontend & Web App
- **Framework**: [Next.js 16 (App Router)](https://nextjs.org/) & [React 19](https://react.dev/)
- **Styling**: [Tailwind CSS v4](https://tailwindcss.com/) & [Lucide Icons](https://lucide.dev/)
- **Client Inference**: [@tensorflow/tfjs](https://www.tensorflow.org/js)
- **Database & Auth**: [Firebase](https://firebase.google.com/)

### Machine Learning & Pipeline
- **Core Framework**: TensorFlow / Keras (Python 3.10)
- **Model Formats**: Keras `.keras`, Quantized `.tflite`, SavedModel, TensorFlow.js Shards (`model.json`)
- **Dataset**: ISIC 2024 3D TBP Lesion Dataset

---

## 📁 Repository Structure

```
├── frontend/                   # Next.js web application
│   ├── public/models/          # Converted TF.js model shards & configs
│   ├── src/
│   │   ├── app/                # Next.js pages (App Router)
│   │   ├── components/         # UI components & analysis visualizers
│   │   ├── context/            # Auth & Analysis state management
│   │   └── hooks/              # Custom hooks (e.g., useModel for TF.js)
├── models/                     # Trained ML models (.keras, .tflite, SavedModel)
├── notebooks/                  # Training and deployment Jupyter notebooks
└── scripts/                    # Model conversion, patching, and testing scripts
```

---

## 🚀 Getting Started

### Prerequisites
- **Node.js** (v18 or higher recommended)
- **npm**, **pnpm**, or **yarn**

### Running the Web Application

1. Navigate to the frontend directory:
   ```bash
   cd frontend
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Run the development server:
   ```bash
   npm run dev
   ```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🔬 Model Pipeline & Scripts

The repository includes scripts to convert and test the trained models:

- `scripts/export_savedmodel.py`: Exports trained Keras models to SavedModel format.
- `scripts/convert.py` / `convert_patched.py`: Converts SavedModels into quantized TF.js web format.
- `scripts/test_python_inference.py`: Runs local inference tests using Python.
- `scripts/test_inference.js`: Validates Node.js / TF.js client model loading.

---

## ⚠️ Medical Disclaimer

This project is built for **educational, research, and demonstration purposes only**. It is **not** a certified medical device and should not be used as a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified dermatologist for any skin health concerns.

---

## 📄 License

Distributed under the MIT License. See `LICENSE` for details.
