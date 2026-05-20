"""
AI Ingest Service
Handles document ingestion and processing
"""

import os
from typing import List, Dict, Optional
from utils.fileUtils import (
    scan_directory, read_file_content, get_file_metadata,
    calculate_file_hash, get_project_name, detect_project_type
)
from utils.textUtils import chunk_text, clean_text, extract_summary, extract_keywords
from utils.logger import get_logger

logger = get_logger(__name__)


class AIIngestService:
    """Service for ingesting and processing files"""

    def __init__(self):
        self.processing_queue = []
        self.is_processing = False

    def ingest_project(self, project_path: str) -> Dict:
        """Ingest project files"""
        logger.info(f"Starting project ingestion: {project_path}")

        try:
            project_name = get_project_name(project_path)
            project_type = detect_project_type(project_path)
            files = scan_directory(project_path)

            logger.info(f"Found {len(files)} files to ingest")

            results = {
                'project_name': project_name,
                'project_path': project_path,
                'project_type': project_type,
                'files_processed': 0,
                'files_skipped': 0,
                'errors': [],
            }

            for file_path in files:
                try:
                    self.ingest_file(file_path, project_name, project_path, project_type)
                    results['files_processed'] += 1
                except Exception as e:
                    logger.error(f"Error ingesting file: {file_path}, {str(e)}")
                    results['files_skipped'] += 1
                    results['errors'].append({'file': file_path, 'error': str(e)})

            logger.info(f"Project ingestion completed: {results}")
            return results
        except Exception as e:
            logger.error(f"Error ingesting project: {project_path}, {str(e)}")
            raise

    def ingest_file(self, file_path: str, project_name: str, project_path: str, project_type: str) -> Dict:
        """Ingest single file"""
        logger.debug(f"Ingesting file: {file_path}")

        # Read file content
        content = read_file_content(file_path)
        if not content:
            raise Exception("Could not read file content")

        # Get file metadata
        metadata = get_file_metadata(file_path)
        if not metadata:
            raise Exception("Could not extract file metadata")

        # Calculate file hash
        file_hash = calculate_file_hash(file_path)

        # Clean and process content
        cleaned_content = clean_text(content)
        summary = extract_summary(cleaned_content)
        keywords = extract_keywords(cleaned_content)

        # Create chunks
        chunks = chunk_text(cleaned_content)
        chunk_data = [
            {
                'chunk_index': idx,
                'content': chunk,
                'chunk_id': f"{file_hash}-{idx}",
            }
            for idx, chunk in enumerate(chunks)
        ]

        # Create document data
        document_data = {
            'filename': metadata['filename'],
            'filepath': file_path,
            'project_name': project_name,
            'project_path': project_path,
            'project_type': project_type,
            'language': metadata['language'],
            'file_type': metadata['file_type'],
            'file_size': metadata['file_size'],
            'file_hash': file_hash,
            'content': cleaned_content,
            'summary': summary,
            'keywords': keywords,
            'chunks': chunk_data,
            'total_chunks': len(chunks),
            'processed': False,
            'embeddings_generated': False,
            'last_modified_at': metadata['modified_at'],
        }

        logger.debug(f"Ingested file: {file_path}, chunks: {len(chunks)}")
        return document_data

    def get_unprocessed_documents(self, limit: int = 100) -> List[Dict]:
        """Get unprocessed documents"""
        # This will be implemented with MongoDB integration
        return []

    def mark_as_processed(self, document_id: str):
        """Mark document as processed"""
        # This will be implemented with MongoDB integration
        pass

    def mark_embeddings_generated(self, document_id: str):
        """Mark embeddings as generated"""
        # This will be implemented with MongoDB integration
        pass

    def get_documents_by_project(self, project_name: str) -> List[Dict]:
        """Get documents by project"""
        # This will be implemented with MongoDB integration
        return []

    def get_statistics(self) -> Dict:
        """Get ingestion statistics"""
        # This will be implemented with MongoDB integration
        return {
            'total_documents': 0,
            'processed_documents': 0,
            'documents_with_embeddings': 0,
            'total_chunks': 0,
            'by_language': {},
            'by_file_type': {},
            'by_project': {},
        }

    def delete_project_documents(self, project_name: str) -> Dict:
        """Delete documents by project"""
        # This will be implemented with MongoDB integration
        logger.info(f"Deleted project documents: {project_name}")
        return {'deleted_count': 0}

    def search_documents(self, query: str, limit: int = 10) -> List[Dict]:
        """Search documents"""
        # This will be implemented with MongoDB integration
        return []
