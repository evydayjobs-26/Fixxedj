from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.core.constants import BookingStatus, BOOKING_TRANSITIONS
from app.models.booking import Booking
from app.models.user import User

router = APIRouter()


@router.get("/")
async def list_bookings(
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """List bookings for the current user (customer or worker)."""
    from app.core.constants import Role

    query = select(Booking)
    if current_user.role == Role.CUSTOMER:
        query = query.where(Booking.customer_id == current_user.id)
    elif current_user.role == Role.WORKER:
        query = query.where(Booking.worker_id == current_user.id)

    result = await db.execute(query)
    return result.scalars().all()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_booking(
    service_id: str,
    scheduled_at: str,
    address: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Create a new booking (customer only)."""
    from app.services.booking_flow import create_booking as svc_create
    from uuid import UUID
    from datetime import datetime

    booking = await svc_create(
        db=db,
        customer_id=current_user.id,
        service_id=UUID(service_id),
        scheduled_at=datetime.fromisoformat(scheduled_at),
        address=address,
    )
    return booking


@router.get("/{booking_id}")
async def get_booking(
    booking_id: str,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Get a single booking by ID."""
    from uuid import UUID

    result = await db.execute(select(Booking).where(Booking.id == UUID(booking_id)))
    booking = result.scalar_one_or_none()
    if not booking:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Booking not found")
    return booking


@router.patch("/{booking_id}/status")
async def update_booking_status(
    booking_id: str,
    new_status: BookingStatus,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Transition a booking to a new status."""
    from app.services.booking_flow import update_status

    booking = await update_status(db, booking_id, new_status, current_user)
    return booking
