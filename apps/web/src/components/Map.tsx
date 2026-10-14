/* eslint-disable */
"use client";

import * as React from "react";
import { useEffect, useMemo } from "react";
import MapGL, { Marker, NavigationControl, FullscreenControl, Source, Layer, useMap } from "react-map-gl/maplibre";
import type { MapRef } from "react-map-gl/maplibre";
import "maplibre-gl/dist/maplibre-gl.css";
import type { LayerProps } from "react-map-gl/maplibre";
import { generateProcedural3DBuildingsGeoJSON } from "@web/lib/geoIntelligenceData";

export interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  type: "ambulance" | "hospital" | "camp" | "zone" | "incident" | "person" | "donor" | "police" | "shelter";
  severity?: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
  metadata?: any;
}

export type MapStyleMode = "satellite" | "dark" | "streets" | "topo";

export interface MapProps {
  center: [number, number]; // [lat, lng]
  zoom?: number;
  pitch?: number;
  bearing?: number;
  points?: MapPoint[];
  selectedPointId?: string | null;
  onPointClick?: (point: MapPoint) => void;
  onMapClick?: (coords: { lat: number; lng: number }) => void;
  className?: string;
  theme?: "light" | "dark";
  styleMode?: MapStyleMode;
  mapRef?: React.RefObject<MapRef | null>;
  heatmapData?: any; // GeoJSON FeatureCollection
  corridorsData?: any; // GeoJSON LineString
  liveRouteData?: any; // GeoJSON LineString for ambulance path
  zonesData?: any; // GeoJSON FeatureCollection for operational zones
  buildingsData?: any; // GeoJSON FeatureCollection for 3D buildings
  show3DBuildings?: boolean;
  userLocation?: { latitude: number; longitude: number; accuracy?: number } | null;
  animateOnLoad?: boolean;
}

/* ══════════ MAP TILE STYLES (NO SECRET KEYS REQUIRED) ══════════ */
function getMapStyleConfig(mode: MapStyleMode = "satellite", theme: "light" | "dark" = "dark") {
  // Raster DEM terrain source for genuine 3D elevation
  const terrainSource = {
    type: "raster-dem",
    tiles: ["https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png"],
    encoding: "terrarium",
    tileSize: 256,
    attribution: "AWS Terrarium Elevation / OpenStreetMap"
  };

  switch (mode) {
    case "dark":
      return {
        version: 8,
        sources: {
          "carto-dark": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png",
              "https://c.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}@2x.png"
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors, © CARTO"
          },
          "terrain": terrainSource
        },
        layers: [
          {
            id: "dark-base",
            type: "raster",
            source: "carto-dark",
            paint: { "raster-opacity": 1.0 }
          }
        ],
        terrain: {
          source: "terrain",
          exaggeration: 1.6
        }
      };

    case "streets":
      return {
        version: 8,
        sources: {
          "carto-streets": {
            type: "raster",
            tiles: [
              "https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png",
              "https://b.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}@2x.png"
            ],
            tileSize: 256,
            attribution: "© OpenStreetMap contributors, © CARTO"
          },
          "terrain": terrainSource
        },
        layers: [
          {
            id: "streets-base",
            type: "raster",
            source: "carto-streets",
            paint: { "raster-opacity": 1.0 }
          }
        ],
        terrain: {
          source: "terrain",
          exaggeration: 1.5
        }
      };

    case "topo":
      return {
        version: 8,
        sources: {
          "esri-topo": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            attribution: "Esri Topographic"
          },
          "terrain": terrainSource
        },
        layers: [
          {
            id: "topo-base",
            type: "raster",
            source: "esri-topo",
            paint: { "raster-opacity": 1.0 }
          }
        ],
        terrain: {
          source: "terrain",
          exaggeration: 1.8
        }
      };

    case "satellite":
    default:
      return {
        version: 8,
        sources: {
          "esri-satellite": {
            type: "raster",
            tiles: [
              "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256,
            attribution: "Esri World Imagery"
          },
          "esri-labels": {
            type: "raster",
            tiles: [
              "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}"
            ],
            tileSize: 256
          },
          "terrain": terrainSource
        },
        layers: [
          {
            id: "satellite-layer",
            type: "raster",
            source: "esri-satellite",
            paint: {
              "raster-opacity": 1.0,
              "raster-contrast": theme === "dark" ? 0.35 : 0.05,
              "raster-saturation": theme === "dark" ? -0.2 : 0,
              "raster-brightness-max": theme === "dark" ? 0.85 : 1.0
            }
          },
          {
            id: "satellite-labels",
            type: "raster",
            source: "esri-labels",
            paint: { "raster-opacity": 0.95 }
          }
        ],
        terrain: {
          source: "terrain",
          exaggeration: 1.8
        }
      };
  }
}

