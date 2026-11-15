
from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):

    # Application settings
    APP_NAME: str = "EventSphere"
    APP_VERSION: str = "1.0.0"
    DEBUG: bool = False

    # Database settings
    DATABASE_URL: str = "postgresql://neondb_owner:npg_hO4APDd6RuBK@ep-still-river-b3og9c5w-pooler.c-4.ap-southeast-1.aws.neon.tech/eventsphere?sslmode=require&channel_binding=require"

    # Authentication settings
    SECRET_KEY: str
    ALGORITHM: str = "HS256"
    ACCESS_TOKEN_EXPIRE_MINUTES: int = 60

    # Frontend settings
    FRONTEND_URL: str = "http://127.0.0.1:5500"

    model_config = SettingsConfigDict(
        env_file=".env",
        env_file_encoding="utf-8",
        case_sensitive=True,
        extra="ignore"
    )


# Create a global settings object
settings = Settings()
