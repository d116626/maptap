import type { BaseMapId, BaseMapOption } from "@/types/map";

export const BASEMAP_STYLES: Record<BaseMapId, BaseMapOption> = {
  osm: {
    id: "osm",
    name: "OpenStreetMap",
    category: "Standard",
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
          attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
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
  esri_streets: {
    id: "esri_streets",
    name: "Esri Streets",
    category: "Standard",
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
            "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom",
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
  esri_topo: {
    id: "esri_topo",
    name: "Esri Topo",
    category: "Topographic",
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
            "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ",
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
  esri_satellite: {
    id: "esri_satellite",
    name: "Esri Satellite",
    category: "Satellite",
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
            "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
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
};
