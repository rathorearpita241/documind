from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api import documents, chat

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ✅ IMPORTANT ROUTES
app.include_router(documents.router, prefix="/api/documents")
app.include_router(chat.router, prefix="/api/chat")

@app.get("/")
def root():
    return {"message": "Backend running"}