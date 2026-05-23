/**
 * AIResponseEngine — accuracy orchestrator
 * Priority: MongoDB project → metadata → systemKnowledge → session context → fallback
 */

const AIIntentService = require('./AIIntentService');
const AINLPService = require('./AINLPService');
const AIUniversalSearch = require('./AIUniversalSearch');
const AIResponseFormatter = require('./AIResponseFormatter');
const AIContextService = require('./AIContextService');
const AIConversationService = require('./AIConversationService');
const AIResponseRouter = require('./AIResponseRouter');

const { FALLBACK, NOT_TRAINED } = AIResponseFormatter;

const KNOWLEDGE_INTENTS = new Set([
  'pdf_export', 'excel_export', 'csv_export', 'project_export', 'export_question',
  'backend_architecture', 'frontend_architecture', 'backend_question', 'frontend_question',
  'project_structure', 'folder_structure', 'architecture_question', 'workflow',
  'workflow_question', 'project_creation', 'project_edit', 'proposal_generation',
  'training', 'training_history', 'system_info', 'help', 'ai_assistant', 'settings',
  'dashboard', 'analytics',
]);

const LIST_INTENTS = new Set(['recent_projects', 'list_projects', 'active_projects', 'completed_projects']);

class AIResponseEngine {
  detectIntent(message, context) {
    return AINLPService.detectIntent(message, context);
  }

  extractEntities(message, context) {
    return AINLPService.extractEntities(message, context);
  }

  contextResolver(session) {
    return AIContextService.contextResolver(session);
  }

  async knowledgeResolver(message, intent, entities) {
    return AIUniversalSearch.findSystemKnowledge(message, intent, entities.keywords);
  }

  calculateConfidence(opts) {
    return AINLPService.calculateConfidence(opts);
  }

  async resolveProject(projectName, intent, entities, context) {
    const search = await AIUniversalSearch.findProject(projectName);
    const intentStrength = (entities.intentHints || []).includes(intent) ? 0.95 : 0.75;
    const confidence = this.calculateConfidence({
      intentMatchStrength: intentStrength,
      entityScore: search.matchScore,
      databaseScore: search.found ? 1 : 0,
      keywordScore: Math.min(1, (entities.keywords?.length || 0) / 8),
      contextScore: entities._fromContext ? 1 : 0,
      hasVerifiedData: search.found,
      fromContext: entities._fromContext,
    });

    if (confidence.tier === 'low' && !search.found) {
      return {
        ok: false,
        content: AINLPService.notFoundMessage(),
        format: 'error',
        error: 'project_not_found',
        confidence: confidence.total,
        suggestions: search.suggestions,
      };
    }

    if (confidence.tier === 'medium' && search.suggestions?.length) {
      return {
        ok: false,
        content: AINLPService.formatConfirmList(search.suggestions),
        format: 'confirm',
        error: 'low_confidence',
        confidence: confidence.total,
        suggestions: search.suggestions,
      };
    }

    if (!search.project) {
      return {
        ok: false,
        content: search.suggestions?.length
          ? AINLPService.formatConfirmList(search.suggestions)
          : AINLPService.notFoundMessage(),
        format: search.suggestions?.length ? 'confirm' : 'error',
        error: 'project_not_found',
        confidence: confidence.total,
        suggestions: search.suggestions,
      };
    }

    return { ok: true, project: search.project, confidence: confidence.total, search };
  }

  _projectResponse(intent, entities, project, confidence, message = '') {
    const routed = AIResponseRouter.route(intent, project, entities, { _message: message });
    const data = {
      project,
      confidence,
      ...(routed.data || {}),
    };

    console.log('[AIResponseEngine]', {
      intent,
      entity: entities.projectName || entities.projectNameRaw,
      selectedFunction: routed.selectedFunction,
      routedIntent: routed.routedIntent,
    });

    return {
      intent: routed.intent || intent,
      entities,
      followUpSuggestions: AIResponseFormatter.getFollowUpSuggestions(project, routed.intent || intent),
      format: routed.format,
      content: routed.content,
      data,
      confidence,
      verified: routed.verified !== false,
      selectedFunction: routed.selectedFunction,
    };
  }

