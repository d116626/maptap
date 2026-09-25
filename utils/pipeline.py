"""Main data pipeline orchestrator:
Loads/generates city datasets and geographic boundaries (countries, states)
using GeoPandas, Shapely, and Pydantic validation.
"""

from datetime import datetime, timezone
import json
from pathlib import Path

from utils.constants import (
    DEFAULT_CENTER_LAT,
    DEFAULT_CENTER_LNG,
    FRONTEND_PUBLIC_DATA_DIR,
    GITHUB_MAX_FILE_SIZE_BYTES,
    PROCESS_DIR,
    RAW_DIR,
)
from utils.data_sources.cities_seed import CITIES_SEED
from utils.processors.borders import (
    process_brazil_states_geojson,
    process_countries_geojson,
)
from utils.processors.geojson import save_geojson
from utils.schemas import (
    CitiesDataset,
    GeoJSONFeatureCollection,
    GeoJSONPointFeature,
    PointGeometry,
    PointProperties,
)


def export_cities_dataset() -> Path:
    """Validate and export cities dataset to data/process and frontend/public/data."""
    out_public = FRONTEND_PUBLIC_DATA_DIR / "cities.json"
    if out_public.exists():
        try:
            with open(out_public, "r", encoding="utf-8") as f:
                existing = json.load(f)
                count = (
                    len(existing.get("cities", []))
                    if isinstance(existing, dict)
                    else len(existing)
                )
                if count > 500:
                    print(f"Skipping cities export: {out_public} already contains {count} cities.")
                    return out_public
        except Exception:
            pass

    dataset = CitiesDataset(
        version="1.0.0",
        updated_at=datetime.now(timezone.utc).isoformat(),
        cities=CITIES_SEED,
    )

    serialized = dataset.model_dump(mode="json")
    json_bytes = json.dumps(serialized, ensure_ascii=False, indent=2).encode("utf-8")

    if len(json_bytes) > GITHUB_MAX_FILE_SIZE_BYTES:
        raise ValueError("Cities dataset exceeds GitHub size limit!")

    PROCESS_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)

    with open(PROCESS_DIR / "cities.json", "wb") as f:
        f.write(json_bytes)

    out_public = FRONTEND_PUBLIC_DATA_DIR / "cities.json"
    with open(out_public, "wb") as f:
        f.write(json_bytes)

    print(f"Exported cities.json ({len(dataset.cities)} cities, {len(json_bytes) / 1024:.1f} KB)")
    return out_public


def export_sample_points() -> None:
    features = [
        GeoJSONPointFeature(
            id="sp-se",
            geometry=PointGeometry(coordinates=[DEFAULT_CENTER_LNG, DEFAULT_CENTER_LAT]),
            properties=PointProperties(
                id="sp-se",
                title="Praça da Sé (Marco Zero)",
                category="Landmark",
                description="Marco zero da cidade de São Paulo.",
                rating=4.5,
                metadata={"city": "São Paulo", "country": "BR"},
            ),
        ),
    ]

    collection = GeoJSONFeatureCollection(
        name="Sample Points",
        features=features,
    )
    save_geojson(collection, "points.json", export_to_public=True)


def run_pipeline() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESS_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)

    print("--- [1/3] Exporting cities dataset ---")
    export_cities_dataset()

    print("\n--- [2/3] Processing geographic boundaries with GeoPandas ---")
    try:
        process_countries_geojson()
    except Exception as exc:
        print(f"Warning: Failed to process countries geojson: {exc}")

    try:
        process_brazil_states_geojson()
    except Exception as exc:
        print(f"Warning: Failed to process brazil states geojson: {exc}")

    print("\n--- [3/3] Exporting auxiliary points ---")
    export_sample_points()

    print("\n[SUCCESS] Pipeline executed successfully.")


if __name__ == "__main__":
    run_pipeline()
