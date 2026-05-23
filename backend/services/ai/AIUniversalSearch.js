/**
 * Universal MongoDB search — exact, partial, regex, fuzzy, Levenshtein, token similarity
 */

const Project = require('../../models/Project');
const SystemKnowledge = require('../../models/SystemKnowledge');

class AIUniversalSearch {
  levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const cost = a[i - 1] === b[j - 1] ? 0 : 1;
        dp[i][j] = Math.min(dp[i - 1][j] + 1, dp[i][j - 1] + 1, dp[i - 1][j - 1] + cost);
      }
    }
    return dp[m][n];
  }

  tokenize(str) {
    return (str || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, ' ')
      .split(/\s+/)
      .filter((t) => t.length > 1);
  }

  tokenSimilarity(query, target) {
    const qTokens = this.tokenize(query);
    const tTokens = this.tokenize(target);
    if (!qTokens.length || !tTokens.length) return 0;
    let matches = 0;
    for (const qt of qTokens) {
      if (tTokens.some((tt) => tt.includes(qt) || qt.includes(tt) || this.levenshtein(qt, tt) <= 2)) {
        matches += 1;
      }
    }
    return matches / Math.max(qTokens.length, tTokens.length);
  }

  similarity(a, b) {
    if (!a || !b) return 0;
    const la = a.toLowerCase().replace(/\s+/g, '');
    const lb = b.toLowerCase().replace(/\s+/g, '');
    const maxLen = Math.max(la.length, lb.length);
    if (maxLen === 0) return 1;
    const lev = 1 - this.levenshtein(la, lb) / maxLen;
    const tok = this.tokenSimilarity(a, b);
    return Math.max(lev, tok);
  }

  escapeRegex(str) {
    return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  normalizeQuery(name) {
    return (name || '').trim().replace(/\s+/g, '');
  }

  scoreProjectMatch(query, project) {
    const q = this.normalizeQuery(query);
    const names = [
      project.projectName,
      project.projectId,
      (project.projectName || '').replace(/\s+/g, ''),
      project.clientName,
      project.companyName,
    ].filter(Boolean);

    let best = 0;
    for (const n of names) {
      const compact = (n || '').replace(/\s+/g, '');
      if (compact.toLowerCase() === q.toLowerCase()) return 1;
      if (compact.toLowerCase().includes(q.toLowerCase()) || q.toLowerCase().includes(compact.toLowerCase())) {
        best = Math.max(best, 0.88);
      }
      best = Math.max(best, this.similarity(q, compact));
    }
    return best;
  }

  async findProject(name) {
    if (!name) return { found: false, project: null, matchScore: 0, suggestions: [], matchType: null };

    const clean = this.normalizeQuery(name);
    const escaped = this.escapeRegex(clean);

    const exact = await Project.findOne({
      $or: [
        { projectName: new RegExp(`^${escaped}$`, 'i') },
        { projectId: new RegExp(`^${escaped}$`, 'i') },
      ],
    }).lean();

    if (exact) {
      return { found: true, project: exact, matchScore: 1, matchType: 'exact', suggestions: [] };
    }

    const partial = await Project.find({
      $or: [
        { projectName: new RegExp(escaped, 'i') },
        { projectId: new RegExp(escaped, 'i') },
      ],
    })
      .limit(40)
      .lean();

    const pool = partial.length ? partial : await Project.find().select('projectName projectId clientName companyName status cost category timeline technologies').limit(80).lean();

    const scored = pool
      .map((p) => ({ p, score: this.scoreProjectMatch(clean, p) }))
      .filter((x) => x.score >= 0.35)
      .sort((a, b) => b.score - a.score);

    if (!scored.length) {
      return { found: false, project: null, matchScore: 0, suggestions: [], matchType: null };
    }

    const best = scored[0];
    const found = best.score >= 0.52;

    return {
      found,
      project: found ? best.p : null,
      matchScore: best.score,
      matchType: best.score >= 0.95 ? 'exact' : best.score >= 0.7 ? 'partial' : 'fuzzy',
      suggestions: scored.slice(0, 3).map((x) => x.p.projectName),
    };
  }

  async findClientProjects(clientName) {
    if (!clientName) return [];
    const regex = new RegExp(this.escapeRegex(clientName.trim()), 'i');
    return Project.find({
      $or: [{ clientName: regex }, { companyName: regex }],
    })
      .sort({ updatedAt: -1 })
      .limit(30)
      .lean();
  }

  async findProjectsByStatus(status, limit = 20) {
    return Project.find({ status: new RegExp(`^${status}$`, 'i') })
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
  }

  async listRecentProjects(limit = 15) {
    return Project.find()
      .select('projectName status cost clientName companyName createdAt category timeline technologies branch features numberOfPages')
      .sort({ updatedAt: -1 })
      .limit(limit)
      .lean();
  }

  async findSystemKnowledge(message, intent, keywords = []) {
    const terms = keywords.length ? keywords : message.toLowerCase().split(/\s+/).filter((w) => w.length > 2);
    const categoryMap = {
      export_question: 'export',
      pdf_export: 'export',
      excel_export: 'export',
      csv_export: 'export',
      project_export: 'export',
      architecture_question: 'architecture',
      backend_architecture: 'backend',
      backend_question: 'backend',
      frontend_architecture: 'frontend',
      frontend_question: 'frontend',
      project_structure: 'architecture',
      folder_structure: 'architecture',
      workflow_question: 'workflow',
      workflow: 'workflow',
      project_creation: 'workflow',
      proposal_generation: 'proposal',
      proposal: 'proposal',
      training: 'training',
      training_history: 'training',
      system_info: 'general',
      help: 'general',
    };

    const or = [
      { keywords: { $in: terms } },
      { title: new RegExp(terms.slice(0, 5).join('|'), 'i') },
    ];
    if (categoryMap[intent]) or.push({ category: categoryMap[intent] });

    const results = await SystemKnowledge.find({ $or: or }).limit(4).lean();
    if (results.length > 0) return results;

    if (terms.length >= 2) {
      return SystemKnowledge.find({
        content: new RegExp(terms.slice(0, 3).join('|'), 'i'),
      })
        .limit(2)
        .lean();
    }
    return [];
  }
}

module.exports = new AIUniversalSearch();
