from sqlalchemy import Column, Integer, String, Float, ForeignKey, DateTime
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from ..database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String, index=True)
    email = Column(String, unique=True, index=True)
    password_hash = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())

    articles = relationship("NewsArticle", back_populates="user")
    histories = relationship("AnalysisHistory", back_populates="user")


class NewsArticle(Base):
    __tablename__ = "news_articles"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    content = Column(String)
    source_url = Column(String, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="articles")
    prediction = relationship("Prediction", back_populates="article", uselist=False)
    history = relationship("AnalysisHistory", back_populates="article", uselist=False)


class Prediction(Base):
    __tablename__ = "predictions"
    
    id = Column(Integer, primary_key=True, index=True)
    article_id = Column(Integer, ForeignKey("news_articles.id"))
    prediction = Column(String)  # FAKE, REAL, UNCERTAIN
    confidence = Column(Float)
    credibility_score = Column(Float)
    risk_level = Column(String)  # LOW, MEDIUM, HIGH
    model_name = Column(String)
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    article = relationship("NewsArticle", back_populates="prediction")


class AnalysisHistory(Base):
    __tablename__ = "analysis_history"
    
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    article_id = Column(Integer, ForeignKey("news_articles.id"))
    prediction_id = Column(Integer, ForeignKey("predictions.id"))
    summary = Column(String)
    keywords = Column(String) # JSON string
    created_at = Column(DateTime(timezone=True), server_default=func.now())

    user = relationship("User", back_populates="histories")
    article = relationship("NewsArticle", back_populates="history")
    pred_data = relationship("Prediction")
