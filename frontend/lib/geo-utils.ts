/**
 * Geospatial calculation utilities: Haversine distance, MapTap scoring,
 * and point-in-polygon ray-casting.
 */

export function calculateDistanceKm(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371; // Earth's mean radius in km
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return Math.round(R * c);
}

function toRad(degrees: number): number {
  return (degrees * Math.PI) / 180;
}

export function calculateScore(distanceKm: number, decayConstant = 600): number {
  if (distanceKm <= 5) return 1000;
  return Math.max(
    0,
    Math.min(1000, Math.round(1000 * Math.exp(-distanceKm / decayConstant)))
  );
}

import type { Geometry } from "geojson";
import type { CityItem } from "@/types/map";
import { REGION_TABS } from "@/data/countries-catalog";

export function filterCitiesByScope(
  cities: CityItem[],
  scope: string
): CityItem[] {
  const s = scope.toUpperCase();
  if (s === "ALL") return cities;

  if (s === "SOUTH_AMERICA") {
    const saTab = REGION_TABS.find((t) => t.id === "south_america");
    const saCodes = new Set(saTab ? saTab.items.map((i) => i.id) : []);
    const res = cities.filter(
      (c) =>
        c.continent === "South America" ||
        saCodes.has(c.country_code?.toUpperCase())
    );
    return res.length > 0 ? res : cities;
  }
  if (s === "NORTH_AMERICA") {
    const naTab = REGION_TABS.find((t) => t.id === "north_america");
    const naCodes = new Set(naTab ? naTab.items.map((i) => i.id) : []);
    const res = cities.filter(
      (c) =>
        c.continent === "North America" ||
        naCodes.has(c.country_code?.toUpperCase())
    );
    return res.length > 0 ? res : cities;
  }
  if (s === "EUR") {
    const eurTab = REGION_TABS.find((t) => t.id === "europe");
    const eurCodes = new Set(eurTab ? eurTab.items.map((i) => i.id) : []);
    const res = cities.filter(
      (c) =>
        c.continent === "Europe" ||
        eurCodes.has(c.country_code?.toUpperCase())
    );
    return res.length > 0 ? res : cities;
  }
  if (s === "ASIA") {
    const asiaTab = REGION_TABS.find((t) => t.id === "asia");
    const asiaCodes = new Set(asiaTab ? asiaTab.items.map((i) => i.id) : []);
    const res = cities.filter(
      (c) =>
        c.continent === "Asia" ||
        asiaCodes.has(c.country_code?.toUpperCase())
    );
    return res.length > 0 ? res : cities;
  }
  if (s === "AFRICA") {
    const afrTab = REGION_TABS.find((t) => t.id === "africa");
    const afrCodes = new Set(afrTab ? afrTab.items.map((i) => i.id) : []);
    const res = cities.filter(
      (c) =>
        c.continent === "Africa" ||
        afrCodes.has(c.country_code?.toUpperCase())
    );
    return res.length > 0 ? res : cities;
  }
  if (s === "OCEANIA") {
    const ocaTab = REGION_TABS.find((t) => t.id === "oceania");
    const ocaCodes = new Set(ocaTab ? ocaTab.items.map((i) => i.id) : []);
    const res = cities.filter(
      (c) =>
        c.continent === "Oceania" ||
        ocaCodes.has(c.country_code?.toUpperCase())
    );
    return res.length > 0 ? res : cities;
  }

  // Country ISO code (e.g., BRA, USA, DEU)
  const res = cities.filter((c) => c.country_code?.toUpperCase() === s);
  return res.length > 0 ? res : cities;
}

export function pointInPolygon(
  point: [number, number], // [lng, lat]
  ring: [number, number][]
): boolean {
  if (ring.length < 3) return false;
  const [x, y] = point;

  // Ultra-fast bounding box pre-filter (eliminates 99%+ of complex polygon checks instantly)
  let minX = ring[0][0];
  let maxX = ring[0][0];
  let minY = ring[0][1];
  let maxY = ring[0][1];
  for (let i = 1; i < ring.length; i++) {
    const px = ring[i][0];
    const py = ring[i][1];
    if (px < minX) minX = px;
    else if (px > maxX) maxX = px;
    if (py < minY) minY = py;
    else if (py > maxY) maxY = py;
  }
  if (x < minX || x > maxX || y < minY || y > maxY) {
    return false;
  }

  let inside = false;
  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
    const xi = ring[i][0];
    const yi = ring[i][1];
    const xj = ring[j][0];
    const yj = ring[j][1];

    const intersect =
      yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
    if (intersect) inside = !inside;
  }
  return inside;
}

export function isPointInsideGeometry(
  point: [number, number],
  geometry: Geometry
): boolean {
  if (geometry.type === "Polygon") {
    // Exterior ring is index 0
    return pointInPolygon(point, geometry.coordinates[0] as [number, number][]);
  }
  if (geometry.type === "MultiPolygon") {
    for (const polygon of geometry.coordinates) {
      if (pointInPolygon(point, polygon[0] as [number, number][])) {
        return true;
      }
    }
  }
  return false;
}

export function createLineStringGeoJSON(
  fromCoords: [number, number],
  toCoords: [number, number]
) {
  return {
    type: "Feature" as const,
    properties: {},
    geometry: {
      type: "LineString" as const,
      coordinates: [fromCoords, toCoords],
    },
  };
}

export function calculateFeatureCenter(geometry: Geometry): [number, number] {
  let minLng = Infinity;
  let maxLng = -Infinity;
  let minLat = Infinity;
  let maxLat = -Infinity;

  const updateBounds = (coord: [number, number]) => {
    const [lng, lat] = coord;
    if (lng < minLng) minLng = lng;
    if (lng > maxLng) maxLng = lng;
    if (lat < minLat) minLat = lat;
    if (lat > maxLat) maxLat = lat;
  };

  if (geometry.type === "Polygon") {
    for (const pt of geometry.coordinates[0]) {
      updateBounds(pt as [number, number]);
    }
  } else if (geometry.type === "MultiPolygon") {
    for (const poly of geometry.coordinates) {
      for (const pt of poly[0]) {
        updateBounds(pt as [number, number]);
      }
    }
  }

  if (minLng === Infinity) return [0, 0];
  return [(minLng + maxLng) / 2, (minLat + maxLat) / 2];
}

export function geometryToSvgPath(
  geometry: Geometry | undefined | null,
  projectFn: (coord: [number, number]) => { x: number; y: number }
): string {
  if (!geometry) return "";
  if (geometry.type === "Polygon") {
    return geometry.coordinates
      .map((ring) => {
        return (
          ring
            .map((coord, i) => {
              const pt = projectFn(coord as [number, number]);
              return `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
            })
            .join(" ") + " Z"
        );
      })
      .join(" ");
  }
  if (geometry.type === "MultiPolygon") {
    return geometry.coordinates
      .map((polygon) => {
        return polygon
          .map((ring) => {
            return (
              ring
                .map((coord, i) => {
                  const pt = projectFn(coord as [number, number]);
                  return `${i === 0 ? "M" : "L"}${pt.x.toFixed(1)},${pt.y.toFixed(1)}`;
                })
                .join(" ") + " Z"
            );
          })
          .join(" ");
      })
      .join(" ");
  }
  return "";
}
