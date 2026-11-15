from decimal import Decimal
from pydantic import BaseModel, ConfigDict, Field


class TicketCategoryCreate(BaseModel):
    event_id: int
    name: str = Field(min_length=1, max_length=100)
    description: str | None = None
    price: Decimal = Field(ge=0)
    quantity: int = Field(gt=0)


class TicketCategoryOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    event_id: int
    name: str
    description: str | None
    price: Decimal
    quantity: int
    sold_count: int
    is_active: bool