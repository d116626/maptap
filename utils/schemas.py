"""Typed Pydantic schemas for data validation and GeoJSON modeling."""

from enum import Enum
from typing import Any, Dict, List, Literal, Optional
from pydantic import BaseModel, Field


class GeometryType(str, Enum):
    POINT = "Point"
    LINE_STRING = "LineString"
    POLYGON = "Polygon"
    MULTI_POINT = "MultiPoint"
    MULTI_LINE_STRING = "MultiLineString"
    MULTI_POLYGON = "MultiPolygon"


class PointGeometry(BaseModel):
    type: Literal["Point"] = "Point"
    coordinates: List[float] = Field(
        ...,
        min_length=2,
        max_length=3,
        description="Coordinates as [longitude, latitude] or [longitude, latitude, elevation]",
    )

    @property
    def longitude(self) -> float:
        return self.coordinates[0]

    @property
    def latitude(self) -> float:
        return self.coordinates[1]


class PointProperties(BaseModel):
    id: str
    title: str
    category: str
    description: Optional[str] = None
    rating: Optional[float] = None
    icon: Optional[str] = None
    metadata: Dict[str, Any] = Field(default_factory=dict)


class GeoJSONPointFeature(BaseModel):
    type: Literal["Feature"] = "Feature"
    id: Optional[str] = None
    properties: PointProperties
    geometry: PointGeometry


class GeoJSONFeatureCollection(BaseModel):
    type: Literal["FeatureCollection"] = "FeatureCollection"
    name: Optional[str] = None
    features: List[GeoJSONPointFeature] = Field(default_factory=list)


class LayerMetadata(BaseModel):
    layer_id: str
    name: str
    source_type: Literal["geojson", "raster", "vector"]
    data_url: Optional[str] = None
    visible_by_default: bool = True
    color: Optional[str] = None


class CityItem(BaseModel):
    id: str
    name: str
    country: str
    country_code: str
    state: Optional[str] = None
    state_code: Optional[str] = None
    lat: float
    lng: float
    population: int
    is_capital: bool = False
    continent: Optional[str] = None


class CitiesDataset(BaseModel):
    version: str = "1.0.0"
    updated_at: str
    cities: List[CityItem]

