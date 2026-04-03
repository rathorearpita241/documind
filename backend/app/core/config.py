from pydantic_settings import BaseSettings

class Settings(BaseSettings):
<<<<<<< HEAD
=======
    anthropic_api_key: str
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
    chroma_persist_dir: str = "./data/vectordb"
    upload_dir: str = "./data/uploads"
    chunk_size: int = 512
    chunk_overlap: int = 50
    top_k_retrieval: int = 6
    embedding_model: str = "all-MiniLM-L6-v2"

    class Config:
        env_file = ".env"

<<<<<<< HEAD
settings = Settings()
=======
settings = Settings()
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
