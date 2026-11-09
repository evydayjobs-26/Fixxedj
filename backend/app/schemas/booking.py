from __future__ import annotations
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.core.constants import BookingStatus


class BookingBase(BaseModel):
    service_id: uuid.UUID
    address: str
    scheduled_at: datetime
    notes: str | None = None
    latitude: float | None = None
    longitude: float | None = None


class BookingCreate(BookingBase):
    pass


class BookingUpdate(BaseModel):
    status: BookingStatus | None = None
    notes: str | None = None


class BookingRead(BookingBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    customer_id: uuid.UUID
    worker_id: uuid.UUID | None
    status: BookingStatus
    total_amount: float
    created_at: datetime
    started_at: datetime | None
    completed_at: datetime | None
