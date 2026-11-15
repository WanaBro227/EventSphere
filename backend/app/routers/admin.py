from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User, Event, Booking, Venue

from .dependencies import require_roles


router = APIRouter(
    prefix="/api/admin",
    tags=["Admin"]
)


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