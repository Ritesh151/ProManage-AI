/**
 * AI Training Service
 * Orchestrates the training pipeline
 * Singleton pattern - one instance shared across all requests
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const AIProjectDiscoveryService = require('./AIProjectDiscoveryService');
const AIIngestService = require('./AIIngestService');
const AIEmbeddingService = require('./AIEmbeddingService');
const AITrainingSession = require('../models/AITrainingSession');
const AIDocument = require('../models/AIDocument');
const AILogger = require('../utils/logger');
const AI_CONFIG = require('../config/aiConfig');
const { SUPPORTED_EXTENSIONS, EXCLUDED_DIRS, EXCLUDED_PATTERNS } = require('../config/projectPaths');
const {
  PROJECT_DISPLAY_NAME,
  resolveModuleFromPath,
  resolveModuleLabel,
  toRelativeTrainingPath,
  isAllowedTrainingPath,
  PROJECT_SOURCE_QUERY,
} = require('../config/proposalForgeModules');
const { chunkText, cleanText } = require('../utils/textUtils');
const { v4: uuidv4 } = require('uuid');
const trainingEventBus = require('../sockets/trainingEventBus');
const TrainingMetricsService = require('./TrainingMetricsService');

const logger = new AILogger('TrainingService');

const PIPELINE_STAGES = ['discovering', 'reading', 'chunking', 'embedding', 'uploading', 'metadata'];
const STAGE_WEIGHTS = { discovering: 15, reading: 10, chunking: 15, embedding: 35, uploading: 15, metadata: 10 };

class AITrainingService {
  constructor() {
    this.projectDiscoveryService = new AIProjectDiscoveryService();
    this.ingestService = new AIIngestService();
    this.embeddingService = new AIEmbeddingService();
    this.currentSession = null;
    this.trainingLogs = [];
    this.abortController = null;
    this.isTraining = false;
    this.metricsService = new TrainingMetricsService();
    this.currentPipelineStage = 'discovering';
  }

  _trainingPath(filePath) {
    return filePath ? toRelativeTrainingPath(filePath) : null;
  }

  _currentModule(filePath) {
    if (!filePath) return this.currentSession?.currentModule || null;
    const mod = resolveModuleFromPath(filePath);
    return mod ? mod.label : PROJECT_DISPLAY_NAME;
  }

  _emitPipeline(stage, stageProgress = 0, currentFile = null) {
    this.currentPipelineStage = stage;
    const session = this.currentSession;
    const displayPath = this._trainingPath(currentFile);
    const currentModule = this._currentModule(currentFile);
    if (session && currentModule) {
      session.currentModule = currentModule;
    }
    const fileRatio = session?.totalFiles > 0
      ? (session.filesProcessed / session.totalFiles)
      : 0;
    const stageIdx = PIPELINE_STAGES.indexOf(stage);
    let baseProgress = 0;
    for (let i = 0; i < stageIdx; i++) {
      baseProgress += STAGE_WEIGHTS[PIPELINE_STAGES[i]] || 0;
    }
    const stageWeight = STAGE_WEIGHTS[stage] || 10;
    const overall = Math.min(
      99,
      Math.round(baseProgress + (stageProgress / 100) * stageWeight * 0.6 + fileRatio * 40)
    );

    trainingEventBus.emitPipeline({
      stage,
      progress: overall,
      stageProgress,
      currentFile: displayPath,
      currentProjectModule: currentModule,
      currentFilePath: currentFile,
      filesProcessed: session?.filesProcessed || 0,
      totalFiles: session?.totalFiles || 0,
      chunksCreated: session?.chunksCreated || 0,
      embeddingsGenerated: session?.embeddingsGenerated || 0,
      isTraining: this.isTraining,
    });

    const metrics = this.metricsService.updateSessionMetrics(session, this.isTraining);
    trainingEventBus.emitMetrics(metrics);
  }

  _emitFlow(flowData) {
    trainingEventBus.emitFlow(flowData);
  }

  addLog(level, message) {
    const log = {
      level,
      message,
      timestamp: new Date().toISOString(),
    };
    this.trainingLogs.push(log);
    if (this.trainingLogs.length > 500) {
      this.trainingLogs = this.trainingLogs.slice(-500);
    }
    if (level === 'info') logger.info(message);
    else if (level === 'error') logger.error(message);
    else if (level === 'warning') logger.warn(message);
    else logger.debug(message);

    trainingEventBus.emitLog(log);
  }

  scanProjectFiles(projectPath) {
    const files = [];

    const scan = (dir, depth = 0) => {
      if (depth > 10) return;
      try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
          const fullPath = path.join(dir, entry.name);
          if (entry.isDirectory()) {
            if (!EXCLUDED_DIRS.includes(entry.name)) {
              scan(fullPath, depth + 1);
            }
          } else if (entry.isFile()) {
            const ext = path.extname(entry.name);
            const isSupported = SUPPORTED_EXTENSIONS.some(e => {
              if (e.startsWith('.')) return ext === e;
              return entry.name === e;
            });
            const isExcluded = EXCLUDED_PATTERNS.some(p => p.test(entry.name));
            if (isSupported && !isExcluded && isAllowedTrainingPath(fullPath)) {
              files.push(fullPath);
            }
          }
        }
      } catch (err) {
        // skip unreadable directories
      }
    };

    scan(projectPath);
    return files;
  }

  async startFullTraining() {
    if (this.isTraining) {
      throw new Error('Training already in progress');
    }

    this.isTraining = true;
    this.trainingLogs = [];
    this.abortController = new AbortController();
    this.metricsService.reset();

    const sessionId = uuidv4();
    this.addLog('info', `Starting ProposalForge AI training session: ${sessionId}`);
    this._emitPipeline('discovering', 5, null);

    const session = await AITrainingSession.create({
      sessionId,
      status: 'in_progress',
      type: 'full',
      projectName: PROJECT_DISPLAY_NAME,
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
      this._emitPipeline('discovering', 30, null);
      this.addLog('info', 'Discovering ProposalForge AI project directories...');
      const projects = await this.projectDiscoveryService.discoverProjects();
      session.totalProjects = projects.length;
      session.modulesTrained = projects.map((p) => p.name);
      await session.save();
      this.addLog('info', `Found ${projects.length} project modules to train`);
      for (const p of projects) {
        this.addLog('info', `Module ready: ${p.name} (${p.fileCount} source files)`);
      }

      if (projects.length === 0) {
        this.addLog('warning', 'No projects found in configured paths');
        session.status = 'completed';
        session.endTime = new Date();
        session.results = { projectsScanned: 0, documentsIndexed: 0, vectorsStored: 0, successRate: 100 };
        await session.save();
        this.isTraining = false;
        return session;
      }

      // Step 2: Collect all files
      let allFiles = [];
      for (const project of projects) {
        if (this.abortController.signal.aborted) {
          this.addLog('info', 'Training stopped by user');
          break;
        }

        try {
          this.addLog('info', `Scanning ${project.name}...`);
          this.projectDiscoveryService.updateProjectStatus(project.path, 'processing');

          const files = this.scanProjectFiles(project.path);
          allFiles = allFiles.concat(files.map((f) => ({
            path: f,
            project: project.name,
            projectPath: project.path,
            moduleId: project.moduleId,
          })));

          session.projectsProcessed++;
          await session.save();
        } catch (err) {
          this.addLog('error', `Error scanning ${project.name}: ${err.message}`);
          session.errors.push({ file: project.name, error: err.message });
          session.errorCount++;
          await session.save();
        }
      }

      session.totalFiles = allFiles.length;
      await session.save();
      this._emitPipeline('discovering', 100, null);
      this.addLog('info', `Found ${allFiles.length} source files across ProposalForge AI modules`);

      if (allFiles.length === 0) {
        this.addLog('warning', 'No supported files found');
        session.status = 'completed';
        session.endTime = new Date();
        session.results = { projectsScanned: session.projectsProcessed, documentsIndexed: 0, vectorsStored: 0, successRate: 100 };
        await session.save();
        this.isTraining = false;
        return session;
      }

      // Step 3: Process each file - ingest, chunk, embed, store
      let totalChunks = 0;

      for (let i = 0; i < allFiles.length; i++) {
        if (this.abortController.signal.aborted) {
          this.addLog('info', 'Training stopped by user');
          break;
        }

        const file = allFiles[i];
        try {
          const relPath = this._trainingPath(file.path);
          this.addLog('info', `Reading ${relPath}`);
          session.currentFile = file.path;
          session.currentModule = file.project;
          await session.save();
          this._emitPipeline('reading', 20, file.path);
          this._emitFlow({
            sourceFile: relPath,
            chunk: null,
            status: 'reading',
            label: 'Reading Content',
          });

          // Read file content
          let content;
          try {
            content = fs.readFileSync(file.path, 'utf-8');
          } catch (readErr) {
            this.addLog('error', `Cannot read: ${relPath}`);
            session.errors.push({ file: file.path, error: 'Cannot read file' });
            session.errorCount++;
            await session.save();
            continue;
          }

          if (!content || content.trim().length === 0) {
            this.addLog('warning', `Empty source file: ${relPath}`);
            session.filesProcessed++;
            await session.save();
            continue;
          }

          // Calculate file hash for change detection
          const fileHash = crypto.createHash('sha256').update(content).digest('hex');

          // Check if already processed and unchanged
          const existingDoc = await AIDocument.findOne({ filepath: file.path });
          if (existingDoc && existingDoc.fileHash === fileHash && existingDoc.processed && existingDoc.embeddingsGenerated) {
            this.addLog('info', `Skipped unchanged: ${relPath}`);
            session.filesProcessed++;
            totalChunks += existingDoc.totalChunks;
            session.chunksCreated = totalChunks;
            session.embeddingsGenerated += existingDoc.totalChunks;
            await session.save();
            continue;
          }

          // Clean and chunk content
          this._emitPipeline('chunking', 10, file.path);
          const cleanedContent = cleanText(content);
          const chunks = chunkText(cleanedContent);
          this.addLog('info', `Chunking ${relPath} (${chunks.length} chunks)`);
          this._emitPipeline('chunking', 100, file.path);
          this.metricsService.recordChunk();
          chunks.forEach((_, idx) => {
            this._emitFlow({
              sourceFile: relPath,
              chunk: `Chunk #${idx + 1}`,
              status: 'chunked',
              label: 'Source Chunks',
            });
          });

          // Create or update document in MongoDB
          const docData = {
            filename: path.basename(file.path),
            filepath: file.path,
            projectName: file.project,
            projectPath: file.projectPath,
            projectType: this.detectProjectType(file.projectPath),
            language: this.detectLanguage(file.path),
            fileType: this.detectFileType(file.path),
            fileSize: content.length,
            fileHash,
            content: cleanedContent.substring(0, 50000),
            chunks: chunks.map((c, idx) => ({ chunkId: `${fileHash}-${idx}`, chunkIndex: idx, content: c })),
            totalChunks: chunks.length,
            processed: false,
            embeddingsGenerated: false,
            lastModifiedAt: new Date(),
          };

          let doc;
          if (existingDoc) {
            doc = await AIDocument.findByIdAndUpdate(existingDoc._id, docData, { new: true });
          } else {
            doc = await AIDocument.create(docData);
          }

          session.filesProcessed++;
          totalChunks += chunks.length;
          session.chunksCreated = totalChunks;
          await session.save();

          // Generate embeddings for each chunk
          this._emitPipeline('embedding', 0, file.path);
          this.addLog('info', `Generating embeddings for ${relPath}`);
          const embeddings = [];
          for (let ci = 0; ci < chunks.length; ci++) {
            const chunk = chunks[ci];
            try {
              const embedding = await this.embeddingService.generateEmbedding(chunk);
              embeddings.push(embedding);
              session.embeddingsGenerated++;
              this.metricsService.recordEmbedding();
              const embedProgress = Math.round(((ci + 1) / chunks.length) * 100);
              this._emitPipeline('embedding', embedProgress, file.path);
              this._emitFlow({
                sourceFile: relPath,
                chunk: `Chunk #${ci + 1}`,
                status: 'embedding',
                label: 'Embedding Generated',
              });
            } catch (embedErr) {
              this.addLog('error', `Embedding failed in ${relPath}: ${embedErr.message}`);
            }
          }

          // Store embeddings in ChromaDB
          this._emitPipeline('uploading', 0, file.path);
          if (embeddings.length > 0) {
            try {
              await this.embeddingService.storeEmbeddings(doc._id.toString(), chunks, embeddings);
              this.addLog('info', `Saving vectors to ChromaDB: ${relPath}`);
              this._emitPipeline('uploading', 100, file.path);
              this._emitFlow({
                sourceFile: relPath,
                chunk: `Chunk #${chunks.length}`,
                status: 'stored',
                label: 'Stored in ChromaDB',
              });
            } catch (storeErr) {
              this.addLog('error', `ChromaDB storage failed for ${relPath}: ${storeErr.message}`);
            }
          }

          this._emitPipeline('metadata', 50, file.path);
          // Mark as processed
          await AIDocument.findByIdAndUpdate(doc._id, {
            processed: true,
            embeddingsGenerated: true,
            lastProcessedAt: new Date(),
          });

          await session.save();
          this._emitPipeline('metadata', 100, file.path);
          this._emitFlow({
            sourceFile: relPath,
            chunk: null,
            status: 'available',
            label: 'Available for AI Chat',
          });
        } catch (err) {
          this.addLog('error', `Failed processing ${this._trainingPath(file.path)}: ${err.message}`);
          session.errors.push({ file: file.path, error: err.message });
          session.errorCount++;
          await session.save();
        }
      }

      // Step 4: Finalize
      session.status = 'completed';
      session.endTime = new Date();
      session.currentFile = null;
      session.results = {
        projectsScanned: session.projectsProcessed,
        documentsIndexed: await AIDocument.countDocuments({ ...PROJECT_SOURCE_QUERY, processed: true }),
        vectorsStored: session.embeddingsGenerated,
        successRate: session.filesProcessed > 0 ? Math.round(((session.filesProcessed - session.errorCount) / session.filesProcessed) * 100) : 100,
      };

      await session.save();

      this.addLog('success', `Training ProposalForge AI completed — ${session.filesProcessed} source files, ${session.chunksCreated} chunks, ${session.embeddingsGenerated} embeddings`);
      this._emitPipeline('metadata', 100, null);
      trainingEventBus.emitComplete({
        status: 'completed',
        filesProcessed: session.filesProcessed,
        chunksCreated: session.chunksCreated,
        embeddingsGenerated: session.embeddingsGenerated,
      });

      this.isTraining = false;
      return session;
    } catch (err) {
      this.addLog('error', `Training failed: ${err.message}`);
      session.status = 'failed';
      session.endTime = new Date();
      session.currentFile = null;
      session.errors.push({ file: 'system', error: err.message });
      await session.save();

      this.isTraining = false;
      throw err;
    }
  }

  async startIncrementalTraining() {
    if (this.isTraining) {
      throw new Error('Training already in progress');
    }

    this.isTraining = true;
    this.trainingLogs = [];
    this.abortController = new AbortController();

    const sessionId = uuidv4();
    this.addLog('info', `Starting ProposalForge AI incremental retrain: ${sessionId}`);

    const session = await AITrainingSession.create({
      sessionId,
      status: 'in_progress',
      type: 'incremental',
      projectName: PROJECT_DISPLAY_NAME,
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
      this.addLog('info', 'Discovering ProposalForge AI project directories...');
      const projects = await this.projectDiscoveryService.discoverProjects();
      session.totalProjects = projects.length;
      session.modulesTrained = projects.map((p) => p.name);
      await session.save();

      if (projects.length === 0) {
        this.addLog('warning', 'No ProposalForge AI modules found');
        session.status = 'completed';
        session.endTime = new Date();
        session.results = { projectsScanned: 0, documentsIndexed: 0, vectorsStored: 0, successRate: 100 };
        await session.save();
        this.isTraining = false;
        return session;
      }

      let allFiles = [];
      for (const project of projects) {
        if (this.abortController.signal.aborted) break;
        try {
          const files = this.scanProjectFiles(project.path);
          allFiles = allFiles.concat(files.map((f) => ({
            path: f,
            project: project.name,
            projectPath: project.path,
            moduleId: project.moduleId,
          })));
          session.projectsProcessed++;
          await session.save();
        } catch (err) {
          this.addLog('error', `Error scanning ${project.name}: ${err.message}`);
          session.errors.push({ file: project.name, error: err.message });
          session.errorCount++;
          await session.save();
        }
      }

      session.totalFiles = allFiles.length;
      await session.save();
      this.addLog('info', `Scanning ${allFiles.length} source files for changes...`);

      let totalChunks = 0;
      let changedFiles = 0;

      for (let i = 0; i < allFiles.length; i++) {
        if (this.abortController.signal.aborted) break;

        const file = allFiles[i];
        try {
          let content;
          try {
            content = fs.readFileSync(file.path, 'utf-8');
          } catch {
            continue;
          }

          const fileHash = crypto.createHash('sha256').update(content).digest('hex');
          const existingDoc = await AIDocument.findOne({ filepath: file.path });

          if (existingDoc && existingDoc.fileHash === fileHash && existingDoc.processed && existingDoc.embeddingsGenerated) {
            continue;
          }

          changedFiles++;
          const relPath = this._trainingPath(file.path);
          this.addLog('info', `Updating changed source: ${relPath}`);
          session.currentFile = file.path;
          session.currentModule = file.project;

          const cleanedContent = cleanText(content);
          const chunks = chunkText(cleanedContent);

          const docData = {
            filename: path.basename(file.path),
            filepath: file.path,
            projectName: file.project,
            projectPath: file.projectPath,
            projectType: this.detectProjectType(file.projectPath),
            language: this.detectLanguage(file.path),
            fileType: this.detectFileType(file.path),
            fileSize: content.length,
            fileHash,
            content: cleanedContent.substring(0, 50000),
            chunks: chunks.map((c, idx) => ({ chunkId: `${fileHash}-${idx}`, chunkIndex: idx, content: c })),
            totalChunks: chunks.length,
            processed: false,
            embeddingsGenerated: false,
            lastModifiedAt: new Date(),
          };

          let doc;
          if (existingDoc) {
            doc = await AIDocument.findByIdAndUpdate(existingDoc._id, docData, { new: true });
          } else {
            doc = await AIDocument.create(docData);
          }

          session.filesProcessed++;
          totalChunks += chunks.length;
          session.chunksCreated = totalChunks;
          await session.save();

          const embeddings = [];
          for (const chunk of chunks) {
            try {
              const embedding = await this.embeddingService.generateEmbedding(chunk);
              embeddings.push(embedding);
              session.embeddingsGenerated++;
            } catch {
              // skip failed embeddings
            }
          }

          if (embeddings.length > 0) {
            try {
              await this.embeddingService.storeEmbeddings(doc._id.toString(), chunks, embeddings);
            } catch {
              // skip storage errors
            }
          }

          await AIDocument.findByIdAndUpdate(doc._id, {
            processed: true,
            embeddingsGenerated: true,
            lastProcessedAt: new Date(),
          });

          await session.save();
        } catch (err) {
          this.addLog('error', `Failed: ${file.path} - ${err.message}`);
          session.errors.push({ file: file.path, error: err.message });
          session.errorCount++;
          await session.save();
        }
      }

      session.status = 'completed';
      session.endTime = new Date();
      session.currentFile = null;
      session.results = {
        projectsScanned: session.projectsProcessed,
        documentsIndexed: await AIDocument.countDocuments({ ...PROJECT_SOURCE_QUERY, processed: true }),
        vectorsStored: session.embeddingsGenerated,
        successRate: session.filesProcessed > 0 ? Math.round(((session.filesProcessed - session.errorCount) / session.filesProcessed) * 100) : 100,
      };

      await session.save();

      this.addLog('success', `ProposalForge AI retrain completed — ${changedFiles} updated source files, ${session.chunksCreated} chunks`);

      this.isTraining = false;
      return session;
    } catch (err) {
      this.addLog('error', `Incremental training failed: ${err.message}`);
      session.status = 'failed';
      session.endTime = new Date();
      session.currentFile = null;
      session.errors.push({ file: 'system', error: err.message });
      await session.save();

      this.isTraining = false;
      throw err;
    }
  }

  async stopTraining() {
    if (!this.isTraining) {
      return { success: false, message: 'No active training to stop' };
    }

    this.addLog('info', 'Stopping training...');

    if (this.abortController) {
      this.abortController.abort();
    }

    if (this.currentSession) {
      this.currentSession.status = 'paused';
      this.currentSession.endTime = new Date();
      this.currentSession.currentFile = null;
      await this.currentSession.save();
    }

    this.isTraining = false;
    this.addLog('info', 'Training stopped');

    return { success: true, message: 'Training stopped' };
  }

  async getTrainingStatus() {
    if (this.currentSession) {
      const progress = this.currentSession.totalFiles > 0
        ? Math.round((this.currentSession.filesProcessed / this.currentSession.totalFiles) * 100)
        : 0;

      const currentPath = this.currentSession.currentFile;
      return {
        sessionId: this.currentSession.sessionId,
        status: this.currentSession.status,
        type: this.currentSession.type,
        projectName: this.currentSession.projectName || PROJECT_DISPLAY_NAME,
        totalProjects: this.currentSession.totalProjects,
        projectsProcessed: this.currentSession.projectsProcessed,
        totalFiles: this.currentSession.totalFiles,
        filesProcessed: this.currentSession.filesProcessed,
        chunksCreated: this.currentSession.chunksCreated,
        embeddingsGenerated: this.currentSession.embeddingsGenerated,
        errorCount: this.currentSession.errorCount,
        currentFile: currentPath ? this._trainingPath(currentPath) : null,
        currentProjectModule: this.currentSession.currentModule || this._currentModule(currentPath),
        startTime: this.currentSession.startTime,
        endTime: this.currentSession.endTime,
        isTraining: this.isTraining,
        progress,
        logs: this.trainingLogs.slice(-100),
      };
    }

    const latestSession = await AITrainingSession.findOne().sort({ createdAt: -1 });
    if (latestSession) {
      return {
        sessionId: latestSession.sessionId,
        status: latestSession.status,
        type: latestSession.type,
        totalProjects: latestSession.totalProjects,
        projectsProcessed: latestSession.projectsProcessed,
        totalFiles: latestSession.totalFiles,
        filesProcessed: latestSession.filesProcessed,
        chunksCreated: latestSession.chunksCreated,
        embeddingsGenerated: latestSession.embeddingsGenerated,
        errorCount: latestSession.errorCount,
        currentFile: null,
        startTime: latestSession.startTime,
        endTime: latestSession.endTime,
        isTraining: false,
        progress: latestSession.totalFiles > 0 ? Math.round((latestSession.filesProcessed / latestSession.totalFiles) * 100) : 0,
        logs: [],
      };
    }

    return {
      status: 'idle',
      isTraining: false,
      progress: 0,
      logs: [],
      totalFiles: 0,
      filesProcessed: 0,
      chunksCreated: 0,
      embeddingsGenerated: 0,
    };
  }

  async getTrainingHistory(limit = 10) {
    const sessions = await AITrainingSession.find()
      .sort({ createdAt: -1 })
      .limit(limit)
      .select('-errors')
      .lean();

    return sessions.map((s) => ({
      ...s,
      id: s.sessionId || s._id,
      projectName: s.projectName || PROJECT_DISPLAY_NAME,
      trainingType: s.type,
      timestamp: s.startTime,
      duration: s.duration || (s.startTime && s.endTime ? new Date(s.endTime) - new Date(s.startTime) : null),
    }));
  }

  async getTrainingStatistics() {
    const [
      totalSessions,
      completedSessions,
      failedSessions,
      totalDocuments,
      processedDocuments,
      documentsWithEmbeddings,
      totalChunksAgg,
      latestSession,
      projectCount,
    ] = await Promise.all([
      AITrainingSession.countDocuments(),
      AITrainingSession.countDocuments({ status: 'completed' }),
      AITrainingSession.countDocuments({ status: 'failed' }),
      AIDocument.countDocuments(PROJECT_SOURCE_QUERY),
      AIDocument.countDocuments({ ...PROJECT_SOURCE_QUERY, processed: true }),
      AIDocument.countDocuments({ ...PROJECT_SOURCE_QUERY, embeddingsGenerated: true }),
      AIDocument.aggregate([
        { $match: PROJECT_SOURCE_QUERY },
        { $group: { _id: null, total: { $sum: '$totalChunks' } } },
      ]),
      AITrainingSession.findOne({ status: 'completed' }).sort({ createdAt: -1 }),
      AIDocument.aggregate([
        { $match: PROJECT_SOURCE_QUERY },
        { $group: { _id: '$projectName' } },
        { $count: 'total' },
      ]),
    ]);

    const totalChunks = totalChunksAgg.length > 0 ? totalChunksAgg[0].total : 0;

    return {
      totalSessions,
      completedSessions,
      failedSessions,
      totalDocuments,
      processedDocuments,
      documentsWithEmbeddings,
      totalChunks,
      totalProjects: projectCount.length > 0 ? projectCount[0].total : 0,
      projectFilesIndexed: processedDocuments,
      sourceFilesProcessed: processedDocuments,
      projectName: PROJECT_DISPLAY_NAME,
      lastTrainingDate: latestSession ? latestSession.endTime || latestSession.createdAt : null,
      embeddingModel: AI_CONFIG.embeddings.provider,
      vectorDatabase: AI_CONFIG.vectorDB.type,
      currentLLM: AI_CONFIG.llm.provider,
      isTraining: this.isTraining,
    };
  }

  getTrainingLogs() {
    return this.trainingLogs.slice(-200);
  }

  detectProjectType(projectPath) {
    try {
      const files = fs.readdirSync(projectPath);
      if (files.includes('package.json')) {
        try {
          const pkg = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8'));
          if (pkg.dependencies?.react || pkg.devDependencies?.react) return 'react';
          return 'nodejs';
        } catch {
          return 'nodejs';
        }
      }
      if (files.includes('requirements.txt') || files.includes('setup.py')) return 'python';
      if (files.includes('pom.xml') || files.includes('build.gradle')) return 'java';
      return 'other';
    } catch {
      return 'other';
    }
  }

  detectLanguage(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const map = {
      '.js': 'javascript', '.jsx': 'javascript', '.ts': 'typescript', '.tsx': 'typescript',
      '.py': 'python', '.java': 'java', '.kt': 'kotlin', '.dart': 'dart',
      '.md': 'markdown', '.json': 'json', '.yaml': 'yaml', '.yml': 'yaml',
    };
    return map[ext] || 'other';
  }

  detectFileType(filePath) {
    const ext = path.extname(filePath).toLowerCase();
    const filename = path.basename(filePath);
    if (['README.md', '.env', '.env.example', 'package.json', 'requirements.txt'].includes(filename)) return 'config';
    if (['.md', '.txt'].includes(ext)) return 'documentation';
    if (['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.kt', '.dart'].includes(ext)) return 'code';
    if (['.json', '.yaml', '.yml'].includes(ext)) return 'data';
    return 'other';
  }
}

module.exports = AITrainingService;
