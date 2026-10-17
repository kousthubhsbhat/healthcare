from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "PulseHealth Medical Backend"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://iagmdxykfjngkoiamimm.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "mock-service-role-key")
    SUPABASE_STORAGE_BUCKET: str = "medical-reports"

    # OpenAI / Vision LLM Configuration
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    VISION_MODEL: str = os.getenv("VISION_MODEL", "gpt-4o")

    # Security & CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    TOKEN_EXPIRATION_HOURS: int = 24

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
