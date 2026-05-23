const AIKnowledgeService = require('./AIKnowledgeService');
const AINavigationService = require('./AINavigationService');

const PREDEFINED_INTENTS = new Set([
  'create_project_help',
  'pdf_export_help',
  'project_structure_help',
  'assistant_capabilities',
]);

class AIIntentRouter {
  routePredefined(intent, message, entities) {
    if (PREDEFINED_INTENTS.has(intent)) {
      const response = AIKnowledgeService.getPredefinedResponse(intent);
      if (response) {
        return {
          intent,
          entities: entities || {},
          ...response,
          success: true,
          verified: true,
        };
      }
    }
    return null;
  }

  routeNavigation(message, entities) {
    const navResult = AINavigationService.detectPage(message);
    if (navResult) {
      return {
        intent: 'navigation',
        entities: entities || {},
        ...navResult,
        success: true,
        verified: true,
      };
    }
    return null;
  }

  getPredefinedIntents() {
    return AIKnowledgeService.getPredefinedIntents();
  }

  getNavigationPageMap() {
    return AINavigationService.getPageMap();
  }
}

module.exports = new AIIntentRouter();
