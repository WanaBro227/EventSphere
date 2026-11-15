from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class VenueCreate(BaseModel):
    name: str = Field(min_length=2, max_length=150)
    description: str | None = None
    address: str
    city: str
    capacity: int = Field(gt=0)
    image_url: str | None = None


class VenueUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    address: str | None = None
    city: str | None = None
    capacity: int | None = Field(default=None, gt=0)
    image_url: str | None = None
    is_active: bool | None = None


class VenueOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    name: str
    description: str | None
    address: str
    city: str
    capacity: int
    image_url: str | None
    is_active: bool
    created_at: datetime