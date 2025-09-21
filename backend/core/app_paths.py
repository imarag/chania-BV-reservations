from enum import Enum
from pathlib import Path

APP_ROOT_DIR = Path(__file__).resolve().parent.parent


class AppPaths(str, Enum):
    TEMP_FOLDER = APP_ROOT_DIR / "temp"
    DATABASE_FILE_NAME = "database.db"
    DATABASE_PATH = APP_ROOT_DIR / DATABASE_FILE_NAME

    BASE_EP = "/api"
    AUTH_EP = BASE_EP + "/auth"
    DB_EP = BASE_EP + "/db"
