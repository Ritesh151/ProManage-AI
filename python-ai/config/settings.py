"""
Settings Configuration for Python AI Service
"""

from pydantic_settings import BaseSettings
from typing import Optional
import os


class Settings(BaseSettings):
    """Application settings loaded from environment variables"""

    # Server Configuration
    PYTHON_AI_HOST: str = "0.0.0.0"
    PYTHON_AI_PORT: int = 8000
    PYTHON_AI_URL: str = "http://localhost:8000"
    NODE_BACKEND_URL: str = "http://localhost:5000"

    # LLM Configuration
    AI_LLM_PROVIDER: str = "openai"
    OPENAI_API_KEY: Optional[str] = None
    OPENAI_MODEL: str = "gpt-3.5-turbo"
    OPENAI_TEMPERATURE: float = 0.7
    OPENAI_MAX_TOKENS: int = 2000

    GEMINI_API_KEY: Optional[str] = None
    GEMINI_MODEL: str = "gemini-pro"

    OLLAMA_BASE_URL: str = "http://localhost:11434"
    OLLAMA_MODEL: str = "mistral"

    # Embedding Configuration
    AI_EMBEDDING_PROVIDER: str = "huggingface"
    EMBEDDING_MODEL: str = "sentence-transformers/all-MiniLM-L6-v2"
    EMBEDDING_DIMENSION: int = 384

    # Vector Database Configuration
    CHROMA_HOST: str = "localhost"
    CHROMA_PORT: int = 8000
    CHROMA_PERSIST_DIR: str = "./data/chroma"
    CHROMA_COLLECTION_NAME: str = "project_knowledge"

    # MongoDB Configuration
    MONGODB_URI: str = "mongodb://localhost:27017/ai-knowledge"

    # Chunking Configuration
    AI_CHUNK_SIZE: int = 1000
    AI_CHUNK_OVERLAP: int = 200

    # Retrieval Configuration
    AI_TOP_K: int = 5
    AI_SIMILARITY_THRESHOLD: float = 0.5

    # Training Configuration
    AI_BATCH_SIZE: int = 10
    AI_MAX_CONCURRENT_FILES: int = 5
    AI_RETRY_ATTEMPTS: int = 3
    AI_RETRY_DELAY: int = 1000

    # Watcher Configuration
    AI_WATCHER_ENABLED: bool = True
    AI_WATCHER_DEBOUNCE: int = 2000

    # Logging Configuration
    AI_LOG_LEVEL: str = "info"
    AI_LOG_FILE: str = "./logs/ai.log"

    # Cache Configuration
    AI_CACHE_ENABLED: bool = True
    AI_CACHE_TTL: int = 3600

    # Environment
    ENVIRONMENT: str = "development"
    DEBUG: bool = True

    class Config:
        env_file = ".env"
        case_sensitive = True


# Create settings instance
settings = Settings()
