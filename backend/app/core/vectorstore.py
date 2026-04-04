import chromadb
from chromadb.config import Settings
from langchain_community.embeddings import HuggingFaceEmbeddings

CHROMA_DB_DIR = "db"

client = chromadb.Client(
    Settings(persist_directory=CHROMA_DB_DIR)
)

def get_collection(name="documents"):
    return client.get_or_create_collection(name=name)

# ✅ FAST + RELIABLE EMBEDDINGS
def get_embedder():
    return HuggingFaceEmbeddings(model_name="all-MiniLM-L6-v2")