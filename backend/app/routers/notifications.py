from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Notification

from app.schemas.notification_schema import NotificationOut

from .dependencies import get_current_user


router = APIRouter(
    prefix="/api/notifications",
    tags=["Notifications"]
)


@router.get("/me", response_model=list[NotificationOut])
def my_notifications(
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    return db.query(Notification).filter(
        Notification.user_id == user.id
    ).order_by(Notification.created_at.desc()).all()


@router.patch("/{notification_id}/read")
def mark_read(
    notification_id: int,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    notification = db.query(Notification).filter(
        Notification.id == notification_id,
        Notification.user_id == user.id
    ).first()

    if not notification:
        raise HTTPException(404, "Notification not found")

    notification.is_read = True

    db.commit()

    return {"success": True}