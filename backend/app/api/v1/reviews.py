from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.review import Review
from app.models.user import User

router = APIRouter()


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_review(
    booking_id: str,
    rating: int,
    comment: str = "",
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Submit a review for a completed booking."""
    from uuid import UUID

    if not (1 <= rating <= 5):
        raise HTTPException(status_code=400, detail="Rating must be between 1 and 5")

    review = Review(
        booking_id=UUID(booking_id),
        reviewer_id=current_user.id,
        rating=rating,
        comment=comment,
    )
    db.add(review)
    await db.commit()
    await db.refresh(review)
    return review


@router.get("/provider/{provider_id}")
async def get_provider_reviews(provider_id: str, db: AsyncSession = Depends(get_db)):
    """List all reviews for a provider."""
    from uuid import UUID

    result = await db.execute(
        select(Review).where(Review.provider_id == UUID(provider_id))
    )
    return result.scalars().all()
