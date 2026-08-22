from pydantic_settings import BaseSettings, SettingsConfigDict
import os
from typing import List

# Resolve project root dynamically based on the location of config.py
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

class Settings(BaseSettings):
    PROJECT_NAME: str = "AI Fake News Detector"
    DATABASE_URL: str
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    MODEL_PATH: str = os.path.join(BASE_DIR, "models", "fake_news_model.pkl")
    VECTORIZER_PATH: str = os.path.join(BASE_DIR, "models", "tfidf_vectorizer.pkl")
    FRONTEND_URL: str = ""
    CORS_ORIGINS: str = ""

    model_config = SettingsConfigDict(env_file=os.path.join(BASE_DIR, ".env"), env_file_encoding="utf-8", extra="ignore")

    @property
    def cors_origin_list(self) -> List[str]:
        if self.CORS_ORIGINS:
            return [origin.strip() for origin in self.CORS_ORIGINS.split(",")]
        return []

settings = Settings()
