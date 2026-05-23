const SPELLING_CORRECTIONS = {
  prjct: 'project', prjcts: 'projects', projct: 'project', proj: 'project',
  projs: 'projects', projcet: 'project', projek: 'project', projekts: 'projects',
  analitics: 'analytics', analtics: 'analytics', analatics: 'analytics',
  analy: 'analytics', analisis: 'analytics', analyis: 'analytics',
  proposl: 'proposal', proposel: 'proposal', proposle: 'proposal',
  propos: 'proposal', prop: 'proposal', propsoal: 'proposal',
  techology: 'technology', technolgy: 'technology', tecnology: 'technology',
  teck: 'tech', tecknology: 'technology', tehnology: 'technology',
  technlogy: 'technology', techno: 'technology',
  dhasboard: 'dashboard', dashbord: 'dashboard', dshboard: 'dashboard',
  dasboard: 'dashboard', dshbrd: 'dashboard',
  settngs: 'settings', settigs: 'settings', setings: 'settings',
  exportt: 'export', eksport: 'export', exprot: 'export', exprt: 'export',
  trainng: 'training', trainig: 'training', traning: 'training',
  train: 'training', traning: 'training',
  navigat: 'navigate', nav: 'navigate', navegate: 'navigate',
  navi: 'navigate', navg: 'navigate',
  detals: 'details', deteil: 'detail', deta: 'detail',
  statuss: 'status', statsu: 'status', stauts: 'status',
  costt: 'cost', cosst: 'cost', cst: 'cost',
  pricce: 'price', prise: 'price', prce: 'price',
  budet: 'budget', budgt: 'budget', bugdet: 'budget',
  scople: 'scope', scop: 'scope', skope: 'scope',
  timelin: 'timeline', timline: 'timeline', timelne: 'timeline',
  deadlin: 'deadline', dedline: 'deadline', dedaline: 'deadline',
  featuers: 'features', featur: 'feature', feture: 'feature',
  clint: 'client', clent: 'client', cleint: 'client',
  compny: 'company', compnay: 'company', comapny: 'company',
  techn: 'technology', teckstack: 'tech stack', freamwork: 'framework',
  mongodb: 'MongoDB', nodejs: 'Node.js', reactjs: 'ReactJS',
};

class AIQueryNormalizer {
  normalize(text) {
    if (!text) return '';
    let q = text.toLowerCase().trim();
    q = q.replace(/[^\w\s\u0900-\u097F₹]/g, ' ');
    q = q.replace(/\s+/g, ' ');
    q = this._correctSpelling(q);
    q = this._removeDuplicateWords(q);
    return q.trim();
  }

  _correctSpelling(text) {
    const words = text.split(/\s+/);
    return words.map(w => SPELLING_CORRECTIONS[w.toLowerCase()] || w).join(' ');
  }

  _removeDuplicateWords(text) {
    const words = text.split(/\s+/);
    const seen = new Set();
    const result = [];
    for (const w of words) {
      if (!seen.has(w)) {
        seen.add(w);
        result.push(w);
      }
    }
    return result.join(' ');
  }

  expandKeywords(text) {
    const expansions = {
      cost: ['price', 'pricing', 'budget', 'amount', 'expense', 'charges', 'fees', 'payment', 'total', 'worth', 'valuation'],
      technology: ['tech', 'technologies', 'stack', 'framework', 'libraries', 'platform'],
      details: ['detail', 'about', 'info', 'information', 'overview', 'summary', 'description'],
      proposal: ['proposals', 'quotation', 'quote', 'estimate', 'bid'],
      status: ['progress', 'stage', 'phase'],
      timeline: ['duration', 'deadline', 'schedule', 'timeframe', 'time'],
      scope: ['deliverable', 'work scope', 'deliverables'],
      features: ['feature', 'functionality', 'capabilities'],
      client: ['company', 'customer', 'organization'],
      projects: ['project', 'all projects', 'recent projects'],
      recent: ['latest', 'new', 'current'],
      active: ['running', 'ongoing', 'in progress'],
      completed: ['finished', 'done', 'closed'],
      help: ['commands', 'capabilities', 'guide', 'tutorial', 'documentation'],
      greeting: ['hi', 'hello', 'hey', 'good morning', 'good evening'],
      navigation: ['navigate', 'go to', 'open', 'take me', 'show me page', 'redirect'],
    };

    const expanded = new Set();
    const words = text.split(/\s+/);
    for (const w of words) {
      expanded.add(w);
      for (const [key, vals] of Object.entries(expansions)) {
        if (w === key || vals.includes(w)) {
          expanded.add(key);
          vals.forEach(v => expanded.add(v));
        }
      }
    }
    return [...expanded];
  }
}

module.exports = new AIQueryNormalizer();
