from datetime import date, datetime, time
from enum import Enum
from pydantic import EmailStr
from sqlmodel import Field, SQLModel


class Role(str, Enum):
    player = "player"
    admin = "admin"


class CourtStatus(str, Enum):
    available = "available"
    maintenance = "maintenance"
    booked = "booked"


class TimeSlotStatus(str, Enum):
    available = "available"
    booked = "booked"


class ReservationStatus(str, Enum):
    pending = "pending"
    confirmed = "confirmed"
    cancelled = "cancelled"
    completed = "completed"


class User(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    email: EmailStr = Field(index=True, unique=True)
    hashed_password: str
    active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.now)
    phone_number: str | None = Field(default=None)
    role: Role = Field(default=Role.player)


class Court(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    name: str = Field(unique=True)
    status: CourtStatus = Field(default=CourtStatus.available)
    description: str = Field(default="")


class TimeSlot(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    start_time: time = Field(unique=True)
    end_time: time = Field(unique=True)
    name: str = Field(unique=True)
    status: TimeSlotStatus = Field(default=TimeSlotStatus.available)
    description: str = Field(default="")


class Reservation(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    user_id: int = Field(foreign_key="user.id")
    court_id: int = Field(foreign_key="court.id")
    timeslot_id: int = Field(foreign_key="timeslot.id")
    reservation_date: date = Field(default_factory=datetime.today)
    status: ReservationStatus = Field(default=ReservationStatus.pending)
    notes: str | None = Field(default=None, nullable=True)


class ReservationPlayer(SQLModel, table=True):
    id: int | None = Field(default=None, primary_key=True)
    reservation_id: int = Field(foreign_key="reservation.id")
    user_id: int = Field(foreign_key="user.id")
