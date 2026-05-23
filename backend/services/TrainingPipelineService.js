const EventEmitter = require('events');

class TrainingPipelineService extends EventEmitter {
  constructor() {
    super();
    this.stages = [
      'discovering', 'reading', 'chunking', 'embedding', 'indexing', 'completed',
    ];
    this.stageWeights = {
      discovering: 10,
      reading: 15,
      chunking: 20,
      embedding: 30,
      indexing: 15,
      completed: 10,
    };
    this._currentStage = 'discovering';
    this._stageProgress = 0;
    this._overallProgress = 0;
  }

  getStageIndex(stage) {
    return this.stages.indexOf(stage);
  }

  calculateProgress(stage, stageProgress) {
    this._currentStage = stage;
    this._stageProgress = stageProgress;

    const stageIdx = this.stages.indexOf(stage);
    let base = 0;
    for (let i = 0; i < stageIdx; i++) {
      base += this.stageWeights[this.stages[i]] || 0;
    }
    const weight = this.stageWeights[stage] || 10;
    const overall = Math.min(99, Math.round(base + (stageProgress / 100) * weight));
    this._overallProgress = overall;
    return overall;
  }

  emitProgress(data) {
    this.emit('training:progress', {
      stage: this._currentStage,
      progress: this._overallProgress,
      stageProgress: this._stageProgress,
      ...data,
    });
  }

  emitStatus(data) {
    this.emit('training:status', data);
  }

  emitError(error) {
    this.emit('training:error', { error, stage: this._currentStage });
  }

  emitComplete(data) {
    this._overallProgress = 100;
    this._currentStage = 'completed';
    this.emit('training:completed', { ...data, progress: 100 });
  }

  reset() {
    this._currentStage = 'discovering';
    this._stageProgress = 0;
    this._overallProgress = 0;
  }
}

module.exports = new TrainingPipelineService();
