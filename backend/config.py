from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    database_url: str = "sqlite:///disease_tracker.db"
    allowed_origins: list[str] = [
        "http://localhost:5173",
        "https://your-netlify-domain.netlify.app"  # Add your Netlify domain here
    ]
    
    class Config:
        env_file = ".env"

settings = Settings()