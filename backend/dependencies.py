from collections.abc import Generator
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlmodel import Session
from core.app_paths import AppPaths
from core.config import get_settings
from utils.db_operations import get_user_by_id
from core.config import Settings
from models.token import TokenData
from models.db_models import UserPublic
from core.db_handler import DBHandler


SettingsDep = Annotated[Settings, Depends(get_settings)]      

def get_session() -> Generator:
    db_handler = DBHandler()
    with Session(db_handler.engine) as session:
        yield session

SessionDep = Annotated[Session, Depends(get_session)]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl=AppPaths.LOGIN_EP.value)

async def get_current_user(
    session: SessionDep, settings: SettingsDep, token: Annotated[str, Depends(oauth2_scheme)] 
) -> UserPublic:
    
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        token_data = TokenData(**payload)
        user_id = token_data.user_id
        if user_id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception  # noqa: B904
    user = get_user_by_id(session, user_id)
    if user is None:
        raise credentials_exception
    return UserPublic(**user.model_dump())


CurrentUserDep = Annotated[UserPublic, Depends(get_current_user)]