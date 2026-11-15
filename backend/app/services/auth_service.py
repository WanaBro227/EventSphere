from sqlalchemy.orm import Session

from app.models import User

from app.services.security_service import (
    hash_password,
    verify_password
)


def register_user(
    db: Session,
    full_name: str,
    email: str,
    password: str
):

    existing_user = db.query(User).filter(
        User.email == email.lower()
    ).first()

    if existing_user:
        raise ValueError("Email already registered")

    user = User(
        full_name=full_name,
        email=email.lower(),
        hashed_password=hash_password(password),
        role="attendee"
    )

    db.add(user)
    db.commit()
    db.refresh(user)

    return user


def authenticate_user(
    db: Session,
    email: str,
    password: str
):

    user = db.query(User).filter(
        User.email == email.lower()
    ).first()

    if not user:
        return None

    if not user.is_active:
        return None

    if not verify_password(password, user.hashed_password):
        return None

    return user