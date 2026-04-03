"""
CRM ticket generator using Ollama
"""
import re
from datetime import datetime
import ollama

from app.models.schemas import CRMTicket, ChatResponse


def build_ticket(query: str, response: ChatResponse) -> CRMTicket:
    prompt = f"""
Extract CRM ticket:

USER QUERY: {query}
AI ANSWER: {response.answer}

Return:
CUSTOMER:
QUERY_TYPE:
RESOLUTION:
"""

    resp = ollama.chat(
        model='llama3',
        messages=[{"role": "user", "content": prompt}]
    )

    text = resp['message']['content']

    def extract(label):
        m = re.search(rf"{label}:\s*(.+)", text, re.IGNORECASE)
        return m.group(1).strip() if m else None

    return CRMTicket(
        customer=extract("CUSTOMER") or "Unknown",
        query_type=extract("QUERY_TYPE") or "General",
        resolution=extract("RESOLUTION") or response.answer[:150],
        sources_cited=[s.doc_name for s in response.sources],
        conflict_flag=response.conflict.resolution if response.conflict.detected else None,
        created_at=datetime.now().isoformat(),
    )