/**
 * Expanded intent detection — all project & system intents
 */

const INTENTS = [
  'project_details', 'project_cost', 'project_scope', 'project_status', 'project_timeline',
  'project_category', 'project_proposal', 'project_client', 'project_company', 'project_branch',
  'project_features', 'project_pages', 'project_technologies', 'frontend_technology',
  'backend_technology', 'database_technology', 'client_projects', 'recent_projects',
  'active_projects', 'completed_projects', 'proposal_generation', 'proposal_details',
  'project_creation', 'project_edit', 'project_export', 'pdf_export', 'excel_export',
  'csv_export', 'analytics', 'dashboard', 'training', 'training_history', 'ai_assistant',
  'settings', 'workflow', 'folder_structure', 'backend_architecture', 'frontend_architecture',
  'project_structure', 'system_info', 'help', 'general', 'proposal', 'list_projects',
  'export_question', 'architecture_question', 'backend_question', 'frontend_question', 'workflow_question',
];

const PROJECT_INTENTS = new Set([
  'project_details', 'project_cost', 'project_scope', 'project_status', 'project_timeline',
  'project_category', 'project_proposal', 'project_client', 'project_company', 'project_branch',
  'project_features', 'project_pages', 'project_technologies', 'frontend_technology',
  'backend_technology', 'database_technology', 'proposal', 'proposal_details', 'proposal_generation',
]);

const INTENT_RULES = [
  { intent: 'project_proposal', patterns: [/\bproposal\b/, /\bproposals\b/], weight: 4 },
  { intent: 'proposal_generation', patterns: [/\bgenerate proposal\b/, /\bproposal generation\b/], weight: 4 },
  { intent: 'project_technologies', patterns: [/\btechnolog/, /\btech stack/, /\btech\b/], weight: 3 },
  { intent: 'frontend_technology', patterns: [/\bfrontend tech/, /\bfrontend technology/, /\bshow frontend\b/], weight: 4 },
  { intent: 'backend_technology', patterns: [/\bbackend tech/, /\bbackend technology/, /\bshow backend\b/], weight: 4 },
  { intent: 'database_technology', patterns: [/\bdatabase tech/, /\bdatabase technology/, /\bshow database\b/], weight: 4 },
  { intent: 'project_cost', patterns: [/\bcost\b/, /\bprice\b/, /\bpricing\b/, /\bbudget\b/, /\bamount\b/, /\bexpense\b/, /\bcharges\b/, /\bfees\b/, /\btotal\b/, /\bpayment\b/, /\bexpensive\b/, /\bkitna\b/, /\bkitne\b/], weight: 4 },
  { intent: 'project_status', patterns: [/\bstatus\b/], weight: 3 },
  { intent: 'active_projects', patterns: [/\bactive projects\b/, /\blist active\b/], weight: 4 },
  { intent: 'completed_projects', patterns: [/\bcompleted projects\b/, /\blist completed\b/], weight: 4 },
  { intent: 'project_scope', patterns: [/\bscope\b/, /\bdeliverable/], weight: 3 },
  { intent: 'project_timeline', patterns: [/\btimeline\b/, /\bduration\b/, /\bdeadline\b/], weight: 3 },
  { intent: 'project_category', patterns: [/\bcategory\b/, /\btype of project\b/], weight: 3 },
  { intent: 'project_client', patterns: [/\bclient name\b/, /\bwho is client\b/], weight: 3 },
  { intent: 'project_company', patterns: [/\bcompany name\b/, /\bwhich company\b/], weight: 3 },
  { intent: 'project_branch', patterns: [/\bbranch\b/], weight: 3 },
  { intent: 'project_features', patterns: [/\bfeatures\b/, /\bwhat features\b/], weight: 3 },
  { intent: 'project_pages', patterns: [/\bpages\b/, /\bnumber of pages\b/], weight: 3 },
  { intent: 'client_projects', patterns: [/\bprojects?\s+(?:of|for)\s+(?:client|company)/, /\bclient\b.*\bprojects\b/], weight: 4 },
  { intent: 'recent_projects', patterns: [/\brecent projects\b/, /\blatest projects\b/], weight: 4 },
  { intent: 'list_projects', patterns: [/\ball projects\b/, /\blist projects\b/, /\bshow projects\b/], weight: 4 },
  { intent: 'project_details', patterns: [/\bdetail/, /\babout\b/, /\bexplain\b/, /\btell me\b/, /\binfo\b/, /\bshow\b/, /\bdisplay\b/], weight: 2 },
  { intent: 'pdf_export', patterns: [/\bpdf\b/, /\bpdf export\b/], weight: 4 },
  { intent: 'excel_export', patterns: [/\bexcel\b/], weight: 3 },
  { intent: 'csv_export', patterns: [/\bcsv\b/], weight: 3 },
  { intent: 'project_export', patterns: [/\bexport\b/, /\bdownload\b/], weight: 2 },
  { intent: 'project_creation', patterns: [/\bcreate project\b/, /\bhow to create\b/, /\bnew project\b/], weight: 4 },
  { intent: 'project_edit', patterns: [/\bedit project\b/, /\bupdate project\b/], weight: 3 },
  { intent: 'training', patterns: [/\btraining center\b/, /\btrain\b/, /\bai training\b/], weight: 3 },
  { intent: 'training_history', patterns: [/\btraining history\b/], weight: 4 },
  { intent: 'dashboard', patterns: [/\bdashboard\b/], weight: 3 },
  { intent: 'analytics', patterns: [/\banalytics\b/, /\bstatistics\b/, /\bstats\b/], weight: 3 },
  { intent: 'folder_structure', patterns: [/\bfolder structure\b/, /\bdirectory\b/], weight: 3 },
  { intent: 'project_structure', patterns: [/\bproject structure\b/], weight: 3 },
  { intent: 'backend_architecture', patterns: [/\bbackend architecture\b/, /\bexplain backend\b/], weight: 4 },
  { intent: 'frontend_architecture', patterns: [/\bfrontend architecture\b/, /\bexplain frontend\b/], weight: 4 },
  { intent: 'architecture_question', patterns: [/\barchitecture\b/, /\bstructure\b/], weight: 2 },
  { intent: 'workflow', patterns: [/\bworkflow\b/, /\bhow does\b/, /\bhow do\b/], weight: 2 },
  { intent: 'system_info', patterns: [/\bsystem info\b/, /\babout system\b/], weight: 3 },
  { intent: 'ai_assistant', patterns: [/\bai assistant\b/, /\bchatbot\b/], weight: 3 },
  { intent: 'help', patterns: [/\bhelp\b/, /\bwhat can you\b/], weight: 4 },
  { intent: 'settings', patterns: [/\bsettings\b/], weight: 3 },
];

