"""
JEEVAN AI — Landmark & Spatial Intelligence Engine

Maps spoken landmark names (in Hindi, Marathi, English, and romanized variants)
to GPS coordinates and operational zones across India.

Uses fuzzy matching to handle accents, mispronunciations, dialectal variations,
and speech-to-text transcription artifacts.

ARCHITECTURE NOTE:
In production deployments, landmark databases and operational zones are dynamically
configured per administrative district, municipal corporation, or state command center
(e.g., metropolitan civic centers, transit corridors, flood zones, or industrial belts).
Landmarks should be loaded from configuration files, environment settings, or a spatial
database table (e.g. PostGIS) per deployment jurisdiction using `LandmarkResolver.load_landmarks(...)`.
"""

import logging
from dataclasses import dataclass

from rapidfuzz import fuzz, process

logger = logging.getLogger(__name__)


@dataclass
class LandmarkInfo:
    """Information about a physical landmark or operational point of interest."""
    id: str
    name_en: str
    name_hi: str
    name_mr: str
    latitude: float
    longitude: float
    zone_id: str
    zone_name: str
    description: str


@dataclass
class LandmarkMatch:
    """Result of a landmark resolution search."""
    landmark: LandmarkInfo
    match_score: float  # 0-100
    matched_alias: str  # Which alias triggered the match


# ═══════════════════════════════════════════════════════════════════════════════
# CONFIGURABLE LANDMARK REPOSITORY
# Note: In production, load this from DB/Config per region/event
# ═══════════════════════════════════════════════════════════════════════════════

# Generic Indian civic/infrastructure landmarks applicable to national deployments
GENERIC_INDIAN_LANDMARKS: list[LandmarkInfo] = [
    LandmarkInfo(
        id="central_station",
        name_en="Central Railway Station",
        name_hi="केंद्रीय रेलवे स्टेशन",
        name_mr="मध्यवर्ती रेल्वे स्थानक",
        latitude=28.6448,
        longitude=77.2195,
        zone_id="ZONE_TRANSIT",
        zone_name="Transit & Transport Sector",
        description="Primary railway transit hub and high-density passenger terminal"
    ),
    LandmarkInfo(
        id="district_hospital",
        name_en="District Civil Hospital",
        name_hi="जिला नागरिक अस्पताल",
        name_mr="जिल्हा सामान्य रुग्णालय",
        latitude=28.6500,
        longitude=77.2200,
        zone_id="ZONE_MEDICAL",
        zone_name="Medical & Critical Care Sector",
        description="Tertiary emergency hospital with trauma center and ambulance base"
    ),
    LandmarkInfo(
        id="isbt_terminal",
        name_en="Central Bus Terminal (ISBT)",
        name_hi="केंद्रीय बस टर्मिनल (आईएसबीटी)",
        name_mr="मध्यवर्ती बस स्थानक",
        latitude=28.6670,
        longitude=77.2290,
        zone_id="ZONE_TRANSIT",
        zone_name="Transit & Transport Sector",
        description="Inter-state bus terminal and mass transit interchange"
    ),
    LandmarkInfo(
        id="town_hall",
        name_en="Town Hall & Municipal Plaza",
        name_hi="टाउन हॉल एवं नगर पालिका",
        name_mr="टाऊन हॉल व पालिका चौक",
        latitude=28.6560,
        longitude=77.2300,
        zone_id="ZONE_CENTRAL",
        zone_name="Administrative & Central District",
        description="Civic administration square and incident coordination outpost"
    ),
    LandmarkInfo(
        id="main_market_chowk",
        name_en="Main Market Chowk",
        name_hi="मुख्य बाजार चौक",
        name_mr="मुख्य बाजार चौक",
        latitude=28.6510,
        longitude=77.2315,
        zone_id="ZONE_COMMERCIAL",
        zone_name="Commercial Sector",
        description="High-density commercial market street and pedestrian corridor"
    ),
    LandmarkInfo(
        id="riverfront_ghat",
        name_en="Central Riverfront Ghat",
        name_hi="केंद्रीय रिवरफ्रंट घाट",
        name_mr="मध्यवर्ती नदीकाठ घाट",
        latitude=28.6600,
        longitude=77.2400,
        zone_id="ZONE_WATERFRONT",
        zone_name="Riverfront & Water Safety Sector",
        description="Waterfront promenade and public assembly bathing area"
    ),
    LandmarkInfo(
        id="mela_ground",
        name_en="Central Gathering Ground",
        name_hi="केंद्रीय मेला मैदान",
        name_mr="मध्यवर्ती मैदान",
        latitude=28.6400,
        longitude=77.2100,
        zone_id="ZONE_ASSEMBLY",
        zone_name="Event & Assembly Sector",
        description="Open grounds used for large public assemblies, exhibitions, and mass gatherings"
    ),
]

