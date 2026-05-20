/**
 * Project Paths Configuration
 * Defines where the AI system should scan for projects
 */

const path = require('path');
const os = require('os');

// Define all project paths to scan
const PROJECT_PATHS = [
  // Current project
  path.join(__dirname, '../../..'),
  
  // Common project directories (customize based on your system)
  path.join(os.homedir(), 'Projects'),
  path.join(os.homedir(), 'Development'),
  path.join(os.homedir(), 'Code'),
  
  // Windows paths (if applicable)
  ...(process.platform === 'win32' ? [
    'D:\\Projects',
    'C:\\Projects',
    'E:\\Development',
  ] : []),
  
  // Linux/Mac paths
  ...(process.platform !== 'win32' ? [
    path.join(os.homedir(), 'projects'),
    path.join(os.homedir(), 'dev'),
  ] : []),
];

// File extensions to include in scanning
const SUPPORTED_EXTENSIONS = [
  '.js', '.jsx', '.ts', '.tsx',
  '.py', '.java', '.kt', '.dart',
  '.json', '.md', '.txt',
  '.env', '.example',
  '.pdf', '.docx',
  'package.json', 'pubspec.yaml', 'requirements.txt',
];

// Directories to exclude from scanning
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
  '.next',
  '.nuxt',
  'out',
  '.gradle',
  'target',
];

// File patterns to exclude
const EXCLUDED_PATTERNS = [
  /\.lock$/,
  /\.log$/,
  /\.tmp$/,
  /\.swp$/,
  /\.swo$/,
  /~$/,
  /\.DS_Store$/,
  /Thumbs\.db$/,
];

module.exports = {
  PROJECT_PATHS,
  SUPPORTED_EXTENSIONS,
  EXCLUDED_DIRS,
  EXCLUDED_PATTERNS,
};
