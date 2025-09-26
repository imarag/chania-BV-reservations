from functools import lru_cache
from pathlib import Path

from core.app_paths import AppPaths
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    ACCESS_COOKIE_TTL_SEC: int = 30 * 24 * 3600
    SESSION_COOKIE_NAME: str = "access_token"
    SESSION_SHORT_HOURS: int = 15
    TOTAL_PLAYERS_PER_RESERVATION: int = 4
    SESSION_LONG_HOURS: int = 24 * 15  # hours * days
    COOKIE_SECURE: bool = True
    RESERVATION_CUTOFF_HOUR: int = 14  # 2 PM
    COOKIE_SAMESITE: str = "none"  # "lax" for same-site; "none" for cross-site
    admins: list[str] = []

    model_config = SettingsConfigDict(env_file=".env")

    def initialize_app(self) -> None:
        Path(AppPaths.TEMP_FOLDER.value).mkdir(parents=True, exist_ok=True)


@lru_cache
def get_settings() -> Settings:
    return Settings()
