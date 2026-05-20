"""
Status Routes
"""

from fastapi import APIRouter, HTTPException
from services.AIProjectDiscoveryService import AIProjectDiscoveryService
from services.AIIngestService import AIIngestService
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/status", tags=["status"])

project_discovery_service = AIProjectDiscoveryService()
ingest_service = AIIngestService()


@router.get("")
async def get_status():
    """Get AI system status"""
    try:
        stats = ingest_service.get_statistics()
        projects = project_discovery_service.get_discovered_projects()
        project_stats = project_discovery_service.get_statistics()

        return {
            'success': True,
            'trained': stats['processed_documents'] > 0,
            'projects': len(projects),
            'documents': stats['total_documents'],
            'processed_documents': stats['processed_documents'],
            'documents_with_embeddings': stats['documents_with_embeddings'],
            'total_chunks': stats['total_chunks'],
            'project_statistics': project_stats,
            'statistics': stats,
        }
    except Exception as e:
        logger.error(f"Status error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/projects")
async def get_projects():
    """Get discovered projects"""
    try:
        projects = project_discovery_service.discover_projects()
        stats = project_discovery_service.get_statistics()

        return {
            'success': True,
            'projects': projects,
            'statistics': stats,
        }
    except Exception as e:
        logger.error(f"Get projects error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
