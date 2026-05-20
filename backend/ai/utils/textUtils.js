/**
 * Text Processing Utilities for AI System
 * Handles text chunking, cleaning, and extraction
 */

const AI_CONFIG = require('../config/aiConfig');
const AILogger = require('./logger');

const logger = new AILogger('TextUtils');

/**
 * Split text into chunks with overlap
 */
function chunkText(text, chunkSize = null, chunkOverlap = null) {
  chunkSize = chunkSize || AI_CONFIG.chunking.chunkSize;
  chunkOverlap = chunkOverlap || AI_CONFIG.chunking.chunkOverlap;

  if (!text || text.length === 0) {
    return [];
  }

  const chunks = [];
  let start = 0;

  while (start < text.length) {
    let end = start + chunkSize;

    // Try to break at a natural boundary
    if (end < text.length) {
      // Look for separators
      for (const separator of AI_CONFIG.chunking.separators) {
        const lastIndex = text.lastIndexOf(separator, end);
        if (lastIndex > start) {
          end = lastIndex + separator.length;
          break;
        }
      }
    }

    const chunk = text.substring(start, end).trim();
    if (chunk.length > 0) {
      chunks.push(chunk);
    }

    // Move start position with overlap
    start = end - chunkOverlap;
  }

  return chunks;
}

/**
 * Clean text content
 */
function cleanText(text) {
  if (!text) return '';

  // Remove extra whitespace
  text = text.replace(/\s+/g, ' ').trim();

  // Remove control characters
  text = text.replace(/[\x00-\x1F\x7F]/g, '');

  // Normalize line endings
  text = text.replace(/\r\n/g, '\n');

  return text;
}

/**
 * Extract summary from text
 */
function extractSummary(text, maxLength = 500) {
  if (!text) return '';

  const cleaned = cleanText(text);
  const sentences = cleaned.match(/[^.!?]+[.!?]+/g) || [cleaned];

  let summary = '';
  for (const sentence of sentences) {
    if ((summary + sentence).length <= maxLength) {
      summary += sentence;
    } else {
      break;
    }
  }

  return summary.trim() || cleaned.substring(0, maxLength);
}

/**
 * Extract keywords from text
 */
function extractKeywords(text, maxKeywords = 10) {
  if (!text) return [];

  const cleaned = cleanText(text).toLowerCase();

  // Common stop words
  const stopWords = new Set([
    'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
    'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
    'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
    'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
    'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
  ]);

  // Extract words
  const words = cleaned.match(/\b\w+\b/g) || [];

  // Count word frequency
  const wordFreq = {};
  for (const word of words) {
    if (word.length > 3 && !stopWords.has(word)) {
      wordFreq[word] = (wordFreq[word] || 0) + 1;
    }
  }

  // Sort by frequency
  const keywords = Object.entries(wordFreq)
    .sort((a, b) => b[1] - a[1])
    .slice(0, maxKeywords)
    .map(([word]) => word);

  return keywords;
}

/**
 * Extract code blocks from text
 */
function extractCodeBlocks(text) {
  const codeBlocks = [];
  const codeRegex = /```[\s\S]*?```/g;
  let match;

  while ((match = codeRegex.exec(text)) !== null) {
    const block = match[0].replace(/```/g, '').trim();
    if (block.length > 0) {
      codeBlocks.push(block);
    }
  }

  return codeBlocks;
}

/**
 * Extract links from text
 */
function extractLinks(text) {
  const links = [];
  const linkRegex = /https?:\/\/[^\s]+/g;
  let match;

  while ((match = linkRegex.exec(text)) !== null) {
    links.push(match[0]);
  }

  return links;
}

/**
 * Truncate text to max length
 */
function truncateText(text, maxLength = 1000, suffix = '...') {
  if (!text) return '';
  if (text.length <= maxLength) return text;

  return text.substring(0, maxLength - suffix.length) + suffix;
}

/**
 * Calculate text similarity (simple Jaccard similarity)
 */
function calculateTextSimilarity(text1, text2) {
  if (!text1 || !text2) return 0;

  const words1 = new Set(text1.toLowerCase().match(/\b\w+\b/g) || []);
  const words2 = new Set(text2.toLowerCase().match(/\b\w+\b/g) || []);

  const intersection = new Set([...words1].filter(x => words2.has(x)));
  const union = new Set([...words1, ...words2]);

  return intersection.size / union.size;
}

module.exports = {
  chunkText,
  cleanText,
  extractSummary,
  extractKeywords,
  extractCodeBlocks,
  extractLinks,
  truncateText,
  calculateTextSimilarity,
};
