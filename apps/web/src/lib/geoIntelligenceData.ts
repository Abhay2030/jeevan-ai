/**
 * JEEVAN AI — Geospatial Intelligence Data Engine
 * Realistic National Public Health & Emergency Response Datasets for India
 *
 * Data Provenance Taxonomy:
 * - [LIVE]: Real-time telemetry feed from active responder units / IoT sensors
 * - [REPORTED]: Citizen/Volunteer field reports awaiting dispatch or triage
 * - [ESTIMATE]: AI predictive spatial demand and surge risk calculations
 * - [SIMULATION]: Synthetic drill scenarios and procedural 3D building extrusions
 */

export interface EmergencyIncident {
  id: string;
  title: string;
  category: "MEDICAL_SURGE" | "STAMPEDE_RISK" | "TRAFFIC_COLLISION" | "HEAT_EXHAUSTION" | "STRUCTURAL_HAZARD" | "MASS_CASUALTY";
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  status: "ACTIVE_DISPATCH" | "TRIAGE_IN_PROGRESS" | "CONTAINED" | "RESOLVED";
  provenance: "[LIVE]" | "[REPORTED]" | "[ESTIMATE]" | "[SIMULATION]";
  latitude: number;
  longitude: number;
  locationName: string;
  reportedAt: string;
  casualtiesCount: number;
  assignedUnit?: string;
  notes: string;
}

export interface HospitalFacility {
  id: string;
  name: string;
  type: "AIIMS_APEX" | "DISTRICT_HOSPITAL" | "FIELD_HOSPITAL" | "TRAUMA_CENTER" | "COMMUNITY_CLINIC";
  latitude: number;
  longitude: number;
  address: string;
  contactNumber: string;
  icuBedsAvailable: number;
  icuBedsTotal: number;
  oxygenBedsAvailable: number;
  oxygenBedsTotal: number;
  generalBedsAvailable: number;
  bloodUnitsReserve: number;
  traumaLevel: "LEVEL_1" | "LEVEL_2" | "LEVEL_3";
  status: "NORMAL" | "NEAR_CAPACITY" | "SURGE_OVERFLOW";
  provenance: "[LIVE]" | "[SIMULATION]";
}

export interface AmbulanceUnit {
  id: string;
  callsign: string;
  type: "ALS" | "BLS" | "RAPID_BIKE" | "AIR_MEDIC";
  status: "AVAILABLE" | "EN_ROUTE" | "DISPATCHED" | "AT_SCENE" | "PATIENT_ONBOARD";
  provenance: "[LIVE]" | "[SIMULATION]";
  latitude: number;
  longitude: number;
  speedKmH: number;
  headingDeg: number;
  batteryFuelPercent: number;
  driverName: string;
  paramedicTeam: string;
  assignedIncidentId?: string;
  targetHospitalId?: string;
  estimatedArrivalMin?: number;
}

export interface OperationalZone {
  id: string;
  name: string;
  code: string;
  riskScore: number; // 0 - 100
  tier: "CRITICAL_RED" | "ELEVATED_ORANGE" | "MONITORED_YELLOW" | "STABLE_GREEN";
  crowdDensitySqM: number;
  latitude: number;
  longitude: number;
  incidentCount: number;
  description: string;
}

export interface CityHub {
  id: string;
  name: string;
  state: string;
  center: [number, number]; // [lat, lng]
  zoom: number;
  pitch: number;
  bearing: number;
  description: string;
}

