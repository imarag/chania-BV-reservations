import uuid
from datetime import datetime, time

from sqlmodel import Field, SQLModel


class User(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str = Field(unique=True)
    email: str = Field(index=True, unique=True)
    hashed_password: str
    active: bool = Field(default=True)
    created_at: datetime = Field(default_factory=datetime.now)
    phone_number: str = Field(default="")
    role: str = Field(default="player")  # e.g., 'player', 'admin', etc.


class Court(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    name: str = Field(unique=True)
    status: str = Field(default="available")
    description: str = Field(default="")


class TimeSlot(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    start_time: time = Field(unique=True)
    end_time: time = Field(unique=True)
    name: str = Field(unique=True)
    status: str = Field(default="available")
    description: str = Field(default="")


class Reservation(SQLModel, table=True):
    id: str = Field(default_factory=lambda: str(uuid.uuid4()), primary_key=True)
    user_id: str = Field(foreign_key="user.id")
    court_id: str = Field(foreign_key="court.id")
    timeslot_id: str = Field(foreign_key="timeslot.id")
    reservation_date: datetime = Field(default_factory=datetime.now)
    status: str = Field(default="pending")
    notes: str = Field(default="", nullable=True)
