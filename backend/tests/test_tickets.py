def test_ticket_list_requires_authentication(client):

    response = client.get("/api/tickets/me")

    assert response.status_code == 401