/* ══════════ POPULAR REGIONAL HUBS ACROSS INDIA ══════════ */
export const INDIAN_COMMAND_HUBS: CityHub[] = [
  {
    id: "national-hq",
    name: "National Command HQ — New Delhi",
    state: "Delhi NCR",
    center: [28.6139, 77.2090],
    zoom: 14.5,
    pitch: 62,
    bearing: -28,
    description: "Apex National Emergency Coordination Centre & AIIMS Trauma Grid"
  },
  {
    id: "central-hub",
    name: "Central Concourse — Indore / MP",
    state: "Madhya Pradesh",
    center: [22.7196, 75.8577],
    zoom: 14.8,
    pitch: 65,
    bearing: -32,
    description: "High-Density Gathering Logistics Core & District Hospital Network"
  },
  {
    id: "mumbai-core",
    name: "Western Command — Mumbai",
    state: "Maharashtra",
    center: [18.9220, 72.8347],
    zoom: 15.0,
    pitch: 65,
    bearing: 42,
    description: "Coastal Disaster & Maritime Medical Operations Base"
  },
  {
    id: "bengaluru-hub",
    name: "Southern Medical Grid — Bengaluru",
    state: "Karnataka",
    center: [12.9716, 77.5946],
    zoom: 14.6,
    pitch: 60,
    bearing: -15,
    description: "Tech-Assisted Drone Medical Delivery & Victoria Trauma Center"
  },
  {
    id: "varanasi-hub",
    name: "Ganga Basin Gathering Node — Varanasi",
    state: "Uttar Pradesh",
    center: [25.3176, 82.9739],
    zoom: 15.2,
    pitch: 64,
    bearing: -45,
    description: "Riverbank Crowd Flow Monitoring & Heat Surge Early Warning"
  },
  {
    id: "hyderabad-grid",
    name: "Deccan Health Hub — Hyderabad",
    state: "Telangana",
    center: [17.3850, 78.4867],
    zoom: 14.5,
    pitch: 58,
    bearing: 10,
    description: "Telemedicine Dispatch & NIMS Critical Care Network"
  }
];

/* ══════════ ACTIVE EMERGENCY INCIDENTS ══════════ */
export const DEMO_INCIDENTS: EmergencyIncident[] = [
  {
    id: "inc-01",
    title: "Mass Heat Exhaustion Cluster",
    category: "HEAT_EXHAUSTION",
    severity: "CRITICAL",
    status: "ACTIVE_DISPATCH",
    provenance: "[LIVE]",
    latitude: 22.7215,
    longitude: 75.8592,
    locationName: "Sector 4 Main Concourse & Gate 2",
    reportedAt: "3 mins ago",
    casualtiesCount: 14,
    assignedUnit: "ALS-01",
    notes: "High ambient temperature (39°C), multiple dehydration fainting reports. Hydration misting dispatched."
  },
  {
    id: "inc-02",
    title: "Bridge Bottleneck Crowd Surge",
    category: "STAMPEDE_RISK",
    severity: "HIGH",
    status: "TRIAGE_IN_PROGRESS",
    provenance: "[LIVE]",
    latitude: 22.7180,
    longitude: 75.8530,
    locationName: "North Overpass Pedestrian Crossing",
    reportedAt: "8 mins ago",
    casualtiesCount: 3,
    assignedUnit: "BLS-09",
    notes: "Sensor reports crowd density exceeding 4.2 persons/sqm. Rapid dispersal corridor activated."
  },
  {
    id: "inc-03",
    title: "Multi-Vehicle Support Tender Collision",
    category: "TRAFFIC_COLLISION",
    severity: "HIGH",
    status: "ACTIVE_DISPATCH",
    provenance: "[REPORTED]",
    latitude: 22.7270,
    longitude: 75.8480,
    locationName: "Ring Road Sector Bypass Gate 6",
    reportedAt: "14 mins ago",
    casualtiesCount: 5,
    assignedUnit: "ALS-04",
    notes: "Supply truck side-swiped volunteer bus. Rapid extrication team en route."
  },
  {
    id: "inc-04",
    title: "Electrical Generator Smoke Eruption",
    category: "STRUCTURAL_HAZARD",
    severity: "MEDIUM",
    status: "CONTAINED",
    provenance: "[REPORTED]",
    latitude: 22.7145,
    longitude: 75.8640,
    locationName: "Temporary Food Distribution Stalls Zone 3",
    reportedAt: "22 mins ago",
    casualtiesCount: 1,
    assignedUnit: "FIRE-TENDER-02",
    notes: "Diesel generator short-circuit extinguished by quick-response fire unit. No structural burn."
  },
  {
    id: "inc-05",
    title: "Predicted Surge in Evening Congregation",
    category: "MEDICAL_SURGE",
    severity: "MEDIUM",
    status: "TRIAGE_IN_PROGRESS",
    provenance: "[ESTIMATE]",
    latitude: 22.7240,
    longitude: 75.8660,
    locationName: "East Amphitheater & Assembly Ground",
    reportedAt: "AI Model Update (t-30m)",
    casualtiesCount: 0,
    notes: "AI predictive model projects +35% medical triage surge at 19:30 IST based on historical inflows."
  }
];