# Civic infrastructure landmarks applicable to nationwide Indian cities & districts
CIVIC_INFRASTRUCTURE_LANDMARKS: list[LandmarkInfo] = [
    LandmarkInfo(
        id="metro_interchange",
        name_en="Metro & Multimodal Interchange",
        name_hi="मेट्रो एवं मल्टीमॉडल इंटरचेंज",
        name_mr="मेट्रो व मल्टीमॉडल इंटरचेंज",
        latitude=28.6328,
        longitude=77.2197,
        zone_id="ZONE_TRANSIT",
        zone_name="Transit & Transport Sector",
        description="High-frequency urban metro junction and suburban transit hub"
    ),
    LandmarkInfo(
        id="collectorate_hq",
        name_en="District Collectorate & EOC",
        name_hi="जिला कलेक्ट्रेट एवं आपातकालीन केंद्र",
        name_mr="जिल्हाधिकारी कार्यालय व आपत्कालीन नियंत्रण केंद्र",
        latitude=28.6410,
        longitude=77.2250,
        zone_id="ZONE_CENTRAL",
        zone_name="Administrative & Central District",
        description="District Magistrate headquarters and 24x7 Emergency Operations Center"
    ),
    LandmarkInfo(
        id="apex_trauma_center",
        name_en="Apex Trauma Center & Medical College",
        name_hi="शीर्ष ट्रॉमा सेंटर एवं मेडिकल कॉलेज",
        name_mr="अतिविशेषोपचार ट्रॉमा सेंटर व वैद्यकीय महाविद्यालय",
        latitude=28.6550,
        longitude=77.2100,
        zone_id="ZONE_MEDICAL",
        zone_name="Medical & Critical Care Sector",
        description="Regional Level-1 trauma care and emergency triage hospital"
    ),
    LandmarkInfo(
        id="sports_stadium",
        name_en="National Sports Stadium Grounds",
        name_hi="राष्ट्रीय खेल स्टेडियम मैदान",
        name_mr="राष्ट्रीय क्रीडा संकुल मैदान",
        latitude=28.6250,
        longitude=77.2350,
        zone_id="ZONE_ASSEMBLY",
        zone_name="Event & Assembly Sector",
        description="Mass assembly stadium and designated emergency shelter ground"
    ),
    LandmarkInfo(
        id="highway_bypass_junction",
        name_en="Outer Bypass Highway Junction",
        name_hi="आउटर बाईपास हाईवे जंक्शन",
        name_mr="बायपास महामार्ग जंक्शन चौक",
        latitude=28.6700,
        longitude=77.2500,
        zone_id="ZONE_TRANSIT",
        zone_name="Transit & Transport Sector",
        description="Major national highway ring road junction and freight checkpoint"
    ),
    LandmarkInfo(
        id="industrial_area",
        name_en="District Industrial Corridor",
        name_hi="जिला औद्योगिक गलियारा",
        name_mr="जिल्हा औद्योगिक क्षेत्र",
        latitude=28.6100,
        longitude=77.2600,
        zone_id="ZONE_COMMERCIAL",
        zone_name="Commercial & Industrial Sector",
        description="Manufacturing, logistics warehouse, and hazardous material monitor zone"
    ),
]

