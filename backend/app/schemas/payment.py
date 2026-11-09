from __future__ import annotations
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict

from app.models.payment import PaymentStatus


class PaymentBase(BaseModel):
    booking_id: uuid.UUID
    amount: float
    currency: str = "INR"


class PaymentCreate(PaymentBase):
    payer_id: uuid.UUID


class PaymentRead(PaymentBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    payer_id: uuid.UUID
    status: PaymentStatus
    stripe_payment_intent_id: str | None
    created_at: datetime