/* ══════════ HOSPITALS & CRITICAL CARE FACILITIES ══════════ */
export const DEMO_HOSPITALS: HospitalFacility[] = [
  {
    id: "hosp-01",
    name: "Government District Apex Trauma Centre",
    type: "DISTRICT_HOSPITAL",
    latitude: 22.7225,
    longitude: 75.8510,
    address: "Hospital Road, Civil Lines Zone",
    contactNumber: "+91 (0731) 252-8000",
    icuBedsAvailable: 8,
    icuBedsTotal: 40,
    oxygenBedsAvailable: 24,
    oxygenBedsTotal: 120,
    generalBedsAvailable: 68,
    bloodUnitsReserve: 142,
    traumaLevel: "LEVEL_1",
    status: "NORMAL",
    provenance: "[LIVE]"
  },
  {
    id: "hosp-02",
    name: "Red Cross Emergency Field Hospital Alpha",
    type: "FIELD_HOSPITAL",
    latitude: 22.7170,
    longitude: 75.8615,
    address: "Central Concourse Sector Field Tent B",
    contactNumber: "+91 94250-99112",
    icuBedsAvailable: 3,
    icuBedsTotal: 15,
    oxygenBedsAvailable: 12,
    oxygenBedsTotal: 45,
    generalBedsAvailable: 28,
    bloodUnitsReserve: 35,
    traumaLevel: "LEVEL_2",
    status: "NEAR_CAPACITY",
    provenance: "[LIVE]"
  },
  {
    id: "hosp-03",
    name: "Metro Super-Specialty Medical Institute",
    type: "AIIMS_APEX",
    latitude: 22.7285,
    longitude: 75.8450,
    address: "Western Highway Junction Ring Road",
    contactNumber: "+91 (0731) 400-5555",
    icuBedsAvailable: 18,
    icuBedsTotal: 60,
    oxygenBedsAvailable: 42,
    oxygenBedsTotal: 180,
    generalBedsAvailable: 110,
    bloodUnitsReserve: 260,
    traumaLevel: "LEVEL_1",
    status: "NORMAL",
    provenance: "[LIVE]"
  },
  {
    id: "hosp-04",
    name: "Community Health Outreach Post South",
    type: "COMMUNITY_CLINIC",
    latitude: 22.7115,
    longitude: 75.8540,
    address: "South Pavilion Gate 8",
    contactNumber: "+91 98930-11223",
    icuBedsAvailable: 0,
    icuBedsTotal: 4,
    oxygenBedsAvailable: 5,
    oxygenBedsTotal: 15,
    generalBedsAvailable: 14,
    bloodUnitsReserve: 12,
    traumaLevel: "LEVEL_3",
    status: "NORMAL",
    provenance: "[SIMULATION]"
  }
];

