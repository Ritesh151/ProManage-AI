/**
 * MongoDB search — delegates to AIUniversalSearch (backward compatible)
 */

const AIUniversalSearch = require('./AIUniversalSearch');

class AISearchEngine {
  async findProject(name) {
    return AIUniversalSearch.findProject(name);
  }

  async findClientProjects(clientName) {
    return AIUniversalSearch.findClientProjects(clientName);
  }

  async findProposal(projectName) {
    return AIUniversalSearch.findProject(projectName);
  }

  async findTechnologies(projectName) {
    return AIUniversalSearch.findProject(projectName);
  }

  async findProjectDetails(projectName) {
    return AIUniversalSearch.findProject(projectName);
  }

  async findSystemKnowledge(message, intent, keywords = []) {
    return AIUniversalSearch.findSystemKnowledge(message, intent, keywords);
  }

  async listRecentProjects(limit = 5) {
    return AIUniversalSearch.listRecentProjects(limit);
  }
}

module.exports = new AISearchEngine();
