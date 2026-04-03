"""
CRM mock: extract ticket fields from a ChatResponse using Claude
"""
import re
from datetime import datetime
import anthropic
from app.core.config import settings
from app.models.schemas import CRMTicket, ChatResponse

client = anthropic.Anthropic(api_key=settings.anthropic_api_key)


def build_ticket(query: str, response: ChatResponse) -> CRMTicket:
    prompt = f"""Extract CRM support ticket fields from this interaction.

USER QUERY: {query}
AI ANSWER: {response.answer}
SOURCES USED: {', '.join(s.doc_name for s in response.sources)}

Return ONLY these lines, nothing else:
CUSTOMER: (company or person name mentioned, or Unknown)
QUERY_TYPE: (3-5 word category like 'Bulk order refund policy')
RESOLUTION: (one sentence summary of the resolution)"""

    resp = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=200,
        messages=[{"role": "user", "content": prompt}]
    )
    text = resp.content[0].text.strip()

    def extract(label):
        m = re.search(rf"{label}:\s*(.+)", text, re.IGNORECASE)
        return m.group(1).strip() if m else None

    return CRMTicket(
        customer=extract("CUSTOMER") or "Unknown",
        query_type=extract("QUERY_TYPE") or "General enquiry",
        resolution=extract("RESOLUTION") or response.answer[:150],
        sources_cited=[s.doc_name for s in response.sources],
        conflict_flag=response.conflict.resolution if response.conflict.detected else None,
        created_at=datetime.now().isoformat(),
    )
