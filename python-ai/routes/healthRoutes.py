"""
Health Check Routes
"""

from fastapi import APIRouter, HTTPException
from services.AIHealthService import AIHealthService
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/health", tags=["health"])

health_service = AIHealthService()

@router.get("")
async def health_check():
    """Check service health"""
    try:
        health_status = health_service.check_health()
        return health_status
    except Exception as e:
        logger.error(f"Health check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/status")
async def get_status():
    """Get service status"""
    try:
        status = health_service.get_last_check()
        return status or health_service.check_health()
    except Exception as e:
        logger.error(f"Status check error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
