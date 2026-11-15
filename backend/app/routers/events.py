from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Event, Venue

from app.schemas.event_schema import (
    EventCreate,
    EventUpdate,
    EventOut
)

from .dependencies import require_roles


router = APIRouter(
    prefix="/api/events",
    tags=["Events"]
)


@router.get("/", response_model=list[EventOut])
def list_events(db: Session = Depends(get_db)):

    return db.query(Event).filter(
        Event.status == "published"
    ).order_by(Event.start_datetime).all()


@router.get("/{event_id}", response_model=EventOut)
def get_event(
    event_id: int,
    db: Session = Depends(get_db)
):

    event = db.get(Event, event_id)

    if not event:
        raise HTTPException(404, "Event not found")

    return event


@router.post("/", response_model=EventOut, status_code=201)
def create_event(
    data: EventCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):

    if not db.get(Venue, data.venue_id):
        raise HTTPException(404, "Venue not found")

    event = Event(
        **data.model_dump(),
        organizer_id=user.id,
        status="draft"
    )

    db.add(event)
    db.commit()
    db.refresh(event)

    return event


@router.patch("/{event_id}", response_model=EventOut)
def update_event(
    event_id: int,
    data: EventUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):

    event = db.get(Event, event_id)

    if not event:
        raise HTTPException(404, "Event not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(event, key, value)

    db.commit()
    db.refresh(event)

    return event


@router.post("/{event_id}/publish", response_model=EventOut)
def publish_event(
    event_id: int,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):

    event = db.get(Event, event_id)

    if not event:
        raise HTTPException(404, "Event not found")

    event.status = "published"

    db.commit()
    db.refresh(event)

    return event