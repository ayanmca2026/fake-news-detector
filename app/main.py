from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api.routes import auth, news, dashboard, history
from .config import settings

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="An AI-powered fake news analysis platform designed to help students evaluate online information.",
    version="1.0.0"
)

# CORS configuration
origins = settings.cors_origin_list if settings.cors_origin_list else ["http://localhost:5173", "http://127.0.0.1:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(news.router, prefix="/api/prediction", tags=["prediction"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(history.router, prefix="/api/history", tags=["history"])

@app.get("/api/health", tags=["health"])
def health_check():
    return {"status": "ok", "message": "Fake News Detector API is running"}
