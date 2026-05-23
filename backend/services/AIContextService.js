const PROJECT_INTENTS = new Set([
  'project_cost', 'project_details', 'project_proposal', 'project_technologies',
  'project_scope', 'project_status', 'project_client', 'project_timeline',
  'project_features', 'project_category', 'project_pages',
  'frontend_technology', 'backend_technology', 'database_technology',
  'general_project_query',
]);

class AIContextService {
  buildFromSession(session) {
    return {
      sessionId: session?.sessionId,
      currentProject: session?.currentProject || session?.lastSelectedProject || null,
      currentClient: session?.currentClient || null,
      lastIntent: session?.lastIntent || null,
      previousQuestions: session?.previousQuestions || [],
      previousMessages: session?.messages || [],
      recentQueries: session?.recentQueries || [],
      pendingIntent: session?.pendingIntent || null,
      recentEntities: session?.recentEntities || {},
      messages: session?.messages || [],
    };
  }

  updateSessionFromResponse(session, { intent, entities, response }) {
    if (response?.data?.project) {
      const p = response.data.project;
      session.currentProject = {
        projectId: p._id?.toString(),
        projectName: p.projectName,
      };
      session.lastSelectedProject = session.currentProject;
    }

    if (entities?.clientName || entities?.companyName) {
      session.currentClient = {
        clientName: entities.clientName || entities.companyName,
        companyName: entities.companyName,
      };
    }

    session.lastIntent = intent;

    if (response?.responseType === 'navigation' && response?.page) {
      session.currentPage = response.page;
    }

    session.recentEntities = {
      projectName: entities?.projectName || session.currentProject?.projectName,
      clientName: entities?.clientName || session.currentClient?.clientName,
      companyName: entities?.companyName,
      techLayer: entities?.techLayer,
      lastIntent: intent,
      updatedAt: new Date(),
    };
  }

  enrichMessageWithContext(message, context) {
    if (!context.currentProject?.projectName) return message;

    const q = message.toLowerCase();
    const hasExplicitProject = /[A-Z][a-zA-Z0-9]{5,}/.test(message) ||
      /project\s+["']?[A-Za-z0-9]{3,}/i.test(message);

    const isFollowUp = !hasExplicitProject &&
      (PROJECT_INTENTS.has(context.lastIntent) ||
        /\b(what|which|show|tell|how|cost|status|scope|technolog|tech|used|proposal|detail|about|frontend|backend|database|timeline|features|pages|client|company|branch)\b/.test(q));

    if (isFollowUp) {
      return `${message} [context project: ${context.currentProject.projectName}]`;
    }
    return message;
  }
}

module.exports = new AIContextService();
