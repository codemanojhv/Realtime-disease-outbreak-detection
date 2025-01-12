from fastapi import APIRouter
from typing import List
from ..models.alert import Alert
from ..services.alert_service import AlertService
from ..database import get_db

router = APIRouter()
alert_service = AlertService()

@router.get("/", response_model=List[Alert])
async def get_alerts():
    with get_db() as db:
        return alert_service.get_active_alerts(db)