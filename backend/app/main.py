from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import documents, chat, crm

<<<<<<< HEAD
app = FastAPI(title="Documind API", version="1.0.0")
=======
app = FastAPI(title="KnowDesk API", version="1.0.0")
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(documents.router, prefix="/api/documents", tags=["documents"])
app.include_router(chat.router, prefix="/api/chat", tags=["chat"])
app.include_router(crm.router, prefix="/api/crm", tags=["crm"])

@app.get("/")
def root():
<<<<<<< HEAD
    return {"status": "ok", "service": "Documind"}
=======
    return {"status": "ok", "service": "KnowDesk"}
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