/* ══════════ AMBULANCE & RAPID RESPONSE FLEET ══════════ */
export const DEMO_AMBULANCES: AmbulanceUnit[] = [
  {
    id: "amb-01",
    callsign: "ALS-01 (Advanced Life Support)",
    type: "ALS",
    status: "EN_ROUTE",
    provenance: "[LIVE]",
    latitude: 22.7208,
    longitude: 75.8565,
    speedKmH: 48,
    headingDeg: 315,
    batteryFuelPercent: 88,
    driverName: "S. Pawar",
    paramedicTeam: "Dr. Roy & EMT Joshi",
    assignedIncidentId: "inc-01",
    targetHospitalId: "hosp-01",
    estimatedArrivalMin: 4
  },
  {
    id: "amb-02",
    callsign: "ALS-04 (Trauma Resuscitation)",
    type: "ALS",
    status: "DISPATCHED",
    provenance: "[LIVE]",
    latitude: 22.7245,
    longitude: 75.8500,
    speedKmH: 36,
    headingDeg: 140,
    batteryFuelPercent: 94,
    driverName: "V. Sharma",
    paramedicTeam: "Dr. Deshmukh & EMT Khan",
    assignedIncidentId: "inc-03",
    targetHospitalId: "hosp-03",
    estimatedArrivalMin: 6
  },
  {
    id: "amb-03",
    callsign: "BLS-09 (Basic Life Support)",
    type: "BLS",
    status: "AT_SCENE",
    provenance: "[LIVE]",
    latitude: 22.7183,
    longitude: 75.8535,
    speedKmH: 0,
    headingDeg: 0,
    batteryFuelPercent: 74,
    driverName: "R. Verma",
    paramedicTeam: "EMT Patel & EMT Nair",
    assignedIncidentId: "inc-02",
    targetHospitalId: "hosp-02",
    estimatedArrivalMin: 0
  },
  {
    id: "amb-04",
    callsign: "RAPID-BIKE-3 (First-Response)",
    type: "RAPID_BIKE",
    status: "AVAILABLE",
    provenance: "[LIVE]",
    latitude: 22.7230,
    longitude: 75.8620,
    speedKmH: 0,
    headingDeg: 0,
    batteryFuelPercent: 98,
    driverName: "A. Kadam",
    paramedicTeam: "EMT Shinde",
    estimatedArrivalMin: 0
  },
  {
    id: "amb-05",
    callsign: "AIR-MEDIC-1 (Helicopter Evac)",
    type: "AIR_MEDIC",
    status: "AVAILABLE",
    provenance: "[SIMULATION]",
    latitude: 22.7310,
    longitude: 75.8420,
    speedKmH: 0,
    headingDeg: 0,
    batteryFuelPercent: 100,
    driverName: "Wg Cdr M. Rao (Retd)",
    paramedicTeam: "Dr. K. Sen (Flight Surgeon)",
    estimatedArrivalMin: 0
  }
];

/* ══════════ POLICE POSTS & SAFE SHELTERS ══════════ */
export const DEMO_POLICE_POSTS = [
  { id: "pol-01", latitude: 22.7210, longitude: 75.8580, title: "Police Rapid Command Post 1", type: "police" as const, severity: "LOW" as const },
  { id: "pol-02", latitude: 22.7165, longitude: 75.8515, title: "Traffic Coordination Station 4", type: "police" as const, severity: "LOW" as const },
  { id: "pol-03", latitude: 22.7255, longitude: 75.8635, title: "Crowd Flow Monitoring Tower", type: "police" as const, severity: "MEDIUM" as const },
];

export const DEMO_SHELTERS = [
  { id: "shl-01", latitude: 22.7190, longitude: 75.8645, title: "Safe Assembly & Shelter Alpha (Cap: 2,500)", type: "shelter" as const, severity: "LOW" as const },
  { id: "shl-02", latitude: 22.7135, longitude: 75.8475, title: "Community Evacuation Ground West", type: "shelter" as const, severity: "LOW" as const },
];

