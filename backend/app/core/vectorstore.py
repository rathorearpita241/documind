import chromadb
from sentence_transformers import SentenceTransformer
from app.core.config import settings

_client = None
_collection = None
_embedder = None


def get_embedder():
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer(settings.embedding_model)
    return _embedder


def get_collection():
    global _client, _collection
    if _collection is None:
        _client = chromadb.PersistentClient(path=settings.chroma_persist_dir)
        _collection = _client.get_or_create_collection(
            name="knowdesk",
            metadata={"hnsw:space": "cosine"}
        )
    return _collection
