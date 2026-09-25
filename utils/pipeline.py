"""Main data pipeline orchestrator:
Loads or generates data, validates against Pydantic schemas, and outputs to process/ and frontend/public/data/.
"""

from utils.constants import (
    DEFAULT_CENTER_LAT,
    DEFAULT_CENTER_LNG,
    RAW_DIR,
    PROCESS_DIR,
    FRONTEND_PUBLIC_DATA_DIR,
)
from utils.processors.geojson import save_geojson
from utils.schemas import (
    GeoJSONFeatureCollection,
    GeoJSONPointFeature,
    PointGeometry,
    PointProperties,
)


def run_pipeline() -> None:
    RAW_DIR.mkdir(parents=True, exist_ok=True)
    PROCESS_DIR.mkdir(parents=True, exist_ok=True)
    FRONTEND_PUBLIC_DATA_DIR.mkdir(parents=True, exist_ok=True)

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
        GeoJSONPointFeature(
            id="sp-masp",
            geometry=PointGeometry(coordinates=[-46.6559, -23.5614]),
            properties=PointProperties(
                id="sp-masp",
                title="MASP - Museu de Arte de São Paulo",
                category="Museum",
                description="Importante centro cultural e arquitetura icônica de Lina Bo Bardi.",
                rating=4.8,
                metadata={"city": "São Paulo", "country": "BR"},
            ),
        ),
        GeoJSONPointFeature(
            id="sp-ibira",
            geometry=PointGeometry(coordinates=[-46.6576, -23.5874]),
            properties=PointProperties(
                id="sp-ibira",
                title="Parque Ibirapuera",
                category="Park",
                description="O maior parque urbano de São Paulo, área verde e cultura.",
                rating=4.9,
                metadata={"city": "São Paulo", "country": "BR"},
            ),
        ),
        GeoJSONPointFeature(
            id="sp-pinacoteca",
            geometry=PointGeometry(coordinates=[-46.6340, -23.5342]),
            properties=PointProperties(
                id="sp-pinacoteca",
                title="Pinacoteca do Estado",
                category="Museum",
                description="Um dos mais importantes museus de arte do Brasil.",
                rating=4.8,
                metadata={"city": "São Paulo", "country": "BR"},
            ),
        ),
    ]

    collection = GeoJSONFeatureCollection(
        name="Sample Points of Interest",
        features=features,
    )

    output_file = save_geojson(collection, "points.json", export_to_public=True)
    if output_file:
        print(f"Pipeline completed successfully. Generated {len(features)} points at {output_file}")
    else:
        print("Pipeline aborted export due to file size restriction.")


if __name__ == "__main__":
    run_pipeline()
