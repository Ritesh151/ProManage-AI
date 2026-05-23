const NOT_TRAINED_MESSAGE = "I'm not trained for this question yet, please try again later.";

class AIFallbackService {
  notTrained() {
    return {
      content: NOT_TRAINED_MESSAGE,
      format: 'markdown',
      verified: false,
      success: true,
      confidence: 0,
    };
  }

  noProjectData() {
    return {
      content: "I couldn't find verified project data.",
      format: 'markdown',
      verified: false,
      success: true,
      confidence: 0,
    };
  }

  noProjectName() {
    return {
      content: 'Please specify a project name.',
      format: 'markdown',
      verified: false,
      success: true,
      confidence: 0,
    };
  }

  noClientName() {
    return {
      content: 'Please provide a client or company name.',
      format: 'markdown',
      verified: false,
      success: true,
      confidence: 0,
    };
  }

  genericError() {
    return {
      content: 'Project exists but requested information is unavailable.',
      format: 'error',
      verified: false,
      success: true,
    };
  }

  handleUnknown(intent, entities) {
    return {
      intent,
      entities,
      ...this.notTrained(),
    };
  }
}

module.exports = new AIFallbackService();
