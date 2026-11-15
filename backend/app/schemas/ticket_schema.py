from datetime import datetime
from pydantic import BaseModel, ConfigDict


class TicketOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    ticket_code: str
    booking_id: int
    user_id: int
    event_id: int
    ticket_category_id: int
    qr_code_path: str | None
    status: str
    checked_in_at: datetime | None
    created_at: datetime


class CheckInRequest(BaseModel):
    ticket_code: str