from typing import Annotated

import jwt
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jwt.exceptions import InvalidTokenError
from sqlmodel import Session

from core.config import settings
from core.DBHandler import DatabaseHandler
from models.token import TokenData
from models.user_models import User

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

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")


async def get_current_user(token: Annotated[str, Depends(oauth2_scheme)]) -> User:
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(
            token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
        )
        username = payload.get("sub")
        if username is None:
            raise credentials_exception
        token_data = TokenData(username=username)
    except InvalidTokenError:
        raise credentials_exception  # noqa: B904
    user = get_user(username=token_data.username)
    if user is None:
        raise credentials_exception
    return user


def get_session():
    db_handler = DatabaseHandler()
    with Session(db_handler.engine) as session:
        yield session


SessionDep = Annotated[Session, Depends(get_session)]
