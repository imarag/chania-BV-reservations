from datetime import timedelta

from dependencies import AuthHandlerDep, CurrentUserDep, SessionDep, SettingsDep
from fastapi import APIRouter, Response, Request, status
from models.api_models import LoginResponse, RegisterResponse
from models.db_models import User, UserLogin, UserPublic, UserRegister
from models.auth_models import UserSession
from utils.db_operations import (
    add_user,
    get_user_by_email,
    create_session,
    delete_session,
    get_reservation_by_user_id_date,
    get_user_by_id,
    get_user_session_by_id,
)
from utils.errors import AppError, raise_app_error
from utils.util_functions import get_naive_utc_date_now, get_naive_utc_datetime_now

router = APIRouter()


@router.post(
    "/register",
    response_model=RegisterResponse,
    status_code=status.HTTP_201_CREATED,
)
async def register(
    user_register_info: UserRegister, session: SessionDep, auth_handler: AuthHandlerDep
) -> RegisterResponse:
    user_email = user_register_info.email.strip().lower()
    user_password = user_register_info.password

    existing_user = get_user_by_email(session, user_email)
    if existing_user:
        raise_app_error(AppError.EMAIL_ALREADY_REGISTERED)

    # Create new user
    new_user = User(
        **user_register_info.model_dump(),
        hashed_password=auth_handler.generate_password_hash(user_password),
    )

    add_user(session, new_user)

    return RegisterResponse(
        message="User registered succesfully", user=UserPublic(**new_user.model_dump())
    )


@router.post("/logout")
def logout(
    response: Response, settings: SettingsDep, session: SessionDep, request: Request
):
    user_session_id = request.cookies.get(settings.SESSION_COOKIE_NAME)
    response.delete_cookie(
        settings.SESSION_COOKIE_NAME,
    )

    if user_session_id is not None:
        delete_session(session, user_session_id)

    return {"message": "Logged out"}


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(
    user_login_info: UserLogin,
    settings: SettingsDep,
    response: Response,
    session: SessionDep,
    auth_handler: AuthHandlerDep,
) -> LoginResponse:

    user = auth_handler.authenticate_user(
        user_login_info.email, user_login_info.password, session
    )

    if not user:
        raise_app_error(AppError.INVALID_CREDENTIALS)

    user = (
        user.model_copy()
    )  # keep this: for some reason sqlmodel deletes user after session commit

    # create expire date of the session cookie
    ttl_hours = (
        settings.SESSION_LONG_HOURS
        if user_login_info.stay_logged_in
        else settings.SESSION_SHORT_HOURS
    )
    ttl_delta = timedelta(hours=ttl_hours)
    datetime_now = get_naive_utc_datetime_now()
    expires_at = datetime_now + ttl_delta
    user_session = UserSession(
        user_id=user.id, created_at=datetime_now, expires_at=expires_at
    )
    new_session = create_session(session, user_session)

    # set the session cookie
    cookie_kwargs = dict(
        key=settings.SESSION_COOKIE_NAME,
        value=str(new_session.id),
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )

    if user_login_info.stay_logged_in:
        cookie_kwargs["expires"] = expires_at  # type: ignore

    response.set_cookie(**cookie_kwargs)  # type: ignore

    return LoginResponse(
        message="Login succesful",
        user=UserPublic(**user.model_dump()),
        stay_logged_in=user_login_info.stay_logged_in,
    )


@router.get("/get-access-token")
async def read_access_token(request: Request, settings: SettingsDep) -> str | None:
    access_token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    return access_token


@router.get("/get-current-user")
async def get_current_user(current_user: CurrentUserDep) -> UserPublic | None:
    return current_user


@router.get("/validate-user-admin")
async def validate_user_admin(
    current_user: CurrentUserDep, settings: SettingsDep
) -> dict:
    if current_user.email not in settings.admins:
        raise_app_error(AppError.NOT_AUTHORIZED)
    return {
        "is_admin": True,
        "message": "User has admin access",
        "user_email": current_user.email,
    }


@router.get("/validate-user-create-reservation")
def validate_user_create_reservation(
    current_user: CurrentUserDep,
    settings: SettingsDep,
    session: SessionDep,
    request: Request,
):
    user_session_id = request.cookies.get(settings.SESSION_COOKIE_NAME)

    if not user_session_id:
        raise_app_error(AppError.MISSING_SESSION)

    user_session = get_user_session_by_id(session, user_session_id)
    if not user_session:
        raise_app_error(AppError.NOT_AUTHORIZED)

    user = get_user_by_id(session, user_session.user_id)

    if not user:
        raise_app_error(AppError.NOT_AUTHORIZED)

    date_now = get_naive_utc_date_now()
    existing_reservation = get_reservation_by_user_id_date(session, user.id, date_now)

    # if user has already made a reservation
    if existing_reservation:
        raise_app_error(
            AppError.RESERVATION_NOT_ALLOWED,
            detail="User has already made a reservation",
        )

    # if user is not active
    if not user.active:
        raise_app_error(AppError.RESERVATION_NOT_ALLOWED, detail="User is not active")

    return {
        "user": UserPublic(**user.model_dump()),
        "message": "User can make a reservation",
    }
