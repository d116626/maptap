import type { StyleSpecification } from "maplibre-gl";

export type BaseMapId =
  | "esri_satellite"
  | "nasa_night"
  | "natgeo"
  | "shaded_relief"
  | "esri_topo"
  | "esri_streets"
  | "osm"
  | "mapbox_streets";

export interface BaseMapOption {
  id: BaseMapId;
  name: string;
  category: "Satellite" | "Relief" | "Topographic" | "Thematic" | "Standard";
  description: string;
  icon?: string;
  style?: StyleSpecification;
}

export interface CityItem {
  id: string;
  name: string;
  country: string;
  country_code: string;
  state?: string;
  state_code?: string;
  lat: number;
  lng: number;
  population: number;
  is_country_capital?: boolean;
  is_state_capital?: boolean;
  is_capital: boolean;
  continent?: string;
  is_maptap_base?: boolean;
}

/** Minified schema stored in cities.json over the wire */
export interface CompactCityItem {
  id: string;
  n: string; // name
  c: string; // country
  cc: string; // country_code
  s?: string; // state
  sc?: string; // state_code
  y: number; // lat
  x: number; // lng
  p: number; // population
  is_cc?: 1; // is_country_capital
  is_sc?: 1; // is_state_capital
  is_cap?: 1; // is_capital
  ct?: string; // continent
  mt?: 1; // is_maptap_base
}

export type CityTarget = CityItem;

export interface TargetEntity {
  id: string;
  type: "city" | "state" | "country";
  displayName: string;
  name: string;
  state?: string;
  state_code?: string;
  country: string;
  country_code: string;
  continent?: string;
  lat: number;
  lng: number;
  population?: number;
  is_country_capital?: boolean;
  is_state_capital?: boolean;
  is_capital?: boolean;
  is_maptap_base?: boolean;
}

export interface CitiesResponse {
  version: string;
  total_cities?: number;
  cities: (CityItem | CompactCityItem)[];
}

export type TrainingMode = "cities" | "states";

export type CityPoolMode =
  | "all"
  | "100k"
  | "1M"
  | "country_capitals"
  | "state_capitals"
  | "capitals"
  | "maptap"; // legacy backwards compatibility

export interface TrainingSettings {
  showLabels: boolean;
  soundEnabled: boolean;
  scopeCountry: string; // "ALL" | "BRA" | "USA" | "EUR"
  mode: TrainingMode;
  baseMap: BaseMapId;
  cityPool: CityPoolMode;
  maptapOnly?: boolean;
  terrain3D?: boolean;
  datasetPool?: CityPoolMode;
}

export interface GuessResult {
  guessCoords: [number, number]; // [lng, lat]
  targetCoords: [number, number]; // [lng, lat]
  distanceKm: number;
  score: number; // 0 - 1000
  clickedRegionName?: string;
  clickedRegionCode?: string;
  clickedRegionCountry?: string;
  clickedRegionType?: "state" | "country";
  targetRegionName?: string;
  targetRegionCode?: string;
  isCorrectRegion: boolean;
}

export interface StatePolygonProperties {
  name: string;
  state_name: string;
  state_code: string;
  country: string;
  country_code: string;
  continent?: string;
  type: string;
}

export interface CountryPolygonProperties {
  name: string;
  code: string;
  type: string;
}