/* ══════════ OPERATIONAL ZONE OVERLAYS ══════════ */
export const DEMO_OPERATIONAL_ZONES: OperationalZone[] = [
  {
    id: "zone-red",
    name: "Concourse Red Containment Zone",
    code: "SEC-RED-01",
    riskScore: 88,
    tier: "CRITICAL_RED",
    crowdDensitySqM: 4.8,
    latitude: 22.7205,
    longitude: 75.8585,
    incidentCount: 2,
    description: "High surge pressure near Gate 2. Strict ingress throttling and paramedic standby."
  },
  {
    id: "zone-orange",
    name: "Northern Corridor High-Alert Perimeter",
    code: "SEC-ORN-02",
    riskScore: 68,
    tier: "ELEVATED_ORANGE",
    crowdDensitySqM: 3.2,
    latitude: 22.7250,
    longitude: 75.8540,
    incidentCount: 1,
    description: "Pedestrian bottlenecking leading to vehicular exchange ring road."
  },
  {
    id: "zone-green",
    name: "Western Pavilion Safe Evacuation Grid",
    code: "SEC-GRN-03",
    riskScore: 22,
    tier: "STABLE_GREEN",
    crowdDensitySqM: 1.1,
    latitude: 22.7150,
    longitude: 75.8490,
    incidentCount: 0,
    description: "Optimal egress zone with direct ambulance green-corridor connectivity."
  }
];

/* ══════════ PROCEDURAL 3D BUILDING POLYGONS (GEOJSON) ══════════ */
/**
 * Procedural 3D buildings around the operational center.
 * When camera tilts into 3D pitch (45° - 75°), MapLibre's fill-extrusion
 * renders these as realistic rising 3D structures with architectural elevation.
 */
export interface GeoFeature {
  type: "Feature";
  id: string;
  properties: Record<string, unknown>;
  geometry: {
    type: string;
    coordinates: number[][][];
  };
}

export function generateProcedural3DBuildingsGeoJSON(centerLat = 22.7196, centerLng = 75.8577) {
  const buildings: GeoFeature[] = [];

  const buildingSpecs = [
    // Apex Trauma Center Complex
    { dLat: 0.0028, dLng: -0.0065, w: 0.0016, h: 0.0014, height: 48, minHeight: 0, color: "#1e293b", name: "District Hospital Main Tower" },
    { dLat: 0.0028, dLng: -0.0045, w: 0.0010, h: 0.0009, height: 32, minHeight: 0, color: "#334155", name: "ICU Emergency Wing" },
    { dLat: 0.0040, dLng: -0.0055, w: 0.0012, h: 0.0008, height: 22, minHeight: 0, color: "#475569", name: "Oxygen Plant & Diagnostic Hub" },

    // National Emergency Operations Command Center
    { dLat: 0.0005, dLng: -0.0002, w: 0.0022, h: 0.0018, height: 64, minHeight: 0, color: "#0f172a", name: "Central Command Citadel" },
    { dLat: -0.0018, dLng: 0.0004, w: 0.0014, h: 0.0012, height: 38, minHeight: 0, color: "#1e293b", name: "Telecom & Satellite Relay" },

    // Field Medical Tent Complexes
    { dLat: -0.0025, dLng: 0.0038, w: 0.0018, h: 0.0012, height: 16, minHeight: 0, color: "#065f46", name: "Red Cross Medical Field Hangar A" },
    { dLat: -0.0040, dLng: 0.0035, w: 0.0015, h: 0.0011, height: 14, minHeight: 0, color: "#047857", name: "Field Hangar B & Triage Tents" },

    // Safe Shelter & Assembly Pavilions
    { dLat: -0.0008, dLng: 0.0068, w: 0.0024, h: 0.0020, height: 26, minHeight: 0, color: "#854d0e", name: "Main Assembly Pavilion" },
    { dLat: 0.0018, dLng: 0.0070, w: 0.0015, h: 0.0014, height: 20, minHeight: 0, color: "#713f12", name: "Hydration & Food Logistic Depot" },

    // Northern Commercial & Police Block
    { dLat: 0.0055, dLng: 0.0010, w: 0.0020, h: 0.0012, height: 52, minHeight: 0, color: "#1e293b", name: "North Gateway Tower" },
    { dLat: 0.0058, dLng: -0.0015, w: 0.0016, h: 0.0010, height: 42, minHeight: 0, color: "#334155", name: "Police Rapid Action Headquarters" },
    { dLat: 0.0072, dLng: -0.0030, w: 0.0018, h: 0.0014, height: 75, minHeight: 0, color: "#090d16", name: "Metro Transit Hub Tower" },

    // Western Relief & Transport Hub
    { dLat: -0.0045, dLng: -0.0080, w: 0.0022, h: 0.0016, height: 28, minHeight: 0, color: "#1e293b", name: "West Ambulance Depot" },
    { dLat: -0.0060, dLng: -0.0060, w: 0.0015, h: 0.0012, height: 18, minHeight: 0, color: "#334155", name: "Volunteer Dispatch Camp" },
  ];

  buildingSpecs.forEach((spec, idx) => {
    const lat = centerLat + spec.dLat;
    const lng = centerLng + spec.dLng;
    const w = spec.w;
    const h = spec.h;

    buildings.push({
      type: "Feature",
      id: `bldg-${idx}`,
      properties: {
        id: `bldg-${idx}`,
        name: spec.name,
        height: spec.height,
        min_height: spec.minHeight,
        color: spec.color
      },
      geometry: {
        type: "Polygon",
        coordinates: [
          [
            [lng - w / 2, lat - h / 2],
            [lng + w / 2, lat - h / 2],
            [lng + w / 2, lat + h / 2],
            [lng - w / 2, lat + h / 2],
            [lng - w / 2, lat - h / 2]
          ]
        ]
      }
    });
  });

  return {
    type: "FeatureCollection",
    features: buildings
  };
}

