# AI Fake News Detector for Students

Detect Misinformation. Understand the News. Think Critically.

## Project Overview
An AI-powered fake news analysis platform designed to help students evaluate online information. It allows students to submit news articles and receive an AI-based authenticity assessment, credibility indicators, and contextual explanations.

## Problem Statement
Misinformation spreads rapidly through online news, blogs, and social media. Students often struggle to determine whether information is trustworthy. This project aims to create an automated but responsible system to flag potential fake news without acting as a definitive arbiter of truth.

## Features
- **Machine Learning Classification**: Predicts whether news is likely REAL or POTENTIALLY FAKE using classical NLP (TF-IDF + Random Forest).
- **Credibility Analysis**: Uses heuristic indicators (sensationalism, clickbait phrasing, capitalization) to calculate a distinct Credibility Score and Risk Level.
- **Explainability**: Highlights influential feature patterns to explain *why* the model made a prediction.
- **Smart Summary**: Provides an extractive AI summary of the content to aid quick comprehension.
- **Keyword Extraction**: Identifies primary topics using term frequencies.
- **Personal Dashboard**: Tracks past analyses securely for each student.

## Architecture
- **Backend:** FastAPI, PostgreSQL, SQLAlchemy, Pydantic v2
- **Frontend:** React, Vite, Tailwind CSS, Recharts
- **Machine Learning:** Scikit-learn, NLTK, Pandas

## Dataset
This project uses the **Kaggle Fake News Detection Dataset** (ISOT). 
- **Dataset Structure**: The dataset was provided as two files (`True.csv` and `Fake.csv`), each containing `title`, `text`, `subject`, and `date` columns.
- **Preprocessing**: Handles HTML tag removal, URL removal, punctuation stripping, tokenization, stopword removal, and lemmatization using NLTK. Missing/empty values and duplicates are stripped.

## ML Models & Evaluation
We evaluated Logistic Regression, Multinomial Naive Bayes, Random Forest, and Linear SVM. 
- **Selected Model**: Random Forest (best F1 score).
- **Evaluation**: 
  - Test-set Accuracy: 0.9956
  - Test-set F1 score: 0.9951
  - Test-set Precision: 0.9977
  - Test-set Recall: 0.9925

## Installation & Setup

### Windows Setup
Ensure Python 3.11+ and Node.js are installed.

1. Clone the repository and create the environment:
```powershell
python -m venv venv
.\venv\Scripts\Activate.ps1
pip install -r requirements.txt
```

2. Setup Dataset:
Upload the Kaggle Fake News Detection Dataset (`True.csv`, `Fake.csv`) to `data/raw/`.

3. Training:
```powershell
python scripts/preprocess_dataset.py
python scripts/train_model.py
```

### Backend Setup
Create `.env` based on `.env.example`. Then run:
```powershell
uvicorn app.main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup
In a separate terminal:
```powershell
cd frontend
npm install
npm run dev
```

### Docker
To run using Docker Compose (includes Postgres and Backend):
```powershell
docker compose up --build
```

## API & Database
- **API endpoints**: Registered under `/api/auth`, `/api/prediction`, `/api/history`, and `/api/dashboard`. View Swagger at `http://localhost:8000/docs`.
- **Database**: Defaults to SQLite for immediate local execution, but fully supports PostgreSQL (as configured in Docker and Render environments) with robust SQLAlchemy ORM relationships (`users`, `news_articles`, `predictions`, `analysis_history`).

## Deployment
- **Backend**: Pre-configured for Render via `render.yaml`.
- **Frontend**: Ready for Vercel deployment (use `VITE_API_URL` environment variable).

## Responsible AI & Limitations
- **Disclaimer**: This tool provides an AI-based assessment of news content. AI predictions may be incorrect and should not be treated as absolute proof that information is true or false. The UI uses responsible wording ("Potentially Fake", "Likely Real", "Uncertain").
- **Limitations**: Trained solely on political/world news from 2016-2017. May not generalize perfectly to modern 2024+ events or domain-specific topics (like medical science) without retraining.

## Future Improvements
- Integrate robust Transformer-based Summarization (BART/T5).
- Include deep learning classifiers (DistilBERT) for semantic nuance.
- Add real-time web search cross-referencing.
