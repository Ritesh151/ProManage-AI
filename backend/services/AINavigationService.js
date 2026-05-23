const PAGE_MAP = {
  dashboard: { route: '/', label: 'Dashboard' },
  home: { route: '/', label: 'Dashboard' },
  projects: { route: '/projects', label: 'Projects' },
  'project list': { route: '/projects', label: 'Projects' },
  proposal: { route: '/proposal', label: 'Proposal' },
  scope: { route: '/scope-work', label: 'Scope of Work' },
  'scope of work': { route: '/scope-work', label: 'Scope of Work' },
  analytics: { route: '/analytics', label: 'Analytics' },
  export: { route: '/export-center', label: 'Export Center' },
  'export center': { route: '/export-center', label: 'Export Center' },
  training: { route: '/training', label: 'Training Center' },
  'training center': { route: '/training', label: 'Training Center' },
  'ai training': { route: '/training', label: 'Training Center' },
  settings: { route: '/settings', label: 'Settings' },
  'ai assistant': { route: '/ai', label: 'AI Assistant' },
  ai: { route: '/ai', label: 'AI Assistant' },
  chat: { route: '/ai', label: 'AI Assistant' },
  help: { route: '/ai', label: 'AI Assistant' },
  'project details': { route: '/projects', label: 'Projects' },
};

const NAVIGATION_PHRASES = [
  /^(?:take|bring|lead|direct)\s+(?:me\s+)?(?:to|into)\s+(.+)/i,
  /^(?:go|move|jump|switch|head)\s+(?:to|over\s+to|into)\s+(.+)/i,
  /^(?:open|launch)\s+(?:the\s+)?(?:page\s+)?(.+?)(?:\s+page)?$/i,
  /^(?:navigate|redirect)\s+(?:to|me\s+to)?\s*(.+)/i,
  /^(?:i want|i need)\s+(?:to\s+)?(?:go|navigate)\s+(?:to\s+)?(.+)/i,
  /^(?:show|take)\s+me\s+(?:to\s+)?(.+)/i,
];

class AINavigationService {
  detectPage(query) {
    if (!query) return null;

    const q = query.toLowerCase().trim();

    for (const phrase of NAVIGATION_PHRASES) {
      const m = q.match(phrase);
      if (m?.[1]) {
        const page = m[1].replace(/\s+page$/i, '').trim();
        return this._resolvePage(page);
      }
    }

    return null;
  }

  _resolvePage(text) {
    const t = text.toLowerCase().trim();

    for (const [key, info] of Object.entries(PAGE_MAP)) {
      if (t === key || t.includes(key)) {
        return {
          responseType: 'navigation',
          page: key,
          route: info.route,
          message: `Opening ${info.label} page`,
          content: `🔄 *${info.label}*\n\nOpening **${info.label}** page...`,
          format: 'markdown',
        };
      }
    }

    return null;
  }

  getPageMap() {
    return PAGE_MAP;
  }
}

module.exports = new AINavigationService();
