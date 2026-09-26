import type { LayerSpecification, StyleSpecification } from "maplibre-gl";
import type { BaseMapId, BaseMapOption, TrainingSettings } from "@/types/map";
import mapboxOverlayLayers from "./mapbox-overlay-layers.json";

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
    id: "mapbox_streets",
    name: "Mapbox Streets",
    category: "Standard",
    description: "Mapbox Streets high-definition vector cartography",
    icon: "🗺️",
  },
  {
    id: "osm",
    name: "OpenStreetMap",
    category: "Standard",
    description: "Standard collaborative worldwide base map",
    icon: "🌐",
  },
];

const mapboxToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN || "";

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
  mapbox_streets: {
    tiles: mapboxToken
      ? [
          `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${mapboxToken}`,
        ]
      : [
          "https://tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
    tileSize: 256,
    maxzoom: 20,
    attribution: "&copy; Mapbox &copy; OpenStreetMap",
  },
  osm: {
    tiles: ["https://tile.openstreetmap.org/{z}/{x}/{y}.png"],
    tileSize: 256,
    maxzoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  },
};

export function getOverlayLayerVisibility(
  layer: LayerSpecification,
  settings: TrainingSettings
): "visible" | "none" {
  const sourceLayer = "source-layer" in layer ? layer["source-layer"] : undefined;
  const metadata = layer.metadata as Record<string, unknown> | undefined;
  const fc = (metadata && (metadata["mapbox:featureComponent"] as string)) || "";
  const id = layer.id || "";

  // 1. Borders & Boundaries (Fronteiras e Divisas Internacionais / Estaduais - Linhas puras sem texto)
  if (sourceLayer === "admin" || fc === "admin-boundaries") {
    return (settings.showBorders ?? true) ? "visible" : "none";
  }

  // 2. Country Names (Original Mapbox Vector Tiles)
  if (id === "country-label" || id === "continent-label") {
    return (settings.showCountryNames ?? false) ? "visible" : "none";
  }

  // 3. State Labels (Silenciado no Mapbox porque usamos nosso layer customizado apenas para as subdivisões/estados)
  if (id === "state-label") {
    return "none";
  }

  // 3. City & Municipality Names (Nomes de Cidades, Municípios e Vilas)
  if (
    id === "settlement-major-label" ||
    id === "settlement-minor-label" ||
    id === "settlement-subdivision-label" ||
    sourceLayer === "place_label"
  ) {
    return (settings.showCityNames ?? false) ? "visible" : "none";
  }

  // 4. Roads & Highways (Rodovias, Estradas, Ruas, Túneis e Pontes)
  if (
    sourceLayer === "road" ||
    sourceLayer === "motorway_junction" ||
    fc === "road-network" ||
    fc === "walking-cycling" ||
    fc === "transit"
  ) {
    return (settings.showRoads ?? false) ? "visible" : "none";
  }

  // 5. Physical Geography & POIs (Rios, Montanhas, Lagos, Aeroportos)
  if (
    sourceLayer === "natural_label" ||
    sourceLayer === "poi_label" ||
    sourceLayer === "airport_label" ||
    sourceLayer === "transit_stop_label" ||
    fc === "natural-features" ||
    fc === "point-of-interest-labels"
  ) {
    return (settings.showPhysical ?? false) ? "visible" : "none";
  }

  return "none";
}

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

  // 2. Overlays - Esri Reference and Mapbox Streets
  const provider = settings.overlayProvider || (mapboxToken ? "mapbox" : "esri");

  // A. Esri Roads Overlay (World Transportation)
  sources["overlay-source-esri-roads"] = {
    type: "raster",
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Transportation/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    maxzoom: 19,
    attribution: "Tiles &copy; Esri, DeLorme, HERE",
  };
  layers.push({
    id: "overlay-layer-esri-roads",
    type: "raster",
    source: "overlay-source-esri-roads",
    minzoom: 0,
    maxzoom: 19,
    layout: {
      visibility:
        provider === "esri" && (settings.showRoads ?? false)
          ? "visible"
          : "none",
    },
    paint: {
      "raster-opacity": 0.95,
    },
  });

  // B. Esri Places & Boundaries Overlay (World Boundaries and Places)
  sources["overlay-source-esri-places"] = {
    type: "raster",
    tiles: [
      "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
    ],
    tileSize: 256,
    maxzoom: 19,
    attribution: "Tiles &copy; Esri, DeLorme, HERE",
  };
  layers.push({
    id: "overlay-layer-esri-places",
    type: "raster",
    source: "overlay-source-esri-places",
    minzoom: 0,
    maxzoom: 19,
    layout: {
      visibility:
        provider === "esri" && (settings.showBorders ?? true)
          ? "visible"
          : "none",
    },
    paint: {
      "raster-opacity": 0.95,
    },
  });

  // C. Mapbox Streets Vector Layers
  if (mapboxToken) {
    sources["composite"] = {
      type: "vector",
      tiles: [
        `https://api.mapbox.com/v4/mapbox.mapbox-streets-v8/{z}/{x}/{y}.vector.pbf?access_token=${mapboxToken}`,
      ],
      minzoom: 0,
      maxzoom: 16,
    };

    const isMapboxActive = provider === "mapbox";
    for (const rawLayer of mapboxOverlayLayers) {
      const layer = rawLayer as LayerSpecification;
      const visibility = isMapboxActive
        ? getOverlayLayerVisibility(layer, settings)
        : "none";
      layers.push({
        ...layer,
        layout: {
          ...(layer.layout || {}),
          visibility,
        },
      } as LayerSpecification);
    }
  }

  // 3. Terrain 3D Elevation (Raster DEM)
  sources["terrain-dem-source"] = mapboxToken
    ? {
        type: "raster-dem",
        tiles: [
          `https://api.mapbox.com/v4/mapbox.terrain-rgb/{z}/{x}/{y}.pngraw?access_token=${mapboxToken}`,
        ],
        tileSize: 256,
        encoding: "mapbox",
        maxzoom: 14,
      }
    : {
        type: "raster-dem",
        tiles: [
          "https://s3.amazonaws.com/elevation-tiles-prod/terrarium/{z}/{x}/{y}.png",
        ],
        tileSize: 256,
        encoding: "terrarium",
        maxzoom: 15,
      };

  return {
    version: 8,
    sprite: mapboxToken
      ? `https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/sprite?access_token=${mapboxToken}`
      : undefined,
    glyphs: mapboxToken
      ? `https://api.mapbox.com/fonts/v1/mapbox/{fontstack}/{range}.pbf?access_token=${mapboxToken}`
      : "https://demotiles.maplibre.org/font/{fontstack}/{range}.pbf",
    sources,
    layers,
    terrain: settings.terrain3D
      ? {
          source: "terrain-dem-source",
          exaggeration: 1.5,
        }
      : undefined,
  };
}
