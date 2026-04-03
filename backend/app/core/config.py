from pydantic_settings import BaseSettings

class Settings(BaseSettings):
    anthropic_api_key: str
    chroma_persist_dir: str = "./data/vectordb"
    upload_dir: str = "./data/uploads"
    chunk_size: int = 512
    chunk_overlap: int = 50
    top_k_retrieval: int = 6
    embedding_model: str = "all-MiniLM-L6-v2"

    class Config:
        env_file = ".env"

settings = Settings()
