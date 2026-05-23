const Fuse = require('fuse.js');
const AISearchService = require('./AISearchService');

const STOP_WORDS = new Set([
  'project', 'app', 'application', 'software',
  'price', 'cost', 'pricing', 'budget', 'amount',
  'show', 'tell', 'give', 'what', 'of', 'the', 'a', 'an',
  'is', 'are', 'was', 'for', 'in', 'on', 'at', 'to', 'me', 'my',
  'how', 'much', 'please', 'about', 'details', 'detail', 'info',
]);

class AIProjectResolver {
  _normalizeInput(text) {
    return (text || '')
      .toLowerCase()
      .replace(/[^\w\s]/g, '')
      .replace(/\s+/g, ' ')
      .replace(/\b(?:project|app|application|software|the|a|an|show|tell|give|what|of|is|are|was|for|in|on|at|to|me|my|how|much|please|about|details?|info|price|cost|pricing|budget|amount)\b/gi, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async resolve(query) {
    if (!query || !String(query).trim()) {
      return { found: false, project: null, matchScore: 0, confidence: 0, matchType: null, suggestions: [] };
    }

    const raw = String(query).trim();

    console.log(`[AIProjectResolver] resolve() called with query: "${raw}"`);

    const searchResult = await AISearchService.findProject(raw);

    if (searchResult.found) {
      const confidence = Math.round(searchResult.matchScore * 100);
      console.log(`[AIProjectResolver] searchService found: "${searchResult.project.projectName}" (matchType: ${searchResult.matchType}, confidence: ${confidence})`);
      return {
        found: true,
        project: searchResult.project,
        matchScore: searchResult.matchScore,
        confidence,
        matchType: searchResult.matchType,
        suggestions: [],
        autoSelected: confidence > 70,
      };
    }

    const allProjects = await AISearchService.getAllProjects();
    if (!allProjects.length) {
      console.log('[AIProjectResolver] no projects in DB');
      return { found: false, project: null, matchScore: 0, confidence: 0, matchType: null, suggestions: [] };
    }

    const normQuery = this._normalizeInput(raw);
    console.log(`[AIProjectResolver] normalized query: "${normQuery}"`);

    if (normQuery.length >= 2) {
      const normMatch = allProjects.find(p => this._normalizeInput(p.projectName) === normQuery);
      if (normMatch) {
        console.log(`[AIProjectResolver] normalized match found: "${normMatch.projectName}"`);
        return {
          found: true,
          project: normMatch,
          matchScore: 1,
          confidence: 95,
          matchType: 'normalized',
          suggestions: [],
          autoSelected: true,
        };
      }
    }

    const fuse = new Fuse(allProjects, {
      keys: ['projectName'],
      threshold: 0.45,
      includeScore: true,
      ignoreLocation: true,
    });

    const fuseResults = fuse.search(raw).slice(0, 5);
    if (fuseResults.length > 0) {
      const best = fuseResults[0];
      const fuseConfidence = Math.round((1 - best.score) * 70);
      const project = best.item;

      console.log(`[AIProjectResolver] fuse best: "${project.projectName}" (score: ${best.score}, confidence: ${fuseConfidence})`);

      if (fuseConfidence >= 50) {
        return {
          found: true,
          project,
          matchScore: 1 - best.score,
          confidence: fuseConfidence,
          matchType: 'fuse',
          suggestions: fuseResults.slice(0, 3).map(r => r.item.projectName),
          autoSelected: fuseConfidence > 70,
        };
      }

      return {
        found: false,
        project: null,
        matchScore: 1 - best.score,
        confidence: fuseConfidence,
        matchType: 'fuse_low',
        suggestions: fuseResults.slice(0, 3).map(r => r.item.projectName),
      };
    }

    console.log('[AIProjectResolver] no match found');
    return { found: false, project: null, matchScore: 0, confidence: 0, matchType: null, suggestions: [] };
  }
}

module.exports = new AIProjectResolver();
