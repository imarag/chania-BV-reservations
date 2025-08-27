from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

from core.app_paths import AppPaths
from core.auth_handler import AuthHandler
from models.db_models import (  # noqa: F403
    Court,
    Reservation,
    ReservationUser,
    TimeSlot,
    User,
)
from utils.initial_db_data import (
    courts,
    reservation_players,
    reservations,
    timeslots,
    users,
)


class DBHandler:
    def __init__(self) -> None:
        self.db_name = AppPaths.DATABASE_FILE_NAME
        self.db_file_path = Path(AppPaths.DATABASE_PATH.value)
        self.sqlite_url = f"sqlite:///{self.db_file_path}"
        self.create_engine()

    def create_engine(self) -> None:
        self.engine = create_engine(
            self.sqlite_url, connect_args={"check_same_thread": False}
        )

    def create_db_and_tables(self) -> None:
        SQLModel.metadata.create_all(self.engine)

    def populate_initial_data(self) -> None:
        auth_handler = AuthHandler(session=None)  # type: ignore
        with Session(self.engine) as session:
            session.add_all(
                [
                    User(
                        **user,
                        hashed_password=auth_handler.generate_password_hash(
                            user["password"]
                        ),
                    )
                    for user in users
                ]
            )  # noqa: F405
            session.add_all([TimeSlot(**slot) for slot in timeslots])  # noqa: F405
            session.add_all([Court(**court) for court in courts])  # noqa: F405
            session.add_all(
                [Reservation(**reservation) for reservation in reservations]  # noqa: F405
            )
            session.add_all(
                [
                    ReservationUser(**reservation_player)
                    for reservation_player in reservation_players
                ]  # noqa: F405
            )
            session.commit()

    def initialize_db(self) -> None:
        if not self.db_file_path.exists():
            self.create_db_and_tables()
            self.populate_initial_data()
