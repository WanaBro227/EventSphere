from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Venue, VenueHire

from app.schemas.venue_hire_schema import (
    VenueHireCreate,
    VenueHireReview,
    VenueHireOut
)

from .dependencies import (
    get_current_user,
    require_roles
)


router = APIRouter(
    prefix="/api/venue-hire",
    tags=["Venue Hire"]
)


@router.post("/", response_model=VenueHireOut, status_code=201)
def request_hire(
    data: VenueHireCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    venue = db.get(Venue, data.venue_id)

    if not venue or not venue.is_active:
        raise HTTPException(404, "Venue not available")

    if data.end_datetime <= data.start_datetime:
        raise HTTPException(422, "Invalid date range")

    if data.expected_attendees > venue.capacity:
        raise HTTPException(422, "Expected attendees exceed venue capacity")

    request = VenueHire(
        **data.model_dump(),
        user_id=user.id
    )

    db.add(request)
    db.commit()
    db.refresh(request)

    return request


@router.get("/me", response_model=list[VenueHireOut])
def my_requests(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    return db.query(VenueHire).filter(
        VenueHire.user_id == user.id
    ).all()


@router.get("/", response_model=list[VenueHireOut])
def all_requests(
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin"))
):

    return db.query(VenueHire).order_by(
        VenueHire.created_at.desc()
    ).all()


@router.patch("/{request_id}", response_model=VenueHireOut)
def review_request(
    request_id: int,
    data: VenueHireReview,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin"))
):

    if data.status not in {"approved", "rejected"}:
        raise HTTPException(422, "Invalid status")

    request = db.get(VenueHire, request_id)

    if not request:
        raise HTTPException(404, "Request not found")

    request.status = data.status
    request.admin_notes = data.admin_notes

    db.commit()
    db.refresh(request)

    return request