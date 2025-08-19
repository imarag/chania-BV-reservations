from collections.abc import Generator
from typing import Annotated

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlmodel import Session

from core.config import settings
from core.db_handler import DBHandler
from models.token import TokenData
from models.user_models import UserRead
from utils.db_operations import get_user_by_id

fake_users_db = [
    {
        "email": "johndoe@example.com",
        "password": "secret123",
        "hashed_password": "fakehashedsecret",
    },
    {
        "email": "alice@example.com",
        "password": "alicepass",
        "hashed_password": "fakehashedsecret2",
    },
    {
        "email": "bob@example.com",
        "password": "bobthebuilder",
        "hashed_password": "fakehashedsecret3",
    },
]

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")


def get_session() -> Generator:
    db_handler = DBHandler()
    with Session(db_handler.engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]


async def get_current_user(
    session: SessionDep, token: Annotated[str, Depends(oauth2_scheme)]
) -> UserRead:
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
        print(token_data, "****")
        user_id = token_data.user_id
        if user_id is None:
            raise credentials_exception
    except InvalidTokenError:
        raise credentials_exception  # noqa: B904
    user = get_user_by_id(session, user_id)
    if user is None:
        raise credentials_exception
    return UserRead(**user.model_dump())


CurrentUserDep = Annotated[UserRead, Depends(get_current_user)]
