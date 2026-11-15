
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Event, Booking, Venue

from .dependencies import require_roles


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


# =========================================================
# ADMIN DASHBOARD SUMMARY
# =========================================================

@router.get("/summary")
def admin_summary(
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin"))
):
    return {
        "users": db.query(User).count(),
        "venues": db.query(Venue).count(),
        "events": db.query(Event).count(),
        "bookings": db.query(Booking).count()
    }


# =========================================================
# ADMIN BOOKING MANAGEMENT
# =========================================================

@router.get("/bookings")
def admin_get_all_bookings(
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin"))
):
    """
    Retrieve all platform bookings.

    Only authenticated administrators can access this endpoint.
    """

    bookings = (
        db.query(Booking)
        .order_by(Booking.created_at.desc())
        .all()
    )

    return [
        {
            "id": booking.id,
            "booking_reference": booking.booking_reference,
            "user_id": booking.user_id,
            "event_id": booking.event_id,
            "ticket_category_id": booking.ticket_category_id,
            "quantity": booking.quantity,
            "total_amount": str(booking.total_amount),
            "status": booking.status,
            "payment_status": booking.payment_status,
            "payment_reference": booking.payment_reference,
            "created_at": (
                booking.created_at.isoformat()
                if booking.created_at
                else None
            ),
            "updated_at": (
                booking.updated_at.isoformat()
                if booking.updated_at
                else None
            )
        }
        for booking in bookings
    ]
