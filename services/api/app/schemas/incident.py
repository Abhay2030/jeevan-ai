"""
JEEVAN AI — Incident Schemas
"""

from datetime import datetime

# Matches the ENUM in the database
from typing import Literal
from uuid import UUID

from pydantic import BaseModel, Field

IncidentSeverity = Literal["CRITICAL", "HIGH", "MEDIUM", "LOW"]
IncidentStatus = Literal[
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
]
IncidentCategory = Literal[
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
]
VerificationState = Literal["UNVERIFIED", "PENDING_VERIFICATION", "VERIFIED", "CONTESTED"]
IncidentSourceType = Literal[
    "CITIZEN_REPORT",
    "RESPONDER_REPORT",
    "SENSOR",
    "AI_DETECTION",
    "INTEGRATION",
    "MANUAL_ENTRY",
]


class Location(BaseModel):
    """GeoJSON style location representing a PostGIS Point."""
    longitude: float = Field(..., ge=-180, le=180)
    latitude: float = Field(..., ge=-90, le=90)


class IncidentBase(BaseModel):
    title: str = Field(min_length=1, max_length=255)
    description: str | None = None
    category: IncidentCategory = "OTHER"
    severity: IncidentSeverity = "LOW"
    severity_rationale: str | None = None
    status: IncidentStatus = "NEW"
    verification_state: VerificationState = "UNVERIFIED"
    source_type: IncidentSourceType = "CITIZEN_REPORT"
    zone_id: str | None = None
    state_code: str | None = Field(default=None, max_length=2)
    district: str | None = Field(default=None, max_length=100)


class IncidentCreate(IncidentBase):
    """Properties required to report an incident."""
    location: Location
    location_confidence: float | None = Field(default=1.0, ge=0.0, le=1.0)


class IncidentUpdate(BaseModel):
    """Properties to update an incident (e.g. status changes, verification, assignment)."""
    title: str | None = None
    description: str | None = None
    category: IncidentCategory | None = None
    severity: IncidentSeverity | None = None
    severity_rationale: str | None = None
    status: IncidentStatus | None = None
    verification_state: VerificationState | None = None
    assigned_to_id: UUID | None = None
    resolution_outcome: str | None = None


class IncidentRead(IncidentBase):
    """Properties returned when reading an incident."""
    id: UUID
    location: Location
    location_confidence: float | None = 1.0
    reported_by_id: UUID | None = None
    assigned_to_id: UUID | None = None
    resolution_outcome: str | None = None
    resolution_time: datetime | None = None
    created_at: datetime
    updated_at: datetime

    model_config = {
        "from_attributes": True,
    }
