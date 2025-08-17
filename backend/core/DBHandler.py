from pathlib import Path

from sqlmodel import Session, SQLModel, create_engine

from core.app_paths import AppPaths
from models.db import *  # noqa: F403
from utils.initialize_db import courts, reservations, timeslots, users


class DatabaseHandler:
    def __init__(self) -> None:
        self.db_name = AppPaths.DATABASE_FILE_NAME
        self.db_file_path = Path(AppPaths.DATABASE_PATH.value)
        self.sqlite_url = f"sqlite:///{self.db_file_path}"
        self.connect_args = {"check_same_thread": False}
        self.engine = create_engine(self.sqlite_url, connect_args=self.connect_args)

    def create_db_and_tables(self) -> None:
        if self.db_file_path.exists():
            try:
                self.db_file_path.unlink()  # Remove the existing database file
            except Exception as e:
                print(f"Error deleting existing database file: {e}")
        SQLModel.metadata.create_all(self.engine)

    def populate_initial_data(self) -> None:
        with Session(self.engine) as session:
            session.add_all([User(**user) for user in users])  # noqa: F405
            session.add_all([TimeSlot(**slot) for slot in timeslots])  # noqa: F405
            session.add_all([Court(**court) for court in courts])  # noqa: F405
            session.add_all(
                [Reservation(**reservation) for reservation in reservations]  # noqa: F405
            )
            session.commit()

    def initialize_db(self) -> None:
        self.create_db_and_tables()
        self.populate_initial_data()
