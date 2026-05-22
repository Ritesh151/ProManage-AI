"""
AI Training Service
Orchestrates the training pipeline
"""

import uuid
import os
import hashlib
import threading
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
        self.training_logs = []
        self.abort_event = threading.Event()
        self.is_training = False

    def add_log(self, level: str, message: str):
        """Add a training log entry"""
        log = {
            'level': level,
            'message': message,
            'timestamp': datetime.now().isoformat(),
        }
        self.training_logs.append(log)
        if level == 'info':
            logger.info(message)
        elif level == 'error':
            logger.error(message)
        elif level == 'warning':
            logger.warning(message)
        else:
            logger.debug(message)

    def scan_project_files(self, project_path: str) -> list:
        """Scan project directory for supported files"""
        from config.projectPaths import SUPPORTED_EXTENSIONS, EXCLUDED_DIRS, EXCLUDED_PATTERNS
        import re

        files = []

        def scan(dir_path, depth=0):
            if depth > 10:
                return
            try:
                for entry in os.listdir(dir_path):
                    full_path = os.path.join(dir_path, entry)
                    if os.path.isdir(full_path):
                        if entry not in EXCLUDED_DIRS:
                            scan(full_path, depth + 1)
                    elif os.path.isfile(full_path):
                        ext = os.path.splitext(entry)[1]
                        is_supported = any(
                            e.startswith('.') and ext == e or entry == e
                            for e in SUPPORTED_EXTENSIONS
                        )
                        is_excluded = any(
                            re.search(p, entry) for p in EXCLUDED_PATTERNS
                        )
                        if is_supported and not is_excluded:
                            files.append(full_path)
            except Exception:
                pass

        scan(project_path)
        return files

    def start_full_training(self) -> Dict:
        """Start full training"""
        if self.is_training:
            raise Exception('Training already in progress')

        self.is_training = True
        self.training_logs = []
        self.abort_event.clear()

        session_id = str(uuid.uuid4())
        self.add_log('info', f'Starting full training session: {session_id}')

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
            'current_file': None,
            'is_training': True,
        }

        self.current_session = session

        try:
            self.add_log('info', 'Step 1: Discovering projects')
            projects = self.project_discovery_service.discover_projects()
            session['total_projects'] = len(projects)
            self.add_log('info', f'Found {len(projects)} projects')

            if len(projects) == 0:
                raise Exception('No projects found to train')

            all_files = []

            for project in projects:
                if self.abort_event.is_set():
                    self.add_log('info', 'Training stopped by user')
                    break

                try:
                    self.add_log('info', f'Processing project: {project["name"]}')
                    self.project_discovery_service.update_project_status(project['path'], 'processing')

                    files = self.scan_project_files(project['path'])
                    all_files.extend([{'path': f, 'project': project['name']} for f in files])

                    session['total_files'] = len(all_files)
                except Exception as e:
                    self.add_log('error', f'Error scanning project {project["name"]}: {str(e)}')
                    session['errors'].append({'file': project['name'], 'error': str(e)})
                    session['error_count'] += 1

            session['total_files'] = len(all_files)

            for i, file in enumerate(all_files):
                if self.abort_event.is_set():
                    self.add_log('info', 'Training stopped by user')
                    break

                try:
                    self.add_log('info', f'[{i + 1}/{len(all_files)}] Processing: {file["path"]}')
                    session['current_file'] = file['path']

                    doc = self.ingest_service.ingest_file(file['path'], file['project'], file['project'], 'other')
                    session['files_processed'] += 1
                    session['chunks_created'] += doc['total_chunks']

                    self.add_log('info', f'Chunked {doc["total_chunks"]} chunks for {doc["filename"]}')
                except Exception as e:
                    self.add_log('error', f'Failed: {file["path"]} - {str(e)}')
                    session['errors'].append({'file': file['path'], 'error': str(e)})
                    session['error_count'] += 1

            self.add_log('info', 'Generating embeddings')

            session['status'] = 'completed'
            session['end_time'] = datetime.now().isoformat()
            session['current_file'] = None
            session['is_training'] = False
            session['logs'] = self.training_logs[-100:]

            self.add_log('info', f'Training completed: {session["files_processed"]} files, {session["chunks_created"]} chunks')

            self.is_training = False
            self.current_session = session
            return session

        except Exception as e:
            self.add_log('error', f'Training failed: {str(e)}')
            session['status'] = 'failed'
            session['end_time'] = datetime.now().isoformat()
            session['current_file'] = None
            session['errors'].append({'file': 'system', 'error': str(e)})
            session['is_training'] = False

            self.is_training = False
            raise

    def start_incremental_training(self) -> Dict:
        """Start incremental training"""
        if self.is_training:
            raise Exception('Training already in progress')

        self.is_training = True
        self.training_logs = []
        self.abort_event.clear()

        session_id = str(uuid.uuid4())
        self.add_log('info', f'Starting incremental training session: {session_id}')

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
            'current_file': None,
            'is_training': True,
        }

        self.current_session = session

        try:
            self.add_log('info', 'Discovering projects')
            projects = self.project_discovery_service.discover_projects()
            session['total_projects'] = len(projects)

            if len(projects) == 0:
                raise Exception('No projects found to train')

            all_files = []

            for project in projects:
                if self.abort_event.is_set():
                    self.add_log('info', 'Training stopped by user')
                    break

                try:
                    files = self.scan_project_files(project['path'])
                    all_files.extend([{'path': f, 'project': project['name']} for f in files])
                except Exception as e:
                    self.add_log('error', f'Error scanning project {project["name"]}: {str(e)}')
                    session['errors'].append({'file': project['name'], 'error': str(e)})
                    session['error_count'] += 1

            session['total_files'] = len(all_files)

            for i, file in enumerate(all_files):
                if self.abort_event.is_set():
                    self.add_log('info', 'Training stopped by user')
                    break

                try:
                    self.add_log('info', f'[{i + 1}/{len(all_files)}] Processing: {file["path"]}')
                    session['current_file'] = file['path']

                    doc = self.ingest_service.ingest_file(file['path'], file['project'], file['project'], 'other')
                    session['files_processed'] += 1
                    session['chunks_created'] += doc['total_chunks']

                    self.add_log('info', f'Processed {doc["filename"]}')
                except Exception as e:
                    self.add_log('error', f'Failed: {file["path"]} - {str(e)}')
                    session['errors'].append({'file': file['path'], 'error': str(e)})
                    session['error_count'] += 1

            session['status'] = 'completed'
            session['end_time'] = datetime.now().isoformat()
            session['current_file'] = None
            session['is_training'] = False
            session['logs'] = self.training_logs[-100:]

            self.add_log('info', f'Incremental training completed: {session["files_processed"]} files')

            self.is_training = False
            self.current_session = session
            return session

        except Exception as e:
            self.add_log('error', f'Incremental training failed: {str(e)}')
            session['status'] = 'failed'
            session['end_time'] = datetime.now().isoformat()
            session['current_file'] = None
            session['errors'].append({'file': 'system', 'error': str(e)})
            session['is_training'] = False

            self.is_training = False
            raise

    def stop_training(self) -> Dict:
        """Stop active training"""
        if not self.is_training:
            return {'success': False, 'message': 'No active training to stop'}

        self.add_log('info', 'Stopping training...')
        self.abort_event.set()

        if self.current_session:
            self.current_session['status'] = 'paused'
            self.current_session['end_time'] = datetime.now().isoformat()
            self.current_session['current_file'] = None
            self.current_session['is_training'] = False

        self.is_training = False
        self.add_log('info', 'Training stopped')

        return {'success': True, 'message': 'Training stopped'}

    def get_training_status(self) -> Optional[Dict]:
        """Get current training status"""
        if self.current_session:
            total = self.current_session.get('total_files', 0)
            processed = self.current_session.get('files_processed', 0)
            progress = round((processed / total) * 100) if total > 0 else 0

            return {
                **self.current_session,
                'progress': progress,
                'logs': self.training_logs[-100:],
            }

        return {'status': 'idle', 'is_training': False, 'progress': 0, 'logs': []}

    def get_training_history(self, limit: int = 10) -> list:
        """Get training history"""
        return []

    def get_training_statistics(self) -> Dict:
        """Get training statistics"""
        return {
            'total_sessions': 0,
            'completed_sessions': 0,
            'failed_sessions': 0,
            'in_progress_sessions': 0,
        }

    def get_training_logs(self) -> list:
        """Get training logs"""
        return self.training_logs[-200:]
