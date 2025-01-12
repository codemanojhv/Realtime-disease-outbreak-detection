from pydantic import BaseModel

class City(BaseModel):
    city: str
    state: str
    lat: float
    lng: float