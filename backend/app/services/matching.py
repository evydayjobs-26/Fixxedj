"""Provider matching – find nearby workers for a service request."""
from __future__ import annotations

import uuid
from typing import Any

from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.models.provider import Provider
from app.utils.geo import haversine_km


async def find_nearby_providers(
    db: AsyncSession,
    lat: float,
    lon: float,
    radius_km: float = 10.0,
    service_id: str | None = None,
) -> list[dict[str, Any]]:
    """Return providers within *radius_km* of (lat, lon), sorted by distance.

    For now uses an in-Python haversine filter.  In production, upgrade to a
    PostGIS ``ST_DWithin`` query for efficiency.
    """
    result = await db.execute(
        select(Provider).where(
            Provider.is_available == True,  # noqa: E712
            Provider.latitude.isnot(None),
            Provider.longitude.isnot(None),
        )
    )
    providers = result.scalars().all()

    nearby: list[dict[str, Any]] = []
    for p in providers:
        dist = haversine_km(lat, lon, p.latitude, p.longitude)  # type: ignore[arg-type]
        if dist <= radius_km:
            nearby.append({"provider": p, "distance_km": round(dist, 2)})

    nearby.sort(key=lambda x: x["distance_km"])
    return nearby
