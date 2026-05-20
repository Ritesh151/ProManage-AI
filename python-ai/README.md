# Python AI Microservice

A production-grade FastAPI-based AI microservice for the MERN Project Knowledge system.

## Quick Start

### 1. Install Dependencies
```bash
pip install -r requirements.txt
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env and add OPENAI_API_KEY
```

### 3. Start Service
```bash
python app.py
```

Service will be available at `http://localhost:8000`

## Architecture

```
FastAPI Application
    ↓
Services Layer (7 services)
    ↓
LangChain + Embeddings + Vector DB + LLM APIs
```

## Services

### AIProjectDiscoveryService
Discovers and catalogs projects from configured paths.

**Methods:**
- `discover_projects()` - Discover all projects
- `get_discovered_projects()` - Get list of projects
- `get_statistics()` - Get project statistics

### AIIngestService
Ingests and processes project files.

**Methods:**
- `ingest_project(project_path)` - Ingest entire project
- `ingest_file(file_path, ...)` - Ingest single file
- `get_statistics()` - Get ingestion statistics

### AIEmbeddingService
Generates vector embeddings for semantic search.

**Methods:**
- `generate_embedding(text)` - Generate embedding
- `search_similar(query_embedding, top_k)` - Search similar
- `store_embeddings(document_id, chunks, embeddings)` - Store embeddings

### AITrainingService
Orchestrates the training pipeline.

**Methods:**
- `start_full_training()` - Full training
- `start_incremental_training()` - Incremental training
- `get_training_status()` - Get status
- `get_training_history(limit)` - Get history

### AIChatService
Handles chat interactions and LLM communication.

**Methods:**
- `chat(question, conversation_id, user_id)` - Send message
- `get_conversation_history(conversation_id)` - Get history
- `get_user_conversations(user_id, limit)` - Get conversations

### AIWatcherService
Monitors file changes and triggers re-indexing.

**Methods:**
- `start_watching(project_path)` - Start watching
- `stop_watching(project_path)` - Stop watching
- `get_status()` - Get watcher status

### AIHealthService
Monitors service health and dependencies.

**Methods:**
- `check_health()` - Check health
- `get_last_check()` - Get last check

## API Endpoints

### Health
- `GET /health` - Check service health
- `GET /health/status` - Get detailed status

### Training
- `POST /train` - Start full training
- `POST /train/retrain` - Start incremental training
- `GET /train/status` - Get training status
- `GET /train/history` - Get training history
- `GET /train/stats` - Get training statistics

### Chat
- `POST /chat` - Send chat message
- `GET /chat/conversation/{id}` - Get conversation
- `GET /chat/conversations` - Get user conversations
- `DELETE /chat/conversation/{id}` - Clear conversation
- `POST /chat/feedback` - Submit feedback

### Status
- `GET /status` - Get AI system status
- `GET /status/projects` - Get discovered projects

### Info
- `GET /` - Root endpoint
- `GET /info` - Service information

## Configuration

### Environment Variables

```env
# Server
PYTHON_AI_HOST=0.0.0.0
PYTHON_AI_PORT=8000
PYTHON_AI_URL=http://localhost:8000

# LLM Provider
AI_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.7

# Embedding
AI_EMBEDDING_PROVIDER=huggingface
EMBEDDING_MODEL=sentence-transformers/all-MiniLM-L6-v2

# Vector Database
CHROMA_HOST=localhost
CHROMA_PORT=8000

# MongoDB
MONGODB_URI=mongodb://localhost:27017/ai-knowledge

# Chunking
AI_CHUNK_SIZE=1000
AI_CHUNK_OVERLAP=200

# Retrieval
AI_TOP_K=5
AI_SIMILARITY_THRESHOLD=0.5

# Logging
AI_LOG_LEVEL=info
AI_LOG_FILE=./logs/ai.log
```

### Project Paths

Edit `config/projectPaths.py`:

```python
PROJECT_PATHS = [
    str(Path(__file__).parent.parent.parent),
    os.path.expanduser("~/Projects"),
    "D:\\Projects",
]
```

