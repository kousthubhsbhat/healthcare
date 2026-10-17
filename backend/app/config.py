from pydantic_settings import BaseSettings
from typing import Optional
import os

class Settings(BaseSettings):
    PROJECT_NAME: str = "PulseHealth Medical Backend"
    API_V1_STR: str = "/api"
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    # Supabase Configuration
    SUPABASE_URL: str = os.getenv("SUPABASE_URL", "https://mypzwovselfoxsgwelsy.supabase.co")
    SUPABASE_KEY: str = os.getenv("SUPABASE_KEY", "sb_publishable_MUZPM29xfw991lsPj6eA-g_V4oekH-W")
    SUPABASE_ANON_KEY: str = os.getenv("SUPABASE_ANON_KEY", "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15cHp3b3ZzZWxmb3hzZ3dlbHN5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTIyMTkyODEsImV4cCI6MjEwNzc5NTI4MX0.MrXdel5WBm4DNJUbO0RgyLS1mk2MrC7JA5lPH17nAyY")
    SUPABASE_STORAGE_BUCKET: str = "medical-reports"

    # Google Gemini Vision LLM Configuration
    GEMINI_API_KEY: Optional[str] = os.getenv("GEMINI_API_KEY", None)
    GEMINI_MODEL: str = os.getenv("GEMINI_MODEL", "gemini-1.5-flash")

    # Optional OpenAI Configuration
    OPENAI_API_KEY: Optional[str] = os.getenv("OPENAI_API_KEY", None)
    VISION_MODEL: str = os.getenv("VISION_MODEL", "gpt-4o")

    # Security & CORS
    FRONTEND_URL: str = os.getenv("FRONTEND_URL", "http://localhost:5173")
    TOKEN_EXPIRATION_HOURS: int = 24

    class Config:
        env_file = ".env"
        extra = "allow"

settings = Settings()
