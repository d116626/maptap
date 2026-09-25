import type { BaseMapId, BaseMapOption } from "@/types/map";

export const ESRI_BORDERS_OVERLAY_TILES = [
  "https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Reference_Overlay/MapServer/tile/{z}/{y}/{x}",
];

export const ESRI_LABELS_OVERLAY_TILES = [
  "https://server.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}",
];

export const BASEMAP_STYLES: Record<BaseMapId, BaseMapOption> = {
  esri_satellite: {
    id: "esri_satellite",
    name: "Esri Satellite",
    category: "Satellite",
    description: "High-resolution orbital satellite imagery without labels (MapTap default)",
    style: {
      version: 8,
      sources: {
        "esri-satellite-tiles": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution:
            "Tiles &copy; Esri &mdash; Source: Esri, Maxar, Earthstar Geographics",
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: "esri-satellite-layer",
          type: "raster",
          source: "esri-satellite-tiles",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  nasa_night: {
    id: "nasa_night",
    name: "NASA Night Lights",
    category: "Satellite",
    description: "Urban city lights viewed from space at night (VIIRS Black Marble)",
    style: {
      version: 8,
      sources: {
        "nasa-night-tiles": {
          type: "raster",
          tiles: [
            "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/VIIRS_CityLights_2012/default/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg",
          ],
          tileSize: 256,
          attribution: "NASA Earth Observatory / NOAA",
          maxzoom: 8,
        },
      },
      layers: [
        {
          id: "nasa-night-layer",
          type: "raster",
          source: "nasa-night-tiles",
          minzoom: 0,
          maxzoom: 8,
        },
      ],
    },
  },
  natgeo: {
    id: "natgeo",
    name: "NatGeo World Map",
    category: "Thematic",
    description: "Classic cartographic visual style by National Geographic",
    style: {
      version: 8,
      sources: {
        "natgeo-tiles": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/NatGeo_World_Map/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution:
            "Tiles &copy; Esri &mdash; National Geographic, DeLorme, HERE, UNEP-WCMC, USGS, NASA, ESA, METI, NRCAN, GEBCO, NOAA, increment P Corp.",
          maxzoom: 16,
        },
      },
      layers: [
        {
          id: "natgeo-layer",
          type: "raster",
          source: "natgeo-tiles",
          minzoom: 0,
          maxzoom: 16,
        },
      ],
    },
  },
  shaded_relief: {
    id: "shaded_relief",
    name: "Shaded Relief",
    category: "Relief",
    description: "Pure shaded relief and topography without text or borders",
    style: {
      version: 8,
      sources: {
        "relief-tiles": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Shaded_Relief/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution: "Tiles &copy; Esri &mdash; USGS, NOAA",
          maxzoom: 13,
        },
      },
      layers: [
        {
          id: "relief-layer",
          type: "raster",
          source: "relief-tiles",
          minzoom: 0,
          maxzoom: 13,
        },
      ],
    },
  },
  esri_topo: {
    id: "esri_topo",
    name: "Esri Topographic",
    category: "Topographic",
    description: "Contour elevations, terrain relief, and hydrological networks",
    style: {
      version: 8,
      sources: {
        "esri-topo-tiles": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution:
            "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic",
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: "esri-topo-layer",
          type: "raster",
          source: "esri-topo-tiles",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  esri_streets: {
    id: "esri_streets",
    name: "Esri Streets",
    category: "Standard",
    description: "Worldwide road network, highways, and populated places",
    style: {
      version: 8,
      sources: {
        "esri-streets-tiles": {
          type: "raster",
          tiles: [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}",
          ],
          tileSize: 256,
          attribution:
            "Tiles &copy; Esri &mdash; DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, TomTom",
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: "esri-streets-layer",
          type: "raster",
          source: "esri-streets-tiles",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  osm: {
    id: "osm",
    name: "OpenStreetMap",
    category: "Standard",
    description: "Collaborative open street map of the world",
    style: {
      version: 8,
      sources: {
        "osm-tiles": {
          type: "raster",
          tiles: [
            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
          ],
          tileSize: 256,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
          maxzoom: 19,
        },
      },
      layers: [
        {
          id: "osm-layer",
          type: "raster",
          source: "osm-tiles",
          minzoom: 0,
          maxzoom: 19,
        },
      ],
    },
  },
  mapbox_streets: {
    id: "mapbox_streets",
    name: "Mapbox Streets",
    category: "Standard",
    description: "Mapbox Streets high-definition vector cartography",
    style: {
      version: 8,
      sources: {
        "mapbox-streets-tiles": {
          type: "raster",
          tiles: [
            `https://api.mapbox.com/styles/v1/mapbox/streets-v12/tiles/256/{z}/{x}/{y}@2x?access_token=${process.env.NEXT_PUBLIC_MAPBOX_TOKEN || ""}`,
          ],
          tileSize: 256,
          attribution: "&copy; Mapbox &copy; OpenStreetMap",
          maxzoom: 20,
        },
      },
      layers: [
        {
          id: "mapbox-streets-layer",
          type: "raster",
          source: "mapbox-streets-tiles",
          minzoom: 0,
          maxzoom: 20,
        },
      ],
    },
  },
};
