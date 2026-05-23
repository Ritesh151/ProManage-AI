/**
 * In-memory project cache — TTL 10 minutes
 */

const Project = require('../../models/Project');

const TTL_MS = 10 * 60 * 1000;

class AIProjectCache {
  constructor() {
    this.listCache = null;
    this.listExpiresAt = 0;
    this.projectById = new Map();
    this.projectByName = new Map();
    this.idExpiresAt = new Map();
  }

  _isExpired(ts) {
    return !ts || Date.now() > ts;
  }

  async warmList() {
    if (this.listCache && !this._isExpired(this.listExpiresAt)) {
      return this.listCache;
    }

    const projects = await Project.find({})
      .select('projectName projectId status cost clientName companyName category timeline technologies scopeOfWork features customFeatures branch numberOfPages description summary projectDetails proposalGenerated')
      .lean();

    this.listCache = projects;
    this.listExpiresAt = Date.now() + TTL_MS;

    for (const p of projects) {
      const id = p._id?.toString();
      if (id) {
        this.projectById.set(id, p);
        this.idExpiresAt.set(id, this.listExpiresAt);
      }
      if (p.projectName) {
        this.projectByName.set(p.projectName.toLowerCase(), p);
      }
    }

    return projects;
  }

  async getList() {
    return this.warmList();
  }

  async getById(id) {
    if (!id) return null;
    const key = id.toString();
    if (this.projectById.has(key) && !this._isExpired(this.idExpiresAt.get(key))) {
      return this.projectById.get(key);
    }
    const p = await Project.findById(key).lean();
    if (p) {
      this.projectById.set(key, p);
      this.idExpiresAt.set(key, Date.now() + TTL_MS);
    }
    return p || null;
  }

  async getByExactName(name) {
    await this.warmList();
    const key = (name || '').toLowerCase().trim();
    if (!key) return null;
    const direct = this.projectByName.get(key);
    if (direct) return direct;

    const { normalizeProjectName } = require('./AIProjectResolver');
    const norm = normalizeProjectName(name);
    if (!norm) return null;

    for (const p of this.listCache || []) {
      if (normalizeProjectName(p.projectName) === norm) return p;
    }
    return null;
  }

  invalidate() {
    this.listCache = null;
    this.listExpiresAt = 0;
    this.projectById.clear();
    this.projectByName.clear();
    this.idExpiresAt.clear();
  }
}

module.exports = new AIProjectCache();
