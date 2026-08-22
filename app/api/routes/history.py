from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List
from ...database import get_db
from ...models import User, AnalysisHistory, NewsArticle, Prediction
from ...schemas.schemas import HistoryResponse
from ..dependencies import get_current_user

router = APIRouter()

@router.get("/", response_model=List[HistoryResponse])
def get_user_history(skip: int = 0, limit: int = 100, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    histories = db.query(AnalysisHistory).filter(AnalysisHistory.user_id == current_user.id).order_by(AnalysisHistory.created_at.desc()).offset(skip).limit(limit).all()
    
    result = []
    for h in histories:
        article = db.query(NewsArticle).filter(NewsArticle.id == h.article_id).first()
        pred = db.query(Prediction).filter(Prediction.id == h.prediction_id).first()
        
        result.append(HistoryResponse(
            id=h.id,
            article_title=article.title if article.title else article.content[:50] + "...",
            prediction=pred.prediction,
            confidence=pred.confidence,
            credibility_score=pred.credibility_score,
            risk_level=pred.risk_level,
            created_at=h.created_at
        ))
    return result

@router.get("/{history_id}")
def get_history_detail(history_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    h = db.query(AnalysisHistory).filter(AnalysisHistory.id == history_id, AnalysisHistory.user_id == current_user.id).first()
    if not h:
        raise HTTPException(status_code=404, detail="History not found")
        
    article = db.query(NewsArticle).filter(NewsArticle.id == h.article_id).first()
    pred = db.query(Prediction).filter(Prediction.id == h.prediction_id).first()
    
    import json
    try:
        keywords = json.loads(h.keywords)
    except:
        keywords = []
        
    return {
        "id": h.id,
        "article": {
            "title": article.title,
            "content": article.content,
            "source_url": article.source_url
        },
        "prediction": {
            "prediction": pred.prediction,
            "confidence": pred.confidence,
            "credibility_score": pred.credibility_score,
            "risk_level": pred.risk_level,
            "model_name": pred.model_name
        },
        "summary": h.summary,
        "keywords": keywords,
        "created_at": h.created_at
    }

@router.delete("/{history_id}")
def delete_history(history_id: int, db: Session = Depends(get_db), current_user: User = Depends(get_current_user)):
    h = db.query(AnalysisHistory).filter(AnalysisHistory.id == history_id, AnalysisHistory.user_id == current_user.id).first()
    if not h:
        raise HTTPException(status_code=404, detail="History not found")
        
    db.delete(h)
    db.commit()
    return {"message": "Deleted successfully"}
