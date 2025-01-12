from typing import List, Optional, Tuple
from ..models.city import City
from ..data.cities import INDIAN_CITIES

class CityService:
    def __init__(self):
        self.cities = {city["city"].lower(): City(**city) for city in INDIAN_CITIES}

    def search_cities(self, query: str = "") -> List[City]:
        if not query:
            return list(self.cities.values())
        
        query = query.lower()
        return [
            city for city in self.cities.values()
            if query in city.city.lower() or query in city.state.lower()
        ]

    def get_city_coordinates(self, city_name: str) -> Optional[Tuple[float, float]]:
        city = self.cities.get(city_name.lower())
        if city:
            return city.lat, city.lng
        return None