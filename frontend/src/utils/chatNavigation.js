const PAGE_MAP = {
  dashboard: { route: '/', label: 'Dashboard' },
  home: { route: '/', label: 'Dashboard' },
  projects: { route: '/projects', label: 'Projects' },
  proposal: { route: '/proposal', label: 'Proposal' },
  scope: { route: '/scope-work', label: 'Scope of Work' },
  analytics: { route: '/analytics', label: 'Analytics' },
  export: { route: '/export-center', label: 'Export Center' },
  training: { route: '/training', label: 'Training Center' },
  settings: { route: '/settings', label: 'Settings' },
  ai: { route: '/ai', label: 'AI Assistant' },
  'ai assistant': { route: '/ai', label: 'AI Assistant' },
};

const NAVIGATION_PHRASES = [
  /^(?:take|bring|lead|direct)\s+(?:me\s+)?(?:to|into)\s+(.+)/i,
  /^(?:go|move|jump|switch|head)\s+(?:to|over\s+to|into)\s+(.+)/i,
  /^(?:open|launch)\s+(?:the\s+)?(?:page\s+)?(.+?)(?:\s+page)?$/i,
  /^(?:navigate|redirect)\s+(?:to|me\s+to)?\s*(.+)/i,
  /^(?:i want|i need)\s+(?:to\s+)?(?:go|navigate)\s+(?:to\s+)?(.+)/i,
  /^(?:show|take)\s+me\s+(?:to\s+)?(.+)/i,
];

export function detectNavigationIntent(text) {
  if (!text) return null;
  const q = text.toLowerCase().trim();

  if (q in PAGE_MAP) {
    const info = PAGE_MAP[q];
    return {
      responseType: 'navigation',
      route: info.route,
      message: `Opening ${info.label} page`,
    };
  }

  for (const phrase of NAVIGATION_PHRASES) {
    const m = q.match(phrase);
    if (m?.[1]) {
      const page = m[1].replace(/\s+page$/i, '').trim();
      const info = Object.values(PAGE_MAP).find(
        (v) => page === v.route || page.includes(v.route.replace('/', ''))
      );
      if (info) {
        return {
          responseType: 'navigation',
          route: info.route,
          message: `Opening ${info.label} page`,
        };
      }
      for (const [key, info] of Object.entries(PAGE_MAP)) {
        if (page === key || page.includes(key) || key.includes(page)) {
          return {
            responseType: 'navigation',
            route: info.route,
            message: `Opening ${info.label} page`,
          };
        }
      }
    }
  }

  return null;
}

export function getPageLabel(route) {
  for (const info of Object.values(PAGE_MAP)) {
    if (info.route === route) return info.label;
  }
  return null;
}

export function getPageMap() {
  return { ...PAGE_MAP };
}
