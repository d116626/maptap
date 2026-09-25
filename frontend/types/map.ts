import type { StyleSpecification } from "maplibre-gl";

export type BaseMapId = "osm" | "esri_streets" | "esri_topo" | "esri_satellite";

export interface BaseMapOption {
  id: BaseMapId;
  name: string;
  category: "Standard" | "Satellite" | "Topographic";
  style: StyleSpecification;
}

export interface PointProperties {
  id: string;
  title: string;
  category: string;
  description?: string;
  rating?: number;
  metadata?: Record<string, unknown>;
}

export interface PointFeature {
  type: "Feature";
  id?: string;
  properties: PointProperties;
  geometry: {
    type: "Point";
    coordinates: [number, number];
  };
}

export interface PointsCollection {
  type: "FeatureCollection";
  name?: string;
  features: PointFeature[];
}
