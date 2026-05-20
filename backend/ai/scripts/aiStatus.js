#!/usr/bin/env node

/**
 * AI Status Script
 * CLI script to check AI system status
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AITrainingService = require('../services/AITrainingService');
const AIIngestService = require('../services/AIIngestService');
const AILogger = require('../utils/logger');

const logger = new AILogger('AIStatusScript');

async function main() {
  try {
    logger.info('Connecting to database');
    
    await mongoose.connect(process.env._URI || 'mongodb://localhost:27017/ai-knowledge');
    
    logger.info('Database connected');

    const trainingService = new AITrainingService();
    const ingestService = new AIIngestService();

    const status = await trainingService.getTrainingStatus();
    const stats = await ingestService.getStatistics();
    const trainingStats = await trainingService.getTrainingStatistics();

    console.log('\n╔════════════════════════════════════════╗');
    console.log('║        AI SYSTEM STATUS REPORT         ║');
    console.log('╚════════════════════════════════════════╝\n');

    console.log('📊 DOCUMENT STATISTICS:');
    console.log(`  Total Documents: ${stats.totalDocuments}`);
    console.log(`  Processed: ${stats.processedDocuments}`);
    console.log(`  With Embeddings: ${stats.documentsWithEmbeddings}`);
    console.log(`  Total Chunks: ${stats.totalChunks}`);

    console.log('\n📁 BY LANGUAGE:');
    for (const [lang, count] of Object.entries(stats.byLanguage)) {
      console.log(`  ${lang}: ${count}`);
    }

    console.log('\n📂 BY FILE TYPE:');
    for (const [type, count] of Object.entries(stats.byFileType)) {
      console.log(`  ${type}: ${count}`);
    }

    console.log('\n🏗️  BY PROJECT:');
    for (const [project, count] of Object.entries(stats.byProject)) {
      console.log(`  ${project}: ${count}`);
    }

    console.log('\n🎓 TRAINING STATISTICS:');
    console.log(`  Total Sessions: ${trainingStats.totalSessions}`);
    console.log(`  Completed: ${trainingStats.completedSessions}`);
    console.log(`  Failed: ${trainingStats.failedSessions}`);
    console.log(`  In Progress: ${trainingStats.inProgressSessions}`);
    if (trainingStats.averageTrainingTime) {
      console.log(`  Avg Training Time: ${(trainingStats.averageTrainingTime / 1000).toFixed(2)}s`);
    }
    if (trainingStats.totalDocumentsProcessed) {
      console.log(`  Total Docs Processed: ${trainingStats.totalDocumentsProcessed}`);
    }

    if (status) {
      console.log('\n⏱️  CURRENT SESSION:');
      console.log(`  Status: ${status.status}`);
      console.log(`  Type: ${status.type}`);
      console.log(`  Projects: ${status.projectsProcessed}/${status.totalProjects}`);
      console.log(`  Files: ${status.filesProcessed}/${status.totalFiles}`);
      console.log(`  Chunks: ${status.chunksCreated}/${status.totalChunks}`);
      console.log(`  Embeddings: ${status.embeddingsGenerated}`);
      console.log(`  Errors: ${status.errorCount}`);
    }

    console.log('\n✓ Status report generated\n');

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    logger.error('Status check failed', { error: err.message });
    console.error('\n✗ Status check failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
