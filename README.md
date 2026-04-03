<<<<<<< HEAD
# Documind — SME Knowledge Retrieval Agent
=======
# KnowDesk — SME Knowledge Retrieval Agent
>>>>>>> 0df11b4b1dd14f34b1975cee0a720d8ae5d57227
> Ignisia AI Hackathon · SME01

A conversational RAG agent that unifies PDFs, Excel sheets, and emails into a single searchable knowledge base — with conflict detection and CRM auto-fill.

## Quick Start

### Backend
```bash
cd backend
python -m venv venv && source venv/bin/activate
pip install -r requirements.txt
cp .env.example .env   # add your ANTHROPIC_API_KEY
uvicorn app.main:app --reload
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

## Features
- Multi-format ingestion: PDF, Excel (.xlsx), Email (.eml)
- Semantic search via ChromaDB + sentence-transformers
- Conflict detection: flags contradictions across documents, trusts newer source
- Source attribution on every answer (document + section/row)
- CRM ticket auto-fill from AI answers

## Architecture
```
frontend (React)
    ↕ REST API
backend (FastAPI)
    ├── Ingestion Pipeline   (PDF/XLS/EML parsers → chunker → embedder → ChromaDB)
    ├── RAG Engine           (retriever → LLM → cited answer)
    ├── Conflict Detector    (cross-source contradiction checker)
    └── CRM Mock             (ticket auto-population)
```

## Domain
SME01 · Tools for Small and Medium Enterprise · Ignisia 2024
