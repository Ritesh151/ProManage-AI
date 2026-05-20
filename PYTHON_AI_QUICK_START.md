# Python AI Microservice - Quick Start

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd python-ai
pip install -r requirements.txt
```

### Step 2: Configure Environment

```bash
cp .env.example .env
```

Edit `.env` and add your OpenAI API key:
```env
OPENAI_API_KEY=sk-your-key-here
```

### Step 3: Start Services

**Terminal 1 - Python AI Service:**
```bash
cd python-ai
python app.py
```

**Terminal 2 - Node Backend:**
```bash
cd backend
npm run dev
```

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

### Step 4: Test

```bash
# Check Python service health
curl http://localhost:8000/health

# Check Node backend
curl http://localhost:5000/api/health

# Get AI status
curl http://localhost:5000/api/ai/status
```

## Architecture

```
Frontend (React)
    ↓
Node Backend (Express)
    ↓
Python Service (FastAPI)
    ↓
LangChain + LLM + Embeddings + ChromaDB
```

## Key Features

✅ Automatic project discovery
✅ Intelligent file ingestion
✅ Vector embeddings (384-dim)
✅ Semantic search
✅ LLM integration (OpenAI/Gemini/Ollama)
✅ Chat interface
✅ File watcher
✅ Training pipeline
✅ Health checks
✅ Error handling
✅ Logging

## API Endpoints

### Python Service (Direct)
- `GET http://localhost:8000/health` - Health check
- `POST http://localhost:8000/train` - Start training
- `POST http://localhost:8000/chat` - Send message
- `GET http://localhost:8000/status` - Get status

### Node Backend (Proxy)
- `GET http://localhost:5000/api/ai/health` - Health check
- `POST http://localhost:5000/api/ai/train` - Start training
- `POST http://localhost:5000/api/ai/chat` - Send message
- `GET http://localhost:5000/api/ai/status` - Get status

## Configuration

### LLM Provider

**OpenAI (default):**
```env
AI_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
```

**Gemini:**
```env
AI_LLM_PROVIDER=gemini
GEMINI_API_KEY=...
```

**Local Ollama:**
```env
AI_LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

### Project Paths

Edit `python-ai/config/projectPaths.py`:
```python
PROJECT_PATHS = [
    str(Path(__file__).parent.parent.parent),
    os.path.expanduser("~/Projects"),
    "D:\\MyProjects",
]
```

## Troubleshooting

### Python service won't start
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
tail -f python-ai/logs/ai.log
```

### Chat returns errors
```bash
# Check API key
echo $OPENAI_API_KEY

# Check logs
tail -f python-ai/logs/ai.log

# Check status
curl http://localhost:5000/api/ai/status
```

## Example Usage

### Start Training
```bash
curl -X POST http://localhost:5000/api/ai/train
```

### Send Chat Message
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How was PDF export implemented?",
    "conversationId": "conv-1",
    "userId": "user-1"
  }'
```

### Get Status
```bash
curl http://localhost:5000/api/ai/status
```

### Get Projects
```bash
curl http://localhost:5000/api/ai/projects
```

## Performance Tips

1. **First Training**: May take 5-10 minutes
2. **Incremental Updates**: Use `npm run retrain-ai` for faster updates
3. **Caching**: Responses are cached for 1 hour
4. **Batch Processing**: Files processed in batches of 10

## Production Deployment

### Using Gunicorn
```bash
pip install gunicorn
gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

### Using Docker
```bash
docker build -t python-ai .
docker run -p 8000:8000 python-ai
```

### Environment Variables
```env
ENVIRONMENT=production
DEBUG=false
AI_LOG_LEVEL=warn
```

## Monitoring

### Check Health
```bash
curl http://localhost:8000/health
```

### View Logs
```bash
tail -f python-ai/logs/ai.log
```

### Get Status
```bash
curl http://localhost:5000/api/ai/status
```

## Next Steps

1. ✅ Install dependencies
2. ✅ Configure `.env`
3. ✅ Start Python service
4. ✅ Start Node backend
5. ✅ Test endpoints
6. ✅ Run training
7. ✅ Test chat interface

## Support

- **Full Documentation**: See `PYTHON_AI_INTEGRATION.md`
- **Logs**: Check `python-ai/logs/ai.log`
- **Health**: Check `http://localhost:8000/health`
- **Status**: Check `http://localhost:5000/api/ai/status`

---

**Status**: ✅ Ready to use
**Version**: 1.0.0
**Date**: May 20, 2026

Enjoy your Python-powered AI system! 🚀
