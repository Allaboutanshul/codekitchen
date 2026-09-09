from __future__ import annotations

import logging
from typing import Annotated, Any

from fastapi import Depends, FastAPI, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from firebase_admin import firestore

from ai_service import generate_optimization
from database import batch_ingest_applications, save_application
from models import HistoricalApplication, OptimizePipelineRequest

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="FitMatch AI", version="1.0.0")
bearer_scheme = HTTPBearer(auto_error=False)


async def get_current_user(
    credentials: Annotated[HTTPAuthorizationCredentials | None, Depends(bearer_scheme)],
) -> dict[str, Any]:
    """Authentication seam: replace this stub with Firebase token verification."""
    # Routes remain usable during local development; Cloud Run authentication
    # or Firebase Admin token verification can be enforced here in production.
    return {"authenticated": credentials is not None}


@app.get("/healthz")
async def health_check() -> dict[str, str]:
    return {"status": "ok"}


@app.post("/api/v1/optimize-pipeline", status_code=status.HTTP_201_CREATED)
async def optimize_pipeline(
    payload: OptimizePipelineRequest,
    _: Annotated[dict[str, Any], Depends(get_current_user)],
) -> dict[str, Any]:
    try:
        optimization = generate_optimization(
            payload.resume_text,
            payload.job_description,
            payload.company,
        )
        application_id = save_application(
            {
                "company": payload.company,
                "job_title": "Unspecified",
                "status": "Draft Generated",
                "match_score": optimization.match_score,
                "historical_drafts": [],
                "generated_draft": optimization.outreach_email,
                "next_nudge": None,
                "created_at": firestore.SERVER_TIMESTAMP,
                "strengths": optimization.strengths,
                "gaps": optimization.gaps,
            }
        )
        return {"application_id": application_id, **optimization.model_dump()}
    except Exception as error:
        logger.exception("Optimization pipeline failed")
        raise HTTPException(status_code=502, detail="Optimization service unavailable") from error


@app.post("/api/v1/ingest-historical-data")
async def ingest_historical_data(
    payload: list[HistoricalApplication],
    _: Annotated[dict[str, Any], Depends(get_current_user)],
) -> dict[str, int]:
    try:
        records = [
            {
                **record.model_dump(exclude_none=True),
                "created_at": firestore.SERVER_TIMESTAMP,
            }
            for record in payload
        ]
        written = batch_ingest_applications(records)
        return {"inserted": written}
    except Exception as error:
        logger.exception("Historical data ingestion failed")
        raise HTTPException(status_code=500, detail="Historical data ingestion failed") from error