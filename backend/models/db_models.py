import re
from datetime import date, datetime, time
from enum import Enum

from pydantic import EmailStr, computed_field, field_validator, model_validator
from sqlmodel import Field, SQLModel

# ----- Validators -----


def validate_fullname(v: str | None) -> None:
    if v is None:
        return
    if not re.fullmatch(r"^[A-Za-z ]+$", v):
        raise ValueError("Full name must contain only letters and spaces")
    if len(v.split()) < 2:
        raise ValueError("Full name must include at least first and last name")


def validate_phone_number(v: str | None) -> None:
    if v is None:
        return
    if not re.fullmatch(r"^\d{10}$", v):
        raise ValueError("Phone number must be exactly 10 digits")


def validate_password(v: str | None) -> None:
    if v is None:
        return
    if not 6 <= len(v) <= 15:
        raise ValueError("Password must be between 6 and 15 characters long")


def validate_description(v: str | None) -> None:
    if v is None:
        return
    if len(v) > 255:
        raise ValueError("Description must not exceed 255 characters")


# ----- Enums -----
class CourtStatus(str, Enum):
    available = "available"
    maintenance = "maintenance"
    booked = "booked"


class TimeSlotStatus(str, Enum):
    available = "available"
    booked = "booked"


class Role(str, Enum):
    player = "player"
    admin = "admin"


class ReservationStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"


# ----- COURT MODELS -----
class CourtBase(SQLModel):
    name: str = Field(unique=True)
    status: CourtStatus = Field(default=CourtStatus.available)
    professional: bool = Field(default=False)
    description: str | None = None

    @field_validator("description")
    @classmethod
    def validate_description_field(cls, v: str | None) -> str | None:
        validate_description(v)
        return v


class Court(CourtBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class CourtPublic(CourtBase):
    id: int


# ----- TIMESLOT MODELS -----
class TimeSlotBase(SQLModel):
    start_time: time
    end_time: time
    status: TimeSlotStatus = Field(default=TimeSlotStatus.available)
    description: str | None = None

    @computed_field
    @property
    def name(self) -> str:
        return f"{self.start_time.strftime('%H:%M')}-{self.end_time.strftime('%H:%M')}"

    @field_validator("description")
    @classmethod
    def validate_description_field(cls, v: str | None) -> str | None:
        validate_description(v)
        return v

    @model_validator(mode="after")
    def validate_time_order(self):
        if self.start_time >= self.end_time:
            raise ValueError("start_time must be before end_time")
        return self


class TimeSlot(TimeSlotBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class TimeSlotPublic(TimeSlotBase):
    id: int


# ----- USER MODELS -----
class UserBase(SQLModel):
    full_name: str
    email: EmailStr
    active: bool = Field(default=True)
    phone_number: str | None = None
    role: Role = Field(default=Role.player)
    address: str | None = Field(default=None, max_length=255)
    date_of_birth: date | None = None
    profession: str | None = Field(default=None, max_length=100)
    created_at: datetime = Field(default_factory=datetime.now)

    @field_validator("full_name")
    @classmethod
    def validate_fullname_field(cls, v: str | None) -> str | None:
        validate_fullname(v)
        return v

    @field_validator("phone_number")
    @classmethod
    def validate_phone_field(cls, v: str | None) -> str | None:
        validate_phone_number(v)
        return v

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, v: date | None) -> date | None:
        if v and v > date.today():
            raise ValueError("Date of birth cannot be in the future")
        return v


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str


class UserPublic(UserBase):
    id: int


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def validate_password_field(cls, v: str | None) -> str | None:
        validate_password(v)
        return v


class UserUpdate(SQLModel):
    full_name: str | None = None
    phone_number: str | None = None
    address: str | None = None
    date_of_birth: date | None = None
    profession: str | None = None
    password: str | None = None
    password_confirm: str | None = None

    @field_validator("full_name")
    @classmethod
    def validate_fullname_field(cls, v: str | None) -> str | None:
        validate_fullname(v)
        return v

    @field_validator("phone_number")
    @classmethod
    def validate_phone_field(cls, v: str | None) -> str | None:
        validate_phone_number(v)
        return v

    @field_validator("password")
    @classmethod
    def validate_password_field(cls, v: str | None) -> str | None:
        validate_password(v)
        return v

    @model_validator(mode="after")
    def check_passwords_match(self):
        if (
            self.password
            and self.password_confirm
            and self.password != self.password_confirm
        ):
            raise ValueError("Passwords do not match")
        return self


class UserLogin(SQLModel):
    email: EmailStr
    password: str

    @field_validator("password")
    @classmethod
    def validate_password_field(cls, v: str | None) -> str | None:
        validate_password(v)
        return v


class UserRegister(UserBase):
    password: str
    password_confirm: str

    @field_validator("full_name")
    @classmethod
    def validate_fullname_field(cls, v: str | None) -> str | None:
        validate_fullname(v)
        return v

    @field_validator("password")
    @classmethod
    def validate_password_field(cls, v: str | None) -> str | None:
        validate_password(v)
        return v

    @model_validator(mode="after")
    def check_passwords_match(self):
        if self.password != self.password_confirm:
            raise ValueError("Passwords do not match")
        return self


# ----- Reservation Models -----
class ReservationBase(SQLModel):
    user_id: int = Field(foreign_key="user.id")
    court_id: int = Field(foreign_key="court.id")
    timeslot_id: int = Field(foreign_key="timeslot.id")
    reservation_date: date = Field(default_factory=date.today)
    status: ReservationStatus = Field(default=ReservationStatus.pending)


class Reservation(ReservationBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class ReservationPublic(ReservationBase):
    id: int
    user_id: int
    court_id: int
    timeslot_id: int


class ReservationCreate(ReservationBase):
    pass


# ----- Reservation User Models -----


class ReservationUserBase(SQLModel):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    reservation_id: int = Field(foreign_key="reservation.id", primary_key=True)


class ReservationUser(ReservationUserBase, table=True):
    pass


class ReservationUserPublic(SQLModel):
    user_id: int
    reservation_id: int


class ReservationUserCreate(ReservationUserBase):
    pass
