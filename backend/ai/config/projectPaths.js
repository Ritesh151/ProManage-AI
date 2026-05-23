/**
 * Project Paths Configuration
 * ProposalForge AI codebase training paths only
 */

const path = require('path');
const { PROJECT_ROOT, TRAINING_MODULES } = require('./proposalForgeModules');

const PROJECT_PATHS = TRAINING_MODULES.map((m) => m.path);

const SUPPORTED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.py', '.java', '.kt', '.dart',
  '.json', '.md', '.txt',
  '.env', '.example',
  '.yaml', '.yml',
  'package.json', 'pubspec.yaml', 'requirements.txt',
];

const EXCLUDED_DIRS = [
  'node_modules',
  'build',
  'dist',
  '.git',
  'coverage',
  '.lock',
  'bin',
  '.cache',
  '__pycache__',
  '.venv',
  'venv',
  'myenv',
  'logs',
  '.next',
  '.nuxt',
  'out',
  '.gradle',
  'target',
  'Documents',
];

const EXCLUDED_PATTERNS = [
  /\.lock$/,
  /\.log$/,
  /\.tmp$/,
  /\.swp$/,
  /\.swo$/,
  /~$/,
  /\.DS_Store$/,
  /Thumbs\.db$/,
  /\.pdf$/i,
  /\.docx$/i,
  /\.doc$/i,
];

module.exports = {
  PROJECT_ROOT,
  PROJECT_PATHS,
  SUPPORTED_EXTENSIONS,
  EXCLUDED_DIRS,
  EXCLUDED_PATTERNS,
};
