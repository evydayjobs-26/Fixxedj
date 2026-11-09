from __future__ import annotations
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict


class ServiceBase(BaseModel):
    name: str
    category: str
    description: str | None = None
    base_price: float
    duration_minutes: int = 60
    icon_url: str | None = None


class ServiceCreate(ServiceBase):
    slug: str


class ServiceUpdate(BaseModel):
    name: str | None = None
    description: str | None = None
    base_price: float | None = None
    is_active: bool | None = None


class ServiceRead(ServiceBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    slug: str
    is_active: bool
    created_at: datetime
