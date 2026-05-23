/**
 * AIEngine — facade (preserves existing API, delegates to AIResponseEngine)
 */

const Project = require('../models/Project');
const ChatSession = require('../models/ChatSession');
const AIContextService = require('./AIContextService');
const AISearchService = require('./AISearchService');
const AIOrchestratorService = require('./AIOrchestratorService');

class AIEngine {
  async generateResponse(message, sessionContext = {}, options = {}) {
    return AIOrchestratorService.processMessage(message, sessionContext, options);
  }

  async getOrCreateSession(sessionId, userId = 'anonymous') {
    let session = await ChatSession.findOne({
      sessionId,
      isDeleted: { $ne: true },
    });
    if (!session) {
      session = await ChatSession.create({
        sessionId,
        userId,
        messages: [],
        previousQuestions: [],
        recentEntities: {},
        isDeleted: false,
      });
    }
    return session;
  }

  async processChat(question, sessionId, userId = 'anonymous', userName = null, chatOptions = {}) {
    const start = Date.now();
    const sid = sessionId || `sess-${Date.now()}`;
    const session = await this.getOrCreateSession(sid, userId);

    const context = AIContextService.buildFromSession(session);
    context.userName = userName || (userId && userId !== 'anonymous' ? userId : null);
    context.pendingIntent = session.pendingIntent || chatOptions.pendingIntent;

    const orchestratorOptions = {
      resolveProjectName: chatOptions.resolveProjectName,
      pendingIntent: chatOptions.pendingIntent || session.pendingIntent,
      originalQuestion: chatOptions.originalQuestion || session.pendingOriginalQuestion || question,
      skipConfirm: Boolean(chatOptions.resolveProjectName || chatOptions.skipConfirm),
      forceProjectId: chatOptions.forceProjectId,
    };

    const displayQuestion = chatOptions.resolveProjectName
      ? `Confirm: ${chatOptions.resolveProjectName}`
      : question;

    const response = await AIOrchestratorService.processMessage(question, context, orchestratorOptions);

    if (response.needsConfirmation) {
      session.pendingIntent = response.pendingIntent;
      session.pendingOriginalQuestion = response.originalQuestion || question;
    } else {
      session.pendingIntent = undefined;
      session.pendingOriginalQuestion = undefined;
    }

    AIContextService.updateSessionFromResponse(session, {
      intent: response.intent,
      entities: response.entities,
      response,
    });

    session.messages.push({ role: 'user', content: displayQuestion, timestamp: new Date() });
    session.messages.push({
      role: 'assistant',
      content: response.content,
      intent: response.intent,
      entities: response.entities,
      format: response.format,
      data: response.data,
      confidence: response.confidence ?? response.data?.confidence,
      timestamp: new Date(),
    });

    session.previousQuestions = [question, ...(session.previousQuestions || [])].slice(0, 20);
    session.recentQueries = [question, ...(session.recentQueries || [])].slice(0, 10);
    await session.save();

    return {
      success: true,
      answer: response.content,
      conversationId: sid,
      sessionId: sid,
      intent: response.intent,
      entities: response.entities,
      format: response.format,
      data: response.data,
      verified: response.verified !== false,
      confidence: response.confidence ?? response.data?.confidence,
      suggestions: response.suggestions || [],
      followUpSuggestions: response.followUpSuggestions || [],
      sources: response.data?.sources || [],
      responseTime: Date.now() - start,
      error: response.error || null,
      currentProject: response.currentProject || session.currentProject,
      pendingIntent: response.needsConfirmation ? response.pendingIntent : null,
      needsConfirmation: response.needsConfirmation || false,
    };
  }

  async getHistory(userId = 'anonymous', limit = 20) {
    return ChatSession.find({ userId, status: 'active', isDeleted: { $ne: true } })
      .sort({ pinnedChats: -1, updatedAt: -1 })
      .limit(limit)
      .select('sessionId messages updatedAt createdAt currentProject pinnedChats previousQuestions lastIntent recentEntities isDeleted')
      .lean();
  }

  async getAllHistoryAdmin(userId = null, limit = 100) {
    const filter = userId ? { userId } : {};
    return ChatSession.find(filter)
      .sort({ updatedAt: -1 })
      .limit(limit)
      .select('sessionId userId messages updatedAt createdAt isDeleted deletedAt pinnedChats')
      .lean();
  }

  async getSession(sessionId) {
    return ChatSession.findOne({ sessionId, isDeleted: { $ne: true } }).lean();
  }

  async softClearChat(sessionId, userId = 'anonymous') {
    if (!sessionId) return { modified: 0 };
    const result = await ChatSession.updateOne(
      { sessionId, userId },
      { isDeleted: true, deletedAt: new Date() }
    );
    if (result.matchedCount === 0) {
      await ChatSession.updateOne(
        { sessionId },
        { isDeleted: true, deletedAt: new Date() }
      );
    }
    return { modified: result.modifiedCount || 1, sessionId, softDeleted: true };
  }

  async softClearAllChats(userId = 'anonymous') {
    const result = await ChatSession.updateMany(
      { userId, isDeleted: { $ne: true } },
      { isDeleted: true, deletedAt: new Date() }
    );
    return { modified: result.modifiedCount, softDeleted: true };
  }

  async deleteHistory(sessionId) {
    return this.softClearChat(sessionId);
  }

  async pinSession(sessionId, pinned = true) {
    await ChatSession.updateOne({ sessionId }, { pinnedChats: pinned });
  }

  async getProjectById(id) {
    const p = await Project.findById(id).lean();
    return p || null;
  }

  async getClientProjects(name) {
    return AISearchService.findClientProjects(name);
  }

  async listProjectsForSidebar() {
    const projects = await Project.find()
      .select('projectName projectId status cost clientName companyName createdAt')
      .sort({ updatedAt: -1 })
      .limit(50)
      .lean();
    return projects.map((p) => ({
      name: p.projectName,
      id: p._id,
      projectId: p.projectId,
      status: p.status,
      cost: p.cost,
      client: p.clientName,
      company: p.companyName,
      createdAt: p.createdAt,
    }));
  }
}

module.exports = new AIEngine();
