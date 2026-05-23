/**
 * Project resolution — normalized matching with multi-strategy scoring
 */

const Fuse = require('fuse.js');
const AIProjectCache = require('./AIProjectCache');

const STOP_WORDS = new Set([
  'project', 'app', 'application', 'software',
  'price', 'cost', 'pricing', 'budget', 'amount',
  'show', 'tell', 'give', 'what', 'of', 'the', 'a', 'an',
  'is', 'are', 'was', 'for', 'in', 'on', 'at', 'to', 'me', 'my',
  'how', 'much', 'please', 'about', 'details', 'detail', 'info',
]);

const SCORE_WEIGHTS = {
  exact: 50,
  token: 25,
  partial: 20,
  regex: 15,
  levenshtein: 10,
};

class AIProjectResolver {
  normalizeProjectName(input) {
    if (!input) return '';

    let s = String(input)
      .toLowerCase()
      .replace(/[.,\-_:;()\[\]{}'"]/g, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const tokens = s
      .split(' ')
      .filter((t) => t.length > 0 && !STOP_WORDS.has(t));

    return tokens.join(' ').replace(/\s+/g, ' ').trim();
  }

  getTokens(normalized) {
    return (normalized || '')
      .split(' ')
      .filter((t) => t.length >= 2);
  }

  escapeRegex(str) {
    return (str || '').replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  }

  levenshtein(a, b) {
    const m = a.length;
    const n = b.length;
    if (m === 0) return n;
    if (n === 0) return m;
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

  levenshteinSimilarity(a, b) {
    if (!a || !b) return 0;
    const maxLen = Math.max(a.length, b.length);
    if (maxLen === 0) return 1;
    return 1 - this.levenshtein(a, b) / maxLen;
  }

  compact(str) {
    return (str || '').replace(/\s+/g, '').toLowerCase();
  }

  scoreProject(queryNorm, queryTokens, project) {
    const projNorm = this.normalizeProjectName(project.projectName);
    const projTokens = this.getTokens(projNorm);
    const projCompact = this.compact(projNorm);
    const queryCompact = this.compact(queryNorm);

    let exact = 0;
    let token = 0;
    let partial = 0;
    let regex = 0;
    let lev = 0;

    if (projNorm && queryNorm && projNorm === queryNorm) {
      exact = SCORE_WEIGHTS.exact;
    } else if (projCompact && queryCompact && projCompact === queryCompact) {
      exact = SCORE_WEIGHTS.exact;
    } else if (
      projNorm.includes(queryNorm) ||
      queryNorm.includes(projNorm) ||
      projCompact.includes(queryCompact) ||
      queryCompact.includes(projCompact)
    ) {
      partial = SCORE_WEIGHTS.partial;
    }

    if (queryTokens.length > 0 && projTokens.length > 0) {
      let matched = 0;
      for (const qt of queryTokens) {
        const hit = projTokens.some((pt) => {
          if (pt === qt || pt.includes(qt) || qt.includes(pt)) return true;
          return this.levenshteinSimilarity(qt, pt) >= 0.72;
        });
        if (hit) matched += 1;
      }
      const ratio = matched / queryTokens.length;
      if (ratio >= 1) token = SCORE_WEIGHTS.token;
      else if (ratio >= 0.5) token = Math.round(SCORE_WEIGHTS.token * ratio);
      else if (ratio > 0) token = Math.round(SCORE_WEIGHTS.token * ratio * 0.6);
    }

    if (queryNorm.length >= 3) {
      try {
        const pattern = queryTokens.length
          ? queryTokens.map((t) => this.escapeRegex(t)).join('.*')
          : this.escapeRegex(queryNorm);
        if (new RegExp(pattern, 'i').test(project.projectName || '')) {
          regex = SCORE_WEIGHTS.regex;
        }
      } catch {
        /* ignore invalid regex */
      }
    }

    const sim = this.levenshteinSimilarity(queryCompact, projCompact);
    if (sim >= 0.55) {
      lev = Math.round(SCORE_WEIGHTS.levenshtein * sim);
    }

    const total = Math.min(100, exact + token + partial + regex + lev);

    return {
      total,
      exact,
      token,
      partial,
      regex,
      levenshtein: lev,
      projNorm,
      breakdown: { exact, token, partial, regex, levenshtein: lev },
    };
  }

  rankProjects(query) {
    const raw = String(query || '').trim();
    const normalizedInput = this.normalizeProjectName(raw);
    const queryTokens = this.getTokens(normalizedInput);

    if (!normalizedInput && queryTokens.length === 0) {
      return { ranked: [], normalizedInput, queryTokens, raw };
    }

    return AIProjectCache.getList().then((projects) => {
      const ranked = projects
        .map((p) => {
          const s = this.scoreProject(normalizedInput, queryTokens, p);
          return {
            project: p,
            confidence: s.total,
            matchScore: s.total / 100,
            breakdown: s.breakdown,
            projNorm: s.projNorm,
          };
        })
        .filter((x) => x.confidence > 0)
        .sort((a, b) => b.confidence - a.confidence);

      return { ranked, normalizedInput, queryTokens, raw, projects };
    });
  }

  buildResult(ranked, normalizedInput, raw) {
    if (!ranked.length) {
      console.log({
        originalInput: raw,
        normalizedInput,
        matchedProject: null,
        confidence: 0,
      });
      return {
        found: false,
        project: null,
        matchScore: 0,
        confidence: 0,
        matchType: null,
        suggestions: [],
      };
    }

    const best = ranked[0];
    const second = ranked[1];
    const conf = best.confidence;
    const gap = second ? conf - second.confidence : conf;

    let found = false;
    let matchType = 'scored';

    if (conf >= 80) {
      found = true;
      matchType = best.breakdown.exact ? 'exact' : 'high_confidence';
    } else if (conf >= 50) {
      if (!second || gap >= 8 || second.confidence < 50) {
        found = true;
        matchType = 'auto_select';
      }
    }

    const suggestions = ranked.slice(0, 3).map((r) => r.project.projectName);

    console.log({
      originalInput: raw,
      normalizedInput,
      matchedProject: found ? best.project.projectName : null,
      confidence: conf,
      secondBest: second?.confidence,
      matchType,
    });

    return {
      found,
      project: found ? best.project : null,
      matchScore: best.matchScore,
      confidence: conf,
      matchType,
      suggestions: found ? [] : suggestions,
      autoSelected: found && conf >= 50 && conf < 80,
    };
  }

  async resolve(query) {
    if (!query || !String(query).trim()) {
      return { found: false, project: null, matchScore: 0, confidence: 0, matchType: null, suggestions: [] };
    }

    const raw = String(query).trim();
    const { ranked, normalizedInput } = await this.rankProjects(raw);

    if (ranked.length === 0) {
      const fuseList = await AIProjectCache.getList();
      const fuse = new Fuse(fuseList, {
        keys: ['projectName'],
        threshold: 0.45,
        includeScore: true,
        ignoreLocation: true,
      });

      const fuseQuery = normalizedInput || raw;
      const fuseResults = fuse.search(fuseQuery).slice(0, 5);

      if (fuseResults.length > 0) {
        const reranked = fuseResults.map((r) => {
          const s = this.scoreProject(normalizedInput, this.getTokens(normalizedInput), r.item);
          return {
            project: r.item,
            confidence: Math.max(s.total, Math.round((1 - (r.score || 0)) * 70)),
            matchScore: s.total / 100,
            breakdown: s.breakdown,
          };
        }).sort((a, b) => b.confidence - a.confidence);

        return this.buildResult(reranked, normalizedInput, raw);
      }

      return this.buildResult([], normalizedInput, raw);
    }

    const best = ranked[0];

    if (best.confidence >= 50 && !best.breakdown.exact) {
      const fuse = new Fuse([best.project], {
        keys: ['projectName'],
        threshold: 0.45,
        includeScore: true,
      });
      const fr = fuse.search(normalizedInput || raw);
      if (fr.length && (1 - fr[0].score) >= 0.4) {
        best.confidence = Math.min(100, best.confidence + 5);
        best.matchScore = best.confidence / 100;
      }
    }

    return this.buildResult(ranked, normalizedInput, raw);
  }

  async resolveByName(projectName) {
    return this.resolve(projectName);
  }
}

const resolver = new AIProjectResolver();
const normalizeProjectName = AIProjectResolver.prototype.normalizeProjectName.bind(resolver);
module.exports = resolver;
module.exports.normalizeProjectName = normalizeProjectName;
