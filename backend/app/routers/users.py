from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import User

from app.schemas.user_schema import (
    UserOut,
    UserUpdate
)

from .dependencies import (
    get_current_user,
    require_roles
)


router = APIRouter(
    prefix="/api/users",
    tags=["Users"]
)


@router.get("/me", response_model=UserOut)
def my_profile(
    user=Depends(get_current_user)
):
    return user


@router.get("/", response_model=list[UserOut])
def list_users(
    db: Session = Depends(get_db),
    user=Depends(require_roles("admin"))
):
    return db.query(User).order_by(User.id.desc()).all()


@router.patch("/me", response_model=UserOut)
def update_profile(
    data: UserUpdate,
    db: Session = Depends(get_db),
    user=Depends(get_current_user)
):

    for key, value in data.model_dump(exclude_unset=True).items():
        setattr(user, key, value)

    db.commit()
    db.refresh(user)

    return user