/**
 * ProposalForge AI — project module training configuration
 */

const path = require('path');
const fs = require('fs');

const PROJECT_ROOT = path.resolve(__dirname, '../../..');
const PROJECT_DISPLAY_NAME = 'ProposalForge AI';

const TRAINING_MODULES = [
  {
    id: 'frontend',
    label: 'ProposalForge AI Frontend',
    relativePath: 'frontend',
    path: path.join(PROJECT_ROOT, 'frontend'),
    type: 'react',
  },
  {
    id: 'backend',
    label: 'ProposalForge AI Backend',
    relativePath: 'backend',
    path: path.join(PROJECT_ROOT, 'backend'),
    type: 'nodejs',
  },
  {
    id: 'python-ai',
    label: 'ProposalForge AI Python AI Service',
    relativePath: 'python-ai',
    path: path.join(PROJECT_ROOT, 'python-ai'),
    type: 'python',
  },
  {
    id: 'templates',
    label: 'ProposalForge AI Templates',
    relativePath: 'templates',
    path: path.join(PROJECT_ROOT, 'templates'),
    type: 'other',
  },
  {
    id: 'docs',
    label: 'ProposalForge AI Documentation',
    relativePath: 'docs',
    path: path.join(PROJECT_ROOT, 'docs'),
    type: 'other',
  },
  {
    id: 'md-docs',
    label: 'ProposalForge AI Documentation',
    relativePath: 'MD Files Documents',
    path: path.join(PROJECT_ROOT, 'MD Files Documents'),
    type: 'other',
  },
];

const MODULE_BY_ID = Object.fromEntries(TRAINING_MODULES.map((m) => [m.id, m]));

function getExistingTrainingModules() {
  return TRAINING_MODULES.filter((m) => fs.existsSync(m.path));
}

function resolveModuleFromPath(filePath) {
  const normalized = path.normalize(filePath);
  for (const mod of TRAINING_MODULES) {
    const modPath = path.normalize(mod.path);
    if (normalized === modPath || normalized.startsWith(modPath + path.sep)) {
      return mod;
    }
  }
  return null;
}

function resolveModuleLabel(filePath) {
  const mod = resolveModuleFromPath(filePath);
  return mod ? mod.label : PROJECT_DISPLAY_NAME;
}

function toRelativeTrainingPath(filePath) {
  const normalized = path.normalize(filePath);
  const root = path.normalize(PROJECT_ROOT);
  if (normalized.startsWith(root + path.sep)) {
    return normalized.slice(root.length + 1).split(path.sep).join('/');
  }
  const mod = resolveModuleFromPath(filePath);
  if (mod) {
    const rel = path.relative(mod.path, filePath).split(path.sep).join('/');
    return `${mod.relativePath}/${rel}`;
  }
  return path.basename(filePath);
}

function isAllowedTrainingPath(filePath) {
  const mod = resolveModuleFromPath(filePath);
  if (!mod) return false;
  const ext = path.extname(filePath).toLowerCase();
  if (['.pdf', '.docx', '.doc'].includes(ext)) return false;
  return true;
}

const PROJECT_SOURCE_QUERY = {
  projectName: { $regex: /^ProposalForge AI/ },
  filepath: { $not: /\.(pdf|docx|doc)$/i },
};

module.exports = {
  PROJECT_ROOT,
  PROJECT_DISPLAY_NAME,
  TRAINING_MODULES,
  MODULE_BY_ID,
  getExistingTrainingModules,
  resolveModuleFromPath,
  resolveModuleLabel,
  toRelativeTrainingPath,
  isAllowedTrainingPath,
  PROJECT_SOURCE_QUERY,
};
