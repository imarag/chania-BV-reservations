from datetime import datetime, timedelta, timezone

from core.auth_handler import AuthHandler
from dependencies import CurrentUserDep, SessionDep, SettingsDep
from fastapi import APIRouter, Response, Request, status
from models.api_models import LoginResponse, RegisterResponse
from models.db_models import User, UserLogin, UserPublic, UserRegister
from models.auth_models import UserSession
from utils.db_operations import add_user, get_user_by_email, create_session, delete_session
from utils.errors import AppError, raise_app_error


router = APIRouter()


@router.post(
    "/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED,
)
async def register(form_data: UserRegister, session: SessionDep) -> RegisterResponse:

    auth_handler = AuthHandler()

    user_email = form_data.email.strip().lower()
    user_password = form_data.password

    existing_user = get_user_by_email(session, user_email)
    if existing_user:
        raise_app_error(AppError.EMAIL_ALREADY_REGISTERED)

    # Create new user
    new_user = User(
        **form_data.model_dump(),
        hashed_password=auth_handler.generate_password_hash(user_password),
    )

    add_user(session, new_user)

    return {"message": "User registered successfully", "user": new_user.model_dump()}


@router.post("/logout")
def logout(response: Response, settings: SettingsDep, session: SessionDep, request: Request):
    user_session_id = request.cookies.get(settings.SESSION_COOKIE_NAME)
    
    response.delete_cookie(
        settings.SESSION_COOKIE_NAME,
    )
    
    if user_session_id is not None:
        delete_session(session, user_session_id)
        
    return {"message": "Logged out"}


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(
    form_data: UserLogin,
    settings: SettingsDep,
    response: Response,
    session: SessionDep
) -> LoginResponse:
    auth_handler = AuthHandler()

    email = form_data.email.strip().lower()
    user = auth_handler.authenticate_user(email, form_data.password, session)
    
    if not user:
        raise_app_error(AppError.INVALID_CREDENTIALS)

    user = user.model_copy() # keep this: for some reason sqlmodel deletes user after session commit

    ttl_hours = settings.SESSION_LONG_HOURS if form_data.stay_logged_in else settings.SESSION_SHORT_HOURS
    ttl = timedelta(hours=ttl_hours)
    now = datetime.now(timezone.utc)
    expires_at = now + ttl
    
    user_session = UserSession(user_id=user.id, created_at=now, expires_at=expires_at)
    
    new_session = create_session(session, user_session)

    cookie_kwargs = dict(
        key=settings.SESSION_COOKIE_NAME,
        value=new_session.id,
        httponly=True,
        secure=settings.COOKIE_SECURE,
        samesite=settings.COOKIE_SAMESITE,
        path="/",
    )
   
    if form_data.stay_logged_in:
        cookie_kwargs["expires"] = expires_at

    response.set_cookie(**cookie_kwargs)
    
    return {
        "message": "Login successful",
        "user": UserPublic(**user.model_dump()),
        "stay_logged_in": form_data.stay_logged_in
    }



@router.get("/get-access-token")
async def read_access_token(request: Request, settings: SettingsDep) -> str | None:
    access_token = request.cookies.get(settings.SESSION_COOKIE_NAME)
    return access_token


@router.get("/get-current-user")
async def read_current_user(current_user: CurrentUserDep) -> UserPublic | None:
    return current_user


@router.get("/validate-user-admin")
async def validate_user_admin(current_user: CurrentUserDep, settings: SettingsDep):
    if current_user.email not in settings.admins:
        raise_app_error(AppError.NOT_AUTHORIZED)
    return {
        "is_admin": True,
        "message": "User has admin access",
        "user_email": current_user.email,
    }
