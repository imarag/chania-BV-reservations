from datetime import date, datetime, time
from enum import Enum

from pydantic import EmailStr
from sqlmodel import Field, SQLModel


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


# ----- Court Models -----
class CourtBase(SQLModel):
    name: str = Field(unique=True)
    status: CourtStatus = Field(default=CourtStatus.available)
    professional: bool = Field(default=False)
    description: str = Field(default="")


class Court(CourtBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class CourtPublic(CourtBase):
    id: int


# ----- TimeSlot Models -----
class TimeSlotBase(SQLModel):
    name: str = Field(unique=True)
    start_time: time = Field(unique=True)
    end_time: time = Field(unique=True)
    status: TimeSlotStatus = Field(default=TimeSlotStatus.available)
    description: str = Field(default="")


class TimeSlot(TimeSlotBase, table=True):
    id: int | None = Field(default=None, primary_key=True)


class TimeSlotPublic(TimeSlotBase):
    id: int


# ----- User Models -----
class UserBase(SQLModel):
    username: str
    email: EmailStr
    active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.now)
    phone_number: str = Field(default="")
    role: Role = Field(default=Role.player)


class User(UserBase, table=True):
    id: int | None = Field(default=None, primary_key=True)
    hashed_password: str


class UserPublic(UserBase):
    id: int


class UserCreate(UserBase):
    password: str


class UserUpdate(SQLModel):
    username: str | None = None
    email: EmailStr | None= None
    active: bool | None = None
    created_at: datetime | None = None
    phone_number: str | None = None
    role: Role | None = None
    password: str | None = None


class UserLogin(SQLModel):
    email: EmailStr
    password: str
    
    
class UserRegister(SQLModel):
    username: str
    email: EmailStr
    password: str
    password_confirm: str

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


class ReservationCreate(ReservationBase):
    pass


class ReservationUser(SQLModel, table=True):
    user_id: int = Field(foreign_key="user.id", primary_key=True)
    reservation_id: int = Field(foreign_key="reservation.id", primary_key=True)
