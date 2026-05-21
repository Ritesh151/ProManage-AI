/**
 * AI Controller
 * Handles HTTP requests for AI operations
 * Proxies to Python AI microservice
 */

const PythonAIClient = require('../services/PythonAIClient');
const AIKnowledgeService = require('../services/AIKnowledgeService');
const AILogger = require('../utils/logger');

const logger = new AILogger('AIController');

const pythonAIClient = new PythonAIClient();
const knowledgeService = new AIKnowledgeService();

/**
 * POST /api/ai/train
 * Start full training of the knowledge base
 */
exports.startTraining = async (req, res) => {
  try {
    logger.info('Training request received');

    const result = await pythonAIClient.startTraining();

    res.json({
      success: true,
      message: 'Training started',
      ...result,
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

    const result = await pythonAIClient.startRetrain();

    res.json({
      success: true,
      message: 'Incremental training started',
      ...result,
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
 * GET /api/ai/status
 * Get current training status
 */
exports.getStatus = async (req, res) => {
  try {
    const status = await pythonAIClient.getStatus();

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
    const result = await pythonAIClient.getTrainingHistory(limit);

    res.json({
      success: true,
      ...result,
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
    const result = await pythonAIClient.getTrainingStats();

    res.json({
      success: true,
      ...result,
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

/**
 * GET /api/ai/knowledge
 * Get knowledge base with indexed projects and stats
 */
exports.getKnowledgeBase = async (req, res) => {
  try {
    const [projects, stats] = await Promise.all([
      knowledgeService.getIndexedProjects(),
      knowledgeService.getKnowledgeStats(),
    ]);

    res.json({
      success: true,
      projects,
      stats,
    });
  } catch (err) {
    logger.error('Get knowledge base error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/ai/knowledge/:id
 * Get details of a specific indexed project
 */
exports.getKnowledgeProject = async (req, res) => {
  try {
    const { id } = req.params;
    const project = await knowledgeService.getProjectDetails(decodeURIComponent(id));

    if (!project) {
      return res.status(404).json({
        success: false,
        error: 'Project not found in knowledge base',
      });
    }

    res.json({
      success: true,
      project,
    });
  } catch (err) {
    logger.error('Get knowledge project error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};

/**
 * GET /api/ai/knowledge/search
 * Search across knowledge base
 */
exports.searchKnowledge = async (req, res) => {
  try {
    const { q } = req.query;

    if (!q || q.trim().length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Search query is required',
      });
    }

    const results = await knowledgeService.searchKnowledge(q);

    res.json({
      success: true,
      results,
      total: results.length,
    });
  } catch (err) {
    logger.error('Search knowledge error', { error: err.message });
    res.status(500).json({
      success: false,
      error: err.message,
    });
  }
};
