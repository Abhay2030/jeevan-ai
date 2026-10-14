"""
JEEVAN AI — User Database Model
"""
import uuid
from datetime import UTC, datetime

from sqlalchemy import Boolean, Column, DateTime, Enum, String
from sqlalchemy.dialects.postgresql import UUID

from app.db.base import Base


class User(Base):
    """User account with role-based access control."""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    email = Column(String(255), unique=True, index=True, nullable=False)
    full_name = Column(String(255), nullable=False)
    hashed_password = Column(String(255), nullable=False)
    role = Column(
        Enum(
            "PUBLIC",
            "RESPONDER",
            "MEDICAL",
            "COMMAND_DISTRICT",
            "COMMAND_STATE",
            "COMMAND_NATIONAL",
            "ADMIN",
            name="user_role",
        ),
        nullable=False,
        default="PUBLIC",
    )
    organization = Column(String(255), nullable=True)
    state_code = Column(String(2), nullable=True)
    district = Column(String(100), nullable=True)
    preferred_language = Column(String(10), nullable=False, default="en")

    is_active = Column(Boolean, default=True, nullable=False)
    phone_number = Column(String(20), nullable=True)
    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
