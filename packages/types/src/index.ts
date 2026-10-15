/**
 * JEEVAN AI — Shared Type Definitions & Contracts
 * National Public Health & Emergency Intelligence Platform for India
 *
 * Designed for interoperability across:
 * - Citizen reporting & SOS workflows
 * - First responders & paramedic operations
 * - Command center situational intelligence
 * - Administrative governance & compliance
 */

// =========================================================================
// Core Enums & Primitive Literals
// =========================================================================

/** Operational priority levels — never presented as medical diagnosis (SRS §8.1) */
export type Severity = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

/** Incident lifecycle states (SRS §9.3, FR-INC-2) */
export type IncidentStatus =
  | "NEW"
  | "TRIAGED"
  | "ASSIGNED"
  | "ACCEPTED"
  | "EN_ROUTE"
  | "ON_SCENE"
  | "TRANSPORTING"
  | "RESOLVED"
  | "CANCELLED";

/** Responder availability states (SRS §9.4, FR-RSP-1) */
export type ResponderStatus = "AVAILABLE" | "BUSY" | "EN_ROUTE" | "ON_SCENE" | "OFFLINE";

/** Risk level classification (SRS §9.6) */
export type RiskLevel = "LOW" | "MEDIUM" | "HIGH" | "CRITICAL";

/** Recommendation decision states (SRS §9.8, FR-DEC-1) */
export type DecisionAction = "APPROVED" | "MODIFIED" | "REJECTED";

/** Strict data provenance taxonomy to prevent confusing simulated/predicted with live operations */
export type DataProvenance = "[LIVE]" | "[REPORTED]" | "[ESTIMATE]" | "[SIMULATION]";

/** Standard Indian Emergency & Public Health Incident Categories */
export type IncidentCategory =
  | "MEDICAL_EMERGENCY"
  | "ROAD_ACCIDENT"
  | "FIRE_HAZARD"
  | "MASS_CASUALTY"
  | "STAMPEDE_SURGE"
  | "HEAT_EXHAUSTION"
  | "STRUCTURAL_COLLAPSE"
  | "FLOOD_WATER"
  | "HAZMAT_CHEMICAL"
  | "INFRASTRUCTURE_FAILURE"
  | "PUBLIC_SAFETY";

/** Hospital facility tiers recognized across Indian healthcare infrastructure */
export type HospitalTier =
  | "AIIMS_APEX"
  | "DISTRICT_HOSPITAL"
  | "SUB_DISTRICT_HOSPITAL"
  | "TRAUMA_CENTER"
  | "COMMUNITY_HEALTH_CENTER"
  | "PRIMARY_HEALTH_CENTER"
  | "FIELD_HOSPITAL";

/** Ambulance unit specialization categories */
export type AmbulanceType = "ALS" | "BLS" | "RAPID_BIKE" | "NEONATAL" | "AIR_MEDIC";

/** Supported Indian Languages */
export type SupportedLanguage =
  | "en" // English
  | "hi" // Hindi (हिन्दी)
  | "mr" // Marathi (मराठी)
  | "bn" // Bengali (বাংলা)
  | "ta" // Tamil (தமிழ்)
  | "te" // Telugu (తెలుగు)
  | "gu" // Gujarati (ગુજરાતી)
  | "kn" // Kannada (ಕನ್ನಡ)
  | "ml" // Malayalam (മലയാളം)
  | "pa" // Punjabi (ਪੰਜਾਬੀ)
  | "or" // Odia (ଓଡ଼ିଆ)
  | "as"; // Assamese (অসমীয়া)

// =========================================================================
// AI Output Metadata & Transparency Invariants
// =========================================================================

/** Mandatory metadata on EVERY AI-generated recommendation or inference */
export interface AIOutputMeta {
  model_name: string;
  model_version: string;
  confidence: number; // 0.0 - 1.0
  timestamp: string; // ISO 8601
  data_quality_score: number; // 0.0 - 1.0
  uncertainty_window?: string;
  human_review_required: boolean;
  disclaimer: string;
}

