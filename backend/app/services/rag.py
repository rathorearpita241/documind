"""
RAG engine using Ollama (improved)
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

    # 🔥 REMOVE DUPLICATES
    seen = set()
    chunks = []

    for i, doc in enumerate(results["documents"][0]):
        meta = results["metadatas"][0][i]
        dist = results["distances"][0][i]

        key = doc[:100]

        if key not in seen:
            seen.add(key)
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
        f"[{i+1}] {c['meta']['doc_name']} | {c['meta']['doc_date']}\n{c['text']}"
        for i, c in enumerate(chunks[:4])
    )

    prompt = f"""
Check if these documents contradict each other:

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
        return m.group(1).strip() if m else None

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
        f"[Source {i+1}: {c['meta']['doc_name']} | {c['meta']['section']} | {c['meta']['doc_date']}]\n{c['text']}"
        for i, c in enumerate(chunks)
    )

    system_prompt = """You are DocuMind AI.

- Answer ONLY from provided sources
- Always cite [Source N]
- If conflict exists:
    - Explain both sides
    - Prefer newer document
    - Explain why
- Combine multiple sources
"""

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
            excerpt=c["text"][:180],
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