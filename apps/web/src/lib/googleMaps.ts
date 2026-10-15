/**
 * JEEVAN AI — Google Maps Platform Integration Engine
 *
 * Provides Google Maps JavaScript SDK loader, Geocoding, Places,
 * turn-by-turn Directions, and 3D Tile configuration.
 */

export const GOOGLE_MAPS_API_KEY =
  process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY ||
  process.env.NEXT_PUBLIC_MAP_API_KEY ||
  "AIzaSyAv8vfHll5jyKGOpcDdt3ZDMCBEsm7Zgp8";

let googleMapsPromise: Promise<typeof google.maps | null> | null = null;

/**
 * Dynamically loads the Google Maps JavaScript API with places and geometry libraries.
 * Reuses existing script instances and prevents duplicate network injections.
 */
export function loadGoogleMapsScript(): Promise<typeof google.maps | null> {
  if (typeof window === "undefined") {
    return Promise.resolve(null);
  }

  // Already loaded
  if (window.google?.maps) {
    return Promise.resolve(window.google.maps);
  }

  // Loading in flight
  if (googleMapsPromise) {
    return googleMapsPromise;
  }

  googleMapsPromise = new Promise((resolve) => {
    // Check if script tag already exists on DOM
    const existingScript = document.querySelector('script[src*="maps.googleapis.com/maps/api/js"]');
    if (existingScript) {
      existingScript.addEventListener("load", () => {
        resolve(window.google?.maps || null);
      });
      existingScript.addEventListener("error", () => {
        console.warn("Failed to load Google Maps script from existing tag");
        resolve(null);
      });
      return;
    }

    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places,geometry&loading=async`;
    script.async = true;
    script.defer = true;
    script.id = "jeevan-google-maps-sdk";

    script.onload = () => {
      resolve(window.google?.maps || null);
    };

    script.onerror = (err) => {
      console.warn("Google Maps JavaScript API could not be initialized:", err);
      resolve(null);
    };

    document.head.appendChild(script);
  });

  return googleMapsPromise;
}

/**
 * Geocodes an address or landmark name using Google Maps Geocoder
 */
export async function geocodeLocation(
  query: string
): Promise<{ lat: number; lng: number; formattedAddress: string } | null> {
  try {
    const maps = await loadGoogleMapsScript();
    if (!maps) return null;

    const geocoder = new maps.Geocoder();
    const result = await new Promise<google.maps.GeocoderResult[] | null>((resolve) => {
      geocoder.geocode(
        {
          address: query,
          componentRestrictions: { country: "IN" } // Prioritize India
        },
        (results, status) => {
          if (status === maps.GeocoderStatus.OK && results && results.length > 0) {
            resolve(results);
          } else {
            resolve(null);
          }
        }
      );
    });

    if (result && result[0]) {
      const loc = result[0].geometry.location;
      return {
        lat: loc.lat(),
        lng: loc.lng(),
        formattedAddress: result[0].formatted_address
      };
    }
  } catch (err) {
    console.error("Geocoding failed:", err);
  }
  return null;
}

export interface GoogleRouteResult {
  coordinates: [number, number][]; // [lng, lat] pairs for GeoJSON LineString
  distanceKm: number;
  durationMinutes: number;
  summary: string;
  steps: string[];
}

/**
 * Calculates a genuine road route between two coordinates using Google Maps DirectionsService
 */
export async function calculateGoogleRoute(
  origin: { lat: number; lng: number },
  destination: { lat: number; lng: number }
): Promise<GoogleRouteResult | null> {
  try {
    const maps = await loadGoogleMapsScript();
    if (!maps) return null;

    const directionsService = new maps.DirectionsService();
    const response = await directionsService.route({
      origin: new maps.LatLng(origin.lat, origin.lng),
      destination: new maps.LatLng(destination.lat, destination.lng),
      travelMode: maps.TravelMode.DRIVING,
      provideRouteAlternatives: false
    });

    if (response.routes && response.routes[0] && response.routes[0].legs[0]) {
      const leg = response.routes[0].legs[0];
      const overviewPath = response.routes[0].overview_path || [];

      const coordinates: [number, number][] = overviewPath.map((latLng) => [
        latLng.lng(),
        latLng.lat()
      ]);

      const steps: string[] = (leg.steps || []).map((s) =>
        s.instructions ? s.instructions.replace(/<[^>]*>/g, "") : ""
      );

      return {
        coordinates,
        distanceKm: parseFloat(((leg.distance?.value || 0) / 1000).toFixed(2)),
        durationMinutes: Math.ceil((leg.duration?.value || 0) / 60),
        summary: response.routes[0].summary || "Emergency Corridor Route",
        steps
      };
    }
  } catch (err) {
    console.warn("Google Directions Service unavailable, fallback to procedural corridor:", err);
  }
  return null;
}

/**
 * Generates Google Maps raster tile URLs for MapLibre / WebGL layers
 */
export function getGoogleMapsTileUrl(
  variant: "hybrid" | "streets" | "terrain" | "satellite" = "hybrid"
): string[] {
  // lyrs parameter:
  // y = hybrid (satellite with transparent road vector overlay and labels)
  // m = standard roadmap / streets
  // p = terrain with hillshading and roads
  // s = pure satellite imagery
  const lyrsCode =
    variant === "hybrid"
      ? "y"
      : variant === "streets"
      ? "m"
      : variant === "terrain"
      ? "p"
      : "s";

  return [
    `https://mt0.google.com/vt/lyrs=${lyrsCode}&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
    `https://mt1.google.com/vt/lyrs=${lyrsCode}&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
    `https://mt2.google.com/vt/lyrs=${lyrsCode}&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`,
    `https://mt3.google.com/vt/lyrs=${lyrsCode}&x={x}&y={y}&z={z}&key=${GOOGLE_MAPS_API_KEY}`
  ];
}
