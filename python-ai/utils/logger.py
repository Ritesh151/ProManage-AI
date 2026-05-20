"""
Logger Utility for Python AI Service
"""

import logging
import os
from pathlib import Path
from config.settings import settings

# Create logs directory
log_dir = Path(settings.AI_LOG_FILE).parent
log_dir.mkdir(parents=True, exist_ok=True)

# Configure logging
logging.basicConfig(
    level=getattr(logging, settings.AI_LOG_LEVEL.upper()),
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s',
    handlers=[
        logging.FileHandler(settings.AI_LOG_FILE),
        logging.StreamHandler()
    ]
)


def get_logger(name: str) -> logging.Logger:
    """Get a logger instance"""
    return logging.getLogger(name)
