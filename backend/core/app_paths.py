from enum import Enum
from pathlib import Path


class AppPaths(str, Enum):
    APP_ROOT_DIR = Path(__file__).resolve().parent.parent
    DATABASE_FILE_NAME = "database.db"
    DATABASE_PATH = APP_ROOT_DIR / DATABASE_FILE_NAME
    TEMP_FOLDER_NAME = "temp"
    TEMP_FOLDER_PATH = APP_ROOT_DIR / TEMP_FOLDER_NAME
    AUTH_API_SUFFIX = "/auth"
    API_API_SUFFIX = "/api"
    DB_API_SUFFIX = "/db"
    USERS_API_SUFFIX = "/users"
