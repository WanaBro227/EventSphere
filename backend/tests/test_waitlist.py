def test_waitlist_requires_authentication(client):

    response = client.post(
        "/api/waitlist/",
        json={
            "event_id": 1,
            "ticket_category_id": 1,
            "quantity": 1
        }
    )

    assert response.status_code == 401