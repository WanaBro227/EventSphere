from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Ticket

from app.schemas.ticket_schema import (
    TicketOut,
    CheckInRequest
)

from .dependencies import (
    get_current_user,
    require_roles
)


router = APIRouter(
    prefix="/api/tickets",
    tags=["Tickets"]
)


@router.get("/me", response_model=list[TicketOut])
def my_tickets(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    return db.query(Ticket).filter(
        Ticket.user_id == user.id
    ).all()


@router.post("/check-in")
def check_in(
    data: CheckInRequest,
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):

    ticket = db.query(Ticket).filter(
        Ticket.ticket_code == data.ticket_code
    ).with_for_update().first()

    if not ticket:
        raise HTTPException(404, "Ticket not found")

    if ticket.status != "valid":
        raise HTTPException(
            409,
            "Ticket is invalid or already checked in"
        )

    ticket.status = "checked_in"
    ticket.checked_in_at = datetime.now(timezone.utc)

    db.commit()

    return {
        "success": True,
        "message": "Check-in successful",
        "ticket_code": ticket.ticket_code
    }