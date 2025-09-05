import re
from datetime import datetime, timedelta, timezone

import jwt
from dependencies import get_settings
from models.db_models import User, UserLogin
from passlib.context import CryptContext
from sqlmodel import Session
from utils.db_operations import get_user_by_email

settings = get_settings()


class AuthHandler:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def validate_password_hash(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def generate_password_hash(self, plain_password: str) -> str:
        return self.pwd_context.hash(plain_password)

    def authenticate_user(self, user: UserLogin, session: Session) -> User | None:
        existing_user = get_user_by_email(session, user.email)
        if not existing_user:
            return None
        if not self.validate_password_hash(
            user.password, existing_user.hashed_password
        ):
            return None
        return existing_user  # no need to reconstruct

    @staticmethod
    def create_access_token(
        data: dict = {}, expires_delta: timedelta | None = None
    ) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def decode_access_token(token: str) -> dict:
        try:
            return jwt.decode(
                token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM]
            )
        except jwt.ExpiredSignatureError:
            raise ValueError("Token expired")
        except jwt.PyJWTError:
            raise ValueError("Invalid token")

    @staticmethod
    def validate_password(password: str) -> str | None:
        if len(password) < 8:
            return "Password must be at least 8 characters long"
        if not re.search(r"[A-Za-z]", password) or not re.search(r"\d", password):
            return "Password must contain both letters and numbers"
        return None

    @staticmethod
    def validate_email(email: str) -> str | None:
        if not re.match(r"^[\w\.-]+@[\w\.-]+\.[a-zA-Z]{2,}$", email):
            return "Invalid email format"
        return None

    @staticmethod
    def validate_full_name(full_name: str) -> str | None:
        if not re.match(r"^[A-Za-z\s]{2,100}$", full_name):
            return "Invalid full name format. It must be 2-100 characters long and contain only letters and spaces."
        return None

    @staticmethod
    def validate_phone_number(phone_number: str) -> str | None:
        return None
