from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class WaitlistCreate(BaseModel):
    event_id: int
    ticket_category_id: int
    quantity: int = Field(default=1, ge=1, le=10)


class WaitlistOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    event_id: int
    ticket_category_id: int
    quantity: int
    position: int
    status: str
    offer_expires_at: datetime | None
    created_at: datetime