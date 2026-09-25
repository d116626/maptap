"""Process, simplify, and standardize geographic boundary polygons using GeoPandas and Shapely."""

import json
from pathlib import Path
from typing import Optional
import geopandas as gpd
import requests
from utils.constants import (
    FRONTEND_PUBLIC_DATA_DIR,
    GITHUB_MAX_FILE_SIZE_BYTES,
    PROCESS_DIR,
    RAW_DIR,
)

COUNTRIES_URL = "https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson"
BRAZIL_STATES_URL = "https://raw.githubusercontent.com/codeforamerica/click_that_hood/master/public/data/brazil-states.geojson"


def fetch_file_if_missing(url: str, target_path: Path) -> Path:
    target_path.parent.mkdir(parents=True, exist_ok=True)
    if not target_path.exists():
        print(f"Downloading {url} -> {target_path.name}...")
        resp = requests.get(url, timeout=30)
        resp.raise_for_status()
        with open(target_path, "wb") as f:
            f.write(resp.content)
    return target_path


def process_countries_geojson() -> Optional[Path]:
    """Download, simplify, and export world country borders."""
    raw_path = fetch_file_if_missing(COUNTRIES_URL, RAW_DIR / "countries_raw.geojson")
    
    gdf = gpd.read_file(raw_path)
    
    # Detect proper ISO-3 column
    iso_col = None
    for candidate in ["ISO3166-1-Alpha-3", "ISO_A3", "iso_a3", "id"]:
        if candidate in gdf.columns:
            iso_col = candidate
            break
            
    name_col = "name" if "name" in gdf.columns else "ADMIN"
    
    gdf["name"] = gdf[name_col]
    gdf["code"] = gdf[iso_col] if iso_col else gdf["name"].str[:3].str.upper()
    
    # Specific known fixes for Natural Earth ISO quirks (like metropolitan France/Norway)
    name_to_iso = {
        "France": "FRA",
        "Norway": "NOR",
        "Northern Cyprus": "CYP",
        "Somaliland": "SOM",
        "Kosovo": "XKX",
    }
    for country_name, fixed_code in name_to_iso.items():
        gdf.loc[gdf["name"] == country_name, "code"] = fixed_code

    gdf["type"] = "country"
    
    # Remove negative codes or sub-islands that shadow main countries
    gdf = gdf[gdf["code"] != "-99"]
    
    # Simplify geometries to optimize WebGL rendering on mobile (tolerance ~0.08 deg)
    gdf["geometry"] = gdf["geometry"].simplify(tolerance=0.08, preserve_topology=True)
    
    keep_cols = ["name", "code", "type", "geometry"]
    gdf = gdf[[c for c in keep_cols if c in gdf.columns]]
    
    json_bytes = gdf.to_json().encode("utf-8")
    if len(json_bytes) > GITHUB_MAX_FILE_SIZE_BYTES:
        print("[ALERTA] Countries GeoJSON ultrapassou o limite do GitHub!")
        return None
        
    PROCESS_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    with open(PROCESS_DIR / "countries.geojson", "wb") as f:
        f.write(json_bytes)
    output_path = FRONTEND_PUBLIC_DATA_DIR / "countries.geojson"
    with open(output_path, "wb") as f:
        f.write(json_bytes)
        
    print(f"Exported countries.geojson ({len(gdf)} countries, {len(json_bytes) / 1024:.1f} KB)")
    return output_path


def process_brazil_states_geojson() -> Optional[Path]:
    """Download, simplify, and export Brazil state polygons with state codes."""
    raw_path = fetch_file_if_missing(BRAZIL_STATES_URL, RAW_DIR / "brazil_states_raw.geojson")
    
    gdf = gpd.read_file(raw_path)
    
    # Normalize state code and name
    # Click that hood uses 'name' and 'sigla'
    gdf["country"] = "Brasil"
    gdf["country_code"] = "BRA"
    gdf["type"] = "state"
    if "sigla" in gdf.columns:
        gdf["state_code"] = gdf["sigla"]
    else:
        gdf["state_code"] = gdf["name"].str[:2].str.upper()
    
    gdf["state_name"] = gdf["name"]
    
    # Simplify geometries for mobile (tolerance ~0.04 deg)
    gdf["geometry"] = gdf["geometry"].simplify(tolerance=0.04, preserve_topology=True)
    
    keep_cols = ["name", "state_name", "state_code", "country", "country_code", "type", "geometry"]
    gdf = gdf[[c for c in keep_cols if c in gdf.columns]]
    
    json_bytes = gdf.to_json().encode("utf-8")
    if len(json_bytes) > GITHUB_MAX_FILE_SIZE_BYTES:
        print("[ALERTA] Brazil states GeoJSON ultrapassou o limite do GitHub!")
        return None
        
    PROCESS_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)
    
    with open(PROCESS_DIR / "brazil_states.geojson", "wb") as f:
        f.write(json_bytes)
    output_path = FRONTEND_PUBLIC_DATA_DIR / "brazil_states.geojson"
    with open(output_path, "wb") as f:
        f.write(json_bytes)
        
    print(f"Exported brazil_states.geojson ({len(gdf)} states, {len(json_bytes) / 1024:.1f} KB)")
    return output_path
