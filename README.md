# 🌱 EcoNexus: Smart City Intelligence Platform

![EcoNexus Dashboard Demo]

<img width="1917" height="895" alt="Screenshot 2026-04-03 140017" src="https://github.com/user-attachments/assets/25093835-4d55-423d-b212-ed62238d259a" />

**EcoNexus** is a production-grade, multi-tenant enterprise dashboard designed for tracking, analyzing, and forecasting vital municipal resources—including Electricity, Water, WiFi Bandwidth, and Waste. Backed by a Machine Learning engine, it provides predictive analytics to ensure smarter, more sustainable city management.

## 🚀 Key Features

- **Granular Department Tracking:** Isolate resource consumption across specific zones (e.g., Hostel A, Library, Main Academic Block).
- **Advanced Machine Learning Forecasting:** Uses Scikit-Learn `LinearRegression` through a persistent Python/FastAPI microservice to predict future resource demands based on trailing 5-day historical matrices.
- **EcoMetrics Dashboard:** A responsive, multi-line interactive charting engine (Chart.js) mapped elegantly into a "Light Mode Eco" aesthetic, providing complete visual distinction between competing sectors.
- **Dynamic Sustainability Scoring:** Automatically generates a 0-100 efficiency rating based on weekly aggregate consumption shifts.
- **Secure Authentication Framework:** Full JWT-protected access mapping distinct database records strictly to the logged-in director.
- **Robust CSV Exports:** Granular or fully integrated rolling 30-day matrices downloadable directly as `.csv` data-blobs.

---

## 🏗️ Architecture Stack

This project is built using a modern decoupled Microservices architecture:

- **Frontend:** React (Vite), Tailwind CSS, Chart.js, Lucide Icons
- **Primary Backend API:** Node.js, Express, Mongoose
- **Machine Learning API:** Python, FastAPI, Scikit-Learn, Uvicorn
- **Database Engine:** MongoDB Atlas Cloud Integration

---

## 💻 Local Installation Guide

### Prerequisites
Make sure you have installed:
- [Node.js](https://nodejs.org/en/)
- [Python 3.9+](https://www.python.org/downloads/)
- MongoDB Atlas Account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/anandkgupta-dev/smart-city-intelligent-resource-manager.git
cd smart-city-intelligent-resource-manager
```

### 2. Setup the Frontend (React / Vite)
```bash
cd client
npm install
npm run dev
# The frontend will launch natively on http://localhost:5173
```

### 3. Setup the Node Backend (Express / MongoDB)
```bash
cd ../server
npm install
```
**CRITICAL:** You must create a `.env` file in the `server` directory containing your secrets:
```env
MONGO_URI=mongodb+srv://<user>:<password>@cluster.mongodb.net/smartcity
JWT_SECRET=supersecretjwtkey
ML_API_URL=http://127.0.0.1:8000
PORT=5000
```
Then start the server:
```bash
node index.js
```

### 4. Setup the Machine Learning Analytics Engine
```bash
cd ../ml
python -m venv venv
# On Windows: .\venv\Scripts\activate | On Mac/Linux: source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
```

---

## 🌍 Cloud Deployment Strategy

The environment is architected seamlessly to allow 3-tier decoupling across free-tier hosting networks.

1. **ML Engine** ➡️ Deploy `ml/` on **Render.com** (Python Web Service)
2. **Node Backend** ➡️ Deploy `server/` on **Render.com** (Node Web Service)
   - *Ensure to set your `.env` variables in Render's dashboard!*
3. **Frontend React UI** ➡️ Deploy `client/` on **Vercel**
   - *Ensure to set `VITE_API_URL` to your Render Node URL in Vercel's Environment options.*

---
*Developed for intelligent, sustainable integration.*
