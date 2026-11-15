
from datetime import datetime, timezone

from sqlalchemy import DateTime, JSON, String, Text
from sqlalchemy.orm import Mapped, mapped_column

from app.database import Base


class AgentMessage(Base):
    __tablename__ = "agent_messages"

    id: Mapped[int] = mapped_column(
        primary_key=True, index=True
    )

    sender: Mapped[str] = mapped_column(
        String(100), nullable=False
    )

    receiver: Mapped[str] = mapped_column(
        String(100), nullable=False
    )

    performative: Mapped[str] = mapped_column(
        String(30), nullable=False
    )

    content: Mapped[dict] = mapped_column(
        JSON, nullable=False
    )

    conversation_id: Mapped[str] = mapped_column(
        String(100), index=True, nullable=False
    )

    status: Mapped[str] = mapped_column(
        String(20), default="sent", nullable=False
    )

    error_message: Mapped[str | None] = mapped_column(
        Text, nullable=True
    )

    created_at: Mapped[datetime] = mapped_column(
        DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        nullable=False
    )

    def __repr__(self):
        return (
            f"<AgentMessage(id={self.id}, "
            f"sender='{self.sender}', receiver='{self.receiver}')>"
        )
