"""
RAG engine using Ollama (local LLM)
"""
import re
import ollama

from app.core.config import settings
from app.core.vectorstore import get_collection, get_embedder
from app.models.schemas import SourceChunk, ConflictFlag, ChatResponse


def retrieve(query: str, k: int = settings.top_k_retrieval):
    embedder = get_embedder()
    collection = get_collection()

    q_emb = embedder.encode([query]).tolist()

    results = collection.query(
        query_embeddings=q_emb,
        n_results=k,
        include=["documents", "metadatas", "distances"]
    )

    chunks = []
    for i, doc in enumerate(results["documents"][0]):
        meta = results["metadatas"][0][i]
        dist = results["distances"][0][i]

        chunks.append({
            "text": doc,
            "meta": meta,
            "relevance": round(1 - dist, 3),
        })

    return chunks


def detect_conflict(chunks) -> ConflictFlag:
    if len(chunks) < 2:
        return ConflictFlag(detected=False)

    excerpts = "\n\n".join(
        f"[{i+1}] SOURCE: {c['meta']['doc_name']} | DATE: {c['meta']['doc_date']}\n{c['text']}"
        for i, c in enumerate(chunks[:4])
    )

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

    def extract(label):
        m = re.search(rf"{label}:\s*(.+)", text, re.IGNORECASE)
        v = m.group(1).strip() if m else None
        return None if v and v.lower() == "none" else v

    detected = (extract("CONFLICT") or "no").lower() == "yes"

    return ConflictFlag(
        detected=detected,
        doc_a=extract("DOC_A") if detected else None,
        doc_b=extract("DOC_B") if detected else None,
        topic=extract("TOPIC") if detected else None,
        resolution=extract("RESOLUTION") if detected else None,
    )


def answer(query: str, session_id: str = "default") -> ChatResponse:
    chunks = retrieve(query)

    if not chunks:
        return ChatResponse(
            answer="No relevant information found.",
            sources=[],
            conflict=ConflictFlag(detected=False),
            session_id=session_id,
        )

    conflict = detect_conflict(chunks)

    context = "\n\n".join(
        f"[Source {i+1}: {c['meta']['doc_name']} | {c['meta']['section']} | Date: {c['meta']['doc_date']}]\n{c['text']}"
        for i, c in enumerate(chunks)
    )

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
        answer=answer_text,
        sources=sources,
        conflict=conflict,
        session_id=session_id,
    )