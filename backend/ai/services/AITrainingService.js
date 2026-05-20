/**
 * AI Training Service
 * Orchestrates the training pipeline
 */

const AIProjectDiscoveryService = require('./AIProjectDiscoveryService');
const AIIngestService = require('./AIIngestService');
const AIEmbeddingService = require('./AIEmbeddingService');
const AITrainingSession = require('../models/AITrainingSession');
const AIDocument = require('../models/AIDocument');
const AILogger = require('../utils/logger');
const AI_CONFIG = require('../config/aiConfig');
const { v4: uuidv4 } = require('uuid');

const logger = new AILogger('TrainingService');

class AITrainingService {
  constructor() {
    this.projectDiscoveryService = new AIProjectDiscoveryService();
    this.ingestService = new AIIngestService();
    this.embeddingService = new AIEmbeddingService();
    this.currentSession = null;
  }

  /**
   * Start full training
   */
  async startFullTraining() {
    const sessionId = uuidv4();
    logger.info('Starting full training session', { sessionId });

    const session = await AITrainingSession.create({
      sessionId,
      status: 'in_progress',
      type: 'full',
      startTime: new Date(),
      config: {
        chunkSize: AI_CONFIG.chunking.chunkSize,
        chunkOverlap: AI_CONFIG.chunking.chunkOverlap,
        embeddingModel: AI_CONFIG.embeddings.provider,
        llmProvider: AI_CONFIG.llm.provider,
      },
    });

    this.currentSession = session;

    try {
      // Step 1: Discover projects
      logger.info('Step 1: Discovering projects');
      const projects = await this.projectDiscoveryService.discoverProjects();
      session.totalProjects = projects.length;
      await session.save();

      // Step 2: Ingest files
      logger.info('Step 2: Ingesting project files');
      let totalFiles = 0;
      let totalChunks = 0;

      for (const project of projects) {
        try {
          const result = await this.ingestService.ingestProject(project.path);
          session.projectsProcessed++;
          session.filesProcessed += result.filesProcessed;
          totalFiles += result.filesProcessed;

          if (result.errors.length > 0) {
            session.errors.push(...result.errors);
            session.errorCount += result.errors.length;
          }

          this.projectDiscoveryService.updateProjectStatus(project.path, 'processing');
          await session.save();
        } catch (err) {
          logger.error('Error ingesting project', { project: project.name, error: err.message });
          session.errors.push({ file: project.name, error: err.message });
          session.errorCount++;
          await session.save();
        }
      }

      session.totalFiles = totalFiles;

      // Step 3: Generate embeddings
      logger.info('Step 3: Generating embeddings');
      const unprocessedDocs = await this.ingestService.getUnprocessedDocuments(1000);
      session.totalChunks = unprocessedDocs.reduce((sum, doc) => sum + doc.totalChunks, 0);

      for (const doc of unprocessedDocs) {
        try {
          const embeddings = [];

          for (const chunk of doc.chunks) {
            const embedding = await this.embeddingService.generateEmbedding(chunk.content);
            embeddings.push(embedding);
            session.embeddingsGenerated++;
          }

          // Store embeddings
          await this.embeddingService.storeEmbeddings(doc._id.toString(), doc.chunks, embeddings);

          // Mark as processed
          await this.ingestService.markEmbeddingsGenerated(doc._id);
          await this.ingestService.markAsProcessed(doc._id);

          session.chunksCreated += doc.totalChunks;
          await session.save();
        } catch (err) {
          logger.error('Error processing document', { documentId: doc._id, error: err.message });
          session.errors.push({ file: doc.filename, error: err.message });
          session.errorCount++;
          await session.save();
        }
      }

      // Step 4: Finalize
      session.status = 'completed';
      session.endTime = new Date();
      session.results = {
        projectsScanned: session.projectsProcessed,
        documentsIndexed: await AIDocument.countDocuments({ processed: true }),
        vectorsStored: session.embeddingsGenerated,
        successRate: ((session.filesProcessed - session.errorCount) / session.filesProcessed) * 100,
      };

      await session.save();

      logger.info('Training session completed', {
        sessionId,
        duration: session.duration,
        results: session.results,
      });

      return session;
    } catch (err) {
      logger.error('Training session failed', { sessionId, error: err.message });
      session.status = 'failed';
      session.endTime = new Date();
      session.errors.push({ file: 'system', error: err.message });
      await session.save();
      throw err;
    }
  }

