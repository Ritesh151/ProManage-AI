const INTENTS = [
  'project_cost', 'project_details', 'project_proposal', 'project_technologies',
  'project_scope', 'project_status', 'project_client', 'client_projects',
  'project_timeline', 'project_features', 'project_category', 'project_pages',
  'frontend_technology', 'backend_technology', 'database_technology',
  'general_project_query', 'greeting', 'help', 'smalltalk',
  'show_all_projects', 'show_recent_projects', 'show_active_projects',
  'active_projects', 'completed_projects',
  'system_question',
  'create_project_help',
  'pdf_export_help',
  'project_structure_help',
  'assistant_capabilities',
  'unknown',
];

const FILLER_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being',
  'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would', 'could',
  'should', 'may', 'might', 'must', 'shall', 'me', 'my', 'your', 'our',
  'their', 'this', 'that', 'these', 'those', 'it', 'its', 'please',
  'kindly', 'just', 'also', 'very', 'really', 'tell', 'show', 'give',
  'get', 'let', 'know', 'want', 'need', 'like', 'see', 'look',
  'ka', 'ki', 'ke', 'ko', 'hai', 'hain', 'ho', 'tha', 'thi', 'the',
  'kya', 'kitna', 'kitne', 'konsa', 'kaun', 'mein', 'main', 'aur',
  'ya', 'par', 'pe', 'se', 'ne', 'batao', 'bata', 'dikhao', 'dikha',
  'bolo', 'btao', 'pls', 'plz', 'hey', 'hi', 'hello', 'ok', 'okay',
]);

