"""
AI Embedding Service
Handles embedding generation and vector storage
"""

import hashlib
from typing import List, Dict, Optional
import numpy as np
from config.aiConfig import EMBEDDING_CONFIG
from utils.logger import get_logger

logger = get_logger(__name__)


class AIEmbeddingService:
    """Service for generating embeddings"""

    def __init__(self):
        self.embedding_cache = {}
        self.vector_store = None
        self.embeddings_model = None
        self.initialize_embeddings()

    def initialize_embeddings(self):
        """Initialize embeddings model"""
        try:
            from sentence_transformers import SentenceTransformer

            model_name = EMBEDDING_CONFIG['model']
            logger.info(f"Loading embedding model: {model_name}")

            self.embeddings_model = SentenceTransformer(model_name)
            logger.info("Embedding model loaded successfully")
        except Exception as e:
            logger.error(f"Error initializing embeddings: {str(e)}")
            self.embeddings_model = None

    def generate_embedding(self, text: str) -> Optional[List[float]]:
        """Generate embedding for text"""
        if not text:
            return None

        # Check cache
        cache_key = self.hash_text(text)
        if cache_key in self.embedding_cache:
            return self.embedding_cache[cache_key]

        try:
            if self.embeddings_model:
                embedding = self.embeddings_model.encode(text).tolist()
            else:
                embedding = self.generate_simple_embedding(text)

            # Cache the embedding
            self.embedding_cache[cache_key] = embedding
            return embedding
        except Exception as e:
            logger.error(f"Error generating embedding: {str(e)}")
            return self.generate_simple_embedding(text)

    def generate_simple_embedding(self, text: str) -> List[float]:
        """Generate simple embedding (fallback)"""
        words = text.lower().split()
        embedding = [0.0] * EMBEDDING_CONFIG['dimension']

        for word in words:
            hash_val = 0
            for char in word:
                hash_val = ((hash_val << 5) - hash_val) + ord(char)
                hash_val = hash_val & hash_val

            index = abs(hash_val) % EMBEDDING_CONFIG['dimension']
            embedding[index] += 1.0

        # Normalize
        magnitude = sum(x * x for x in embedding) ** 0.5
        if magnitude > 0:
            embedding = [x / magnitude for x in embedding]

        return embedding

    def hash_text(self, text: str) -> str:
        """Hash text for caching"""
        return hashlib.sha256(text.encode()).hexdigest()

    def store_embeddings(self, document_id: str, chunks: List[Dict], embeddings: List[List[float]]):
        """Store embeddings in vector database"""
        try:
            logger.info(f"Storing embeddings: {document_id}, count: {len(embeddings)}")
            # This will be implemented with Chroma integration
        except Exception as e:
            logger.error(f"Error storing embeddings: {str(e)}")
            raise

    def search_similar(self, query_embedding: List[float], top_k: int = 5) -> List[Dict]:
        """Search similar embeddings"""
        try:
            logger.debug(f"Searching similar embeddings, top_k: {top_k}")
            # This will be implemented with Chroma integration
            return []
        except Exception as e:
            logger.error(f"Error searching similar embeddings: {str(e)}")
            return []

    def cosine_similarity(self, vec1: List[float], vec2: List[float]) -> float:
        """Calculate cosine similarity"""
        dot_product = sum(a * b for a, b in zip(vec1, vec2))
        magnitude1 = sum(x * x for x in vec1) ** 0.5
        magnitude2 = sum(x * x for x in vec2) ** 0.5

        if magnitude1 == 0 or magnitude2 == 0:
            return 0.0

        return dot_product / (magnitude1 * magnitude2)

    def clear_cache(self):
        """Clear embedding cache"""
        self.embedding_cache.clear()
        logger.info("Cleared embedding cache")
