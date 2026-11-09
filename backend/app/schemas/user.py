from __future__ import annotations
import uuid
from datetime import datetime

from pydantic import BaseModel, ConfigDict, field_validator

from app.core.constants import Role


class UserBase(BaseModel):
    phone: str
    full_name: str | None = None
    email: str | None = None
    role: Role = Role.CUSTOMER


class UserCreate(UserBase):
    pass


class UserUpdate(BaseModel):
    full_name: str | None = None
    email: str | None = None
    avatar_url: str | None = None


class UserRead(UserBase):
    model_config = ConfigDict(from_attributes=True)

    id: uuid.UUID
    is_active: bool
    is_verified: bool
    created_at: datetime