/* ══════════ 3D BUILDINGS EXTRUSION LAYER ══════════ */
const buildingExtrusionLayer: LayerProps = {
  id: "3d-buildings-extrusion",
  type: "fill-extrusion",
  source: "3d-buildings-source",
  minzoom: 12,
  paint: {
    "fill-extrusion-color": [
      "coalesce",
      ["get", "color"],
      "#1e293b"
    ],
    "fill-extrusion-height": [
      "coalesce",
      ["get", "height"],
      24
    ],
    "fill-extrusion-base": [
      "coalesce",
      ["get", "min_height"],
      0
    ],
    "fill-extrusion-opacity": 0.88,
    "fill-extrusion-vertical-gradient": true
  }
};

/* ══════════ OPERATIONAL ZONES POLYGONS LAYERS ══════════ */
const zonesFillLayer: LayerProps = {
  id: "operational-zones-fill",
  type: "fill",
  source: "operational-zones-source",
  paint: {
    "fill-color": ["coalesce", ["get", "fillColor"], "#ef4444"],
    "fill-opacity": ["coalesce", ["get", "opacity"], 0.22]
  }
};

const zonesLineLayer: LayerProps = {
  id: "operational-zones-line",
  type: "line",
  source: "operational-zones-source",
  paint: {
    "line-color": ["coalesce", ["get", "strokeColor"], "#dc2626"],
    "line-width": 2.5,
    "line-dasharray": [2, 1]
  }
};

/* ══════════ HEATMAP LAYER ══════════ */
const heatmapLayer: LayerProps = {
  id: "crowd-heat",
  type: "heatmap",
  source: "crowd-heat-source",
  maxzoom: 18,
  paint: {
    "heatmap-weight": ["interpolate", ["linear"], ["get", "density"], 0, 0, 100, 1],
    "heatmap-intensity": ["interpolate", ["linear"], ["zoom"], 11, 1, 18, 3.5],
    "heatmap-color": [
      "interpolate",
      ["linear"],
      ["heatmap-density"],
      0, "rgba(0,0,0,0)",
      0.2, "rgba(56,189,248,0.25)", // sky blue
      0.4, "rgba(234,179,8,0.45)",   // yellow
      0.6, "rgba(249,115,22,0.65)",  // orange
      0.8, "rgba(239,68,68,0.85)",  // alert red
      1, "rgba(185,28,28,0.98)"      // deep emergency crimson
    ],
    "heatmap-radius": ["interpolate", ["linear"], ["zoom"], 11, 16, 18, 44],
    "heatmap-opacity": ["interpolate", ["linear"], ["zoom"], 13, 0.9, 18, 0.45]
  }
};

/* ══════════ CORRIDORS & ROUTE LAYERS ══════════ */
const corridorLayer: LayerProps = {
  id: "emergency-corridors",
  type: "line",
  source: "corridors-source",
  layout: {
    "line-join": "round",
    "line-cap": "round"
  },
  paint: {
    "line-color": ["coalesce", ["get", "color"], "#0284c7"],
    "line-width": 6,
    "line-opacity": 0.85,
  }
};

