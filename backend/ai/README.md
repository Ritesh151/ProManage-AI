# AI Knowledge LLM + RAG System

## Overview

This is a production-grade AI Knowledge system that automatically learns from your projects and enables intelligent semantic search through a chat interface.

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp ../.env.example ../.env
# Edit .env and add OPENAI_API_KEY
```

### 3. Start Services
```bash
# Terminal 1: MongoDB
docker run -d -p 27017:27017 mongo:latest

# Terminal 2: Backend
npm run dev

# Terminal 3: Frontend
cd ../../frontend && npm start
```

### 4. Train AI
```bash
npm run train-ai
```

### 5. Access Chat
Open browser to `http://localhost:3000/ai`

## Architecture

```
┌─────────────────────────────────────────────────────────┐
│                    Frontend (React)                      │
│  AIChat.jsx → AIChatWindow → AIMessage → AIProjectSidebar│
└────────────────────┬────────────────────────────────────┘
                     │ HTTP
┌────────────────────▼────────────────────────────────────┐
│              Backend (Express + Node.js)                │
│  aiRoutes → aiController → Services                     │
└────────────────────┬────────────────────────────────────┘
                     │
        ┌────────────┼────────────┐
        │            │            │
    ┌───▼──┐    ┌───▼──┐    ┌───▼──┐
    │ MongoDB  │ Chroma   │ LLM API │
    │ (Metadata)│ (Vectors)│ (OpenAI)│
    └────────┘    └────────┘    └────────┘
```

## Services

### AIProjectDiscoveryService
Discovers projects from configured paths
- Scans directories recursively
- Detects project type
- Catalogs projects

### AIIngestService
Processes and ingests files
- Reads file content
- Extracts metadata
- Chunks text intelligently
- Detects changes via hashing

### AIEmbeddingService
Generates vector embeddings
- Converts text to 384-dim vectors
- Stores in vector database
- Performs similarity search
- Caches embeddings

### AITrainingService
Orchestrates training pipeline
- Full training mode
- Incremental training mode
- Progress tracking
- Error handling

### AIChatService
Handles chat interactions
- Retrieves relevant documents
- Calls LLM API
- Maintains conversation history
- Attributes sources

### AIWatcherService
Monitors file changes
- Watches project directories
- Detects file modifications
- Triggers re-indexing
- Debounces updates

## Configuration

### Environment Variables

```env
# LLM Provider
AI_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...

# Embedding
AI_EMBEDDING_PROVIDER=huggingface

# Vector Database
AI_VECTOR_DB_TYPE=chroma
CHROMA_HOST=localhost
CHROMA_PORT=8000

# Chunking
AI_CHUNK_SIZE=1000
AI_CHUNK_OVERLAP=200

# Retrieval
AI_TOP_K=5
AI_SIMILARITY_THRESHOLD=0.5

# Training
AI_BATCH_SIZE=10
AI_MAX_CONCURRENT_FILES=5

# Watcher
AI_WATCHER_ENABLED=true
AI_WATCHER_DEBOUNCE=2000

# Logging
AI_LOG_LEVEL=info
AI_LOG_FILE=./logs/ai.log
```

### Project Paths

Edit `config/projectPaths.js`:

```javascript
const PROJECT_PATHS = [
  path.join(__dirname, '../../..'),
  'D:\\MyProjects',
  '/home/user/projects',
];
```

## API Endpoints

### Training
- `POST /api/ai/train` - Start full training
- `POST /api/ai/retrain` - Start incremental training
- `GET /api/ai/status` - Get system status
- `GET /api/ai/training-history` - Get training sessions
- `GET /api/ai/training-stats` - Get statistics

### Chat
- `POST /api/ai/chat` - Send message
- `GET /api/ai/conversation/:id` - Get conversation
- `GET /api/ai/conversations` - Get user conversations
- `DELETE /api/ai/conversation/:id` - Clear conversation
- `POST /api/ai/feedback` - Submit feedback

### Projects
- `GET /api/ai/projects` - Get discovered projects

## CLI Commands

```bash
# Full training
npm run train-ai

# Incremental training
npm run retrain-ai

# Check status
npm run ai-status
```

## Database Models

