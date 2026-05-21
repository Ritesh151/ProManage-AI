# AI Knowledge LLM + RAG System Documentation

## Overview

This document describes the integrated AI Knowledge LLM + RAG (Retrieval-Augmented Generation) system that has been added to your MERN application. The system automatically learns from all your projects, builds a centralized knowledge base, and allows users to ask intelligent questions about any project.

## Architecture

### Components

1. **Project Discovery Service** - Automatically discovers projects from configured paths
2. **Ingestion Service** - Reads and processes project files
3. **Embedding Service** - Generates vector embeddings for semantic search
4. **Training Service** - Orchestrates the complete training pipeline
5. **Chat Service** - Handles user queries and LLM interactions
6. **Watcher Service** - Monitors file changes and updates the knowledge base
7. **Vector Database** - Stores embeddings (Chroma, Pinecone, or in-memory)

### Technology Stack

- **Embedding Model**: sentence-transformers/all-MiniLM-L6-v2 (384-dimensional vectors)
- **Vector Database**: Chroma (with fallback to in-memory storage)
- **LLM Providers**: OpenAI, Gemini, or Ollama (local)
- **Framework**: LangChain-compatible architecture
- **Database**: MongoDB (for metadata and chat history)

## Installation & Setup

### 1. Install Dependencies

```bash
cd backend
npm install
```

### 2. Configure Environment Variables

Copy `.env.example` to `.env` and configure:

```bash
cp .env.example .env
```

Edit `.env` with your settings:

```env
# Database
MONGODB_URI=mongodb://localhost:27017/ai-knowledge

# LLM Provider (choose one)
AI_LLM_PROVIDER=openai
OPENAI_API_KEY=your_key_here

# Or use Gemini
# AI_LLM_PROVIDER=gemini
# GEMINI_API_KEY=your_key_here

# Or use local Ollama
# AI_LLM_PROVIDER=ollama
# OLLAMA_BASE_URL=http://localhost:11434
```

### 3. Start MongoDB

```bash
# Using Docker
docker run -d -p 27017:27017 --name mongodb mongo:latest

# Or use your local MongoDB installation
mongod
```

### 4. (Optional) Start Chroma Vector Database

```bash
# Using Docker
docker run -d -p 8000:8000 --name chroma ghcr.io/chroma-core/chroma:latest

# Or install locally
pip install chroma-db
chroma run --host localhost --port 8000
```

### 5. Start the Backend Server

```bash
npm run dev
```

The server will automatically:
- Initialize the AI system
- Discover projects from configured paths
- Start training if no documents exist
- Begin monitoring file changes

## Configuration

### Project Paths

Edit `backend/ai/config/projectPaths.js` to add custom project directories:

```javascript
const PROJECT_PATHS = [
  path.join(__dirname, '../../..'),  // Current project
  path.join(os.homedir(), 'Projects'),
  'D:\\Projects',  // Windows
  '/home/user/projects',  // Linux
];
```

### Supported File Types

The system automatically processes:
- Code files: `.js`, `.jsx`, `.ts`, `.tsx`, `.py`, `.java`, `.kt`, `.dart`
- Documentation: `.md`, `.txt`
- Configuration: `.json`, `.yaml`, `.env`, `package.json`, `requirements.txt`
- Documents: `.pdf`, `.docx`

### LLM Configuration

#### OpenAI

```env
AI_LLM_PROVIDER=openai
OPENAI_API_KEY=sk-...
OPENAI_MODEL=gpt-3.5-turbo
OPENAI_TEMPERATURE=0.7
OPENAI_MAX_TOKENS=2000
```

#### Gemini

```env
AI_LLM_PROVIDER=gemini
GEMINI_API_KEY=...
GEMINI_MODEL=gemini-pro
```

#### Ollama (Local)

```env
AI_LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
OLLAMA_MODEL=mistral
```

## API Endpoints

### Training

**POST** `/api/ai/train`
- Start full training of the knowledge base
- Scans all projects, ingests files, generates embeddings

**POST** `/api/ai/retrain`
- Start incremental training (only changed files)
- Faster than full training

**GET** `/api/ai/status`
- Get current training status and statistics
- Returns document count, processing progress, etc.

**GET** `/api/ai/training-history`
- Get past training sessions
- Query parameter: `limit` (default: 10)

**GET** `/api/ai/training-stats`
- Get training statistics
- Total sessions, success rate, average time, etc.

### Chat

**POST** `/api/ai/chat`
```json
{
  "question": "How was PDF export implemented?",
  "conversationId": "conv-123",
  "userId": "user-123"
}
```

Response:
```json
{
  "success": true,
  "conversationId": "conv-123",
  "answer": "The PDF export was implemented using...",
  "sources": [
    {
      "filename": "exportService.js",
      "projectName": "Project B",
      "similarity": 0.95
    }
  ],
  "responseTime": 1234
}
```

**GET** `/api/ai/conversation/:conversationId`
- Get conversation history

**GET** `/api/ai/conversations`
- Get user's conversations
- Query parameters: `userId`, `limit`

**DELETE** `/api/ai/conversation/:conversationId`
- Clear/archive a conversation

**POST** `/api/ai/feedback`
- Submit feedback on AI response
```json
{
  "conversationId": "conv-123",
  "rating": 5,
  "comment": "Very helpful!",
  "helpful": true
}
```

### Projects

**GET** `/api/ai/projects`
- Get all discovered projects
- Returns project metadata and statistics

## CLI Commands

### Train AI

```bash
npm run train-ai
```

Starts full training and displays progress.

### Retrain AI

```bash
npm run retrain-ai
```

