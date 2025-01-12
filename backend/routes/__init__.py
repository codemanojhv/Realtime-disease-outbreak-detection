from fastapi import APIRouter
from .cases import router as cases_router
from .alerts import router as alerts_router
from .cities import router as cities_router

router = APIRouter()
router.include_router(cases_router, prefix="/cases", tags=["cases"])
router.include_router(alerts_router, prefix="/alerts", tags=["alerts"])
router.include_router(cities_router, prefix="/cities", tags=["cities"])