/**
 * AI System Initialization
 * Initializes all AI components on server startup
 */

const { spawn } = require('child_process');
const path = require('path');
const PythonAIClient = require('./services/PythonAIClient');
const AILogger = require('./utils/logger');

const logger = new AILogger('AIInit');

let pythonProcess = null;
let pythonAIClient = null;

/**
 * Start Python AI service
 */
async function startPythonService() {
  return new Promise((resolve, reject) => {
    try {
      logger.info('Starting Python AI service');

      const pythonPath = path.join(__dirname, '..', '..', 'python-ai');
      const pythonExe = process.platform === 'win32' ? 'python' : 'python3';

      pythonProcess = spawn(pythonExe, ['app.py'], {
        cwd: pythonPath,
        stdio: 'inherit',
        detached: false,
      });

      pythonProcess.on('error', (err) => {
        logger.error('Error starting Python service', { error: err.message });
        reject(err);
      });

      // Wait for service to be ready
      setTimeout(() => {
        resolve();
      }, 3000);
    } catch (err) {
      logger.error('Error spawning Python process', { error: err.message });
      reject(err);
    }
  });
}

/**
 * Check Python service health
 */
async function checkPythonServiceHealth(maxAttempts = 10) {
  pythonAIClient = new PythonAIClient();

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      logger.info(`Checking Python service health (attempt ${attempt}/${maxAttempts})`);
      const isHealthy = await pythonAIClient.checkHealth();

      if (isHealthy) {
        logger.info('Python service is healthy');
        return true;
      }
    } catch (err) {
      logger.debug(`Health check failed: ${err.message}`);
    }

    // Wait before retrying
    await new Promise(resolve => setTimeout(resolve, 1000));
  }

  logger.warn('Python service health check failed after max attempts');
  return false;
}

/**
 * Initialize AI system
 */
async function initializeAI() {
  logger.info('Initializing AI system');

  try {
    // Start Python service
    await startPythonService();

    // Check health
    const isHealthy = await checkPythonServiceHealth();

    if (!isHealthy) {
      logger.warn('Python service not responding, continuing with degraded mode');
    }

    logger.info('AI system initialization completed');
    return {
      pythonAIClient,
      pythonProcess,
    };
  } catch (err) {
    logger.error('Error initializing AI system', { error: err.message });
    throw err;
  }
}

/**
 * Shutdown AI system
 */
async function shutdownAI() {
  logger.info('Shutting down AI system');

  try {
    if (pythonProcess) {
      logger.info('Terminating Python service');
      pythonProcess.kill();
    }

    logger.info('AI system shutdown completed');
  } catch (err) {
    logger.error('Error shutting down AI system', { error: err.message });
  }
}

module.exports = {
  initializeAI,
  shutdownAI,
  getPythonAIClient: () => pythonAIClient,
};
