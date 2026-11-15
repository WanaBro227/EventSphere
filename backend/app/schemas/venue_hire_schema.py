from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field


class VenueHireCreate(BaseModel):
    venue_id: int
    event_title: str = Field(min_length=2, max_length=200)
    purpose: str
    start_datetime: datetime
    end_datetime: datetime
    expected_attendees: int = Field(gt=0)


class VenueHireReview(BaseModel):
    status: str
    admin_notes: str | None = None


class VenueHireOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    user_id: int
    venue_id: int
    event_title: str
    purpose: str
    start_datetime: datetime
    end_datetime: datetime
    expected_attendees: int
    status: str
    admin_notes: str | None
    created_at: datetime