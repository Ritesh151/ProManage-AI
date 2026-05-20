/**
 * Python AI Client
 * Communicates with Python AI microservice
 */

const axios = require('axios');
const AILogger = require('../utils/logger');

const logger = new AILogger('PythonAIClient');

class PythonAIClient {
  constructor() {
    this.pythonAIUrl = process.env.PYTHON_AI_URL || 'http://localhost:8000';
    this.maxRetries = 3;
    this.retryDelay = 1000;
    this.timeout = 30000;
    this.isHealthy = false;
    this.client = axios.create({
      baseURL: this.pythonAIUrl,
      timeout: this.timeout,
    });
  }

  /**
   * Check if Python service is healthy
   */
  async checkHealth() {
    try {
      const response = await this.client.get('/health');
      this.isHealthy = response.data.status === 'healthy' || response.data.status === 'degraded';
      logger.info('Python AI service health check passed');
      return this.isHealthy;
    } catch (err) {
      logger.warn('Python AI service health check failed', { error: err.message });
      this.isHealthy = false;
      return false;
    }
  }

  /**
   * Start training
   */
  async startTraining() {
    return this.makeRequest('POST', '/train', {}, 'Start training');
  }

  /**
   * Start incremental training
   */
  async startRetrain() {
    return this.makeRequest('POST', '/train/retrain', {}, 'Start incremental training');
  }

  /**
   * Get training status
   */
  async getTrainingStatus() {
    return this.makeRequest('GET', '/train/status', {}, 'Get training status');
  }

  /**
   * Get training history
   */
  async getTrainingHistory(limit = 10) {
    return this.makeRequest('GET', `/train/history?limit=${limit}`, {}, 'Get training history');
  }

  /**
   * Get training statistics
   */
  async getTrainingStats() {
    return this.makeRequest('GET', '/train/stats', {}, 'Get training statistics');
  }

  /**
   * Send chat message
   */
  async chat(question, conversationId = null, userId = 'anonymous') {
    const data = {
      question,
      conversation_id: conversationId,
      user_id: userId,
    };
    return this.makeRequest('POST', '/chat', data, 'Send chat message');
  }

  /**
   * Get conversation history
   */
  async getConversation(conversationId) {
    return this.makeRequest('GET', `/chat/conversation/${conversationId}`, {}, 'Get conversation');
  }

  /**
   * Get user conversations
   */
  async getConversations(userId = 'anonymous', limit = 20) {
    return this.makeRequest(
      'GET',
      `/chat/conversations?user_id=${userId}&limit=${limit}`,
      {},
      'Get conversations'
    );
  }

  /**
   * Clear conversation
   */
  async clearConversation(conversationId) {
    return this.makeRequest('DELETE', `/chat/conversation/${conversationId}`, {}, 'Clear conversation');
  }

  /**
   * Submit feedback
   */
  async submitFeedback(conversationId, rating = null, comment = null, helpful = null) {
    const data = {
      conversation_id: conversationId,
      rating,
      comment,
      helpful,
    };
    return this.makeRequest('POST', '/chat/feedback', data, 'Submit feedback');
  }

  /**
   * Get AI status
   */
  async getStatus() {
    return this.makeRequest('GET', '/status', {}, 'Get AI status');
  }

  /**
   * Get projects
   */
  async getProjects() {
    return this.makeRequest('GET', '/status/projects', {}, 'Get projects');
  }

  /**
   * Make HTTP request with retry logic
   */
  async makeRequest(method, url, data, description) {
    let lastError;

    for (let attempt = 1; attempt <= this.maxRetries; attempt++) {
      try {
        logger.debug(`${description} (attempt ${attempt}/${this.maxRetries})`);

        let response;
        if (method === 'GET') {
          response = await this.client.get(url);
        } else if (method === 'POST') {
          response = await this.client.post(url, data);
        } else if (method === 'DELETE') {
          response = await this.client.delete(url);
        } else if (method === 'PUT') {
          response = await this.client.put(url, data);
        }

        logger.info(`${description} succeeded`);
        return response.data;
      } catch (err) {
        lastError = err;
        logger.warn(`${description} failed (attempt ${attempt}/${this.maxRetries})`, {
          error: err.message,
          status: err.response?.status,
        });

        if (attempt < this.maxRetries) {
          await this.delay(this.retryDelay * attempt);
        }
      }
    }

    logger.error(`${description} failed after ${this.maxRetries} attempts`, {
      error: lastError.message,
    });
    throw lastError;
  }

  /**
   * Delay helper
   */
  delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  /**
   * Get service info
   */
  async getInfo() {
    return this.makeRequest('GET', '/info', {}, 'Get service info');
  }
}

module.exports = PythonAIClient;
