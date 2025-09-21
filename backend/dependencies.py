from collections.abc import Generator
from typing import Annotated
from datetime import datetime, timezone
from core.auth_handler import AuthHandler, get_auth_handler
from core.config import Settings, get_settings
from fastapi import Depends, Request
from models.db_models import UserPublic
from sqlmodel import Session
from utils.db_operations import (
    get_reservation_by_user_id,
    get_user_by_id,
    get_user_session_by_id,
)
from utils.errors import AppError, raise_app_error

AuthHandlerDep = Annotated[AuthHandler, Depends(get_auth_handler)]

SettingsDep = Annotated[Settings, Depends(get_settings)]


def get_session() -> Generator:
    from core.db_handler import DBHandler

    db_handler = DBHandler()
    with Session(db_handler.engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


async def get_current_user(
    session: SessionDep, settings: SettingsDep, request: Request
) -> UserPublic:
    user_session_id = request.cookies.get(settings.SESSION_COOKIE_NAME)

    if not user_session_id:
        raise_app_error(AppError.MISSING_SESSION)

    user_session = get_user_session_by_id(session, user_session_id)

    if user_session is None:
        raise_app_error(AppError.INVALID_CREDENTIALS)

    now = datetime.now(timezone.utc)

    if user_session.expires_at <= now:
        raise_app_error(AppError.SESSION_EXPIRED)

    reservation = get_reservation_by_user_id(session, user_session.user_id)
    user = get_user_by_id(session, user_session.user_id)

    if user is None:
        raise_app_error(AppError.INVALID_CREDENTIALS)

    if reservation:
        user.can_make_reservation = False

    return UserPublic(**user.model_dump())


CurrentUserDep = Annotated[UserPublic, Depends(get_current_user)]
