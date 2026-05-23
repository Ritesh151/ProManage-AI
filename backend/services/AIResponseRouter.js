const { formatCurrency } = require('../utils/currencyFormatter');

class AIResponseRouter {
  formatCost(project) {
    if (!project?.projectName) return this._fallback();
    const lines = [
      '------------------------------------------------',
      `Project: ${project.projectName}`,
      `Cost: ${project.cost != null ? this._formatCurrency(project.cost) : '—'}`,
      `Category: ${project.category || project.projectCategory?.name || '—'}`,
      `Timeline: ${project.timeline || '—'}`,
      `Status: ${project.status || '—'}`,
      '------------------------------------------------',
    ];
    return lines.join('\n');
  }

  formatProjectDetails(project) {
    if (!project?.projectName) return this._fallback();
    const lines = [
      '------------------------------------------------',
      `Project: ${project.projectName}`,
      `Status: ${project.status || '—'}`,
      `Category: ${project.category || project.projectCategory?.name || '—'}`,
      `Timeline: ${project.timeline || '—'}`,
      `Client: ${project.clientName || '—'}`,
      `Company: ${project.companyName || '—'}`,
      `Cost: ${this._formatCurrency(project.cost)}`,
      '------------------------------------------------',
    ];
    if (project.branch) lines.splice(7, 0, `Branch: ${project.branch}`);
    if (project.numberOfPages != null) lines.splice(8, 0, `Pages: ${project.numberOfPages}`);
    const features = [...(project.features || []), ...(project.customFeatures || [])];
    if (features.length) lines.push('', 'Features:', ...features.map(f => `- ${f}`));
    if (project.scopeOfWork?.length) lines.push('', 'Scope:', ...project.scopeOfWork.map(s => `- ${s}`));
    const desc = project.description || project.summary || project.projectDetails;
    if (desc) lines.push('', 'Description:', desc);
    return lines.join('\n');
  }

  formatTechnologies(project, layer = null) {
    if (!project?.projectName) return this._fallback();
    const tech = project.technologies || {};
    const layers = {
      frontend: ['Frontend Technologies', tech.frontend],
      backend: ['Backend Technologies', tech.backend],
      database: ['Database', tech.database],
    };
    if (layer && layers[layer]) {
      const [label, items] = layers[layer];
      if (!items?.length) return `No verified ${label.toLowerCase()} for **${project.projectName}**.`;
      return [
        '------------------------------------------------',
        `Project: ${project.projectName}`,
        '------------------------------------------------',
        '',
        `${label}:`,
        ...items,
        '------------------------------------------------',
      ].join('\n');
    }
    const allLayers = [
      ['Frontend Technologies', tech.frontend],
      ['Backend Technologies', tech.backend],
      ['Database', tech.database],
    ];
    const lines = [
      '------------------------------------------------',
      `Project: ${project.projectName}`,
      '------------------------------------------------',
      '',
    ];
    let hasAny = false;
    for (const [label, items] of allLayers) {
      if (items?.length) {
        hasAny = true;
        lines.push(`${label}:`, ...items, '');
      }
    }
    if (!hasAny) {
      return [
        '------------------------------------------------',
        `Project: ${project.projectName}`,
        '------------------------------------------------',
        '',
        'No technologies have been stored for this project.',
        '------------------------------------------------',
      ].join('\n');
    }
    lines.push('------------------------------------------------');
    return lines.join('\n');
  }

  formatProposal(project) {
    if (!project?.projectName) return this._fallback();
    const lines = [
      `# Proposal — ${project.projectName}`,
      '',
      `**Client:** ${project.clientName || '—'}`,
      `**Company:** ${project.companyName || '—'}`,
      `**Category:** ${project.category || '—'}`,
      `**Status:** ${project.status || '—'}`,
      `**Timeline:** ${project.timeline || '—'}`,
      `**Cost:** ${this._formatCurrency(project.cost)}`,
      '',
      '## Scope of Work',
      ...(project.scopeOfWork?.length ? project.scopeOfWork.map(s => `- ${s}`) : ['- —']),
    ];
    const desc = project.description || project.summary || project.projectDetails;
    if (desc) lines.push('', '## Description', desc);
    const tech = project.technologies || {};
    if (tech.frontend?.length || tech.backend?.length || tech.database?.length || tech.other?.length) {
      lines.push('', '## Technologies');
      if (tech.frontend?.length) lines.push(`**Frontend:** ${tech.frontend.join(', ')}`);
      if (tech.backend?.length) lines.push(`**Backend:** ${tech.backend.join(', ')}`);
      if (tech.database?.length) lines.push(`**Database:** ${tech.database.join(', ')}`);
    }
    return lines.join('\n');
  }

