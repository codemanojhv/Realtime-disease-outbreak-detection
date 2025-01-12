from fastapi import APIRouter, HTTPException
from typing import List
from datetime import datetime
from ..models.case import DiseaseCase, DiseaseCaseCreate
from ..services.case_service import CaseService
from ..database import get_db

router = APIRouter()
case_service = CaseService()

@router.get("/", response_model=List[DiseaseCase])
async def get_cases():
    with get_db() as db:
        return case_service.get_all_cases(db)

@router.post("/", response_model=DiseaseCase)
async def create_case(case: DiseaseCaseCreate):
    with get_db() as db:
        return case_service.create_case(db, case)

@router.get("/historical", response_model=List[DiseaseCase])
async def get_historical_cases(start_date: str, end_date: str):
    with get_db() as db:
        return case_service.get_historical_cases(db, start_date, end_date)