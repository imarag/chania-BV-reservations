from datetime import date, datetime, time
from enum import Enum
from pydantic import EmailStr, field_validator, model_validator, computed_field
from sqlmodel import Field, SQLModel

# ----- Common Field Configs -----
NAME_FIELD = {
    "min_length": 3,
    "max_length": 100,
    "regex": r"^[A-Za-z ]+$",
    "description": "Full name, only letters and spaces are supported.",
}

EMAIL_FIELD = {}

PHONE_FIELD = {
    "min_length": 10,
    "max_length": 10,
    "regex": r"^[0-9]{10}$",
    "description": "Phone number, digits only, 10 allowed digits.",
}

PASSWORD_FIELD = {
    "min_length": 6,
    "max_length": 15,
    "description": "Password must be between 6 and 15 characters long.",
}

DESCRIPTION_FIELD = {
    "max_length": 255,
    "description": "Description text, max 255 characters.",
}


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
    name: str = Field(unique=True, **NAME_FIELD)
    status: CourtStatus = Field(default=CourtStatus.available)
    professional: bool = Field(default=False)
    description: str | None = Field(default=None, **DESCRIPTION_FIELD)


class Court(CourtBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class CourtPublic(CourtBase):
    id: int


# ----- TIMESLOT MODELS -----
class TimeSlotBase(SQLModel):
    start_time: time
    end_time: time
    status: TimeSlotStatus = Field(default=TimeSlotStatus.available)
    description: str | None = Field(default=None, **DESCRIPTION_FIELD)

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
    id: int | None = Field(default=None, primary_key=True)


class TimeSlotPublic(TimeSlotBase):
    id: int


# ----- USER MODELS -----
def validate_fullname(v: str) -> str:
    if len(v.split()) < 2:
        raise ValueError("Full name must include at least first and last name")
    return v


class UserBase(SQLModel):
    full_name: str = Field(unique=True, **NAME_FIELD)
    email: EmailStr = Field(unique=True, **EMAIL_FIELD)
    active: bool = Field(default=True)
    phone_number: str | None = Field(default=None, unique=True, **PHONE_FIELD)
    role: Role = Field(default=Role.player)
    address: str | None = Field(default=None, max_length=255)
    date_of_birth: date | None = None
    profession: str | None = Field(default=None, max_length=100)
    created_at: datetime = Field(default_factory=datetime.now)

    @field_validator("full_name")
    @classmethod
    def validate_fullname_field(cls, v: str) -> str:
        return validate_fullname(v)

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
    password: str = Field(**PASSWORD_FIELD)


class UserUpdate(SQLModel):
    full_name: str | None = Field(default=None, **NAME_FIELD)
    phone_number: str | None = Field(default=None, **PHONE_FIELD)
    address: str | None = Field(default=None, max_length=255)
    date_of_birth: date | None = None
    profession: str | None = Field(default=None, max_length=100)
    password: str | None = Field(default=None, **PASSWORD_FIELD)
    password_confirm: str | None = None

    @field_validator("date_of_birth")
    @classmethod
    def validate_dob(cls, v: date | None) -> date | None:
        if v and v > date.today():
            raise ValueError("Date of birth cannot be in the future")
        return v

    @field_validator("full_name")
    @classmethod
    def validate_fullname_field(cls, v: str) -> str:
        return validate_fullname(v)

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
    email: EmailStr = Field(**EMAIL_FIELD)
    password: str = Field(**PASSWORD_FIELD)


class UserRegister(SQLModel):
    full_name: str | None = Field(default=None, **NAME_FIELD)
    email: EmailStr = Field(**EMAIL_FIELD)
    password: str = Field(**PASSWORD_FIELD)
    password_confirm: str

    @field_validator("full_name")
    @classmethod
    def validate_fullname_field(cls, v: str) -> str:
        return validate_fullname(v)

    @model_validator(mode="after")
    def check_passwords_match(self):
        if self.password != self.password_confirm:
            raise ValueError("Passwords do not match")
        return self


# ----- RESERVATION MODELS -----
class ReservationBase(SQLModel):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    court_id: int = Field(foreign_key="court.id", primary_key=True)
    timeslot_id: int = Field(foreign_key="timeslot.id", primary_key=True)
    reservation_date: date = Field(default_factory=date.today, primary_key=True)
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


# ----- RESERVATION USER MODELS -----
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
