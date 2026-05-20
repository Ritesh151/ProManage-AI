/**
 * AI Logger Utility
 * Centralized logging for AI system
 */

const fs = require('fs');
const path = require('path');
const AI_CONFIG = require('../config/aiConfig');

// Ensure logs directory exists
const logsDir = path.dirname(AI_CONFIG.logging.logFile);
if (!fs.existsSync(logsDir)) {
  fs.mkdirSync(logsDir, { recursive: true });
}

const LOG_LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

const CURRENT_LOG_LEVEL = LOG_LEVELS[AI_CONFIG.logging.level] || LOG_LEVELS.info;

class AILogger {
  constructor(module) {
    this.module = module;
  }

  _formatMessage(level, message, data = null) {
    const timestamp = new Date().toISOString();
    const dataStr = data ? ` | ${JSON.stringify(data)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] [${this.module}] ${message}${dataStr}`;
  }

  _writeLog(level, message, data) {
    const formattedMessage = this._formatMessage(level, message, data);
    
    // Console output
    const consoleMethod = level === 'error' ? 'error' : level === 'warn' ? 'warn' : 'log';
    console[consoleMethod](formattedMessage);

    // File output
    try {
      fs.appendFileSync(AI_CONFIG.logging.logFile, formattedMessage + '\n');
    } catch (err) {
      console.error('Failed to write to log file:', err);
    }
  }

  debug(message, data = null) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.debug) {
      this._writeLog('debug', message, data);
    }
  }

  info(message, data = null) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.info) {
      this._writeLog('info', message, data);
    }
  }

  warn(message, data = null) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.warn) {
      this._writeLog('warn', message, data);
    }
  }

  error(message, data = null) {
    if (CURRENT_LOG_LEVEL <= LOG_LEVELS.error) {
      this._writeLog('error', message, data);
    }
  }
}

module.exports = AILogger;