### AIDocument
```javascript
{
  filename: String,
  filepath: String,
  projectName: String,
  projectPath: String,
  projectType: String,
  language: String,
  fileType: String,
  fileSize: Number,
  fileHash: String,
  content: String,
  summary: String,
  keywords: [String],
  chunks: [{
    chunkId: String,
    chunkIndex: Number,
    content: String,
    embeddingId: String,
  }],
  totalChunks: Number,
  processed: Boolean,
  embeddingsGenerated: Boolean,
  createdAt: Date,
  updatedAt: Date,
}
```

### AITrainingSession
```javascript
{
  sessionId: String,
  status: String, // pending, in_progress, completed, failed
  type: String, // full, incremental, retrain
  totalProjects: Number,
  projectsProcessed: Number,
  totalFiles: Number,
  filesProcessed: Number,
  totalChunks: Number,
  chunksCreated: Number,
  embeddingsGenerated: Number,
  errors: [{
    file: String,
    error: String,
    timestamp: Date,
  }],
  errorCount: Number,
  startTime: Date,
  endTime: Date,
  duration: Number,
  results: {
    projectsScanned: Number,
    documentsIndexed: Number,
    vectorsStored: Number,
    successRate: Number,
  },
}
```

### AIChatHistory
```javascript
{
  conversationId: String,
  userId: String,
  messages: [{
    role: String, // user, assistant
    content: String,
    timestamp: Date,
  }],
  lastQuery: String,
  retrievedDocuments: [{
    documentId: ObjectId,
    filename: String,
    projectName: String,
    similarity: Number,
    content: String,
  }],
  lastResponse: String,
  responseTime: Number,
  tokensUsed: {
    prompt: Number,
    completion: Number,
    total: Number,
  },
  userFeedback: {
    rating: Number,
    comment: String,
    helpful: Boolean,
  },
  status: String, // active, archived, deleted
  createdAt: Date,
  updatedAt: Date,
}
```

## File Structure

```
ai/
├── config/
│   ├── aiConfig.js              # Main configuration
│   └── projectPaths.js          # Project paths
├── models/
│   ├── AIDocument.js            # Document model
│   ├── AITrainingSession.js      # Training model
│   └── AIChatHistory.js          # Chat history model
├── services/
│   ├── AIProjectDiscoveryService.js
│   ├── AIIngestService.js
│   ├── AIEmbeddingService.js
│   ├── AITrainingService.js
│   ├── AIChatService.js
│   └── AIWatcherService.js
├── controllers/
│   └── aiController.js          # API handlers
├── routes/
│   └── aiRoutes.js              # API routes
├── utils/
│   ├── logger.js                # Logging
│   ├── fileUtils.js             # File operations
│   └── textUtils.js             # Text processing
├── scripts/
│   ├── trainAI.js               # CLI: Train
│   ├── retrainAI.js             # CLI: Retrain
│   └── aiStatus.js              # CLI: Status
├── init.js                      # Initialization
└── README.md                    # This file
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

### Storage
- MongoDB: ~1-2 MB per 1000 documents
- Vector DB: ~1 MB per 1000 embeddings
- Logs: ~10 MB per month

## Troubleshooting

### No documents found
```bash
npm run train-ai
```

### Connection refused
- Check MongoDB: `docker ps`
- Check backend: `curl http://localhost:5000/api/health`

### API key invalid
- Verify key in `.env`
- Check key has API access

### Slow responses
- First response slower (embedding generation)
- Check logs: `tail -f logs/ai.log`

## Logging

Logs are written to `logs/ai.log` with configurable levels:

```env
AI_LOG_LEVEL=debug  # debug, info, warn, error
```

View logs:
```bash
tail -f logs/ai.log
```

## Security

- API keys stored in `.env` (never commit)
- Input validation on all endpoints
- File path sanitization
- Error handling for all operations

## Deployment

### Development
```bash
npm run dev
```

### Production
```bash
NODE_ENV=production npm start
```

### Docker
```dockerfile
FROM node:18
WORKDIR /app
COPY . .
RUN npm install
EXPOSE 5000
CMD ["npm", "start"]
```

## Support

- **Documentation**: See `../../AI_SYSTEM_DOCUMENTATION.md`
- **Quick Start**: See `../../AI_QUICK_START.md`
- **Integration**: See `../../INTEGRATION_GUIDE.md`
- **Logs**: Check `logs/ai.log`
- **Status**: Run `npm run ai-status`

## License

Same as parent project.
