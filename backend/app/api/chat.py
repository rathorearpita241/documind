from fastapi import APIRouter
from pydantic import BaseModel

from app.services.rag import answer
from app.services.crm import build_ticket

router = APIRouter()

class ChatRequest(BaseModel):
    query: str
    session_id: str = "default"


@router.post("/")
def chat(req: ChatRequest):
    # 🔥 Get RAG response
    response = answer(req.query, req.session_id)

    # 🔥 AUTO CREATE CRM TICKET
    ticket = build_ticket(req.query, response)

    return {
        "answer": response.answer,
        "sources": response.sources,
        "conflict": response.conflict,
        "ticket": ticket   # 👈 NEW
    }