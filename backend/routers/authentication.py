from datetime import timedelta
from typing import Annotated

from fastapi import APIRouter, Form, HTTPException
from core.auth_handler import AuthHandler
from models.token import Token
from dependencies import SessionDep, SettingsDep, CurrentUserDep
from models.api_models import LoginResponse, RegisterResponse
from models.db_models import User, UserLogin, UserPublic, UserRegister
from utils.db_operations import add_user, get_user_by_email

router = APIRouter()

@router.post("/register")
async def register(
    form_data: UserRegister, session: SessionDep
) -> RegisterResponse:
 
    auth_handler = AuthHandler()
    validation_error = auth_handler.validate_registration_data(form_data, session)

    if validation_error:
        raise HTTPException(status_code=400, detail=validation_error)

    # Check if user exists
    existing_user = get_user_by_email(session, form_data.email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = User(
        **form_data.model_dump(),
        hashed_password=auth_handler.generate_password_hash(form_data.password),
    )

    add_user(session, new_user)

    return RegisterResponse(
        message="User registered successfully", 
        user=UserPublic(**new_user.model_dump())
    )


@router.post("/login")
async def login(
    form_data: UserLogin, session: SessionDep, settings: SettingsDep
) -> LoginResponse:

    auth_handler = AuthHandler()
    user = auth_handler.authenticate_user(form_data, session)
    if not user:
        raise HTTPException(
            status_code=401,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_handler.create_access_token(
        data={"user_id": user.id}, expires_delta=access_token_expires
    )
    return LoginResponse(
        message="Login successful",
        token=Token(
            access_token=access_token,
            token_type="bearer",  # noqa: S106
        )
    )



@router.get("/get-current-user", response_model=UserPublic)
async def read_current_user(
    current_user: CurrentUserDep
) -> UserPublic:
    return current_user