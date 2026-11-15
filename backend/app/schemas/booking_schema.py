from datetime import datetime
from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class BookingCreate(BaseModel):
    event_id: int
    ticket_category_id: int
    quantity: int = Field(ge=1, le=10)


class BookingOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    booking_reference: str
    user_id: int
    event_id: int
    ticket_category_id: int
    quantity: int
    total_amount: Decimal
    status: str
    payment_status: str
    created_at: datetime