#!/usr/bin/env node

/**
 * Retrain AI Script
 * CLI script to start incremental training
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AITrainingService = require('../services/AITrainingService');
const AILogger = require('../utils/logger');

const logger = new AILogger('RetrainAIScript');

async function main() {
  try {
    logger.info('Connecting to database');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-knowledge');
    
    logger.info('Database connected');
    logger.info('Starting incremental AI training');

    const trainingService = new AITrainingService();
    const session = await trainingService.startIncrementalTraining();

    logger.info('Incremental training completed', {
      sessionId: session.sessionId,
      status: session.status,
      filesProcessed: session.filesProcessed,
      chunksCreated: session.chunksCreated,
      duration: session.duration,
    });

    console.log('\n✓ Incremental training completed successfully');
    console.log(`  Session ID: ${session.sessionId}`);
    console.log(`  Files: ${session.filesProcessed}`);
    console.log(`  Chunks: ${session.chunksCreated}`);
    console.log(`  Duration: ${(session.duration / 1000).toFixed(2)}s`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    logger.error('Incremental training failed', { error: err.message });
    console.error('\n✗ Incremental training failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
