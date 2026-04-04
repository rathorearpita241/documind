from app.core.vectorstore import get_collection, get_embedder
from pypdf import PdfReader
import io

def ingest_file(file_bytes, filename):
    
    # ✅ Handle PDF
    if filename.endswith(".pdf"):
        pdf = PdfReader(io.BytesIO(file_bytes))
        text = ""
        for page in pdf.pages:
            text += page.extract_text() or ""
    else:
        text = file_bytes.decode("utf-8", errors="ignore")

    collection = get_collection()
    embedder = get_embedder()

    chunks = [text[i:i+500] for i in range(0, len(text), 500)]

    embeddings = embedder.embed_documents(chunks)

    ids = [f"{filename}_{i}" for i in range(len(chunks))]

    collection.add(
        documents=chunks,
        embeddings=embeddings,
        ids=ids
    )

    return {"chunks_added": len(chunks)}