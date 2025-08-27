from enum import Enum
from pathlib import Path

APP_ROOT_DIR = Path(__file__).resolve().parent.parent

class AppPaths(str, Enum):
    DATABASE_FILE_NAME = "database.db"
    DATABASE_PATH = APP_ROOT_DIR / DATABASE_FILE_NAME
    
    TEMP_FOLDER_NAME = "temp"
    TEMP_FOLDER_PATH = APP_ROOT_DIR / TEMP_FOLDER_NAME

    AUTH_EP = "/auth"
    DB_EP = "/db"
