/**
 * AI Embedding Service
 * Handles embedding generation and vector storage
 */

const axios = require('axios');
const AIDocument = require('../models/AIDocument');
const AILogger = require('../utils/logger');
const AI_CONFIG = require('../config/aiConfig');

const logger = new AILogger('EmbeddingService');

class AIEmbeddingService {
  constructor() {
    this.embeddingCache = new Map();
    this.vectorStore = null;
    this.initializeVectorStore();
  }

  /**
   * Initialize vector store (Chroma)
   */
  async initializeVectorStore() {
    try {
      const chromaConfig = AI_CONFIG.vectorDB.chroma;
      const chromaUrl = `http://${chromaConfig.host}:${chromaConfig.port}`;

      // Test connection
      try {
        await axios.get(`${chromaUrl}/api/v1/heartbeat`);
        logger.info('Connected to Chroma vector database', { url: chromaUrl });
      } catch (err) {
        logger.warn('Chroma not available, using in-memory storage', { error: err.message });
        this.vectorStore = { vectors: new Map() };
        return;
      }

      this.chromaUrl = chromaUrl;
      this.chromaCollection = chromaConfig.collectionName;

      // Get or create collection
      await this.getOrCreateCollection();
    } catch (err) {
      logger.error('Error initializing vector store', { error: err.message });
      this.vectorStore = { vectors: new Map() };
    }
  }

  /**
   * Get or create Chroma collection
   */
  async getOrCreateCollection() {
    try {
      const response = await axios.post(
        `${this.chromaUrl}/api/v1/collections`,
        {
          name: this.chromaCollection,
          metadata: { 'hnsw:space': 'cosine' },
        }
      );
      logger.info('Created/retrieved Chroma collection', { collection: this.chromaCollection });
    } catch (err) {
      if (err.response?.status !== 409) { // 409 = already exists
        logger.warn('Error creating collection', { error: err.message });
      }
    }
  }

  /**
   * Generate embeddings for text
   */
  async generateEmbedding(text) {
    if (!text) {
      return null;
    }

    // Check cache
    const cacheKey = this.hashText(text);
    if (this.embeddingCache.has(cacheKey)) {
      return this.embeddingCache.get(cacheKey);
    }

    try {
      let embedding;

      if (AI_CONFIG.embeddings.provider === 'huggingface') {
        embedding = await this.generateHuggingFaceEmbedding(text);
      } else if (AI_CONFIG.embeddings.provider === 'openai') {
        embedding = await this.generateOpenAIEmbedding(text);
      } else {
        // Fallback: generate simple embedding
        embedding = this.generateSimpleEmbedding(text);
      }

      // Cache the embedding
      this.embeddingCache.set(cacheKey, embedding);
      return embedding;
    } catch (err) {
      logger.error('Error generating embedding', { error: err.message });
      return this.generateSimpleEmbedding(text);
    }
  }

  /**
   * Generate embedding using HuggingFace
   */
  async generateHuggingFaceEmbedding(text) {
    try {
      const response = await axios.post(
        'https://api-inference.huggingface.co/pipeline/feature-extraction',
        { inputs: text },
        {
          headers: {
            Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          },
        }
      );

      return response.data;
    } catch (err) {
      logger.error('Error with HuggingFace API', { error: err.message });
      throw err;
    }
  }

  /**
   * Generate embedding using OpenAI
   */
  async generateOpenAIEmbedding(text) {
    try {
      const response = await axios.post(
        'https://api.openai.com/v1/embeddings',
        {
          input: text,
          model: AI_CONFIG.embeddings.openai.model,
        },
        {
          headers: {
            Authorization: `Bearer ${AI_CONFIG.llm.openai.apiKey}`,
          },
        }
      );

      return response.data.data[0].embedding;
    } catch (err) {
      logger.error('Error with OpenAI API', { error: err.message });
      throw err;
    }
  }

