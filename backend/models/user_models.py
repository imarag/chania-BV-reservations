from pydantic import BaseModel, EmailStr


# Base shared fields
class UserBase(BaseModel):
    email: EmailStr


# For registration input
class UserRegister(UserBase):
    name: str
    password: str
    password_confirm: str


# For login input
class UserLogin(UserBase):
    password: str


# For API responses
class UserRead(UserBase):
    id: int
    name: str | None = None
    role: str
    phone_number: str | None = None
