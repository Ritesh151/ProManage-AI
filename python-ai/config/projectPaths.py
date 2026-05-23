"""
Project Paths Configuration
ProposalForge AI codebase training paths only
"""

import os
from pathlib import Path

PROJECT_ROOT = str(Path(__file__).parent.parent.parent)
PROJECT_DISPLAY_NAME = "ProposalForge AI"

TRAINING_MODULES = [
    {"id": "frontend", "label": "ProposalForge AI Frontend", "path": os.path.join(PROJECT_ROOT, "frontend")},
    {"id": "backend", "label": "ProposalForge AI Backend", "path": os.path.join(PROJECT_ROOT, "backend")},
    {"id": "python-ai", "label": "ProposalForge AI Python AI Service", "path": os.path.join(PROJECT_ROOT, "python-ai")},
    {"id": "templates", "label": "ProposalForge AI Templates", "path": os.path.join(PROJECT_ROOT, "templates")},
    {"id": "docs", "label": "ProposalForge AI Documentation", "path": os.path.join(PROJECT_ROOT, "docs")},
    {"id": "md-docs", "label": "ProposalForge AI Documentation", "path": os.path.join(PROJECT_ROOT, "MD Files Documents")},
]

PROJECT_PATHS = [m["path"] for m in TRAINING_MODULES if os.path.isdir(m["path"])]

SUPPORTED_EXTENSIONS = {
    ".js", ".jsx", ".ts", ".tsx",
    ".py", ".java", ".kt", ".dart",
    ".md", ".txt",
    ".json", ".yaml", ".yml", ".env",
    "package.json", "pubspec.yaml", "requirements.txt",
}

EXCLUDED_DIRS = {
    "node_modules", "build", "dist", ".git", "coverage", ".lock", "bin",
    ".cache", "__pycache__", ".venv", "venv", "myenv", "logs",
    ".next", ".nuxt", "out", ".gradle", "target", ".pytest_cache",
    ".mypy_cache", "eggs", ".eggs", "Documents",
}

EXCLUDED_PATTERNS = {
    r"\.lock$", r"\.log$", r"\.tmp$", r"\.swp$", r"\.swo$", r"~$",
    r"\.DS_Store$", r"Thumbs\.db$", r"\.pdf$", r"\.docx$", r"\.doc$",
}
