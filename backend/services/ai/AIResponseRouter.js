/**
 * Intent → response function router (strict mapping, no cross-intent bleed)
 */

const AIResponseFormatter = require('./AIResponseFormatter');

const TECH_INTENTS = new Set([
  'project_technologies',
  'frontend_technology',
  'backend_technology',
  'database_technology',
  'technologies',
]);

const INTENT_ALIASES = {
  proposal: 'project_proposal',
  proposal_details: 'project_proposal',
  proposal_generation: 'project_proposal',
  technologies: 'project_technologies',
  project_details: 'project_details',
  list_projects: 'recent_projects',
};

class AIResponseRouter {
  normalizeIntent(intent) {
    return INTENT_ALIASES[intent] || intent;
  }

  coerceIntent(intent, message, entities) {
    const n = (message || '').toLowerCase();
    const techKw = /\b(technolog|technologies|tech stack|tech\b|stack\b|framework|used technologies)\b/;
    const costKw = /\b(cost|price|pricing|budget|amount|expensive|payment|fees|charges)\b/;
    const scopeKw = /\b(scope|deliverable)\b/;
    const statusKw = /\b(status)\b/;
    const proposalKw = /\b(proposal|quotation|quote)\b/;

    if (techKw.test(n) && !costKw.test(n)) return 'project_technologies';
    if (costKw.test(n) && !techKw.test(n)) return 'project_cost';
    if (scopeKw.test(n)) return 'project_scope';
    if (statusKw.test(n) && !techKw.test(n)) return 'project_status';
    if (proposalKw.test(n) && !techKw.test(n)) return 'project_proposal';

    if (entities?.techLayer === 'frontend') return 'frontend_technology';
    if (entities?.techLayer === 'backend') return 'backend_technology';
    if (entities?.techLayer === 'database') return 'database_technology';

    return this.normalizeIntent(intent);
  }

  getTechnologies(project) {
    const t = project?.technologies || {};
    return {
      frontend: t.frontend || [],
      backend: t.backend || [],
      database: t.database || [],
      tools: t.tools || t.other || [],
    };
  }

  getProjectCost(project) {
    return {
      intent: 'project_cost',
      format: 'markdown',
      content: AIResponseFormatter.formatCost(project),
      verified: true,
    };
  }

  getProjectDetails(project) {
    return {
      intent: 'project_details',
      format: 'project_details',
      content: AIResponseFormatter.formatProjectDetails(project),
      verified: true,
    };
  }

  getTechnologiesResponse(project, entities = {}) {
    const layer = entities.techLayer || null;
    const tech = this.getTechnologies(project);
    return {
      intent: 'project_technologies',
      format: 'technologies',
      content: AIResponseFormatter.formatTechnologies(project, layer),
      data: {
        project,
        technologies: tech,
        sections: AIResponseFormatter.techSections(project, layer),
      },
      verified: true,
    };
  }

  getProposal(project) {
    return {
      intent: 'project_proposal',
      format: 'proposal',
      content: AIResponseFormatter.formatProposal(project),
      verified: true,
    };
  }

  getScope(project) {
    return {
      intent: 'project_scope',
      format: 'markdown',
      content: AIResponseFormatter.formatScope(project),
      verified: true,
    };
  }

  getStatus(project) {
    return {
      intent: 'project_status',
      format: 'markdown',
      content: AIResponseFormatter.formatStatus(project),
      verified: true,
    };
  }

  getTimeline(project) {
    return {
      intent: 'project_timeline',
      format: 'markdown',
      content: AIResponseFormatter.formatTimeline(project),
      verified: true,
    };
  }

  getCategory(project) {
    return {
      intent: 'project_category',
      format: 'markdown',
      content: AIResponseFormatter.formatCategory(project),
      verified: true,
    };
  }

  getClient(project) {
    return {
      intent: 'project_client',
      format: 'markdown',
      content: AIResponseFormatter.formatClient(project),
      verified: true,
    };
  }

  getCompany(project) {
    return {
      intent: 'project_company',
      format: 'markdown',
      content: AIResponseFormatter.formatCompany(project),
      verified: true,
    };
  }

  getBranch(project) {
    return {
      intent: 'project_branch',
      format: 'markdown',
      content: AIResponseFormatter.formatBranch(project),
      verified: true,
    };
  }

  getFeatures(project) {
    return {
      intent: 'project_features',
      format: 'markdown',
      content: AIResponseFormatter.formatFeatures(project),
      verified: true,
    };
  }

  getPages(project) {
    return {
      intent: 'project_pages',
      format: 'markdown',
      content: AIResponseFormatter.formatPages(project),
      verified: true,
    };
  }

  route(intent, project, entities = {}, context = {}) {
    const resolvedIntent = this.coerceIntent(intent, context._message || '', entities);
    let selectedFunction = 'getProjectDetails';
    let result;

    switch (resolvedIntent) {
      case 'project_cost':
        selectedFunction = 'getProjectCost';
        result = this.getProjectCost(project);
        break;
      case 'project_technologies':
        selectedFunction = 'getTechnologies';
        result = this.getTechnologiesResponse(project, entities);
        break;
      case 'frontend_technology':
        selectedFunction = 'getTechnologies';
        result = this.getTechnologiesResponse(project, { ...entities, techLayer: 'frontend' });
        break;
      case 'backend_technology':
        selectedFunction = 'getTechnologies';
        result = this.getTechnologiesResponse(project, { ...entities, techLayer: 'backend' });
        break;
      case 'database_technology':
        selectedFunction = 'getTechnologies';
        result = this.getTechnologiesResponse(project, { ...entities, techLayer: 'database' });
        break;
      case 'project_proposal':
      case 'proposal':
      case 'proposal_details':
        selectedFunction = 'getProposal';
        result = this.getProposal(project);
        break;
      case 'project_scope':
        selectedFunction = 'getScope';
        result = this.getScope(project);
        break;
      case 'project_status':
        selectedFunction = 'getStatus';
        result = this.getStatus(project);
        break;
      case 'project_timeline':
        selectedFunction = 'getTimeline';
        result = this.getTimeline(project);
        break;
      case 'project_category':
        selectedFunction = 'getCategory';
        result = this.getCategory(project);
        break;
      case 'project_client':
        selectedFunction = 'getClient';
        result = this.getClient(project);
        break;
      case 'project_company':
        selectedFunction = 'getCompany';
        result = this.getCompany(project);
        break;
      case 'project_branch':
        selectedFunction = 'getBranch';
        result = this.getBranch(project);
        break;
      case 'project_features':
        selectedFunction = 'getFeatures';
        result = this.getFeatures(project);
        break;
      case 'project_pages':
        selectedFunction = 'getPages';
        result = this.getPages(project);
        break;
      case 'project_details':
      default:
        if (TECH_INTENTS.has(resolvedIntent) || TECH_INTENTS.has(intent)) {
          selectedFunction = 'getTechnologies';
          result = this.getTechnologiesResponse(project, entities);
        } else {
          selectedFunction = 'getProjectDetails';
          result = this.getProjectDetails(project);
        }
        break;
    }

    const mongoData = {
      projectName: project?.projectName,
      cost: project?.cost,
      status: project?.status,
      technologies: this.getTechnologies(project),
    };

    console.log('[AIResponseRouter]', {
      intent: resolvedIntent,
      originalIntent: intent,
      entity: entities?.projectName || entities?.projectNameRaw,
      selectedFunction,
      mongoData,
    });

    return {
      ...result,
      intent: result.intent || resolvedIntent,
      routedIntent: resolvedIntent,
      selectedFunction,
    };
  }
}

module.exports = new AIResponseRouter();
