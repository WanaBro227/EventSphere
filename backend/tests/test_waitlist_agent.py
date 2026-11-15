from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
import app.models

from app.agents.waitlist_agent import WaitlistAgent
from app.messaging.message import (
    AgentMessagePayload,
    Performative
)


def test_waitlist_agent_refuses_missing_category():

    engine = create_engine("sqlite://")

    Base.metadata.create_all(engine)

    db = sessionmaker(bind=engine)()

    message = AgentMessagePayload(
        sender="Test",
        receiver="WaitlistAgent",
        performative=Performative.REQUEST,
        content={
            "action": "join",
            "user_id": 1,
            "event_id": 1,
            "ticket_category_id": 999,
            "quantity": 1
        }
    )

    result = WaitlistAgent().handle_message(message, db)

    assert result["performative"] == "REFUSE"

    db.close()