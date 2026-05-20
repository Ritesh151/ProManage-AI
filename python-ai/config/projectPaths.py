"""
Project Paths Configuration
Defines where the AI system should scan for projects
"""

import os
from pathlib import Path

# Define all project paths to scan
PROJECT_PATHS = [
    # Current project
    str(Path(__file__).parent.parent.parent),
    
    # Common project directories
    os.path.expanduser("~/Projects"),
    os.path.expanduser("~/Development"),
    os.path.expanduser("~/Code"),
    
    # Windows paths (if applicable)
    "D:\\Projects",
    "C:\\Projects",
    "E:\\Development",
    
    # Linux/Mac paths
    "/home/projects",
    "/opt/projects",
]

# File extensions to include in scanning
SUPPORTED_EXTENSIONS = {
    # Code files
    ".js", ".jsx", ".ts", ".tsx",
    ".py", ".java", ".kt", ".dart",
    # Documentation
    ".md", ".txt",
    # Configuration
    ".json", ".yaml", ".yml", ".env",
    # Package files
    "package.json", "pubspec.yaml", "requirements.txt",
    # Documents
    ".pdf", ".docx",
}

# Directories to exclude from scanning
EXCLUDED_DIRS = {
    "node_modules",
    "build",
    "dist",
    ".git",
    "coverage",
    ".lock",
    "bin",
    ".cache",
    "__pycache__",
    ".venv",
    "venv",
    ".next",
    ".nuxt",
    "out",
    ".gradle",
    "target",
    ".pytest_cache",
    ".mypy_cache",
    "eggs",
    ".eggs",
    "*.egg-info",
}

# File patterns to exclude
EXCLUDED_PATTERNS = {
    r"\.lock$",
    r"\.log$",
    r"\.tmp$",
    r"\.swp$",
    r"\.swo$",
    r"~$",
    r"\.DS_Store$",
    r"Thumbs\.db$",
}
