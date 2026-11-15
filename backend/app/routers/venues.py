from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Venue

from app.schemas.venue_schema import (
    VenueCreate,
    VenueUpdate,
    VenueOut
)

from .dependencies import require_roles


router = APIRouter(
    prefix="/api/venues",
    tags=["Venues"]
)


@router.get("/", response_model=list[VenueOut])
def list_venues(db: Session = Depends(get_db)):

    return db.query(Venue).filter(
        Venue.is_active.is_(True)
    ).all()


@router.get("/{venue_id}", response_model=VenueOut)
def get_venue(
    venue_id: int,
    db: Session = Depends(get_db)
):

    venue = db.get(Venue, venue_id)

    if not venue:
        raise HTTPException(404, "Venue not found")

    return venue


@router.post("/", response_model=VenueOut, status_code=201)
def create_venue(
    data: VenueCreate,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):

    venue = Venue(**data.model_dump())

    db.add(venue)
    db.commit()
    db.refresh(venue)

    return venue


@router.patch("/{venue_id}", response_model=VenueOut)
def update_venue(
    venue_id: int,
    data: VenueUpdate,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):

    venue = db.get(Venue, venue_id)

    if not venue:
        raise HTTPException(404, "Venue not found")

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(venue, key, value)

    db.commit()
    db.refresh(venue)

    return venue