from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime

class UserBase(BaseModel):
    name: str
    email: EmailStr

class UserCreate(UserBase):
    password: str

class UserResponse(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str

class TokenData(BaseModel):
    email: Optional[str] = None

class ArticleRequest(BaseModel):
    title: str = ""
    content: str
    source_url: Optional[str] = None

class AnalysisResponse(BaseModel):
    prediction: str
    confidence: float
    confidence_level: str
    credibility_score: float
    risk_level: str
    summary: str
    keywords: List[str]
    explanation: str
    model_name: str

class HistoryResponse(BaseModel):
    id: int
    article_title: str
    prediction: str
    confidence: float
    credibility_score: float
    risk_level: str
    created_at: datetime
