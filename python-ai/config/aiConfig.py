"""
AI System Configuration
Central configuration for all AI components
"""

from config.settings import settings

# System Prompt
SYSTEM_PROMPT = """You are an AI assistant trained exclusively on project files and documentation.

CRITICAL RULES:
1. Never hallucinate or invent information
2. Answer ONLY using information from the project files provided
3. Always mention the source file names and paths
4. Always mention the project names
5. If information is not available in the project files, respond with: "I could not find this information in the project files."
6. Never invent code or solutions not present in the projects
7. Be specific and cite exact locations in the code
8. Provide context about where information is found

When answering questions:
- Reference specific files and line numbers when possible
- Mention which project the information comes from
- Provide code snippets from the actual files
- Explain the context and purpose of the code"""

# LLM Configuration
LLM_CONFIG = {
    "provider": settings.AI_LLM_PROVIDER,
    "openai": {
        "api_key": settings.OPENAI_API_KEY,
        "model": settings.OPENAI_MODEL,
        "temperature": settings.OPENAI_TEMPERATURE,
        "max_tokens": settings.OPENAI_MAX_TOKENS,
    },
    "gemini": {
        "api_key": settings.GEMINI_API_KEY,
        "model": settings.GEMINI_MODEL,
    },
    "ollama": {
        "base_url": settings.OLLAMA_BASE_URL,
        "model": settings.OLLAMA_MODEL,
    },
}

# Embedding Configuration
EMBEDDING_CONFIG = {
    "provider": settings.AI_EMBEDDING_PROVIDER,
    "model": settings.EMBEDDING_MODEL,
    "dimension": settings.EMBEDDING_DIMENSION,
}

# Vector Database Configuration
VECTOR_DB_CONFIG = {
    "type": "chroma",
    "host": settings.CHROMA_HOST,
    "port": settings.CHROMA_PORT,
    "persist_dir": settings.CHROMA_PERSIST_DIR,
    "collection_name": settings.CHROMA_COLLECTION_NAME,
}

# Chunking Configuration
CHUNKING_CONFIG = {
    "chunk_size": settings.AI_CHUNK_SIZE,
    "chunk_overlap": settings.AI_CHUNK_OVERLAP,
    "separators": ["\n\n", "\n", " ", ""],
}

# Retrieval Configuration
RETRIEVAL_CONFIG = {
    "top_k": settings.AI_TOP_K,
    "similarity_threshold": settings.AI_SIMILARITY_THRESHOLD,
}

# Training Configuration
TRAINING_CONFIG = {
    "batch_size": settings.AI_BATCH_SIZE,
    "max_concurrent_files": settings.AI_MAX_CONCURRENT_FILES,
    "retry_attempts": settings.AI_RETRY_ATTEMPTS,
    "retry_delay": settings.AI_RETRY_DELAY,
}

# Watcher Configuration
WATCHER_CONFIG = {
    "enabled": settings.AI_WATCHER_ENABLED,
    "debounce_ms": settings.AI_WATCHER_DEBOUNCE,
    "watch_paths": [
        "README.md",
        "src",
        "backend",
        "docs",
        "package.json",
    ],
}
