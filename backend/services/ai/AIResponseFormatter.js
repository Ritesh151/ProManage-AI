/**
 * Verified response formatting — no invented data
 */

const { formatCurrency } = require('../../utils/currencyFormatter');
const FALLBACK = "I couldn't find verified project data.";
const NOT_TRAINED = "I'm not trained for this question yet, please try again later.";

class AIResponseFormatter {
  fallback() {
    return FALLBACK;
  }

  formatCurrency(cost) {
    if (cost == null) return '—';
    return formatCurrency(cost);
  }

  normalizeTech(project) {
    const t = project?.technologies || {};
    return {
      frontend: t.frontend || [],
      backend: t.backend || [],
      database: t.database || [],
      tools: t.tools || t.other || [],
    };
  }

  formatTechBlock(project) {
    const tech = this.normalizeTech(project);
    const lines = [];
    if (tech.frontend?.length) lines.push('Frontend Technologies:', ...tech.frontend);
    if (tech.backend?.length) lines.push('Backend Technologies:', ...tech.backend);
    if (tech.database?.length) lines.push('Database:', ...tech.database);
    if (tech.tools?.length) lines.push('Other Tools:', ...tech.tools);
    return lines.length ? lines : ['Technologies:', '—'];
  }

  formatFullProject(project) {
    if (!project?.projectName) return FALLBACK;

    const lines = [
      '------------------------------------------------',
      `Project: ${project.projectName}`,
      `Status: ${project.status || '—'}`,
      `Category: ${project.category || project.projectCategory?.name || '—'}`,
      `Timeline: ${project.timeline || '—'}`,
      `Client: ${project.clientName || '—'}`,
      `Company: ${project.companyName || '—'}`,
      `Cost: ${this.formatCurrency(project.cost)}`,
      '------------------------------------------------',
      '',
      'Technologies:',
      ...this.formatTechBlock(project).slice(1),
      '------------------------------------------------',
    ];

    if (project.branch) lines.splice(8, 0, `Branch: ${project.branch}`);
    if (project.numberOfPages != null) lines.splice(9, 0, `Pages: ${project.numberOfPages}`);
    if (project.features?.length) {
      lines.push('', 'Features:', ...project.features.map((f) => `- ${f}`));
    }
    if (project.scopeOfWork?.length) {
      lines.push('', 'Scope:', ...project.scopeOfWork.map((s) => `- ${s}`));
    }

    const desc = project.description || project.summary || project.projectDetails;
    if (desc) lines.push('', 'Description:', desc);

    return lines.join('\n');
  }

  formatProjectDetails(project) {
    return this.formatFullProject(project);
  }

