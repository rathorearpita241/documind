from fastapi import APIRouter, UploadFile, File
from app.services.ingestion import ingest_file

router = APIRouter()


@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    try:
        content = await file.read()

        result = ingest_file(content, file.filename)

        return {
            "message": "File uploaded successfully",
            "filename": file.filename,
            "result": result
        }

    except Exception as e:
        return {
            "error": str(e)
        }