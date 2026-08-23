# 🔍 TruthLens AI — Misinformation Intelligence Platform

> **AI-Powered News Authenticity Assessment, Linguistic Credibility Scoring, and Explainable Machine Learning Intelligence.**

[![React](https://img.shields.io/badge/Frontend-React%2019%20%2B%20Vite-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://fake-news-detector-smoky-nine.vercel.app/)
[![FastAPI](https://img.shields.io/badge/Backend-FastAPI%20%2B%20Python-009688?style=for-the-badge&logo=fastapi&logoColor=white)](https://fake-news-backend-0p9c.onrender.com/)
[![Scikit-Learn](https://img.shields.io/badge/ML-Random%20Forest%20%2B%20TF--IDF-F7931E?style=for-the-badge&logo=scikitlearn&logoColor=white)](https://scikit-learn.org/)
[![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL%20%2F%20SQLite-336791?style=for-the-badge&logo=postgresql&logoColor=white)](https://www.postgresql.org/)
[![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS%20v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![Deployment](https://img.shields.io/badge/Deployment-Vercel%20%2B%20Render-black?style=for-the-badge&logo=vercel&logoColor=white)](https://fake-news-detector-smoky-nine.vercel.app/)

---

## 🌐 Live Deployments

- 🖥️ **Production Web App (Vercel):** [https://fake-news-detector-smoky-nine.vercel.app/](https://fake-news-detector-smoky-nine.vercel.app/)
- ⚙️ **Production API Server (Render):** [https://fake-news-backend-0p9c.onrender.com](https://fake-news-backend-0p9c.onrender.com/)
- 📖 **Interactive Swagger API Docs:** [https://fake-news-backend-0p9c.onrender.com/docs](https://fake-news-backend-0p9c.onrender.com/docs)
- 🐙 **GitHub Repository:** [https://github.com/ayanmca2026/fake-news-detector](https://github.com/ayanmca2026/fake-news-detector)

---

## 📌 GitHub Repository Metadata

### 📝 Short Description
> *Production-ready AI misinformation intelligence platform using TF-IDF and Random Forest ensemble classification, heuristic credibility scoring, extractive summarization, and modern cyber-analytics dashboard.*

### 🏷️ Recommended GitHub Topics
```text
fake-news-detection, machine-learning, nlp, natural-language-processing, scikit-learn, tf-idf, random-forest, fastapi, python, react, vite, tailwindcss, recharts, postgresql, misinformation, explainable-ai, text-classification, data-science, full-stack, vercel
```

---

## 🚀 Key Features

- 🧠 **Ensemble Machine Learning Classification**: Evaluates articles using a fine-tuned **Random Forest Classifier (50 Estimators)** trained on **44,898 verified real and fake news articles**, delivering **99.56% accuracy** and **99.51% F1-score**.
- 🔤 **TF-IDF N-Gram Vector Space**: Maps linguistic tokens into **10,000 unigram and bigram dimensions**, detecting subtle semantic deception patterns.
- 🎯 **Credibility & Misinformation Risk Scoring**: Synthesizes algorithmic model probability with surface heuristics (sensationalism, excessive capitalization, clickbait phrases, article structure) to generate a balanced 0–100 Credibility Rating and Risk Level (`LOW`, `MEDIUM`, `HIGH`).
- 🔍 **Explainable AI (XAI) Diagnostics**: Highlights top influential feature weights, deceptive markers, and statistical reasoning behind every prediction.
- 📄 **Extractive Sentence-Ranked Summarizer**: Automatically extracts the most salient key sentences from long articles to aid rapid fact-checking.
- 📊 **Intelligence Analytics & Velocity Dashboard**: Visualizes verdict distributions (Donut charts), evaluation volume over time, and credibility vs. confidence metrics powered by Recharts.
- 🗂️ **Assessment Archives & History**: Searchable and filterable history logs with detailed modal inspection dossiers, delete controls, and 1-click clipboard export.
- 🔬 **Model Intelligence & Benchmark Suite**: In-app transparency page exposing model architecture, dataset provenance, multi-model benchmark matrix, and the 7-stage NLP pipeline.
- 🔒 **Full-Stack Security & Authentication**: JWT Bearer token authentication, bcrypt password hashing, input validation via Pydantic v2, and CORS protection.
- 📱 **Modern Dark Glassmorphism UI**: High-contrast, responsive interface with collapsible sidebar, real-time backend health heartbeat, and toast notifications.

---

## 🏗️ System Architecture

```text
┌─────────────────────────────────────────────────────────────────────────┐
│                           TRUTHLENS AI WORKSPACE                        │
│                   (React 19 + Vite + Tailwind CSS v4)                   │
└────────────────────────────────────┬────────────────────────────────────┘
                                     │ JSON API Requests (JWT Auth)
                                     ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                             FASTAPI BACKEND                             │
│                  (Routers: Auth, News, Dashboard, Model)                │
└──────┬─────────────────────────────┬─────────────────────────────┬──────┘
       │                             │                             │
       ▼                             ▼                             ▼
┌──────────────┐             ┌───────────────┐             ┌──────────────┐
│  POSTGRESQL  │             │  NLP PIPELINE │             │  HEURISTICS  │
│   DATABASE   │             │ (TF-IDF + RF) │             │    ENGINE    │
│ (Users, News,│             │ (scikit-learn │             │(Sensational, │
│ Predictions) │             │  + NLTK Word) │             │  Clickbait)  │
└──────────────┘             └───────────────┘             └──────────────┘
```

---

## 📈 Model Performance & Benchmarks

The model was evaluated against multiple classical classifiers on **5,865 holdout test articles** from the Kaggle ISOT dataset:

| Model Architecture | Accuracy | Precision | Recall | F1-Score | Status |
|---|---|---|---|---|---|
| **Random Forest (Selected)** | **99.56%** | **99.78%** | **99.26%** | **99.51%** | 🟢 **Production** |
| Linear SVM | 99.42% | 99.51% | 99.32% | 99.41% | ⚪ Benchmark |
| Logistic Regression | 98.76% | 98.90% | 98.61% | 98.75% | ⚪ Benchmark |
| Multinomial Naive Bayes | 95.21% | 96.10% | 94.25% | 95.17% | ⚪ Benchmark |

### 📂 Dataset Details
- **Dataset**: ISOT Fake News Dataset (Kaggle)
- **Total Articles**: 44,898 raw samples
  - **Real Articles (`True.csv`)**: 21,417 articles from Reuters
  - **Fake Articles (`Fake.csv`)**: 23,481 articles from flagged unreliable sources
- **Split**: 70% Train / 15% Validation / 15% Test

---

## 🛠️ Technology Stack

| Layer | Technologies |
|---|---|
| **Frontend** | React 19, Vite, Tailwind CSS v4, Lucide React, Recharts, Axios |
| **Backend** | FastAPI, Uvicorn, SQLAlchemy, Pydantic v2, Python-Jose (JWT), Passlib (Bcrypt) |
| **Machine Learning** | scikit-learn, NLTK, Pandas, NumPy, joblib |
| **Database** | PostgreSQL (Production on Render) / SQLite (Local Dev) |
| **DevOps & Hosting** | Docker, Docker Compose, Vercel (SPA Frontend), Render (Web Service) |

---

## ⚙️ Local Installation & Development

### Prerequisites
- **Python 3.11+**
- **Node.js 18+** & **npm**
- **Git**

### 1. Clone the Repository
```bash
git clone https://github.com/ayanmca2026/fake-news-detector.git
cd fake-news-detector
```

### 2. Backend Setup
```powershell
# Create and activate Python virtual environment
python -m venv venv
.\venv\Scripts\Activate.ps1   # On Windows (or source venv/bin/activate on Unix)

# Install backend dependencies
pip install -r requirements.txt

# Start FastAPI development server
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```
*API will run at `http://localhost:8000` (Docs at `http://localhost:8000/docs`).*

### 3. Frontend Setup
In a new terminal:
```powershell
cd frontend
npm install

# Start Vite dev server
npm run dev
```
*Frontend will run at `http://localhost:5173`.*

---

## 🐳 Docker Deployment

Run the complete full-stack environment (FastAPI + PostgreSQL + NLTK Data) with Docker Compose:

```bash
docker compose up --build
```

---

## 🔐 Environment Variables

### Backend (`.env` in project root)
```env
DATABASE_URL=sqlite:///./fake_news.db    # Or postgresql://user:pass@host:5432/dbname
SECRET_KEY=your_super_secret_jwt_key_here
ACCESS_TOKEN_EXPIRE_MINUTES=30
CORS_ORIGINS=https://fake-news-detector-smoky-nine.vercel.app,http://localhost:5173
```

### Frontend (`frontend/.env`)
```env
VITE_API_URL=https://fake-news-backend-0p9c.onrender.com/api
```

---

## 🛡️ Responsible AI & Ethical Framework

> [!IMPORTANT]
> **Ethical Notice**: TruthLens AI is designed to assist researchers, students, and analysts in evaluating digital claims through statistical pattern recognition. AI predictions represent mathematical probabilities and heuristic risk estimations—they should **never be treated as definitive or absolute factual truth**. Always verify critical claims with primary sources and accredited journalistic bodies.

---

## 📄 License

This project is open-source and available under the **MIT License**.

---

## 👨‍💻 Author

**Ayan Ghosh**  
- GitHub: [@ayanmca2026](https://github.com/ayanmca2026)  
- Project: [TruthLens AI — Fake News Detector](https://github.com/ayanmca2026/fake-news-detector)
