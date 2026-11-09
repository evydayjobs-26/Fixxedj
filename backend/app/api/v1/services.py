from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.database import get_db
from app.models.service import Service

router = APIRouter()


@router.get("/")
async def list_services(
    skip: int = 0,
    limit: int = 50,
    category: str | None = None,
    db: AsyncSession = Depends(get_db),
):
    """List all available services, optionally filtered by category."""
    query = select(Service).offset(skip).limit(limit)
    if category:
        query = query.where(Service.category == category)
    result = await db.execute(query)
    return result.scalars().all()


@router.get("/{service_id}")
async def get_service(service_id: str, db: AsyncSession = Depends(get_db)):
    """Get a single service by ID."""
    from uuid import UUID

    result = await db.execute(select(Service).where(Service.id == UUID(service_id)))
    service = result.scalar_one_or_none()
    if not service:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Service not found")
    return service


@router.post("/", status_code=status.HTTP_201_CREATED)
async def create_service(
    name: str,
    category: str,
    description: str,
    base_price: float,
    db: AsyncSession = Depends(get_db),
):
    """Create a new service (admin only in production)."""
    svc = Service(name=name, category=category, description=description, base_price=base_price)
    db.add(svc)
    await db.commit()
    await db.refresh(svc)
    return svc
