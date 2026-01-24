# 🦟 Outbreak Zero – Dengue Prevention Platform

## 📖 Project Overview
Climate change is intensifying the frequency, scale, and unpredictability of dengue outbreaks in Vietnam, particularly in vulnerable regions such as the Mekong Delta. Existing healthcare responses remain largely **reactive**, constrained by delayed reporting, fragmented data, and limited predictive capability.

**Outbreak Zero** is a technology-driven platform that aims to transform dengue prevention from reaction to **proactive, community-powered intervention**, combining AI-driven risk prediction, real-time data, and citizen engagement.

---

## 🚨 Problem Statement
Climate change is driving sudden and severe dengue outbreaks in Vietnam, while the healthcare system remains largely reactive due to the lack of real-time data and predictive intelligence.

---

## 💡 Solution Statement
**Outbreak Zero** is an **AI-powered, gamified dengue prevention platform** designed for deployment in the Mekong Delta under climate change conditions.

By analyzing **real-time climate and contextual data**, the system predicts dengue outbreak risks and delivers **location-based alerts** before case numbers surge. Instead of relying solely on institutional response, the platform empowers citizens to take preventive action early.

Users receive **GPS-based preventive missions** that translate public health guidelines into **concrete, verifiable actions**, such as removing mosquito breeding sites. Participation is reinforced through **gamification mechanics** and **real-world incentives**.

To ensure credibility and measurable impact, **AI-based verification** validates user-submitted evidence, aligning individual behavior change with broader public health outcomes.

---

## ✨ Features

### 🌍 For Citizens
- **Risk Dashboard**: View real-time dengue risk levels (Low, Medium, High) for your specific location.
- **AI Sentinel Chatbot**: A friendly AI assistant that answers questions about dengue prevention and symptoms.
- **Gamified Missions**: Complete daily tasks (e.g., "Clear standing water") to earn points.
- **Action Verification**: Upload photos of completed tasks to be verified by AI.
- **Rewards System**: Redeem earned points for real-world vouchers (e.g., mosquito nets, discounts).

### 📊 For Managers & Health Officials
- **Predictive Heatmap**: visualize future outbreak risks across districts (up to 14 days ahead).
- **Sensor Data**: Monitor real-time environmental data (rainfall, temperature, salinity).
- **Priority Zones**: Identify high-risk "hotspots" that require immediate intervention.
- **Broadcast Alerts**: Send targeted warnings to citizens in specific risk zones.

### 🧠 AI & Core Tech
- **Risk Prediction Engine**: Uses weather data (Temperature, Rainfall, Humidity, Salinity) to calculate outbreak probability.
- **Gemini Integration**: Powers the conversational AI chatbot for user education.
- **Computer Vision (Simulated)**: Verifies user-submitted task photos.

---

## 🏗️ Technical Stack & Architecture

### **Architecture Overview**
The application follows a modern client-server architecture:
1.  **Frontend (Next.js)**: Handles the user interface, maps, and interactive elements.
2.  **Backend (Flask)**: Serves API endpoints, runs the AI risk models, and manages the SQLite database.
3.  **Data Layer**:
    *   **External APIs**: OpenWeatherMap (Weather data), Google Gemini (Chatbot).
    *   **Database**: SQLite (`dengue.db`) for storing user tasks and progress.

### **Tech Stack**
-   **Frontend:**
    -   Next.js 16 (App Router, TypeScript)
    -   Tailwind CSS (Styling)
    -   Leaflet / React-Leaflet (Interactive Maps)
    -   Lucide React (Icons)
-   **Backend:**
    -   Python 3 (Flask)
    -   Scikit-learn, Pandas, NumPy (ML & Data Processing)
    -   Google Generative AI (Gemini API)
    -   SQLite (Database)

---

## 🚀 Getting Started

### Prerequisites
Ensure you have the following installed:
-   **Node.js** (v18 or higher)
-   **Python** (3.8 or higher)
-   **npm** or **pnpm**

### 🔑 Environment Setup
You need API keys for the app to function fully. Create a `.env` file in the `dengue-project` root directory:

```env
# Required for Weather Data (Risk Model)
OPENWEATHER_API_KEY=4c756cf3c317d7dfa96a01befc3479ab

# Required for Chatbot
GEMINI_API_KEY=AIzaSyDYdBVWn11Fyx1XrNRQdRbNPJjK8epAF7M
```

> **Note**: Without these keys, the system will fall back to simulated data, so you can still explore the UI!

---

## 🛠️ Installation & Run Instructions

### Option A: Quick Start (Recommended)
We provide a helper script to start both the backend and frontend simultaneously.

**Mac / Linux:**
```bash
chmod +x start_demo.sh
./start_demo.sh
```

**Windows (Git Bash / WSL):**
```bash
./start_demo.sh
```

### Option B: Manual Startup

**1. Start the Backend:**
Navigate to the root folder and run:
```bash
# Install python dependencies (first time only)
pip install -r backend/requirements.txt

# Run the Flask app
python backend/app.py
```
*The backend will start on `http://localhost:5328`*

**2. Start the Frontend:**
Open a new terminal window in the root folder:
```bash
# Install node dependencies (first time only)
npm install

# Run the Next.js app
npm run dev
```
*The frontend will start on `http://localhost:3000`*

---

## 📱 User Guide

Once the app is running, navigate to:

-   **Manager Dashboard**: [http://localhost:3000/manager](http://localhost:3000/manager)
    -   Use this to view the heatmap, sensor data, and manage priority zones.
-   **Citizen App**: [http://localhost:3000/citizen/map](http://localhost:3000/citizen/map)
    -   Use this to see local risk, chat with the AI, and complete daily quests.

---

## 📂 Reproducibility
To rebuild this environment from scratch:
1.  Clone the repository.
2.  Install Python dependencies: `pip install -r backend/requirements.txt`
3.  Install Node dependencies: `npm install`
4.  Add valid API keys to `.env`.
5.  Run the application.

**Files required for Machine Learning:**
-   `backend/dengue_model.pkl` (Pre-trained model)
-   `backend/dengue.db` (Local database, auto-created if missing)

---

## ⚖️ Attribution & Licensing

**License**: [MIT License](LICENSE)  

**Credits**:
-   Data sources: OpenWeatherMap, Simulated Health Data for Demo.
