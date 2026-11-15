from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Waitlist

from app.messaging import (
    AgentMessagePayload,
    Performative,
    message_bus
)

from app.schemas.waitlist_schema import (
    WaitlistCreate,
    WaitlistOut
)

from .dependencies import get_current_user


router = APIRouter(
    prefix="/api/waitlist",
    tags=["Waitlist"]
)


@router.post("/", status_code=201)
def join_waitlist(
    data: WaitlistCreate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    message = AgentMessagePayload(
        sender="WaitlistRouter",
        receiver="WaitlistAgent",
        performative=Performative.REQUEST,
        content={
            "action": "join",
            "user_id": user.id,
            "event_id": data.event_id,
            "ticket_category_id": data.ticket_category_id,
            "quantity": data.quantity
        }
    )

    result = message_bus.send(message, db)

    if result["performative"] != "AGREE":
        raise HTTPException(400, result["content"])

    return result["content"]


@router.get("/me", response_model=list[WaitlistOut])
def my_waitlist(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    return db.query(Waitlist).filter(
        Waitlist.user_id == user.id
    ).all()