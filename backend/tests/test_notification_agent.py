from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker

from app.database import Base
import app.models

from app.agents.notification_agent import NotificationAgent
from app.messaging.message import (
    AgentMessagePayload,
    Performative
)


def test_notification_agent_refuses_non_request():

    engine = create_engine("sqlite://")

    Base.metadata.create_all(engine)

    db = sessionmaker(bind=engine)()

    message = AgentMessagePayload(
        sender="Test",
        receiver="NotificationAgent",
        performative=Performative.INFORM,
        content={}
    )

    result = NotificationAgent().handle_message(message, db)

    assert result["performative"] == "REFUSE"

    db.close()