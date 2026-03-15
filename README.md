# 🌊 Samudrika | AI Maritime Intelligence Platform

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Next.js](https://img.shields.io/badge/Next.js-15-black)](https://nextjs.org/)
[![PyTorch](https://img.shields.io/badge/PyTorch-2.0+-ee4c2c)](https://pytorch.org/)
[![TailwindCSS](https://img.shields.io/badge/TailwindCSS-v4-38bdf8)](https://tailwindcss.com/)

**Samudrika** is an end-to-end maritime intelligence solution designed for high-fidelity underwater image restoration and real-time object identification. It combines a state-of-the-art **FUnIE-GAN** backend with a high-performance, military-grade **Next.js** tactical interface.

---

## 🏗️ Project Architecture

The project is structured into two main modules:

1.  **`Samudrika/` (The Core Engine)**: A Python/PyTorch backend implementing generative vision models for underwater image enhancement.
2.  **`samudrika-react-ui/` (The Tactical HUD)**: A modern React/Next.js frontend featuring velocity-reactive audio, GLSL simulations, and interactive metrics dashboards.

---

## ✨ Key Features

### 🧠 AI Core (Backend)
- **FUnIE-GAN Backbone**: Encoder-decoder CNN architecture tailored for real-time underwater image restoration.
- **Multi-Metric Evaluation**: Integrated support for **PSNR**, **SSIM**, and **UIQM** (Underwater Image Quality Measure).
- **Edge-Ready**: Optimized for lightweight inference, suitable for deployment on maritime drones and ROVs.
- **UIEB Support**: Native data loaders for the benchmark Underwater Image Enhancement Dataset.

### 🛰️ Tactical Interface (Frontend)
- **Nuclear Turbine Engine**: Velocity-reactive Web Audio engine that simulates sub-surface propulsion sounds during interaction.
- **Interactive Metrics Hub**: Real-time performance dashboards with automated card cycling between Raw, Enhanced, and Metadata views.
- **GLSL Depth Simulation**: Immersive background rendering using maritime-teal topography shaders and Three.js.
- **Locomotive Inertia**: Precision smooth-scrolling experience for a premium "Deep Tech" feel.

---

## 🚀 Getting Started

### 1. Backend Setup (Core Engine)
Ensure you have Python 3.9+ and PyTorch installed.

```bash
cd Samudrika
pip install -r requirements.txt
```

**Run Inference:**
```bash
python enhance_image.py input.jpg --output enhanced.jpg --show
```

### 2. Frontend Setup (Tactical HUD)
Ensure you have Node.js 18+ installed.

```bash
cd samudrika-react-ui
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) to view the dashboard.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Generative AI** | PyTorch, FUnIE-GAN, PatchGAN |
| **Frontend Frame** | Next.js 15, React 19, TypeScript |
| **Visuals & 3D** | Three.js, GLSL Shaders, Framer Motion |
| **Audio Engine** | Web Audio API (Synthesized Turbine Engine) |
| **Styling** | TailwindCSS v4, Lucide Icons |
| **Analytics** | UIEB Benchmark Suite |

---

## 📂 Repository Structure

```
.
├── Samudrika/             # Python Backend (FUnIE-GAN, Training, Inference)
├── samudrika-react-ui/    # Next.js Frontend (Tactical HUD, Audio Engine)
└── README.md              # Project Documentation
```

---

## 📜 License
This project is licensed under the MIT License - see the [LICENSE](Samudrika/LICENSE) file for details.

## ⚓ Vision
Samudrika aims to bridge the gap between complex generative AI and operational maritime security by providing actionable visual intelligence at the edge.