const INTENT_RULES = [
  {
    intent: 'project_cost',
    patterns: [/\bcost\b/, /\bprice\b/, /\bpricing\b/, /\bbudget\b/, /\bamount\b/,
      /\bexpense\b/, /\bcharges\b/, /\bfees\b/, /\btotal\b/, /\bpayment\b/,
      /\bkitna\b/, /\bkitne\b/, /\bexpensive\b/, /\brupees?\b/, /\brs\b/,
      /\bworth\b/, /\bvaluation\b/, /\bquote amount\b/],
    weight: 4,
  },
  {
    intent: 'project_technologies',
    patterns: [/\btechnolog/, /\btech stack\b/, /\btech\b/, /\bstack\b/,
      /\bframework/, /\bused technologies\b/, /\blibraries?\b/, /\bplatform\b/,
      /\bwhat.*used\b/],
    weight: 4,
  },
  {
    intent: 'frontend_technology',
    patterns: [/\bfrontend\b.*\btech/, /\bfrontend technology/],
    weight: 4,
  },
  {
    intent: 'backend_technology',
    patterns: [/\bbackend\b.*\btech/, /\bbackend technology/],
    weight: 4,
  },
  {
    intent: 'database_technology',
    patterns: [/\bdatabase\b.*\btech/, /\bdatabase technology/],
    weight: 4,
  },
  {
    intent: 'project_proposal',
    patterns: [/\bproposal\b/, /\bproposals\b/, /\bquotation\b/, /\bquote\b/,
      /\bestimate\b/, /\boffer\b/, /\bbid\b/, /\bdocument\b/],
    weight: 4,
  },
  {
    intent: 'project_scope',
    patterns: [/\bscope\b/, /\bdeliverable/, /\bwork scope\b/],
    weight: 3,
  },
  {
    intent: 'project_status',
    patterns: [/\bstatus\b/, /\bprogress\b/],
    weight: 3,
  },
  {
    intent: 'project_timeline',
    patterns: [/\btimeline\b/, /\bduration\b/, /\bdeadline\b/, /\btimeframe\b/,
      /\bschedule\b/, /\btime\b/],
    weight: 3,
  },
  {
    intent: 'project_category',
    patterns: [/\bcategory\b/, /\btype\b/, /\bkind\b/],
    weight: 3,
  },
  {
    intent: 'project_client',
    patterns: [/\bclient name\b/, /\bwho is client\b/, /\bclient\b/],
    weight: 2,
  },
  {
    intent: 'client_projects',
    patterns: [/\bprojects?.*(?:of|for).*(?:client|company|customer)/,
      /\bclient.*projects?\b/, /\bcompany.*projects?\b/],
    weight: 7,
  },
  {
    intent: 'project_features',
    patterns: [/\bfeatures\b/, /\bfeature\b/, /\bfunctionality\b/,
      /\bcapabilities?\b/],
    weight: 3,
  },
  {
    intent: 'project_pages',
    patterns: [/\bpages\b/, /\bpage count\b/, /\bnumber of pages\b/],
    weight: 3,
  },
  {
    intent: 'project_details',
    patterns: [/\bdetail/, /\babout\b/, /\bexplain\b/, /\binfo\b/,
      /\bdescribe\b/, /\boverview\b/, /\bsummary\b/, /\binformation\b/],
    weight: 2,
  },
  {
    intent: 'show_all_projects',
    patterns: [/\ball projects?\b/, /\ball project\b/,
      /\bshow all projects?\b/, /\blist all projects?\b/, /\bdisplay all projects?\b/,
      /\bshow projects?\b/, /\blist projects?\b/, /\bdisplay projects?\b/,
      /\bprojects? list\b/, /\blist of projects?\b/, /\bproject list\b/],
    weight: 6,
  },
  {
    intent: 'show_recent_projects',
    patterns: [/\brecent projects?\b/, /\blatest projects?\b/,
      /\bshow recent\b/, /\bshow all recent\b/, /\blist all recent\b/,
      /\bnew projects?\b/, /\blatest\b/],
    weight: 5,
  },
  {
    intent: 'show_active_projects',
    patterns: [/\bactive projects?\b/, /\bshow active\b/,
      /\blist active\b/, /\brunning projects?\b/],
    weight: 5,
  },
  {
    intent: 'active_projects',
    patterns: [/\bonly active\b/, /\bfilter active\b/],
    weight: 3,
  },
  {
    intent: 'completed_projects',
    patterns: [/\bcompleted projects?\b/, /\blist completed\b/, /\bshow completed\b/],
    weight: 4,
  },
  {
    intent: 'general_project_query',
    patterns: [/\bproject\b/],
    weight: 1,
  },
  {
    intent: 'system_question',
    patterns: [/\bhow\b.*\b(?:implement|work|export|pdf|excel|csv|architectur|created|build|generate|index|train|embed)\b/,
      /\bexplain\b.*(?:architecture|workflow|flow|process|system|export|pdf|pipeline|training|implementation)/i,
      /\bwhat is\b.*(?:architecture|workflow|flow|process|system)/i,
      /(?:architecture|workflow|project flow|pdf export|export system)/i],
    weight: 5,
  },
  {
    intent: 'create_project_help',
    patterns: [
      /how\s+(?:do|can|to)\s+(?:i\s+)?(?:create|make|start|build)\s+(?:a\s+)?project/i,
      /create\s+project/i,
      /create\s+new\s+project/i,
      /project\s+(?:create|karna|kaise)/i,
      /help.*create.*project/i,
    ],
    weight: 8,
  },
  {
    intent: 'pdf_export_help',
    patterns: [
      /how.*pdf.*(?:export|implement|work|generate|flow)/i,
      /explain.*pdf.*(?:export|implement|work|generate)/i,
      /pdf.*export.*(?:kaise|work|how)/i,
      /how.*does.*pdf.*work/i,
      /pdf.*generation.*flow/i,
    ],
    weight: 8,
  },
  {
    intent: 'project_structure_help',
    patterns: [
      /explain.*(?:project structure|architecture|folder structure)/i,
      /project structure/i,
      /\barchitecture\b/i,
      /folder structure/i,
      /how.*project.*organized/i,
    ],
    weight: 8,
  },
  {
    intent: 'assistant_capabilities',
    patterns: [
      /what\s+(?:all\s+)?can\s+you\s+(?:help|do)/i,
      /what\s+can\s+you\s+help\s+me/i,
      /\bcapabilities\b/i,
      /what\s+do\s+you\s+do/i,
      /assistant\s+help/i,
    ],
    weight: 8,
  },
  {
    intent: 'greeting',
    patterns: [/^(hi+|hello+|hey+|hii+|hlo+|yo+)\b/i, /^good\s+(morning|afternoon|evening|night)\b/i],
    weight: 5,
  },
  {
    intent: 'help',
    patterns: [/\bhelp\b/, /\bwhat can you\b/, /\bhow do i use\b/,
      /\bwhat do you do\b/, /\bhow can you help\b/, /\bcommands?\b/,
      /\bcapabilities\b/],
    weight: 5,
  },
  {
    intent: 'smalltalk',
    patterns: [/\bhow are you\b/, /\bwho are you\b/, /\bwhat are you\b/,
      /\bintroduce yourself\b/, /\byour name\b/, /\bnice to meet\b/,
      /^(?:bye|goodbye|cya|see\s+you|talk\s+to\s+you\s+later|farewell|adios|later|ttyl|gotta\s+go)\b/i],
    weight: 4,
  },
];

