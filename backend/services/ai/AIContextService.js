/**
 * Session context — current project/client, follow-ups, recent entities
 */

const PROJECT_INTENTS = new Set([
  'project_details', 'project_cost', 'project_scope', 'project_status', 'project_timeline',
  'project_category', 'project_proposal', 'project_client', 'project_company', 'project_branch',
  'project_features', 'project_pages', 'project_technologies', 'frontend_technology',
  'backend_technology', 'database_technology', 'proposal', 'project_proposal', 'proposal_details',
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

  contextResolver(session) {
    return this.buildFromSession(session);
  }

  updateSessionFromResponse(session, { intent, entities, response }) {
    if (response.data?.project) {
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

    session.recentEntities = {
      projectName: entities?.projectName || session.currentProject?.projectName,
      clientName: entities?.clientName || session.currentClient?.clientName,
      companyName: entities?.companyName,
      techLayer: entities?.techLayer,
      lastIntent: intent,
      updatedAt: new Date(),
    };

    if (entities?.projectName && !entities._fromContext) {
      session.currentProject = {
        projectName: entities.projectNameRaw || entities.projectName,
        projectId: session.currentProject?.projectId,
      };
    }
  }

  enrichMessageWithContext(message, context) {
    if (!context.currentProject?.projectName) return message;

    const q = message.toLowerCase();
    const hasExplicitProject = /\b(?:project\s+)?[A-Z][a-zA-Z0-9]{5,}\b/.test(message) ||
      /project\s+["']?[A-Za-z0-9]{3,}/i.test(message);

    const isFollowUp =
      !hasExplicitProject &&
      (PROJECT_INTENTS.has(context.lastIntent) ||
        /\b(what|which|show|tell|how|cost|status|scope|technolog|tech|used|proposal|detail|about|frontend|backend|database|timeline|features|pages|client|company|branch)/.test(q));

    if (isFollowUp) {
      return `${message} [context project: ${context.currentProject.projectName}]`;
    }
    return message;
  }
}

module.exports = new AIContextService();