  /**
   * Generate simple embedding (fallback)
   * Creates a basic vector representation using word frequencies
   */
  generateSimpleEmbedding(text) {
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const embedding = new Array(384).fill(0);

    for (const word of words) {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash) + word.charCodeAt(i);
        hash = hash & hash;
      }
      const index = Math.abs(hash) % 384;
      embedding[index] += 1;
    }

    // Normalize
    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      return embedding.map(val => val / magnitude);
    }

    return embedding;
  }

  /**
   * Hash text for caching
   */
  hashText(text) {
    const crypto = require('crypto');
    return crypto.createHash('sha256').update(text).digest('hex');
  }

  /**
   * Store embeddings in vector database
   */
  async storeEmbeddings(documentId, chunks, embeddings) {
    try {
      if (this.chromaUrl) {
        await this.storeInChroma(documentId, chunks, embeddings);
      } else {
        this.storeInMemory(documentId, chunks, embeddings);
      }

      logger.info('Stored embeddings', { documentId, embeddingCount: embeddings.length });
    } catch (err) {
      logger.error('Error storing embeddings', { documentId, error: err.message });
      throw err;
    }
  }

  /**
   * Store embeddings in Chroma
   */
  async storeInChroma(documentId, chunks, embeddings) {
    const ids = chunks.map((_, i) => `${documentId}-${i}`);
    const documents = chunks.map(chunk => chunk.content || chunk);
    const metadatas = chunks.map((chunk, i) => ({
      documentId,
      chunkIndex: i,
      projectName: chunk.projectName,
    }));

    await axios.post(
      `${this.chromaUrl}/api/v1/collections/${this.chromaCollection}/add`,
      {
        ids,
        embeddings,
        documents,
        metadatas,
      }
    );
  }

  /**
   * Store embeddings in memory
   */
  storeInMemory(documentId, chunks, embeddings) {
    if (!this.vectorStore.vectors) {
      this.vectorStore.vectors = new Map();
    }

    chunks.forEach((chunk, i) => {
      const id = `${documentId}-${i}`;
      this.vectorStore.vectors.set(id, {
        embedding: embeddings[i],
        content: chunk.content || chunk,
        documentId,
        chunkIndex: i,
      });
    });
  }

  /**
   * Search similar embeddings
   */
  async searchSimilar(queryEmbedding, topK = 5) {
    try {
      if (this.chromaUrl) {
        return await this.searchInChroma(queryEmbedding, topK);
      } else {
        return this.searchInMemory(queryEmbedding, topK);
      }
    } catch (err) {
      logger.error('Error searching similar embeddings', { error: err.message });
      return [];
    }
  }

  /**
   * Search in Chroma
   */
  async searchInChroma(queryEmbedding, topK) {
    const response = await axios.post(
      `${this.chromaUrl}/api/v1/collections/${this.chromaCollection}/query`,
      {
        query_embeddings: [queryEmbedding],
        n_results: topK,
      }
    );

    const results = [];
    if (response.data.ids && response.data.ids[0]) {
      for (let i = 0; i < response.data.ids[0].length; i++) {
        results.push({
          id: response.data.ids[0][i],
          content: response.data.documents[0][i],
          distance: response.data.distances[0][i],
          similarity: 1 - response.data.distances[0][i],
        });
      }
    }

    return results;
  }

  /**
   * Search in memory
   */
  searchInMemory(queryEmbedding, topK) {
    const results = [];

    for (const [id, vector] of this.vectorStore.vectors.entries()) {
      const similarity = this.cosineSimilarity(queryEmbedding, vector.embedding);
      results.push({
        id,
        content: vector.content,
        similarity,
      });
    }

    return results
      .sort((a, b) => b.similarity - a.similarity)
      .slice(0, topK);
  }

  /**
   * Calculate cosine similarity
   */
  cosineSimilarity(vec1, vec2) {
    let dotProduct = 0;
    let magnitude1 = 0;
    let magnitude2 = 0;

    for (let i = 0; i < vec1.length; i++) {
      dotProduct += vec1[i] * vec2[i];
      magnitude1 += vec1[i] * vec1[i];
      magnitude2 += vec2[i] * vec2[i];
    }

    magnitude1 = Math.sqrt(magnitude1);
    magnitude2 = Math.sqrt(magnitude2);

    if (magnitude1 === 0 || magnitude2 === 0) {
      return 0;
    }

    return dotProduct / (magnitude1 * magnitude2);
  }

  /**
   * Clear cache
   */
  clearCache() {
    this.embeddingCache.clear();
    logger.info('Cleared embedding cache');
  }
}

module.exports = AIEmbeddingService;
