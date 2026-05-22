/**
 * AI Controller
 * Handles HTTP requests for AI operations
 */

const PythonAIClient = require('../services/PythonAIClient');
const AITrainingService = require('../services/AITrainingService');
const AILogger = require('../utils/logger');

const logger = new AILogger('AIController');

const pythonAIClient = new PythonAIClient();
const trainingService = new AITrainingService();

/**
 * POST /api/ai/train
 * Start full training of the knowledge base
 */
exports.startTraining = async (req, res) => {
  try {
    logger.info('Training request received');

    if (trainingService.isTraining) {
      return res.status(409).json({
        success: false,
        error: 'Training already in progress',
      });
    }

    trainingService.startFullTraining().catch(err => {
      logger.error('Training failed in background', { error: err.message });
    });

    res.json({
      success: true,
      message: 'Training started',
      sessionId: trainingService.currentSession?.sessionId,
      isTraining: true,
    });
  } catch (err) {
    logger.error('Training error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST /api/ai/retrain
 * Start incremental training (only changed files)
 */
exports.startRetrain = async (req, res) => {
  try {
    logger.info('Retrain request received');

    if (trainingService.isTraining) {
      return res.status(409).json({
        success: false,
        error: 'Training already in progress',
      });
    }

    trainingService.startIncrementalTraining().catch(err => {
      logger.error('Retrain failed in background', { error: err.message });
    });

    res.json({
      success: true,
      message: 'Incremental training started',
      sessionId: trainingService.currentSession?.sessionId,
      isTraining: true,
    });
  } catch (err) {
    logger.error('Retrain error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST /api/ai/stop
 * Stop active training
 */
exports.stopTraining = async (req, res) => {
  try {
    logger.info('Stop training request received');
    const result = await trainingService.stopTraining();

    res.json(result);
  } catch (err) {
    logger.error('Stop training error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/ai/status
 * Get current training status
 */
exports.getStatus = async (req, res) => {
  try {
    const status = await trainingService.getTrainingStatus();

    res.json({
      success: true,
      ...status,
    });
  } catch (err) {
    logger.error('Status error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST /api/ai/chat
 * Send a chat message and get response
 */
exports.chat = async (req, res) => {
  try {
    const { question, conversationId, userId } = req.body;

    if (!question) {
      return res.status(400).json({
        success: false,
        error: 'Question is required',
      });
    }

    logger.info('Chat request received', { question: question.substring(0, 100) });

    const response = await pythonAIClient.chat(question, conversationId, userId);

    res.json({
      success: true,
      ...response,
    });
  } catch (err) {
    logger.error('Chat error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/ai/projects
 * Get all discovered projects
 */
exports.getProjects = async (req, res) => {
  try {
    const result = await pythonAIClient.getProjects();

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    logger.error('Get projects error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/ai/conversation/:conversationId
 * Get conversation history
 */
exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    const result = await pythonAIClient.getConversation(conversationId);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    logger.error('Get conversation error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/ai/conversations
 * Get user conversations
 */
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.query;
    const limit = parseInt(req.query.limit) || 20;

    const result = await pythonAIClient.getConversations(userId || 'anonymous', limit);

    res.json({
      success: true,
      ...result,
    });
  } catch (err) {
    logger.error('Get conversations error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * DELETE /api/ai/conversation/:conversationId
 * Clear conversation
 */
exports.clearConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;

    await pythonAIClient.clearConversation(conversationId);

    res.json({
      success: true,
      message: 'Conversation cleared',
    });
  } catch (err) {
    logger.error('Clear conversation error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/ai/training-history
 * Get training history
 */
exports.getTrainingHistory = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit) || 10;
    const history = await trainingService.getTrainingHistory(limit);

    res.json({
      success: true,
      history,
    });
  } catch (err) {
    logger.error('Get training history error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/ai/training-stats
 * Get training statistics
 */
exports.getTrainingStats = async (req, res) => {
  try {
    const stats = await trainingService.getTrainingStatistics();

    res.json({
      success: true,
      ...stats,
    });
  } catch (err) {
    logger.error('Get training stats error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/ai/training/logs
 * Get training logs
 */
exports.getTrainingLogs = async (req, res) => {
  try {
    const logs = trainingService.getTrainingLogs();

    res.json({
      success: true,
      logs,
    });
  } catch (err) {
    logger.error('Get training logs error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * POST /api/ai/feedback
 * Submit feedback on AI response
 */
exports.submitFeedback = async (req, res) => {
  try {
    const { conversationId, rating, comment, helpful } = req.body;

    if (!conversationId) {
      return res.status(400).json({
        success: false,
        error: 'Conversation ID is required',
      });
    }

    await pythonAIClient.submitFeedback(conversationId, rating, comment, helpful);

    res.json({
      success: true,
      message: 'Feedback submitted',
    });
  } catch (err) {
    logger.error('Submit feedback error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
