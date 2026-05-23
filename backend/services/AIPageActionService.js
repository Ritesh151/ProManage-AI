class AIPageActionService {
  getPageActions() {
    return {
      dashboard: [
        { label: 'View Project Analytics', query: 'Show project statistics' },
        { label: 'Recent Projects', query: 'Show all recent projects' },
        { label: 'Revenue Insights', query: 'Show revenue insights' },
      ],
      projects: [
        { label: 'All Projects', query: 'Show all projects' },
        { label: 'Active Projects', query: 'Show active projects' },
        { label: 'Recent Projects', query: 'Show recent projects' },
      ],
      proposal: [
        { label: 'Generate Proposal', query: 'Generate proposal for AI Agent' },
        { label: 'Export PDF', query: 'How to export PDF' },
      ],
      analytics: [
        { label: 'Project Statistics', query: 'Show project statistics' },
        { label: 'Budget Analysis', query: 'Show budget analysis' },
      ],
      export: [
        { label: 'PDF Export', query: 'How was PDF export implemented?' },
        { label: 'Excel Export', query: 'Excel export workflow' },
      ],
      training: [
        { label: 'Start Training', query: 'Start AI training' },
        { label: 'Training Status', query: 'Show training status' },
      ],
      settings: [
        { label: 'Configuration', query: 'Show settings' },
      ],
      ai: [
        { label: 'Ask Question', query: 'Show all projects' },
        { label: 'Help', query: 'What can you help me with' },
      ],
    };
  }

  getActionsForPage(page) {
    const actions = this.getPageActions();
    return actions[page] || [];
  }
}

module.exports = new AIPageActionService();