  async generateResponse(message, sessionContext = {}) {
    const context = sessionContext.sessionId
      ? sessionContext
      : AIContextService.buildFromSession(sessionContext);

    const intent = this.detectIntent(message, context);
    const entities = this.extractEntities(message, context);

    if (AINLPService.requiresProject(intent)) {
      if (!entities.projectName) {
        return {
          intent,
          entities,
          format: 'markdown',
          content: 'Please specify a project name from your database.',
          verified: false,
          error: 'missing_project',
        };
      }

      const resolved = await this.resolveProject(entities.projectName, intent, entities, context);
      if (!resolved.ok) {
        return {
          intent,
          entities,
          format: resolved.format,
          content: resolved.content,
          error: resolved.error,
          confidence: resolved.confidence,
          suggestions: resolved.suggestions,
          verified: false,
        };
      }

      return this._projectResponse(intent, entities, resolved.project, resolved.confidence, message);
    }

    if (intent === 'client_projects') {
      const name = entities.clientName || entities.companyName;
      if (!name) {
        return { intent, entities, format: 'markdown', content: 'Please provide a client or company name.', verified: false };
      }
      const projects = await AIUniversalSearch.findClientProjects(name);
      if (!projects.length) {
        return { intent, entities, format: 'error', content: FALLBACK, error: 'client_not_found', verified: false };
      }
      return { intent, entities, ...AIResponseFormatter.formatClientProjects(name, projects) };
    }

    if (LIST_INTENTS.has(intent)) {
      let projects;
      if (intent === 'active_projects') {
        projects = await AIUniversalSearch.findProjectsByStatus('Active', 20);
      } else if (intent === 'completed_projects') {
        projects = await AIUniversalSearch.findProjectsByStatus('Completed', 20);
      } else {
        projects = await AIUniversalSearch.listRecentProjects(entities.statusFilter ? 30 : 15);
        if (entities.statusFilter) {
          projects = projects.filter((p) => p.status === entities.statusFilter);
        }
      }
      if (!projects.length) {
        return { intent, entities, format: 'markdown', content: FALLBACK, verified: false };
      }
      const label = intent === 'active_projects' ? 'Active' : intent === 'completed_projects' ? 'Completed' : 'Recent';
      return { intent, entities, ...AIResponseFormatter.formatClientProjects(label, projects) };
    }

    if (intent === 'help' || intent === 'ai_assistant') {
      const conv = AIConversationService.tryConversation(message, {
        entities,
        intent,
        context: sessionContext,
      });
      if (conv) return { entities, ...conv };
      return { entities, ...AIConversationService.handleHelp() };
    }

    if (KNOWLEDGE_INTENTS.has(intent) || intent === 'general') {
      const knowledge = await this.knowledgeResolver(message, intent, entities);
      if (knowledge.length > 0) {
        return {
          intent,
          entities,
          format: 'markdown',
          content: AIResponseFormatter.formatKnowledge(knowledge),
          data: { sources: knowledge.map((k) => k.title) },
          verified: true,
        };
      }
    }

    const knowledge = await this.knowledgeResolver(message, intent, entities);
    if (knowledge.length > 0) {
      return {
        intent,
        entities,
        format: 'markdown',
        content: AIResponseFormatter.formatKnowledge(knowledge),
        data: { sources: knowledge.map((k) => k.title) },
        verified: true,
      };
    }

    const conversation = AIConversationService.tryConversation(message, {
      entities,
      intent,
      context: sessionContext,
    });
    if (conversation) {
      return { entities, ...conversation };
    }

    if (intent === 'general') {
      const conv = AIConversationService.resolve('general', sessionContext);
      if (conv) return { entities, ...conv };
    }

    return {
      intent,
      entities,
      format: 'markdown',
      content: NOT_TRAINED,
      verified: false,
      error: 'not_trained',
    };
  }
}

module.exports = new AIResponseEngine();
