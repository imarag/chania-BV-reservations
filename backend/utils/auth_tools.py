import re
from datetime import datetime, timedelta, timezone
from sqlmodel import Session
import jwt
from passlib.context import CryptContext
from core.config import settings
from models.user_models import UserInDB
from utils.db_operations import get_user_by_email

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)


def get_password_hash(plain_password: str) -> str:
    return pwd_context.hash(plain_password)


def authenticate_user(session: Session, email: str, password: str) -> UserInDB | None:
    user = get_user_by_email(session, email)
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user


def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        expire = datetime.now(timezone.utc) + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)


def validate_password(password: str) -> str | None:
    if not re.match(r"^[A-Za-z0-9@!-$^&#%*]{8,}$", password):
        return """Password must be at least 8 characters long and
        contain both letters and numbers"""
    return None


def validate_email(email: str) -> str | None:
    if not re.match(r"^[a-zA-Z-\.]+@([a-zA-Z-]+\.)+[a-zA-Z-]{2,4}$", email):
        return "Invalid email format"
    return None
