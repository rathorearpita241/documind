from fastapi import APIRouter
from pydantic import BaseModel
from app.services.rag import answer

router = APIRouter()

class Query(BaseModel):
    question: str

@router.post("/ask")
def ask_question(query: Query):
    response = answer(query.question)
    return {"answer": response}