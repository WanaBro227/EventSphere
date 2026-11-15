from enum import Enum
from uuid import uuid4

from pydantic import BaseModel, Field


class Performative(str, Enum):

    REQUEST = "REQUEST"
    AGREE = "AGREE"
    REFUSE = "REFUSE"
    PROPOSE = "PROPOSE"
    INFORM = "INFORM"
    FAILURE = "FAILURE"


class AgentMessagePayload(BaseModel):

    sender: str

    receiver: str

    performative: Performative

    content: dict = Field(default_factory=dict)

    conversation_id: str = Field(
        default_factory=lambda: str(uuid4())
    )