/**
 * AI System Configuration
 * Central configuration for all AI components
 */

// this is the aiConfig.js which includes the 
require('dotenv').config();

const AI_CONFIG = {
  // LLM Provider Configuration
  llm: {
    provider: process.env.AI_LLM_PROVIDER || 'openai', // 'openai', 'gemini', 'ollama'
    openai: {
      apiKey: process.env.OPENAI_API_KEY,
      model: process.env.OPENAI_MODEL || 'gpt-3.5-turbo',
      temperature: parseFloat(process.env.OPENAI_TEMPERATURE || '0.7'),
      maxTokens: parseInt(process.env.OPENAI_MAX_TOKENS || '2000'),
    },
    gemini: {
      apiKey: process.env.GEMINI_API_KEY,
      model: process.env.GEMINI_MODEL || 'gemini-pro',
      temperature: parseFloat(process.env.GEMINI_TEMPERATURE || '0.7'),
    },
    ollama: {
      baseUrl: process.env.OLLAMA_BASE_URL || 'http://localhost:11434',
      model: process.env.OLLAMA_MODEL || 'mistral',
    },
  },

  // Embedding Configuration
  embeddings: {
    provider: process.env.AI_EMBEDDING_PROVIDER || 'huggingface', // 'huggingface', 'openai'
    huggingface: {
      model: 'sentence-transformers/all-MiniLM-L6-v2',
      dimension: 384,
    },
    openai: {
      model: 'text-embedding-3-small',
      dimension: 1536,
    },
  },

  // Vector Database Configuration
  vectorDB: {
    type: process.env.AI_VECTOR_DB_TYPE || 'chroma', // 'chroma', 'pinecone', 'weaviate'
    chroma: {
      host: process.env.CHROMA_HOST || 'localhost',
      port: parseInt(process.env.CHROMA_PORT || '8000'),
      persistDir: process.env.CHROMA_PERSIST_DIR || './data/chroma',
      collectionName: 'project_knowledge',
    },
    pinecone: {
      apiKey: process.env.PINECONE_API_KEY,
      environment: process.env.PINECONE_ENVIRONMENT,
      index: process.env.PINECONE_INDEX || 'project-knowledge',
    },
  },

  // Chunking Configuration
  chunking: {
    chunkSize: parseInt(process.env.AI_CHUNK_SIZE || '1000'),
    chunkOverlap: parseInt(process.env.AI_CHUNK_OVERLAP || '200'),
    separators: ['\n\n', '\n', ' ', ''],
  },

  // Retrieval Configuration
  retrieval: {
    topK: parseInt(process.env.AI_TOP_K || '5'),
    similarityThreshold: parseFloat(process.env.AI_SIMILARITY_THRESHOLD || '0.5'),
  },

  // System Prompt
  systemPrompt: `You are an AI assistant trained exclusively on project files and documentation. 

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
- Explain the context and purpose of the code`,

  // Training Configuration
  training: {
    batchSize: parseInt(process.env.AI_BATCH_SIZE || '10'),
    maxConcurrentFiles: parseInt(process.env.AI_MAX_CONCURRENT_FILES || '5'),
    retryAttempts: parseInt(process.env.AI_RETRY_ATTEMPTS || '3'),
    retryDelay: parseInt(process.env.AI_RETRY_DELAY || '1000'),
  },

  // File Watcher Configuration
  watcher: {
    enabled: process.env.AI_WATCHER_ENABLED !== 'false',
    debounceMs: parseInt(process.env.AI_WATCHER_DEBOUNCE || '2000'),
    watchPaths: [
      'frontend',
      'backend',
      'python-ai',
      'docs',
      'templates',
      'MD Files Documents',
    ],
  },

  // Logging Configuration
  logging: {
    level: process.env.AI_LOG_LEVEL || 'info', // 'debug', 'info', 'warn', 'error'
    logFile: process.env.AI_LOG_FILE || './logs/ai.log',
  },

  // Cache Configuration
  cache: {
    enabled: process.env.AI_CACHE_ENABLED !== 'false',
    ttl: parseInt(process.env.AI_CACHE_TTL || '3600'), // 1 hour
  },

  // Database Configuration
  database: {
    mongoUri: process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-knowledge',
  },
};

module.exports = AI_CONFIG;
