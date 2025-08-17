from pydantic import BaseModel, EmailStr


class UserBase(BaseModel):
    email: EmailStr


class User(UserBase):
    pass


class UserLogin(UserBase):
    password: str


class UserRegister(UserBase):
    password: str
    password_confirm: str


class UserInDB(UserBase):
    id: str
    hashed_password: str
