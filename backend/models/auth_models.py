import uuid
from datetime import datetime, UTC
from sqlmodel import Field, SQLModel


class UserSession(SQLModel, table=True):
    id: str = Field(
        default_factory=lambda: str(uuid.uuid4().hex),
        primary_key=True,
        index=True,
        description="Opaque session token stored in the cookie",
    )
    user_id: int = Field(index=True)
    created_at: datetime = Field(
        default_factory=lambda: datetime.now(UTC), nullable=False
    )
    expires_at: datetime
