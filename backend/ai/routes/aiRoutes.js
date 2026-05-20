/**
 * AI Routes
 * API endpoints for AI operations
 */

const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Training endpoints
router.post('/train', aiController.startTraining);
router.post('/retrain', aiController.startRetrain);
router.get('/status', aiController.getStatus);
router.get('/training-history', aiController.getTrainingHistory);
router.get('/training-stats', aiController.getTrainingStats);

// Chat endpoints
router.post('/chat', aiController.chat);
router.get('/conversation/:conversationId', aiController.getConversation);
router.get('/conversations', aiController.getConversations);
router.delete('/conversation/:conversationId', aiController.clearConversation);

// Project endpoints
router.get('/projects', aiController.getProjects);

// Feedback endpoint
router.post('/feedback', aiController.submitFeedback);

module.exports = router;
