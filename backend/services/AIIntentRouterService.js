const AIIntentService = require('./AIIntentService');
const AIEntityService = require('./AIEntityService');
const AISearchService = require('./AISearchService');
const AIProjectResolver = require('./AIProjectResolver');
const AIResponseRouter = require('./AIResponseRouter');
const AIContextService = require('./AIContextService');
const AISystemKnowledgeService = require('./AISystemKnowledgeService');
const AIHelpService = require('./AIHelpService');
const AINavigationService = require('./AINavigationService');
const AIQueryNormalizer = require('./AIQueryNormalizer');
const AIFallbackService = require('./AIFallbackService');
const AIPageActionService = require('./AIPageActionService');

const LIST_INTENTS = new Set(['show_all_projects', 'show_recent_projects', 'show_active_projects', 'active_projects', 'completed_projects']);

const PROJECT_INTENTS = new Set([
  'project_cost', 'project_details', 'project_proposal', 'project_technologies',
  'project_scope', 'project_status', 'project_client', 'project_timeline',
  'project_features', 'project_category', 'project_pages',
  'frontend_technology', 'backend_technology', 'database_technology',
  'general_project_query',
]);

class AIIntentRouterService {
  async route(message, sessionContext = {}, options = {}) {
    try {
      const normalized = AIQueryNormalizer.normalize(message);
      const context = { ...sessionContext };
      const enriched = AIContextService.enrichMessageWithContext(message, context);
      const intent = AIIntentService.detect(enriched, context);
      const entities = AIEntityService.extract(enriched, context);

      const navResult = AINavigationService.detectPage(message);
      if (navResult) {
        return {
          intent: 'navigation',
          entities,
          ...navResult,
          success: true,
          verified: true,
        };
      }

      const expanded = AIQueryNormalizer.expandKeywords(normalized);

      if (intent === 'smalltalk') return this._smalltalk();
      if (intent === 'greeting') return this._greeting();
      if (intent === 'help') return { intent, entities, ...AIHelpService.getHelpResponse(), success: true };

      if (intent === 'client_projects') {
        const name = entities.clientName || entities.companyName;
        if (!name) return { intent, entities, ...AIFallbackService.noClientName(), success: true };
        const projects = await AISearchService.findClientProjects(name);
        if (!projects.length) return { intent, entities, format: 'error', content: 'No matching verified project found.', verified: false, success: true };
        return { intent, entities, ...AIResponseRouter.formatClientProjects(name, projects), success: true };
      }

      if (LIST_INTENTS.has(intent)) {
        let projects;
        if (intent === 'show_all_projects') projects = await AISearchService.getAllProjects();
        else if (intent === 'show_active_projects' || intent === 'active_projects') projects = await AISearchService.findProjectsByStatus('Active', 50);
        else if (intent === 'completed_projects') projects = await AISearchService.findProjectsByStatus('Completed', 50);
        else projects = await AISearchService.listRecentProjects(10);
        if (!projects.length) return { intent, entities, format: 'markdown', content: AIFallbackService.noProjectData(), verified: false, success: true };
        const label = intent === 'show_all_projects' ? 'Found' : intent === 'show_active_projects' || intent === 'active_projects' ? 'Active' : intent === 'completed_projects' ? 'Completed' : 'Recent';
        return { intent, entities, ...AIResponseRouter.formatRecentProjects(label, projects), success: true };
      }

      if (intent === 'system_question') {
        const knowledge = await AISystemKnowledgeService.find(message);
        if (knowledge.length) {
          const content = AISystemKnowledgeService.formatResponse(knowledge);
          return { intent, entities, format: 'markdown', content, data: { sources: knowledge.map(k => k.title) }, verified: true, success: true };
        }
        return { intent, entities, ...AIFallbackService.notTrained(), success: true };
      }

      if (!PROJECT_INTENTS.has(intent)) {
        if (intent === 'unknown') {
          return { intent, entities, ...AIFallbackService.notTrained(), success: true };
        }
        const knowledge = await AISearchService.findSystemKnowledge(message, intent, entities.keywords);
        if (knowledge.length) {
          const content = knowledge.map(k => `## ${k.title}\n\n${k.content}`).join('\n\n---\n\n');
          return { intent, entities, format: 'markdown', content, data: { sources: knowledge.map(k => k.title) }, verified: true, success: true };
        }
        return { intent, entities, ...AIFallbackService.notTrained(), success: true };
      }

      let projectQuery = entities.projectName || entities.projectNameRaw || context.currentProject?.projectName;
      if (!projectQuery) projectQuery = message.replace(/\[context project:[^\]]+\]/gi, '').trim();
      if (!projectQuery) return { intent, entities, ...AIFallbackService.noProjectName(), success: true };

      const resolved = await AIProjectResolver.resolve(projectQuery);

      if (!resolved.found) {
        if (resolved.suggestions?.length && resolved.confidence < 50) {
          return {
            intent, entities, format: 'confirm',
            content: AIResponseRouter.formatConfirm(resolved.suggestions),
            suggestions: resolved.suggestions,
            pendingIntent: intent,
            originalQuestion: options.originalQuestion || message,
            confidence: resolved.confidence,
            verified: false, needsConfirmation: true, success: true,
          };
        }
        return { intent, entities, format: 'error', content: 'No matching verified project found.', verified: false, success: true };
      }

      if (!resolved.project) {
        return { intent, entities, format: 'error', content: 'No matching verified project found.', verified: false, success: true };
      }

      const routed = AIResponseRouter.route(intent, resolved.project, entities);

      return {
        ...routed,
        entities,
        confidence: resolved.confidence,
        data: { project: resolved.project, confidence: resolved.confidence },
        suggestions: [],
        currentProject: {
          projectId: resolved.project._id?.toString(),
          projectName: resolved.project.projectName,
        },
        success: true,
      };
    } catch (err) {
      return AIFallbackService.notTrained();
    }
  }

  _greeting() {
    return {
      intent: 'greeting', format: 'conversation',
      content: `👋 Hello! I'm your **Project Assistant**.\n\nI can help with:\n• Project details, cost, technologies\n• Proposals and scope of work\n• Client projects and timelines\n• Project status and features\n\nTry: *"Show details of Project YourProjectName"* or *"What technologies are used in Project X?"*`,
      verified: true, conversation: true,
    };
  }

  _smalltalk() {
    return {
      intent: 'smalltalk', format: 'conversation',
      content: `I'm your **Project Assistant**, designed to help you get information about your projects from MongoDB. Ask me about project details, technologies, costs, proposals, and more.`,
      verified: true, conversation: true,
    };
  }
}

module.exports = new AIIntentRouterService();
