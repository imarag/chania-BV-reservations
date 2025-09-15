from dependencies import get_settings
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
    ):
        existing_user = get_user_by_email(session, email)
        if not existing_user:
            return None
        if not self.validate_password_hash(password, existing_user.hashed_password):
            return None
        return existing_user