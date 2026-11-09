from __future__ import annotations
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ProviderBase(BaseModel):
    bio: str | None = None
    experience_years: int = 0
    is_available: bool = True
    latitude: float | None = None
    longitude: float | None = None


class ProviderCreate(ProviderBase):
    user_id: uuid.UUID


class ProviderUpdate(BaseModel):
    bio: str | None = None
    experience_years: int | None = None
    is_available: bool | None = None
    latitude: float | None = None
    longitude: float | None = None


class ProviderRead(ProviderBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    user_id: uuid.UUID
    rating: float
    total_reviews: int
    kyc_verified: bool
    created_at: datetime
