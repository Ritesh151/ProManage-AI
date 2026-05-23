/**
 * AI Controller
 * Handles HTTP requests for AI operations
 */

const PythonAIClient = require('../services/PythonAIClient');
const AIEngine = require('../../services/AIEngine');
const AITrainingService = require('../services/AITrainingService');
const SemanticSearchService = require('../services/SemanticSearchService');
const TrainingMetricsService = require('../services/TrainingMetricsService');
const AILogger = require('../utils/logger');

const logger = new AILogger('AIController');

const pythonAIClient = new PythonAIClient();
const trainingService = new AITrainingService();
const semanticSearchService = new SemanticSearchService();
const trainingMetricsService = new TrainingMetricsService();

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
    const {
      question,
      conversationId,
      sessionId,
      userId,
      userName,
      resolveProjectName,
      pendingIntent,
      originalQuestion,
    } = req.body;
    const message = question || req.body.message || originalQuestion;

    if (!message && !resolveProjectName) {
      return res.status(400).json({ success: false, error: 'Question is required' });
    }

    logger.info('Chat request received', {
      question: (message || resolveProjectName || '').substring(0, 100),
      resolveProjectName,
      pendingIntent,
    });

    const response = await AIEngine.processChat(
      message || `Resolve project ${resolveProjectName}`,
      sessionId || conversationId,
      userId || 'anonymous',
      userName,
      { resolveProjectName, pendingIntent, originalQuestion, skipConfirm: Boolean(resolveProjectName) }
    );

    res.json(response);
  } catch (err) {
    logger.error('Chat error', { error: err.message });
    res.json({
      success: true,
      answer: 'No matching verified project found.',
      format: 'error',
      verified: false,
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
    const projects = await AIEngine.listProjectsForSidebar();
    res.json({ success: true, projects });
  } catch (err) {
    logger.error('Get projects error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/ai/conversation/:conversationId
 * Get conversation history
 */
exports.getConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const session = await AIEngine.getSession(conversationId);
    if (!session) {
      return res.status(404).json({ success: false, error: 'Session not found' });
    }
    res.json({ success: true, conversation: session, messages: session.messages });
  } catch (err) {
    logger.error('Get conversation error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * GET /api/ai/conversations
 * Get user conversations
 */
exports.getConversations = async (req, res) => {
  try {
    const { userId } = req.query;
    const limit = parseInt(req.query.limit, 10) || 20;
    const sessions = await AIEngine.getHistory(userId || 'anonymous', limit);
    const conversations = sessions.map((s) => ({
      _id: s.sessionId,
      sessionId: s.sessionId,
      messages: s.messages,
      updatedAt: s.updatedAt,
      pinnedChats: s.pinnedChats,
      currentProject: s.currentProject,
      preview: s.messages?.[s.messages.length - 1]?.content?.substring(0, 80) || '',
    }));
    res.json({ success: true, conversations });
  } catch (err) {
    logger.error('Get conversations error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * DELETE /api/ai/conversation/:conversationId
 * Clear conversation
 */
exports.clearConversation = async (req, res) => {
  try {
    const { conversationId } = req.params;
    const { userId } = req.query;
    await AIEngine.softClearChat(conversationId, userId || 'anonymous');
    res.json({ success: true, message: 'Conversation cleared from UI', softDeleted: true });
  } catch (err) {
    logger.error('Clear conversation error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.clearChat = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId } = req.body;
    const result = await AIEngine.softClearChat(id, userId || 'anonymous');
    res.json({ success: true, message: 'Chat cleared from UI', ...result });
  } catch (err) {
    logger.error('Clear chat error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.clearAllChats = async (req, res) => {
  try {
    const { userId } = req.body;
    const result = await AIEngine.softClearAllChats(userId || 'anonymous');
    res.json({ success: true, message: 'All chats cleared from UI', ...result });
  } catch (err) {
    logger.error('Clear all chats error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAllChatHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const limit = parseInt(req.query.limit, 10) || 100;
    const history = await AIEngine.getAllHistoryAdmin(userId || null, limit);
    res.json({ success: true, history, includeDeleted: true });
  } catch (err) {
    logger.error('Get all chat history error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getChatHistory = async (req, res) => {
  try {
    const { userId } = req.query;
    const limit = parseInt(req.query.limit, 10) || 20;
    const history = await AIEngine.getHistory(userId || 'anonymous', limit);
    res.json({ success: true, history });
  } catch (err) {
    logger.error('Get chat history error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.deleteChatHistory = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { userId } = req.query;
    const result = await AIEngine.softClearChat(sessionId, userId || 'anonymous');
    res.json({ success: true, message: 'Session removed from UI', softDeleted: true, ...result });
  } catch (err) {
    logger.error('Delete chat history error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getAIProject = async (req, res) => {
  try {
    const project = await AIEngine.getProjectById(req.params.id);
    if (!project) {
      return res.status(404).json({ success: false, error: 'Project not found' });
    }
    res.json({ success: true, project });
  } catch (err) {
    logger.error('Get AI project error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.getClientProjects = async (req, res) => {
  try {
    const name = decodeURIComponent(req.params.name || '');
    const projects = await AIEngine.getClientProjects(name);
    res.json({ success: true, projects, count: projects.length });
  } catch (err) {
    logger.error('Get client projects error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.pinChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { pinned } = req.body;
    await AIEngine.pinSession(sessionId, pinned !== false);
    res.json({ success: true, pinned: pinned !== false });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
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
 * GET /api/ai/training-metrics
 * Live infrastructure metrics and chart data
 */
exports.getTrainingMetrics = async (req, res) => {
  try {
    const metrics = await trainingMetricsService.getDashboardMetrics(trainingService);
    res.json({ success: true, ...metrics });
  } catch (err) {
    logger.error('Get training metrics error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
  }
};

/**
 * POST /api/ai/semantic-search
 * Semantic retrieval testing against vector DB
 */
exports.semanticSearch = async (req, res) => {
  try {
    const { query, limit = 5 } = req.body;
    if (!query || !query.trim()) {
      return res.status(400).json({ success: false, error: 'Query is required' });
    }
    const result = await semanticSearchService.search(query.trim(), Math.min(limit, 20));
    res.json({ success: true, ...result });
  } catch (err) {
    logger.error('Semantic search error', { error: err.message });
    res.status(500).json({ success: false, error: err.message });
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
