"""
AI Training Service
Orchestrates the training pipeline
"""

import uuid
from typing import Dict, Optional
from datetime import datetime
from services.AIProjectDiscoveryService import AIProjectDiscoveryService
from services.AIIngestService import AIIngestService
from services.AIEmbeddingService import AIEmbeddingService
from utils.logger import get_logger

logger = get_logger(__name__)


class AITrainingService:
    """Service for training the AI system"""

    def __init__(self):
        self.project_discovery_service = AIProjectDiscoveryService()
        self.ingest_service = AIIngestService()
        self.embedding_service = AIEmbeddingService()
        self.current_session = None

    def start_full_training(self) -> Dict:
        """Start full training"""
        session_id = str(uuid.uuid4())
        logger.info(f"Starting full training session: {session_id}")

        session = {
            'session_id': session_id,
            'status': 'in_progress',
            'type': 'full',
            'start_time': datetime.now().isoformat(),
            'total_projects': 0,
            'projects_processed': 0,
            'total_files': 0,
            'files_processed': 0,
            'total_chunks': 0,
            'chunks_created': 0,
            'embeddings_generated': 0,
            'errors': [],
            'error_count': 0,
        }

        self.current_session = session

        try:
            # Step 1: Discover projects
            logger.info("Step 1: Discovering projects")
            projects = self.project_discovery_service.discover_projects()
            session['total_projects'] = len(projects)

            # Step 2: Ingest files
            logger.info("Step 2: Ingesting project files")
            total_files = 0
            total_chunks = 0

            for project in projects:
                try:
                    result = self.ingest_service.ingest_project(project['path'])
                    session['projects_processed'] += 1
                    session['files_processed'] += result['files_processed']
                    total_files += result['files_processed']

                    if result['errors']:
                        session['errors'].extend(result['errors'])
                        session['error_count'] += len(result['errors'])

                    self.project_discovery_service.update_project_status(project['path'], 'processing')
                except Exception as e:
                    logger.error(f"Error ingesting project: {project['name']}, {str(e)}")
                    session['errors'].append({'file': project['name'], 'error': str(e)})
                    session['error_count'] += 1

            session['total_files'] = total_files

            # Step 3: Generate embeddings
            logger.info("Step 3: Generating embeddings")
            # This will be implemented with actual embedding generation

            session['status'] = 'completed'
            session['end_time'] = datetime.now().isoformat()

            logger.info(f"Training session completed: {session}")
            return session

        except Exception as e:
            logger.error(f"Training session failed: {str(e)}")
            session['status'] = 'failed'
            session['end_time'] = datetime.now().isoformat()
            session['errors'].append({'file': 'system', 'error': str(e)})
            raise

    def start_incremental_training(self) -> Dict:
        """Start incremental training"""
        session_id = str(uuid.uuid4())
        logger.info(f"Starting incremental training session: {session_id}")

        session = {
            'session_id': session_id,
            'status': 'in_progress',
            'type': 'incremental',
            'start_time': datetime.now().isoformat(),
            'total_projects': 0,
            'projects_processed': 0,
            'total_files': 0,
            'files_processed': 0,
            'total_chunks': 0,
            'chunks_created': 0,
            'embeddings_generated': 0,
            'errors': [],
            'error_count': 0,
        }

        self.current_session = session

        try:
            # Get projects
            projects = self.project_discovery_service.discover_projects()
            session['total_projects'] = len(projects)

            # Process changed files only
            for project in projects:
                try:
                    result = self.ingest_service.ingest_project(project['path'])
                    session['projects_processed'] += 1
                    session['files_processed'] += result['files_processed']

                    if result['errors']:
                        session['errors'].extend(result['errors'])
                        session['error_count'] += len(result['errors'])
                except Exception as e:
                    logger.error(f"Error in incremental training: {project['name']}, {str(e)}")
                    session['error_count'] += 1

            session['status'] = 'completed'
            session['end_time'] = datetime.now().isoformat()

            logger.info(f"Incremental training completed: {session}")
            return session

        except Exception as e:
            logger.error(f"Incremental training failed: {str(e)}")
            session['status'] = 'failed'
            session['end_time'] = datetime.now().isoformat()
            raise

    def get_training_status(self) -> Optional[Dict]:
        """Get current training status"""
        return self.current_session

    def get_training_history(self, limit: int = 10) -> list:
        """Get training history"""
        # This will be implemented with MongoDB integration
        return []

    def get_training_statistics(self) -> Dict:
        """Get training statistics"""
        # This will be implemented with MongoDB integration
        return {
            'total_sessions': 0,
            'completed_sessions': 0,
            'failed_sessions': 0,
            'in_progress_sessions': 0,
        }
