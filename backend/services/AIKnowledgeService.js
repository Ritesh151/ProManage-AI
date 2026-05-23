const ProjectKnowledge = require('../models/ProjectKnowledge');
const Project = require('../models/Project');
const AIEmbeddingService = require('./AIEmbeddingService');

class AIKnowledgeService {
  async clearKnowledge() {
    await ProjectKnowledge.deleteMany({});
  }

  async indexProject(project) {
    if (!project || !project._id) return [];
    const chunks = [];
    const p = project;

    const buildChunks = () => {
      const entries = [];

      if (p.projectName) {
        entries.push({ type: 'overview', content: `Project name is ${p.projectName}` });
      }

      if (p.description || p.summary || p.projectDetails) {
        const desc = p.description || p.summary || p.projectDetails;
        entries.push({ type: 'description', content: desc });
      }

      if (p.cost != null) {
        entries.push({ type: 'cost', content: `Project ${p.projectName} cost is ${p.cost}` });
      }

      if (p.status) {
        entries.push({ type: 'overview', content: `Project ${p.projectName} status is ${p.status}` });
      }

      if (p.timeline) {
        entries.push({ type: 'timeline', content: `Project ${p.projectName} timeline is ${p.timeline}` });
      }

      if (p.clientName) {
        entries.push({ type: 'client', content: `Project ${p.projectName} client is ${p.clientName}` });
      }

      if (p.companyName) {
        entries.push({ type: 'client', content: `Project ${p.projectName} company is ${p.companyName}` });
      }

      if (p.category || p.projectCategory?.name) {
        entries.push({ type: 'overview', content: `Project ${p.projectName} category is ${p.category || p.projectCategory.name}` });
      }

      const tech = p.technologies || {};
      if (tech.frontend?.length || tech.backend?.length || tech.database?.length || tech.other?.length) {
        const parts = [];
        if (tech.frontend?.length) parts.push(`Frontend: ${tech.frontend.join(', ')}`);
        if (tech.backend?.length) parts.push(`Backend: ${tech.backend.join(', ')}`);
        if (tech.database?.length) parts.push(`Database: ${tech.database.join(', ')}`);
        if (tech.other?.length) parts.push(`Other: ${tech.other.join(', ')}`);
        entries.push({ type: 'technologies', content: `Project ${p.projectName} uses ${parts.join('. ')}` });
      }

      const proposalData = {
        clientName: p.clientName,
        companyName: p.companyName,
        category: p.category,
        status: p.status,
        timeline: p.timeline,
        cost: p.cost,
        scopeOfWork: p.scopeOfWork,
        features: p.features,
        description: p.description || p.summary || p.projectDetails,
        technologies: p.technologies,
      };
      const proposalParts = Object.entries(proposalData).filter(([, v]) => v != null && (typeof v !== 'object' || (Array.isArray(v) ? v.length : Object.keys(v).length)));
      if (proposalParts.length) {
        entries.push({ type: 'proposal', content: `Proposal for ${p.projectName}: ${JSON.stringify(proposalData)}` });
      }

      if (p.scopeOfWork?.length) {
        entries.push({ type: 'scope', content: `Scope of work for ${p.projectName}: ${p.scopeOfWork.join(', ')}` });
      }

      if (p.features?.length || p.customFeatures?.length) {
        const allFeatures = [...(p.features || []), ...(p.customFeatures || [])];
        entries.push({ type: 'features', content: `Features of ${p.projectName}: ${allFeatures.join(', ')}` });
      }

      if (p.branch) {
        entries.push({ type: 'overview', content: `Project ${p.projectName} branch is ${p.branch}` });
      }

      if (p.numberOfPages != null) {
        entries.push({ type: 'overview', content: `Project ${p.projectName} has ${p.numberOfPages} pages` });
      }

      return entries;
    };

    const entries = buildChunks();

    for (let i = 0; i < entries.length; i++) {
      const entry = entries[i];
      const embedding = AIEmbeddingService.generateEmbedding(entry.content);
      const tokens = entry.content.toLowerCase().match(/\b\w+\b/g) || [];
      const stopWords = new Set(['the', 'a', 'an', 'is', 'are', 'was', 'were', 'in', 'on', 'at', 'to', 'of', 'for', 'and', 'or', 'with', 'this', 'that', 'it', 'its']);
      const keywords = [...new Set(tokens.filter(t => t.length > 2 && !stopWords.has(t)))];

      const knowledgeDoc = {
        projectId: p._id,
        projectName: p.projectName,
        knowledgeType: entry.type,
        content: entry.content,
        chunkIndex: i,
        embedding,
        tokens,
        keywords,
        metadata: {
          category: p.category || p.projectCategory?.name,
          status: p.status,
          clientName: p.clientName,
          companyName: p.companyName,
          cost: p.cost,
          frontend: (p.technologies?.frontend || []),
          backend: (p.technologies?.backend || []),
          database: (p.technologies?.database || []),
          other: (p.technologies?.other || []),
          scopeOfWork: p.scopeOfWork || [],
          features: [...(p.features || []), ...(p.customFeatures || [])],
          timeline: p.timeline,
        },
      };

      chunks.push(knowledgeDoc);
    }

    if (chunks.length > 0) {
      await ProjectKnowledge.deleteMany({ projectId: p._id });
      await ProjectKnowledge.insertMany(chunks);
    }

    return chunks;
  }

  async searchSimilar(queryEmbedding, limit = 10) {
    const allDocs = await ProjectKnowledge.find({ embedding: { $exists: true, $not: { $size: 0 } } }).lean();
    const scored = allDocs.map(doc => {
      const similarity = AIEmbeddingService.cosineSimilarity(queryEmbedding, doc.embedding);
      return { ...doc, similarity };
    });
    return scored.sort((a, b) => b.similarity - a.similarity).slice(0, limit);
  }

  async searchByKeywords(keywords, limit = 10) {
    if (!keywords || !keywords.length) return [];
    const regexps = keywords.map(k => new RegExp(k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'i'));
    return ProjectKnowledge.find({
      $or: [
        { keywords: { $in: keywords } },
        { tokens: { $in: keywords } },
        ...regexps.map(r => ({ content: r })),
      ],
    }).limit(limit).lean();
  }

  async getProjectKnowledge(projectName) {
    return ProjectKnowledge.find({ projectName }).sort({ chunkIndex: 1 }).lean();
  }

  async getStats() {
    const [totalDocs, byType, projects] = await Promise.all([
      ProjectKnowledge.countDocuments(),
      ProjectKnowledge.aggregate([
        { $group: { _id: '$knowledgeType', count: { $sum: 1 } } },
      ]),
      ProjectKnowledge.distinct('projectName'),
    ]);
    return { totalDocs, byType, totalProjects: projects.length };
  }
}

module.exports = new AIKnowledgeService();
