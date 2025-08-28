import re
from datetime import datetime, timedelta, timezone

import jwt
from passlib.context import CryptContext
from sqlmodel import Session

from models.db_models import User, UserLogin, UserRegister
from utils.db_operations import get_user_by_email
from dependencies import get_settings

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
        if not self.validate_password_hash(user.password, existing_user.hashed_password):
            return None
        return existing_user   # no need to reconstruct

    def validate_registration_data(self, form_data: UserRegister, session: Session) -> str | None:
        print(form_data, "((()))")
        if (name_error := self.validate_username(form_data.username)):
            return name_error
        if (password_error := self.validate_password(form_data.password)):
            return password_error
        if (email_error := self.validate_email(form_data.email)):
            return email_error

        if form_data.password != form_data.password_confirm:
            return "Passwords do not match"

        if get_user_by_email(session, form_data.email):
            return "Email already registered"

        return None

    @staticmethod
    def create_access_token(data: dict = {}, expires_delta: timedelta | None = None) -> str:
        to_encode = data.copy()
        expire = datetime.now(timezone.utc) + (expires_delta or timedelta(minutes=15))
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def decode_access_token(token: str) -> dict:
        try:
            return jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
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
    def validate_username(username: str) -> str | None:
        if not re.match(r"^[A-Za-z\s]{2,100}$", username):
            return "Invalid username format. It must be 2-100 characters long and contain only letters and spaces."
        return None
