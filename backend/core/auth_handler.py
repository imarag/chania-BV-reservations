import re

from dependencies import get_settings
from models.db_models import User
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

    def authenticate_user(
        self, email: str, password: str, session: Session
    ) -> User | None:
        existing_user = get_user_by_email(session, email)
        if not existing_user:
            return None
        if not self.validate_password_hash(password, existing_user.hashed_password):
            return None
        return existing_user

    @staticmethod
    def validate_password(password: str | None) -> str | None:
        if password is None:
            return "Password is required"
        passw_min_len = 8
        passw_max_len = 64
        if len(password) < passw_min_len or len(password) > passw_max_len:
            return f"Password must be at least {passw_min_len} and at most {passw_max_len} characters long"
        if not any(c.isalpha() for c in password) or not any(c.isdigit() for c in password):
            return "Password must contain both letters and numbers"
        return None

    @staticmethod
    def validate_email(email: str | None) -> str | None:
        if not email:
            return "Email is required"
        e = str(email).strip()
        # Simple sanity regex; prefer Pydantic EmailStr if possible
        if not re.fullmatch(r"[^@\s]+@[^@\s]+\.[A-Za-z]{2,}$", e):
            return "Invalid email format"
        return None

    @staticmethod
    def validate_full_name(full_name: str | None) -> str | None:
        if full_name is None:
            return None # OK
        full_name = str(full_name).strip()
        min_len = 2
        max_len = 100
        if not (min_len <= len(full_name) <= max_len):
            return f"Full name must be {min_len}-{max_len} characters long"
        return None

    @staticmethod
    def validate_phone_number(phone_number: str | None) -> str | None:
        if not phone_number:
            return None  # OK
        phone_number = str(phone_number).strip()
        cleaned = phone_number.replace(" ", "").replace("-", "").replace("(", "").replace(")", "").replace(".", "")
        if cleaned.startswith("+"):
            cleaned = cleaned[1:]
        if not re.fullmatch(rf"\d{10}", cleaned):
            return "Phone number must be exactly 10 digits and contain only digits"
        return None
