from pydantic import BaseModel

from models.user_models import UserRead


class RegisterResponse(BaseModel):
    message: str
    user: UserRead


class LoginResponse(BaseModel):
    message: str
    access_token: str
    token_type: str
