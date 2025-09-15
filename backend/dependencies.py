from collections.abc import Generator
from typing import Annotated

from core.config import Settings, get_settings
from fastapi import Depends, HTTPException, Request
from models.db_models import UserPublic
from sqlmodel import Session
from utils.db_operations import get_reservation_by_user_id, get_user_by_id, get_user_session_by_id

SettingsDep = Annotated[Settings, Depends(get_settings)]


def get_session() -> Generator:
    from core.db_handler import DBHandler

    db_handler = DBHandler()
    with Session(db_handler.engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]

async def get_current_user(
    session: SessionDep,
    settings: SettingsDep,
    request: Request
) -> UserPublic:
    user_session_id = request.cookies.get(settings.SESSION_COOKIE_NAME)
   
    credentials_exception = HTTPException(
        status_code=401,
        detail="Please log in to continue",
    )
    
    if not user_session_id:
        raise credentials_exception
   
    user_session = get_user_session_by_id(session, user_session_id)

    if user_session is None:
        raise credentials_exception

    reservation = get_reservation_by_user_id(session, user_session.user_id)
    user = get_user_by_id(session, user_session.user_id)
    
    if user is None:
        raise credentials_exception
    
    if reservation:
        user.can_make_reservation = False
        
    return UserPublic(**user.model_dump())


CurrentUserDep = Annotated[UserPublic, Depends(get_current_user)]
