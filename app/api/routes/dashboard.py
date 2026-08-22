from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from ...database import get_db
from ...models import User, Prediction, AnalysisHistory
from ..dependencies import get_current_user

router = APIRouter()

@router.get("/stats")
def get_dashboard_stats(db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    # Total analyses by this user
    total_analyses = db.query(AnalysisHistory).filter(AnalysisHistory.user_id == current_user.id).count()
    
    # Label counts
    fake_count = db.query(Prediction).join(AnalysisHistory, Prediction.id == AnalysisHistory.prediction_id)\
                   .filter(AnalysisHistory.user_id == current_user.id, Prediction.prediction == "FAKE").count()
    real_count = db.query(Prediction).join(AnalysisHistory, Prediction.id == AnalysisHistory.prediction_id)\
                   .filter(AnalysisHistory.user_id == current_user.id, Prediction.prediction == "REAL").count()
    uncertain_count = db.query(Prediction).join(AnalysisHistory, Prediction.id == AnalysisHistory.prediction_id)\
                   .filter(AnalysisHistory.user_id == current_user.id, Prediction.prediction == "UNCERTAIN").count()
                   
    # Averages
    avg_conf = db.query(func.avg(Prediction.confidence)).join(AnalysisHistory, Prediction.id == AnalysisHistory.prediction_id)\
                   .filter(AnalysisHistory.user_id == current_user.id).scalar() or 0.0
    avg_cred = db.query(func.avg(Prediction.credibility_score)).join(AnalysisHistory, Prediction.id == AnalysisHistory.prediction_id)\
                   .filter(AnalysisHistory.user_id == current_user.id).scalar() or 0.0

    return {
        "total_analyses": total_analyses,
        "fake_predictions": fake_count,
        "real_predictions": real_count,
        "uncertain_predictions": uncertain_count,
        "average_confidence": round(float(avg_conf), 2),
        "average_credibility": round(float(avg_cred), 2)
    }
