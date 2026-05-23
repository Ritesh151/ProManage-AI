/**
 * Master AI pipeline — single deterministic flow (no conflicting layers)
 */

const AINLPService = require('./AINLPService');
const AIConversationService = require('./AIConversationService');
const AIProjectResolver = require('./AIProjectResolver');
const AIResponseRouter = require('./AIResponseRouter');
const AIResponseFormatter = require('./AIResponseFormatter');
const AIUniversalSearch = require('./AIUniversalSearch');
const AIContextService = require('./AIContextService');
const AIProjectCache = require('./AIProjectCache');

const { FALLBACK, NOT_TRAINED } = AIResponseFormatter;

const INTENT_PRIORITY = [
  'project_proposal',
  'project_technologies',
  'frontend_technology',
  'backend_technology',
  'database_technology',
  'project_cost',
  'project_scope',
  'project_status',
  'project_timeline',
  'project_category',
  'project_client',
  'project_company',
  'project_features',
  'project_pages',
  'project_details',
  'client_projects',
  'recent_projects',
  'active_projects',
  'completed_projects',
];

const PROJECT_INTENTS = new Set([
  'project_proposal', 'project_technologies', 'frontend_technology', 'backend_technology',
  'database_technology', 'project_cost', 'project_scope', 'project_status', 'project_timeline',
  'project_category', 'project_client', 'project_company', 'project_branch', 'project_features',
  'project_pages', 'project_details', 'proposal', 'proposal_details',
]);

const LIST_INTENTS = new Set(['recent_projects', 'list_projects', 'active_projects', 'completed_projects']);

const KNOWLEDGE_INTENTS = new Set([
  'pdf_export', 'excel_export', 'csv_export', 'project_export', 'workflow', 'training',
  'backend_architecture', 'frontend_architecture', 'project_structure', 'help', 'ai_assistant',
]);

class AIOrchestratorService {
  log(step, data) {
    console.log(`[AIOrchestrator] ${step}:`, data);
  }

  normalizeInput(message) {
    return AINLPService.normalizeInput(message);
  }

  detectConversationIntent(message, ctx) {
    return AIConversationService.detectConversationIntent(message, {
      entities: ctx._entities || {},
      intent: ctx._intent || null,
    });
  }

  resolveIntent(message, context = {}, options = {}) {
    if (options.forceIntent) return options.forceIntent;
    if (options.pendingIntent && PROJECT_INTENTS.has(options.pendingIntent)) {
      return options.pendingIntent;
    }

    const normalized = this.normalizeInput(message);
    const n = normalized.toLowerCase();

    const scores = {};

    const techKw = /\b(technolog|technologies|tech stack|used technologies|framework|frameworks)\b/;
    const costKw = /\b(cost|price|pricing|budget|amount|payment|fees|charges|expensive)\b/;
    const scopeKw = /\b(scope|deliverable)\b/;
    const statusKw = /\b(status)\b/;
    const proposalKw = /\b(proposal|quotation|quote)\b/;
    const detailKw = /\b(detail|details|about|explain|information|info|show|display|tell me about)\b/;
    const clientKw = /\b(client|company|customer)\b.*\bprojects?\b|\bprojects?\s+(of|for)\s+(client|company)/;

    if (techKw.test(n)) scores.project_technologies = 10;
    if (costKw.test(n) && !techKw.test(n)) scores.project_cost = 9;
    else if (costKw.test(n) && techKw.test(n)) scores.project_technologies = 11;
    if (proposalKw.test(n) && !techKw.test(n)) scores.project_proposal = 10;
    if (scopeKw.test(n)) scores.project_scope = 8;
    if (statusKw.test(n) && !techKw.test(n)) scores.project_status = 8;
    if (detailKw.test(n) && !techKw.test(n)) scores.project_details = 5;
    if (clientKw.test(n)) scores.client_projects = 9;

    if (/\bfrontend\b/.test(n) && techKw.test(n)) scores.frontend_technology = 11;
    if (/\bbackend\b/.test(n) && techKw.test(n)) scores.backend_technology = 11;
    if (/\bdatabase\b/.test(n) && techKw.test(n)) scores.database_technology = 11;

    if (context.currentProject?.projectName && this._isFollowUp(n, message)) {
      const follow = this._followUpIntent(n, context.lastIntent);
      if (follow) scores[follow] = (scores[follow] || 0) + 12;
    }

    const nlpIntent = AINLPService.detectIntent(message, context);
    scores[nlpIntent] = (scores[nlpIntent] || 0) + 3;

    let best = null;
    let bestScore = 0;
    for (const intent of INTENT_PRIORITY) {
      if (scores[intent] > bestScore) {
        bestScore = scores[intent];
        best = intent;
      }
    }

    if (!best) best = nlpIntent || 'general';
    return AIResponseRouter.normalizeIntent(best);
  }

