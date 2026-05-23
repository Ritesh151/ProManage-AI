/**
 * Semantic Search Service
 * Vector similarity search with document enrichment
 */

const AIEmbeddingService = require('./AIEmbeddingService');
const AIDocument = require('../models/AIDocument');
const AILogger = require('../utils/logger');

const logger = new AILogger('SemanticSearch');

class SemanticSearchService {
  constructor() {
    this.embeddingService = new AIEmbeddingService();
  }

  async search(query, limit = 5) {
    if (!query || !query.trim()) {
      throw new Error('Query is required');
    }

    const queryEmbedding = await this.embeddingService.generateEmbedding(query.trim());
    let vectorResults = await this.embeddingService.searchSimilar(queryEmbedding, limit);

    if (!vectorResults || vectorResults.length === 0) {
      vectorResults = await this.searchDocumentsFallback(query, limit);
    }

    const enriched = await Promise.all(
      vectorResults.map((r) => this.enrichResult(r, query))
    );

    return {
      query,
      results: enriched,
      retrievedFrom: vectorResults.length > 0 ? 'vector_db' : 'mongodb',
      count: enriched.length,
    };
  }

  async searchDocumentsFallback(query, limit) {
    const docs = await AIDocument.find({
      processed: true,
      $or: [
        { content: { $regex: query.split(/\s+/).slice(0, 3).join('|'), $options: 'i' } },
        { 'chunks.content': { $regex: query.split(/\s+/).slice(0, 3).join('|'), $options: 'i' } },
      ],
    })
      .limit(limit * 2)
      .select('filename filepath projectName chunks content');

    const results = [];
    for (const doc of docs) {
      for (const chunk of doc.chunks || []) {
        if (results.length >= limit) break;
        const score = this.textRelevance(query, chunk.content);
        if (score > 0.1) {
          results.push({
            id: chunk.chunkId || `${doc._id}-${chunk.chunkIndex}`,
            content: chunk.content,
            similarity: score,
            sourceFile: doc.filepath,
            filename: doc.filename,
            projectName: doc.projectName,
            chunkIndex: chunk.chunkIndex,
          });
        }
      }
    }

    return results.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
  }

  textRelevance(query, text) {
    if (!text) return 0;
    const terms = query.toLowerCase().split(/\s+/).filter(Boolean);
    const lower = text.toLowerCase();
    let hits = 0;
    for (const t of terms) {
      if (lower.includes(t)) hits += 1;
    }
    return terms.length ? hits / terms.length : 0;
  }

  async enrichResult(result, query) {
    const content = result.content || '';
    let sourceFile = result.sourceFile || null;
    let filename = result.filename || null;
    let projectName = result.projectName || null;
    let chunkIndex = result.chunkIndex;

    if (!sourceFile && content) {
      const snippet = content.substring(0, 120).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      const doc = await AIDocument.findOne({
        $or: [
          { 'chunks.content': { $regex: snippet.substring(0, 40), $options: 'i' } },
          { content: { $regex: snippet.substring(0, 40), $options: 'i' } },
        ],
      }).select('filename filepath projectName chunks');

      if (doc) {
        sourceFile = doc.filepath;
        filename = doc.filename;
        projectName = doc.projectName;
        const match = (doc.chunks || []).find((c) => c.content === content || content.includes(c.content?.substring(0, 50)));
        if (match) chunkIndex = match.chunkIndex;
      }
    }

    const similarity = result.similarity ?? (result.distance != null ? 1 - result.distance : 0.5);

    return {
      id: result.id,
      content,
      similarity: Math.round(similarity * 1000) / 1000,
      scorePercent: Math.round(similarity * 100),
      sourceFile,
      filename: filename || (sourceFile ? sourceFile.split(/[/\\]/).pop() : 'unknown'),
      projectName,
      chunkIndex,
      highlight: this.highlightMatches(content, query),
      retrievedFrom: 'vector_db',
    };
  }

  highlightMatches(text, query) {
    if (!text) return '';
    const terms = query.split(/\s+/).filter((t) => t.length > 2);
    let highlighted = text.substring(0, 500);
    for (const term of terms) {
      const re = new RegExp(`(${term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
      highlighted = highlighted.replace(re, '**$1**');
    }
    return highlighted;
  }
}

module.exports = SemanticSearchService;
