from models.db_models import UserPublic
from models.token import Token
from pydantic import BaseModel


class RegisterResponse(BaseModel):
    message: str
    user: UserPublic


class LoginResponse(BaseModel):
    message: str
    user: UserPublic
    stay_logged_in: bool
    token: Token