  _isFollowUp(normalized, raw) {
    const hasName = /\b(?:project\s+)?[a-z0-9][\w\-]{4,}(?:\s+-\s+[\w\s]+)?/i.test(raw) &&
      !/\[context project:/i.test(raw);
    return (
      !hasName ||
      /^(what|which|how|show|tell)/i.test(raw.trim())
    ) && /\b(what|which|how|tech|technolog|cost|price|status|scope|proposal|detail|used)\b/.test(normalized);
  }

  _followUpIntent(n, lastIntent) {
    if (/\b(technolog|technologies|tech|stack|used|framework)\b/.test(n)) return 'project_technologies';
    if (/\b(cost|price|budget|amount)\b/.test(n)) return 'project_cost';
    if (/\b(status)\b/.test(n)) return 'project_status';
    if (/\b(scope)\b/.test(n)) return 'project_scope';
    if (/\b(proposal)\b/.test(n)) return 'project_proposal';
    if (PROJECT_INTENTS.has(lastIntent)) return lastIntent;
    return 'project_details';
  }

  resolveEntities(message, context = {}) {
    return AINLPService.extractEntities(message, context);
  }

  async resolveProject(query, options = {}, fallbackQuery = null) {
    const name = options.resolveProjectName || options.projectName || query;
    if (!name && !fallbackQuery) {
      return { found: false, project: null, matchScore: 0, confidence: 0, suggestions: [], matchType: null };
    }

    if (options.forceProjectId) {
      const p = await AIProjectCache.getById(options.forceProjectId);
      if (p) {
        return { found: true, project: p, matchScore: 1, confidence: 100, matchType: 'forced', suggestions: [] };
      }
    }

    const tryResolve = async (q) => {
      if (!q) return null;
      const cached = await AIProjectCache.getByExactName(q);
      if (cached) {
        return { found: true, project: cached, matchScore: 1, confidence: 100, matchType: 'exact', suggestions: [] };
      }
      return AIProjectResolver.resolve(q);
    };

    let resolved = await tryResolve(name);

    if ((!resolved || !resolved.found) && fallbackQuery && fallbackQuery !== name) {
      const alt = await tryResolve(fallbackQuery);
      if (alt && (!resolved || (alt.confidence || 0) > (resolved.confidence || 0))) {
        resolved = alt;
      }
    }

    if (!resolved) {
      return { found: false, project: null, matchScore: 0, confidence: 0, suggestions: [], matchType: null };
    }

    if (resolved.found || options.skipConfirm) {
      return resolved;
    }

    if (options.skipConfirm && resolved.suggestions?.length) {
      const pick = await AIProjectResolver.resolve(resolved.suggestions[0]);
      if (pick.found) return pick;
    }

    return resolved;
  }

  calculateConfidence(search, intent, entities, options = {}) {
    if (options.skipConfirm) {
      return { total: 95, tier: 'high', breakdown: {} };
    }
    return AINLPService.calculateConfidence({
      intentMatchStrength: intent ? 0.9 : 0.5,
      entityScore: search.matchScore || 0,
      databaseScore: search.found ? 1 : 0,
      keywordScore: Math.min(1, (entities.keywords?.length || 0) / 8),
      contextScore: entities._fromContext ? 1 : 0,
      hasVerifiedData: search.found,
      fromContext: entities._fromContext,
    });
  }

  routeResponse(intent, project, entities, message) {
    return AIResponseRouter.route(intent, project, entities, { _message: message });
  }

  formatResponse(routed, meta = {}) {
    const tech = AIResponseRouter.getTechnologies(meta.project || {});
    const emptyTech =
      !(tech.frontend?.length) &&
      !(tech.backend?.length) &&
      !(tech.database?.length) &&
      !(tech.tools?.length);

    if (
      meta.intent === 'project_technologies' &&
      meta.project &&
      emptyTech &&
      routed.format === 'technologies'
    ) {
      return {
        ...routed,
        content: `------------------------------------------------\nProject: ${meta.project.projectName}\n------------------------------------------------\n\nNo technologies have been stored for this project.`,
        verified: true,
      };
    }
    return routed;
  }

  executeAction(intent, project, entities, message) {
    const routed = this.routeResponse(intent, project, entities, message);
    return this.formatResponse(routed, { intent, project });
  }

  async processMessage(message, sessionContext = {}, options = {}) {
    const pipeline = {
      input: message?.substring(0, 120),
      resolveProjectName: options.resolveProjectName || null,
      pendingIntent: options.pendingIntent || sessionContext.pendingIntent || null,
    };

    try {
      const normalized = this.normalizeInput(message);
      const context = { ...sessionContext };
      const enriched = AIContextService.enrichMessageWithContext(message, context);
      const workMessage = options.resolveProjectName
        ? `${enriched} [context project: ${options.resolveProjectName}]`
        : enriched;

      context._intent = null;
      context._entities = {};

      const convIntent = this.detectConversationIntent(workMessage, context);
      if (convIntent && !options.resolveProjectName && !PROJECT_INTENTS.has(options.pendingIntent)) {
        const convOnly = !/\b(project|proposal|client|cost|price|technolog|technology|tech)\b/i.test(normalized);
        if (convOnly) {
          const conv = AIConversationService.resolve(convIntent, context);
          this.log('Conversation', { convIntent });
          return {
            ...conv,
            entities: {},
            pipeline: 'conversation',
            success: true,
          };
        }
      }

      const intent = this.resolveIntent(workMessage, context, options);
      const entities = this.resolveEntities(workMessage, context);
      context._intent = intent;
      context._entities = entities;

      this.log('Intent', intent);
      this.log('Entity', entities.projectName || entities.projectNameRaw);

      if (intent === 'client_projects') {
        const name = entities.clientName || entities.companyName;
        if (!name) {
          return { intent, entities, format: 'markdown', content: 'Please provide a client or company name.', verified: false, success: true };
        }
        const projects = await AIUniversalSearch.findClientProjects(name);
        if (!projects.length) {
          return { intent, entities, format: 'error', content: 'No matching verified project found.', verified: false, success: true };
        }
        return { intent, entities, ...AIResponseFormatter.formatClientProjects(name, projects), success: true };
      }

      if (LIST_INTENTS.has(intent)) {
        let projects;
        if (intent === 'active_projects') projects = await AIUniversalSearch.findProjectsByStatus('Active', 20);
        else if (intent === 'completed_projects') projects = await AIUniversalSearch.findProjectsByStatus('Completed', 20);
        else projects = await AIUniversalSearch.listRecentProjects(15);
        if (!projects.length) {
          return { intent, entities, format: 'markdown', content: FALLBACK, verified: false, success: true };
        }
        const label = intent === 'active_projects' ? 'Active' : intent === 'completed_projects' ? 'Completed' : 'Recent';
        return { intent, entities, ...AIResponseFormatter.formatClientProjects(label, projects), success: true };
      }

      if (!PROJECT_INTENTS.has(intent) && !options.resolveProjectName) {
        if (KNOWLEDGE_INTENTS.has(intent) || intent === 'general' || intent === 'help') {
          const knowledge = await AIUniversalSearch.findSystemKnowledge(workMessage, intent, entities.keywords);
          if (knowledge.length) {
            return {
              intent,
              entities,
              format: 'markdown',
              content: AIResponseFormatter.formatKnowledge(knowledge),
              data: { sources: knowledge.map((k) => k.title) },
              verified: true,
              success: true,
            };
          }
          if (intent === 'help') {
            return { ...AIConversationService.handleHelp(), entities, success: true };
          }
        }
        const conv = AIConversationService.tryConversation(workMessage, { entities, intent, context });
        if (conv) return { entities, ...conv, success: true };
        return { intent, entities, format: 'markdown', content: NOT_TRAINED, verified: false, success: true };
      }

      let projectQuery =
        options.resolveProjectName ||
        entities.projectName ||
        entities.projectNameRaw ||
        context.currentProject?.projectName;

      if (!projectQuery && PROJECT_INTENTS.has(intent)) {
        projectQuery = workMessage.replace(/\[context project:[^\]]+\]/gi, '').trim();
      }

      if (!projectQuery) {
        return {
          intent,
          entities,
          format: 'markdown',
          content: 'Please specify a project name from your database.',
          verified: false,
          success: true,
        };
      }

      const skipConfirm = Boolean(options.resolveProjectName || options.skipConfirm);
      const search = await this.resolveProject(
        projectQuery,
        {
          resolveProjectName: options.resolveProjectName,
          skipConfirm,
          forceProjectId: options.forceProjectId,
        },
        workMessage
      );

      const resolverConfidence = search.confidence ?? Math.round((search.matchScore || 0) * 100);
      const confidence = this.calculateConfidence(search, intent, entities, { skipConfirm });
      confidence.total = Math.max(confidence.total, resolverConfidence);

      this.log('Resolved Project', search.project?.projectName || 'none');
      this.log('Confidence', resolverConfidence);
      this.log('Mongo Query', { query: projectQuery, found: search.found, matchType: search.matchType });

      if (!search.found && !skipConfirm) {
        if (search.suggestions?.length && resolverConfidence < 50) {
          return {
            intent,
            entities,
            format: 'confirm',
            content: AIResponseFormatter.formatConfirm(search.suggestions),
            suggestions: search.suggestions,
            pendingIntent: intent,
            originalQuestion: options.originalQuestion || message,
            confidence: resolverConfidence,
            verified: false,
            needsConfirmation: true,
            success: true,
          };
        }
        return {
          intent,
          entities,
          format: 'error',
          content: 'No matching verified project found.',
          verified: false,
          success: true,
        };
      }

      if (!search.project) {
        return {
          intent,
          entities,
          format: 'error',
          content: 'No matching verified project found.',
          verified: false,
          success: true,
        };
      }

      const executed = this.executeAction(intent, search.project, entities, workMessage);

      this.log('Selected Handler', executed.selectedFunction || executed.intent);
      this.log('Returned Data', {
        format: executed.format,
        projectName: search.project.projectName,
        hasTech: Boolean(
          search.project.technologies?.frontend?.length ||
          search.project.technologies?.backend?.length
        ),
      });

      return {
        ...executed,
        entities,
        confidence: confidence.total,
        data: { ...(executed.data || {}), project: search.project, confidence: confidence.total },
        suggestions: [],
        currentProject: {
          projectId: search.project._id?.toString(),
          projectName: search.project.projectName,
        },
        success: true,
        pipeline: 'project',
      };
    } catch (err) {
      console.error('[AIOrchestrator] Error:', err.message);
      return {
        format: 'error',
        content: 'Project exists but requested information is unavailable.',
        verified: false,
        error: err.message,
        success: true,
      };
    }
  }
}

module.exports = new AIOrchestratorService();
