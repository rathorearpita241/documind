"""
<<<<<<< HEAD
RAG engine using Ollama (local LLM)
"""
import re
import ollama

=======
RAG engine: retrieve top-k chunks → detect conflicts → call Claude → return cited answer
"""
import re
import anthropic
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
from app.core.config import settings
from app.core.vectorstore import get_collection, get_embedder
from app.models.schemas import SourceChunk, ConflictFlag, ChatResponse

<<<<<<< HEAD
=======
client = anthropic.Anthropic(api_key=settings.anthropic_api_key)

>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227

def retrieve(query: str, k: int = settings.top_k_retrieval):
    embedder = get_embedder()
    collection = get_collection()
<<<<<<< HEAD

    q_emb = embedder.encode([query]).tolist()

=======
    q_emb = embedder.encode([query]).tolist()
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
    results = collection.query(
        query_embeddings=q_emb,
        n_results=k,
        include=["documents", "metadatas", "distances"]
    )
<<<<<<< HEAD

=======
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
    chunks = []
    for i, doc in enumerate(results["documents"][0]):
        meta = results["metadatas"][0][i]
        dist = results["distances"][0][i]
<<<<<<< HEAD

=======
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
        chunks.append({
            "text": doc,
            "meta": meta,
            "relevance": round(1 - dist, 3),
        })
<<<<<<< HEAD

=======
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
    return chunks


def detect_conflict(chunks) -> ConflictFlag:
<<<<<<< HEAD
=======
    """Ask Claude if any two retrieved chunks contradict each other."""
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
    if len(chunks) < 2:
        return ConflictFlag(detected=False)

    excerpts = "\n\n".join(
        f"[{i+1}] SOURCE: {c['meta']['doc_name']} | DATE: {c['meta']['doc_date']}\n{c['text']}"
        for i, c in enumerate(chunks[:4])
    )

<<<<<<< HEAD
    prompt = f"""
Check if any of these documents contradict each other:

{excerpts}

Respond EXACTLY:
CONFLICT: yes or no
DOC_A:
DOC_B:
TOPIC:
RESOLUTION:
"""

    resp = ollama.chat(
        model='llama3',
        messages=[{"role": "user", "content": prompt}]
    )

    text = resp['message']['content']
=======
    prompt = f"""You are a conflict detection system. Review these document excerpts.
Determine if any two contain factually contradictory information (different numbers, policies, dates, rules about the same topic).

{excerpts}

Respond in EXACTLY this format (no extra text):
CONFLICT: yes or no
DOC_A: (document name if conflict, else none)
DOC_B: (document name if conflict, else none)
TOPIC: (one sentence describing what they disagree on, else none)
RESOLUTION: (which document to trust and why — prefer newer dates, else none)"""

    resp = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=300,
        messages=[{"role": "user", "content": prompt}]
    )
    text = resp.content[0].text.strip()
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227

    def extract(label):
        m = re.search(rf"{label}:\s*(.+)", text, re.IGNORECASE)
        v = m.group(1).strip() if m else None
        return None if v and v.lower() == "none" else v

    detected = (extract("CONFLICT") or "no").lower() == "yes"
<<<<<<< HEAD

=======
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
    return ConflictFlag(
        detected=detected,
        doc_a=extract("DOC_A") if detected else None,
        doc_b=extract("DOC_B") if detected else None,
        topic=extract("TOPIC") if detected else None,
        resolution=extract("RESOLUTION") if detected else None,
    )


def answer(query: str, session_id: str = "default") -> ChatResponse:
    chunks = retrieve(query)
<<<<<<< HEAD

    if not chunks:
        return ChatResponse(
            answer="No relevant information found.",
=======
    if not chunks:
        return ChatResponse(
            answer="I couldn't find relevant information in the knowledge base. Try uploading more documents.",
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
            sources=[],
            conflict=ConflictFlag(detected=False),
            session_id=session_id,
        )

    conflict = detect_conflict(chunks)

    context = "\n\n".join(
        f"[Source {i+1}: {c['meta']['doc_name']} | {c['meta']['section']} | Date: {c['meta']['doc_date']}]\n{c['text']}"
        for i, c in enumerate(chunks)
    )

<<<<<<< HEAD
    system_prompt = """You are DocuMind AI.
Answer ONLY using given sources.
Cite like [Source 1].
Be concise."""

    user_prompt = f"""
Context:
{context}

Question:
{query}
"""

    resp = ollama.chat(
        model='llama3',
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt}
        ]
    )

    answer_text = resp['message']['content']

=======
    system_prompt = """You are KnowDesk, an intelligent knowledge assistant for a small business.
Answer questions using ONLY the provided document sources.
Always cite sources inline as [Source N].
Be concise and direct. If sources conflict, prefer the newer one and mention it briefly.
Never invent information not present in the sources."""

    user_prompt = f"""Context from knowledge base:
{context}

Question: {query}

Answer with inline source citations [Source N]:"""

    resp = client.messages.create(
        model="claude-sonnet-4-5",
        max_tokens=700,
        system=system_prompt,
        messages=[{"role": "user", "content": user_prompt}]
    )

>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
    sources = [
        SourceChunk(
            doc_id=c["meta"]["doc_id"],
            doc_name=c["meta"]["doc_name"],
            source_type=c["meta"]["source_type"],
            excerpt=(c["text"][:180] + "…") if len(c["text"]) > 180 else c["text"],
            section=c["meta"]["section"],
            relevance=c["relevance"],
        )
        for c in chunks
    ]

    return ChatResponse(
<<<<<<< HEAD
        answer=answer_text,
        sources=sources,
        conflict=conflict,
        session_id=session_id,
    )
=======
        answer=resp.content[0].text.strip(),
        sources=sources,
        conflict=conflict,
        session_id=session_id,
    )
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
