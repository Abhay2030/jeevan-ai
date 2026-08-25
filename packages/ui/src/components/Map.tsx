import * as React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Fix Leaflet's default icon path issues in Next.js/Webpack
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

export interface MapPoint {
  id: string;
  latitude: number;
  longitude: number;
  title: string;
  severity: "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";
}

export interface MapProps {
  center: [number, number];
  zoom?: number;
  points?: MapPoint[];
  onPointClick?: (id: string) => void;
  className?: string;
}

export function Map({
  center,
  zoom = 13,
  points = [],
  onPointClick,
  className = "",
}: MapProps) {
  return (
    <div className={`w-full h-full relative z-0 ${className}`}>
      <MapContainer
        center={center}
        zoom={zoom}
        scrollWheelZoom={true}
        className="w-full h-full z-0"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {points.map((point) => (
          <Marker
            key={point.id}
            position={[point.latitude, point.longitude]}
            eventHandlers={{
              click: () => onPointClick && onPointClick(point.id),
            }}
          >
            <Popup>
              <div className="font-display font-semibold">{point.title}</div>
              <div className="text-xs text-ink-500">Severity: {point.severity}</div>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
