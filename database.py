from __future__ import annotations

import logging
import os
from collections.abc import Iterable
from typing import Any

import firebase_admin
from firebase_admin import firestore

logger = logging.getLogger(__name__)

_db: firestore.Client | None = None


def get_firestore_client() -> firestore.Client:
    """Return one process-local client, reusing connections across requests."""
    global _db
    if _db is None:
        # Cloud Run uses the attached service account's Application Default
        # Credentials; no key files or credentials are stored in the image.
        try:
            firebase_admin.get_app()
        except ValueError:
            project_id = os.getenv("GCP_PROJECT_ID")
            options = {"projectId": project_id} if project_id else None
            firebase_admin.initialize_app(options=options)
        _db = firestore.client()
    return _db


def save_application(application: dict[str, Any]) -> str:
    db = get_firestore_client()
    reference = db.collection("applications").document()
    reference.set(application)
    logger.info("Firestore application write succeeded: %s", reference.id)
    return reference.id


def batch_ingest_applications(records: Iterable[dict[str, Any]]) -> int:
    """Write records in Firestore-sized batches and return the record count."""
    db = get_firestore_client()
    records = list(records)
    written = 0

    # Firestore limits a commit to 500 writes, so chunk large imports.
    for start in range(0, len(records), 500):
        batch = db.batch()
        chunk = records[start : start + 500]
        references = []
        for record in chunk:
            reference = db.collection("applications").document()
            references.append(reference)
            batch.set(reference, record)
        batch.commit()
        written += len(references)
        logger.info("Firestore batch write succeeded: %d applications", len(references))

    return written