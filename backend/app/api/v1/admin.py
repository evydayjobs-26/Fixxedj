from fastapi import APIRouter, Depends
from sqlalchemy import func, select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user, require_admin
from app.models.user import User
from app.models.booking import Booking
from app.models.payment import Payment

router = APIRouter()


@router.get("/stats", dependencies=[require_admin])
async def platform_stats(db: AsyncSession = Depends(get_db)):
    """High-level platform statistics for the admin dashboard."""
    total_users = (await db.execute(select(func.count(User.id)))).scalar()
    total_bookings = (await db.execute(select(func.count(Booking.id)))).scalar()
    total_revenue = (await db.execute(select(func.sum(Payment.amount)))).scalar() or 0

    return {
        "total_users": total_users,
        "total_bookings": total_bookings,
        "total_revenue_inr": float(total_revenue),
    }


@router.get("/users", dependencies=[require_admin])
async def list_all_users(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    """List all users (paginated)."""
    result = await db.execute(select(User).offset(skip).limit(limit))
    return result.scalars().all()


@router.patch("/users/{user_id}/toggle-active", dependencies=[require_admin])
async def toggle_user_active(user_id: str, db: AsyncSession = Depends(get_db)):
    """Activate or deactivate a user account."""
    from uuid import UUID

    result = await db.execute(select(User).where(User.id == UUID(user_id)))
    user = result.scalar_one_or_none()
    if user:
        user.is_active = not user.is_active
        await db.commit()
    return {"user_id": user_id, "is_active": user.is_active if user else None}


@router.get("/bookings", dependencies=[require_admin])
async def list_all_bookings(
    skip: int = 0, limit: int = 100, db: AsyncSession = Depends(get_db)
):
    """List all bookings (paginated)."""
    result = await db.execute(select(Booking).offset(skip).limit(limit))
    return result.scalars().all()
