"use client";

import React, { useState, useCallback, useMemo, useRef } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
import {
  ArrowLeft, Shield, MapPin, Ambulance, Users, Heart,
  Hospital, AlertTriangle, Layers, Activity, Search,
  ChevronDown, ChevronLeft, ChevronRight, Compass,
  Crosshair, Maximize2, Minimize2, RotateCcw, Copy,
  Check, Phone, Navigation, Building2, Flame, Sparkles,
  X, Radio, SlidersHorizontal, Eye, EyeOff
} from "lucide-react";
import type { MapRef } from "react-map-gl/maplibre";
import type { MapPoint, MapStyleMode } from "@web/components/Map";
import {
  INDIAN_COMMAND_HUBS,
  DEMO_INCIDENTS,
  DEMO_HOSPITALS,
  DEMO_AMBULANCES,
  DEMO_POLICE_POSTS,
  DEMO_SHELTERS,
  DEMO_OPERATIONAL_ZONES,
  generateOperationalZonesGeoJSON,
  generateCrowdHeatmapGeoJSON,
  generateEmergencyCorridorsGeoJSON,
  generateEmergencyRoute,
  calculateDistanceKm,
  type EmergencyIncident,
  type HospitalFacility,
  type AmbulanceUnit,
  type OperationalZone,
  type CityHub
} from "@web/lib/geoIntelligenceData";
import { geocodeLocation, calculateGoogleRoute } from "@web/lib/googleMaps";

// Dynamically import the upgraded 3D Map
const DynamicMap = dynamic(() => import("@web/components/Map").then((mod) => mod.Map), {
  ssr: false,
  loading: () => (
    <div className="w-full h-full flex flex-col items-center justify-center bg-slate-950 text-slate-300 gap-3">
      <div className="w-12 h-12 rounded-full border-2 border-cyan-500 border-t-transparent animate-spin" />
      <div className="font-mono text-xs tracking-widest text-cyan-400 animate-pulse">
        INITIALIZING 3D GEOSPATIAL INTELLIGENCE ENGINE...
      </div>
    </div>
  ),
});

