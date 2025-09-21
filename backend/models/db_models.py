from datetime import date, datetime, time
from enum import Enum
import re
from pydantic import EmailStr, computed_field, field_validator, model_validator
from sqlalchemy import UniqueConstraint
from sqlmodel import Field, SQLModel
from utils.errors import raise_app_error, AppError


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


def validate_email(email: str | None) -> str | None:
    if not email:
        return "Email is required"
    email = str(email).strip()

    return None


def validate_full_name(full_name: str | None) -> str | None:
    if full_name is None:
        return None  # OK
    full_name = str(full_name).strip()
    min_len = 2
    max_len = 100
    if not (min_len <= len(full_name) <= max_len):
        return f"Full name must be {min_len}-{max_len} characters long"
    return None


def validate_phone_number(phone_number: str | None) -> str | None:
    if not phone_number:
        return None  # OK
    phone_number = str(phone_number).strip()
    cleaned = (
        phone_number.replace(" ", "")
        .replace("-", "")
        .replace("(", "")
        .replace(")", "")
        .replace(".", "")
    )
    if cleaned.startswith("+"):
        cleaned = cleaned[1:]
    if not re.fullmatch(r"[0-9]{10}", cleaned):
        return "Phone number must be exactly 10 digits and contain only digits"
    return None


def validate_birth_date(birth_date: date | None) -> str | None:
    if not birth_date:
        return None  # OK

    if birth_date is not None and birth_date > date.today():
        return "Date of birth cannot be in the future"


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


class Court(CourtBase, table=True):
    id: int = Field(default=None, primary_key=True)


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

    @model_validator(mode="after")
    def validate_time_order(self):
        if self.start_time >= self.end_time:
            raise ValueError("start_time must be before end_time")
        return self


class TimeSlot(TimeSlotBase, table=True):
    id: int = Field(default=None, primary_key=True)


class TimeSlotPublic(TimeSlotBase):
    id: int


# ----- USER MODELS -----
class UserBase(SQLModel):
    full_name: str
    email: EmailStr
    active: bool = Field(default=True)
    phone_number: str | None = None
    role: Role = Field(default=Role.player)
    can_make_reservation: bool = Field(default=True)
    address: str | None = Field(default=None, max_length=255)
    date_of_birth: date | None = None
    profession: str | None = Field(default=None, max_length=100)
    created_at: datetime = Field(default_factory=datetime.now)

    @field_validator("full_name")
    @classmethod
    def validate_fullname_field(cls, v: str | None) -> str | None:
        error = validate_email(v)
        if error:
            raise_app_error(AppError.VALIDATION_ERROR, detail=error)
        return v

    @field_validator("phone_number")
    @classmethod
    def validate_phone_field(cls, v: str | None) -> str | None:
        error = validate_phone_number(v)
        if error:
            raise_app_error(AppError.VALIDATION_ERROR, detail=error)
        return v

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, v: date | None) -> date | None:
        error = validate_birth_date(v)
        if error:
            raise_app_error(AppError.VALIDATION_ERROR, detail=error)
        return v


class User(UserBase, table=True):
    id: int = Field(default=None, primary_key=True)
    hashed_password: str


class UserPublic(UserBase):
    id: int


class UserCreate(UserBase):
    password: str

    @field_validator("password")
    @classmethod
    def validate_password_field(cls, v: str | None) -> str | None:
        error = validate_password(v)
        if error:
            raise_app_error(AppError.VALIDATION_ERROR, detail=error)
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
        error = validate_full_name(v)
        if error:
            raise_app_error(AppError.VALIDATION_ERROR, detail=error)
        return v

    @field_validator("phone_number")
    @classmethod
    def validate_phone_field(cls, v: str | None) -> str | None:
        error = validate_phone_number(v)
        if error:
            raise_app_error(AppError.VALIDATION_ERROR, detail=error)
        return v

    @field_validator("password")
    @classmethod
    def validate_password_field(cls, v: str | None) -> str | None:
        error = validate_password(v)
        if error:
            raise_app_error(AppError.VALIDATION_ERROR, detail=error)
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
    stay_logged_in: bool = Field(default=True)

    @field_validator("password")
    @classmethod
    def validate_password_field(cls, v: str | None) -> str | None:
        error = validate_password(v)
        if error:
            raise_app_error(AppError.VALIDATION_ERROR, detail=error)
        return v


class UserRegister(UserBase):
    password: str
    password_confirm: str

    @field_validator("full_name")
    @classmethod
    def validate_fullname_field(cls, v: str | None) -> str | None:
        error = validate_full_name(v)
        if error:
            raise_app_error(AppError.VALIDATION_ERROR, detail=error)
        return v

    @field_validator("password")
    @classmethod
    def validate_password_field(cls, v: str | None) -> str | None:
        error = validate_password(v)
        if error:
            raise_app_error(AppError.VALIDATION_ERROR, detail=error)
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
    id: int = Field(default=None, primary_key=True)

    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "reservation_date",
            name="unique_reservation",
        ),
    )


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
    __table_args__ = (
        UniqueConstraint(
            "user_id",
            "reservation_id",
            name="unique_reservation_user",
        ),
    )


class ReservationUserPublic(SQLModel):
    user_id: int
    reservation_id: int


class ReservationUserCreate(ReservationUserBase):
    pass
