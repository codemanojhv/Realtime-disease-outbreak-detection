from pydantic import BaseModel
from datetime import datetime

class DiseaseCaseBase(BaseModel):
    disease: str
    city: str
    cases: int
    timestamp: str

class DiseaseCaseCreate(DiseaseCaseBase):
    pass

class DiseaseCase(DiseaseCaseBase):
    id: str
    lat: float
    lng: float

    class Config:
        from_attributes = True