export default function LiveMapPage() {
  const mapRef = useRef<MapRef | null>(null);

  // Geographic Viewport State
  const [selectedHub, setSelectedHub] = useState<CityHub>(INDIAN_COMMAND_HUBS[1]); // Default to Central Concourse
  const [center, setCenter] = useState<[number, number]>(INDIAN_COMMAND_HUBS[1].center);
  const [zoom, setZoom] = useState<number>(INDIAN_COMMAND_HUBS[1].zoom);
  const [pitch, setPitch] = useState<number>(INDIAN_COMMAND_HUBS[1].pitch);
  const [bearing, setBearing] = useState<number>(INDIAN_COMMAND_HUBS[1].bearing);
  const [is3D, setIs3D] = useState<boolean>(true);
  const [styleMode, setStyleMode] = useState<MapStyleMode>("google-hybrid");

  // Selection & UI State
  const [selectedPointId, setSelectedPointId] = useState<string | null>(null);
  const [selectedDetail, setSelectedDetail] = useState<
    | { type: "incident"; data: EmergencyIncident }
    | { type: "hospital"; data: HospitalFacility }
    | { type: "ambulance"; data: AmbulanceUnit }
    | { type: "zone"; data: OperationalZone }
    | { type: "police" | "shelter"; data: Record<string, unknown> & { title?: string; latitude: number; longitude: number } }
    | null
  >(null);

  const [activeTab, setActiveTab] = useState<"incidents" | "facilities" | "fleet" | "routes">("incidents");
  const [severityFilter, setSeverityFilter] = useState<"ALL" | "CRITICAL" | "HIGH" | "MEDIUM" | "LOW">("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [sidebarCollapsed, setSidebarCollapsed] = useState<boolean>(false);
  const [showLayersModal, setShowLayersModal] = useState<boolean>(false);
  const [showStyleMenu, setShowStyleMenu] = useState<boolean>(false);

  // User Geolocation State
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number; accuracy?: number } | null>(null);
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [locationToast, setLocationToast] = useState<string | null>(null);

  // Route Planning State
  const [activeRouteData, setActiveRouteData] = useState<Record<string, unknown> | null>(null);
  const [routeStats, setRouteStats] = useState<{
    distanceKm: number;
    etaMinutes: number;
    fromLabel: string;
    toLabel: string;
  } | null>(null);

  // UI Toast State
  const [copiedCoords, setCopiedCoords] = useState<boolean>(false);

  // Operational Layers State
  const [layers, setLayers] = useState({
    incidents: true,
    facilities: true,
    fleet: true,
    zones: true,
    buildings: true,
    heatmap: false,
    corridors: true,
    police: false,
    shelters: false,
  });

  const toggleLayer = useCallback((key: keyof typeof layers) => {
    setLayers(prev => ({ ...prev, [key]: !prev[key] }));
  }, []);

  const activeLayerCount = useMemo(() => {
    return Object.values(layers).filter(Boolean).length;
  }, [layers]);

  /* ══════════ DYNAMIC GEOJSON LAYERS ══════════ */
  const operationalZonesData = useMemo(() => {
    return layers.zones ? generateOperationalZonesGeoJSON(center[0], center[1]) : null;
  }, [layers.zones, center]);

  const heatmapGeoData = useMemo(() => {
    return layers.heatmap ? generateCrowdHeatmapGeoJSON(center[0], center[1]) : null;
  }, [layers.heatmap, center]);

  const corridorsGeoData = useMemo(() => {
    return layers.corridors ? generateEmergencyCorridorsGeoJSON(center[0], center[1]) : null;
  }, [layers.corridors, center]);

  /* ══════════ MAP POINTS COMPILATION ══════════ */
  const activeMapPoints = useMemo(() => {
    const points: MapPoint[] = [];

    // Incidents
    if (layers.incidents) {
      DEMO_INCIDENTS.filter(inc => {
        if (severityFilter === "ALL") return true;
        return inc.severity === severityFilter;
      }).forEach(inc => {
        points.push({
          id: inc.id,
          latitude: inc.latitude,
          longitude: inc.longitude,
          title: inc.title,
          type: "incident",
          severity: inc.severity,
          metadata: inc
        });
      });
    }

    // Hospitals
    if (layers.facilities) {
      DEMO_HOSPITALS.forEach(hosp => {
        points.push({
          id: hosp.id,
          latitude: hosp.latitude,
          longitude: hosp.longitude,
          title: hosp.name,
          type: hosp.type === "FIELD_HOSPITAL" ? "camp" : "hospital",
          severity: hosp.status === "SURGE_OVERFLOW" ? "CRITICAL" : "MEDIUM",
          metadata: hosp
        });
      });
    }

    // Ambulances
    if (layers.fleet) {
      DEMO_AMBULANCES.forEach(amb => {
        points.push({
          id: amb.id,
          latitude: amb.latitude,
          longitude: amb.longitude,
          title: amb.callsign,
          type: "ambulance",
          severity: amb.status === "DISPATCHED" ? "CRITICAL" : amb.status === "EN_ROUTE" ? "HIGH" : "LOW",
          metadata: amb
        });
      });
    }

    // Operational Zones Centroids
    if (layers.zones) {
      DEMO_OPERATIONAL_ZONES.forEach(zone => {
        points.push({
          id: zone.id,
          latitude: zone.latitude,
          longitude: zone.longitude,
          title: zone.name,
          type: "zone",
          severity: zone.tier === "CRITICAL_RED" ? "CRITICAL" : zone.tier === "ELEVATED_ORANGE" ? "HIGH" : "LOW",
          metadata: zone
        });
      });
    }

    // Police Posts
    if (layers.police) {
      DEMO_POLICE_POSTS.forEach(pol => {
        points.push({
          id: pol.id,
          latitude: pol.latitude,
          longitude: pol.longitude,
          title: pol.title,
          type: pol.type,
          severity: pol.severity,
          metadata: pol
        });
      });
    }

    // Shelters
    if (layers.shelters) {
      DEMO_SHELTERS.forEach(shl => {
        points.push({
          id: shl.id,
          latitude: shl.latitude,
          longitude: shl.longitude,
          title: shl.title,
          type: shl.type,
          severity: shl.severity,
          metadata: shl
        });
      });
    }

    return points;
  }, [layers, severityFilter]);

  /* ══════════ CAMERA & NAVIGATION HANDLERS ══════════ */
  const flyToCoords = useCallback((lat: number, lng: number, targetZoom = 15.5, targetPitch = 62, targetBearing = -25) => {
    setCenter([lat, lng]);
    setZoom(targetZoom);
    setPitch(targetPitch);
    setBearing(targetBearing);

    mapRef.current?.flyTo({
      center: [lng, lat],
      zoom: targetZoom,
      pitch: targetPitch,
      bearing: targetBearing,
      duration: 2000,
      essential: true
    });
  }, []);

  const handleSelectHub = useCallback((hub: CityHub) => {
    setSelectedHub(hub);
    flyToCoords(hub.center[0], hub.center[1], hub.zoom, hub.pitch, hub.bearing);
  }, [flyToCoords]);

  const toggle3DPerspective = useCallback(() => {
    setIs3D(prev => {
      const nextIs3D = !prev;
      const targetPitch = nextIs3D ? 65 : 0;
      const targetBearing = nextIs3D ? -25 : 0;
      setPitch(targetPitch);
      setBearing(targetBearing);

      mapRef.current?.easeTo({
        pitch: targetPitch,
        bearing: targetBearing,
        duration: 1200
      });
      return nextIs3D;
    });
  }, []);

  const resetNorthBearing = useCallback(() => {
    setBearing(0);
    mapRef.current?.easeTo({
      bearing: 0,
      duration: 800
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    mapRef.current?.zoomIn({ duration: 300 });
  }, []);

  const handleZoomOut = useCallback(() => {
    mapRef.current?.zoomOut({ duration: 300 });
  }, []);

  const handleUserGeolocation = useCallback(() => {
    if (!navigator.geolocation) {
      setLocationToast("Geolocation is not supported by your browser");
      setTimeout(() => setLocationToast(null), 3500);
      return;
    }

    setIsLocating(true);
    setLocationToast("Requesting GPS positioning permission...");

    navigator.geolocation.getCurrentPosition(
      (position) => {
        setIsLocating(false);
        const userLat = position.coords.latitude;
        const userLng = position.coords.longitude;
        const accuracy = position.coords.accuracy;

        setUserLocation({
          latitude: userLat,
          longitude: userLng,
          accuracy
        });

        setLocationToast(`GPS Located (±${Math.round(accuracy)}m) • Flying to position`);
        setTimeout(() => setLocationToast(null), 4000);

        flyToCoords(userLat, userLng, 16.0, 60, -20);
      },
      (error) => {
        setIsLocating(false);
        let errMsg = "Unable to retrieve device location";
        if (error.code === error.PERMISSION_DENIED) {
          errMsg = "Location access denied by user";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          errMsg = "Location information unavailable";
        }
        setLocationToast(errMsg);
        setTimeout(() => setLocationToast(null), 4000);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 30000 }
    );
  }, [flyToCoords]);

  /* ══════════ MARKER CLICK & DETAIL SELECTION ══════════ */
  const handlePointClick = useCallback((point: MapPoint) => {
    setSelectedPointId(point.id);

    if (point.type === "incident") {
      const inc = DEMO_INCIDENTS.find(i => i.id === point.id) || (point.metadata as EmergencyIncident);
      setSelectedDetail({ type: "incident", data: inc });
    } else if (point.type === "hospital" || point.type === "camp") {
      const hosp = DEMO_HOSPITALS.find(h => h.id === point.id) || (point.metadata as HospitalFacility);
      setSelectedDetail({ type: "hospital", data: hosp });
    } else if (point.type === "ambulance") {
      const amb = DEMO_AMBULANCES.find(a => a.id === point.id) || (point.metadata as AmbulanceUnit);
      setSelectedDetail({ type: "ambulance", data: amb });
    } else if (point.type === "zone") {
      const zone = DEMO_OPERATIONAL_ZONES.find(z => z.id === point.id) || (point.metadata as OperationalZone);
      setSelectedDetail({ type: "zone", data: zone });
    } else {
      const fallbackType = (point.type === "police" || point.type === "shelter") ? point.type : "police";
      setSelectedDetail({
        type: fallbackType,
        data: {
          title: point.title,
          latitude: point.latitude,
          longitude: point.longitude,
          ...(point.metadata || {})
        }
      });
    }

    flyToCoords(point.latitude, point.longitude, Math.max(zoom, 15.2), pitch, bearing);
  }, [zoom, pitch, bearing, flyToCoords]);

  /* ══════════ ROUTE CALCULATION HANDLER (GOOGLE MAPS + PROCEDURAL FALLBACK) ══════════ */
  const handleCalculateRoute = useCallback(async (
    fromLat: number,
    fromLng: number,
    toLat: number,
    toLng: number,
    fromLabel: string,
    toLabel: string
  ) => {
    // Attempt Google Directions API calculation
    const googleRoute = await calculateGoogleRoute(
      { lat: fromLat, lng: fromLng },
      { lat: toLat, lng: toLng }
    );

    if (googleRoute && googleRoute.coordinates.length > 0) {
      setActiveRouteData({
        type: "Feature",
        geometry: {
          type: "LineString",
          coordinates: googleRoute.coordinates
        },
        properties: {
          summary: googleRoute.summary
        }
      });
      setRouteStats({
        distanceKm: googleRoute.distanceKm,
        etaMinutes: googleRoute.durationMinutes,
        fromLabel,
        toLabel
      });
      setLocationToast(`Google Directions: ${googleRoute.distanceKm} km • ~${googleRoute.durationMinutes} min ETA`);
      setTimeout(() => setLocationToast(null), 4000);
    } else {
      // Procedural corridor fallback
      const route = generateEmergencyRoute(fromLat, fromLng, toLat, toLng, 48);
      setActiveRouteData(route.geoJsonRoute);
      setRouteStats({
        distanceKm: route.roadDistanceKm,
        etaMinutes: route.etaMinutes,
        fromLabel,
        toLabel
      });
    }

    // Center map midway between points
    const midLat = (fromLat + toLat) / 2;
    const midLng = (fromLng + toLng) / 2;
    flyToCoords(midLat, midLng, 14.5, 62, -25);
  }, [flyToCoords]);

  /* ══════════ GOOGLE MAPS GEOCODING SEARCH HANDLER ══════════ */
  const handleLocationSearch = useCallback(async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const query = searchQuery.trim();
    if (!query) return;

    // 1. Check local demo items first
    const matchIncident = DEMO_INCIDENTS.find(i =>
      i.title.toLowerCase().includes(query.toLowerCase()) ||
      i.locationName.toLowerCase().includes(query.toLowerCase())
    );
    if (matchIncident) {
      setSelectedPointId(matchIncident.id);
      setSelectedDetail({ type: "incident", data: matchIncident });
      flyToCoords(matchIncident.latitude, matchIncident.longitude, 16, 62, -25);
      return;
    }

    const matchHospital = DEMO_HOSPITALS.find(h =>
      h.name.toLowerCase().includes(query.toLowerCase())
    );
    if (matchHospital) {
      setSelectedPointId(matchHospital.id);
      setSelectedDetail({ type: "hospital", data: matchHospital });
      flyToCoords(matchHospital.latitude, matchHospital.longitude, 16, 62, -25);
      return;
    }

    // 2. Query Google Maps Geocoding API
    setLocationToast(`Geocoding "${query}" via Google Maps...`);
    const geo = await geocodeLocation(query);
    if (geo) {
      setLocationToast(`Google Maps: ${geo.formattedAddress}`);
      setTimeout(() => setLocationToast(null), 4500);
      flyToCoords(geo.lat, geo.lng, 16.0, 62, -25);
    } else {
      setLocationToast(`No location match for "${query}"`);
      setTimeout(() => setLocationToast(null), 3000);
    }
  }, [searchQuery, flyToCoords]);

  const handleRouteToIncident = useCallback((incident: EmergencyIncident) => {
    // Find closest available ambulance
    const availableAmbs = DEMO_AMBULANCES.filter(a => a.status === "AVAILABLE" || a.status === "EN_ROUTE");
    const closestAmb = availableAmbs[0] || DEMO_AMBULANCES[0];

    handleCalculateRoute(
      closestAmb.latitude,
      closestAmb.longitude,
      incident.latitude,
      incident.longitude,
      closestAmb.callsign,
      incident.title
    );
  }, [handleCalculateRoute]);

  const handleCopyCoordinates = useCallback((lat: number, lng: number) => {
    const text = `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
    navigator.clipboard.writeText(text);
    setCopiedCoords(true);
    setTimeout(() => setCopiedCoords(false), 2000);
  }, []);

  /* ══════════ FILTERED SEARCH DATA ══════════ */
  const filteredIncidents = useMemo(() => {
    return DEMO_INCIDENTS.filter(inc => {
      const matchesSearch = inc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            inc.locationName.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesSeverity = severityFilter === "ALL" || inc.severity === severityFilter;
      return matchesSearch && matchesSeverity;
    });
  }, [searchQuery, severityFilter]);

  const filteredHospitals = useMemo(() => {
    return DEMO_HOSPITALS.filter(h =>
      h.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      h.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  const filteredAmbulances = useMemo(() => {
    return DEMO_AMBULANCES.filter(a =>
      a.callsign.toLowerCase().includes(searchQuery.toLowerCase()) ||
      a.paramedicTeam.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [searchQuery]);

  return (
    <div className="h-[100dvh] w-full flex flex-col bg-slate-950 text-slate-100 overflow-hidden font-sans select-none" data-theme="ink">

      {/* ════════════ TOP FLOATING COMMAND BAR ════════════ */}
      <header className="z-30 px-3 py-2 bg-slate-950/85 backdrop-blur-xl border-b border-slate-800/80 flex items-center justify-between gap-3 shadow-2xl shrink-0">
        <div className="flex items-center gap-3">
          <Link
            href="/emergency"
            className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700/80 flex items-center justify-center text-slate-300 hover:text-white hover:border-cyan-500 transition-all shadow"
            title="Return to Emergency Portal"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>

          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xs sm:text-sm font-bold tracking-tight text-white flex items-center gap-1.5 font-display">
                <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping inline-block" />
                JEEVAN AI
                <span className="text-slate-400 font-normal">| 3D Geospatial Intelligence Command</span>
              </h1>
              <span className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded bg-cyan-950/70 border border-cyan-800/60 text-[9px] font-mono text-cyan-300">
                [LIVE] TELEMETRY
              </span>
            </div>
            <p className="text-[10px] text-slate-400 hidden md:block">
              National Emergency & Public Health Surveillance Grid • 3D Terrain Elevation & Building Extrusions
            </p>
          </div>
        </div>

        {/* Quick Regional Hub Switcher Chips */}
        <div className="hidden lg:flex items-center gap-1.5 overflow-x-auto no-scrollbar py-0.5">
          {INDIAN_COMMAND_HUBS.map(hub => {
            const isSelected = selectedHub.id === hub.id;
            return (
              <button
                key={hub.id}
                onClick={() => handleSelectHub(hub)}
                className={`px-2.5 py-1 rounded-full text-[11px] font-medium transition-all whitespace-nowrap flex items-center gap-1 border ${
                  isSelected
                    ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/70 shadow-[0_0_12px_rgba(56,189,248,0.3)]"
                    : "bg-slate-900/80 text-slate-400 border-slate-800 hover:text-white hover:border-slate-700"
                }`}
              >
                <MapPin className="w-3 h-3 text-cyan-400" />
                {hub.name.split("—")[0].trim()}
              </button>
            );
          })}
        </div>

        {/* Right Header Action Stack */}
        <div className="flex items-center gap-2">
          {/* Active Layers Counter Button */}
          <button
            onClick={() => setShowLayersModal(!showLayersModal)}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg border text-xs font-semibold transition-all ${
              showLayersModal
                ? "bg-cyan-950 border-cyan-500 text-cyan-300"
                : "bg-slate-900/90 border-slate-700 text-slate-300 hover:text-white hover:border-slate-600"
            }`}
            title="Toggle Emergency Intelligence Layers"
          >
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Layers</span>
            <span className="px-1.5 py-0.2 bg-cyan-500/20 text-cyan-300 rounded-full text-[10px] font-mono font-bold">
              {activeLayerCount}
            </span>
          </button>

          {/* Emergency SOS Quick Trigger */}
          <Link
            href="/sos"
            className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-[0_0_15px_rgba(239,68,68,0.5)] transition-all animate-pulse"
          >
            <Flame className="w-3.5 h-3.5" />
            <span className="hidden xs:inline">SOS Report</span>
          </Link>
        </div>
      </header>

      {/* ════════════ MAIN INTERFACE CONTAINER ════════════ */}
      <div className="flex-1 relative flex overflow-hidden">

        {/* ══════ LEFT COLLAPSIBLE INTELLIGENCE SIDEBAR ══════ */}
        <aside
          className={`absolute md:relative z-20 h-full transition-all duration-300 ease-in-out flex flex-col bg-slate-950/95 backdrop-blur-2xl border-r border-slate-800/80 shadow-2xl ${
            sidebarCollapsed
              ? "w-0 -translate-x-full md:w-0 md:translate-x-0 overflow-hidden"
              : "w-full sm:w-88 md:w-96 translate-x-0"
          }`}
        >
          {/* Sidebar Header & Search */}
          <div className="p-3 border-b border-slate-800/80 shrink-0 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-[11px] font-mono tracking-wider uppercase text-cyan-400 font-bold flex items-center gap-1.5">
                <Radio className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
                Live Incident Dispatch Queue
              </span>
              <button
                onClick={() => setSidebarCollapsed(true)}
                className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
                title="Collapse Sidebar"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Search Input with Google Maps Geocoding */}
            <form onSubmit={handleLocationSearch} className="relative flex items-center">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input
                type="text"
                placeholder="Search location, incidents, hospitals (Enter)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 focus:border-cyan-500 rounded-lg pl-8 pr-14 py-1.5 text-xs text-white placeholder-slate-500 outline-none transition-colors"
              />
              <div className="absolute right-1.5 top-1/2 -translate-y-1/2 flex items-center gap-1">
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery("")}
                    className="text-slate-400 hover:text-white p-0.5"
                    title="Clear"
                  >
                    <X className="w-3 h-3" />
                  </button>
                )}
                <button
                  type="submit"
                  className="px-1.5 py-0.5 rounded bg-cyan-600 hover:bg-cyan-500 text-[10px] font-bold text-slate-950 transition-colors"
                  title="Geocode with Google Maps"
                >
                  Go
                </button>
              </div>
            </form>

            {/* Navigation Tabs */}
            <div className="grid grid-cols-4 gap-1 p-0.5 bg-slate-900/90 rounded-lg border border-slate-800">
              <button
                onClick={() => setActiveTab("incidents")}
                className={`py-1.5 rounded text-[11px] font-medium transition-all ${
                  activeTab === "incidents"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Incidents
              </button>
              <button
                onClick={() => setActiveTab("facilities")}
                className={`py-1.5 rounded text-[11px] font-medium transition-all ${
                  activeTab === "facilities"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Hospitals
              </button>
              <button
                onClick={() => setActiveTab("fleet")}
                className={`py-1.5 rounded text-[11px] font-medium transition-all ${
                  activeTab === "fleet"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Fleet
              </button>
              <button
                onClick={() => setActiveTab("routes")}
                className={`py-1.5 rounded text-[11px] font-medium transition-all ${
                  activeTab === "routes"
                    ? "bg-cyan-500 text-slate-950 font-bold shadow"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                Routes
              </button>
            </div>
          </div>

          {/* Sidebar Tab Contents */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-800/60 p-2 space-y-2">

            {/* ─── TAB 1: INCIDENTS ─── */}
            {activeTab === "incidents" && (
              <div className="space-y-2">
                {/* Severity Filters */}
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar py-1">
                  {(["ALL", "CRITICAL", "HIGH", "MEDIUM", "LOW"] as const).map(sev => (
                    <button
                      key={sev}
                      onClick={() => setSeverityFilter(sev)}
                      className={`px-2 py-0.5 rounded text-[10px] font-bold tracking-tight transition-colors ${
                        severityFilter === sev
                          ? sev === "CRITICAL"
                            ? "bg-red-500 text-white"
                            : sev === "HIGH"
                            ? "bg-orange-500 text-slate-950"
                            : "bg-cyan-500 text-slate-950"
                          : "bg-slate-900 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      {sev}
                    </button>
                  ))}
                </div>

                {filteredIncidents.length === 0 ? (
                  <div className="text-center py-8 text-slate-500 text-xs">
                    No matching incidents found
                  </div>
                ) : (
                  filteredIncidents.map(inc => {
                    const isSelected = selectedPointId === inc.id;
                    return (
                      <div
                        key={inc.id}
                        onClick={() => {
                          setSelectedPointId(inc.id);
                          setSelectedDetail({ type: "incident", data: inc });
                          flyToCoords(inc.latitude, inc.longitude, 15.5, 62, -25);
                        }}
                        className={`p-3 rounded-xl border cursor-pointer transition-all ${
                          isSelected
                            ? "bg-red-950/40 border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]"
                            : "bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex items-center gap-1.5">
                            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping" />
                            <span className="text-[10px] font-mono text-cyan-400 font-bold">{inc.provenance}</span>
                            <span className="text-[9px] text-slate-400">• {inc.reportedAt}</span>
                          </div>
                          <span
                            className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                              inc.severity === "CRITICAL"
                                ? "bg-red-500/20 text-red-400 border border-red-500/40"
                                : inc.severity === "HIGH"
                                ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                                : "bg-sky-500/20 text-sky-400 border border-sky-500/40"
                            }`}
                          >
                            {inc.severity}
                          </span>
                        </div>

                        <h4 className="text-xs font-bold text-white mt-1.5">{inc.title}</h4>
                        <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-500 shrink-0" />
                          {inc.locationName}
                        </p>

                        <div className="mt-2 pt-2 border-t border-slate-800/80 flex items-center justify-between text-[10px]">
                          <span className="text-slate-400">Casualties: <strong className="text-white">{inc.casualtiesCount}</strong></span>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleRouteToIncident(inc);
                            }}
                            className="px-2 py-0.5 rounded bg-cyan-950 border border-cyan-600/60 text-cyan-300 font-semibold hover:bg-cyan-900 transition-colors flex items-center gap-1"
                          >
                            <Navigation className="w-2.5 h-2.5" />
                            Route Ambulance
                          </button>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>
            )}

            {/* ─── TAB 2: FACILITIES ─── */}
            {activeTab === "facilities" && (
              <div className="space-y-2">
                {filteredHospitals.map(hosp => {
                  const isSelected = selectedPointId === hosp.id;
                  const icuPercent = Math.round((hosp.icuBedsAvailable / hosp.icuBedsTotal) * 100);

                  return (
                    <div
                      key={hosp.id}
                      onClick={() => {
                        setSelectedPointId(hosp.id);
                        setSelectedDetail({ type: "hospital", data: hosp });
                        flyToCoords(hosp.latitude, hosp.longitude, 15.5, 60, -20);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-indigo-950/40 border-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.3)]"
                          : "bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] font-mono text-indigo-400 font-bold px-1.5 py-0.5 bg-indigo-950/60 rounded border border-indigo-800">
                          {hosp.traumaLevel.replace("_", " ")}
                        </span>
                        <span className={`text-[10px] font-mono font-bold ${hosp.status === "NORMAL" ? "text-emerald-400" : "text-amber-400"}`}>
                          {hosp.status}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-1.5 flex items-center gap-1.5">
                        <Hospital className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
                        {hosp.name}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">{hosp.address}</p>

                      {/* Bed Gauges */}
                      <div className="grid grid-cols-3 gap-1.5 mt-2.5 pt-2 border-t border-slate-800 text-center">
                        <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80">
                          <div className="text-[9px] text-slate-400">ICU Beds</div>
                          <div className={`text-xs font-black ${hosp.icuBedsAvailable > 0 ? "text-emerald-400" : "text-red-400"}`}>
                            {hosp.icuBedsAvailable} / {hosp.icuBedsTotal}
                          </div>
                        </div>
                        <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80">
                          <div className="text-[9px] text-slate-400">O2 Beds</div>
                          <div className="text-xs font-black text-cyan-400">
                            {hosp.oxygenBedsAvailable} / {hosp.oxygenBedsTotal}
                          </div>
                        </div>
                        <div className="p-1.5 bg-slate-950 rounded border border-slate-800/80">
                          <div className="text-[9px] text-slate-400">Blood Units</div>
                          <div className="text-xs font-black text-rose-400">
                            {hosp.bloodUnitsReserve}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── TAB 3: FLEET ─── */}
            {activeTab === "fleet" && (
              <div className="space-y-2">
                {filteredAmbulances.map(amb => {
                  const isSelected = selectedPointId === amb.id;
                  const isMoving = amb.speedKmH > 0;

                  return (
                    <div
                      key={amb.id}
                      onClick={() => {
                        setSelectedPointId(amb.id);
                        setSelectedDetail({ type: "ambulance", data: amb });
                        flyToCoords(amb.latitude, amb.longitude, 15.8, 65, -30);
                      }}
                      className={`p-3 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? "bg-sky-950/40 border-sky-400 shadow-[0_0_15px_rgba(56,189,248,0.3)]"
                          : "bg-slate-900/60 border-slate-800 hover:bg-slate-900 hover:border-slate-700"
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="text-[9px] font-mono font-bold text-sky-400">{amb.provenance}</span>
                        <span
                          className={`px-1.5 py-0.5 rounded text-[9px] font-black ${
                            amb.status === "EN_ROUTE"
                              ? "bg-red-500/20 text-red-400 border border-red-500/40 animate-pulse"
                              : amb.status === "DISPATCHED"
                              ? "bg-orange-500/20 text-orange-400 border border-orange-500/40"
                              : "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                          }`}
                        >
                          {amb.status.replace("_", " ")}
                        </span>
                      </div>

                      <h4 className="text-xs font-bold text-white mt-1.5 flex items-center gap-1.5">
                        <Ambulance className="w-3.5 h-3.5 text-sky-400" />
                        {amb.callsign}
                      </h4>
                      <p className="text-[10px] text-slate-400 mt-0.5">Crew: {amb.paramedicTeam}</p>

                      <div className="flex items-center justify-between mt-2 pt-2 border-t border-slate-800 text-[10px]">
                        <span className="text-slate-400 flex items-center gap-1">
                          <Activity className="w-3 h-3 text-cyan-400" />
                          Speed: <strong className="text-white">{amb.speedKmH} km/h</strong>
                        </span>
                        <span className="text-slate-400">
                          Fuel/Batt: <strong className="text-emerald-400">{amb.batteryFuelPercent}%</strong>
                        </span>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            {/* ─── TAB 4: ROUTE PLANNER ─── */}
            {activeTab === "routes" && (
              <div className="space-y-3">
                <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 text-xs space-y-2">
                  <div className="font-bold text-cyan-300 flex items-center gap-1.5">
                    <Navigation className="w-4 h-4 text-cyan-400" />
                    AI Emergency Green Corridor
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">
                    Calculates traffic-preempted arterial routing for ALS emergency vehicles with dynamic signal prioritization.
                  </p>

                  {routeStats ? (
                    <div className="p-2.5 bg-slate-950 rounded-lg border border-cyan-800/60 space-y-1.5 mt-2">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Road Distance</span>
                        <span className="font-mono font-bold text-white text-xs">{routeStats.distanceKm} km</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400">Emergency Siren ETA</span>
                        <span className="font-mono font-bold text-emerald-400 text-sm">~{routeStats.etaMinutes} mins</span>
                      </div>
                      <div className="text-[10px] text-slate-400 pt-1 border-t border-slate-800 truncate">
                        From: <span className="text-slate-200">{routeStats.fromLabel}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        To: <span className="text-slate-200">{routeStats.toLabel}</span>
                      </div>
                      <button
                        onClick={() => {
                          setActiveRouteData(null);
                          setRouteStats(null);
                        }}
                        className="w-full mt-2 py-1 text-[10px] rounded bg-slate-900 hover:bg-slate-800 text-slate-300 font-semibold"
                      >
                        Clear Active Route
                      </button>
                    </div>
                  ) : (
                    <div className="text-center py-4 text-slate-500 text-[11px]">
                      Select any incident or hospital to calculate an emergency corridor
                    </div>
                  )}
                </div>

                <div className="p-3 bg-slate-900/50 rounded-xl border border-slate-800/80 space-y-2">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-wider block font-bold">
                    Quick Preset Corridors
                  </span>
                  {DEMO_INCIDENTS.slice(0, 3).map(inc => (
                    <button
                      key={inc.id}
                      onClick={() => handleRouteToIncident(inc)}
                      className="w-full p-2 text-left bg-slate-950/70 hover:bg-slate-900 rounded-lg border border-slate-800 text-[11px] text-slate-300 flex items-center justify-between group"
                    >
                      <span className="truncate pr-2">{inc.title}</span>
                      <ArrowLeft className="w-3.5 h-3.5 rotate-180 text-cyan-400 group-hover:translate-x-0.5 transition-transform shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            )}

          </div>

          {/* Sidebar Footer: Data Provenance Legend */}
          <div className="p-2.5 bg-slate-950 border-t border-slate-800 text-[9px] text-slate-400 space-y-1 font-mono">
            <div className="flex items-center justify-between">
              <span>[LIVE] Real-time IoT</span>
              <span>[REPORTED] Verified</span>
            </div>
            <div className="flex items-center justify-between text-slate-500">
              <span>[ESTIMATE] AI Model</span>
              <span>[SIMULATION] Synthetic</span>
            </div>
          </div>
        </aside>

        {/* ══════ SIDEBAR EXPAND BUTTON (WHEN COLLAPSED) ══════ */}
        {sidebarCollapsed && (
          <button
            onClick={() => setSidebarCollapsed(false)}
            className="absolute top-4 left-4 z-30 p-2 rounded-xl bg-slate-950/90 backdrop-blur border border-slate-800 text-slate-300 hover:text-white shadow-2xl transition-all"
            title="Expand Intelligence Drawer"
          >
            <ChevronRight className="w-4 h-4 text-cyan-400" />
          </button>
        )}

        {/* ════════════ 3D MAP CANVAS ════════════ */}
        <main className="flex-1 h-full relative">
          <DynamicMap
            mapRef={mapRef}
            center={center}
            zoom={zoom}
            pitch={pitch}
            bearing={bearing}
            points={activeMapPoints}
            selectedPointId={selectedPointId}
            onPointClick={handlePointClick}
            styleMode={styleMode}
            show3DBuildings={layers.buildings}
            zonesData={operationalZonesData}
            heatmapData={heatmapGeoData}
            corridorsData={corridorsGeoData}
            liveRouteData={activeRouteData}
            userLocation={userLocation}
            className="w-full h-full"
            animateOnLoad={false}
          />

          {/* Toast Notification for GPS / Actions */}
          {locationToast && (
            <div className="absolute top-4 left-1/2 -translate-x-1/2 z-40 px-3.5 py-1.5 rounded-full bg-slate-950/95 backdrop-blur-md border border-cyan-500/80 text-cyan-300 text-xs font-mono shadow-2xl animate-fade-in flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
              {locationToast}
            </div>
          )}

          {/* ══════ FLOATING TOP STATUS BADGES ══════ */}
          <div className="absolute top-3 left-4 z-10 flex flex-wrap items-center gap-2 pointer-events-none">
            <div className="px-3 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800/90 text-[11px] font-mono text-white flex items-center gap-2 shadow-lg">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>3D PERSPECTIVE: <strong>{is3D ? "ENABLED (65°)" : "ORTHO (0°)"}</strong></span>
              <span className="text-slate-500">|</span>
              <span className="text-cyan-400 font-bold uppercase">{styleMode}</span>
            </div>

            <div className="px-2.5 py-1.5 rounded-lg bg-slate-950/85 backdrop-blur-md border border-slate-800/90 text-[11px] font-mono text-red-400 flex items-center gap-1.5 shadow-lg">
              <Flame className="w-3.5 h-3.5 text-red-500" />
              <span><strong>{DEMO_INCIDENTS.filter(i => i.severity === "CRITICAL").length}</strong> Critical Alerts</span>
            </div>
          </div>

          {/* ══════ FLOATING 3D NAVIGATION CONTROLS (BOTTOM RIGHT) ══════ */}
          <div className="absolute bottom-6 right-4 z-20 flex flex-col items-center gap-2">

            {/* 3D / 2D Tilt Toggle Button */}
            <button
              onClick={toggle3DPerspective}
              className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-xs transition-all shadow-2xl border ${
                is3D
                  ? "bg-cyan-500 text-slate-950 border-cyan-300 shadow-[0_0_20px_rgba(56,189,248,0.5)]"
                  : "bg-slate-950/90 text-slate-300 border-slate-800 hover:text-white"
              }`}
              title={is3D ? "Switch to 2D Top-Down View" : "Switch to 3D Elevated Perspective"}
            >
              {is3D ? "3D" : "2D"}
            </button>

            {/* Compass / Align North Button */}
            <button
              onClick={resetNorthBearing}
              className="w-10 h-10 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-xl transition-transform hover:scale-105"
              title="Reset Compass Orientation (North)"
              style={{ transform: `rotate(${-bearing}deg)` }}
            >
              <Compass className="w-5 h-5 text-red-500" />
            </button>

            {/* Real Geolocation Detector Button */}
            <button
              onClick={handleUserGeolocation}
              disabled={isLocating}
              className={`w-10 h-10 rounded-xl flex items-center justify-center shadow-xl transition-all border ${
                userLocation
                  ? "bg-sky-950 border-sky-400 text-sky-400 shadow-[0_0_15px_rgba(14,165,233,0.5)]"
                  : "bg-slate-950/90 border-slate-800 text-slate-300 hover:text-white hover:border-slate-700"
              }`}
              title="Detect Current Location (GPS)"
            >
              <Crosshair className={`w-5 h-5 ${isLocating ? "animate-spin text-cyan-400" : ""}`} />
            </button>

            {/* Map Style Switcher Toggle */}
            <div className="relative">
              <button
                onClick={() => setShowStyleMenu(!showStyleMenu)}
                className="w-10 h-10 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-xl transition-colors"
                title="Change Map Style"
              >
                <SlidersHorizontal className="w-5 h-5 text-cyan-400" />
              </button>

              {/* Style Dropdown Menu */}
              {showStyleMenu && (
                <div className="absolute right-12 bottom-0 w-52 bg-slate-950/95 backdrop-blur-xl border border-slate-800 rounded-xl p-2 shadow-2xl space-y-1 z-30 max-h-80 overflow-y-auto no-scrollbar">
                  <div className="text-[10px] font-mono text-cyan-400 px-2 py-1 uppercase tracking-wider font-bold">
                    Select 3D Basemap
                  </div>
                  {[
                    { id: "google-hybrid", label: "Google Hybrid 3D", desc: "Satellite + Google Road Vector" },
                    { id: "google-streets", label: "Google Streets 3D", desc: "Official Google Cartography" },
                    { id: "google-terrain", label: "Google Terrain 3D", desc: "Topographic Relief & Elevation" },
                    { id: "google-satellite", label: "Google Satellite", desc: "Pure Photographic Imagery" },
                    { id: "satellite", label: "Esri Satellite 3D", desc: "Global Imagery + Elevation" },
                    { id: "dark", label: "Tactical Dark Ops", desc: "Night Radar / High Contrast" },
                    { id: "streets", label: "Clean Streets 3D", desc: "Carto Voyager Basemap" },
                    { id: "topo", label: "Topographic 3D", desc: "Contour & Hillshade Elevation" },
                  ].map((s) => (
                    <button
                      key={s.id}
                      onClick={() => {
                        setStyleMode(s.id as MapStyleMode);
                        setShowStyleMenu(false);
                      }}
                      className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex flex-col ${
                        styleMode === s.id
                          ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                          : "text-slate-300 hover:bg-slate-900"
                      }`}
                    >
                      <span className="font-semibold flex items-center justify-between">
                        {s.label}
                        {s.id.startsWith("google") && (
                          <span className="text-[8px] px-1 rounded bg-blue-500/20 text-blue-400 font-mono">GOOGLE</span>
                        )}
                      </span>
                      <span className="text-[9px] text-slate-500">{s.desc}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Zoom In & Out Cluster */}
            <div className="flex flex-col bg-slate-950/90 backdrop-blur-md border border-slate-800 rounded-xl overflow-hidden shadow-xl">
              <button
                onClick={handleZoomIn}
                className="w-10 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 text-base font-bold border-b border-slate-800"
                title="Zoom In"
              >
                +
              </button>
              <button
                onClick={handleZoomOut}
                className="w-10 h-9 flex items-center justify-center text-slate-300 hover:text-white hover:bg-slate-800 text-base font-bold"
                title="Zoom Out"
              >
                −
              </button>
            </div>

            {/* Reset National View */}
            <button
              onClick={() => handleSelectHub(INDIAN_COMMAND_HUBS[0])}
              className="w-10 h-10 rounded-xl bg-slate-950/90 backdrop-blur-md border border-slate-800 text-slate-300 hover:text-white flex items-center justify-center shadow-xl transition-colors"
              title="Reset to National Command HQ (New Delhi)"
            >
              <RotateCcw className="w-4 h-4 text-slate-400" />
            </button>
          </div>

          {/* ══════ SELECTED MARKER DETAILS MODAL / GLASS CARD ══════ */}
          {selectedDetail && (
            <SelectedDetailCard
              selectedDetail={selectedDetail}
              onClose={() => {
                setSelectedDetail(null);
                setSelectedPointId(null);
              }}
              onRouteIncident={handleRouteToIncident}
              onCopyCoordinates={handleCopyCoordinates}
              copiedCoords={copiedCoords}
              defaultCenter={center}
            />
          )}

          {/* ══════ SLIDING LAYERS DRAWER ══════ */}
          {showLayersModal && (
            <div className="absolute top-14 right-4 z-40 w-72 bg-slate-950/95 backdrop-blur-2xl border border-slate-800 rounded-2xl p-3 shadow-2xl space-y-2 animate-slide-in-bottom">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <span className="text-xs font-bold text-white flex items-center gap-1.5 font-display">
                  <Layers className="w-4 h-4 text-cyan-400" />
                  3D Geospatial Layers
                </span>
                <button
                  onClick={() => setShowLayersModal(false)}
                  className="w-5 h-5 rounded flex items-center justify-center text-slate-400 hover:text-white"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1 max-h-96 overflow-y-auto pr-1">
                {[
                  { key: "buildings", label: "3D Extruded Buildings", icon: Building2, desc: "Architectural heights & elevations" },
                  { key: "incidents", label: "Active SOS Incidents", icon: Flame, desc: "Emergency calls & distress markers" },
                  { key: "facilities", label: "Hospitals & Triage", icon: Hospital, desc: "ICU, oxygen, and emergency beds" },
                  { key: "fleet", label: "Ambulance Fleet", icon: Ambulance, desc: "Live vehicle telemetry & speed" },
                  { key: "zones", label: "Risk Zone Perimeters", icon: MapPin, desc: "Red, orange, and green bounds" },
                  { key: "corridors", label: "Emergency Green Corridors", icon: Navigation, desc: "Priority ambulance arterial routes" },
                  { key: "heatmap", label: "Crowd Density Heatmap", icon: Activity, desc: "High-density crowd hotspots" },
                  { key: "police", label: "Police & Security Posts", icon: Shield, desc: "Crowd flow & security stations" },
                  { key: "shelters", label: "Safe Assembly Shelters", icon: TentIcon, desc: "Evacuation & staging pavilions" },
                ].map(({ key, label, icon: Icon, desc }) => {
                  const isEnabled = layers[key as keyof typeof layers];
                  return (
                    <button
                      key={key}
                      onClick={() => toggleLayer(key as keyof typeof layers)}
                      className={`w-full flex items-center gap-2.5 p-2 rounded-xl text-left transition-all ${
                        isEnabled
                          ? "bg-slate-900/90 border border-slate-700/80 text-white"
                          : "text-slate-400 hover:bg-slate-900/50 border border-transparent"
                      }`}
                    >
                      <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 ${
                        isEnabled ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/40" : "bg-slate-800 text-slate-500"
                      }`}>
                        <Icon className="w-3.5 h-3.5" />
                      </div>
                      <div className="flex-1 truncate">
                        <div className="text-xs font-semibold leading-tight">{label}</div>
                        <div className="text-[9px] text-slate-500 truncate">{desc}</div>
                      </div>
                      {isEnabled ? (
                        <Eye className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      ) : (
                        <EyeOff className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* ══════ BOTTOM STATUS & METRIC STRIP ══════ */}
          <footer className="absolute bottom-2 left-4 z-10 hidden md:flex items-center gap-2 pointer-events-none">
            <div className="px-3 py-1 rounded-lg bg-slate-950/80 backdrop-blur border border-slate-800/80 text-[10px] text-slate-400 font-mono flex items-center gap-3">
              <span>Center: <strong>{center[0].toFixed(4)}°N, {center[1].toFixed(4)}°E</strong></span>
              <span>Zoom: <strong>{zoom.toFixed(1)}</strong></span>
              <span>Pitch: <strong>{pitch}°</strong></span>
              <span>Bearing: <strong>{bearing}°</strong></span>
            </div>
          </footer>

        </main>
      </div>

    </div>
  );
}

// Fallback icon helper for Shelter
function TentIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M19 20 10 4 1 20" />
      <path d="m14 12 5 8" />
      <path d="m8 12 2-8 2 8" />
      <path d="M4 20h16" />
    </svg>
  );
}

type SelectedDetailItem =
  | { type: "incident"; data: EmergencyIncident }
  | { type: "hospital"; data: HospitalFacility }
  | { type: "ambulance"; data: AmbulanceUnit }
  | { type: "zone"; data: OperationalZone }
  | { type: "police" | "shelter"; data: Record<string, unknown> & { title?: string; latitude: number; longitude: number } };

function SelectedDetailCard({
  selectedDetail,
  onClose,
  onRouteIncident,
  onCopyCoordinates,
  copiedCoords,
  defaultCenter
}: {
  selectedDetail: SelectedDetailItem;
  onClose: () => void;
  onRouteIncident: (incident: EmergencyIncident) => void;
  onCopyCoordinates: (lat: number, lng: number) => void;
  copiedCoords: boolean;
  defaultCenter: [number, number];
}) {
  const detailTitle =
    selectedDetail.type === "incident" ? selectedDetail.data.title :
    selectedDetail.type === "hospital" ? selectedDetail.data.name :
    selectedDetail.type === "ambulance" ? selectedDetail.data.callsign :
    selectedDetail.type === "zone" ? selectedDetail.data.name :
    String(selectedDetail.data.title || "Emergency Unit");

  const detailProvenance =
    (selectedDetail.type === "incident" || selectedDetail.type === "hospital" || selectedDetail.type === "ambulance")
      ? selectedDetail.data.provenance
      : "[LIVE]";

  const lat = Number(selectedDetail.data.latitude || defaultCenter[0]);
  const lng = Number(selectedDetail.data.longitude || defaultCenter[1]);

  return (
    <div className="absolute bottom-6 left-4 right-16 sm:right-auto sm:w-96 z-30 bg-slate-950/95 backdrop-blur-2xl border border-slate-800/90 rounded-2xl p-4 shadow-2xl animate-slide-in-bottom">
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="text-xl">
            {selectedDetail.type === "incident" ? "🚨" :
             selectedDetail.type === "hospital" ? "🏥" :
             selectedDetail.type === "ambulance" ? "🚑" :
             selectedDetail.type === "police" ? "🛡️" :
             selectedDetail.type === "shelter" ? "⛺" : "📍"}
          </span>
          <div>
            <span className="text-[9px] font-mono font-bold text-cyan-400 px-1.5 py-0.2 bg-cyan-950/80 rounded border border-cyan-800">
              {detailProvenance}
            </span>
            <h3 className="text-sm font-bold text-white leading-tight mt-0.5">
              {detailTitle}
            </h3>
          </div>
        </div>

        <button
          onClick={onClose}
          className="w-6 h-6 rounded flex items-center justify-center text-slate-400 hover:text-white hover:bg-slate-800"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Specific Content Based on Detail Type */}
      <div className="mt-3 text-xs space-y-2 text-slate-300 border-t border-slate-800/80 pt-2.5">
        {selectedDetail.type === "incident" && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Severity</span>
              <span className="font-bold text-red-400">{selectedDetail.data.severity}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Location</span>
              <span className="text-white text-right font-medium">{selectedDetail.data.locationName}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Casualties</span>
              <span className="font-bold text-white">{selectedDetail.data.casualtiesCount} reported</span>
            </div>
            <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800 leading-relaxed">
              {selectedDetail.data.notes}
            </p>
          </>
        )}

        {selectedDetail.type === "hospital" && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Trauma Level</span>
              <span className="font-bold text-indigo-300">{selectedDetail.data.traumaLevel.replace("_", " ")}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Emergency Contact</span>
              <a href={`tel:${selectedDetail.data.contactNumber}`} className="text-cyan-400 hover:underline flex items-center gap-1">
                <Phone className="w-3 h-3" /> {selectedDetail.data.contactNumber}
              </a>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-1">
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">ICU Available</div>
                <div className="text-sm font-black text-emerald-400">{selectedDetail.data.icuBedsAvailable} beds</div>
              </div>
              <div className="p-2 bg-slate-900 rounded border border-slate-800 text-center">
                <div className="text-[10px] text-slate-400">Oxygen Reserves</div>
                <div className="text-sm font-black text-cyan-400">{selectedDetail.data.oxygenBedsAvailable} beds</div>
              </div>
            </div>
          </>
        )}

        {selectedDetail.type === "ambulance" && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Telemetry Status</span>
              <span className="font-bold text-sky-400">{selectedDetail.data.status}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Paramedic Crew</span>
              <span className="text-white font-medium">{selectedDetail.data.paramedicTeam}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Telemetry Speed</span>
              <span className="font-mono font-bold text-white">{selectedDetail.data.speedKmH} km/h</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Vehicle Battery / Fuel</span>
              <span className="font-mono font-bold text-emerald-400">{selectedDetail.data.batteryFuelPercent}%</span>
            </div>
          </>
        )}

        {selectedDetail.type === "zone" && (
          <>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Risk Assessment Score</span>
              <span className="font-black text-amber-400 text-sm">{selectedDetail.data.riskScore} / 100</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-slate-400">Crowd Density</span>
              <span className="font-mono text-white">{selectedDetail.data.crowdDensitySqM} persons/m²</span>
            </div>
            <p className="text-[11px] text-slate-400 bg-slate-900/80 p-2 rounded-lg border border-slate-800">
              {selectedDetail.data.description}
            </p>
          </>
        )}
      </div>

      {/* Action Buttons */}
      <div className="mt-3.5 pt-2.5 border-t border-slate-800/90 flex items-center gap-2">
        {selectedDetail.type === "incident" && (
          <button
            onClick={() => onRouteIncident(selectedDetail.data)}
            className="flex-1 py-1.5 px-3 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs flex items-center justify-center gap-1.5 shadow"
          >
            <Navigation className="w-3.5 h-3.5" />
            Dispatch Closest Ambulance
          </button>
        )}

        <button
          onClick={() => onCopyCoordinates(lat, lng)}
          className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-300 text-xs font-semibold flex items-center gap-1 transition-colors"
          title="Copy Lat, Lng coordinates"
        >
          {copiedCoords ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copiedCoords ? "Copied" : "GPS"}</span>
        </button>
      </div>
    </div>
  );
}
