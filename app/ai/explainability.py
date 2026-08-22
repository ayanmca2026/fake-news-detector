class ModelExplainer:
    def __init__(self, model, vectorizer):
        self.model = model
        self.vectorizer = vectorizer
        
        # Precompute feature names if possible
        if hasattr(self.vectorizer, 'get_feature_names_out'):
            self.feature_names = self.vectorizer.get_feature_names_out()
        else:
            self.feature_names = None

    def explain(self, text, prediction_label):
        explanation = []
        if hasattr(self.model, 'coef_') and self.feature_names is not None:
            # Linear model (Logistic Regression, LinearSVC)
            # Find which features were most influential for the prediction
            text_vec = self.vectorizer.transform([text]).toarray()[0]
            
            # For binary classification with a single coefficient array
            coefs = self.model.coef_[0]
            
            # Find the top words in the text that pushed the model towards the predicted class
            word_scores = []
            for i, val in enumerate(text_vec):
                if val > 0:
                    score = val * coefs[i]
                    word_scores.append((self.feature_names[i], score))
                    
            if prediction_label == "FAKE":
                # Fake is class 1 (positive coefs)
                word_scores.sort(key=lambda x: x[1], reverse=True)
            else:
                # Real is class 0 (negative coefs)
                word_scores.sort(key=lambda x: x[1])
                
            top_words = [word for word, score in word_scores[:5]]
            if top_words:
                explanation.append(f"The model detected patterns in these words that strongly influenced the result: {', '.join(top_words)}.")
                
        explanation.append("These are statistical model indicators, not absolute proof of falsehood.")
        
        return "\n".join(explanation)
