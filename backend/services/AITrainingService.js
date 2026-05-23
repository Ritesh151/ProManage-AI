const Project = require('../models/Project');
const TrainingHistory = require('../models/TrainingHistory');
const TrainingStatusService = require('./TrainingStatusService');
const TrainingPipelineService = require('./TrainingPipelineService');
const AIKnowledgeService = require('./AIKnowledgeService');
const AIEmbeddingService = require('./AIEmbeddingService');
const { v4: uuidv4 } = require('uuid');

class AITrainingService {
  constructor() {
    this.isTraining = false;
    this._abort = false;
    this._sessionId = null;
    this._history = [];
  }

  async startTraining() {
    if (this.isTraining) {
      throw new Error('Training already in progress');
    }

    this.isTraining = true;
    this._abort = false;
    this._sessionId = uuidv4();
    this._history = [];

    await TrainingStatusService.startTraining();
    TrainingPipelineService.reset();

    const session = await TrainingHistory.create({
      sessionId: this._sessionId,
      status: 'running',
      type: 'full',
      startedAt: new Date(),
    });

    try {
      TrainingPipelineService.calculateProgress('discovering', 10);
      TrainingPipelineService.emitStatus(TrainingStatusService.getStatus());

      const projects = await Project.find({}).lean();
      const totalProjects = projects.length;

      if (totalProjects === 0) {
        await this._completeTraining(session, 0, 0, 0);
        return { sessionId: this._sessionId, filesIndexed: 0, chunksCreated: 0, embeddings: 0 };
      }

      await TrainingStatusService.update({
        filesIndexed: totalProjects,
        currentStep: `${totalProjects} projects discovered`,
      });

      TrainingPipelineService.calculateProgress('discovering', 100);
      TrainingPipelineService.emitProgress({
        stage: 'discovering',
        filesIndexed: totalProjects,
        projectsFound: totalProjects,
        currentStep: `Found ${totalProjects} projects`,
      });

      await AIKnowledgeService.clearKnowledge();

      let totalChunks = 0;
      let totalEmbeddings = 0;
      const errors = [];

      for (let i = 0; i < projects.length; i++) {
        if (this._abort) {
          await this._completeTraining(session, projects.length, totalChunks, totalEmbeddings);
          return { sessionId: this._sessionId, aborted: true };
        }

        const project = projects[i];
        const pct = Math.round(((i + 1) / projects.length) * 100);

        try {
          TrainingPipelineService.calculateProgress('reading', pct);
          await TrainingStatusService.update({
            currentStep: `Reading: ${project.projectName}`,
            progress: Math.round(30 + (pct * 0.2)),
          });
          TrainingPipelineService.emitProgress({
            stage: 'reading',
            progress: Math.round(30 + (pct * 0.2)),
            currentStep: `Reading ${project.projectName}`,
            currentProject: project.projectName,
          });

          TrainingPipelineService.calculateProgress('chunking', pct);
          await TrainingStatusService.update({
            currentStep: `Chunking: ${project.projectName}`,
          });

          const chunks = await AIKnowledgeService.indexProject(project);
          totalChunks += chunks.length;

          TrainingPipelineService.calculateProgress('embedding', pct);
          await TrainingStatusService.update({
            currentStep: `Embedding: ${project.projectName}`,
            chunksCreated: totalChunks,
          });

          for (const chunk of chunks) {
            if (chunk.content) {
              AIEmbeddingService.generateEmbedding(chunk.content);
              totalEmbeddings++;
            }
          }

          await TrainingStatusService.update({
            embeddings: totalEmbeddings,
            progress: Math.round(50 + (pct * 0.4)),
          });

          TrainingPipelineService.emitProgress({
            stage: 'embedding',
            progress: Math.round(50 + (pct * 0.4)),
            filesIndexed: i + 1,
            chunksCreated: totalChunks,
            embeddings: totalEmbeddings,
            currentProject: project.projectName,
          });
        } catch (err) {
          errors.push({ projectName: project.projectName, error: err.message });
        }
      }

      TrainingPipelineService.calculateProgress('indexing', 100);
      await TrainingStatusService.update({
        currentStep: 'Indexing complete',
        progress: 95,
        filesIndexed: projects.length,
        chunksCreated: totalChunks,
        embeddings: totalEmbeddings,
      });
      TrainingPipelineService.emitProgress({
        stage: 'indexing',
        progress: 95,
        filesIndexed: projects.length,
        chunksCreated: totalChunks,
        embeddings: totalEmbeddings,
      });

      await this._completeTraining(session, projects.length, totalChunks, totalEmbeddings, errors);
      return { sessionId: this._sessionId, filesIndexed: projects.length, chunksCreated: totalChunks, embeddings: totalEmbeddings };
    } catch (err) {
      this.isTraining = false;
      await TrainingStatusService.failTraining(err.message);
      session.status = 'failed';
      session.trainingErrors = [{ projectName: 'system', error: err.message }];
      await session.save();
      TrainingPipelineService.emitError(err.message);
      throw err;
    }
  }

  async retrain() {
    return this.startTraining();
  }

  async stopTraining() {
    this._abort = true;
    this.isTraining = false;
    await TrainingStatusService.update({ isTraining: false, status: 'idle', currentStep: 'Training stopped' });
    TrainingPipelineService.emitStatus(TrainingStatusService.getStatus());
    return { success: true, message: 'Training stopped' };
  }

  async _completeTraining(session, filesIndexed, chunksCreated, embeddings, errors) {
    this.isTraining = false;
    const successRate = filesIndexed > 0 ? 100 : 0;
    await TrainingStatusService.completeTraining(filesIndexed, chunksCreated, embeddings);
    session.status = 'completed';
    session.filesIndexed = filesIndexed;
    session.chunksCreated = chunksCreated;
    session.embeddings = embeddings;
    session.duration = Date.now() - session.startedAt;
    session.successRate = successRate;
    if (errors?.length) session.trainingErrors = errors;
    session.completedAt = new Date();
    await session.save();

    TrainingPipelineService.emitComplete({
      sessionId: this._sessionId,
      filesIndexed,
      chunksCreated,
      embeddings,
      duration: session.duration,
      successRate,
    });
  }

  async getHistory(limit = 20) {
    const sessions = await TrainingHistory.find().sort({ createdAt: -1 }).limit(limit).lean();
    return sessions.map(s => ({
      id: s.sessionId || s._id,
      sessionId: s.sessionId,
      status: s.status,
      type: s.type,
      projectName: 'ProposalForge AI',
      startTime: s.startedAt,
      endTime: s.completedAt,
      startedAt: s.startedAt,
      completedAt: s.completedAt,
      filesProcessed: s.filesIndexed || 0,
      chunksCreated: s.chunksCreated || 0,
      embeddings: s.embeddings || 0,
      duration: s.duration,
      successRate: s.successRate,
      errors: s.trainingErrors,
      timestamp: s.startedAt,
    }));
  }
}

module.exports = new AITrainingService();
