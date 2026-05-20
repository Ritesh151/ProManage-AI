"""
Text Processing Utilities for Python AI Service
"""

from typing import List
from config.aiConfig import CHUNKING_CONFIG


def chunk_text(text: str, chunk_size: int = None, chunk_overlap: int = None) -> List[str]:
    """Split text into chunks with overlap"""
    chunk_size = chunk_size or CHUNKING_CONFIG['chunk_size']
    chunk_overlap = chunk_overlap or CHUNKING_CONFIG['chunk_overlap']

    if not text or len(text) == 0:
        return []

    chunks = []
    start = 0

    while start < len(text):
        end = start + chunk_size

        # Try to break at a natural boundary
        if end < len(text):
            for separator in CHUNKING_CONFIG['separators']:
                last_index = text.rfind(separator, start, end)
                if last_index > start:
                    end = last_index + len(separator)
                    break

        chunk = text[start:end].strip()
        if chunk:
            chunks.append(chunk)

        start = end - chunk_overlap

    return chunks


def clean_text(text: str) -> str:
    """Clean text content"""
    if not text:
        return ""

    # Remove extra whitespace
    text = ' '.join(text.split())

    # Remove control characters
    text = ''.join(char for char in text if ord(char) >= 32 or char in '\n\t')

    # Normalize line endings
    text = text.replace('\r\n', '\n')

    return text


def extract_summary(text: str, max_length: int = 500) -> str:
    """Extract summary from text"""
    if not text:
        return ""

    cleaned = clean_text(text)
    sentences = [s.strip() for s in cleaned.split('.') if s.strip()]

    summary = ""
    for sentence in sentences:
        if len(summary) + len(sentence) + 1 <= max_length:
            summary += sentence + ". "
        else:
            break

    return summary.strip() or cleaned[:max_length]


def extract_keywords(text: str, max_keywords: int = 10) -> List[str]:
    """Extract keywords from text"""
    if not text:
        return []

    cleaned = clean_text(text).lower()

    # Common stop words
    stop_words = {
        'the', 'a', 'an', 'and', 'or', 'but', 'in', 'on', 'at', 'to', 'for',
        'of', 'with', 'by', 'from', 'is', 'are', 'was', 'were', 'be', 'been',
        'being', 'have', 'has', 'had', 'do', 'does', 'did', 'will', 'would',
        'could', 'should', 'may', 'might', 'must', 'can', 'this', 'that',
        'these', 'those', 'i', 'you', 'he', 'she', 'it', 'we', 'they',
    }

    # Extract words
    words = cleaned.split()

    # Count word frequency
    word_freq = {}
    for word in words:
        if len(word) > 3 and word not in stop_words:
            word_freq[word] = word_freq.get(word, 0) + 1

    # Sort by frequency
    keywords = sorted(word_freq.items(), key=lambda x: x[1], reverse=True)
    return [word for word, _ in keywords[:max_keywords]]


def truncate_text(text: str, max_length: int = 1000, suffix: str = "...") -> str:
    """Truncate text to max length"""
    if not text:
        return ""
    if len(text) <= max_length:
        return text

    return text[:max_length - len(suffix)] + suffix
