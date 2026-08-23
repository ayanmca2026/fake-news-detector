FROM python:3.11-slim

WORKDIR /app

# Install system dependencies
RUN apt-get update && apt-get install -y gcc g++ libpq-dev && rm -rf /var/lib/apt/lists/*

COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# Download NLTK data required for preprocessing/summarizer
RUN python -m nltk.downloader punkt punkt_tab stopwords wordnet omw-1.4

COPY . .

# Remove any stale bytecode so Python compiles fresh from source
RUN find /app -type d -name "__pycache__" -exec rm -rf {} + 2>/dev/null; true

CMD ["uvicorn", "app.main:app", "--host", "0.0.0.0", "--port", "8000"]