// =========================================================================
// Identity & Access Management (RBAC)
// =========================================================================

/** System Roles with least-privilege scoping */
export type UserRole = "PUBLIC" | "RESPONDER" | "COMMAND" | "ADMIN";

/** Standard User Profile (synchronized between Firebase Auth and Firestore/Postgres) */
export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  is_active: boolean;
  phone_number?: string;
  organization?: string;
  assigned_zone?: string;
  designation?: string;
  created_at: string;
  last_login_at?: string;
  updated_at?: string;
}

/** Authentication Token Response */
export interface AuthToken {
  access_token: string;
  token_type: "bearer";
  expires_in?: number;
  user?: User;
}

/** Login Credentials payload */
export interface LoginCredentials {
  email: string;
  password: string;
}

// =========================================================================
// Emergency Incident Domain Models
// =========================================================================

export interface IncidentAuditEntry {
  timestamp: string;
  actor_id: string;
  actor_name: string;
  action: string;
  previous_status?: IncidentStatus;
  new_status?: IncidentStatus;
  notes?: string;
}

export interface EmergencyIncident {
  id: string;
  reference_number: string;
  title: string;
  category: IncidentCategory;
  severity: Severity;
  status: IncidentStatus;
  provenance: DataProvenance;
  latitude: number;
  longitude: number;
  location_name: string;
  address?: string;
  landmark?: string;
  pincode?: string;
  city?: string;
  district?: string;
  state?: string;
  reported_at: string;
  updated_at: string;
  reported_by?: string;
  reporter_phone?: string;
  reporter_consent_given?: boolean;
  casualties_count: number;
  triage_summary?: string;
  vital_signs_note?: string;
  assigned_responder_id?: string;
  assigned_unit_callsign?: string;
  assigned_hospital_id?: string;
  notes: string;
  audit_trail: IncidentAuditEntry[];
  ai_assessment?: AIIncidentCardData;
}

/** AI Emergency Intelligence Card Schema */
export interface AIIncidentCardData {
  incident_id: string;
  severity_rating: Severity;
  severity_score: number; // 0 - 100
  contributing_factors: string[];
  observed_facts: string[];
  user_reported_details: string[];
  model_inferences: string[];
  operator_verified: boolean;
  verified_by?: string;
  recommended_actions: {
    action: string;
    priority: "IMMEDIATE" | "SECONDARY" | "MONITOR";
    rationale: string;
  }[];
  recommended_hospitals: {
    hospital_id: string;
    name: string;
    distance_km: number;
    eta_min: number;
    trauma_level: string;
    icu_available: boolean;
  }[];
  recommended_response_units: {
    unit_id: string;
    callsign: string;
    type: AmbulanceType;
    eta_min: number;
  }[];
  information_gaps: string[];
  meta: AIOutputMeta;
}

// =========================================================================
// Healthcare & Resource Fleet Models
// =========================================================================

export interface HospitalFacility {
  id: string;
  name: string;
  type: HospitalTier;
  latitude: number;
  longitude: number;
  address: string;
  district: string;
  state: string;
  pincode: string;
  contact_number: string;
  emergency_helpline?: string;
  icu_beds_available: number;
  icu_beds_total: number;
  oxygen_beds_available: number;
  oxygen_beds_total: number;
  general_beds_available: number;
  general_beds_total: number;
  blood_units_reserve: number;
  trauma_level: "LEVEL_1" | "LEVEL_2" | "LEVEL_3";
  status: "NORMAL" | "NEAR_CAPACITY" | "SURGE_OVERFLOW";
  has_burn_unit?: boolean;
  has_cardiac_care?: boolean;
  last_updated: string;
  provenance: DataProvenance;
}

