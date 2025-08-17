from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Form, HTTPException

from core.config import settings
from models.token import Token
from models.user_models import UserInDB
from utils.auth_tools import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    validate_email,
    validate_password,
)

router = APIRouter()


@router.post("/register")
async def register(
    email: Annotated[str, Form()],
    password: Annotated[str, Form()],
    password_confirm: Annotated[str, Form()],
) -> dict:
    # validate_password_error = validate_password(password)
    # if validate_password_error:
    #     raise HTTPException(status_code=400, detail=validate_password_error)

    # validate_email_error = validate_email(email)
    # if validate_email_error:
    #     raise HTTPException(status_code=400, detail=validate_email_error)

    # if password != password_confirm:
    #     raise HTTPException(status_code=400, detail="Passwords do not match")

    # new_user = UserInDB(
    #     id=generate_user_id(), email=email, hashed_password=get_password_hash(password)
    # )

    # existing_user = get_user_by_email(email)
    # if existing_user:
    #     raise HTTPException(status_code=400, detail="Email already registered")

    # add_user(new_user)
    return {"message": "User registered successfully"}


@router.post("/login")
async def login(
    email: Annotated[str, Form()], password: Annotated[str, Form()]
) -> Token:
    return {"message": "User registered successfully"}

    # user = authenticate_user(email, password)
    # if not user:
    #     raise HTTPException(
    #         status_code=401,
    #         detail="Incorrect username or password",
    #         headers={"WWW-Authenticate": "Bearer"},
    #     )
    # access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    # access_token = create_access_token(
    #     data={"sub": user.id}, expires_delta=access_token_expires
    # )
    # return Token(access_token=access_token, token_type="bearer")  # noqa: S106
