/**
 * Confidence — intent, entity, keyword, context, database scores
 * >80 direct | 50–80 confirm | <50 fallback
 */

const THRESHOLD_HIGH = 80;
const THRESHOLD_MEDIUM = 50;

class AIConfidenceService {
  calculate({
    intentScore = 0,
    entityScore = 0,
    keywordScore = 0,
    contextScore = 0,
    databaseScore = 0,
    projectMatchScore = 0,
    intentMatchScore = 0,
    keywordMatchScore = 0,
    hasVerifiedData = false,
    fromContext = false,
  }) {
    const intent = Math.min(25, Math.round((intentScore || intentMatchScore) * 25));
    const entity = Math.min(25, Math.round((entityScore || projectMatchScore) * 25));
    const keyword = Math.min(15, Math.round((keywordScore || keywordMatchScore) * 15));
    const context = Math.min(15, fromContext ? 15 : Math.round(contextScore * 15));
    const database = Math.min(20, Math.round((databaseScore || (hasVerifiedData ? 1 : 0)) * 20));

    let total = intent + entity + keyword + context + database;
    if (hasVerifiedData) total = Math.min(100, total + 5);
    if (!hasVerifiedData && entity < 8 && database < 10) total = Math.min(total, 55);

    return {
      total,
      breakdown: { intent, entity, keyword, context, database },
      tier: total > THRESHOLD_HIGH ? 'high' : total >= THRESHOLD_MEDIUM ? 'medium' : 'low',
    };
  }

  shouldConfirm(confidence) {
    return confidence.tier === 'medium';
  }

  shouldReject(confidence) {
    return confidence.tier === 'low';
  }

  isDirect(confidence) {
    return confidence.tier === 'high';
  }
}

module.exports = new AIConfidenceService();
module.exports.THRESHOLD_HIGH = THRESHOLD_HIGH;
module.exports.THRESHOLD_MEDIUM = THRESHOLD_MEDIUM;