  formatStatus(project) {
    if (!project?.projectName) return this._fallback();
    return `**${project.projectName}** — Status: **${project.status || '—'}**`;
  }

  formatTimeline(project) {
    if (!project?.projectName) return this._fallback();
    return `**${project.projectName}** — Timeline: **${project.timeline || '—'}**`;
  }

  formatClient(project) {
    if (!project?.projectName) return this._fallback();
    return `**${project.projectName}** — Client: **${project.clientName || '—'}**`;
  }

  formatScope(project) {
    if (!project?.projectName) return this._fallback();
    if (!project.scopeOfWork?.length) return `No verified scope for **${project.projectName}**.`;
    return [`**${project.projectName}** — Scope:`, ...project.scopeOfWork.map(s => `- ${s}`)].join('\n');
  }

  formatFeatures(project) {
    if (!project?.projectName) return this._fallback();
    const feats = [...(project.features || []), ...(project.customFeatures || [])];
    if (!feats.length) return `No verified features for **${project.projectName}**.`;
    return [`**${project.projectName}** — Features:`, ...feats.map(f => `- ${f}`)].join('\n');
  }

  formatPages(project) {
    if (!project?.projectName) return this._fallback();
    if (project.numberOfPages == null) return `No verified page count for **${project.projectName}**.`;
    return `**${project.projectName}** — Pages: **${project.numberOfPages}**`;
  }

  formatClientProjects(label, projects) {
    if (!projects?.length) return { content: this._fallback(), format: 'error', verified: false };
    return {
      content: `Found **${projects.length}** verified project(s)${label ? ` for **${label}**` : ''}:`,
      format: 'project_cards',
      data: { projects },
      verified: true,
    };
  }

  formatRecentProjects(label, projects) {
    if (!projects?.length) return { content: this._fallback(), format: 'error', verified: false };
    const lines = [`📁 ${label === 'Found' ? `Projects Found: ${projects.length}` : `${label} Projects`}`, ''];
    projects.forEach((p, i) => {
      lines.push(`${i + 1}.`);
      lines.push(`Project:\n${p.projectName}`);
      lines.push(`Client:\n${p.clientName || '—'}`);
      lines.push(`Status:\n${p.status || '—'}`);
      lines.push(`Category:\n${p.category || '—'}`);
      lines.push(`Cost:\n${this._formatCurrency(p.cost)}`);
      if (i < projects.length - 1) lines.push('', '--------------------------------', '');
    });
    return {
      content: lines.join('\n'),
      format: 'markdown',
      data: { projects },
      responseType: 'project_list',
      verified: true,
    };
  }

  formatConfirm(suggestions) {
    const names = suggestions.filter(Boolean).slice(0, 3);
    if (!names.length) return this._fallback();
    return names.map(n => `Did you mean Project ${n}?`).join('\n\n');
  }

  route(intent, project, entities = {}) {
    const contentMap = {
      project_cost: () => this.formatCost(project),
      project_details: () => this.formatProjectDetails(project),
      project_proposal: () => this.formatProposal(project),
      project_scope: () => this.formatScope(project),
      project_status: () => this.formatStatus(project),
      project_timeline: () => this.formatTimeline(project),
      project_client: () => this.formatClient(project),
      project_features: () => this.formatFeatures(project),
      project_pages: () => this.formatPages(project),
    };

    const handler = contentMap[intent];
    if (handler) {
      return {
        intent,
        format: 'markdown',
        content: handler(),
        verified: true,
      };
    }

    if (['project_technologies', 'frontend_technology', 'backend_technology', 'database_technology'].includes(intent)) {
      const layer = intent === 'frontend_technology' ? 'frontend'
        : intent === 'backend_technology' ? 'backend'
        : intent === 'database_technology' ? 'database' : null;
      return {
        intent,
        format: 'technologies',
        content: this.formatTechnologies(project, layer),
        data: { project, technologies: this._getTech(project) },
        verified: true,
      };
    }

    return {
      intent: 'project_details',
      format: 'markdown',
      content: this.formatProjectDetails(project),
      verified: true,
    };
  }

  _getTech(project) {
    const t = project?.technologies || {};
    return {
      frontend: t.frontend || [],
      backend: t.backend || [],
      database: t.database || [],
      other: t.other || [],
    };
  }

  _formatCurrency(cost) {
    if (cost == null) return '—';
    return formatCurrency(cost);
  }

  _fallback() {
    return "I couldn't find verified project data.";
  }
}

module.exports = new AIResponseRouter();
