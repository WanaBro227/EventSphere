from datetime import datetime
from pydantic import BaseModel, ConfigDict


class AgentMessageCreate(BaseModel):
    sender: str
    receiver: str
    performative: str
    content: dict
    conversation_id: str


class AgentMessageOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    sender: str
    receiver: str
    performative: str
    content: dict
    conversation_id: str
    status: str
    error_message: str | None
    created_at: datetime