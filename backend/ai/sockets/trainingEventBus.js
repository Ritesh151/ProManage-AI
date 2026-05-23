/**
 * Training Event Bus
 * Bridges AITrainingService events to Socket.io
 */

const { EventEmitter } = require('events');

class TrainingEventBus extends EventEmitter {
  emitPipeline(data) {
    this.emit('pipeline', data);
  }

  emitMetrics(data) {
    this.emit('metrics', data);
  }

  emitFlow(data) {
    this.emit('flow', data);
  }

  emitLog(log) {
    this.emit('log', log);
  }

  emitComplete(data) {
    this.emit('complete', data);
  }
}

module.exports = new TrainingEventBus();
