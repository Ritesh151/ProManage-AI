"""
File Utilities for Python AI Service
"""

import os
import hashlib
import re
from pathlib import Path
from typing import List, Set, Optional
from config.projectPaths import SUPPORTED_EXTENSIONS, EXCLUDED_DIRS, EXCLUDED_PATTERNS
from utils.logger import get_logger

logger = get_logger(__name__)

def calculate_file_hash(file_path: str) -> Optional[str]:
    """Calculate SHA256 hash of file content"""
    try:
        with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
            content = f.read()
        return hashlib.sha256(content.encode()).hexdigest()
    except Exception as e:
        logger.error(f"Error calculating file hash: {file_path}, {str(e)}")
        return None


def should_process_file(file_path: str) -> bool:
    """Check if file should be processed"""
    filename = os.path.basename(file_path)
    ext = os.path.splitext(file_path)[1]

    # Check excluded patterns
    for pattern in EXCLUDED_PATTERNS:
        if re.search(pattern, filename):
            return False

    # Check supported extensions
    if ext in SUPPORTED_EXTENSIONS or filename in SUPPORTED_EXTENSIONS:
        return True

    return False


def should_exclude_dir(dir_path: str) -> bool:
    """Check if directory should be excluded"""
    dirname = os.path.basename(dir_path)
    return dirname in EXCLUDED_DIRS


def scan_directory(dir_path: str, max_depth: int = 10, current_depth: int = 0) -> List[str]:
    """Recursively scan directory for files"""
    files = []

    if current_depth >= max_depth:
        return files

    try:
        for entry in os.listdir(dir_path):
            full_path = os.path.join(dir_path, entry)

            if os.path.isdir(full_path):
                if not should_exclude_dir(full_path):
                    files.extend(scan_directory(full_path, max_depth, current_depth + 1))
            elif os.path.isfile(full_path):
                if should_process_file(full_path):
                    files.append(full_path)
    except Exception as e:
        logger.warning(f"Error scanning directory: {dir_path}, {str(e)}")

    return files


def read_file_content(file_path: str) -> Optional[str]:
    """Read file content with encoding detection"""
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            return f.read()
    except UnicodeDecodeError:
        try:
            with open(file_path, 'r', encoding='latin-1') as f:
                return f.read()
        except Exception as e:
            logger.error(f"Error reading file: {file_path}, {str(e)}")
            return None
    except Exception as e:
        logger.error(f"Error reading file: {file_path}, {str(e)}")
        return None


def get_file_metadata(file_path: str) -> dict:
    """Get file metadata"""
    try:
        stat = os.stat(file_path)
        filename = os.path.basename(file_path)
        ext = os.path.splitext(file_path)[1]

        # Determine language
        language_map = {
            '.js': 'javascript',
            '.jsx': 'javascript',
            '.ts': 'typescript',
            '.tsx': 'typescript',
            '.py': 'python',
            '.java': 'java',
            '.kt': 'kotlin',
            '.dart': 'dart',
            '.md': 'markdown',
            '.json': 'json',
            '.yaml': 'yaml',
            '.yml': 'yaml',
        }
        language = language_map.get(ext, 'other')

        # Determine file type
        file_type = 'other'
        if filename in ['README.md', '.env', '.env.example', 'package.json', 'pubspec.yaml', 'requirements.txt']:
            file_type = 'config'
        elif ext in ['.md', '.txt']:
            file_type = 'documentation'
        elif ext in ['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.kt', '.dart']:
            file_type = 'code'
        elif ext in ['.json', '.yaml', '.yml']:
            file_type = 'data'

        return {
            'filename': filename,
            'language': language,
            'file_type': file_type,
            'file_size': stat.st_size,
            'created_at': stat.st_ctime,
            'modified_at': stat.st_mtime,
        }
    except Exception as e:
        logger.error(f"Error getting file metadata: {file_path}, {str(e)}")
        return None


def detect_project_type(project_path: str) -> str:
    """Detect project type from directory"""
    try:
        files = os.listdir(project_path)

        if 'package.json' in files:
            return 'nodejs'
        if 'requirements.txt' in files or 'setup.py' in files:
            return 'python'
        if 'pom.xml' in files or 'build.gradle' in files:
            return 'java'
        if 'pubspec.yaml' in files:
            return 'flutter'

        return 'other'
    except Exception as e:
        logger.error(f"Error detecting project type: {project_path}, {str(e)}")
        return 'other'


def get_project_name(project_path: str) -> str:
    """Get project name from directory"""
    return os.path.basename(project_path)
