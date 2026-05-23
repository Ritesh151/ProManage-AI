const AIIntentRouterService = require('./AIIntentRouterService');
const AIIntentService = require('./AIIntentService');
const AIContextService = require('./AIContextService');
const AIHelpService = require('./AIHelpService');

class AIOrchestratorService {
  async processMessage(message, sessionContext = {}, options = {}) {
    const context = { ...sessionContext };
    const enriched = AIContextService.enrichMessageWithContext(message, context);
    const response = await AIIntentRouterService.route(enriched, context, options);

    console.log({
      userInput: message,
      intent: response.intent,
      responseType: response.responseType || response.format,
      projectFound: !!response.data?.project?.projectName,
      projectsCount: response.data?.projects?.length || 0,
    });

    return response;
  }

  _greeting() {
    return {
      intent: 'greeting', format: 'conversation',
      content: `👋 Hello! I'm your **Project Assistant**.`,
      verified: true, conversation: true,
    };
  }

  _help() {
    return AIHelpService.getShortHelp();
  }

  _smalltalk() {
    return {
      intent: 'smalltalk', format: 'conversation',
      content: `I'm your **Project Assistant** built on MongoDB. Ask me about project details, technologies, costs, proposals, navigation, and more.`,
      verified: true, conversation: true,
    };
  }
}

module.exports = new AIOrchestratorService();
