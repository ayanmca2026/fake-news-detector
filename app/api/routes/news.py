from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
import json
from ...database import get_db
from ...schemas.schemas import ArticleRequest, AnalysisResponse
from ...models import User, NewsArticle, Prediction, AnalysisHistory
from ..dependencies import get_current_user
from ...ai.inference import InferenceEngine

router = APIRouter()

# Instantiate once
try:
    inference_engine = InferenceEngine()
except Exception as e:
    inference_engine = None
    print(f"Failed to initialize Inference Engine: {e}")

@router.post("/analyze", response_model=AnalysisResponse)
def analyze_news(
    request: ArticleRequest, 
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if not inference_engine:
        raise HTTPException(status_code=500, detail="AI Model is not ready. Train the model first.")
        
    if not request.content.strip():
        raise HTTPException(status_code=400, detail="Article content cannot be empty.")
        
    try:
        # 1. Run AI analysis
        results = inference_engine.analyze(headline=request.title, content=request.content, source_url=request.source_url)
        
        # 2. Save Article
        article = NewsArticle(
            user_id=current_user.id,
            title=request.title,
            content=request.content,
            source_url=request.source_url
        )
        db.add(article)
        db.commit()
        db.refresh(article)
        
        # 3. Save Prediction
        prediction = Prediction(
            article_id=article.id,
            prediction=results["prediction"],
            confidence=results["confidence"],
            credibility_score=results["credibility_score"],
            risk_level=results["risk_level"],
            model_name=results["model_name"]
        )
        db.add(prediction)
        db.commit()
        db.refresh(prediction)
        
        # 4. Save History
        history = AnalysisHistory(
            user_id=current_user.id,
            article_id=article.id,
            prediction_id=prediction.id,
            summary=results["summary"],
            keywords=json.dumps(results["keywords"])
        )
        db.add(history)
        db.commit()
        
        return AnalysisResponse(**results)
        
    except ValueError as ve:
        raise HTTPException(status_code=400, detail=str(ve))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Analysis failed: {str(e)}")
