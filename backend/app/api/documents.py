import shutil
from pathlib import Path
from fastapi import APIRouter, UploadFile, File, HTTPException, Form
from app.core.config import settings
from app.services.ingestion import ingest_file, list_documents

router = APIRouter()

ALLOWED_EXTENSIONS = {".pdf", ".xlsx", ".eml", ".txt"}


@router.post("/upload")
async def upload_document(
    file: UploadFile = File(...),
    doc_date: str = Form(default="2024-01-01")
):
    ext = Path(file.filename).suffix.lower()
    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(400, f"Unsupported file type: {ext}. Allowed: pdf, xlsx, eml, txt")

    source_type = "pdf" if ext == ".pdf" else ("xlsx" if ext == ".xlsx" else "eml")

    dest = Path(settings.upload_dir) / file.filename
    dest.parent.mkdir(parents=True, exist_ok=True)

    with open(dest, "wb") as f:
        shutil.copyfileobj(file.file, f)

    chunk_count = ingest_file(str(dest), file.filename, source_type, doc_date)
    return {
        "message": "Ingested successfully",
        "chunks": chunk_count,
        "filename": file.filename,
        "source_type": source_type,
    }


@router.get("/")
def get_documents():
    return list_documents()
