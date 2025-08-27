import re
from datetime import datetime, timedelta, timezone
from models.db_models import UserLogin, UserRegister
import jwt
from passlib.context import CryptContext
from sqlmodel import Session
from models.db_models import User
from utils.db_operations import get_user_by_email, get_user_by_name
from dependencies import get_settings

settings = get_settings()

class AuthHandler:
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

    def __init__(self, session: Session) -> None:
        self.session = session

    def validate_password_hash(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def generate_password_hash(self, plain_password: str) -> str:
        return self.pwd_context.hash(plain_password)

    def authenticate_user(self, user: UserLogin) -> User | None:
        password = user.password
        email = user.email
        existing_user = get_user_by_email(self.session, email)
        if not existing_user:
            return None
        if not self.validate_password_hash(password, existing_user.hashed_password):
            return None
        return User(**existing_user.model_dump())

    def validate_registration_data(
        self, form_data: UserRegister, session: Session
    ) -> str | None:
        name_error = self.validate_name(form_data.name)
        if name_error:
            return name_error

        password_error = self.validate_password(form_data.password)
        if password_error:
            return password_error

        email_error = self.validate_email(form_data.email)
        if email_error:
            return email_error

        if form_data.password != form_data.password_confirm:
            return "Passwords do not match"

        existing_user = get_user_by_email(session, form_data.email)
        if existing_user:
            return "Email already registered"

        return None

    @staticmethod
    def create_access_token(data: dict, expires_delta: timedelta | None = None) -> str:
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.now(timezone.utc) + expires_delta
        else:
            expire = datetime.now(timezone.utc) + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        return jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)

    @staticmethod
    def validate_password(password: str) -> str | None:
        if not re.match(r"^[A-Za-z0-9@!-$^&#%*]{8,}$", password):
            return """Password must be at least 8 characters long and
            contain both letters and numbers"""
        return None

    @staticmethod
    def validate_email(email: str) -> str | None:
        if not re.match(r"^[a-zA-Z-\.]+@([a-zA-Z-]+\.)+[a-zA-Z-]{2,4}$", email):
            return "Invalid email format"
        return None

    @staticmethod
    def validate_name(name: str) -> str | None:
        if not re.match(r"^[A-Za-z\s]{2,100}$", name):
            return "Invalid name format. It must be 2-100 characters long and contain only letters and spaces."
        return None