/* ══════════ OPERATIONAL ZONE POLYGONS (GEOJSON) ══════════ */
export function generateOperationalZonesGeoJSON(centerLat = 22.7196, centerLng = 75.8577) {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "zone-poly-red",
        properties: {
          name: "Critical Containment Zone (Gate 2)",
          severity: "CRITICAL",
          fillColor: "#ef4444",
          strokeColor: "#b91c1c",
          opacity: 0.28
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [centerLng + 0.0005, centerLat + 0.0005],
              [centerLng + 0.0040, centerLat + 0.0008],
              [centerLng + 0.0035, centerLat + 0.0035],
              [centerLng + 0.0002, centerLat + 0.0030],
              [centerLng + 0.0005, centerLat + 0.0005]
            ]
          ]
        }
      },
      {
        type: "Feature",
        id: "zone-poly-orange",
        properties: {
          name: "High-Surge Warning Perimeter",
          severity: "HIGH",
          fillColor: "#f97316",
          strokeColor: "#c2410c",
          opacity: 0.20
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [centerLng - 0.0035, centerLat + 0.0040],
              [centerLng + 0.0020, centerLat + 0.0065],
              [centerLng + 0.0045, centerLat + 0.0045],
              [centerLng - 0.0010, centerLat + 0.0025],
              [centerLng - 0.0035, centerLat + 0.0040]
            ]
          ]
        }
      },
      {
        type: "Feature",
        id: "zone-poly-green",
        properties: {
          name: "Safe Evacuation & Staging Zone",
          severity: "LOW",
          fillColor: "#10b981",
          strokeColor: "#047857",
          opacity: 0.18
        },
        geometry: {
          type: "Polygon",
          coordinates: [
            [
              [centerLng - 0.0100, centerLat - 0.0020],
              [centerLng - 0.0040, centerLat - 0.0020],
              [centerLng - 0.0040, centerLat - 0.0070],
              [centerLng - 0.0100, centerLat - 0.0070],
              [centerLng - 0.0100, centerLat - 0.0020]
            ]
          ]
        }
      }
    ]
  };
}

/* ══════════ DYNAMIC CROWD DENSITY HEATMAP (GEOJSON) ══════════ */
export function generateCrowdHeatmapGeoJSON(centerLat = 22.7196, centerLng = 75.8577) {
  const points = [
    { dLat: 0.0018, dLng: 0.0015, density: 95 },
    { dLat: 0.0022, dLng: 0.0020, density: 90 },
    { dLat: 0.0015, dLng: 0.0028, density: 85 },
    { dLat: -0.0010, dLng: 0.0005, density: 75 },
    { dLat: 0.0045, dLng: 0.0010, density: 70 },
    { dLat: 0.0035, dLng: -0.0025, density: 60 },
    { dLat: -0.0025, dLng: 0.0040, density: 80 },
    { dLat: -0.0040, dLng: 0.0015, density: 45 },
    { dLat: 0.0060, dLng: -0.0045, density: 55 },
    { dLat: 0.0008, dLng: -0.0060, density: 40 },
    { dLat: -0.0055, dLng: -0.0050, density: 30 }
  ];

  return {
    type: "FeatureCollection",
    features: points.map((p, i) => ({
      type: "Feature",
      id: `heat-${i}`,
      properties: { density: p.density },
      geometry: {
        type: "Point",
        coordinates: [centerLng + p.dLng, centerLat + p.dLat]
      }
    }))
  };
}

