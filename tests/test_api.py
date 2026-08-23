from fastapi.testclient import TestClient
from app.main import app
from app.database import Base, engine

# Create tables in test db
Base.metadata.create_all(bind=engine)

client = TestClient(app)

def test_health_check():
    response = client.get("/api/health")
    assert response.status_code == 200
    assert response.json() == {"status": "ok", "message": "Fake News Detector API is running"}

def test_register_and_login():
    # Register
    register_response = client.post(
        "/api/auth/register",
        json={"name": "Test User", "email": "test@example.com", "password": "password123"}
    )
    assert register_response.status_code in (200, 400) # 400 if already exists
    
    # Login
    login_response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "password123"}
    )
    assert login_response.status_code == 200
    assert "access_token" in login_response.json()

def test_model_info():
    response = client.get("/api/model/info")
    assert response.status_code == 200
    data = response.json()
    assert "model_name" in data
    assert "accuracy" in data["metrics"]
    assert "dataset" in data
