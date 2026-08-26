"use client";

import * as React from "react";
// @ts-ignore
import MapGL, { Marker, NavigationControl, FullscreenControl } from "react-map-gl";
import "mapbox-gl/dist/mapbox-gl.css";

export interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

export interface MapProps {
  center: [number, number]; // [lat, lng]
  zoom?: number;
  points?: MapPoint[];
  onPointClick?: (id: string) => void;
  className?: string;
  theme?: "light" | "dark";
}

export function Map({
  center,
  zoom = 14,
  points = [],
  onPointClick,
  className = "",
  theme = "dark",
}: MapProps) {
  // Try to use a Mapbox token, otherwise fallback gracefully
  const mapboxToken = typeof process !== "undefined" ? process.env.NEXT_PUBLIC_MAPBOX_TOKEN : "";

  if (!mapboxToken) {
    return (
      <div className={`w-full h-full bg-ink-950 flex flex-col items-center justify-center p-8 text-center border border-ink-800 rounded-xl ${className}`}>
        <div className="w-16 h-16 rounded-2xl bg-ink-900 border border-ink-800 flex items-center justify-center mb-4">
          <svg className="w-8 h-8 text-ink-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-white font-display font-bold text-xl mb-2">3D Map Engine Disabled</h3>
        <p className="text-ink-400 text-sm max-w-sm mb-6">
          To enable the premium 3D Digital Twin map engine, please add a free Mapbox access token to your environment variables.
        </p>
        <div className="bg-ink-900 p-3 rounded-lg border border-ink-800 font-mono text-xs text-ink-300 w-full max-w-sm text-left overflow-x-auto">
          NEXT_PUBLIC_MAPBOX_TOKEN="pk.ey..."
        </div>
      </div>
    );
  }

  // Use Mapbox's gorgeous dark and light core styles
  const mapStyle = theme === "dark" 
    ? "mapbox://styles/mapbox/dark-v11" 
    : "mapbox://styles/mapbox/light-v11";

  return (
    <div className={`w-full h-full relative z-0 rounded-xl overflow-hidden ${className}`}>
      <MapGL
        mapboxAccessToken={mapboxToken}
        initialViewState={{
          longitude: center[1],
          latitude: center[0],
          zoom: zoom,
          pitch: 60, // Premium 3D tilt
          bearing: -17.6 // Slight rotation for aesthetic depth
        }}
        mapStyle={mapStyle}
        style={{ width: "100%", height: "100%" }}
        terrain={{ source: "mapbox-dem", exaggeration: 1.5 }}
      >
        <NavigationControl position="bottom-right" />
        <FullscreenControl position="bottom-right" />

        {/* Note: In a real implementation you would add a Source and Layer here to extrusion buildings */}

        {points.map((point) => (
          <Marker
            key={point.id}
            longitude={point.longitude}
            latitude={point.latitude}
            anchor="bottom"
            onClick={(e: any) => {
              e.originalEvent.stopPropagation();
              if (onPointClick) onPointClick(point.id);
            }}
          >
            <div className={`w-6 h-6 rounded-full border-2 border-white shadow-glow-primary flex items-center justify-center cursor-pointer transition-transform hover:scale-110
              ${point.severity === "CRITICAL" ? "bg-alert-500 animate-pulse shadow-glow-alert" : 
                point.severity === "HIGH" ? "bg-accent-500" : 
                point.severity === "MEDIUM" ? "bg-primary-500" : "bg-success-500"}`}
            >
               <div className="w-2 h-2 bg-white rounded-full"></div>
            </div>
            {/* Simple tooltip always visible for dashboard feel */}
            <div className="absolute top-7 left-1/2 -translate-x-1/2 whitespace-nowrap bg-ink-950 border border-ink-800 text-white text-[10px] font-bold px-2 py-1 rounded shadow-lg">
              {point.title}
            </div>
          </Marker>
        ))}
      </MapGL>
    </div>
  );
}
