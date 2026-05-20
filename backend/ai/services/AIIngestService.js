/**
 * AI Ingest Service
 * Handles document ingestion and processing
 */

const fs = require('fs');
const path = require('path');
const AIDocument = require('../models/AIDocument');
const { scanDirectory, readFileContent, getFileMetadata, calculateFileHash, getProjectName, detectProjectType } = require('../utils/fileUtils');
const { chunkText, cleanText, extractSummary, extractKeywords } = require('../utils/textUtils');
const AILogger = require('../utils/logger');
const AI_CONFIG = require('../config/aiConfig');

const logger = new AILogger('IngestService');

class AIIngestService {
  constructor() {
    this.processingQueue = [];
    this.isProcessing = false;
  }



  async ingestProject(projectPath) {
    logger.info('Starting project ingestion', { projectPath });

    try {
      const projectName = getProjectName(projectPath);
      const projectType = detectProjectType(projectPath);
      const files = scanDirectory(projectPath);

      logger.info('Found files to ingest', { projectPath, fileCount: files.length });

      const results = {
        projectName,
        projectPath,
        projectType,
        filesProcessed: 0,
        filesSkipped: 0,
        errors: [],
      };

      for (const filePath of files) {
        try {
          await this.ingestFile(filePath, projectName, projectPath, projectType);
          results.filesProcessed++;
        } catch (err) {
          logger.error('Error ingesting file', { filePath, error: err.message });
          results.filesSkipped++;
          results.errors.push({ filePath, error: err.message });
        }
      }

      logger.info('Project ingestion completed', results);
      return results;
    } catch (err) {
      logger.error('Error ingesting project', { projectPath, error: err.message });
      throw err;
    }
  }

  /**
   * Ingest single file
   */
  async ingestFile(filePath, projectName, projectPath, projectType) {
    logger.debug('Ingesting file', { filePath });

    // Read file content
    const content = readFileContent(filePath);
    if (!content) {
      throw new Error('Could not read file content');
    }

    // Get file metadata
    const metadata = getFileMetadata(filePath);
    if (!metadata) {
      throw new Error('Could not extract file metadata');
    }

    // Calculate file hash
    const fileHash = calculateFileHash(filePath);

    // Check if file already exists and hasn't changed
    const existingDoc = await AIDocument.findOne({ filepath: filePath });
    if (existingDoc && existingDoc.fileHash === fileHash) {
      logger.debug('File unchanged, skipping', { filePath });
      return existingDoc;
    }

    // Clean and process content
    const cleanedContent = cleanText(content);
    const summary = extractSummary(cleanedContent);
    const keywords = extractKeywords(cleanedContent);

    // Create chunks
    const chunks = chunkText(cleanedContent);
    const chunkData = chunks.map((chunk, index) => ({
      chunkIndex: index,
      content: chunk,
      chunkId: `${fileHash}-${index}`,
    }));

    // Create or update document
    const documentData = {
      filename: metadata.filename,
      filepath: filePath,
      projectName,
      projectPath,
      projectType,
      language: metadata.language,
      fileType: metadata.fileType,
      fileSize: metadata.fileSize,
      fileHash,
      content: cleanedContent,
      summary,
      keywords,
      chunks: chunkData,
      totalChunks: chunks.length,
      processed: false,
      embeddingsGenerated: false,
      lastModifiedAt: metadata.modifiedAt,
    };

    let document;
    if (existingDoc) {
      document = await AIDocument.findByIdAndUpdate(existingDoc._id, documentData, { new: true });
      logger.debug('Updated existing document', { filePath });
    } else {
      document = await AIDocument.create(documentData);
      logger.debug('Created new document', { filePath });
    }

    return document;
  }

  /**
   * Get unprocessed documents
   */
  async getUnprocessedDocuments(limit = 100) {
    return AIDocument.find({ processed: false }).limit(limit);
  }

  /**
   * Mark document as processed
   */
  async markAsProcessed(documentId) {
    return AIDocument.findByIdAndUpdate(
      documentId,
      { 
        processed: true,
        lastProcessedAt: new Date(),
      },
      { new: true }
    );
  }

  /**
   * Mark document embeddings as generated
   */
  async markEmbeddingsGenerated(documentId) {
    return AIDocument.findByIdAndUpdate(
      documentId,
      { embeddingsGenerated: true },
      { new: true }
    );
  }

  /**
   * Get documents by project
   */
  async getDocumentsByProject(projectName) {
    return AIDocument.find({ projectName });
  }

  /**
   * Get document statistics
   */
  async getStatistics() {
    const stats = {
      totalDocuments: await AIDocument.countDocuments(),
      processedDocuments: await AIDocument.countDocuments({ processed: true }),
      documentsWithEmbeddings: await AIDocument.countDocuments({ embeddingsGenerated: true }),
      totalChunks: 0,
      byLanguage: {},
      byFileType: {},
      byProject: {},
    };

    const documents = await AIDocument.find();
    for (const doc of documents) {
      stats.totalChunks += doc.totalChunks;
      stats.byLanguage[doc.language] = (stats.byLanguage[doc.language] || 0) + 1;
      stats.byFileType[doc.fileType] = (stats.byFileType[doc.fileType] || 0) + 1;
      stats.byProject[doc.projectName] = (stats.byProject[doc.projectName] || 0) + 1;
    }

    return stats;
  }

  /**
   * Delete documents by project
   */
  async deleteProjectDocuments(projectName) {
    const result = await AIDocument.deleteMany({ projectName });
    logger.info('Deleted project documents', { projectName, deletedCount: result.deletedCount });
    return result;
  }

  /**
   * Search documents
   */
  async searchDocuments(query, limit = 10) {
    return AIDocument.find(
      { $text: { $search: query } },
      { score: { $meta: 'textScore' } }
    )
    .sort({ score: { $meta: 'textScore' } })
    .limit(limit);
  }
}

module.exports = AIIngestService;