const liveRouteCasingLayer: LayerProps = {
  id: "live-route-casing",
  type: "line",
  source: "live-route-source",
  layout: { "line-join": "round", "line-cap": "round" },
  paint: {
    "line-color": "#0369a1",
    "line-width": 9,
    "line-opacity": 0.5
  }
};

const liveRouteCoreLayer: LayerProps = {
  id: "live-route-core",
  type: "line",
  source: "live-route-source",
  layout: { "line-join": "round", "line-cap": "round" },
  paint: {
    "line-color": "#38bdf8",
    "line-width": 5,
    "line-opacity": 0.95
  }
};

/* ══════════ CINEMATIC CONTROLLER ══════════ */
function CinematicController({
  center,
  pitch,
  bearing,
  zoom,
  animateOnLoad
}: {
  center: [number, number];
  pitch: number;
  bearing: number;
  zoom: number;
  animateOnLoad: boolean;
}) {
  const { current: map } = useMap();

  useEffect(() => {
    if (map && animateOnLoad) {
      map.flyTo({
        center: [center[1], center[0]],
        zoom: zoom,
        pitch: pitch,
        bearing: bearing,
        duration: 8000,
        essential: true,
      });
    }
  }, [map, center, zoom, pitch, bearing, animateOnLoad]);

  return null;
}