Starts incremental training for changed files.

### Check AI Status

```bash
npm run ai-status
```

Displays detailed AI system status and statistics.

## Frontend Integration

### AIChat Page

The AI Chat page is available at `/ai` (add to your router):

```jsx
import AIChat from './pages/AIChat';

// In your router
<Route path="/ai" element={<AIChat />} />
```

### Features

- **Chat Interface**: ChatGPT-style conversation UI
- **Project Sidebar**: Shows discovered projects and training status
- **Chat History**: View and load previous conversations
- **Source References**: See which files the AI used to answer
- **Real-time Status**: Monitor training progress
- **Example Questions**: Quick-start suggestions

### Environment Variables (Frontend)

```env
REACT_APP_API_URL=http://localhost:5000/api
```

## Database Models

### AIDocument

Stores metadata about indexed documents:
- `filename`, `filepath`, `projectName`, `projectPath`
- `language`, `fileType`, `fileSize`, `fileHash`
- `content`, `summary`, `keywords`
- `chunks`, `totalChunks`
- `processed`, `embeddingsGenerated`

### AITrainingSession

Tracks training sessions:
- `sessionId`, `status`, `type` (full/incremental)
- `totalProjects`, `projectsProcessed`
- `totalFiles`, `filesProcessed`
- `totalChunks`, `chunksCreated`
- `embeddingsGenerated`, `errors`
- `startTime`, `endTime`, `duration`
- `results` (statistics)

### AIChatHistory

Stores conversation history:
- `conversationId`, `userId`
- `messages` (array of user/assistant messages)
- `retrievedDocuments` (sources used)
- `userFeedback` (rating, comment)
- `tokensUsed`, `responseTime`

## File Watcher

The system automatically monitors changes to:
- `README.md`
- `src/` directory
- `backend/` directory
- `docs/` directory
- `package.json`

When files change:
1. File is re-ingested
2. New embeddings are generated
3. Vector database is updated
4. Changes are reflected immediately

## System Prompt

The AI uses this system prompt to ensure accurate responses:

```
You are an AI assistant trained exclusively on project files and documentation.

CRITICAL RULES:
1. Never hallucinate or invent information
2. Answer ONLY using information from the project files provided
3. Always mention the source file names and paths
4. Always mention the project names
5. If information is not available, respond with: "I could not find this information in the project files."
6. Never invent code or solutions not present in the projects
7. Be specific and cite exact locations in the code
8. Provide context about where information is found
```

## Performance Optimization

### Chunking

- **Chunk Size**: 1000 characters (configurable)
- **Overlap**: 200 characters (for context preservation)
- **Separators**: Breaks at paragraph, line, word, or character boundaries

### Caching

- Embeddings are cached in memory
- Chat responses are cached (1 hour TTL)
- Disable with `AI_CACHE_ENABLED=false`

### Batch Processing

- Files processed in batches of 10 (configurable)
- Max 5 concurrent file operations
- Automatic retry with exponential backoff

## Troubleshooting

### No Documents Found

1. Check `PROJECT_PATHS` configuration
2. Verify project directories exist
3. Run `npm run train-ai` manually
4. Check logs: `tail -f logs/ai.log`

### Slow Training

1. Reduce `AI_CHUNK_SIZE` for faster processing
2. Increase `AI_MAX_CONCURRENT_FILES`
3. Use local Ollama instead of API-based LLMs
4. Disable file watcher: `AI_WATCHER_ENABLED=false`

### Poor Answer Quality

1. Ensure documents are properly indexed
2. Check `AI_TOP_K` (increase to 10)
3. Lower `AI_SIMILARITY_THRESHOLD` (try 0.3)
4. Verify LLM API key and model
5. Check system prompt in `aiConfig.js`

### Vector Database Connection Issues

1. Verify Chroma is running: `curl http://localhost:8000/api/v1/heartbeat`
2. Check `CHROMA_HOST` and `CHROMA_PORT`
3. System falls back to in-memory storage if Chroma unavailable
4. Check logs for connection errors

## Monitoring

### Logs

Logs are written to `logs/ai.log` with configurable levels:

```env
AI_LOG_LEVEL=debug  # debug, info, warn, error
```

### Metrics

Monitor these metrics:
- Documents indexed
- Chunks created
- Embeddings generated
- Average response time
- Training success rate
- Cache hit rate

## Security Considerations

1. **API Keys**: Store in `.env`, never commit
2. **File Access**: Only reads project files, no modifications
3. **Data Privacy**: Chat history stored locally in MongoDB
4. **Rate Limiting**: Implement in production
5. **Authentication**: Add user authentication to chat endpoints

## Scaling

### For Large Projects

1. Use Pinecone or Weaviate instead of Chroma
2. Implement distributed training
3. Use GPU-accelerated embeddings
4. Implement caching layer (Redis)
5. Use async job queue (Bull, RabbitMQ)

### For Multiple Users

1. Add user authentication
2. Implement per-user knowledge bases
3. Add role-based access control
4. Implement rate limiting
5. Use connection pooling for MongoDB

## Future Enhancements

- [ ] Multi-language support
- [ ] Custom embedding models
- [ ] Fine-tuning on project-specific data
- [ ] Streaming responses
- [ ] Voice input/output
- [ ] Collaborative knowledge base
- [ ] Analytics dashboard
- [ ] Export/import knowledge base

## Support

For issues or questions:
1. Check logs: `logs/ai.log`
2. Run `npm run ai-status`
3. Verify configuration in `.env`
4. Check MongoDB connection
5. Verify LLM API keys

## License

This AI system is part of your MERN application and follows the same license.
