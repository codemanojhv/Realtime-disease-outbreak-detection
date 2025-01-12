from pydantic import BaseModel
from datetime import datetime

class Alert(BaseModel):
    id: str
    message: str
    severity: str
    timestamp: str

    class Config:
        from_attributes = True