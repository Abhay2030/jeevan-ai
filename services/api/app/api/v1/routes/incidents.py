"""
JEEVAN AI — Incident API Endpoints
"""

from typing import Annotated
from uuid import UUID

from fastapi import APIRouter, Depends, HTTPException, status
from geoalchemy2.shape import to_shape
from sqlalchemy import select

from app.api.dependencies import CurrentUser, SessionDep, require_role
from app.models.incident import Incident
from app.schemas.incident import IncidentCreate, IncidentRead, IncidentUpdate, Location

router = APIRouter(tags=["incidents"])

# Responders, Medical teams, Command levels, and Admins can manage incidents globally
ResponderOrHigher = Annotated[
    CurrentUser,
    Depends(
        require_role(
            [
                "RESPONDER",
                "MEDICAL",
                "COMMAND",
                "COMMAND_DISTRICT",
                "COMMAND_STATE",
                "COMMAND_NATIONAL",
                "ADMIN",
            ]
        )
    ),
]


def format_incident(incident: Incident) -> IncidentRead:
    """Helper to format the SQLAlchemy model to a Pydantic Read schema with parsed geometry."""
    # Convert WKBElement to Shapely geometry to extract coords
    point = to_shape(incident.location)

    return IncidentRead(
        id=incident.id,
        title=incident.title,
        description=incident.description,
        category=incident.category or "OTHER",
        severity=incident.severity,
        severity_rationale=incident.severity_rationale,
        status=incident.status,
        verification_state=incident.verification_state or "UNVERIFIED",
        source_type=incident.source_type or "CITIZEN_REPORT",
        location=Location(longitude=point.x, latitude=point.y),
        location_confidence=incident.location_confidence if incident.location_confidence is not None else 1.0,
        zone_id=incident.zone_id,
        state_code=incident.state_code,
        district=incident.district,
        reported_by_id=incident.reported_by_id,
        assigned_to_id=incident.assigned_to_id,
        resolution_outcome=incident.resolution_outcome,
        resolution_time=incident.resolution_time,
        created_at=incident.created_at,
        updated_at=incident.updated_at,
    )


@router.get("/incidents", response_model=list[IncidentRead])
async def list_incidents(
    session: SessionDep,
    user: ResponderOrHigher
) -> list[IncidentRead]:
    """Get all incidents (Responder, Medical, Command, Admin access)."""
    stmt = select(Incident).order_by(Incident.created_at.desc())
    result = await session.execute(stmt)
    incidents = result.scalars().all()

    return [format_incident(inc) for inc in incidents]


@router.post("/incidents", response_model=IncidentRead, status_code=status.HTTP_201_CREATED)
async def create_incident(
    data: IncidentCreate,
    session: SessionDep,
    current_user: CurrentUser
) -> IncidentRead:
    """Report a new incident. Anyone authenticated can report."""
    # Convert Location into WKT (Well-Known Text) for PostGIS
    wkt_location = f"SRID=4326;POINT({data.location.longitude} {data.location.latitude})"

    incident = Incident(
        title=data.title,
        description=data.description,
        category=data.category,
        severity=data.severity,
        severity_rationale=data.severity_rationale,
        status=data.status,
        verification_state=data.verification_state,
        source_type=data.source_type,
        location=wkt_location,
        location_confidence=data.location_confidence,
        zone_id=data.zone_id,
        state_code=data.state_code,
        district=data.district,
        reported_by_id=current_user.id
    )

    session.add(incident)
    await session.commit()
    await session.refresh(incident)

    return format_incident(incident)


@router.patch("/incidents/{incident_id}", response_model=IncidentRead)
async def update_incident(
    incident_id: UUID,
    data: IncidentUpdate,
    session: SessionDep,
    user: ResponderOrHigher
) -> IncidentRead:
    """Update incident status, verification, or assignee."""
    stmt = select(Incident).where(Incident.id == incident_id)
    result = await session.execute(stmt)
    incident = result.scalar_one_or_none()

    if not incident:
        raise HTTPException(status_code=404, detail="Incident not found")

    if data.title is not None:
        incident.title = data.title
    if data.description is not None:
        incident.description = data.description
    if data.category is not None:
        incident.category = data.category
    if data.severity is not None:
        incident.severity = data.severity
    if data.severity_rationale is not None:
        incident.severity_rationale = data.severity_rationale
    if data.status is not None:
        incident.status = data.status
    if data.verification_state is not None:
        incident.verification_state = data.verification_state
    if data.assigned_to_id is not None:
        incident.assigned_to_id = data.assigned_to_id
    if data.resolution_outcome is not None:
        incident.resolution_outcome = data.resolution_outcome

    await session.commit()
    await session.refresh(incident)

    return format_incident(incident)
