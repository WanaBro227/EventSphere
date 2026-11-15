def test_public_events_empty(client):

    response = client.get("/api/events/")

    assert response.status_code == 200
    assert response.json() == []