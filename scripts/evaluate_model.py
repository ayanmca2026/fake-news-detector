import os
import sys
import pandas as pd
import joblib

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from training.evaluate import ModelEvaluator

def run_evaluation():
    processed_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "processed")
    models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
    
    test_path = os.path.join(processed_dir, 'test.csv')
    model_path = os.path.join(models_dir, 'fake_news_model.pkl')
    vectorizer_path = os.path.join(models_dir, 'tfidf_vectorizer.pkl')
    
    if not os.path.exists(test_path) or not os.path.exists(model_path):
        print("Missing test data or trained model.")
        return
        
    print("Loading test dataset...")
    df_test = pd.read_csv(test_path).dropna()
    
    print("Loading artifacts...")
    model = joblib.load(model_path)
    vectorizer = joblib.load(vectorizer_path)
    
    X_test_vec = vectorizer.transform(df_test['text'])
    
    print("Evaluating...")
    metrics = ModelEvaluator.evaluate(model, X_test_vec, df_test['label'])
    
    print("Test Set Evaluation Metrics:")
    for k, v in metrics.items():
        if k != "confusion_matrix":
            print(f"{k.capitalize()}: {v:.4f}")
    
    print("\nConfusion Matrix:")
    for row in metrics['confusion_matrix']:
        print(row)

if __name__ == "__main__":
    run_evaluation()