/* ══════════ MAIN REUSABLE 3D MAP COMPONENT ══════════ */
export function Map({
  center,
  zoom = 14,
  pitch = 60,
  bearing = -25,
  points = [],
  selectedPointId = null,
  onPointClick,
  onMapClick,
  className = "",
  theme = "dark",
  styleMode = "satellite",
  mapRef,
  heatmapData = null,
  corridorsData = null,
  liveRouteData = null,
  zonesData = null,
  buildingsData = null,
  show3DBuildings = true,
  userLocation = null,
  animateOnLoad = true,
}: MapProps) {
  // Generate map style object based on chosen mode
  const currentMapStyle = useMemo(() => {
    return getMapStyleConfig(styleMode, theme);
  }, [styleMode, theme]);

  // If buildingsData is not passed, synthesize procedural 3D buildings around center
  const activeBuildingsData = useMemo(() => {
    if (buildingsData) return buildingsData;
    if (show3DBuildings) {
      return generateProcedural3DBuildingsGeoJSON(center[0], center[1]);
    }
    return null;
  }, [buildingsData, show3DBuildings, center]);

  /* ─── Render Elite Emergency Markers ─── */
  const renderMarkerIcon = (point: MapPoint) => {
    const isSelected = selectedPointId === point.id;

    switch (point.type) {
      case "ambulance": {
        const isActive = point.metadata?.status === "DISPATCHED" || point.metadata?.status === "EN_ROUTE";
        const isAtScene = point.metadata?.status === "AT_SCENE";

        return (
          <div className={`relative flex items-center justify-center cursor-pointer group transition-all duration-300 ${isSelected ? "scale-130 z-50" : "hover:scale-115"}`}>
            {isActive && (
              <>
                <div className="absolute -inset-2 bg-red-500 rounded-full animate-ping opacity-60" />
                <div className="absolute -inset-1 bg-cyan-400 rounded-full animate-pulse opacity-70" />
              </>
            )}
            {isAtScene && (
              <div className="absolute -inset-1.5 bg-amber-400 rounded-full animate-pulse opacity-60" />
            )}
            <div
              className={`w-9 h-9 rounded-full flex items-center justify-center relative z-10 shadow-lg border-2 transition-colors ${
                isSelected
                  ? "bg-slate-950 border-cyan-400 shadow-[0_0_25px_rgba(56,189,248,0.9)]"
                  : isActive
                  ? "bg-slate-950 border-red-500 shadow-[0_0_18px_rgba(239,68,68,0.8)]"
                  : "bg-slate-900 border-sky-400 shadow-[0_0_12px_rgba(14,165,233,0.6)]"
              }`}
            >
              <span className="text-base">🚑</span>
            </div>

            {/* Micro Badge for Speed/Heading */}
            {point.metadata?.speedKmH > 0 && (
              <div className="absolute -top-1 -right-1 z-20 bg-cyan-500 text-slate-950 text-[8px] font-black px-1 rounded-full shadow">
                {point.metadata.speedKmH}k
              </div>
            )}

            {/* Elevated Tooltip */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 backdrop-blur-md border border-cyan-500/50 text-white text-[10px] font-sans px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap pointer-events-none z-50">
              <div className="font-bold text-cyan-300 flex items-center gap-1">
                <span>🚑</span> {point.title}
              </div>
              <div className="text-[9px] text-slate-300 mt-0.5">
                {point.metadata?.callsign || point.type} • {point.metadata?.status || "ACTIVE"}
              </div>
            </div>
          </div>
        );
      }

      case "hospital": {
        const isSurge = point.metadata?.status === "SURGE_OVERFLOW" || point.severity === "CRITICAL";
        return (
          <div className={`relative flex items-center justify-center cursor-pointer group transition-all duration-300 ${isSelected ? "scale-130 z-50" : "hover:scale-115"}`}>
            {isSurge && (
              <div className="absolute -inset-1.5 bg-red-500 rounded-lg animate-ping opacity-50" />
            )}
            <div
              className={`w-9 h-9 rounded-lg flex items-center justify-center relative z-10 shadow-lg border-2 transition-colors ${
                isSelected
                  ? "bg-slate-950 border-emerald-400 shadow-[0_0_25px_rgba(52,211,153,0.9)]"
                  : "bg-slate-950 border-indigo-500 shadow-[0_0_15px_rgba(99,102,241,0.6)]"
              }`}
            >
              <span className="text-base">🏥</span>
            </div>

            {/* Bed indicator pip */}
            <div
              className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border border-slate-900 ${
                point.metadata?.icuBedsAvailable > 0 ? "bg-emerald-400" : "bg-red-500"
              }`}
            />

            {/* Elevated Tooltip */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 backdrop-blur-md border border-indigo-500/50 text-white text-[10px] font-sans px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap pointer-events-none z-50">
              <div className="font-bold text-indigo-300 flex items-center gap-1">
                <span>🏥</span> {point.title}
              </div>
              <div className="text-[9px] text-slate-300 mt-0.5">
                ICU: {point.metadata?.icuBedsAvailable ?? "Available"} beds • O2: {point.metadata?.oxygenBedsAvailable ?? "Active"}
              </div>
            </div>
          </div>
        );
      }

      case "incident": {
        return (
          <div className={`relative flex items-center justify-center cursor-pointer group transition-all duration-300 ${isSelected ? "scale-130 z-50" : "hover:scale-115"}`}>
            <div className="absolute -inset-2 bg-red-600 rounded-full animate-ping opacity-70" />
            <div className="absolute -inset-1 bg-amber-500 rounded-full animate-pulse opacity-60" />

            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shadow-lg border-2 ${
                isSelected
                  ? "bg-red-950 border-white shadow-[0_0_30px_rgba(239,68,68,1)]"
                  : "bg-red-950 border-red-500 shadow-[0_0_20px_rgba(239,68,68,0.8)]"
              }`}
            >
              <span className="text-[10px] text-white font-black tracking-tighter">SOS</span>
            </div>

            {/* Elevated Tooltip */}
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 backdrop-blur-md border border-red-500/60 text-white text-[10px] font-sans px-2.5 py-1.5 rounded-lg shadow-2xl whitespace-nowrap pointer-events-none z-50">
              <div className="font-bold text-red-400 flex items-center gap-1">
                <span>🚨</span> {point.title}
              </div>
              <div className="text-[9px] text-slate-300 mt-0.5">
                {point.severity || "CRITICAL"} • Casualties: {point.metadata?.casualtiesCount ?? 0}
              </div>
            </div>
          </div>
        );
      }

      case "camp": {
        return (
          <div className={`relative flex items-center justify-center cursor-pointer group transition-all duration-300 ${isSelected ? "scale-130 z-50" : "hover:scale-115"}`}>
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center relative z-10 shadow-lg border-2 ${
                isSelected
                  ? "bg-slate-950 border-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.8)]"
                  : "bg-emerald-950 border-emerald-500 shadow-[0_0_12px_rgba(16,185,129,0.5)]"
              }`}
            >
              <span className="text-sm">⛑️</span>
            </div>
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 backdrop-blur-md border border-emerald-500 text-emerald-300 text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50">
              {point.title}
            </div>
          </div>
        );
      }

      case "police": {
        return (
          <div className={`relative flex items-center justify-center cursor-pointer group transition-all duration-300 ${isSelected ? "scale-130 z-50" : "hover:scale-115"}`}>
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center relative z-10 shadow-lg border-2 ${
                isSelected
                  ? "bg-slate-950 border-sky-300 shadow-[0_0_20px_rgba(56,189,248,0.8)]"
                  : "bg-blue-950 border-blue-500 shadow-[0_0_12px_rgba(59,130,246,0.6)]"
              }`}
            >
              <span className="text-xs">🛡️</span>
            </div>
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 backdrop-blur-md border border-blue-500 text-blue-300 text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50">
              {point.title}
            </div>
          </div>
        );
      }

      case "shelter": {
        return (
          <div className={`relative flex items-center justify-center cursor-pointer group transition-all duration-300 ${isSelected ? "scale-130 z-50" : "hover:scale-115"}`}>
            <div
              className={`w-7 h-7 rounded-md flex items-center justify-center relative z-10 shadow-lg border-2 ${
                isSelected
                  ? "bg-slate-950 border-amber-300 shadow-[0_0_20px_rgba(251,191,36,0.8)]"
                  : "bg-amber-950 border-amber-500 shadow-[0_0_12px_rgba(245,158,11,0.5)]"
              }`}
            >
              <span className="text-xs">⛺</span>
            </div>
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/95 backdrop-blur-md border border-amber-500 text-amber-300 text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50">
              {point.title}
            </div>
          </div>
        );
      }

      case "donor": {
        return (
          <div className="relative flex items-center justify-center cursor-pointer group hover:scale-115 transition-transform">
            <div className="w-6 h-6 rounded-full bg-rose-950 border border-rose-500 flex items-center justify-center shadow-lg">
              <span className="text-xs">🩸</span>
            </div>
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-rose-500 text-rose-300 text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50">
              {point.title}
            </div>
          </div>
        );
      }

      case "person": {
        return (
          <div className="relative flex items-center justify-center cursor-pointer group hover:scale-115 transition-transform">
            <div className="w-7 h-7 rounded-full bg-purple-950 border-2 border-purple-400 flex items-center justify-center shadow-lg animate-pulse">
              <span className="text-xs">👤</span>
            </div>
            <div className="absolute bottom-full mb-2 opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950 border border-purple-500 text-purple-300 text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap pointer-events-none z-50">
              {point.title}
            </div>
          </div>
        );
      }

      case "zone":
      default: {
        const severity = point.severity || "MEDIUM";
        const borderColor =
          severity === "CRITICAL"
            ? "border-red-500 shadow-[0_0_15px_rgba(239,68,68,0.7)]"
            : severity === "HIGH"
            ? "border-orange-500 shadow-[0_0_15px_rgba(249,115,22,0.6)]"
            : "border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.5)]";

        return (
          <div className={`relative flex flex-col items-center justify-center cursor-pointer group transition-all duration-300 ${isSelected ? "scale-120 z-50" : "hover:-translate-y-1"}`}>
            <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center relative z-10 bg-slate-950 ${borderColor}`}>
              <span className="text-[10px] text-white font-bold">{point.metadata?.riskScore ?? point.metadata?.risk ?? 50}</span>
            </div>
            <div className="mt-1 bg-slate-950/85 backdrop-blur border border-slate-800 text-slate-200 text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider whitespace-nowrap shadow">
              {point.title}
            </div>
          </div>
        );
      }
    }
  };

  return (
    <div className={`w-full h-full relative z-0 rounded-xl overflow-hidden bg-slate-950 ${className}`}>
      <MapGL
        ref={mapRef}
        initialViewState={{
          longitude: center[1],
          latitude: center[0],
          zoom: animateOnLoad ? Math.max(10, zoom - 2) : zoom,
          pitch: animateOnLoad ? 0 : pitch,
          bearing: animateOnLoad ? 0 : bearing,
        }}
        mapStyle={currentMapStyle as any}
        style={{ width: "100%", height: "100%" }}
        interactiveLayerIds={["3d-buildings-extrusion", "operational-zones-fill"]}
        onClick={(e) => {
          if (onMapClick && e.lngLat) {
            onMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });
          }
        }}
      >
        <CinematicController
          center={center}
          pitch={pitch}
          bearing={bearing}
          zoom={zoom}
          animateOnLoad={animateOnLoad}
        />

        <NavigationControl position="bottom-right" showCompass showZoom />
        <FullscreenControl position="bottom-right" />

        {/* ══════ 3D BUILDINGS EXTRUSION LAYER ══════ */}
        {show3DBuildings && activeBuildingsData && (
          <Source id="3d-buildings-source" type="geojson" data={activeBuildingsData}>
            <Layer {...buildingExtrusionLayer} />
          </Source>
        )}

        {/* ══════ OPERATIONAL ZONES & RISK PERIMETERS ══════ */}
        {zonesData && (
          <Source id="operational-zones-source" type="geojson" data={zonesData}>
            <Layer {...zonesFillLayer} />
            <Layer {...zonesLineLayer} />
          </Source>
        )}

        {/* ══════ CROWD DENSITY HEATMAP LAYER ══════ */}
        {heatmapData && (
          <Source id="crowd-heat-source" type="geojson" data={heatmapData}>
            <Layer {...heatmapLayer} />
          </Source>
        )}

        {/* ══════ EMERGENCY PRIORITY GREEN CORRIDORS ══════ */}
        {corridorsData && (
          <Source id="corridors-source" type="geojson" data={corridorsData}>
            <Layer {...corridorLayer} />
          </Source>
        )}

        {/* ══════ LIVE AMBULANCE ROUTE / AI SPLINE ══════ */}
        {liveRouteData && (
          <Source id="live-route-source" type="geojson" data={liveRouteData}>
            <Layer {...liveRouteCasingLayer} />
            <Layer {...liveRouteCoreLayer} />
          </Source>
        )}

        {/* ══════ CURRENT USER LOCATION PULSING BEACON ══════ */}
        {userLocation && (
          <Marker
            longitude={userLocation.longitude}
            latitude={userLocation.latitude}
            anchor="center"
            style={{ zIndex: 100 }}
          >
            <div className="relative flex items-center justify-center">
              <div className="absolute w-12 h-12 bg-sky-500/25 rounded-full animate-ping pointer-events-none" />
              <div className="absolute w-8 h-8 bg-sky-500/40 rounded-full animate-pulse pointer-events-none" />
              <div className="w-4 h-4 rounded-full bg-sky-500 border-2 border-white shadow-[0_0_15px_rgba(14,165,233,1)] z-10" />
              <div className="absolute top-5 bg-slate-950/90 border border-sky-500 text-sky-400 text-[8px] font-mono font-bold px-1.5 py-0.5 rounded shadow whitespace-nowrap">
                YOU ARE HERE
              </div>
            </div>
          </Marker>
        )}

        {/* ══════ DYNAMIC OPERATIONAL MARKERS ══════ */}
        {points.map((point) => (
          <Marker
            key={point.id}
            longitude={point.longitude}
            latitude={point.latitude}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              if (onPointClick) onPointClick(point);
            }}
            style={{
              zIndex:
                selectedPointId === point.id
                  ? 80
                  : point.type === "incident"
                  ? 60
                  : point.type === "ambulance"
                  ? 50
                  : point.type === "hospital"
                  ? 40
                  : 20
            }}
          >
            {renderMarkerIcon(point)}
          </Marker>
        ))}
      </MapGL>
    </div>
  );
}
export default Map;
