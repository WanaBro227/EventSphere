from datetime import datetime
from pydantic import BaseModel, ConfigDict, Field, model_validator


class EventCreate(BaseModel):
    title: str = Field(min_length=2, max_length=200)
    description: str | None = None
    venue_id: int
    start_datetime: datetime
    end_datetime: datetime
    image_url: str | None = None

    @model_validator(mode="after")
    def validate_dates(self):
        if self.end_datetime <= self.start_datetime:
            raise ValueError("Event end must be after event start")
        return self


class EventUpdate(BaseModel):
    title: str | None = None
    description: str | None = None
    venue_id: int | None = None
    start_datetime: datetime | None = None
    end_datetime: datetime | None = None
    status: str | None = None
    image_url: str | None = None


class EventOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    title: str
    description: str | None
    venue_id: int
    organizer_id: int | None
    start_datetime: datetime
    end_datetime: datetime
    status: str
    image_url: str | None
    created_at: datetime