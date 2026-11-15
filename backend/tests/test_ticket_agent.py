from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
import app.models

from app.agents.ticket_agent import TicketAgent
from app.messaging.message import (
    AgentMessagePayload,
    Performative
)


def test_ticket_agent_refuses_missing_booking():

    engine = create_engine("sqlite://")

    Base.metadata.create_all(engine)

    db = sessionmaker(bind=engine)()

    message = AgentMessagePayload(
        sender="Test",
        receiver="TicketAgent",
        performative=Performative.REQUEST,
        content={
            "booking_id": 999
        }
    )

    result = TicketAgent().handle_message(message, db)

    assert result["performative"] == "REFUSE"

    db.close()