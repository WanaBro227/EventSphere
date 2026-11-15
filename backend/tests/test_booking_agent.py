from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
import app.models

from app.agents.booking_agent import BookingAgent
from app.messaging.message import (
    AgentMessagePayload,
    Performative
)


def test_booking_agent_refuses_missing_event():

    engine = create_engine("sqlite://")

    Base.metadata.create_all(engine)

    db = sessionmaker(bind=engine)()

    message = AgentMessagePayload(
        sender="Test",
        receiver="BookingAgent",
        performative=Performative.REQUEST,
        content={
            "user_id": 1,
            "event_id": 999,
            "ticket_category_id": 999,
            "quantity": 1
        }
    )

    result = BookingAgent().handle_message(message, db)

    assert result["performative"] == "REFUSE"

    db.close()