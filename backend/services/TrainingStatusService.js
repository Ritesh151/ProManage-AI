const TrainingStatus = require('../models/TrainingStatus');

class TrainingStatusService {
  constructor() {
    this._currentStatus = {
      status: 'idle',
      progress: 0,
      currentStep: '',
      filesIndexed: 0,
      chunksCreated: 0,
      embeddings: 0,
      lastTraining: null,
      successRate: 0,
      isTraining: false,
    };
    this._initialized = false;
  }

  async init() {
    if (this._initialized) return;
    let record = await TrainingStatus.findOne().sort({ createdAt: -1 });
    if (!record) {
      record = await TrainingStatus.create({ status: 'idle' });
    }
    this._currentStatus = {
      status: record.status,
      progress: record.progress,
      currentStep: record.currentStep,
      filesIndexed: record.filesIndexed,
      chunksCreated: record.chunksCreated,
      embeddings: record.embeddings,
      lastTraining: record.lastTraining,
      successRate: record.successRate,
      isTraining: record.isTraining,
    };
    this._initialized = true;
  }

  getStatus() {
    return { ...this._currentStatus };
  }

  async update(updates) {
    Object.assign(this._currentStatus, updates);
    await TrainingStatus.findOneAndUpdate(
      {},
      { $set: updates },
      { upsert: true, new: true }
    );
    return this.getStatus();
  }

  async startTraining() {
    return this.update({
      status: 'running',
      progress: 0,
      currentStep: 'Pipeline Idle',
      filesIndexed: 0,
      chunksCreated: 0,
      embeddings: 0,
      isTraining: true,
      error: null,
      startedAt: new Date(),
    });
  }

  async completeTraining(filesIndexed, chunksCreated, embeddings) {
    const successRate = filesIndexed > 0 ? 100 : 0;
    return this.update({
      status: 'completed',
      progress: 100,
      currentStep: 'Training Completed',
      filesIndexed,
      chunksCreated,
      embeddings,
      lastTraining: new Date(),
      successRate,
      isTraining: false,
      completedAt: new Date(),
    });
  }

  async failTraining(error) {
    return this.update({
      status: 'failed',
      currentStep: 'Training Failed',
      isTraining: false,
      error,
      completedAt: new Date(),
    });
  }
}

module.exports = new TrainingStatusService();
