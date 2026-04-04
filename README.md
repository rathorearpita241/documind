# 🧠 DocuMind — AI-Powered Document Intelligence System

DocuMind is a full-stack **Retrieval-Augmented Generation (RAG)** system that allows users to upload documents and ask intelligent questions based on their content.

It uses **local LLMs via Ollama**, ensuring privacy, speed, and zero external API dependency.

---

## 🚀 Features

- 📄 Upload PDF / text documents
- 🔍 Semantic search using vector embeddings
- 🤖 AI-powered question answering using **Ollama (local LLM)**
- ⚡ Fast retrieval with ChromaDB vector store
- 💬 Interactive chat interface (React frontend)
- 🔐 Fully local — no external API calls required

---

## 🧠 How It Works (RAG Pipeline)

User Upload → Text Extraction → Chunking → Embedding → Vector Store
↓
User Query → Embedding → Similarity Search → Context Retrieval
↓
Ollama LLM (llama3) → Final Answer


---

## 🏗️ Tech Stack

### 🔹 Backend
- ⚡ FastAPI (Python)
- 🧠 Ollama (local LLM - llama3)
- 📦 ChromaDB (vector database)
- 🔍 LangChain Embeddings / Sentence Transformers

### 🔹 Frontend
- ⚛️ React (Vite)
- 🎨 Custom UI components
- 🌐 Fetch API for backend communication

---

## 🤖 Ollama Integration

DocuMind uses **Ollama** to run LLMs locally:

- Model used: `llama3`
- No API keys required
- Fully offline capability
- Ensures data privacy

### Run Ollama:

```bash
ollama serve
ollama pull llama3


