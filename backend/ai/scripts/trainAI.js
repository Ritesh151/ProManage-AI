#!/usr/bin/env node

/**
 * Train AI Script
 * CLI script to start full training
 */

require('dotenv').config();
const mongoose = require('mongoose');
const AITrainingService = require('../services/AITrainingService');
const AILogger = require('../utils/logger');

const logger = new AILogger('TrainAIScript');

async function main() {
  try {
    logger.info('Connecting to database');
    
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/ai-knowledge');
    
    logger.info('Database connected');
    logger.info('Starting AI training');

    const trainingService = new AITrainingService();
    const session = await trainingService.startFullTraining();

    logger.info('Training completed', {
      sessionId: session.sessionId,
      status: session.status,
      projectsProcessed: session.projectsProcessed,
      filesProcessed: session.filesProcessed,
      chunksCreated: session.chunksCreated,
      embeddingsGenerated: session.embeddingsGenerated,
      duration: session.duration,
    });

    console.log('\n✓ Training completed successfully');
    console.log(`  Session ID: ${session.sessionId}`);
    console.log(`  Projects: ${session.projectsProcessed}`);
    console.log(`  Files: ${session.filesProcessed}`);
    console.log(`  Chunks: ${session.chunksCreated}`);
    console.log(`  Duration: ${(session.duration / 1000).toFixed(2)}s`);

    await mongoose.disconnect();
    process.exit(0);
  } catch (err) {
    logger.error('Training failed', { error: err.message });
    console.error('\n✗ Training failed:', err.message);
    await mongoose.disconnect();
    process.exit(1);
  }
}

main();
