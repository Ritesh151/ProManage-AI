/**
 * AI Project Discovery Service
 * Discovers ProposalForge AI modules for training
 */

const fs = require('fs');
const {
  PROJECT_DISPLAY_NAME,
  getExistingTrainingModules,
} = require('../config/proposalForgeModules');
const { scanDirectory } = require('../utils/fileUtils');
const AILogger = require('../utils/logger');

const logger = new AILogger('ProjectDiscoveryService');

class AIProjectDiscoveryService {
  constructor() {
    this.discoveredProjects = [];
    this.projectCache = new Map();
  }

  async discoverProjects() {
    logger.info('Starting ProposalForge AI project discovery');
    this.discoveredProjects = [];
    this.projectCache.clear();

    const modules = getExistingTrainingModules();

    for (const mod of modules) {
      try {
        const files = scanDirectory(mod.path);
        const project = {
          name: mod.label,
          moduleId: mod.id,
          path: mod.path,
          relativePath: mod.relativePath,
          type: mod.type,
          fileCount: files.length,
          discoveredAt: new Date(),
          lastScanned: null,
          status: 'pending',
          rootProject: PROJECT_DISPLAY_NAME,
        };
        this.discoveredProjects.push(project);
        this.projectCache.set(mod.path, project);
        logger.info('Discovered module', { projectName: project.name, fileCount: files.length });
      } catch (err) {
        logger.warn('Error discovering module', { module: mod.id, error: err.message });
      }
    }

    logger.info('Project discovery completed', { modulesFound: this.discoveredProjects.length });
    return this.discoveredProjects;
  }

  getDiscoveredProjects() {
    return this.discoveredProjects;
  }

  getProjectByPath(projectPath) {
    return this.projectCache.get(projectPath);
  }

  getProjectByName(projectName) {
    return this.discoveredProjects.find((p) => p.name === projectName);
  }

  updateProjectStatus(projectPath, status) {
    const project = this.projectCache.get(projectPath);
    if (project) {
      project.status = status;
      project.lastScanned = new Date();
    }
  }

  getProjectsByType(projectType) {
    return this.discoveredProjects.filter((p) => p.type === projectType);
  }

  getStatistics() {
    const stats = {
      totalProjects: this.discoveredProjects.length,
      rootProject: PROJECT_DISPLAY_NAME,
      byType: {},
      byStatus: {},
      totalFiles: 0,
    };

    for (const project of this.discoveredProjects) {
      stats.byType[project.type] = (stats.byType[project.type] || 0) + 1;
      stats.byStatus[project.status] = (stats.byStatus[project.status] || 0) + 1;
      stats.totalFiles += project.fileCount;
    }

    return stats;
  }
}

module.exports = AIProjectDiscoveryService;
