from __future__ import annotations
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator


class ReviewBase(BaseModel):
    booking_id: uuid.UUID
    rating: int
    comment: str | None = None

    @field_validator("rating")
    @classmethod
    def rating_range(cls, v: int) -> int:
        if not (1 <= v <= 5):
            raise ValueError("Rating must be between 1 and 5")
        return v


class ReviewCreate(ReviewBase):
    pass


class ReviewRead(ReviewBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    reviewer_id: uuid.UUID
    provider_id: uuid.UUID | None
    created_at: datetime