const FOLLOW_UP_MAP = [
  { test: /\btechnolog|tech\b/, intent: 'project_technologies' },
  { test: /\bfrontend\b/, intent: 'frontend_technology' },
  { test: /\bbackend\b/, intent: 'backend_technology' },
  { test: /\bdatabase\b/, intent: 'database_technology' },
  { test: /\bcost|price|budget/, intent: 'project_cost' },
  { test: /\bstatus/, intent: 'project_status' },
  { test: /\bscope/, intent: 'project_scope' },
  { test: /\btimeline|duration/, intent: 'project_timeline' },
  { test: /\bcategory/, intent: 'project_category' },
  { test: /\bclient/, intent: 'project_client' },
  { test: /\bcompany/, intent: 'project_company' },
  { test: /\bbranch/, intent: 'project_branch' },
  { test: /\bfeatures/, intent: 'project_features' },
  { test: /\bpages/, intent: 'project_pages' },
  { test: /\bproposal/, intent: 'project_proposal' },
  { test: /\bdetail|about|info/, intent: 'project_details' },
];

class AIIntentService {
  normalize(text) {
    return (text || '').toLowerCase().replace(/[^\w\s]/g, ' ').replace(/\s+/g, ' ').trim();
  }

  detect(message, context = {}) {
    try {
      const AINLP = require('./AINLPService');
      return AINLP.detectIntent(message, context);
    } catch {
      /* fallback below */
    }
    const q = this.normalize(message);
    const scores = {};

    for (const rule of INTENT_RULES) {
      let score = 0;
      for (const pat of rule.patterns) {
        if (pat.test(q)) score += rule.weight;
      }
      if (score > 0) scores[rule.intent] = (scores[rule.intent] || 0) + score;
    }

    if (context.currentProject?.projectName && this.isFollowUp(q)) {
      for (const { test, intent } of FOLLOW_UP_MAP) {
        if (test.test(q)) return intent;
      }
      if (context.lastIntent && PROJECT_INTENTS.has(context.lastIntent)) {
        return context.lastIntent;
      }
      return 'project_details';
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) {
      if (/\bproject\b/.test(q)) return 'project_details';
      return 'general';
    }
    return sorted[0][0];
  }

  isFollowUp(q) {
    return (
      !/\b(?:project\s+)?[A-Za-z][\w]{4,}/i.test(q) ||
      /^(what|which|show|tell|how|explain)\b/.test(q)
    ) && (
      /\b(what|which|show|tell|how|cost|status|scope|technolog|proposal|detail|about|frontend|backend|database|timeline|features|pages|client|company)/.test(q) ||
      q.split(' ').length < 14
    );
  }

  requiresProject(intent) {
    return PROJECT_INTENTS.has(intent);
  }

  normalizeIntent(intent) {
    const map = {
      proposal: 'project_proposal',
      proposal_details: 'project_proposal',
      list_projects: 'recent_projects',
      export_question: 'pdf_export',
      backend_question: 'backend_architecture',
      frontend_question: 'frontend_architecture',
      workflow_question: 'workflow',
      architecture_question: 'project_structure',
    };
    return map[intent] || intent;
  }
}

module.exports = new AIIntentService();
module.exports.INTENTS = INTENTS;
module.exports.PROJECT_INTENTS = PROJECT_INTENTS;
