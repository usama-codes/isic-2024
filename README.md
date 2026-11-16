<div align="center">

# 🩺 Second Look

### AI-assisted skin lesion screening, built for a more informed next step.

Upload a clear photo of a skin spot and receive an instant, private, browser-based assessment powered by TensorFlow.js. Track previous scans, learn the warning signs, and find professional care when you need it.

<p>
  <a href="https://github.com/usama-codes/isic-2024"><img src="https://img.shields.io/badge/Project-ISIC%202024-0f766e?style=for-the-badge" alt="ISIC 2024 project"></a>
  <img src="https://img.shields.io/badge/Inference-On--device-0f766e?style=for-the-badge" alt="On-device inference">
  <img src="https://img.shields.io/badge/Privacy--first-1f2937?style=for-the-badge" alt="Privacy first">
</p>

</div>

> **Important:** Second Look is an educational and research project, not a medical device. Its results are not a diagnosis and should never replace advice from a qualified healthcare professional.

## ✨ What you can do

### 🔬 Screen a skin spot

- Upload an image by selecting a file or dragging and dropping it into the app.
- Validate image type and basic quality before analysis.
- Run inference directly in the browser with TensorFlow.js and WebGL acceleration when available.
- Get a probability score with a clear confidence ring and an easy-to-read result state.
- See a **Flagged** or **Lower Concern** classification based on the configured model threshold.
- Review plain-language guidance explaining what the result means and what to do next.
- Replace the photo or start a new scan without leaving the page.

### 🔒 Keep control of your data

- Analyze images locally instead of uploading them to an inference server.
- Sign in securely with Google when you want cloud-backed history.
- Save compact scan records to your private Firebase account, including the result, threshold, model version, timestamp, and thumbnail.
- Access authenticated history with a live Firestore-powered view.
- Filter past scans by **All**, **Flagged**, or **Benign-leaning**.
- Open a scan for its full result, timestamp, image, and advisory message.
- Delete individual scans with a confirmation step.
- Export scan metadata and original stored images as a downloadable ZIP containing CSV data.
- Sign out and manage account details from the profile page.

### 📚 Learn and find care

- Browse an interactive skin-health guide covering:
  - The **ABCDE** warning signs: Asymmetry, Border, Color, Diameter, and Evolving.
  - A step-by-step self-examination guide.
  - Common risk factors.
  - Sun-safety and prevention guidance.
  - When to contact a dermatologist.
- Use the care finder to view dermatologists near your location through an embedded Google Maps search.
- Move through the app with responsive desktop and mobile navigation for **Detect**, **Learn**, **History**, **Find Care**, and **Profile**.

## 🧰 Technology

<div align="center">

### Web application

<a href="https://nextjs.org/"><img src="https://img.shields.io/badge/Next.js-16-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Next.js"></a>
<a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=20232A" alt="React"></a>
<a href="https://www.typescriptlang.org/"><img src="https://img.shields.io/badge/TypeScript-5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript"></a>
<a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS"></a>

### AI, data, and integrations

<a href="https://www.tensorflow.org/js"><img src="https://img.shields.io/badge/TensorFlow.js-4.22-FF6F00?style=for-the-badge&logo=tensorflow&logoColor=white" alt="TensorFlow.js"></a>
<a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-12-FFCA28?style=for-the-badge&logo=firebase&logoColor=1f2937" alt="Firebase"></a>
<a href="https://www.google.com/maps"><img src="https://img.shields.io/badge/Google_Maps-4285F4?style=for-the-badge&logo=googlemaps&logoColor=white" alt="Google Maps"></a>
<a href="https://www.tensorflow.org/guide/keras"><img src="https://img.shields.io/badge/Keras-Deep_Learning-D00000?style=for-the-badge&logo=keras&logoColor=white" alt="Keras"></a>
<a href="https://www.python.org/"><img src="https://img.shields.io/badge/Python-3.10-3776AB?style=for-the-badge&logo=python&logoColor=white" alt="Python"></a>

### Supporting tools

<a href="https://lucide.dev/"><img src="https://img.shields.io/badge/Lucide-Icons-F8FAFC?style=for-the-badge&logo=lucide&logoColor=111827" alt="Lucide icons"></a>
<a href="https://stuk.github.io/jszip/"><img src="https://img.shields.io/badge/JSZip-Exports-F59E0B?style=for-the-badge&logo=javascript&logoColor=111827" alt="JSZip"></a>
<a href="https://www.npmjs.com/"><img src="https://img.shields.io/badge/npm-Package_Manager-CB3837?style=for-the-badge&logo=npm&logoColor=white" alt="npm"></a>

</div>

The model pipeline supports Keras, SavedModel, quantized TensorFlow Lite, and TensorFlow.js formats. The web app loads the browser-ready graph model from `frontend/public/models` and performs image preprocessing before prediction.

## 🚀 Getting started

### Requirements

- Node.js 18+
- npm
- Firebase configuration for authentication and scan history

### Run locally

```bash
git clone https://github.com/usama-codes/isic-2024.git
cd isic-2024/frontend
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

For a production build:

```bash
npm run build
npm start
```

## 🧪 Model and data notes

The project is built around the ISIC 2024 skin lesion dataset and includes model conversion and inference utilities for research and deployment experiments. The app uses a configured image size and threshold so the browser model and displayed risk state stay aligned.

## 🤝 Contributing

Ideas, bug reports, and improvements are welcome. Please keep contributions focused on accessibility, privacy, responsible medical UX, and reproducible model behavior.

<div align="center">

### A second look can be a better first step.

</div>
