"""
Python AI Microservice
FastAPI application for AI operations
"""

import asyncio
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from config.settings import settings
from routes import healthRoutes, trainRoutes, chatRoutes, statusRoutes
from services.AIWatcherService import AIWatcherService
from services.AIProjectDiscoveryService import AIProjectDiscoveryService
from utils.logger import get_logger

logger = get_logger(__name__)

# Global services
watcher_service = None
project_discovery_service = None


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Lifespan context manager for startup and shutdown"""
    global watcher_service, project_discovery_service

    # Startup
    logger.info("Starting Python AI Service")
    logger.info(f"Environment: {settings.ENVIRONMENT}")
    logger.info(f"LLM Provider: {settings.AI_LLM_PROVIDER}")

    # Initialize services
    watcher_service = AIWatcherService()
    project_discovery_service = AIProjectDiscoveryService()

    # Discover projects
    logger.info("Discovering projects")
    projects = project_discovery_service.discover_projects()
    logger.info(f"Discovered {len(projects)} projects")

    # Start file watchers
    for project in projects:
        watcher_service.start_watching(project['path'])

    logger.info("Python AI Service started successfully")

    yield

    # Shutdown
    logger.info("Shutting down Python AI Service")
    if watcher_service:
        watcher_service.stop_all_watchers()
    logger.info("Python AI Service shutdown complete")


# Create FastAPI app
app = FastAPI(
    title="Python AI Microservice",
    description="AI Knowledge LLM + RAG System",
    version="1.0.0",
    lifespan=lifespan,
)

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# Include routers
app.include_router(healthRoutes.router)
app.include_router(trainRoutes.router)
app.include_router(chatRoutes.router)
app.include_router(statusRoutes.router)


@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "service": "Python AI Microservice",
        "version": "1.0.0",
        "status": "running",
        "endpoints": {
            "health": "/health",
            "train": "/train",
            "chat": "/chat",
            "status": "/status",
        },
    }


@app.get("/info")
async def info():
    """Get service information"""
    return {
        "service": "Python AI Microservice",
        "version": "1.0.0",
        "environment": settings.ENVIRONMENT,
        "llm_provider": settings.AI_LLM_PROVIDER,
        "embedding_provider": settings.AI_EMBEDDING_PROVIDER,
        "python_ai_url": settings.PYTHON_AI_URL,
        "node_backend_url": settings.NODE_BACKEND_URL,
    }


if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        app,
        host=settings.PYTHON_AI_HOST,
        port=settings.PYTHON_AI_PORT,
        log_level=settings.AI_LOG_LEVEL.lower(),
    )
