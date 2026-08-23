import sys
import os

sys.path.append(os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__)))))
from app.ai.classifier import FakeNewsClassifier
from app.ai.credibility import CredibilityEngine
from app.ai.keywords import KeywordExtractor
from app.ai.summarizer import SummarizationService
from app.ai.explainability import ModelExplainer
from training.preprocess import TextPreprocessor
from app.config import settings

class InferenceEngine:
    def __init__(self):
        # We load this once
        try:
            self.classifier = FakeNewsClassifier(settings.MODEL_PATH, settings.VECTORIZER_PATH)
            self.explainer = ModelExplainer(self.classifier.model, self.classifier.vectorizer)
        except Exception as e:
            self.classifier = None
            self.explainer = None
            print(f"Warning: {e}")
            
        self.preprocessor = TextPreprocessor()
        self.credibility = CredibilityEngine()
        
        # Pass the vectorizer to keywords extractor to leverage TF-IDF weights and bigrams
        vectorizer_instance = self.classifier.vectorizer if self.classifier else None
        self.keywords = KeywordExtractor(vectorizer=vectorizer_instance)
        self.summarizer = SummarizationService()
        
    def analyze(self, headline: str, content: str, source_url: str = None):
        if not self.classifier:
            raise ValueError("Model is not trained. Run the training pipeline first.")
            
        combined_text = (headline + " " + content).strip()
        clean_text = self.preprocessor.clean_text(combined_text)
        
        # 1. Prediction & Confidence
        prediction_val, confidence = self.classifier.predict(clean_text)
        label_str = "FAKE" if prediction_val == 1 else "REAL"
        
        # Determine confidence level
        if confidence < 60:
            confidence_level = "LOW"
            label_str = "UNCERTAIN"
        elif confidence < 80:
            confidence_level = "MEDIUM"
        else:
            confidence_level = "HIGH"
            
        # 2. Credibility Score — now incorporates prediction + confidence
        cred = self.credibility.analyze(
            text=content,
            title=headline,
            prediction=label_str,
            confidence=confidence
        )
        
        # 3. Keywords — extract using TF-IDF weights on the preprocessed text
        kw = self.keywords.extract(clean_text)
        
        # 4. Summary
        summary = self.summarizer.generate_summary(content if len(content) > 10 else combined_text)
        
        # 5. Explainability
        explanation = self.explainer.explain(clean_text, "FAKE" if prediction_val == 1 else "REAL")
        
        return {
            "prediction": label_str,
            "confidence": round(confidence, 2),
            "confidence_level": confidence_level,
            "credibility_score": cred["score"],
            "risk_level": cred["risk_level"],
            "keywords": kw,
            "summary": summary,
            "explanation": explanation,
            "model_name": "TF-IDF + Random Forest"
        }
