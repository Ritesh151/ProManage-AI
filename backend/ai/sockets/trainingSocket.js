/**
 * Training Socket.io Handler
 * Realtime pipeline, metrics, flow, and log streaming
 */

const trainingEventBus = require('./trainingEventBus');

const STAGE_ORDER = ['discovering', 'reading', 'chunking', 'embedding', 'uploading', 'metadata'];

function initTrainingSocket(io) {
  const nsp = io.of('/training');

  nsp.on('connection', (socket) => {
    socket.emit('connected', { message: 'Training realtime channel ready' });

    const handlers = {
      pipeline: (data) => socket.emit('training:pipeline', data),
      metrics: (data) => socket.emit('training:metrics', data),
      flow: (data) => socket.emit('training:flow', data),
      log: (data) => socket.emit('training:log', data),
      complete: (data) => socket.emit('training:complete', data),
    };

    trainingEventBus.on('pipeline', handlers.pipeline);
    trainingEventBus.on('metrics', handlers.metrics);
    trainingEventBus.on('flow', handlers.flow);
    trainingEventBus.on('log', handlers.log);
    trainingEventBus.on('complete', handlers.complete);

    socket.on('disconnect', () => {
      trainingEventBus.off('pipeline', handlers.pipeline);
      trainingEventBus.off('metrics', handlers.metrics);
      trainingEventBus.off('flow', handlers.flow);
      trainingEventBus.off('log', handlers.log);
      trainingEventBus.off('complete', handlers.complete);
    });
  });

  return nsp;
}

module.exports = { initTrainingSocket, STAGE_ORDER };
