"""
JEEVAN AI — Incident Database Model
"""
import uuid
from datetime import UTC, datetime

from geoalchemy2 import Geometry
from sqlalchemy import Column, DateTime, Enum, Float, ForeignKey, String, Text
from sqlalchemy.dialects.postgresql import UUID
from sqlalchemy.orm import relationship

from app.db.base import Base


class Incident(Base):
    """Core emergency incident record with geospatial awareness and national lifecycle support."""
    __tablename__ = "incidents"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)

    # Core Data
    title = Column(String(255), nullable=False)
    description = Column(Text, nullable=True)

    category = Column(
        Enum(
            "MEDICAL",
            "ROAD_ACCIDENT",
            "FIRE",
            "FLOOD",
            "HEAT_EMERGENCY",
            "SEVERE_WEATHER",
            "EARTHQUAKE",
            "CROWD_SAFETY",
            "INFRASTRUCTURE",
            "OTHER",
            name="incident_category",
        ),
        nullable=True,
        default="OTHER",
    )

    # Enumerations matching national lifecycle & SRS §2.5 Types
    severity = Column(
        Enum("CRITICAL", "HIGH", "MEDIUM", "LOW", name="incident_severity"),
        nullable=False,
        default="LOW",
    )
    severity_rationale = Column(Text, nullable=True)

    status = Column(
        Enum(
            "NEW",
            "TRIAGING",
            "VERIFIED",
            "ASSIGNED",
            "AUTHORIZED",
            "IN_PROGRESS",
            "STABILIZING",
            "RESOLVED",
            "CLOSED",
            "REJECTED",
            "DUPLICATE",
            "FALSE_POSITIVE",
            name="incident_status",
        ),
        nullable=False,
        default="NEW",
    )
    verification_state = Column(
        Enum(
            "UNVERIFIED",
            "PENDING_VERIFICATION",
            "VERIFIED",
            "CONTESTED",
            name="verification_state",
        ),
        nullable=False,
        default="UNVERIFIED",
    )
    source_type = Column(
        Enum(
            "CITIZEN_REPORT",
            "RESPONDER_REPORT",
            "SENSOR",
            "AI_DETECTION",
            "INTEGRATION",
            "MANUAL_ENTRY",
            name="incident_source_type",
        ),
        nullable=False,
        default="CITIZEN_REPORT",
    )

    # Geospatial Data (PostGIS Point: Longitude, Latitude)
    # SRID 4326 is standard GPS coordinates (WGS 84)
    location = Column(
        Geometry(geometry_type="POINT", srid=4326, spatial_index=True),
        nullable=False,
    )
    location_confidence = Column(Float, nullable=True, default=1.0)
    zone_id = Column(String(100), nullable=True)
    state_code = Column(String(2), nullable=True)
    district = Column(String(100), nullable=True)

    # Tracking
    reported_by_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)
    assigned_to_id = Column(UUID(as_uuid=True), ForeignKey("users.id"), nullable=True)

    # Resolution
    resolution_outcome = Column(Text, nullable=True)
    resolution_time = Column(DateTime(timezone=True), nullable=True)

    created_at = Column(DateTime(timezone=True), default=lambda: datetime.now(UTC), nullable=False)
    updated_at = Column(
        DateTime(timezone=True),
        default=lambda: datetime.now(UTC),
        onupdate=lambda: datetime.now(UTC),
        nullable=False,
    )

    # Relationships
    reporter = relationship("User", foreign_keys=[reported_by_id])
    assignee = relationship("User", foreign_keys=[assigned_to_id])
