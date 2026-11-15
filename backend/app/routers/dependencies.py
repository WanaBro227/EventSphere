from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from sqlalchemy.orm import Session

from app.config import settings
from app.database import get_db
from app.models import User


oauth2_scheme = OAuth2PasswordBearer(
    tokenUrl="/api/auth/login"
)


def get_current_user(
    token: str = Depends(oauth2_scheme),
    db: Session = Depends(get_db)
):

    credentials_error = HTTPException(
        status_code=401,
        detail="Invalid authentication credentials",
        headers={"WWW-Authenticate": "Bearer"}
    )

    try:

        payload = jwt.decode(
            token,
            settings.SECRET_KEY,
            algorithms=[settings.ALGORITHM]
        )

        user_id = int(payload.get("sub"))

    except (JWTError, TypeError, ValueError):

        raise credentials_error

    user = db.query(User).filter(
        User.id == user_id,
        User.is_active.is_(True)
    ).first()

    if not user:
        raise credentials_error

    return user


def require_roles(*roles):

    def checker(user=Depends(get_current_user)):

        if user.role not in roles:

            raise HTTPException(
                status_code=403,
                detail="Insufficient permissions"
            )

        return user

    return checker