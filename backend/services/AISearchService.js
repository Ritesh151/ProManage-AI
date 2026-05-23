const Project = require('../models/Project');
const ProjectKnowledge = require('../models/ProjectKnowledge');
const SystemKnowledge = require('../models/SystemKnowledge');
const AIEmbeddingService = require('./AIEmbeddingService');

class AISearchService {
  _normalize(str) {
    return (str || '').toLowerCase().replace(/[^a-z0-9]/g, '');
  }

  async findProject(query) {
    if (!query) return { found: false, project: null, matchScore: 0, suggestions: [], matchType: null };

    const clean = query.trim().replace(/\s+/g, '');
    const escaped = query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

    const exact = await Project.findOne({
      $or: [
        { projectName: new RegExp(`^${escaped}$`, 'i') },
        { projectId: new RegExp(`^${escaped}$`, 'i') },
      ],
    }).lean();

    if (exact) {
      return { found: true, project: exact, matchScore: 1, matchType: 'exact', suggestions: [] };
    }

    const normQuery = this._normalize(query);
    const allProjects = await Project.find().limit(100).lean();
    const normMatch = allProjects.find(p => this._normalize(p.projectName) === normQuery);
    if (normMatch) {
      return { found: true, project: normMatch, matchScore: 1, matchType: 'normalized', suggestions: [] };
    }

    const partial = await Project.find({
      projectName: new RegExp(escaped, 'i'),
    }).limit(20).lean();

    const pool = partial.length ? partial : allProjects;

    const scored = pool.map(p => {
      const score = this._scoreMatch(clean, p);
      return { project: p, score };
    }).filter(x => x.score >= 0.3).sort((a, b) => b.score - a.score);

    if (!scored.length) {
      return { found: false, project: null, matchScore: 0, suggestions: [], matchType: null };
    }

    const best = scored[0];
    const found = best.score >= 0.5;

    return {
      found,
      project: found ? best.project : null,
      matchScore: best.score,
      matchType: best.score >= 0.9 ? 'exact' : best.score >= 0.7 ? 'high' : 'fuzzy',
      suggestions: scored.slice(0, 3).map(x => x.project.projectName),
    };
  }

  _scoreMatch(query, project) {
    const q = query.toLowerCase();
    const names = [
      project.projectName,
      (project.projectName || '').replace(/\s+/g, ''),
      project.clientName,
      project.companyName,
      project.projectId,
    ].filter(Boolean);

    let best = 0;
    for (const n of names) {
      const nl = n.toLowerCase().replace(/\s+/g, '');
      if (nl === q) return 1;
      if (nl.includes(q) || q.includes(nl)) best = Math.max(best, 0.85);
      const lev = this._levenshteinSimilarity(q, nl);
      best = Math.max(best, lev);
      const tokens = q.split(/\s+/).filter(t => t.length > 1);
      const nameTokens = nl.split(/\s+/).filter(t => t.length > 1);
      if (tokens.length && nameTokens.length) {
        let matches = 0;
        for (const t of tokens) {
          if (nameTokens.some(nt => nt.includes(t) || t.includes(nt) || this._levenshteinSimilarity(t, nt) > 0.7)) {
            matches++;
          }
        }
        best = Math.max(best, matches / Math.max(tokens.length, nameTokens.length) * 0.9);
      }
    }
    return Math.round(best * 100) / 100;
  }

  _levenshteinSimilarity(a, b) {
    if (!a || !b) return 0;
    const m = a.length, n = b.length;
    if (m === 0 && n === 0) return 0;
    const dp = Array.from({ length: m + 1 }, () => Array(n + 1).fill(0));
    for (let i = 0; i <= m; i++) dp[i][0] = i;
    for (let j = 0; j <= n; j++) dp[0][j] = j;
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        dp[i][j] = Math.min(
          dp[i - 1][j] + 1,
          dp[i][j - 1] + 1,
          dp[i - 1][j - 1] + (a[i - 1] === b[j - 1] ? 0 : 1)
        );
      }
    }
    return 1 - dp[m][n] / Math.max(m, n);
  }

  async findClientProjects(clientName) {
    if (!clientName) return [];
    const regex = new RegExp(clientName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i');
    return Project.find({
      $or: [{ clientName: regex }, { companyName: regex }],
    }).sort({ updatedAt: -1 }).limit(30).lean();
  }

  async findProjectsByStatus(status, limit = 20) {
    return Project.find({ status: new RegExp(`^${status}$`, 'i') })
      .sort({ updatedAt: -1 }).limit(limit).lean();
  }

  async listRecentProjects(limit = 15) {
    return Project.find()
      .select('projectName status cost clientName companyName createdAt category timeline technologies scopeOfWork features branch numberOfPages description')
      .sort({ updatedAt: -1 }).limit(limit).lean();
  }

  async findSystemKnowledge(message, intent, keywords = []) {
    const terms = keywords.length ? keywords : message.toLowerCase().split(/\s+/).filter(w => w.length > 2);
    const or = [
      { keywords: { $in: terms } },
      { title: new RegExp(terms.slice(0, 5).join('|'), 'i') },
    ];
    const results = await SystemKnowledge.find({ $or: or }).limit(4).lean();
    if (results.length > 0) return results;
    if (terms.length >= 2) {
      return SystemKnowledge.find({
        content: new RegExp(terms.slice(0, 3).join('|'), 'i'),
      }).limit(2).lean();
    }
    return [];
  }

  async searchKnowledge(query, limit = 10) {
    const embedding = AIEmbeddingService.generateEmbedding(query);
    if (!embedding) return [];
    const allDocs = await ProjectKnowledge.find({ embedding: { $exists: true, $not: { $size: 0 } } }).lean();
    const scored = allDocs.map(doc => ({
      ...doc,
      similarity: AIEmbeddingService.cosineSimilarity(embedding, doc.embedding),
    }));
    return scored.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
  }

  async getAllProjects() {
    return Project.find()
      .select('projectName projectId status cost clientName companyName createdAt category timeline technologies')
      .sort({ updatedAt: -1 }).lean();
  }
}

module.exports = new AISearchService();
