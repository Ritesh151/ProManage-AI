/**
 * Advanced NLU — messy, informal, multilingual, typo-tolerant input
 */

const AIIntentService = require('./AIIntentService');
const { normalizeProjectName } = require('./AIProjectResolver');

const FILLER_WORDS = new Set([
  'the', 'a', 'an', 'is', 'are', 'was', 'were', 'be', 'been', 'being', 'have', 'has', 'had',
  'do', 'does', 'did', 'will', 'would', 'could', 'should', 'may', 'might', 'must', 'shall',
  'me', 'my', 'your', 'our', 'their', 'this', 'that', 'these', 'those', 'it', 'its',
  'please', 'kindly', 'just', 'also', 'very', 'really', 'actually', 'basically', 'literally',
  'tell', 'show', 'give', 'get', 'let', 'know', 'want', 'need', 'like', 'see', 'look',
  'ka', 'ki', 'ke', 'ko', 'hai', 'hain', 'ho', 'tha', 'thi', 'the', 'kya', 'kitna', 'kitne',
  'konsa', 'kaun', 'mein', 'main', 'aur', 'ya', 'par', 'pe', 'se', 'ne', 'batao', 'bata',
  'dikhao', 'dikha', 'bolo', 'btao', 'pls', 'plz', 'hey', 'hi', 'hello', 'ok', 'okay',
]);

const INTENT_KEYWORD_GROUPS = {
  project_cost: [
    'cost', 'price', 'pricing', 'amount', 'budget', 'expense', 'rate', 'charges', 'fees',
    'total', 'payment', 'project amount', 'expensive', 'cheap', 'kitna', 'kitne', 'paisa',
    'rupee', 'rupees', 'rs', 'inr', 'money', 'worth', 'valuation', 'quote amount',
  ],
  project_technologies: [
    'tech', 'technology', 'technologies', 'tech stack', 'stack', 'used technologies', 'framework',
    'frameworks', 'used', 'frontend', 'backend', 'database', 'tools', 'libraries', 'platform',
  ],
  project_proposal: [
    'proposal', 'quotation', 'quote', 'document', 'offer', 'estimate', 'bid',
  ],
  client_projects: [
    'client', 'customer', 'company', 'organization', 'organisation', 'firm',
  ],
  project_status: ['status', 'active', 'completed', 'cancelled', 'on hold', 'progress'],
  project_scope: ['scope', 'deliverable', 'deliverables', 'work scope'],
  project_timeline: ['timeline', 'duration', 'deadline', 'timeframe', 'schedule'],
  project_details: [
    'detail', 'details', 'information', 'info', 'about', 'explain', 'describe', 'overview', 'summary',
  ],
  project_features: ['features', 'feature', 'functionality', 'capabilities'],
  project_pages: ['pages', 'page count', 'number of pages'],
  project_category: ['category', 'type', 'kind'],
  project_client: ['client name', 'who is client'],
  project_company: ['company name', 'which company'],
  pdf_export: ['pdf', 'pdf export'],
  excel_export: ['excel', 'xlsx'],
  csv_export: ['csv'],
  project_export: ['export', 'download'],
  training: ['training', 'train', 'ai training', 'training center'],
  help: ['help', 'what can you', 'commands', 'assist'],
  recent_projects: ['all projects', 'list projects', 'recent projects', 'show projects', 'every project'],
  active_projects: ['active projects', 'list active'],
  completed_projects: ['completed projects', 'list completed'],
  workflow: ['how to', 'how do', 'workflow', 'steps', 'create project', 'new project'],
  project_structure: ['structure', 'architecture', 'folder', 'file structure'],
};

const PROJECT_INTENTS = new Set([
  'project_details', 'project_cost', 'project_scope', 'project_status', 'project_timeline',
  'project_category', 'project_proposal', 'project_client', 'project_company', 'project_branch',
  'project_features', 'project_pages', 'project_technologies', 'frontend_technology',
  'backend_technology', 'database_technology', 'proposal', 'proposal_details', 'proposal_generation',
]);

const THRESHOLD_HIGH = 80;
const THRESHOLD_MEDIUM = 50;

class AINLPService {
  normalizeInput(text) {
    let s = (text || '')
      .replace(/\[context project:[^\]]+\]/gi, ' ')
      .replace(/[^\w\s\u0900-\u097F₹]/gi, ' ')
      .toLowerCase()
      .replace(/\s+/g, ' ')
      .trim();

