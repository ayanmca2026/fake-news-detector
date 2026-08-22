from fastapi.testclient import TestClient
from app.main import app

client = TestClient(app)

def test_prediction_no_auth():
    response = client.post("/api/prediction/analyze", json={"title": "Test", "content": "This is a test."})
    assert response.status_code == 401

def test_prediction_with_auth():
    # Login first
    login_response = client.post(
        "/api/auth/login",
        data={"username": "test@example.com", "password": "password123"}
    )
    if login_response.status_code == 200:
        token = login_response.json()["access_token"]
        headers = {"Authorization": f"Bearer {token}"}
        
        # Analyze
        response = client.post(
            "/api/prediction/analyze", 
            json={"title": "Breaking News", "content": "This is a completely normal and very factual news article about something that happened today."},
            headers=headers
        )
        assert response.status_code == 200
        data = response.json()
        assert "prediction" in data
        assert "confidence" in data
        assert "credibility_score" in data
