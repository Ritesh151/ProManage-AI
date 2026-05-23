export const parseResponseContent = (content = '') => {
  if (!content || typeof content !== 'string') return null;

  const lines = content.split('\n').map((l) => l.trim()).filter(Boolean);
  const project = { technologies: { frontend: [], backend: [], database: [], tools: [] } };
  let section = null;
  let descLines = [];
  let inDescription = false;

  const techMap = {
    frontend: 'frontend',
    'frontend technologies': 'frontend',
    backend: 'backend',
    'backend technologies': 'backend',
    database: 'database',
    tools: 'tools',
    'other tools': 'tools',
  };

  for (const line of lines) {
    if (/^-{3,}$/.test(line)) continue;

    const kv = line.match(/^([A-Za-z][\w\s]*):\s*(.*)$/);
    if (kv && !inDescription) {
      const key = kv[1].trim().toLowerCase();
      const val = kv[2].trim();
      if (key === 'project') project.projectName = val;
      else if (key === 'status') project.status = val;
      else if (key === 'category') project.category = val;
      else if (key === 'timeline') project.timeline = val;
      else if (key === 'client') project.clientName = val;
      else if (key === 'company') project.companyName = val;
      else if (key === 'cost') project.cost = val.replace(/[₹,]/g, '');
      else if (key === 'branch') project.branch = val;
      else if (key === 'pages') project.numberOfPages = parseInt(val, 10) || val;
      else if (key === 'technologies' || key === 'technology') {
        section = null;
        if (val && val !== '—' && val !== '--') section = 'tech_header';
      } else if (key === 'features' || key === 'feature') {
        section = 'features';
      } else if (key === 'scope') {
        section = 'scope';
      } else if (key === 'description') {
        inDescription = true;
        if (val) descLines.push(val);
      }
      continue;
    }

    if (inDescription) {
      descLines.push(line);
      continue;
    }

    const lower = line.toLowerCase();
    if (techMap[lower]) {
      section = techMap[lower];
      continue;
    }

    if (lower === 'features') {
      section = 'features';
      project.features = project.features || [];
      continue;
    }
    if (lower === 'scope' || lower === 'scope of work') {
      section = 'scope';
      project.scopeOfWork = project.scopeOfWork || [];
      continue;
    }
    if (lower === 'description') {
      inDescription = true;
      continue;
    }

    if (section === 'frontend') project.technologies.frontend.push(line);
    else if (section === 'backend') project.technologies.backend.push(line);
    else if (section === 'database') project.technologies.database.push(line);
    else if (section === 'tools') project.technologies.tools.push(line);
    else if (section === 'features') {
      project.features = project.features || [];
      project.features.push(line.replace(/^-\s*/, ''));
    } else if (section === 'scope') {
      project.scopeOfWork = project.scopeOfWork || [];
      project.scopeOfWork.push(line.replace(/^-\s*/, ''));
    } else if (line.startsWith('- ')) {
      const item = line.slice(2).trim();
      if (section === 'scope') project.scopeOfWork.push(item);
      else if (section === 'features') project.features.push(item);
    }
  }

  if (descLines.length) {
    project.description = descLines.join('\n');
    project.summary = project.description;
  }

  if (!project.projectName) return null;
  return project;
};

export const shouldRenderStructured = (message) => {
  if (message.data?.project?.projectName) return true;
  if (message.data?.projects?.length > 0) return true;
  if (message.responseType === 'project_list') return true;
  const fmt = message.format;
  if (['project_details', 'technologies', 'proposal', 'project_proposal', 'project_cost', 'project_scope', 'project_status'].includes(fmt)) return true;
  if (message.content?.includes('Project:') && message.content?.includes('---')) return true;
  if (message.content?.match(/^Project:\s*.+/m)) return true;
  return false;
};
