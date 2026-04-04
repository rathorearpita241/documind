import chromadb
from chromadb.config import Settings as ChromaSettings
from sentence_transformers import SentenceTransformer

from app.core.config import settings

_client = None
_collection = None
_embedder = None


def get_client():
    global _client
    if _client is None:
        _client = chromadb.Client(
            ChromaSettings(persist_directory=settings.chroma_persist_dir)
        )
    return _client


def get_collection():
    global _collection
    if _collection is None:
        client = get_client()
        _collection = client.get_or_create_collection(name="documind")
    return _collection


def get_embedder():
    global _embedder
    if _embedder is None:
        _embedder = SentenceTransformer(settings.embedding_model)
    return _embedder