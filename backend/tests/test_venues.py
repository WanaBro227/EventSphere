def test_public_venues_empty(client):

    response = client.get("/api/venues/")

    assert response.status_code == 200
    assert response.json() == []