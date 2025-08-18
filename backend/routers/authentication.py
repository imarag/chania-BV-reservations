from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Depends, Form, HTTPException

from core.config import settings
from dependencies import SessionDep
from models.db_models import User
from models.user_models import UserLogin, UserRegister
from models.token import Token
from utils.auth_tools import (
    authenticate_user,
    create_access_token,
    get_password_hash,
    validate_email,
    validate_name,
    validate_password,
)
from utils.db_operations import add_user, get_user_by_email

router = APIRouter()


@router.post("/register")
async def register(
    form_data: Annotated[UserRegister, Form()], session: SessionDep
) -> dict:
    validate_name_error = validate_name(form_data.name)
    if validate_name_error:
        raise HTTPException(status_code=400, detail=validate_name_error)

    validate_password_error = validate_password(form_data.password)
    if validate_password_error:
        raise HTTPException(status_code=400, detail=validate_password_error)

    validate_email_error = validate_email(form_data.email)
    if validate_email_error:
        raise HTTPException(status_code=400, detail=validate_email_error)
    print("okkkkkkkkkkkk")
    if form_data.password != form_data.password_confirm:
        raise HTTPException(status_code=400, detail="Passwords do not match")

    # Check if user exists
    existing_user = get_user_by_email(session, form_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = User(
        email=form_data.email,
        name=form_data.name,
        hashed_password=get_password_hash(form_data.password),
    )

    add_user(session, new_user)

    return {"message": "User registered successfully", "user_id": new_user.id}


@router.post("/login")
async def login(form_data: Annotated[UserLogin, Form()], session: SessionDep) -> Token:
    user = authenticate_user(session, form_data.email, form_data.password)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect username or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user.id}, expires_delta=access_token_expires
    )
    return Token(access_token=access_token, token_type="bearer")  # noqa: S106