const FOLLOW_UP_MAP = [
  { test: /\b(technolog|technologies|tech stack|stack|framework|libraries|used)\b/, intent: 'project_technologies' },
  { test: /\bfrontend\b/, intent: 'frontend_technology' },
  { test: /\bbackend\b/, intent: 'backend_technology' },
  { test: /\bdatabase\b/, intent: 'database_technology' },
  { test: /\b(cost|price|budget|amount|kitna|kitne|rupees?|rs|payment|fees|charges|expensive)\b/, intent: 'project_cost' },
  { test: /\bstatus\b/, intent: 'project_status' },
  { test: /\b(scope|deliverable)\b/, intent: 'project_scope' },
  { test: /\b(timeline|duration|deadline|schedule)\b/, intent: 'project_timeline' },
  { test: /\bcategory\b/, intent: 'project_category' },
  { test: /\b(client|company)\b/, intent: 'project_client' },
  { test: /\bfeatures?\b/, intent: 'project_features' },
  { test: /\bpages?\b/, intent: 'project_pages' },
  { test: /\bproposal\b/, intent: 'project_proposal' },
  { test: /\b(detail|details|about|info|explain|describe|overview|summary)\b/, intent: 'project_details' },
];

const PROJECT_INTENTS = new Set([
  'project_cost', 'project_details', 'project_proposal', 'project_technologies',
  'project_scope', 'project_status', 'project_client', 'project_timeline',
  'project_features', 'project_category', 'project_pages',
  'frontend_technology', 'backend_technology', 'database_technology',
  'general_project_query',
]);

class AIIntentService {
  normalize(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[^\w\s\u0900-\u097F₹]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  detect(message, context = {}) {
    const q = this.normalize(message);
    if (!q) return 'general_project_query';

    if (/^(?:show|list|display)?\s*projects?\s*$/.test(q) && !/\bdetail|\babout|\bexplain|\bcost|\bprice|\btech|\btechnolog|\bstatus|\bscope|\bproposal|\btimeline|\bfeatures?|\bclient\b/.test(q)) {
      console.log({ userInput: message, intent: 'show_all_projects', selectedHandler: 'bare_list_detection' });
      return 'show_all_projects';
    }

    const scores = {};

    for (const rule of INTENT_RULES) {
      let score = 0;
      for (const pat of rule.patterns) {
        if (pat.test(q) || pat.test(message)) {
          score += rule.weight;
        }
      }
      if (score > 0) {
        scores[rule.intent] = (scores[rule.intent] || 0) + score;
      }
    }

    if (scores.project_technologies > 0 && (scores.project_cost || 0) > scores.project_technologies) {
      if (/\btechnolog/.test(q)) {
        scores.project_technologies += 2;
      }
    }

    if (context.currentProject && this._isFollowUp(q, message)) {
      for (const { test, intent } of FOLLOW_UP_MAP) {
        if (test.test(q)) return intent;
      }
      if (context.lastIntent && PROJECT_INTENTS.has(context.lastIntent)) {
        return context.lastIntent;
      }
      return 'project_details';
    }

    const hasProjectKeyword = /\bproject\b/.test(q) || /\bprojects?\b/.test(q);
    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) {
      if (/^projects?$/.test(q)) {
        console.log({ userInput: message, intent: 'show_all_projects', selectedHandler: 'bare_projects_fallback' });
        return 'show_all_projects';
      }
      if (hasProjectKeyword) return 'general_project_query';
      if (q.split(/\s+/).length <= 3) return 'greeting';
      console.log({ userInput: message, intent: 'unknown', selectedHandler: 'no_score_no_keyword' });
      return 'unknown';
    }

    if (sorted[0][1] < 2 && !hasProjectKeyword) {
      console.log({ userInput: message, intent: 'unknown', selectedHandler: 'low_score' });
      return 'unknown';
    }

    const result = sorted[0][0];
    console.log({ userInput: message, intent: result, selectedHandler: 'scoring' });
    return result;
  }

  _isFollowUp(normalized, raw) {
    const hasName = /[A-Z][a-zA-Z0-9]{4,}/.test(raw) || /project\s+["']?[A-Za-z]/.test(raw);
    return (
      !hasName &&
      (
        /^(what|which|show|tell|how|explain|describe)\b/.test(raw) ||
        /\b(what|which|how|tech|technolog|cost|price|status|scope|proposal|detail|used|frontend|backend|database|timeline|features|pages|client|company)\b/.test(normalized)
      )
    );
  }

  requiresProject(intent) {
    return PROJECT_INTENTS.has(intent);
  }

  isProjectIntent(intent) {
    return PROJECT_INTENTS.has(intent);
  }
}

module.exports = new AIIntentService();
module.exports.INTENTS = INTENTS;
module.exports.PROJECT_INTENTS = PROJECT_INTENTS;