    const hinglishMap = {
      'kitna hai': 'kitna', 'kitne hai': 'kitne', 'kya hai': 'kya', 'ka price': 'price',
      'ki price': 'price', 'ke price': 'price', 'ka cost': 'cost', 'ki cost': 'cost',
      'project ka': 'project', 'project ki': 'project',
    };
    for (const [from, to] of Object.entries(hinglishMap)) {
      s = s.replace(new RegExp(from, 'gi'), ` ${to} `);
    }

    return s.replace(/\s+/g, ' ').trim();
  }

  expandKeywords(normalized) {
    const expanded = new Set(normalized.split(' ').filter(Boolean));
    const joined = ` ${normalized} `;

    for (const [intent, keywords] of Object.entries(INTENT_KEYWORD_GROUPS)) {
      for (const kw of keywords) {
        if (kw.includes(' ')) {
          if (joined.includes(` ${kw} `)) expanded.add(`__intent__${intent}`);
        } else if (expanded.has(kw) || joined.includes(` ${kw} `)) {
          expanded.add(`__intent__${intent}`);
          expanded.add(kw);
        }
      }
    }

    return { tokens: [...expanded], joined, normalized };
  }

  detectIntent(message, context = {}) {
    const normalized = this.normalizeInput(message);
    const { tokens, joined } = this.expandKeywords(normalized);

    if (/\b(technolog|technologies|tech stack|used technologies|framework)\b/.test(joined)) {
      if (!/\b(cost|price|budget|amount|pricing)\b/.test(joined) || /\btechnolog/.test(joined)) {
        return AIIntentService.normalizeIntent('project_technologies');
      }
    }

    const scores = {};

    for (const [intent, keywords] of Object.entries(INTENT_KEYWORD_GROUPS)) {
      let score = 0;
      for (const kw of keywords) {
        if (kw.includes(' ')) {
          if (joined.includes(` ${kw} `)) score += 4;
        } else if (tokens.includes(kw) || joined.includes(` ${kw} `)) {
          score += kw.length > 5 ? 3 : 2;
        }
      }
      if (tokens.includes(`__intent__${intent}`)) score += 5;
      if (score > 0) scores[intent] = score;
    }

    if (/\bfrontend\b/.test(joined) && /\b(tech|technolog|stack)\b/.test(joined)) {
      scores.frontend_technology = (scores.frontend_technology || 0) + 6;
    }
    if (/\bbackend\b/.test(joined) && /\b(tech|technolog|stack)\b/.test(joined)) {
      scores.backend_technology = (scores.backend_technology || 0) + 6;
    }
    if (/\bdatabase\b/.test(joined) && /\b(tech|technolog|stack)\b/.test(joined)) {
      scores.database_technology = (scores.database_technology || 0) + 6;
    }

    if (context.currentProject?.projectName && this._isFollowUp(normalized, message)) {
      const follow = this._followUpIntent(normalized, context.lastIntent);
      if (follow) return AIIntentService.normalizeIntent(follow);
    }

    const sorted = Object.entries(scores).sort((a, b) => b[1] - a[1]);
    if (sorted.length === 0) {
      const legacy = AIIntentService.detect(message, context);
      return AIIntentService.normalizeIntent(legacy);
    }

    let top = sorted[0][0];
    if (top === 'client_projects' && !/\b(client|company|customer|organization)\b/.test(joined)) {
      if (scores.project_cost > 0) top = 'project_cost';
      else if (scores.project_details > 0) top = 'project_details';
    }

    return AIIntentService.normalizeIntent(top);
  }

  _isFollowUp(normalized, raw) {
    const hasExplicit = /\b(?:project\s+)?[a-z0-9]{4,}\s+project\b/i.test(raw) ||
      /\bproject\s+[a-z0-9]{3,}/i.test(raw);
    return (
      !hasExplicit &&
      (/\b(what|which|how|show|tell|kitna|kya|cost|price|tech|status|scope|proposal|detail|about)\b/.test(normalized) ||
        normalized.split(' ').length < 12)
    );
  }

  _followUpIntent(normalized, lastIntent) {
    if (/\b(tech|technolog|technologies|stack|used|framework)\b/.test(normalized)) return 'project_technologies';
    if (/\b(cost|price|budget|amount|kitna|expensive|payment)\b/.test(normalized)) return 'project_cost';
    if (/\b(status)\b/.test(normalized)) return 'project_status';
    if (/\b(scope)\b/.test(normalized)) return 'project_scope';
    if (/\b(timeline|duration)\b/.test(normalized)) return 'project_timeline';
    if (/\b(proposal|quotation|quote)\b/.test(normalized)) return 'project_proposal';
    if (PROJECT_INTENTS.has(lastIntent)) return lastIntent;
    return 'project_details';
  }

  extractEntities(message, context = {}) {
    const raw = message || '';
    const normalized = this.normalizeInput(raw);
    const expanded = this.expandKeywords(normalized);

    const entities = {
      projectName: null,
      clientName: null,
      companyName: null,
      technology: null,
      techLayer: null,
      keywords: [],
      statusFilter: null,
      _nlpNormalized: normalized,
    };

    const ctxTag = raw.match(/\[context project:\s*([^\]]+)\]/i);
    if (ctxTag?.[1]) {
      entities.projectName = this._compactName(ctxTag[1].trim());
      entities._fromContext = true;
    }

    const intentWords = new Set();
    for (const kws of Object.values(INTENT_KEYWORD_GROUPS)) {
      kws.forEach((k) => {
        k.split(' ').forEach((w) => intentWords.add(w));
      });
    }
    FILLER_WORDS.forEach((w) => intentWords.add(w));
    intentWords.add('project', 'projects');

    const phrase = this._extractProjectPhrase(raw, normalized, intentWords);
    if (phrase) {
      entities.projectNameRaw = phrase;
      entities.projectName = phrase;
    }

    if (!entities.projectName && context.currentProject?.projectName) {
      entities.projectName = context.currentProject.projectName;
      entities.projectNameRaw = context.currentProject.projectName;
      entities._fromContext = true;
    }

    if (/\bactive\b/.test(normalized)) entities.statusFilter = 'Active';
    if (/\bcompleted\b/.test(normalized)) entities.statusFilter = 'Completed';
    if (/\bfrontend\b/.test(normalized)) entities.techLayer = 'frontend';
    if (/\bbackend\b/.test(normalized)) entities.techLayer = 'backend';
    if (/\bdatabase\b/.test(normalized)) entities.techLayer = 'database';

    const clientM = normalized.match(/(?:client|company|customer|organization)\s+([a-z0-9][\w\s\-]{2,50})/);
    if (clientM?.[1]) {
      const val = clientM[1].trim();
      if (/company/.test(normalized)) entities.companyName = val;
      else entities.clientName = val;
    }

    entities.keywords = [...new Set(expanded.tokens.filter((t) => !t.startsWith('__intent__') && t.length > 2))].slice(0, 25);
    entities.intentHints = Object.keys(INTENT_KEYWORD_GROUPS).filter((i) => expanded.tokens.includes(`__intent__${i}`));

    return entities;
  }

  _cleanProjectPhrase(phrase) {
    let s = (phrase || '').trim().replace(/^["']|["']$/g, '');
    s = s.replace(/\s+project\s*$/i, '').replace(/^project\s+/i, '').replace(/^the\s+/i, '').trim();
    const normalized = normalizeProjectName(s);
    return normalized || s;
  }

  _extractProjectPhrase(raw, normalized, intentWords) {
    const phrasePatterns = [
      /what\s+technologies?\s+(?:are\s+)?(?:used\s+)?(?:in|for|of)\s+(?:project\s+)?(.+?)(?:\?|$)/i,
      /technologies?\s+(?:are\s+)?(?:used\s+)?(?:in|for|of)\s+(?:project\s+)?(.+?)(?:\?|$)/i,
      /(?:in|for|of)\s+project\s+(.+?)(?:\?|$)/i,
      /(?:show|tell|give|display)\s+(?:details?\s+of\s+)?project\s+(.+?)(?:\?|$)/i,
      /what\s+tech(?:nology)?\s+(?:is\s+)?(?:used\s+)?(?:in|for|of)\s+(.+?)(?:\?|$)/i,
      /tech(?:nology)?\s+stack\s+(?:of|for|in)\s+(.+?)(?:\?|$)/i,
      /(?:tell me about|explain|show|display|give details?)\s+(?:project\s+)?(.+?)(?:\?|$)/i,
      /(?:price|cost|pricing|budget|amount)\s+(?:of|for)\s+(?:the\s+)?(?:project\s+)?(.+?)(?:\?|$)/i,
      /(.+?)\s+project\s+(?:cost|price|pricing|budget)/i,
      /(.+?)\s+(?:app\s+)?(?:pricing|price|cost)\s*$/i,
      /(?:proposal|quotation|quote)\s+(?:of|for)\s+(?:project\s+)?(.+?)(?:\?|$)/i,
      /(?:in|for|of)\s+(.+?)\s+project(?:\?|$)/i,
      /project\s+(.+?)(?:\?|$)/i,
    ];

    for (const pat of phrasePatterns) {
      const m = raw.match(pat);
      if (m?.[1]) {
        const cleaned = this._cleanProjectPhrase(m[1]);
        if (cleaned.length >= 2 && this._isValidProjectPhrase(cleaned, intentWords)) {
          return cleaned;
        }
      }
    }

    const titleCase = raw.match(/(?:in|for|of)\s+([A-Z][A-Za-z0-9\s\-–—]+?)(?:\?|$)/);
    if (titleCase?.[1]) {
      const cleaned = this._cleanProjectPhrase(titleCase[1]);
      if (cleaned.length >= 3 && this._isValidProjectPhrase(cleaned, intentWords)) {
        return cleaned;
      }
    }

    return null;
  }

  _compactName(name) {
    return (name || '').replace(/\s+/g, '').trim();
  }

  _isValidProjectPhrase(phrase, intentWords) {
    if (!phrase || phrase.length < 2) return false;
    const words = phrase.toLowerCase().split(/\s+/);
    const meaningful = words.filter((w) => w.length > 1 && !FILLER_WORDS.has(w) && !intentWords.has(w));
    return meaningful.length >= 1 && meaningful.join(' ').length >= 2;
  }

  _isValidProjectToken(token, intentWords) {
    if (!token || token.length < 2) return false;
    const lower = token.toLowerCase();
    if (FILLER_WORDS.has(lower) || intentWords.has(lower)) return false;
    if (/^(project|client|company|cost|price|budget|amount|show|tell|what|how)$/i.test(lower)) return false;
    return true;
  }

  calculateConfidence({
    intentScore = 0,
    entityScore = 0,
    keywordScore = 0,
    contextScore = 0,
    databaseScore = 0,
    hasVerifiedData = false,
    fromContext = false,
    intentMatchStrength = 0,
  }) {
    const intent = Math.min(25, Math.round((intentScore || intentMatchStrength) * 25));
    const entity = Math.min(25, Math.round(entityScore * 25));
    const keyword = Math.min(15, Math.round(keywordScore * 15));
    const context = Math.min(15, fromContext ? 15 : Math.round(contextScore * 15));
    const database = Math.min(20, Math.round(databaseScore * 20));

    let total = intent + entity + keyword + context + database;
    if (hasVerifiedData) total = Math.min(100, total + 8);
    if (!hasVerifiedData && entity < 10) total = Math.min(total, 48);

    return {
      total,
      breakdown: { intent, entity, keyword, context, database },
      tier: total > THRESHOLD_HIGH ? 'high' : total >= THRESHOLD_MEDIUM ? 'medium' : 'low',
    };
  }

  requiresProject(intent) {
    return PROJECT_INTENTS.has(intent) || AIIntentService.requiresProject(intent);
  }

  notFoundMessage() {
    return "I couldn't find verified project data.";
  }

  confirmMessage(projectName) {
    return `Did you mean Project ${projectName}?`;
  }

  formatConfirmList(suggestions) {
    const names = (suggestions || []).filter(Boolean).slice(0, 3);
    if (!names.length) return this.notFoundMessage();
    return names.map((n) => this.confirmMessage(n)).join('\n\n');
  }
}

module.exports = new AINLPService();
module.exports.THRESHOLD_HIGH = THRESHOLD_HIGH;
module.exports.THRESHOLD_MEDIUM = THRESHOLD_MEDIUM;
module.exports.INTENT_KEYWORD_GROUPS = INTENT_KEYWORD_GROUPS;
module.exports.PROJECT_INTENTS = PROJECT_INTENTS;
