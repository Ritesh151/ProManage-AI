const Project = require('../models/Project');

const STOP_WORDS = new Set([
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
  'project', 'projects',
]);

const INTENT_KEYWORDS = new Set([
  'cost', 'price', 'pricing', 'budget', 'amount', 'expense', 'charges',
  'fees', 'payment', 'kitna', 'kitne', 'expensive', 'rupees', 'rs',
  'technolog', 'technologies', 'tech', 'stack', 'framework', 'libraries',
  'frontend', 'backend', 'database', 'proposal', 'quotation', 'quote',
  'scope', 'deliverable', 'status', 'timeline', 'duration', 'deadline',
  'category', 'type', 'features', 'pages', 'client', 'company',
  'detail', 'details', 'about', 'explain', 'info', 'show', 'display',
  'describe', 'overview', 'summary', 'information',
  'help', 'greeting', 'hi', 'hello', 'hey',
]);

class AIEntityService {
  normalize(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[^\w\s\u0900-\u097F₹]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();
  }

  extract(message, context = {}) {
    const raw = message || '';
    const normalized = this.normalize(raw);

    const entities = {
      projectName: null,
      projectNameRaw: null,
      clientName: null,
      companyName: null,
      technology: null,
      techLayer: null,
      keywords: [],
      statusFilter: null,
      _fromContext: false,
    };

    const ctxTag = raw.match(/\[context project:\s*([^\]]+)\]/i);
    if (ctxTag?.[1]) {
      entities.projectName = ctxTag[1].trim();
      entities.projectNameRaw = ctxTag[1].trim();
      entities._fromContext = true;
      return entities;
    }

    if (/\bactive\b/.test(normalized)) entities.statusFilter = 'Active';
    if (/\bcompleted\b/.test(normalized)) entities.statusFilter = 'Completed';
    if (/\bfrontend\b/.test(normalized)) entities.techLayer = 'frontend';
    if (/\bbackend\b/.test(normalized)) entities.techLayer = 'backend';
    if (/\bdatabase\b/.test(normalized)) entities.techLayer = 'database';

    const clientMatch = normalized.match(/(?:client|company|customer|organization)\s+([a-z0-9][\w\s\-]{2,50})/);
    if (clientMatch?.[1]) {
      const val = clientMatch[1].trim();
      if (/company/.test(normalized)) entities.companyName = val;
      else entities.clientName = val;
    }

    const phrase = this._extractProjectPhrase(raw, normalized);
    if (phrase) {
      entities.projectNameRaw = phrase;
      entities.projectName = phrase;
    }

    if (!entities.projectName && context.currentProject?.projectName) {
      entities.projectName = context.currentProject.projectName;
      entities.projectNameRaw = context.currentProject.projectName;
      entities._fromContext = true;
    }

    const tokens = normalized.split(/\s+/).filter(t => t.length > 2 && !STOP_WORDS.has(t) && !INTENT_KEYWORDS.has(t));
    entities.keywords = [...new Set(tokens)].slice(0, 25);

    return entities;
  }

  _extractProjectPhrase(raw, normalized) {
    const patterns = [
      /what\s+technologies?\s+(?:are\s+)?(?:used\s+)?(?:in|for|of)\s+(?:project\s+)?(.+?)(?:\?|$)/i,
      /technologies?\s+(?:are\s+)?(?:used\s+)?(?:in|for|of)\s+(?:project\s+)?(.+?)(?:\?|$)/i,
      /what\s+tech(?:nology)?\s+(?:is\s+)?(?:used\s+)?(?:in|for|of)\s+(.+?)(?:\?|$)/i,
      /tech(?:nology)?\s+stack\s+(?:of|for|in)\s+(.+?)(?:\?|$)/i,
      /(?:price|cost|pricing|budget|amount)\s+(?:of|for)\s+(?:the\s+)?(?:project\s+)?(.+?)(?:\?|$)/i,
      /(?:proposal|quotation|quote)\s+(?:of|for)\s+(?:project\s+)?(.+?)(?:\?|$)/i,
      /(?:show|display|give)\s+(?:details?\s+of\s+)?(?:project\s+)?(.+?)(?:\?|$)/i,
      /(?:tell me about|explain|show|display|give details?\s+of)\s+(?:project\s+)?(.+?)(?:\?|$)/i,
      /(?:in|for|of)\s+project\s+(.+?)(?:\?|$)/i,
      /project\s+(.+?)(?:\s+(?:cost|price|status|scope|technolog|proposal|detail|about|timeline|features|pages|client|company))?(?:\?|$)/i,
    ];

    for (const pat of patterns) {
      const m = raw.match(pat);
      if (m?.[1]) {
        const cleaned = this._cleanPhrase(m[1]);
        if (cleaned.length >= 2) return cleaned;
      }
    }

    const titleCase = raw.match(/(?:in|for|of|about)\s+([A-Z][A-Za-z0-9\s\-–—]+?)(?:\?|$)/);
    if (titleCase?.[1]) {
      const cleaned = this._cleanPhrase(titleCase[1]);
      if (cleaned.length >= 3) return cleaned;
    }

    return null;
  }

  _cleanPhrase(phrase) {
    return (phrase || '')
      .replace(/^(?:details?\s+of\s+|information\s+(?:about|of|regarding|on)\s+|about\s+the\s+|about\s+|the\s+)/i, '')
      .replace(/^project\s+/i, '')
      .replace(/\s+project\s*$/i, '')
      .replace(/^the\s+/i, '')
      .replace(/["']/g, '')
      .trim();
  }
}

module.exports = new AIEntityService();
