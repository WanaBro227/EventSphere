from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import AgentMessage

from .dependencies import require_roles


router = APIRouter(
    prefix="/api/agent-logs",
    tags=["Agent Communication"]
)


@router.get("/")
def get_agent_logs(
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin", "staff"))
):

    return db.query(AgentMessage).order_by(
        AgentMessage.created_at.desc()
    ).limit(200).all()