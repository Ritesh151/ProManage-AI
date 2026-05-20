"""
AI Chat Service
Handles chat interactions and LLM communication
"""

import uuid
from typing import Dict, List, Optional
from datetime import datetime
from config.aiConfig import SYSTEM_PROMPT, LLM_CONFIG
from services.AIEmbeddingService import AIEmbeddingService
from utils.logger import get_logger

logger = get_logger(__name__)


class AIChatService:
    """Service for chat interactions"""

    def __init__(self):
        self.embedding_service = AIEmbeddingService()
        self.conversation_cache = {}
        self.llm_client = None
        self.initialize_llm()

    def initialize_llm(self):
        """Initialize LLM client"""
        try:
            provider = LLM_CONFIG['provider']
            logger.info(f"Initializing LLM provider: {provider}")

            if provider == 'openai':
                from langchain_openai import ChatOpenAI
                self.llm_client = ChatOpenAI(
                    api_key=LLM_CONFIG['openai']['api_key'],
                    model=LLM_CONFIG['openai']['model'],
                    temperature=LLM_CONFIG['openai']['temperature'],
                )
            elif provider == 'gemini':
                from langchain_community.chat_models import ChatGoogleGenerativeAI
                self.llm_client = ChatGoogleGenerativeAI(
                    api_key=LLM_CONFIG['gemini']['api_key'],
                    model=LLM_CONFIG['gemini']['model'],
                )
            elif provider == 'ollama':
                from langchain_community.chat_models import ChatOllama
                self.llm_client = ChatOllama(
                    base_url=LLM_CONFIG['ollama']['base_url'],
                    model=LLM_CONFIG['ollama']['model'],
                )

            logger.info(f"LLM client initialized: {provider}")
        except Exception as e:
            logger.error(f"Error initializing LLM: {str(e)}")
            self.llm_client = None

    def chat(self, question: str, conversation_id: str = None, user_id: str = 'anonymous') -> Dict:
        """Process user query and generate response"""
        conversation_id = conversation_id or str(uuid.uuid4())
        start_time = datetime.now()

        logger.info(f"Processing chat query: {conversation_id}, question: {question[:100]}")

        try:
            # Step 1: Generate embedding for question
            question_embedding = self.embedding_service.generate_embedding(question)

            # Step 2: Retrieve relevant documents
            retrieved_docs = self.embedding_service.search_similar(question_embedding)

            # Step 3: Build context
            context = self.build_context(retrieved_docs)

            # Step 4: Generate response
            response = self.generate_response(question, context)

            # Step 5: Calculate response time
            response_time = (datetime.now() - start_time).total_seconds() * 1000

            logger.info(f"Chat query processed: {conversation_id}, time: {response_time}ms")

            return {
                'conversation_id': conversation_id,
                'answer': response['answer'],
                'sources': response['sources'],
                'response_time': response_time,
                'tokens_used': response.get('tokens_used'),
            }
        except Exception as e:
            logger.error(f"Error processing chat query: {str(e)}")
            raise

    def build_context(self, retrieved_docs: List[Dict]) -> List[Dict]:
        """Build context from retrieved documents"""
        context = []

        for doc in retrieved_docs:
            try:
                context.append({
                    'filename': doc.get('filename'),
                    'project_name': doc.get('project_name'),
                    'project_path': doc.get('project_path'),
                    'content': doc.get('content'),
                    'similarity': doc.get('similarity'),
                })
            except Exception as e:
                logger.warning(f"Error building context: {str(e)}")

        return context

    def generate_response(self, question: str, context: List[Dict]) -> Dict:
        """Generate response using LLM"""
        logger.debug(f"Generating response, context length: {len(context)}")

        try:
            if self.llm_client:
                return self.generate_llm_response(question, context)
            else:
                return self.generate_fallback_response(question, context)
        except Exception as e:
            logger.error(f"Error generating response: {str(e)}")
            return self.generate_fallback_response(question, context)

    def generate_llm_response(self, question: str, context: List[Dict]) -> Dict:
        """Generate response using LLM"""
        try:
            context_text = "\n\n".join([
                f"File: {c['filename']}\nProject: {c['project_name']}\nContent:\n{c['content']}"
                for c in context
            ])

            prompt = f"{SYSTEM_PROMPT}\n\nContext from project files:\n\n{context_text}\n\nQuestion: {question}"

            from langchain_core.messages import HumanMessage
            message = HumanMessage(content=prompt)
            response = self.llm_client.invoke([message])

            return {
                'answer': response.content,
                'sources': [
                    {
                        'filename': c['filename'],
                        'project_name': c['project_name'],
                        'similarity': c.get('similarity'),
                    }
                    for c in context
                ],
                'tokens_used': None,
            }
        except Exception as e:
            logger.error(f"Error generating LLM response: {str(e)}")
            return self.generate_fallback_response(question, context)

    def generate_fallback_response(self, question: str, context: List[Dict]) -> Dict:
        """Generate fallback response"""
        answer = "Based on the project files:\n\n"

        if not context:
            answer = "I could not find relevant information in the project files to answer your question."
        else:
            for ctx in context:
                answer += f"From {ctx['filename']} ({ctx['project_name']}):\n{ctx['content']}\n\n"

        return {
            'answer': answer,
            'sources': [
                {
                    'filename': c['filename'],
                    'project_name': c['project_name'],
                    'similarity': c.get('similarity'),
                }
                for c in context
            ],
            'tokens_used': None,
        }

    def get_conversation_history(self, conversation_id: str) -> Optional[Dict]:
        """Get conversation history"""
        # This will be implemented with MongoDB integration
        return None

    def get_user_conversations(self, user_id: str, limit: int = 20) -> List[Dict]:
        """Get user conversations"""
        # This will be implemented with MongoDB integration
        return []

    def clear_conversation(self, conversation_id: str) -> Dict:
        """Clear conversation"""
        # This will be implemented with MongoDB integration
        return {'success': True}
