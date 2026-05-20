/**
 * AI Chat Service
 * Handles chat interactions and LLM communication
 */

const axios = require('axios');
const AIEmbeddingService = require('./AIEmbeddingService');
const AIIngestService = require('./AIIngestService');
const AIChatHistory = require('../models/AIChatHistory');
const AIDocument = require('../models/AIDocument');
const AILogger = require('../utils/logger');
const AI_CONFIG = require('../config/aiConfig');
const { v4: uuidv4 } = require('uuid');

const logger = new AILogger('ChatService');

class AIChatService {
  constructor() {
    this.embeddingService = new AIEmbeddingService();
    this.ingestService = new AIIngestService();
    this.conversationCache = new Map();
  }

  /**
   * Process user query and generate response
   */
  async chat(question, conversationId = null, userId = 'anonymous') {
    const startTime = Date.now();
    conversationId = conversationId || uuidv4();

    logger.info('Processing chat query', { conversationId, userId, question: question.substring(0, 100) });

    try {
      // Step 1: Generate embedding for question
      const questionEmbedding = await this.embeddingService.generateEmbedding(question);

      // Step 2: Retrieve relevant documents
      const retrievedDocs = await this.embeddingService.searchSimilar(questionEmbedding, AI_CONFIG.retrieval.topK);

      // Step 3: Fetch full document content
      const context = await this.buildContext(retrievedDocs);

      // Step 4: Generate response using LLM
      const response = await this.generateResponse(question, context);

      // Step 5: Save to chat history
      const responseTime = Date.now() - startTime;
      const chatRecord = await this.saveChatHistory(
        conversationId,
        userId,
        question,
        response,
        retrievedDocs,
        responseTime
      );

      logger.info('Chat query processed successfully', {
        conversationId,
        responseTime,
        documentsRetrieved: retrievedDocs.length,
      });

      return {
        conversationId,
        answer: response.answer,
        sources: response.sources,
        responseTime,
        tokensUsed: response.tokensUsed,
      };
    } catch (err) {
      logger.error('Error processing chat query', { conversationId, error: err.message });
      throw err;
    }
  }

  /**
   * Build context from retrieved documents
   */
  async buildContext(retrievedDocs) {
    const context = [];

    for (const doc of retrievedDocs) {
      try {
        // Extract document ID from the retrieval result
        const docId = doc.id?.split('-')[0];

        if (docId) {
          const fullDoc = await AIDocument.findById(docId);
          if (fullDoc) {
            context.push({
              filename: fullDoc.filename,
              projectName: fullDoc.projectName,
              projectPath: fullDoc.projectPath,
              content: doc.content,
              similarity: doc.similarity,
            });
          }
        }
      } catch (err) {
        logger.warn('Error building context', { error: err.message });
      }
    }

    return context;
  }

  /**
   * Generate response using LLM
   */
  async generateResponse(question, context) {
    const provider = AI_CONFIG.llm.provider;

    logger.debug('Generating response', { provider, contextLength: context.length });

    try {
      if (provider === 'openai') {
        return await this.generateOpenAIResponse(question, context);
      } else if (provider === 'gemini') {
        return await this.generateGeminiResponse(question, context);
      } else if (provider === 'ollama') {
        return await this.generateOllamaResponse(question, context);
      } else {
        return this.generateFallbackResponse(question, context);
      }
    } catch (err) {
      logger.error('Error generating response', { provider, error: err.message });
      return this.generateFallbackResponse(question, context);
    }
  }

  /**
   * Generate response using OpenAI
   */
  async generateOpenAIResponse(question, context) {
    const contextText = context
      .map(c => `File: ${c.filename}\nProject: ${c.projectName}\nContent:\n${c.content}`)
      .join('\n\n---\n\n');

    const messages = [
      {
        role: 'system',
        content: AI_CONFIG.systemPrompt,
      },
      {
        role: 'user',
        content: `Context from project files:\n\n${contextText}\n\nQuestion: ${question}`,
      },
    ];

    try {
      const response = await axios.post(
        'https://api.openai.com/v1/chat/completions',
        {
          model: AI_CONFIG.llm.openai.model,
          messages,
          temperature: AI_CONFIG.llm.openai.temperature,
          max_tokens: AI_CONFIG.llm.openai.maxTokens,
        },
        {
          headers: {
            Authorization: `Bearer ${AI_CONFIG.llm.openai.apiKey}`,
          },
        }
      );

      const answer = response.data.choices[0].message.content;
      const tokensUsed = {
        prompt: response.data.usage.prompt_tokens,
        completion: response.data.usage.completion_tokens,
        total: response.data.usage.total_tokens,
      };

      return {
        answer,
        sources: context.map(c => ({
          filename: c.filename,
          projectName: c.projectName,
          similarity: c.similarity,
        })),
        tokensUsed,
      };
    } catch (err) {
      logger.error('OpenAI API error', { error: err.message });
      throw err;
    }
  }

