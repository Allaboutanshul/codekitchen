from __future__ import annotations

from datetime import datetime

from pydantic import BaseModel, ConfigDict, Field, StrictFloat, StrictInt, StrictStr


class OptimizePipelineRequest(BaseModel):
    model_config = ConfigDict(extra="forbid")

    resume_text: StrictStr = Field(min_length=1, max_length=100_000)
    job_description: StrictStr = Field(min_length=1, max_length=100_000)
    company: StrictStr = Field(min_length=1, max_length=500)


class HistoricalApplication(BaseModel):
    model_config = ConfigDict(extra="forbid")

    company: StrictStr = Field(min_length=1, max_length=500)
    job_title: StrictStr = Field(min_length=1, max_length=500)
    status: StrictStr = Field(min_length=1, max_length=200)
    match_score: StrictInt | StrictFloat = Field(ge=0, le=100)
    historical_drafts: list[StrictStr] = Field(default_factory=list)
    generated_draft: StrictStr = ""
    next_nudge: StrictStr | datetime | None = None


class AIOptimizationResult(BaseModel):
    model_config = ConfigDict(extra="ignore")

    match_score: float = Field(ge=0, le=100)
    strengths: list[str] = Field(default_factory=list)
    gaps: list[str] = Field(default_factory=list)
    outreach_email: str = Field(min_length=1)