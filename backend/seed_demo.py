#!/usr/bin/env python3
"""
Seed script: loads the sample documents into ChromaDB for demo purposes.
Run from the backend/ directory:
    python seed_demo.py
"""
import sys
import os
sys.path.insert(0, os.path.dirname(__file__))

from dotenv import load_dotenv
load_dotenv()

from app.services.ingestion import ingest_file

SAMPLE_DOCS = [
    {
        "path": "data/sample_docs/refund_policy_v2.txt",
        "name": "Refund Policy v2.pdf",
        "type": "eml",
        "date": "2024-03-01",
    },
    {
        "path": "data/sample_docs/refund_policy_v1_old.txt",
        "name": "Refund Policy v1 (Old).pdf",
        "type": "eml",
        "date": "2023-12-01",
    },
    {
        "path": "data/sample_docs/acme_corp_thread.txt",
        "name": "Acme Corp thread",
        "type": "eml",
        "date": "2024-03-12",
    },
]

if __name__ == "__main__":
    print("Seeding demo documents into ChromaDB...")
    for doc in SAMPLE_DOCS:
        if not os.path.exists(doc["path"]):
            print(f"  SKIP (not found): {doc['path']}")
            continue
        n = ingest_file(doc["path"], doc["name"], doc["type"], doc["date"])
        print(f"  OK  {doc['name']} → {n} chunks")
    print("\nDone! Start the server: uvicorn app.main:app --reload")
