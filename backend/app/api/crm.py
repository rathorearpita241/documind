from fastapi import APIRouter
from pydantic import BaseModel
from app.models.schemas import CRMTicket, ChatResponse
from app.services.crm import build_ticket

router = APIRouter()


class TicketRequest(BaseModel):
    query: str
    response: ChatResponse


@router.post("/ticket", response_model=CRMTicket)
def create_ticket(req: TicketRequest):
    return build_ticket(req.query, req.response)
