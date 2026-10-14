"""
JEEVAN AI — User Schemas
"""

from datetime import datetime
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, EmailStr, Field

UserRole = Literal[
    "PUBLIC",
    "RESPONDER",
    "MEDICAL",
    "COMMAND_DISTRICT",
    "COMMAND_STATE",
    "COMMAND_NATIONAL",
    "ADMIN",
]


class UserBase(BaseModel):
    """Shared properties for all user schemas."""
    email: EmailStr
    full_name: str = Field(min_length=1, max_length=255)
    phone_number: str | None = Field(default=None, max_length=20)
    organization: str | None = Field(default=None, max_length=255)
    state_code: str | None = Field(default=None, max_length=2)
    district: str | None = Field(default=None, max_length=100)
    preferred_language: str = Field(default="en", max_length=10)


class UserCreate(UserBase):
    """Properties required for user creation."""
    password: str = Field(min_length=8)
    role: UserRole = "PUBLIC"


class UserRead(UserBase):
    """Properties returned when reading a user profile."""
    id: UUID
    role: UserRole
    is_active: bool
    created_at: datetime

    model_config = {
        "from_attributes": True,
    }