  formatTechnologies(project, layer = null) {
    if (!project?.projectName) return FALLBACK;

    const tech = this.normalizeTech(project);
    const layers = {
      frontend: ['Frontend Technologies', tech.frontend],
      backend: ['Backend Technologies', tech.backend],
      database: ['Database', tech.database],
      tools: ['Other Tools', tech.tools],
    };

    if (layer && layers[layer]) {
      const [label, items] = layers[layer];
      if (!items?.length) {
        return `No verified ${label.toLowerCase()} for **${project.projectName}**.`;
      }
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

    const lines = [
      '------------------------------------------------',
      `Project: ${project.projectName}`,
      '------------------------------------------------',
      '',
    ];
    let hasAny = false;
    for (const [label, items] of [
      ['Frontend Technologies', tech.frontend],
      ['Backend Technologies', tech.backend],
      ['Database', tech.database],
      ['Other Tools', tech.tools],
    ]) {
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
    if (!project?.projectName) return FALLBACK;

    const base = [
      `# Proposal — ${project.projectName}`,
      '',
      `**Client:** ${project.clientName || '—'}`,
      `**Company:** ${project.companyName || '—'}`,
      `**Category:** ${project.category || '—'}`,
      `**Status:** ${project.status || '—'}`,
      `**Timeline:** ${project.timeline || '—'}`,
      `**Cost:** ${this.formatCurrency(project.cost)}`,
      '',
      '## Scope of Work',
      ...(project.scopeOfWork?.length ? project.scopeOfWork.map((s) => `- ${s}`) : ['- —']),
      '',
    ];

    const desc = project.description || project.summary || project.projectDetails;
    if (desc) base.push('## Description', desc, '');

    base.push('## Technologies (verified)');
    const t = project.technologies || {};
    if (t.frontend?.length) base.push(`**Frontend:** ${t.frontend.join(', ')}`);
    if (t.backend?.length) base.push(`**Backend:** ${t.backend.join(', ')}`);
    if (t.database?.length) base.push(`**Database:** ${t.database.join(', ')}`);
    if (t.other?.length) base.push(`**Tools:** ${t.other.join(', ')}`);
    if (!Object.values(t).some((a) => a?.length)) base.push('_No technologies on file._');

    base.push('', '---', '_Export PDF from Proposal page using stored data._');
    return base.join('\n');
  }

  formatCost(project) {
    if (!project?.projectName) return FALLBACK;
    const lines = [
      '------------------------------------------------',
      `Project: ${project.projectName}`,
      `Cost: ${project.cost != null ? this.formatCurrency(project.cost) : '—'}`,
      `Category: ${project.category || project.projectCategory?.name || '—'}`,
      `Timeline: ${project.timeline || '—'}`,
      `Status: ${project.status || '—'}`,
      '------------------------------------------------',
    ];
    if (project.cost == null) {
      lines[2] = 'Cost: No verified cost recorded in database';
    }
    return lines.join('\n');
  }

  formatStatus(project) {
    if (!project?.projectName) return FALLBACK;
    if (!project.status) return `No verified status for **${project.projectName}**.`;
    return `**${project.projectName}** — Status: **${project.status}**`;
  }

  formatTimeline(project) {
    if (!project?.projectName) return FALLBACK;
    if (!project.timeline) return `No verified timeline for **${project.projectName}**.`;
    return `**${project.projectName}** — Timeline: **${project.timeline}**`;
  }

  formatCategory(project) {
    if (!project?.projectName) return FALLBACK;
    const cat = project.category || project.projectCategory?.name;
    if (!cat) return `No verified category for **${project.projectName}**.`;
    return `**${project.projectName}** — Category: **${cat}**`;
  }

  formatClient(project) {
    if (!project?.projectName) return FALLBACK;
    return `**${project.projectName}** — Client: **${project.clientName || '—'}**`;
  }

  formatCompany(project) {
    if (!project?.projectName) return FALLBACK;
    return `**${project.projectName}** — Company: **${project.companyName || '—'}**`;
  }

  formatBranch(project) {
    if (!project?.projectName) return FALLBACK;
    if (!project.branch) return `No verified branch for **${project.projectName}**.`;
    return `**${project.projectName}** — Branch: **${project.branch}**`;
  }

  formatFeatures(project) {
    if (!project?.projectName) return FALLBACK;
    const feats = [...(project.features || []), ...(project.customFeatures || [])];
    if (!feats.length) return `No verified features for **${project.projectName}**.`;
    return [`**${project.projectName}** — Features:`, ...feats.map((f) => `- ${f}`)].join('\n');
  }

  formatPages(project) {
    if (!project?.projectName) return FALLBACK;
    if (project.numberOfPages == null) return `No verified page count for **${project.projectName}**.`;
    return `**${project.projectName}** — Pages: **${project.numberOfPages}**`;
  }

  formatScope(project) {
    if (!project?.projectName) return FALLBACK;
    if (!project.scopeOfWork?.length) return `No verified scope for **${project.projectName}**.`;
    return [`**${project.projectName}** — Scope:`, ...project.scopeOfWork.map((s) => `- ${s}`)].join('\n');
  }

  formatKnowledge(entries) {
    if (!entries?.length) return FALLBACK;
    return entries.map((k) => `## ${k.title}\n\n${k.content}`).join('\n\n---\n\n');
  }

  formatClientProjects(label, projects) {
    if (!projects?.length) return { content: FALLBACK, format: 'error', verified: false };
    return {
      content: `Found **${projects.length}** verified project(s)${label ? ` for **${label}**` : ''}:`,
      format: 'project_cards',
      data: { projects },
      verified: true,
    };
  }

  formatConfirm(suggestions) {
    const names = suggestions.filter(Boolean).slice(0, 3);
    if (!names.length) return FALLBACK;
    return names.map((n) => `Did you mean Project ${n}?`).join('\n\n');
  }

  techSections(project, layer = null) {
    const tech = this.normalizeTech(project);
    const all = [
      { label: 'Frontend Technologies', items: tech.frontend, key: 'frontend' },
      { label: 'Backend Technologies', items: tech.backend, key: 'backend' },
      { label: 'Database', items: tech.database, key: 'database' },
      { label: 'Other Tools', items: tech.tools, key: 'tools' },
    ];
    const filtered = layer ? all.filter((s) => s.key === layer) : all;
    return filtered.filter((s) => s.items?.length).map(({ label, items }) => ({ label, items }));
  }

  getFollowUpSuggestions(project, lastIntent) {
    if (!project?.projectName) return [];
    const name = project.projectName;
    const base = [
      `What technologies are used in ${name}?`,
      `What is the cost of ${name}?`,
      `What is the status of ${name}?`,
      `Show proposal for ${name}`,
    ];
    const map = {
      project_details: [`What technologies are used in ${name}?`, `What is the cost of ${name}?`],
      project_technologies: [`Show details of ${name}`, `What is the scope of ${name}?`],
      project_cost: [`Show details of ${name}`, `What technologies are used in ${name}?`],
    };
    return (map[lastIntent] || base).slice(0, 4);
  }
}

module.exports = new AIResponseFormatter();
module.exports.FALLBACK = FALLBACK;
module.exports.NOT_TRAINED = NOT_TRAINED;
