/**
 * AI Knowledge Service
 * Provides knowledge base data from MongoDB AIDocument collection
 */

const AIDocument = require('../models/AIDocument');
const AITrainingSession = require('../models/AITrainingSession');
const AILogger = require('../utils/logger');

const logger = new AILogger('KnowledgeService');

class AIKnowledgeService {
  async getIndexedProjects() {
    try {
      const projects = await AIDocument.aggregate([
        {
          $group: {
            _id: '$projectName',
            projectPath: { $first: '$projectPath' },
            projectType: { $first: '$projectType' },
            totalFiles: { $sum: 1 },
            totalChunks: { $sum: '$totalChunks' },
            processedFiles: { $sum: { $cond: ['$processed', 1, 0] } },
            filesWithEmbeddings: { $sum: { $cond: ['$embeddingsGenerated', 1, 0] } },
            lastModified: { $max: '$lastModifiedAt' },
            lastProcessed: { $max: '$lastProcessedAt' },
            firstIndexed: { $min: '$createdAt' },
          },
        },
        { $sort: { totalFiles: -1 } },
      ]);

      return projects.map((p) => ({
        id: p._id,
        name: p._id,
        path: p.projectPath,
        type: p.projectType,
        fileCount: p.totalFiles,
        chunkCount: p.totalChunks,
        processedFiles: p.processedFiles,
        filesWithEmbeddings: p.filesWithEmbeddings,
        status: p.filesWithEmbeddings === p.totalFiles ? 'indexed' : p.processedFiles > 0 ? 'processing' : 'pending',
        lastTrained: p.lastProcessed || p.firstIndexed,
        lastModified: p.lastModified,
      }));
    } catch (err) {
      logger.error('Error getting indexed projects', { error: err.message });
      throw err;
    }
  }

  async getProjectDetails(projectName) {
    try {
      const documents = await AIDocument.find({ projectName }).sort({ createdAt: 1 });

      if (documents.length === 0) {
        return null;
      }

      const totalChunks = documents.reduce((sum, doc) => sum + doc.totalChunks, 0);
      const processedFiles = documents.filter((d) => d.processed).length;
      const filesWithEmbeddings = documents.filter((d) => d.embeddingsGenerated).length;

      return {
        name: projectName,
        path: documents[0].projectPath,
        type: documents[0].projectType,
        totalFiles: documents.length,
        totalChunks,
        processedFiles,
        filesWithEmbeddings,
        status: filesWithEmbeddings === documents.length ? 'indexed' : processedFiles > 0 ? 'processing' : 'pending',
        lastTrained: documents.reduce((latest, doc) => {
          const d = doc.lastProcessedAt || doc.createdAt;
          return !latest || d > latest ? d : latest;
        }, null),
        files: documents.map((doc) => ({
          filename: doc.filename,
          filepath: doc.filepath,
          language: doc.language,
          fileType: doc.fileType,
          fileSize: doc.fileSize,
          totalChunks: doc.totalChunks,
          processed: doc.processed,
          embeddingsGenerated: doc.embeddingsGenerated,
        })),
      };
    } catch (err) {
      logger.error('Error getting project details', { projectName, error: err.message });
      throw err;
    }
  }

  async getKnowledgeStats() {
    try {
      const [
        totalProjects,
        totalFiles,
        totalChunks,
        processedFiles,
        filesWithEmbeddings,
        latestSession,
      ] = await Promise.all([
        AIDocument.aggregate([{ $group: { _id: '$projectName' } }, { $count: 'total' }]),
        AIDocument.countDocuments(),
        AIDocument.aggregate([{ $group: { _id: null, total: { $sum: '$totalChunks' } } }]),
        AIDocument.countDocuments({ processed: true }),
        AIDocument.countDocuments({ embeddingsGenerated: true }),
        AITrainingSession.findOne({ status: 'completed' }).sort({ createdAt: -1 }),
      ]);

      const projectCount = totalProjects.length > 0 ? totalProjects[0].total : 0;
      const chunkTotal = totalChunks.length > 0 ? totalChunks[0].total : 0;

      return {
        totalProjects: projectCount,
        totalFiles,
        totalChunks: chunkTotal,
        processedFiles,
        filesWithEmbeddings,
        averageChunksPerProject: projectCount > 0 ? Math.round(chunkTotal / projectCount) : 0,
        averageChunksPerFile: totalFiles > 0 ? Math.round(chunkTotal / totalFiles) : 0,
        lastTrainingTimestamp: latestSession ? latestSession.endTime || latestSession.createdAt : null,
        lastTrainingDuration: latestSession ? latestSession.duration : null,
        indexingRate: totalFiles > 0 ? Math.round((filesWithEmbeddings / totalFiles) * 100) : 0,
      };
    } catch (err) {
      logger.error('Error getting knowledge stats', { error: err.message });
      throw err;
    }
  }

  async searchKnowledge(query) {
    try {
      const results = await AIDocument.find(
        { $text: { $search: query } },
        { score: { $meta: 'textScore' } }
      )
        .sort({ score: { $meta: 'textScore' } })
        .limit(20)
        .select('filename projectName projectPath language fileType summary keywords totalChunks');

      return results.map((doc) => ({
        id: doc._id.toString(),
        filename: doc.filename,
        projectName: doc.projectName,
        projectPath: doc.projectPath,
        language: doc.language,
        fileType: doc.fileType,
        summary: doc.summary,
        keywords: doc.keywords,
        totalChunks: doc.totalChunks,
        score: doc.score,
      }));
    } catch (err) {
      logger.error('Error searching knowledge', { query, error: err.message });
      throw err;
    }
  }
}

module.exports = AIKnowledgeService;
