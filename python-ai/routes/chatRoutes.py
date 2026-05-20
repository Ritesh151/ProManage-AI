"""
Chat Routes
"""

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel
from services.AIChatService import AIChatService
from utils.logger import get_logger

logger = get_logger(__name__)
router = APIRouter(prefix="/chat", tags=["chat"])

chat_service = AIChatService()


class ChatRequest(BaseModel):
    """Chat request model"""
    question: str
    conversation_id: str = None
    user_id: str = "anonymous"


class FeedbackRequest(BaseModel):
    """Feedback request model"""
    conversation_id: str
    rating: int = None
    comment: str = None
    helpful: bool = None


@router.post("")
async def chat(request: ChatRequest):
    """Send chat message"""
    try:
        if not request.question:
            raise HTTPException(status_code=400, detail="Question is required")

        logger.info(f"Chat request: {request.question[:100]}")

        response = chat_service.chat(
            request.question,
            request.conversation_id,
            request.user_id
        )

        return {
            'success': True,
            **response,
        }
    except Exception as e:
        logger.error(f"Chat error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conversation/{conversation_id}")
async def get_conversation(conversation_id: str):
    """Get conversation history"""
    try:
        conversation = chat_service.get_conversation_history(conversation_id)

        if not conversation:
            raise HTTPException(status_code=404, detail="Conversation not found")

        return {
            'success': True,
            'conversation': conversation,
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Get conversation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.get("/conversations")
async def get_conversations(user_id: str = "anonymous", limit: int = 20):
    """Get user conversations"""
    try:
        conversations = chat_service.get_user_conversations(user_id, limit)

        return {
            'success': True,
            'conversations': conversations,
        }
    except Exception as e:
        logger.error(f"Get conversations error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.delete("/conversation/{conversation_id}")
async def clear_conversation(conversation_id: str):
    """Clear conversation"""
    try:
        result = chat_service.clear_conversation(conversation_id)

        return {
            'success': True,
            'message': 'Conversation cleared',
        }
    except Exception as e:
        logger.error(f"Clear conversation error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


@router.post("/feedback")
async def submit_feedback(request: FeedbackRequest):
    """Submit feedback"""
    try:
        if not request.conversation_id:
            raise HTTPException(status_code=400, detail="Conversation ID is required")

        logger.info(f"Feedback submitted: {request.conversation_id}")

        return {
            'success': True,
            'message': 'Feedback submitted',
        }
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Feedback error: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
