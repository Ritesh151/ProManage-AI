# AI System Quick Start Guide

## 5-Minute Setup

### Step 1: Install Dependencies

```bash
cd backend
npm install
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

**Terminal 1 - MongoDB:**
```bash
docker run -d -p 27017:27017 --name mongodb mongo:latest
```

**Terminal 2 - Backend:**
```bash
cd backend
npm run dev
```

The server will automatically start training the AI system.

**Terminal 3 - Frontend:**
```bash
cd frontend
npm start
```

### Step 4: Access AI Chat

Open your browser and navigate to:
```
http://localhost:3000/ai
```

## First Training

The system automatically trains on startup. To manually trigger training:

```bash
npm run train-ai
```

Check status:
```bash
npm run ai-status
```

## Example Questions

Try asking:
- "How was the PDF export implemented?"
- "What technologies are used in the backend?"
- "Explain the project structure"
- "How does the proposal generation work?"
- "What are the main components?"

## Configuration

### Add More Project Paths

Edit `backend/ai/config/projectPaths.js`:

```javascript
const PROJECT_PATHS = [
  path.join(__dirname, '../../..'),
  'D:\\MyProjects',  // Add your paths
  '/home/user/projects',
];
```

### Switch LLM Provider

**Use Gemini:**
```env
AI_LLM_PROVIDER=gemini
GEMINI_API_KEY=your-key
```

**Use Local Ollama:**
```env
AI_LLM_PROVIDER=ollama
OLLAMA_BASE_URL=http://localhost:11434
```

## Troubleshooting

### "No documents found"
```bash
npm run train-ai
```

### "Connection refused"
- Check MongoDB is running: `docker ps`
- Check backend is running on port 5000

### "API key invalid"
- Verify `OPENAI_API_KEY` in `.env`
- Check key has API access enabled

### "Slow responses"
- First response is slower (embedding generation)
- Subsequent responses use cache
- Check `AI_LOG_LEVEL=debug` for details

## Next Steps

1. **Customize System Prompt**: Edit `backend/ai/config/aiConfig.js`
2. **Add More Projects**: Update `projectPaths.js`
3. **Monitor Training**: Run `npm run ai-status`
4. **View Logs**: `tail -f logs/ai.log`
5. **Integrate with UI**: Add AI Chat link to your navigation

## API Examples

### Train AI
```bash
curl -X POST http://localhost:5000/api/ai/train
```

### Ask Question
```bash
curl -X POST http://localhost:5000/api/ai/chat \
  -H "Content-Type: application/json" \
  -d '{
    "question": "How does the system work?",
    "conversationId": "conv-1",
    "userId": "user-1"
  }'
```

### Get Status
```bash
curl http://localhost:5000/api/ai/status
```

## Performance Tips

1. **First Training**: May take 5-10 minutes depending on project size
2. **Incremental Updates**: Use `npm run retrain-ai` for faster updates
3. **Caching**: Responses are cached for 1 hour
4. **Batch Processing**: Files processed in batches of 10

## Production Deployment

1. Set `NODE_ENV=production`
2. Use managed MongoDB (Atlas, etc.)
3. Use managed vector DB (Pinecone, etc.)
4. Add authentication to `/api/ai` endpoints
5. Implement rate limiting
6. Use environment-specific configs

## Support

- **Documentation**: See `AI_SYSTEM_DOCUMENTATION.md`
- **Logs**: Check `logs/ai.log`
- **Status**: Run `npm run ai-status`
- **Issues**: Check MongoDB and API keys

## What's Included

✅ Automatic project discovery
✅ Intelligent file ingestion
✅ Vector embeddings (384-dim)
✅ Semantic search
✅ LLM integration (OpenAI/Gemini/Ollama)
✅ Chat history
✅ File watcher
✅ Training pipeline
✅ CLI tools
✅ React UI components
✅ Production-ready code
✅ Comprehensive logging

Enjoy your AI-powered project assistant! 🚀
