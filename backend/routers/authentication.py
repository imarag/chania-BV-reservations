from datetime import timedelta

from core.auth_handler import AuthHandler
from dependencies import CurrentUserDep, SessionDep, SettingsDep
from fastapi import APIRouter, HTTPException, Response, Request, status
from models.api_models import LoginResponse, RegisterResponse
from models.db_models import User, UserLogin, UserPublic, UserRegister
from utils.db_operations import add_user, get_user_by_email, get_user_by_id

router = APIRouter()


@router.post(
    "/register", response_model=RegisterResponse, status_code=status.HTTP_201_CREATED
)
async def register(form_data: UserRegister, session: SessionDep) -> RegisterResponse:

    auth_handler = AuthHandler()

    user_email = form_data.email.strip().lower()
    user_password = form_data.password

    existing_user = get_user_by_email(session, user_email)
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Create new user
    new_user = User(
        **form_data.model_dump(),
        hashed_password=auth_handler.generate_password_hash(user_password),
    )

    add_user(session, new_user)

    return {"message": "User registered successfully", "user": new_user.model_dump()}


@router.post("/logout")
def logout(response: Response, settings: SettingsDep):
    response.delete_cookie(
        settings.REFRESH_COOKIE_NAME,
    )
    return {"message": "Logged out"}


@router.post("/login", response_model=LoginResponse, status_code=status.HTTP_200_OK)
async def login(
    form_data: UserLogin,
    session: SessionDep,
    settings: SettingsDep,
    response: Response,
) -> LoginResponse:
    auth_handler = AuthHandler()

    user_email = form_data.email.strip().lower()
    user_password = form_data.password

    current_user = auth_handler.authenticate_user(user_email, user_password, session)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
        )

    # create access token (short-lived, in memory in frontend, returned in JSON)
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = auth_handler.create_access_token(
        data={"user_id": current_user.id}, expires_delta=access_token_expires
    )

    # create refresh token (long-lived, stored as HttpOnly cookie)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    refresh_token = auth_handler.create_refresh_token(
        data={"user_id": current_user.id}, expires_delta=refresh_token_expires
    )

    # Decide cookie lifetime from "stay_logged_in"
    max_age = settings.REFRESH_COOKIE_TTL_SEC if form_data.stay_logged_in else None

    response.set_cookie(
        key=settings.REFRESH_COOKIE_NAME,
        value=refresh_token,
        httponly=True,
        secure=settings.COOKIE_SECURE,  # True in prod (HTTPS)
        samesite=settings.COOKIE_SAMESITE,  # "lax" for same-site; "none" for cross-site
        path="/",
        max_age=max_age,
    )

    return {
        "message": "Login successful",
        "user": UserPublic(**current_user.model_dump()),
        "stay_logged_in": form_data.stay_logged_in,
        "token": {
            "access_token": access_token,
            "token_type": "bearer",
            "expires_in": int(access_token_expires.total_seconds()),
        },
    }


@router.post("/refresh")
async def refresh(
    request: Request,
    settings: SettingsDep,
    session: SessionDep,
) -> dict:
    auth_handler = AuthHandler()

    # get the long-term refresh token
    refresh_token = request.cookies.get(settings.REFRESH_COOKIE_NAME)

    # Ensure refresh cookie exists
    if not refresh_token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="No refresh token found!",
        )

    # Validate refresh token
    try:
        payload = AuthHandler.decode_jwt_token(refresh_token)
    except Exception:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired refresh token",
        )

    # extract user id
    user_id = payload.get("user_id") or payload.get("sub")
    if not user_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Malformed refresh token",
        )

    # Ensure user still exists/is active
    current_user = get_user_by_id(session, user_id)
    if not current_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not authenticated. Log in to continue!",
        )

    # Create new access token
    access_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    new_access = auth_handler.create_access_token(
        data={"user_id": user_id, "type": "access"},
        expires_delta=access_expires,
    )

    return {
        "user": current_user,
        "access_token": new_access,
        "token_type": "bearer",
        "expires_in": int(access_expires.total_seconds()),
    }


@router.get("/get-current-user")
async def read_current_user(current_user: CurrentUserDep) -> UserPublic | None:
    return current_user


@router.get("/is-user-admin")
async def is_user_admin_api(current_user: CurrentUserDep, settings: SettingsDep):
    if current_user.email not in settings.admins:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="You do not have access to this resource",
        )
    return {
        "is_admin": True,
        "message": "User has admin access",
        "user_email": current_user.email,
    }
