"""Booking lifecycle management."""
from __future__ import annotations

import uuid
from datetime import datetime

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.constants import BookingStatus, BOOKING_TRANSITIONS
from app.models.booking import Booking
from app.models.service import Service
from app.models.user import User


async def create_booking(
    db: AsyncSession,
    customer_id: uuid.UUID,
    service_id: uuid.UUID,
    scheduled_at: datetime,
    address: str,
    notes: str | None = None,
    latitude: float | None = None,
    longitude: float | None = None,
) -> Booking:
    """Create a new booking in PENDING state."""
    # Verify service exists
    svc_result = await db.execute(select(Service).where(Service.id == service_id))
    service = svc_result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=404, detail="Service not found")

    booking = Booking(
        customer_id=customer_id,
        service_id=service_id,
        status=BookingStatus.PENDING,
        scheduled_at=scheduled_at,
        address=address,
        notes=notes,
        latitude=latitude,
        longitude=longitude,
        total_amount=service.base_price,
    )
    db.add(booking)
    await db.commit()
    await db.refresh(booking)
    return booking


async def update_status(
    db: AsyncSession,
    booking_id: str,
    new_status: BookingStatus,
    actor: User,
) -> Booking:
    """Transition a booking to a new status, enforcing allowed transitions."""
    result = await db.execute(
        select(Booking).where(Booking.id == uuid.UUID(booking_id))
    )
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=404, detail="Booking not found")

    allowed = BOOKING_TRANSITIONS.get(booking.status, [])
    if new_status not in allowed:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail=f"Cannot transition from {booking.status} to {new_status}",
        )

    booking.status = new_status
    if new_status == BookingStatus.IN_PROGRESS:
        from datetime import timezone
        booking.started_at = datetime.now(timezone.utc)
    elif new_status == BookingStatus.COMPLETED:
        from datetime import timezone
        booking.completed_at = datetime.now(timezone.utc)

    await db.commit()
    await db.refresh(booking)
    return booking