  /**
   * Start incremental training (only changed files)
   */
  async startIncrementalTraining() {
    const sessionId = uuidv4();
    logger.info('Starting incremental training session', { sessionId });

    const session = await AITrainingSession.create({
      sessionId,
      status: 'in_progress',
      type: 'incremental',
      startTime: new Date(),
    });

    this.currentSession = session;

    try {
      // Get projects
      const projects = await this.projectDiscoveryService.discoverProjects();
      session.totalProjects = projects.length;

      // Only process changed files
      for (const project of projects) {
        try {
          const result = await this.ingestService.ingestProject(project.path);
          session.projectsProcessed++;
          session.filesProcessed += result.filesProcessed;

          if (result.errors.length > 0) {
            session.errors.push(...result.errors);
            session.errorCount += result.errors.length;
          }

          await session.save();
        } catch (err) {
          logger.error('Error in incremental training', { project: project.name, error: err.message });
          session.errorCount++;
          await session.save();
        }
      }

      // Generate embeddings for new/changed documents
      const unprocessedDocs = await this.ingestService.getUnprocessedDocuments(1000);

      for (const doc of unprocessedDocs) {
        try {
          const embeddings = [];

          for (const chunk of doc.chunks) {
            const embedding = await this.embeddingService.generateEmbedding(chunk.content);
            embeddings.push(embedding);
            session.embeddingsGenerated++;
          }

          await this.embeddingService.storeEmbeddings(doc._id.toString(), doc.chunks, embeddings);
          await this.ingestService.markEmbeddingsGenerated(doc._id);
          await this.ingestService.markAsProcessed(doc._id);

          session.chunksCreated += doc.totalChunks;
          await session.save();
        } catch (err) {
          logger.error('Error processing document', { documentId: doc._id, error: err.message });
          session.errorCount++;
          await session.save();
        }
      }

      session.status = 'completed';
      session.endTime = new Date();
      await session.save();

      logger.info('Incremental training completed', { sessionId });
      return session;
    } catch (err) {
      logger.error('Incremental training failed', { sessionId, error: err.message });
      session.status = 'failed';
      session.endTime = new Date();
      await session.save();
      throw err;
    }
  }

  /**
   * Get training status
   */
  async getTrainingStatus() {
    if (this.currentSession) {
      return this.currentSession;
    }

    // Get latest session
    const latestSession = await AITrainingSession.findOne().sort({ createdAt: -1 });
    return latestSession;
  }

  /**
   * Get training history
   */
  async getTrainingHistory(limit = 10) {
    return AITrainingSession.find()
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /**
   * Get training statistics
   */
  async getTrainingStatistics() {
    const stats = {
      totalSessions: await AITrainingSession.countDocuments(),
      completedSessions: await AITrainingSession.countDocuments({ status: 'completed' }),
      failedSessions: await AITrainingSession.countDocuments({ status: 'failed' }),
      inProgressSessions: await AITrainingSession.countDocuments({ status: 'in_progress' }),
    };

    const completedSessions = await AITrainingSession.find({ status: 'completed' });
    if (completedSessions.length > 0) {
      const totalDuration = completedSessions.reduce((sum, s) => sum + (s.duration || 0), 0);
      stats.averageTrainingTime = totalDuration / completedSessions.length;

      const totalDocuments = completedSessions.reduce((sum, s) => sum + (s.results?.documentsIndexed || 0), 0);
      stats.totalDocumentsProcessed = totalDocuments;
    }

    return stats;
  }
}

module.exports = AITrainingService;