# Combined default landmark catalog for national deployments
DEFAULT_LANDMARKS: list[LandmarkInfo] = GENERIC_INDIAN_LANDMARKS + CIVIC_INFRASTRUCTURE_LANDMARKS


# Alias map covering multilingual, transliterated, and colloquial spoken variants
DEFAULT_ALIAS_MAP: dict[str, list[str]] = {
    # Generic Indian Landmark Aliases
    "central_station": [
        "central station", "railway station", "railway", "train station",
        "station", "junction", "main station",
        "सेंट्रल स्टेशन", "रेलवे स्टेशन", "स्टेशन", "जंक्शन", "रेल्वे स्थानक",
    ],
    "district_hospital": [
        "civil hospital", "district hospital", "general hospital", "government hospital",
        "sarkari hospital", "hospital", "dispensary",
        "सिविल अस्पताल", "जिला अस्पताल", "सरकारी अस्पताल", "रुग्णालय", "दवाखाना",
    ],
    "isbt_terminal": [
        "isbt", "bus stand", "bus terminal", "interstate bus", "main bus stand",
        "बस स्टैंड", "बस अड्डा", "आईएसबीटी", "बसस्थानक", "मध्यवर्ती बस स्थानक",
    ],
    "town_hall": [
        "town hall", "collectorate", "nagarpalika", "corporation office", "city center",
        "टाउन हॉल", "कलेक्ट्रेट", "नगर पालिका", "महानगरपालिका",
    ],
    "main_market_chowk": [
        "main market", "market chowk", "bazaar", "market", "central market", "chowk",
        "बाजार", "मार्केट", "चौक", "मुख्य बाजार", "मेन मार्केट",
    ],
    "riverfront_ghat": [
        "riverfront", "river ghat", "bathing ghat", "promenade", "waterfront",
        "रिवरफ्रंट", "नदी किनारा", "घाट",
    ],
    "mela_ground": [
        "mela ground", "gathering ground", "exhibition ground", "parade ground",
        "stadium", "public ground", "maidan",
        "मेला मैदान", "मैदान", "स्टेडियम", "प्रदर्शन मैदान",
    ],

        # Civic Infrastructure Aliases
    "metro_interchange": [
        "metro station", "metro junction", "metro", "interchange",
        "मेट्रो स्टेशन", "मेट्रो",
    ],
    "collectorate_hq": [
        "collector office", "eoc", "district magistrate office", "dm office",
        "कलेक्टर ऑफिस", "जिल्हाधिकारी कार्यालय",
    ],
    "apex_trauma_center": [
        "trauma center", "medical college", "apex hospital", "emergency ward",
        "ट्रॉमा सेंटर", "मेडिकल कॉलेज",
    ],
    "sports_stadium": [
        "sports complex", "indoor stadium", "cricket ground",
        "क्रीडा संकुल", "स्टेडियम",
    ],
    "highway_bypass_junction": [
        "bypass junction", "toll plaza", "ring road", "highway chowk",
        "बाईपास", "टोल प्लाजा", "रिंग रोड",
    ],
    "industrial_area": [
        "midc", "industrial area", "logistics hub", "factory zone",
        "एमआईडीसी", "औद्योगिक क्षेत्र",
    ],
}


def build_alias_dictionary(alias_map: dict[str, list[str]]) -> dict[str, str]:
    """Flattens landmark alias mapping to lowercase alias -> landmark_id."""
    flat_aliases: dict[str, str] = {}
    for landmark_id, aliases in alias_map.items():
        for alias in aliases:
            flat_aliases[alias.lower().strip()] = landmark_id
    return flat_aliases


LANDMARK_ALIASES: dict[str, str] = build_alias_dictionary(DEFAULT_ALIAS_MAP)
LANDMARK_BY_ID: dict[str, LandmarkInfo] = {lm.id: lm for lm in DEFAULT_LANDMARKS}


