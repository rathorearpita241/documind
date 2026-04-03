from pydantic import BaseModel
from typing import Optional


class DocumentMeta(BaseModel):
    id: str
    name: str
    source_type: str   # pdf | xlsx | eml
    date_uploaded: str
    chunk_count: int


class SourceChunk(BaseModel):
    doc_id: str
    doc_name: str
    source_type: str
    excerpt: str
    section: Optional[str] = None
    relevance: float


class ConflictFlag(BaseModel):
    detected: bool
    doc_a: Optional[str] = None
    doc_b: Optional[str] = None
    topic: Optional[str] = None
    resolution: Optional[str] = None  # which doc was trusted and why


class ChatRequest(BaseModel):
    query: str
    session_id: Optional[str] = "default"


class ChatResponse(BaseModel):
    answer: str
    sources: list[SourceChunk]
    conflict: ConflictFlag
    session_id: str


class CRMTicket(BaseModel):
    customer: Optional[str] = None
    query_type: Optional[str] = None
    resolution: Optional[str] = None
    sources_cited: list[str] = []
    conflict_flag: Optional[str] = None
    created_at: str = ""
