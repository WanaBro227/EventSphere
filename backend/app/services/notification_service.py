from datetime import datetime, timezone

from sqlalchemy.orm import Session

from app.models import Notification


def create_notification(
    db: Session,
    user_id: int,
    title: str,
    message: str,
    notification_type: str = "general",
    channel: str = "in_app"
):

    notification = Notification(
        user_id=user_id,
        title=title,
        message=message,
        notification_type=notification_type,
        channel=channel,
        sent_at=datetime.now(timezone.utc)
    )

    db.add(notification)
    db.commit()
    db.refresh(notification)

    return notification