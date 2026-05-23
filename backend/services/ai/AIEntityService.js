/**
 * Entity extraction — delegates to AINLPService
 */

const AINLPService = require('./AINLPService');

class AIEntityService {
  normalize(text) {
    return AINLPService.normalizeInput(text);
  }

  compactName(name) {
    return (name || '').replace(/\s+/g, '').trim();
  }

  extract(message, context = {}) {
    return AINLPService.extractEntities(message, context);
  }
}

module.exports = new AIEntityService();