class LandmarkResolver:
    """
    Resolves spoken landmark references to structured location data
    using fuzzy string matching.

    Supports configurable landmark data per deployment region (e.g. database-backed
    or configuration-driven regional event setups).
    """

    def __init__(
        self,
        landmarks: list[LandmarkInfo] | None = None,
        alias_map: dict[str, list[str]] | None = None,
        min_score: float = 60.0
    ):
        self._min_score = min_score
        self._landmark_by_id: dict[str, LandmarkInfo] = {}
        self._aliases: dict[str, str] = {}
        self._alias_list: list[str] = []
        self._zone_data: dict[str, dict] = self._get_default_zone_data()

        # Load initial landmarks
        self.load_landmarks(
            landmarks=landmarks if landmarks is not None else DEFAULT_LANDMARKS,
            alias_map=alias_map if alias_map is not None else DEFAULT_ALIAS_MAP
        )

    def load_landmarks(
        self,
        landmarks: list[LandmarkInfo],
        alias_map: dict[str, list[str]] | None = None
    ) -> None:
        """
        Dynamically load landmarks from database or configuration.
        Enables multi-region and custom venue deployments.
        """
        self._landmark_by_id = {lm.id: lm for lm in landmarks}
        if alias_map:
            self._aliases = build_alias_dictionary(alias_map)
        else:
            # Fallback alias generation from names
            self._aliases = {}
            for lm in landmarks:
                for name in (lm.name_en, lm.name_hi, lm.name_mr):
                    if name:
                        self._aliases[name.lower().strip()] = lm.id
        self._alias_list = list(self._aliases.keys())
        logger.info(
            f"LandmarkResolver configured: {len(self._landmark_by_id)} landmarks, "
            f"{len(self._alias_list)} aliases."
        )

    def resolve(self, text: str) -> LandmarkMatch | None:
        """
        Find the best matching landmark from free-form text.

        Args:
            text: Text to search for landmark references

        Returns:
            LandmarkMatch if found above threshold, else None
        """
        if not text or not text.strip():
            return None

        text_lower = text.lower().strip()

        # 1. Try exact substring match first
        for alias, landmark_id in self._aliases.items():
            if alias in text_lower:
                landmark = self._landmark_by_id.get(landmark_id)
                if landmark:
                    logger.info(
                        f"Landmark: Exact match '{alias}' → {landmark.name_en}"
                    )
                    return LandmarkMatch(
                        landmark=landmark,
                        match_score=100.0,
                        matched_alias=alias
                    )

        # 2. Fuzzy match against all aliases
        # Split text into words and try matching word groups
        words = text_lower.split()
        candidates = []

        # Try 1-word, 2-word, and 3-word combinations
        for n in range(1, min(4, len(words) + 1)):
            for i in range(len(words) - n + 1):
                phrase = " ".join(words[i:i + n])
                match = process.extractOne(
                    phrase,
                    self._alias_list,
                    scorer=fuzz.ratio,
                    score_cutoff=self._min_score
                )
                if match:
                    alias_text, score, _ = match
                    landmark_id = self._aliases[alias_text]
                    landmark = self._landmark_by_id.get(landmark_id)
                    if landmark:
                        candidates.append(LandmarkMatch(
                            landmark=landmark,
                            match_score=score,
                            matched_alias=alias_text
                        ))

        if candidates:
            best = max(candidates, key=lambda m: m.match_score)
            logger.info(
                f"Landmark: Fuzzy match '{best.matched_alias}' → "
                f"{best.landmark.name_en} (score={best.match_score:.0f})"
            )
            return best

        return None

    def _get_default_zone_data(self) -> dict[str, dict]:
        """Provides default operational zone risk parameters."""
        return {
            # Generic Operational Zones
            "ZONE_TRANSIT": {
                "name": "Transit & Transport Sector",
                "risk_level": "MEDIUM",
                "description": "Railway station, bus terminals, and transit interchanges",
                "nearest_hospital": "District Civil Hospital",
                "nearest_hospital_distance_km": 1.5,
            },
            "ZONE_MEDICAL": {
                "name": "Medical & Critical Care Sector",
                "risk_level": "LOW",
                "description": "Hospital hub and medical dispatch staging area",
                "nearest_hospital": "District Civil Hospital",
                "nearest_hospital_distance_km": 0.2,
            },
            "ZONE_CENTRAL": {
                "name": "Administrative & Central District",
                "risk_level": "HIGH",
                "description": "High administrative and public footfall sector",
                "nearest_hospital": "District Civil Hospital",
                "nearest_hospital_distance_km": 2.0,
            },
            "ZONE_COMMERCIAL": {
                "name": "Commercial Sector",
                "risk_level": "HIGH",
                "description": "Dense commercial retail corridor and shopping plazas",
                "nearest_hospital": "District Civil Hospital",
                "nearest_hospital_distance_km": 2.2,
            },
            "ZONE_WATERFRONT": {
                "name": "Riverfront & Water Safety Sector",
                "risk_level": "VERY_HIGH",
                "description": "Embankment, ghats, and high-density water gathering areas",
                "nearest_hospital": "District Civil Hospital",
                "nearest_hospital_distance_km": 2.8,
            },
            "ZONE_ASSEMBLY": {
                "name": "Event & Assembly Sector",
                "risk_level": "HIGH",
                "description": "Grounds for major public assemblies and rallies",
                "nearest_hospital": "District Civil Hospital",
                "nearest_hospital_distance_km": 3.0,
            },

                        # Standard National Operational Zones
            "ZONE_TRANSIT": {
                "name": "Transit & Transport Sector",
                "risk_level": "HIGH",
                "description": "Multimodal railway, bus, and metro interchanges with heavy pedestrian flow",
                "nearest_hospital": "District Civil Hospital",
                "nearest_hospital_distance_km": 1.5,
            },
            "ZONE_MEDICAL": {
                "name": "Medical & Critical Care Sector",
                "risk_level": "CRITICAL",
                "description": "Hospital district, trauma triage centers, and green corridor routes",
                "nearest_hospital": "Apex Trauma Center",
                "nearest_hospital_distance_km": 0.2,
            },
            "ZONE_CENTRAL": {
                "name": "Administrative & Central District",
                "risk_level": "HIGH",
                "description": "Collectorate, emergency operations center, and civic municipal hub",
                "nearest_hospital": "District Civil Hospital",
                "nearest_hospital_distance_km": 1.8,
            },
            "ZONE_COMMERCIAL": {
                "name": "Commercial & Market Sector",
                "risk_level": "MEDIUM",
                "description": "High-density retail markets, commercial plazas, and shopping corridors",
                "nearest_hospital": "District Civil Hospital",
                "nearest_hospital_distance_km": 2.2,
            },
            "ZONE_WATERFRONT": {
                "name": "Riverfront & Water Safety Sector",
                "risk_level": "HIGH",
                "description": "Embankments, ghats, and high-density water gathering areas",
                "nearest_hospital": "District Civil Hospital",
                "nearest_hospital_distance_km": 2.5,
            },
            "ZONE_ASSEMBLY": {
                "name": "Event & Public Assembly Sector",
                "risk_level": "HIGH",
                "description": "Grounds for major public assemblies, rallies, and stadium complexes",
                "nearest_hospital": "Apex Trauma Center",
                "nearest_hospital_distance_km": 2.0,
            }
        }

    def get_zone_info(self, zone_id: str) -> dict:
        """Get operational metrics and details for a zone."""
        return self._zone_data.get(zone_id, {
            "name": "Unknown Zone",
            "risk_level": "UNKNOWN",
        })

    def register_zone(self, zone_id: str, zone_info: dict) -> None:
        """Register or override an operational zone."""
        self._zone_data[zone_id] = zone_info


# Global singleton
landmark_resolver = LandmarkResolver()
