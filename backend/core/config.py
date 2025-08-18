from pathlib import Path

from pydantic_settings import BaseSettings, SettingsConfigDict

from core import app_paths


class Settings(BaseSettings):
    host: str = "127.0.0.1"
    port: str = "8000"
    model_config = SettingsConfigDict(env_file=".env")
    SECRET_KEY: str | None = None
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 30
    ALGORITHM: str = "HS256"

    @staticmethod
    def create_temp_folder() -> None:
        Path(app_paths.AppPaths.TEMP_FOLDER_PATH.value).mkdir(
            parents=True, exist_ok=True
        )

    def initialize_app(self) -> None:
        self.create_temp_folder()


settings = Settings()
