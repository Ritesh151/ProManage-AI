/**
 * AI Project Discovery Service
 * Discovers and catalogs projects from configured paths
 */

const fs = require('fs');
const path = require('path');
const { PROJECT_PATHS } = require('../config/projectPaths');
const { scanDirectory, getProjectName, detectProjectType } = require('../utils/fileUtils');
const AILogger = require('../utils/logger');

const logger = new AILogger('ProjectDiscoveryService');

class AIProjectDiscoveryService {
  constructor() {
    this.discoveredProjects = [];
    this.projectCache = new Map();
  }

  /**
   * Discover all projects from configured paths
   */
  async discoverProjects() {
    logger.info('Starting project discovery');
    this.discoveredProjects = [];

    for (const projectPath of PROJECT_PATHS) {
      if (!fs.existsSync(projectPath)) {
        logger.debug('Project path does not exist', { projectPath });
        continue;
      }

      try {
        const stats = fs.statSync(projectPath);
        if (!stats.isDirectory()) {
          logger.debug('Project path is not a directory', { projectPath });
          continue;
        }

        // Check if this is a project root
        if (this.isProjectRoot(projectPath)) {
          const project = this.createProjectMetadata(projectPath);
          this.discoveredProjects.push(project);
          this.projectCache.set(projectPath, project);
          logger.info('Discovered project', { projectName: project.name, projectPath });
        } else {
          // Scan subdirectories for projects
          await this.scanForSubprojects(projectPath);
        }
      } catch (err) {
        logger.warn('Error discovering projects', { projectPath, error: err.message });
      }
    }

    logger.info('Project discovery completed', { 
      projectsFound: this.discoveredProjects.length 
    });

    return this.discoveredProjects;
  }

  /**
   * Scan directory for subprojects
   */
  async scanForSubprojects(dirPath, maxDepth = 3, currentDepth = 0) {
    if (currentDepth >= maxDepth) {
      return;
    }

    try {
      const entries = fs.readdirSync(dirPath, { withFileTypes: true });

      for (const entry of entries) {
        if (!entry.isDirectory()) continue;

        const fullPath = path.join(dirPath, entry.name);

        // Skip hidden directories and common non-project directories
        if (entry.name.startsWith('.') || 
            ['node_modules', 'build', 'dist', '.git'].includes(entry.name)) {
          continue;
        }

        if (this.isProjectRoot(fullPath)) {
          const project = this.createProjectMetadata(fullPath);
          this.discoveredProjects.push(project);
          this.projectCache.set(fullPath, project);
          logger.info('Discovered subproject', { projectName: project.name, projectPath: fullPath });
        } else {
          // Continue scanning deeper
          await this.scanForSubprojects(fullPath, maxDepth, currentDepth + 1);
        }
      }
    } catch (err) {
      logger.warn('Error scanning for subprojects', { dirPath, error: err.message });
    }
  }

  /**
   * Check if directory is a project root
   */
  isProjectRoot(dirPath) {
    const projectIndicators = [
      'package.json',
      'pom.xml',
      'build.gradle',
      'requirements.txt',
      'setup.py',
      'pubspec.yaml',
      'Cargo.toml',
      'go.mod',
      'composer.json',
      'Gemfile',
      '.git',
    ];

    try {
      const files = fs.readdirSync(dirPath);
      return projectIndicators.some(indicator => files.includes(indicator));
    } catch (err) {
      return false;
    }
  }

  /**
   * Create project metadata
   */
  createProjectMetadata(projectPath) {
    const projectName = getProjectName(projectPath);
    const projectType = detectProjectType(projectPath);
    const files = scanDirectory(projectPath);

    return {
      name: projectName,
      path: projectPath,
      type: projectType,
      fileCount: files.length,
      discoveredAt: new Date(),
      lastScanned: null,
      status: 'pending', // pending, processing, completed, failed
    };
  }

  /**
   * Get all discovered projects
   */
  getDiscoveredProjects() {
    return this.discoveredProjects;
  }

  /**
   * Get project by path
   */
  getProjectByPath(projectPath) {
    return this.projectCache.get(projectPath);
  }

  /**
   * Get project by name
   */
  getProjectByName(projectName) {
    return this.discoveredProjects.find(p => p.name === projectName);
  }

  /**
   * Update project status
   */
  updateProjectStatus(projectPath, status) {
    const project = this.projectCache.get(projectPath);
    if (project) {
      project.status = status;
      project.lastScanned = new Date();
    }
  }

  /**
   * Get projects by type
   */
  getProjectsByType(projectType) {
    return this.discoveredProjects.filter(p => p.type === projectType);
  }

  /**
   * Get project statistics
   */
  getStatistics() {
    const stats = {
      totalProjects: this.discoveredProjects.length,
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
