from pydantic import BaseModel
from models.token import Token


from models.db_models import UserPublic


class RegisterResponse(BaseModel):
    message: str
    user: UserPublic


class LoginResponse(BaseModel):
    message: str
    token: Token
