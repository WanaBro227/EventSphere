from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db

from app.schemas.auth_schema import (
    RegisterRequest,
    LoginRequest,
    TokenResponse
)

from app.services.auth_service import (
    register_user,
    authenticate_user
)

from app.services.security_service import create_access_token


router = APIRouter(
    prefix="/api/auth",
    tags=["Authentication"]
)


@router.post("/register", response_model=TokenResponse, status_code=201)
def register(
    data: RegisterRequest,
    db: Session = Depends(get_db)
):

    try:

        user = register_user(
            db,
            data.full_name,
            str(data.email),
            data.password
        )

    except ValueError as error:

        raise HTTPException(
            status_code=409,
            detail=str(error)
        )

    token = create_access_token(
        str(user.id),
        user.role
    )

    return {
        "access_token": token,
        "user": user
    }


@router.post("/login", response_model=TokenResponse)
def login(
    data: LoginRequest,
    db: Session = Depends(get_db)
):

    user = authenticate_user(
        db,
        str(data.email),
        data.password
    )

    if not user:

        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password"
        )

    token = create_access_token(
        str(user.id),
        user.role
    )

    return {
        "access_token": token,
        "user": user
    }