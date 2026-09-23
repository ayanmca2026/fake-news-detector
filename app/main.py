from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from .database import engine, Base
from .api.routes import auth, news, dashboard, history, model_info
from .config import settings

# Create DB tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title=settings.PROJECT_NAME,
    description="TruthLens AI — AI-powered misinformation intelligence platform.",
    version="1.0.0"
)

# CORS configuration: Allow localhost, explicit domains, and any *.vercel.app deployment
origins = settings.cors_origin_list if settings.cors_origin_list else ["http://localhost:5173", "http://127.0.0.1:5173"]
origins.extend(["https://fake-news-detector-ayan007.vercel.app", "https://fake-news-detector-smoky-nine.vercel.app"])
origins = list(set(origins))

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_origin_regex=r"https://.*\.vercel\.app",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
app.include_router(news.router, prefix="/api/prediction", tags=["prediction"])
app.include_router(dashboard.router, prefix="/api/dashboard", tags=["dashboard"])
app.include_router(history.router, prefix="/api/history", tags=["history"])
app.include_router(model_info.router, prefix="/api/model", tags=["model"])

@app.get("/", tags=["health"])
@app.get("/health", tags=["health"])
@app.get("/api/health", tags=["health"])
def health_check():
    return {
        "status": "ok", 
        "message": "TruthLens AI — Fake News Detector API is running",
        "api_docs": "/docs"
    }

@app.exception_handler(404)
async def custom_404_handler(request: Request, exc):
    return JSONResponse(
        status_code=404,
        content={"detail": "Requested API endpoint not found", "path": str(request.url.path)}
    )
