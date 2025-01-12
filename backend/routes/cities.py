from fastapi import APIRouter
from typing import List
from ..models.city import City
from ..services.city_service import CityService

router = APIRouter()
city_service = CityService()

@router.get("/", response_model=List[City])
async def get_cities(query: str = ""):
    return city_service.search_cities(query)