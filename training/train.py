import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.naive_bayes import MultinomialNB
from sklearn.ensemble import RandomForestClassifier
from sklearn.svm import LinearSVC
import joblib
import os
import json

class ModelTrainer:
    def __init__(self):
        self.vectorizer = TfidfVectorizer(max_features=10000, ngram_range=(1, 2))
        self.models = {
            "Logistic Regression": LogisticRegression(max_iter=1000, random_state=42),
            "Multinomial Naive Bayes": MultinomialNB(),
            "Random Forest": RandomForestClassifier(n_estimators=50, random_state=42, n_jobs=-1), # 50 estimators for speed
            "Linear SVM": LinearSVC(random_state=42, dual=False)
        }
        self.trained_models = {}

    def fit_vectorizer(self, X_train: pd.Series):
        print("Fitting TF-IDF Vectorizer...")
        return self.vectorizer.fit_transform(X_train)
        
    def transform(self, X: pd.Series):
        return self.vectorizer.transform(X)

    def train_models(self, X_train_vec, y_train):
        for name, model in self.models.items():
            print(f"Training {name}...")
            model.fit(X_train_vec, y_train)
            self.trained_models[name] = model
            
    def save_model_artifacts(self, model_name: str, best_model, metadata: dict, output_dir: str):
        os.makedirs(output_dir, exist_ok=True)
        model_path = os.path.join(output_dir, "fake_news_model.pkl")
        vectorizer_path = os.path.join(output_dir, "tfidf_vectorizer.pkl")
        metadata_path = os.path.join(output_dir, "model_metadata.json")
        
        joblib.dump(best_model, model_path)
        joblib.dump(self.vectorizer, vectorizer_path)
        
        with open(metadata_path, 'w') as f:
            json.dump(metadata, f, indent=4)
            
        print(f"Artifacts saved to {output_dir}")