  /**
   * Generate response using Gemini
   */
  async generateGeminiResponse(question, context) {
    const contextText = context
      .map(c => `File: ${c.filename}\nProject: ${c.projectName}\nContent:\n${c.content}`)
      .join('\n\n---\n\n');

    try {
      const response = await axios.post(
        `https://generativelanguage.googleapis.com/v1beta/models/${AI_CONFIG.llm.gemini.model}:generateContent`,
        {
          contents: [
            {
              parts: [
                {
                  text: `${AI_CONFIG.systemPrompt}\n\nContext from project files:\n\n${contextText}\n\nQuestion: ${question}`,
                },
              ],
            },
          ],
          generationConfig: {
            temperature: AI_CONFIG.llm.gemini.temperature,
          },
        },
        {
          params: {
            key: AI_CONFIG.llm.gemini.apiKey,
          },
        }
      );

      const answer = response.data.candidates[0].content.parts[0].text;

      return {
        answer,
        sources: context.map(c => ({
          filename: c.filename,
          projectName: c.projectName,
          similarity: c.similarity,
        })),
        tokensUsed: null,
      };
    } catch (err) {
      logger.error('Gemini API error', { error: err.message });
      throw err;
    }
  }

  /**
   * Generate response using Ollama (local)
   */
  async generateOllamaResponse(question, context) {
    const contextText = context
      .map(c => `File: ${c.filename}\nProject: ${c.projectName}\nContent:\n${c.content}`)
      .join('\n\n---\n\n');

    try {
      const response = await axios.post(
        `${AI_CONFIG.llm.ollama.baseUrl}/api/generate`,
        {
          model: AI_CONFIG.llm.ollama.model,
          prompt: `${AI_CONFIG.systemPrompt}\n\nContext from project files:\n\n${contextText}\n\nQuestion: ${question}`,
          stream: false,
        }
      );

      return {
        answer: response.data.response,
        sources: context.map(c => ({
          filename: c.filename,
          projectName: c.projectName,
          similarity: c.similarity,
        })),
        tokensUsed: null,
      };
    } catch (err) {
      logger.error('Ollama API error', { error: err.message });
      throw err;
    }
  }

  /**
   * Fallback response generation
   */
  generateFallbackResponse(question, context) {
    let answer = 'Based on the project files:\n\n';

    if (context.length === 0) {
      answer = 'I could not find relevant information in the project files to answer your question.';
    } else {
      for (const ctx of context) {
        answer += `From ${ctx.filename} (${ctx.projectName}):\n${ctx.content}\n\n`;
      }
    }

    return {
      answer,
      sources: context.map(c => ({
        filename: c.filename,
        projectName: c.projectName,
        similarity: c.similarity,
      })),
      tokensUsed: null,
    };
  }

  /**
   * Save chat to history
   */
  async saveChatHistory(conversationId, userId, question, response, retrievedDocs, responseTime) {
    try {
      const chatRecord = await AIChatHistory.findOneAndUpdate(
        { conversationId },
        {
          $push: {
            messages: [
              {
                role: 'user',
                content: question,
                timestamp: new Date(),
              },
              {
                role: 'assistant',
                content: response.answer,
                timestamp: new Date(),
              },
            ],
          },
          lastQuery: question,
          lastResponse: response.answer,
          responseTime,
          tokensUsed: response.tokensUsed,
          retrievedDocuments: retrievedDocs.map(doc => ({
            filename: doc.filename,
            projectName: doc.projectName,
            similarity: doc.similarity,
            content: doc.content,
          })),
          updatedAt: new Date(),
        },
        { new: true, upsert: true }
      );

      return chatRecord;
    } catch (err) {
      logger.error('Error saving chat history', { conversationId, error: err.message });
    }
  }

  /**
   * Get conversation history
   */
  async getConversationHistory(conversationId) {
    return AIChatHistory.findOne({ conversationId });
  }

  /**
   * Get user conversations
   */
  async getUserConversations(userId, limit = 20) {
    return AIChatHistory.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);
  }

  /**
   * Clear conversation
   */
  async clearConversation(conversationId) {
    return AIChatHistory.findOneAndUpdate(
      { conversationId },
      { messages: [], status: 'archived' },
      { new: true }
    );
  }
}

module.exports = AIChatService;
