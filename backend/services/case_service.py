from datetime import datetime
from typing import List
from sqlite3 import Connection
from ..models.case import DiseaseCase, DiseaseCaseCreate
from ..services.city_service import CityService

class CaseService:
    def __init__(self):
        self.city_service = CityService()

    def get_all_cases(self, db: Connection) -> List[DiseaseCase]:
        cursor = db.cursor()
        cursor.execute("SELECT * FROM cases")
        return [self._row_to_case(row) for row in cursor.fetchall()]

    def create_case(self, db: Connection, case: DiseaseCaseCreate) -> DiseaseCase:
        coords = self.city_service.get_city_coordinates(case.city)
        if not coords:
            raise ValueError("Invalid city")
        
        lat, lng = coords
        case_id = str(datetime.now().timestamp())
        
        cursor = db.cursor()
        cursor.execute(
            "INSERT INTO cases VALUES (?, ?, ?, ?, ?, ?, ?)",
            (case_id, case.disease, case.city, case.cases, case.timestamp, lat, lng)
        )
        db.commit()
        
        return DiseaseCase(
            id=case_id,
            disease=case.disease,
            city=case.city,
            cases=case.cases,
            timestamp=case.timestamp,
            lat=lat,
            lng=lng
        )

    def get_historical_cases(
        self, db: Connection, start_date: str, end_date: str
    ) -> List[DiseaseCase]:
        cursor = db.cursor()
        cursor.execute(
            "SELECT * FROM cases WHERE timestamp BETWEEN ? AND ?",
            (start_date, end_date)
        )
        return [self._row_to_case(row) for row in cursor.fetchall()]

    def _row_to_case(self, row: tuple) -> DiseaseCase:
        return DiseaseCase(
            id=row[0],
            disease=row[1],
            city=row[2],
            cases=row[3],
            timestamp=row[4],
            lat=row[5],
            lng=row[6]
        )