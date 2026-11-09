from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.api.deps import get_current_user
from app.models.user import User
from app.services.matching import find_nearby_providers

router = APIRouter()


@router.get("/nearby")
async def nearby_providers(
    lat: float = Query(..., description="Latitude"),
    lon: float = Query(..., description="Longitude"),
    service_id: str | None = Query(None),
    radius_km: float = Query(10.0, description="Search radius in km"),
    db: AsyncSession = Depends(get_db),
):
    """Find providers near the given coordinates."""
    providers = await find_nearby_providers(db, lat, lon, radius_km, service_id)
    return providers


@router.get("/{provider_id}")
async def get_provider(provider_id: str, db: AsyncSession = Depends(get_db)):
    """Get a provider profile by ID."""
    from sqlalchemy import select
    from app.models.provider import Provider
    from uuid import UUID

    result = await db.execute(select(Provider).where(Provider.id == UUID(provider_id)))
    provider = result.scalar_one_or_none()
    return provider


@router.patch("/{provider_id}/location")
async def update_location(
    provider_id: str,
    lat: float,
    lon: float,
    current_user: User = Depends(get_current_user),
    db: AsyncSession = Depends(get_db),
):
    """Update a provider's current location (worker only)."""
    from sqlalchemy import select
    from app.models.provider import Provider
    from uuid import UUID

    result = await db.execute(select(Provider).where(Provider.id == UUID(provider_id)))
    provider = result.scalar_one_or_none()
    if provider:
        provider.latitude = lat
        provider.longitude = lon
        await db.commit()
    return {"updated": True}