/* ══════════ EMERGENCY GREEN CORRIDORS (GEOJSON) ══════════ */
export function generateEmergencyCorridorsGeoJSON(centerLat = 22.7196, centerLng = 75.8577) {
  return {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        id: "corridor-priority-1",
        properties: {
          name: "National Highway to District Hospital Green Corridor",
          color: "#0284c7", // Bright cyan-blue
          speedLimit: 60,
          status: "PRIORITY_ACTIVE"
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [centerLng - 0.0120, centerLat - 0.0080],
            [centerLng - 0.0060, centerLat - 0.0030],
            [centerLng - 0.0065, centerLat + 0.0028], // Apex Hospital
            [centerLng - 0.0010, centerLat + 0.0040],
            [centerLng + 0.0040, centerLat + 0.0060]
          ]
        }
      },
      {
        type: "Feature",
        id: "corridor-priority-2",
        properties: {
          name: "Concourse Evacuation Direct Spline",
          color: "#10b981", // Emerald green
          speedLimit: 45,
          status: "STANDBY"
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [centerLng + 0.0020, centerLat + 0.0015],
            [centerLng + 0.0005, centerLat - 0.0020],
            [centerLng - 0.0030, centerLat - 0.0045],
            [centerLng - 0.0070, centerLat - 0.0055]
          ]
        }
      }
    ]
  };
}

/* ══════════ ROUTE & DISTANCE ESTIMATION ENGINE ══════════ */
/**
 * Haversine formula calculation for distance between two points in km.
 */
export function calculateDistanceKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Earth radius in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return parseFloat((R * c).toFixed(2));
}

/**
 * Calculates emergency response route with realistic waypoints and travel ETA.
 */
export function generateEmergencyRoute(
  startLat: number,
  startLng: number,
  endLat: number,
  endLng: number,
  averageSpeedKmH = 45
) {
  const distanceKm = calculateDistanceKm(startLat, startLng, endLat, endLng);
  // Manhattan/road curvature factor (~1.25x direct distance in Indian urban environments)
  const estimatedRoadDistanceKm = parseFloat((distanceKm * 1.25).toFixed(2));
  const travelTimeMinutes = Math.max(1, Math.round((estimatedRoadDistanceKm / averageSpeedKmH) * 60));

  // Synthesize realistic intermediate road bend waypoints
  const midLat1 = startLat + (endLat - startLat) * 0.35 + 0.0008;
  const midLng1 = startLng + (endLng - startLng) * 0.30 - 0.0006;
  const midLat2 = startLat + (endLat - startLat) * 0.70 - 0.0005;
  const midLng2 = startLng + (endLng - startLng) * 0.75 + 0.0007;

  const geoJsonRoute = {
    type: "FeatureCollection",
    features: [
      {
        type: "Feature",
        properties: {
          distanceKm: estimatedRoadDistanceKm,
          etaMinutes: travelTimeMinutes,
          type: "EMERGENCY_DISPATCH_ROUTE"
        },
        geometry: {
          type: "LineString",
          coordinates: [
            [startLng, startLat],
            [midLng1, midLat1],
            [midLng2, midLat2],
            [endLng, endLat]
          ]
        }
      }
    ]
  };

  return {
    roadDistanceKm: estimatedRoadDistanceKm,
    etaMinutes: travelTimeMinutes,
    geoJsonRoute
  };
}
