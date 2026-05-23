const crypto = require('crypto');

class AIEmbeddingService {
  constructor() {
    this.cache = new Map();
    this.dimension = 384;
  }

  generateEmbedding(text) {
    if (!text || !text.trim()) return null;
    const cacheKey = crypto.createHash('sha256').update(text).digest('hex');
    if (this.cache.has(cacheKey)) return this.cache.get(cacheKey);

    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const embedding = new Array(this.dimension).fill(0);

    for (const word of words) {
      let hash = 0;
      for (let i = 0; i < word.length; i++) {
        hash = ((hash << 5) - hash) + word.charCodeAt(i);
        hash = hash & hash;
      }
      const index = Math.abs(hash) % this.dimension;
      embedding[index] += 1;
    }

    const magnitude = Math.sqrt(embedding.reduce((sum, val) => sum + val * val, 0));
    if (magnitude > 0) {
      for (let i = 0; i < embedding.length; i++) {
        embedding[i] /= magnitude;
      }
    }

    this.cache.set(cacheKey, embedding);
    return embedding;
  }

  cosineSimilarity(vecA, vecB) {
    if (!vecA || !vecB || vecA.length !== vecB.length) return 0;
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < vecA.length; i++) {
      dot += vecA[i] * vecB[i];
      magA += vecA[i] * vecA[i];
      magB += vecB[i] * vecB[i];
    }
    magA = Math.sqrt(magA);
    magB = Math.sqrt(magB);
    if (magA === 0 || magB === 0) return 0;
    return dot / (magA * magB);
  }

  clearCache() {
    this.cache.clear();
  }
}

module.exports = new AIEmbeddingService();
