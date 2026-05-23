const express = require('express');
const router = express.Router();

const AITrainingService = require('../services/AITrainingService');
const TrainingStatusService = require('../services/TrainingStatusService');
const AIKnowledgeService = require('../services/AIKnowledgeService');

router.post('/start', async (req, res) => {
  try {
    if (AITrainingService.isTraining) {
      return res.status(409).json({ success: false, error: 'Training already in progress' });
    }
    const result = await AITrainingService.startTraining();
    res.json({ success: true, message: 'Training started', ...result, isTraining: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/retrain', async (req, res) => {
  try {
    if (AITrainingService.isTraining) {
      return res.status(409).json({ success: false, error: 'Training already in progress' });
    }
    const result = await AITrainingService.retrain();
    res.json({ success: true, message: 'Retrain started', ...result, isTraining: true });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.post('/stop', async (req, res) => {
  try {
    const result = await AITrainingService.stopTraining();
    res.json(result);
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/status', async (req, res) => {
  try {
    await TrainingStatusService.init();
    const status = TrainingStatusService.getStatus();
    res.json({ success: true, ...status });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/history', async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 20;
    const history = await AITrainingService.getHistory(limit);
    res.json({ success: true, history });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

router.get('/knowledge-stats', async (req, res) => {
  try {
    const stats = await AIKnowledgeService.getStats();
    res.json({ success: true, ...stats });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
