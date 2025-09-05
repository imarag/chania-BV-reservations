from pathlib import Path

from core.app_paths import AppPaths
from core.auth_handler import AuthHandler
from models.db_models import Reservation  # noqa: F403
from models.db_models import Court, ReservationUser, TimeSlot, User
from sqlmodel import Session, SQLModel, create_engine
from utils.initial_db_data import (courts, reservation_players, reservations,
                                   timeslots, users)


class DBHandler:
    def __init__(self) -> None:
        self.db_file_path = Path(AppPaths.DATABASE_PATH.value)
        self.sqlite_url = f"sqlite:///{self.db_file_path}"
        self.engine = create_engine(
            self.sqlite_url, connect_args={"check_same_thread": False}
        )

    def create_db_and_tables(self) -> None:
        SQLModel.metadata.create_all(self.engine)

    def populate_initial_data(self) -> None:

        auth_handler = AuthHandler()

        with Session(self.engine) as session:
            users_with_hash = [
                User(
                    **user,
                    hashed_password=auth_handler.generate_password_hash(
                        user["password"]
                    ),
                )
                for user in users
            ]
            session.add_all(users_with_hash)
            session.add_all([TimeSlot(**slot) for slot in timeslots])
            session.add_all([Court(**court) for court in courts])
            session.add_all([Reservation(**r) for r in reservations])
            session.add_all([ReservationUser(**rp) for rp in reservation_players])
            session.commit()

    def initialize_db(self) -> None:
        if not self.db_file_path.exists():
            self.create_db_and_tables()
            self.populate_initial_data()
