/**
 * AI Watcher Service
 * Monitors file changes and triggers re-indexing
 */

const fs = require('fs');
const path = require('path');
const AIIngestService = require('./AIIngestService');
const AIEmbeddingService = require('./AIEmbeddingService');
const AILogger = require('../utils/logger');
const AI_CONFIG = require('../config/aiConfig');
const { calculateFileHash, detectProjectType } = require('../utils/fileUtils');
const { getExistingTrainingModules, resolveModuleLabel, isAllowedTrainingPath } = require('../config/proposalForgeModules');

const logger = new AILogger('WatcherService');

class AIWatcherService {
  constructor() {
    this.watchers = new Map();
    this.ingestService = new AIIngestService();
    this.embeddingService = new AIEmbeddingService();
    this.debounceTimers = new Map();
    this.debounceMs = AI_CONFIG.watcher.debounceMs;
  }

  /**
   * Start watching project directories
   */
  startWatching(projectPath) {
    if (!AI_CONFIG.watcher.enabled) {
      logger.debug('Watcher is disabled');
      return;
    }

    if (this.watchers.has(projectPath)) {
      logger.debug('Already watching project', { projectPath });
      return;
    }

    logger.info('Starting file watcher', { projectPath });

    try {
      const watcher = fs.watch(projectPath, { recursive: true }, (eventType, filename) => {
        this.handleFileChange(projectPath, filename, eventType);
      });

      this.watchers.set(projectPath, watcher);
    } catch (err) {
      logger.error('Error starting watcher', { projectPath, error: err.message });
    }
  }

  /**
   * Stop watching project
   */
  stopWatching(projectPath) {
    const watcher = this.watchers.get(projectPath);
    if (watcher) {
      watcher.close();
      this.watchers.delete(projectPath);
      logger.info('Stopped watching project', { projectPath });
    }
  }

  /**
   * Stop all watchers
   */
  stopAllWatchers() {
    for (const [projectPath, watcher] of this.watchers.entries()) {
      watcher.close();
      logger.info('Stopped watching project', { projectPath });
    }
    this.watchers.clear();
  }

  /**
   * Handle file change event
   */
  handleFileChange(projectPath, filename, eventType) {
    const filePath = path.join(projectPath, filename);

    // Skip if file doesn't exist or is in excluded directories
    if (!fs.existsSync(filePath)) {
      return;
    }

    // Check if file should be watched
    if (!this.shouldWatchFile(filePath) || !isAllowedTrainingPath(filePath)) {
      return;
    }

    logger.debug('File change detected', { filePath, eventType });

    // Debounce the processing
    const debounceKey = filePath;
    if (this.debounceTimers.has(debounceKey)) {
      clearTimeout(this.debounceTimers.get(debounceKey));
    }

    const timer = setTimeout(() => {
      this.processFileChange(projectPath, filePath);
      this.debounceTimers.delete(debounceKey);
    }, this.debounceMs);

    this.debounceTimers.set(debounceKey, timer);
  }

  /**
   * Check if file should be watched
   */
  shouldWatchFile(filePath) {
    const filename = path.basename(filePath);
    const dirname = path.dirname(filePath);

    // Check if in watched paths
    const isInWatchPath = AI_CONFIG.watcher.watchPaths.some(watchPath => {
      return filePath.includes(watchPath) || dirname.includes(watchPath);
    });

    if (!isInWatchPath) {
      return false;
    }

    // Exclude certain files
    const excludePatterns = [
      /\.log$/,
      /\.tmp$/,
      /\.swp$/,
      /\.swo$/,
      /~$/,
      /node_modules/,
      /\.git/,
      /build/,
      /dist/,
    ];

    for (const pattern of excludePatterns) {
      if (pattern.test(filePath)) {
        return false;
      }
    }

    return true;
  }

  /**
   * Process file change
   */
  async processFileChange(projectPath, filePath) {
    try {
      logger.info('Processing source file change', { filePath });

      const projectName = resolveModuleLabel(filePath);
      const projectType = detectProjectType(projectPath);

      // Re-ingest the file
      await this.ingestService.ingestFile(filePath, projectName, projectPath, projectType);

      // Generate new embeddings
      const AIDocument = require('../models/AIDocument');
      const document = await AIDocument.findOne({ filepath: filePath });

      if (document) {
        const embeddings = [];

        for (const chunk of document.chunks) {
          const embedding = await this.embeddingService.generateEmbedding(chunk.content);
          embeddings.push(embedding);
        }

        // Store updated embeddings
        await this.embeddingService.storeEmbeddings(document._id.toString(), document.chunks, embeddings);

        // Mark as processed
        await this.ingestService.markEmbeddingsGenerated(document._id);
        await this.ingestService.markAsProcessed(document._id);

        logger.info('File change processed successfully', { filePath });
      }
    } catch (err) {
      logger.error('Error processing file change', { filePath, error: err.message });
    }
  }

  /**
   * Get watcher status
   */
  getStatus() {
    return {
      enabled: AI_CONFIG.watcher.enabled,
      watchingProjects: this.watchers.size,
      projects: Array.from(this.watchers.keys()),
    };
  }
}

module.exports = AIWatcherService;
