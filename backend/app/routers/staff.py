from fastapi import APIRouter, Depends

from .dependencies import require_roles


router = APIRouter(
    prefix="/api/staff",
    tags=["Staff"]
)


@router.get("/dashboard")
def staff_dashboard(
    user=Depends(require_roles("admin", "staff"))
):

    return {
        "message": "Staff dashboard",
        "staff_user": user.full_name
    }