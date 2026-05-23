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
router.post('/stop', aiController.stopTraining);
router.get('/status', aiController.getStatus);
router.get('/training-history', aiController.getTrainingHistory);
router.get('/training-stats', aiController.getTrainingStats);
router.get('/training/logs', aiController.getTrainingLogs);
router.get('/training-metrics', aiController.getTrainingMetrics);
router.post('/semantic-search', aiController.semanticSearch);

// Chat endpoints
router.post('/chat', aiController.chat);
router.put('/chat/clear-all', aiController.clearAllChats);
router.put('/chat/:id/clear', aiController.clearChat);
router.get('/history/all', aiController.getAllChatHistory);
router.get('/history', aiController.getChatHistory);
router.delete('/history/:sessionId', aiController.deleteChatHistory);
router.patch('/history/:sessionId/pin', aiController.pinChatSession);
router.get('/conversation/:conversationId', aiController.getConversation);
router.get('/conversations', aiController.getConversations);
router.delete('/conversation/:conversationId', aiController.clearConversation);

// Project endpoints
router.get('/projects', aiController.getProjects);
router.get('/project/:id', aiController.getAIProject);
router.get('/client/:name', aiController.getClientProjects);

// Feedback endpoint
router.post('/feedback', aiController.submitFeedback);

module.exports = router;