## File Structure

```
python-ai/
├── app.py                          # FastAPI application
├── requirements.txt                # Dependencies
├── .env.example                    # Environment template
├── run.sh                          # Linux/Mac startup
├── run.bat                         # Windows startup
├── config/
│   ├── settings.py                 # Settings
│   ├── projectPaths.py             # Project paths
│   ├── aiConfig.py                 # AI config
│   └── __init__.py
├── services/
│   ├── AIProjectDiscoveryService.py
│   ├── AIIngestService.py
│   ├── AIEmbeddingService.py
│   ├── AITrainingService.py
│   ├── AIChatService.py
│   ├── AIWatcherService.py
│   ├── AIHealthService.py
│   └── __init__.py
├── routes/
│   ├── healthRoutes.py
│   ├── trainRoutes.py
│   ├── chatRoutes.py
│   ├── statusRoutes.py
│   └── __init__.py
├── utils/
│   ├── logger.py
│   ├── fileUtils.py
│   ├── textUtils.py
│   └── __init__.py
└── logs/                           # Log files (created at runtime)
```

## Logging

Logs are written to `logs/ai.log`

Configure log level in `.env`:
```env
AI_LOG_LEVEL=debug  # debug, info, warn, error
```

View logs:
```bash
tail -f logs/ai.log
```

## Supported File Types

### Code
- JavaScript/TypeScript: `.js`, `.jsx`, `.ts`, `.tsx`
- Python: `.py`
- Java: `.java`
- Kotlin: `.kt`
- Dart: `.dart`

### Documentation
- Markdown: `.md`
- Text: `.txt`

### Configuration
- JSON: `.json`
- YAML: `.yaml`, `.yml`
- Environment: `.env`, `.env.example`
- Package: `package.json`, `pubspec.yaml`, `requirements.txt`

### Documents
- PDF: `.pdf`
- Word: `.docx`

## Performance

### Training
- First training: 5-10 minutes (project dependent)
- Incremental training: 1-2 minutes
- File processing: ~100 files/minute

### Chat
- First response: 2-5 seconds (embedding generation)
- Cached response: <1 second
- Average response time: 1-3 seconds

## Troubleshooting

### Service won't start
```bash
# Check Python version
python --version

# Check dependencies
pip install -r requirements.txt

# Check port 8000
lsof -i :8000
```

### Health check fails
```bash
# Check service is running
curl http://localhost:8000/health

# Check logs
tail -f logs/ai.log
```

### Chat returns errors
```bash
# Check API key
echo $OPENAI_API_KEY

# Check logs
tail -f logs/ai.log
```

## Deployment

### Development
```bash
python app.py
```

### Production
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Docker
```dockerfile
FROM python:3.11-slim
WORKDIR /app
COPY requirements.txt .
RUN pip install -r requirements.txt
COPY . .
CMD ["python", "app.py"]
```

## Integration with Node Backend

The Node backend automatically:
1. Starts this Python service on startup
2. Checks health
3. Proxies all `/api/ai/*` requests
4. Handles errors and retries
5. Logs all operations

## Testing

### Health Check
```bash
curl http://localhost:8000/health
```

### Chat Message
```bash
curl -X POST http://localhost:8000/chat \
  -H "Content-Type: application/json" \
  -d '{"question": "How was PDF export implemented?"}'
```

### Get Status
```bash
curl http://localhost:8000/status
```

## Documentation

- **Quick Start**: See `../PYTHON_AI_QUICK_START.md`
- **Full Integration**: See `../PYTHON_AI_INTEGRATION.md`
- **Summary**: See `../PYTHON_AI_SUMMARY.md`

## Support

- **Logs**: Check `logs/ai.log`
- **Health**: Check `http://localhost:8000/health`
- **Status**: Check `http://localhost:8000/status`

---

**Status**: ✅ Production Ready
**Version**: 1.0.0
**Date**: May 20, 2026
