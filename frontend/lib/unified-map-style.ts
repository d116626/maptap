import type { StyleSpecification } from "maplibre-gl";
import type { BaseMapId, BaseMapOption, TrainingSettings } from "@/types/map";

export const BASEMAP_OPTIONS: BaseMapOption[] = [
  {
    id: "esri_satellite",
    name: "HD Satellite",
    category: "Satellite",
    description: "Pure orbital imagery without visual distractions",
    icon: "🛰️",
  },
  {
    id: "nasa_night",
    name: "NASA Night Lights",
    category: "Satellite",
    description: "City lights seen from space at night",
    icon: "🌃",
  },
  {
    id: "shaded_relief",
    name: "3D Shaded Relief",
    category: "Relief",
    description: "Mountains, ridges, and physical topography",
    icon: "⛰️",
  },
  {
    id: "natgeo",
    name: "National Geographic",
    category: "Thematic",
    description: "Iconic NatGeo classic cartographic style",
    icon: "🧭",
  },
  {
    id: "esri_topo",
    name: "Topographic",
    category: "Topographic",
    description: "River basins, elevation, and terrain contours",
    icon: "🏞️",
  },
  {
    id: "esri_streets",
    name: "Streets & Roads",
    category: "Standard",
    description: "Road networks and urban infrastructure",
    icon: "🏙️",
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    category: "Standard",
    description: "Standard collaborative worldwide base map",
    icon: "🌐",
  },
];

const RASTER_TILE_SOURCES: Record<
  BaseMapId,
  { tiles: string[]; tileSize: number; maxzoom: number; attribution: string }
> = {
  esri_satellite: {
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    maxzoom: 19,
    attribution: "Tiles &copy; Esri, Maxar, Earthstar Geographics",
  },
  nasa_night: {
    tiles: [
      "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg",
    ],
    tileSize: 256,
    maxzoom: 8,
    attribution: "NASA Earth Observatory / NOAA",
  },
  shaded_relief: {
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    maxzoom: 13,
    attribution: "Tiles &copy; Esri, USGS",
  },
  natgeo: {
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    maxzoom: 16,
    attribution: "Tiles &copy; National Geographic, Esri",
  },
  esri_topo: {
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    maxzoom: 19,
    attribution: "Tiles &copy; Esri, USGS",
  },
  esri_streets: {
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    maxzoom: 19,
    attribution: "Tiles &copy; Esri, DeLorme, TomTom",
  },
  osm: {
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    tileSize: 256,
    maxzoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  },
};

/**
 * Builds an immutable, unified MapLibre Style Specification that declares all
 * raster base layers, labels overlay, and highlight layers upfront.
 * Changing base maps and toggling labels operates by toggling layout.visibility.
 */
export function buildUnifiedMapLibreStyle(
  settings: TrainingSettings
): StyleSpecification {
  const sources: StyleSpecification["sources"] = {};
  const layers: StyleSpecification["layers"] = [];

  // 1. Declare all Basemap sources and layers
  for (const [id, config] of Object.entries(RASTER_TILE_SOURCES)) {
    const sourceId = `basemap-source-${id}`;
    sources[sourceId] = {
      type: "raster",
      tiles: config.tiles,
      tileSize: config.tileSize,
      maxzoom: config.maxzoom,
      attribution: config.attribution,
    };

    const isVisible = settings.baseMap === id;
    layers.push({
      id: `basemap-layer-${id}`,
      type: "raster",
      source: sourceId,
      minzoom: 0,
      maxzoom: config.maxzoom,
      layout: {
        visibility: isVisible ? "visible" : "none",
      },
      paint: {
        "raster-opacity": 1.0,
      },
    });
  }

  // 2. Overlays - Labels & Places (City names, states, countries)
  sources["overlay-source-labels"] = {
    type: "raster",
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    maxzoom: 18,
    attribution: "Labels &copy; Esri",
  };
  layers.push({
    id: "overlay-layer-labels",
    type: "raster",
    source: "overlay-source-labels",
    minzoom: 0,
    maxzoom: 18,
    layout: {
      visibility: settings.showLabels ? "visible" : "none",
    },
    paint: {
      "raster-opacity": 0.95,
    },
  });

  return {
    version: 8,
    sources,
    layers,
  };
}
