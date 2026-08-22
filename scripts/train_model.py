import os
import sys
import pandas as pd
from datetime import datetime

sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from training.train import ModelTrainer
from training.evaluate import ModelEvaluator

def run_training():
    processed_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "data", "processed")
    models_dir = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "models")
    
    train_path = os.path.join(processed_dir, 'train.csv')
    val_path = os.path.join(processed_dir, 'validation.csv')
    test_path = os.path.join(processed_dir, 'test.csv')
    
    if not all(os.path.exists(p) for p in [train_path, val_path, test_path]):
        print("Processed data not found. Run preprocess_dataset.py first.")
        return
        
    print("Loading datasets...")
    # Fill NaN just in case
    df_train = pd.read_csv(train_path).dropna()
    df_val = pd.read_csv(val_path).dropna()
    df_test = pd.read_csv(test_path).dropna()
    
    trainer = ModelTrainer()
    X_train_vec = trainer.fit_vectorizer(df_train['text'])
    X_val_vec = trainer.transform(df_val['text'])
    X_test_vec = trainer.transform(df_test['text'])
    
    trainer.train_models(X_train_vec, df_train['label'])
    
    evaluations = {}
    print("\nEvaluating on Validation Set:")
    for name, model in trainer.trained_models.items():
        metrics = ModelEvaluator.evaluate(model, X_val_vec, df_val['label'])
        evaluations[name] = metrics
        print(f"{name}: F1={metrics['f1_score']:.4f}, Acc={metrics['accuracy']:.4f}")
        
    best_model_name = ModelEvaluator.select_best_model(evaluations)
    print(f"\nSelected Best Model: {best_model_name}")
    
    print("\nEvaluating Best Model on Test Set:")
    best_model = trainer.trained_models[best_model_name]
    test_metrics = ModelEvaluator.evaluate(best_model, X_test_vec, df_test['label'])
    
    print(f"Test F1: {test_metrics['f1_score']:.4f}")
    print(f"Test Accuracy: {test_metrics['accuracy']:.4f}")
    
    metadata = {
        "dataset": "Kaggle Fake News Detection Dataset",
        "model_name": best_model_name,
        "vectorizer": "TF-IDF",
        "accuracy": test_metrics['accuracy'],
        "precision": test_metrics['precision'],
        "recall": test_metrics['recall'],
        "f1_score": test_metrics['f1_score'],
        "trained_at": datetime.utcnow().isoformat()
    }
    
    trainer.save_model_artifacts(best_model_name, best_model, metadata, models_dir)

if __name__ == "__main__":
    run_training()
