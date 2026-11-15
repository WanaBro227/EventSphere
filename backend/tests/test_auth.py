
from uuid import uuid4


def test_register_and_login(client):
    # Generate a unique email for each test run
    email = f"test_{uuid4().hex}@example.com"

    # Register a new user
    response = client.post(
        "/api/auth/register",
        json={
            "full_name": "Test User",
            "email": email,
            "password": "StrongPass123"
        }
    )

    assert response.status_code == 201, (
        f"Registration failed: {response.status_code} - {response.text}"
    )
    assert response.json()["access_token"]

    # Login using the registered user's credentials
    login = client.post(
        "/api/auth/login",
        json={
            "email": email,
            "password": "StrongPass123"
        }
    )

    assert login.status_code == 200
    assert login.json()["access_token"]
