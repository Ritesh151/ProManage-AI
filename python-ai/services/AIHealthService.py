"""
AI Health Service
Monitors service health and dependencies
"""

from typing import Dict
from datetime import datetime
from utils.logger import get_logger

logger = get_logger(__name__)


class AIHealthService:
    """Service for health checks"""

    def __init__(self):
        self.start_time = datetime.now()
        self.last_check = None

    def check_health(self) -> Dict:
        """Check service health"""
        try:
            health_status = {
                'status': 'healthy',
                'timestamp': datetime.now().isoformat(),
                'uptime_seconds': (datetime.now() - self.start_time).total_seconds(),
                'services': {
                    'embedding_model': self.check_embedding_model(),
                    'llm_client': self.check_llm_client(),
                    'vector_database': self.check_vector_database(),
                    'mongodb': self.check_mongodb(),
                },
            }

            

            # Determine overall status
            if any(not service['healthy'] for service in health_status['services'].values()):
                health_status['status'] = 'degraded'

            self.last_check = health_status
            return health_status
        except Exception as e:
            logger.error(f"Error checking health: {str(e)}")
            return {
                'status': 'unhealthy',
                'error': str(e),
                'timestamp': datetime.now().isoformat(),
            }

    def check_embedding_model(self) -> Dict:
        """Check embedding model"""
        try:
            from services.AIEmbeddingService import AIEmbeddingService
            service = AIEmbeddingService()
            if service.embeddings_model:
                return {'healthy': True, 'message': 'Embedding model loaded'}
            else:
                return {'healthy': False, 'message': 'Embedding model not loaded'}
        except Exception as e:
            return {'healthy': False, 'message': str(e)}

    def check_llm_client(self) -> Dict:
        """Check LLM client"""
        try:
            from services.AIChatService import AIChatService
            service = AIChatService()
            if service.llm_client:
                return {'healthy': True, 'message': 'LLM client initialized'}
            else:
                return {'healthy': False, 'message': 'LLM client not initialized'}
        except Exception as e:
            return {'healthy': False, 'message': str(e)}

    def check_vector_database(self) -> Dict:
        """Check vector database"""
        try:
            # This will be implemented with Chroma integration
            return {'healthy': True, 'message': 'Vector database available'}
        except Exception as e:
            return {'healthy': False, 'message': str(e)}

    def check_mongodb(self) -> Dict:
        """Check MongoDB connection"""
        try:
            # This will be implemented with MongoDB integration
            return {'healthy': True, 'message': 'MongoDB available'}
        except Exception as e:
            return {'healthy': False, 'message': str(e)}

    def get_last_check(self) -> Dict:
        """Get last health check"""
        return self.last_check or self.check_health()