export interface AmbulanceUnit {
  id: string;
  callsign: string;
  type: AmbulanceType;
  status: ResponderStatus;
  latitude: number;
  longitude: number;
  speed_kmh: number;
  heading_deg: number;
  battery_fuel_percent: number;
  driver_name: string;
  paramedic_team: string;
  equipment_tier: "ADVANCED_LIFE_SUPPORT" | "BASIC_LIFE_SUPPORT" | "FIRST_AID";
  assigned_incident_id?: string;
  target_hospital_id?: string;
  estimated_arrival_min?: number;
  last_telemetry_at: string;
  provenance: DataProvenance;
}

// =========================================================================
// Geospatial & Regional Hierarchy
// =========================================================================

export interface OperationalZone {
  id: string;
  name: string;
  code: string;
  state: string;
  district: string;
  tier: "CRITICAL_RED" | "ELEVATED_ORANGE" | "MONITORED_YELLOW" | "STABLE_GREEN";
  risk_score: number; // 0 - 100
  crowd_density_sqm: number;
  latitude: number;
  longitude: number;
  active_incidents_count: number;
  description: string;
}

export interface GeographicRegion {
  id: string;
  name: string;
  type: "NATIONAL" | "STATE" | "DISTRICT" | "CITY" | "ZONE";
  parent_id?: string;
  center_lat: number;
  center_lng: number;
  default_zoom: number;
  active_incidents: number;
  population_covered?: number;
}

// =========================================================================
// Forecasting & Situational Risk Intelligence
// =========================================================================

export interface MedicalDemandForecast {
  region_id: string;
  region_name: string;
  forecast_generated_at: string;
  forecast_horizon_hours: number;
  hourly_predictions: {
    hour_offset: number;
    projected_inflow_rate: number;
    confidence_interval_low: number;
    confidence_interval_high: number;
    historical_baseline: number;
  }[];
  peak_risk_time?: string;
  key_drivers: string[];
  data_quality_notes: string[];
  meta: AIOutputMeta;
}

export interface PublicHealthRiskIndicator {
  id: string;
  zone_name: string;
  district: string;
  state: string;
  overall_risk_score: number; // 0 - 100
  risk_tier: RiskLevel;
  environmental: {
    ambient_temp_c: number;
    aqi_index: number;
    heat_index: "NORMAL" | "CAUTION" | "EXTREME_CAUTION" | "DANGER";
  };
  healthcare_strain: {
    icu_occupancy_pct: number;
    ambulance_availability_pct: number;
  };
  data_freshness_sec: number;
  last_updated: string;
  provenance: DataProvenance;
}

// =========================================================================
// Risk Alerts & Warning System
// =========================================================================

export interface RiskAlert {
  id: string;
  title: string;
  severity: Severity;
  region_name: string;
  district?: string;
  state?: string;
  metric_name: string;
  threshold_value: number | string;
  current_value: number | string;
  message: string;
  suggested_action: string;
  created_at: string;
  acknowledged: boolean;
  acknowledged_by?: string;
  acknowledged_at?: string;
  provenance: DataProvenance;
}

// =========================================================================
// What-If Simulation Engine Models
// =========================================================================

export interface SimulationParameters {
  scenario_name: string;
  duration_hours: number;
  crowd_surge_multiplier: number; // e.g. 1.5 = +50%
  heat_index_increase_c: number;
  road_blockages_count: number;
  hospital_bed_capacity_reduction_pct: number;
  responder_turnaround_delay_min: number;
}

export interface SimulationResults {
  scenario_id: string;
  run_at: string;
  parameters: SimulationParameters;
  projected_total_casualties: number;
  projected_icu_bed_deficit: number;
  projected_ambulance_wait_time_min: number;
  bottleneck_zones: string[];
  recommendations: string[];
  is_simulation_only: true;
}

// =========================================================================
// API Standard Response Contracts
// =========================================================================

export interface APIError {
  detail: string;
  status_code: number;
  error_code?: string;
}

export interface HealthResponse {
  status: "healthy" | "degraded" | "unhealthy";
  version: string;
  timestamp: string;
  services?: Record<string, "up" | "down" | "degraded">;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
