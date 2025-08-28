from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict
from core.app_paths import AppPaths
from functools import lru_cache

class Settings(BaseSettings):
    host: str = "127.0.0.1"
    port: str = "8000"
    SECRET_KEY: str | None = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    model_config = SettingsConfigDict(env_file=".env")

    def initialize_app(self) -> None:
        Path(AppPaths.TEMP_FOLDER.value).mkdir(parents=True, exist_ok=True)

@lru_cache
def get_settings() -> Settings:
    return Settings()
