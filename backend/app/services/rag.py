from app.core.vectorstore import get_collection, get_embedder
import ollama

def answer(query):
    collection = get_collection()
    embedder = get_embedder()

    # Embed query
    query_embedding = embedder.embed_query(query)

    # Retrieve docs
    results = collection.query(
        query_embeddings=[query_embedding],
        n_results=3
    )

    documents = results.get("documents", [[]])[0]

    # 🚨 If nothing retrieved → clear message
    if not documents:
        return "No relevant data found. Please upload document again."

    context = "\n".join(documents)

    prompt = f"""
Answer the question using ONLY the context below.

Context:
{context}

Question:
{query}
"""

    response = ollama.chat(
        model="llama3",
        messages=[{"role": "user", "content": prompt}]
    )

    return response["message"]["content"]