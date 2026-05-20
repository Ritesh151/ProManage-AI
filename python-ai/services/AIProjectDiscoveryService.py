"""
AI Project Discovery Service
Discovers and catalogs projects from configured paths
"""

import os
from typing import List, Dict
from config.projectPaths import PROJECT_PATHS
from utils.fileUtils import scan_directory, get_project_name, detect_project_type
from utils.logger import get_logger

logger = get_logger(__name__)


class AIProjectDiscoveryService:
    """Service for discovering projects"""

    def __init__(self):
        self.discovered_projects = []
        self.project_cache = {}

    def discover_projects(self) -> List[Dict]:
        """Discover all projects from configured paths"""
        logger.info("Starting project discovery")
        self.discovered_projects = []

        for project_path in PROJECT_PATHS:
            if not os.path.exists(project_path):
                logger.debug(f"Project path does not exist: {project_path}")
                continue

            try:
                if not os.path.isdir(project_path):
                    logger.debug(f"Project path is not a directory: {project_path}")
                    continue

                # Check if this is a project root
                if self.is_project_root(project_path):
                    project = self.create_project_metadata(project_path)
                    self.discovered_projects.append(project)
                    self.project_cache[project_path] = project
                    logger.info(f"Discovered project: {project['name']}")
                else:
                    # Scan subdirectories for projects
                    self.scan_for_subprojects(project_path)
            except Exception as e:
                logger.warning(f"Error discovering projects: {project_path}, {str(e)}")

        logger.info(f"Project discovery completed: {len(self.discovered_projects)} projects found")
        return self.discovered_projects

    def scan_for_subprojects(self, dir_path: str, max_depth: int = 3, current_depth: int = 0):
        """Scan directory for subprojects"""
        if current_depth >= max_depth:
            return

        try:
            for entry in os.listdir(dir_path):
                if not entry.startswith('.') and entry not in ['node_modules', 'build', 'dist']:
                    full_path = os.path.join(dir_path, entry)

                    if os.path.isdir(full_path):
                        if self.is_project_root(full_path):
                            project = self.create_project_metadata(full_path)
                            self.discovered_projects.append(project)
                            self.project_cache[full_path] = project
                            logger.info(f"Discovered subproject: {project['name']}")
                        else:
                            self.scan_for_subprojects(full_path, max_depth, current_depth + 1)
        except Exception as e:
            logger.warning(f"Error scanning for subprojects: {dir_path}, {str(e)}")

    def is_project_root(self, dir_path: str) -> bool:
        """Check if directory is a project root"""
        project_indicators = [
            'package.json',
            'pom.xml',
            'build.gradle',
            'requirements.txt',
            'setup.py',
            'pubspec.yaml',
            'Cargo.toml',
            'go.mod',
            'composer.json',
            'Gemfile',
            '.git',
        ]

        try:
            files = os.listdir(dir_path)
            return any(indicator in files for indicator in project_indicators)
        except Exception:
            return False

    def create_project_metadata(self, project_path: str) -> Dict:
        """Create project metadata"""
        project_name = get_project_name(project_path)
        project_type = detect_project_type(project_path)
        files = scan_directory(project_path)

        return {
            'name': project_name,
            'path': project_path,
            'type': project_type,
            'file_count': len(files),
            'discovered_at': str(__import__('datetime').datetime.now()),
            'last_scanned': None,
            'status': 'pending',
        }

    def get_discovered_projects(self) -> List[Dict]:
        """Get all discovered projects"""
        return self.discovered_projects

    def get_project_by_path(self, project_path: str) -> Dict:
        """Get project by path"""
        return self.project_cache.get(project_path)

    def get_project_by_name(self, project_name: str) -> Dict:
        """Get project by name"""
        for project in self.discovered_projects:
            if project['name'] == project_name:
                return project
        return None

    def update_project_status(self, project_path: str, status: str):
        """Update project status"""
        project = self.project_cache.get(project_path)
        if project:
            project['status'] = status
            project['last_scanned'] = str(__import__('datetime').datetime.now())

    def get_statistics(self) -> Dict:
        """Get project statistics"""
        stats = {
            'total_projects': len(self.discovered_projects),
            'by_type': {},
            'by_status': {},
            'total_files': 0,
        }

        for project in self.discovered_projects:
            project_type = project['type']
            status = project['status']

            stats['by_type'][project_type] = stats['by_type'].get(project_type, 0) + 1
            stats['by_status'][status] = stats['by_status'].get(status, 0) + 1
            stats['total_files'] += project['file_count']

        return stats
