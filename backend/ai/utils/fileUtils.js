/**
 * File Utilities for AI System
 * Handles file operations, hashing, and content extraction
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { SUPPORTED_EXTENSIONS, EXCLUDED_DIRS, EXCLUDED_PATTERNS } = require('../config/projectPaths');
const { resolveModuleLabel, isAllowedTrainingPath } = require('../config/proposalForgeModules');
const AILogger = require('./logger');

const logger = new AILogger('FileUtils');

/**
 * Calculate file hash for change detection
 */
function calculateFileHash(filePath) {
  try {
    const content = fs.readFileSync(filePath, 'utf-8');
    return crypto.createHash('sha256').update(content).digest('hex');
  } catch (err) {
    logger.error('Error calculating file hash', { filePath, error: err.message });
    return null;
  }
}

/**
 * Check if file should be processed
 */
function shouldProcessFile(filePath) {
  const filename = path.basename(filePath);
  const ext = path.extname(filePath);

  if (!isAllowedTrainingPath(filePath)) {
    return false;
  }

  for (const pattern of EXCLUDED_PATTERNS) {
    if (pattern.test(filename)) {
      return false;
    }
  }

  // Check supported extensions
  const isSupported = SUPPORTED_EXTENSIONS.some(supportedExt => {
    if (supportedExt.startsWith('.')) {
      return ext === supportedExt || filename === supportedExt;
    }
    return filename === supportedExt;
  });

  return isSupported;
}

/**
 * Check if directory should be excluded
 */
function shouldExcludeDir(dirPath) {
  const dirname = path.basename(dirPath);
  return EXCLUDED_DIRS.includes(dirname);
}

/**
 * Recursively scan directory for files
 */
function scanDirectory(dirPath, maxDepth = 10, currentDepth = 0) {
  const files = [];

  if (currentDepth >= maxDepth) {
    return files;
  }

  try {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    for (const entry of entries) {
      const fullPath = path.join(dirPath, entry.name);

      if (entry.isDirectory()) {
        if (!shouldExcludeDir(fullPath)) {
          files.push(...scanDirectory(fullPath, maxDepth, currentDepth + 1));
        }
      } else if (entry.isFile()) {
        if (shouldProcessFile(fullPath)) {
          files.push(fullPath);
        }
      }
    }
  } catch (err) {
    logger.warn('Error scanning directory', { dirPath, error: err.message });
  }

  return files;
}

/**
 * Read file content with encoding detection
 */
function readFileContent(filePath) {
  try {
    // Try UTF-8 first
    const content = fs.readFileSync(filePath, 'utf-8');
    return content;
  } catch (err) {
    try {
      // Fallback to latin1
      const content = fs.readFileSync(filePath, 'latin1');
      return content;
    } catch (fallbackErr) {
      logger.error('Error reading file content', { filePath, error: err.message });
      return null;
    }
  }
}

/**
 * Get file metadata
 */
function getFileMetadata(filePath) {
  try {
    const stats = fs.statSync(filePath);
    const ext = path.extname(filePath);
    const filename = path.basename(filePath);

    // Determine language
    let language = 'other';
    if (['.js', '.jsx'].includes(ext)) language = 'javascript';
    else if (['.ts', '.tsx'].includes(ext)) language = 'typescript';
    else if (['.py'].includes(ext)) language = 'python';
    else if (['.java'].includes(ext)) language = 'java';
    else if (['.kt'].includes(ext)) language = 'kotlin';
    else if (['.dart'].includes(ext)) language = 'dart';
    else if (['.md'].includes(ext)) language = 'markdown';
    else if (['.json'].includes(ext)) language = 'json';
    else if (['.yaml', '.yml'].includes(ext)) language = 'yaml';

    // Determine file type
    let fileType = 'other';
    if (['README.md', '.env', '.env.example', 'package.json', 'pubspec.yaml', 'requirements.txt'].includes(filename)) {
      fileType = 'config';
    } else if (['.md', '.txt'].includes(ext)) {
      fileType = 'documentation';
    } else if (['.js', '.jsx', '.ts', '.tsx', '.py', '.java', '.kt', '.dart'].includes(ext)) {
      fileType = 'code';
    } else if (['.json', '.yaml', '.yml'].includes(ext)) {
      fileType = 'data';
    }

    return {
      filename,
      language,
      fileType,
      fileSize: stats.size,
      createdAt: stats.birthtime,
      modifiedAt: stats.mtime,
    };
  } catch (err) {
    logger.error('Error getting file metadata', { filePath, error: err.message });
    return null;
  }
}

/**
 * Detect project type from directory
 */
function detectProjectType(projectPath) {
  const files = fs.readdirSync(projectPath, { withFileTypes: true });
  const fileNames = files.map(f => f.name);

  if (fileNames.includes('package.json')) {
    const packageJson = JSON.parse(fs.readFileSync(path.join(projectPath, 'package.json'), 'utf-8'));
    if (packageJson.dependencies?.react || packageJson.devDependencies?.react) {
      return 'react';
    }
    return 'nodejs';
  }

  if (fileNames.includes('requirements.txt') || fileNames.includes('setup.py')) {
    return 'python';
  }

  if (fileNames.includes('pom.xml') || fileNames.includes('build.gradle')) {
    return 'java';
  }

  return 'other';
}

/**
 * Get project name from directory
 */
function getProjectName(projectPath) {
  return resolveModuleLabel(projectPath);
}

module.exports = {
  calculateFileHash,
  shouldProcessFile,
  shouldExcludeDir,
  scanDirectory,
  readFileContent,
  getFileMetadata,
  detectProjectType,
  getProjectName,
};
