from __future__ import annotations

import json
import logging
import os
import time
import vertexai
from google.api_core import exceptions as google_exceptions
from vertexai.generative_models import GenerationConfig, GenerativeModel

from models import AIOptimizationResult

logger = logging.getLogger(__name__)

_model: GenerativeModel | None = None


def get_gemini_model() -> GenerativeModel:
    global _model
    if _model is None:
        project_id = os.getenv("GCP_PROJECT_ID")
        if not project_id:
            raise RuntimeError("GCP_PROJECT_ID must be set")
        vertexai.init(
            project=project_id,
            location=os.getenv("VERTEX_AI_LOCATION", "us-central1"),
        )
        _model = GenerativeModel("gemini-1.5-flash")
    return _model


def _is_rate_limit_error(error: Exception) -> bool:
    return isinstance(error, (google_exceptions.ResourceExhausted, google_exceptions.TooManyRequests))


def generate_optimization(
    resume_text: str,
    job_description: str,
    company: str,
    *,
    max_attempts: int = 4,
) -> AIOptimizationResult:
    prompt = f"""
You are an expert recruiting assistant. Evaluate the candidate's fit for the role,
then write a concise, highly tailored outreach email to the hiring team at {company}.
Use only evidence in the supplied resume and job description. Return valid JSON with
exactly these fields: match_score (number from 0 to 100), strengths (array of strings),
gaps (array of strings), outreach_email (string). Do not include markdown fences.

RESUME:
{resume_text}

JOB DESCRIPTION:
{job_description}
""".strip()

    generation_config = GenerationConfig(
        temperature=0.25,
        max_output_tokens=1_500,
        response_mime_type="application/json",
    )
    delay_seconds = 1.0
    started_at = time.perf_counter()

    for attempt in range(1, max_attempts + 1):
        try:
            response = get_gemini_model().generate_content(
                prompt,
                generation_config=generation_config,
            )
            result = AIOptimizationResult.model_validate(json.loads(response.text))
            latency_ms = (time.perf_counter() - started_at) * 1000
            logger.info("Vertex AI generation succeeded in %.0f ms", latency_ms)
            return result
        except Exception as error:
            if not _is_rate_limit_error(error) or attempt == max_attempts:
                logger.exception("Vertex AI generation failed on attempt %d", attempt)
                raise
            logger.warning(
                "Vertex AI rate limited request; retrying attempt %d in %.1f seconds",
                attempt + 1,
                delay_seconds,
            )
            time.sleep(delay_seconds)
            delay_seconds *= 2

    raise RuntimeError("Vertex AI generation exhausted retries")