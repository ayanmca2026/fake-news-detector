import os
import joblib

class FakeNewsClassifier:
    def __init__(self, model_path: str, vectorizer_path: str):
        self.model = None
        self.vectorizer = None
        self.model_path = model_path
        self.vectorizer_path = vectorizer_path
        self._load_artifacts()
        
    def _load_artifacts(self):
        if os.path.exists(self.model_path) and os.path.exists(self.vectorizer_path):
            self.model = joblib.load(self.model_path)
            self.vectorizer = joblib.load(self.vectorizer_path)
        else:
            raise Exception("Model is not trained. Run the training pipeline first.")
            
    def predict(self, text: str):
        if not self.model or not self.vectorizer:
            raise Exception("Model artifacts not loaded properly.")
            
        text_vec = self.vectorizer.transform([text])
        prediction = self.model.predict(text_vec)[0]
        
        # Calculate confidence
        if hasattr(self.model, "predict_proba"):
            probs = self.model.predict_proba(text_vec)[0]
            confidence = float(max(probs))
        elif hasattr(self.model, "decision_function"):
            # Calibrated confidence for SVM/Linear models
            import numpy as np
            decision = self.model.decision_function(text_vec)[0]
            confidence = float(1 / (1 + np.exp(-np.abs(decision))))
        else:
            confidence = 0.5
            
        return int(prediction), confidence * 100
