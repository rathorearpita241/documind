from fastapi import APIRouter
from app.models.schemas import ChatRequest, ChatResponse
from app.services.rag import answer

router = APIRouter()


@router.post("/", response_model=ChatResponse)
def chat(req: ChatRequest):
    return answer(req.query, req.session_id)
