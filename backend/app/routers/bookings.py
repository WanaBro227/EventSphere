from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Booking

from app.messaging import (
    AgentMessagePayload,
    Performative,
    message_bus
)

from app.schemas.booking_schema import (
    BookingCreate,
    BookingOut
)

from app.services.payment_service import simulate_payment

from .dependencies import get_current_user


router = APIRouter(
    prefix="/api/bookings",
    tags=["Bookings"]
)


@router.post("/", status_code=201)
def create_booking(
    data: BookingCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    message = AgentMessagePayload(
        sender="BookingRouter",
        receiver="BookingAgent",
        performative=Performative.REQUEST,
        content={
            "user_id": user.id,
            "event_id": data.event_id,
            "ticket_category_id": data.ticket_category_id,
            "quantity": data.quantity
        }
    )

    result = message_bus.send(message, db)

    if result["performative"] != "AGREE":

        raise HTTPException(
            status_code=409,
            detail=result["content"].get("reason")
        )

    booking = db.get(
        Booking,
        result["content"]["booking_id"]
    )

    payment = simulate_payment(booking.total_amount)

    booking.payment_status = "completed"
    booking.payment_reference = payment["reference"]

    db.commit()
    db.refresh(booking)

    ticket_message = AgentMessagePayload(
        sender="BookingRouter",
        receiver="TicketAgent",
        performative=Performative.REQUEST,
        content={
            "booking_id": booking.id
        },
        conversation_id=message.conversation_id
    )

    ticket_result = message_bus.send(
        ticket_message,
        db
    )

    if ticket_result["performative"] != "INFORM":
        raise HTTPException(
            status_code=500,
            detail="Payment completed, but ticket generation failed. Contact support."
        )

    return {
        "booking": BookingOut.model_validate(booking),
        "tickets": ticket_result["content"]["ticket_codes"],
        "payment": payment
    }


@router.get("/me", response_model=list[BookingOut])
def my_bookings(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    return db.query(Booking).filter(
        Booking.user_id == user.id
    ).order_by(Booking.id.desc()).all()