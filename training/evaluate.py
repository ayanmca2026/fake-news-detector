import pandas as pd
from sklearn.metrics import accuracy_score, precision_score, recall_score, f1_score, confusion_matrix
from datetime import datetime

class ModelEvaluator:
    @staticmethod
    def evaluate(model, X_vec, y_true):
        y_pred = model.predict(X_vec)
        return {
            "accuracy": float(accuracy_score(y_true, y_pred)),
            "precision": float(precision_score(y_true, y_pred)),
            "recall": float(recall_score(y_true, y_pred)),
            "f1_score": float(f1_score(y_true, y_pred)),
            "confusion_matrix": confusion_matrix(y_true, y_pred).tolist()
        }

    @staticmethod
    def select_best_model(evaluations):
        best_name = None
        best_f1 = -1
        for name, metrics in evaluations.items():
            if metrics["f1_score"] > best_f1:
                best_f1 = metrics["f1_score"]
                best_name = name
        return best_name
