"""Central constants and path configurations for MapTap data utilities."""

from pathlib import Path

# Filesystem Paths
ROOT_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = ROOT_DIR / "data"
RAW_DIR = DATA_DIR / "raw"
PROCESS_DIR = DATA_DIR / "process"

FRONTEND_DIR = ROOT_DIR / "frontend"
FRONTEND_PUBLIC_DIR = FRONTEND_DIR / "public"
FRONTEND_PUBLIC_DATA_DIR = FRONTEND_PUBLIC_DIR / "data"

# Default Coordinates (São Paulo - Lat/Lng)
DEFAULT_CENTER_LAT = -23.55052
DEFAULT_CENTER_LNG = -46.633308
DEFAULT_ZOOM = 12.0

# GitHub File Size Thresholds (bytes)
GITHUB_MAX_FILE_SIZE_BYTES = 100 * 1024 * 1024  # 100 MB hard limit
GITHUB_WARNING_FILE_SIZE_BYTES = 50 * 1024 * 1024  # 50 MB warning threshold

# Free & Open Source Map Tile URLs (Zero API key required)
OPENSOURCE_TILE_SOURCES = {
    "osm": {
        "id": "osm",
        "name": "OpenStreetMap",
        "tiles": [
            "https://a.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://b.tile.openstreetmap.org/{z}/{x}/{y}.png",
            "https://c.tile.openstreetmap.org/{z}/{x}/{y}.png",
        ],
        "attribution": '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
        "maxzoom": 19,
    },
    "esri_streets": {
        "id": "esri_streets",
        "name": "Esri Streets",
        "tiles": [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}"
        ],
        "attribution": "Tiles &copy; Esri &mdash; Source: Esri, DeLorme, NAVTEQ, USGS, Intermap, iPC, NRCAN, METI, TomTom",
        "maxzoom": 19,
    },
    "esri_topo": {
        "id": "esri_topo",
        "name": "Esri Topographic",
        "tiles": [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}"
        ],
        "attribution": "Tiles &copy; Esri &mdash; Sources: GEBCO, NOAA, CHS, OSU, UNH, CSUMB, National Geographic, DeLorme, NAVTEQ, and other contributors",
        "maxzoom": 19,
    },
    "esri_satellite": {
        "id": "esri_satellite",
        "name": "Esri Satellite",
        "tiles": [
            "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}"
        ],
        "attribution": "Tiles &copy; Esri &mdash; Source: Esri, i-cubed, USDA, USGS, AEX, GeoEye, Getmapping, Aerogrid, IGN, IGP, UPR-EGP, and the GIS User Community",
        "maxzoom": 19,
    },
}
