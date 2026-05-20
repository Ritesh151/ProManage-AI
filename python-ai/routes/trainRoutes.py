"""
Training Routes
"""

from fastapi import APIRouter, HTTPException, BackgroundTasks
from services.AITrainingService import AITrainingService
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/train", tags=["training"])

training_service = AITrainingService()


@router.post("")
async def start_training(background_tasks: BackgroundTasks):
    """Start full training"""
    try:
        logger.info("Training request received")

        def run_training():
            try:
                session = training_service.start_full_training()
                logger.info(f"Training completed: {session}")
            except Exception as e:
                logger.error(f"Training error: {str(e)}")

        background_tasks.add_task(run_training)

        return {
            'success': True,
            'message': 'Training started',
            'status': 'in_progress',
        }
    except Exception as e:
        logger.error(f"Training error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/retrain")
async def start_retrain(background_tasks: BackgroundTasks):
    """Start incremental training"""
    try:
        logger.info("Retrain request received")

        def run_retrain():
            try:
                session = training_service.start_incremental_training()
                logger.info(f"Retrain completed: {session}")
            except Exception as e:
                logger.error(f"Retrain error: {str(e)}")

        background_tasks.add_task(run_retrain)

        return {
            'success': True,
            'message': 'Incremental training started',
            'status': 'in_progress',
        }
    except Exception as e:
        logger.error(f"Retrain error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/status")
async def get_training_status():
    """Get training status"""
    try:
        status = training_service.get_training_status()
        if status:
            return status
        else:
            return {'status': 'idle', 'message': 'No training in progress'}
    except Exception as e:
        logger.error(f"Status error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/history")
async def get_training_history(limit: int = 10):
    """Get training history"""
    try:
        history = training_service.get_training_history(limit)
        return {'history': history}
    except Exception as e:
        logger.error(f"History error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/stats")
async def get_training_stats():
    """Get training statistics"""
    try:
        stats = training_service.get_training_statistics()
        return stats
    except Exception as e:
        logger.error(f"Stats error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
