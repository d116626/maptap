"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Map, {
  Layer,
  Marker,
  Source,
  type MapRef,
  type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import * as maplibregl from "maplibre-gl";
import type { MapLayerMouseEvent } from "maplibre-gl";
import "maplibre-gl/dist/maplibre-gl.css";
import type { Feature, FeatureCollection, Geometry } from "geojson";

import type {
  CitiesResponse,
  CityItem,
  CityPoolMode,
  CompactCityItem,
  CountryPolygonProperties,
  GuessResult,
  StatePolygonProperties,
  TargetEntity,
  TrainingSettings,
} from "@/types/map";
import {
  calculateDistanceKm,
  calculateFeatureCenter,
  calculateScore,
  filterCitiesByScope,
  isPointInsideGeometry,
} from "@/lib/geo-utils";
import { soundEffects } from "@/lib/sound-effects";
import { buildUnifiedMapLibreStyle } from "@/lib/unified-map-style";
import { UnifiedGamePanel } from "./unified-game-panel";
import { BottomControlsDock } from "./bottom-controls-dock";
import { CitiesCatalogDialog } from "./cities-catalog-dialog";
import { Crosshair, MapPin } from "lucide-react";
import { REGION_TABS, ALL_REGION_OPTIONS } from "@/data/countries-catalog";

// Configure MapLibre Web Worker URL for Next.js
if (typeof window !== "undefined") {
  const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
  maplibregl.setWorkerUrl(`${basePath}/maplibre/maplibre-gl-worker.mjs`);
}

function createLineStringGeoJSON(
  start: [number, number],
  end: [number, number]
): Feature {
  return {
    type: "Feature",
    properties: {},
    geometry: {
      type: "LineString",
      coordinates: [start, end],
    },
  };
}

function filterCitiesByPool(
  cities: CityItem[],
  poolMode: CityPoolMode = "all",
  maptapOnly = false
): CityItem[] {
  let pool = cities;
  if (maptapOnly || poolMode === "maptap") {
    pool = pool.filter((c) => c.is_maptap_base);
  }

  if (poolMode === "country_capitals") {
    const res = pool.filter((c) => Boolean(c.is_country_capital));
    return res.length > 0 ? res : pool;
  }
  if (poolMode === "state_capitals") {
    const res = pool.filter((c) => Boolean(c.is_state_capital));
    return res.length > 0 ? res : pool;
  }
  if (poolMode === "capitals") {
    const res = pool.filter((c) => Boolean(c.is_capital));
    return res.length > 0 ? res : pool;
  }
  if (poolMode === "100k") {
    const res = pool.filter((c) => (c.population || 0) >= 100_000);
    return res.length > 0 ? res : pool;
  }
  if (poolMode === "1M") {
    const res = pool.filter((c) => (c.population || 0) >= 1_000_000);
    return res.length > 0 ? res : pool;
  }
  return pool.length > 0 ? pool : cities;
}

interface SelectTargetParams {
  forcedCity?: CityItem;
  settings: TrainingSettings;
  cities: CityItem[];
  statesGeoJSON: FeatureCollection | null;
  countriesGeoJSON: FeatureCollection | null;
  currentTargetId?: string;
}

function selectTargetEntity({
  forcedCity,
  settings,
  cities,
  statesGeoJSON,
  countriesGeoJSON,
  currentTargetId,
}: SelectTargetParams): TargetEntity | null {
  if (forcedCity) {
    return {
      id: forcedCity.id,
      type: "city",
      name: forcedCity.name,
      state: forcedCity.state,
      state_code: forcedCity.state_code,
      country: forcedCity.country,
      country_code: forcedCity.country_code,
      continent: forcedCity.continent,
      lat: forcedCity.lat,
      lng: forcedCity.lng,
      displayName: forcedCity.state
        ? `${forcedCity.name} • ${forcedCity.state} • ${forcedCity.country}`
        : `${forcedCity.name} • ${forcedCity.country}`,
    };
  }

  const scope = settings.scopeCountry.toUpperCase();

  // MODE 1: STATES / COUNTRIES
  if (settings.mode === "states") {
    // 1. Check if scope has administrative subdivisions available
    if (statesGeoJSON && statesGeoJSON.features.length > 0 && scope !== "ALL") {
      const countrySubdivisions = statesGeoJSON.features.filter(
        (f) => f.properties?.country_code?.toUpperCase() === scope
      );
      if (countrySubdivisions.length > 0) {
        const pool = countrySubdivisions;
        const filtered = currentTargetId
          ? pool.filter(
              (f) =>
                `state-${f.properties?.country_code}-${f.properties?.state_code || f.properties?.name}` !==
                currentTargetId
            )
          : pool;
        const list = filtered.length > 0 ? filtered : pool;
        const feat = list[Math.floor(Math.random() * list.length)];
        const props = feat.properties as StatePolygonProperties;
        const [centerLng, centerLat] = calculateFeatureCenter(
          feat.geometry as Geometry
        );

        return {
          id: `state-${props.country_code}-${props.state_code || props.name}`,
          type: "state",
          name: props.state_name || props.name,
          state: props.state_name || props.name,
          state_code: props.state_code,
          country: props.country || scope,
          country_code: props.country_code || scope,
          continent: props.continent,
          lat: centerLat,
          lng: centerLng,
          displayName: `${props.state_name || props.name} • ${props.country || scope}`,
        };
      }
    }

    // 2. Global / Continental / Country pool
    if (countriesGeoJSON && countriesGeoJSON.features.length > 0) {
      let pool = countriesGeoJSON.features.filter(
        (f) => f.properties?.code && f.properties.code !== "-99"
      );

      if (scope === "SOUTH_AMERICA") {
        const saTab = REGION_TABS.find((t) => t.id === "south_america");
        const saCodes = saTab ? saTab.items.map((i) => i.id) : [];
        pool = pool.filter((f) => saCodes.includes(f.properties?.code?.toUpperCase()));
      } else if (scope === "NORTH_AMERICA") {
        const naTab = REGION_TABS.find((t) => t.id === "north_america");
        const naCodes = naTab ? naTab.items.map((i) => i.id) : [];
        pool = pool.filter((f) => naCodes.includes(f.properties?.code?.toUpperCase()));
      } else if (scope === "EUR") {
        const euTab = REGION_TABS.find((t) => t.id === "europe");
        const euCodes = euTab ? euTab.items.map((i) => i.id) : [];
        pool = pool.filter((f) => euCodes.includes(f.properties?.code?.toUpperCase()));
      } else if (scope === "ASIA") {
        const asTab = REGION_TABS.find((t) => t.id === "asia");
        const asCodes = asTab ? asTab.items.map((i) => i.id) : [];
        pool = pool.filter((f) => asCodes.includes(f.properties?.code?.toUpperCase()));
      } else if (scope === "AFRICA") {
        const afTab = REGION_TABS.find((t) => t.id === "africa");
        const afCodes = afTab ? afTab.items.map((i) => i.id) : [];
        pool = pool.filter((f) => afCodes.includes(f.properties?.code?.toUpperCase()));
      } else if (scope === "OCEANIA") {
        const ocTab = REGION_TABS.find((t) => t.id === "oceania");
        const ocCodes = ocTab ? ocTab.items.map((i) => i.id) : [];
        pool = pool.filter((f) => ocCodes.includes(f.properties?.code?.toUpperCase()));
      } else if (scope !== "ALL") {
        // Specific country requested (any of the 241+ countries)
        const specific = pool.filter(
          (f) => f.properties?.code?.toUpperCase() === scope
        );
        if (specific.length > 0) {
          pool = specific;
        }
      }

      if (pool.length > 0) {
        const filtered = currentTargetId
          ? pool.filter((f) => `country-${f.properties?.code}` !== currentTargetId)
          : pool;
        const list = filtered.length > 0 ? filtered : pool;
        const feat = list[Math.floor(Math.random() * list.length)];
        const props = feat.properties as CountryPolygonProperties;
        const [centerLng, centerLat] = calculateFeatureCenter(feat.geometry as Geometry);

        return {
          id: `country-${props.code}`,
          type: "country",
          name: props.name,
          country: props.name,
          country_code: props.code,
          lat: centerLat,
          lng: centerLng,
          displayName: props.name,
        };
      }
    }
  }

  // MODE 2: CITIES
  if (cities && cities.length > 0) {
    const pool = filterCitiesByPool(
      cities,
      settings.cityPool,
      settings.maptapOnly
    );
    let scoped = filterCitiesByScope(pool, settings.scopeCountry);

    // If active pool filters out all cities in this country, fallback to any cities in that country
    if (scoped.length === 0 && settings.scopeCountry !== "ALL") {
      scoped = filterCitiesByScope(cities, settings.scopeCountry);
    }

    if (scoped.length > 0) {
      const filtered = currentTargetId
        ? scoped.filter((c) => c.id !== currentTargetId)
        : scoped;
      const list = filtered.length > 0 ? filtered : scoped;
      const c = list[Math.floor(Math.random() * list.length)];

      return {
        id: c.id,
        type: "city",
        name: c.name,
        state: c.state,
        state_code: c.state_code,
        country: c.country,
        country_code: c.country_code,
        continent: c.continent,
        lat: c.lat,
        lng: c.lng,
        population: c.population,
        is_country_capital: c.is_country_capital,
        is_state_capital: c.is_state_capital,
        is_capital: c.is_capital,
        is_maptap_base: c.is_maptap_base,
        displayName: c.state
          ? `${c.name} • ${c.state} • ${c.country}`
          : `${c.name} • ${c.country}`,
      };
    } else {
      // Fallback: If country doesn't have seeded cities yet, target its center point
      const countryMeta = ALL_REGION_OPTIONS.find((c) => c.id === scope);
      if (countryMeta) {
        return {
          id: `city-${countryMeta.id}`,
          type: "city",
          name: countryMeta.name,
          country: countryMeta.name,
          country_code: countryMeta.id,
          lat: countryMeta.center[1],
          lng: countryMeta.center[0],
          displayName: countryMeta.name,
        };
      }
    }
  }

  return null;
}

export function MapView() {
  const mapRef = useRef<MapRef | null>(null);

  // Core Game State
  const [settings, setSettings] = useState<TrainingSettings>({
    mode: "cities",
    baseMap: "esri_satellite",
    showLabels: false,
    soundEnabled: true,
    scopeCountry: "BRA",
    cityPool: "all",
    maptapOnly: false,
    terrain3D: false,
  });

  const [cities, setCities] = useState<CityItem[]>([]);
  const [statesGeoJSON, setStatesGeoJSON] = useState<FeatureCollection | null>(
    null
  );
  const [countriesGeoJSON, setCountriesGeoJSON] =
    useState<FeatureCollection | null>(null);

  const [target, setTarget] = useState<TargetEntity | null>(null);
  const [guessResult, setGuessResult] = useState<GuessResult | null>(null);
  const [score, setScore] = useState<number>(0);
  const [streak, setStreak] = useState<number>(0);
  const [catalogOpen, setCatalogOpen] = useState(false);

  const [viewState, setViewState] = useState({
    longitude: -51.9253,
    latitude: -14.235,
    zoom: 3.5,
  });

  // Sound sync
  useEffect(() => {
    soundEffects.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  // Camera pitch adjustment when toggling 3D terrain
  useEffect(() => {
    if (mapRef.current) {
      if (settings.terrain3D) {
        mapRef.current.easeTo({
          pitch: 55,
          duration: 1000,
        });
      } else {
        mapRef.current.easeTo({
          pitch: 0,
          duration: 800,
        });
      }
    }
  }, [settings.terrain3D]);

  // Load public static datasets & initialize first target
  useEffect(() => {
    async function loadData() {
      try {
        const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";

        const [cRes, sRes, cntRes] = await Promise.all([
          fetch(`${basePath}/data/cities.json`),
          fetch(`${basePath}/data/regions.geojson`),
          fetch(`${basePath}/data/countries.geojson`),
        ]);

        if (cRes.ok && sRes.ok && cntRes.ok) {
          const rawCities = (await cRes.json()) as CitiesResponse | CityItem[];
          const rawList = Array.isArray(rawCities)
            ? rawCities
            : rawCities.cities || [];

          const cData: CityItem[] = rawList.map((item) => {
            if ("n" in item) {
              const r = item as CompactCityItem;
              return {
                id: r.id,
                name: r.n,
                country: r.c,
                country_code: r.cc,
                state: r.s,
                state_code: r.sc,
                lat: r.y,
                lng: r.x,
                population: r.p || 0,
                is_country_capital: Boolean(r.is_cc),
                is_state_capital: Boolean(r.is_sc),
                is_capital: Boolean(r.is_cap),
                continent: r.ct,
                is_maptap_base: Boolean(r.mt),
              };
            }
            return item as CityItem;
          });

          const sData: FeatureCollection = await sRes.json();
          const cntData: FeatureCollection = await cntRes.json();

          setCities(cData);
          setStatesGeoJSON(sData);
          setCountriesGeoJSON(cntData);

          const initialTarget = selectTargetEntity({
            settings: {
              mode: "cities",
              baseMap: "esri_satellite",
              showLabels: false,
              soundEnabled: true,
              scopeCountry: "BRA",
              cityPool: "all",
              maptapOnly: false,
            },
            cities: cData,
            statesGeoJSON: sData,
            countriesGeoJSON: cntData,
          });

          if (initialTarget) {
            setTarget(initialTarget);
          }
        }
      } catch (err) {
        console.error("Failed to load map game data:", err);
      }
    }

    loadData();
  }, []);

  // Filter cities by active scope and dataset pool
  const eligibleCities = useMemo(() => {
    if (!cities || cities.length === 0) return [];
    const pool = filterCitiesByPool(
      cities,
      settings.cityPool,
      settings.maptapOnly
    );
    const scoped = filterCitiesByScope(pool, settings.scopeCountry);
    if (scoped.length === 0 && settings.scopeCountry !== "ALL") {
      return filterCitiesByScope(cities, settings.scopeCountry);
    }
    return scoped;
  }, [cities, settings.scopeCountry, settings.cityPool, settings.maptapOnly]);

  // Pick new target according to mode and region scope
  const pickNewTarget = useCallback(
    (forcedCity?: CityItem, overrideSettings?: TrainingSettings) => {
      setGuessResult(null);
      const activeSettings = overrideSettings ?? settings;
      const next = selectTargetEntity({
        forcedCity,
        settings: activeSettings,
        cities,
        statesGeoJSON,
        countriesGeoJSON,
        currentTargetId: target?.id,
      });
      if (next) {
        setTarget(next);
      }
    },
    [cities, countriesGeoJSON, statesGeoJSON, settings, target?.id]
  );

  // Keyboard shortcut: Space or Enter skips or advances to next target
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (
        e.target instanceof HTMLInputElement ||
        e.target instanceof HTMLTextAreaElement
      ) {
        return;
      }
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        pickNewTarget();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [pickNewTarget]);

  const handleUpdateSettings = useCallback(
    (newVals: Partial<TrainingSettings>) => {
      const nextSettings = { ...settings, ...newVals };
      setSettings(nextSettings);

      if (
        newVals.mode !== undefined ||
        newVals.scopeCountry !== undefined ||
        newVals.cityPool !== undefined ||
        newVals.maptapOnly !== undefined
      ) {
        pickNewTarget(undefined, nextSettings);
      }
    },
    [settings, pickNewTarget]
  );

  const handleFlyToRegion = useCallback(
    (center: [number, number], zoom: number) => {
      if (mapRef.current) {
        mapRef.current.flyTo({ center, zoom });
      }
    },
    []
  );

  // Find which region (state or country) a coordinate belongs to
  const detectClickedRegion = useCallback(
    (
      coords: [number, number]
    ): {
      name: string;
      code: string;
      countryName: string;
      countryCode: string;
      type: "state" | "country";
      feature: Feature;
    } | null => {
      // 1. Test subnational regions (Brazil, USA, Germany, France, etc.)
      if (statesGeoJSON) {
        for (const feature of statesGeoJSON.features) {
          if (
            feature.geometry &&
            isPointInsideGeometry(coords, feature.geometry as Geometry)
          ) {
            const props = feature.properties as StatePolygonProperties;
            return {
              name: props.state_name || props.name,
              code: props.state_code,
              countryName: props.country || "",
              countryCode: props.country_code || "",
              type: "state",
              feature,
            };
          }
        }
      }

      // 2. Fallback to countries
      if (countriesGeoJSON) {
        for (const feature of countriesGeoJSON.features) {
          if (
            feature.geometry &&
            isPointInsideGeometry(coords, feature.geometry as Geometry)
          ) {
            const props = feature.properties as CountryPolygonProperties;
            return {
              name: props.name,
              code: props.code,
              countryName: props.name,
              countryCode: props.code,
              type: "country",
              feature,
            };
          }
        }
      }

      return null;
    },
    [statesGeoJSON, countriesGeoJSON]
  );

  // GeoJSON features for Highlighting Target Region (Green)
  const targetRegionGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (!target) return null;

    // 1. Subnational region target (Mode = States)
    if (target.type === "state" && target.country_code && statesGeoJSON) {
      const targetCountry = target.country_code.toUpperCase();
      const targetStateCode = target.state_code?.toUpperCase();
      const targetStateName = (target.state || target.name)?.toLowerCase();

      const match = statesGeoJSON.features.find((f) => {
        const featCountry = (f.properties?.country_code || "").toUpperCase();
        if (featCountry !== targetCountry) return false;

        const featStateCode = (f.properties?.state_code || "").toUpperCase();
        const featName = (f.properties?.name || "").toLowerCase();
        const featStateName = (f.properties?.state_name || "").toLowerCase();

        if (targetStateCode && featStateCode === targetStateCode) return true;
        if (
          targetStateName &&
          (featName === targetStateName || featStateName === targetStateName)
        )
          return true;
        return false;
      });

      if (match) {
        return {
          type: "FeatureCollection",
          features: [match],
        };
      }
    }

    // 2. City target: highlight the specific state/subdivision if available!
    if (target.type === "city" && target.country_code && statesGeoJSON) {
      const targetCountry = target.country_code.toUpperCase();
      const targetStateCode = target.state_code?.toUpperCase();
      const targetStateName = target.state?.toLowerCase();

      // First try matching by state_code / state_name
      let match = statesGeoJSON.features.find((f) => {
        const featCountry = (f.properties?.country_code || "").toUpperCase();
        if (featCountry !== targetCountry) return false;

        const featStateCode = (f.properties?.state_code || "").toUpperCase();
        const featName = (f.properties?.name || "").toLowerCase();
        const featStateName = (f.properties?.state_name || "").toLowerCase();

        if (targetStateCode && featStateCode === targetStateCode) return true;
        if (
          targetStateName &&
          (featName === targetStateName || featStateName === targetStateName)
        )
          return true;
        return false;
      });

      // Second try: Spatial Point-in-Polygon check if not found by name
      if (!match && target.lng != null && target.lat != null) {
        match = statesGeoJSON.features.find((f) => {
          const featCountry = (f.properties?.country_code || "").toUpperCase();
          if (featCountry !== targetCountry) return false;
          return (
            f.geometry &&
            isPointInsideGeometry(
              [target.lng, target.lat],
              f.geometry as Geometry
            )
          );
        });
      }

      if (match) {
        return {
          type: "FeatureCollection",
          features: [match],
        };
      }
    }

    // 3. Fallback: highlight the country polygon
    if (countriesGeoJSON && target.country_code) {
      const match = countriesGeoJSON.features.find(
        (f) =>
          f.properties?.code?.toUpperCase() ===
          target.country_code.toUpperCase()
      );
      if (match) {
        return {
          type: "FeatureCollection",
          features: [match],
        };
      }
    }

    return null;
  }, [statesGeoJSON, countriesGeoJSON, target]);

  // GeoJSON features for Highlighting Wrong Clicked Region (Red)
  const clickedWrongRegionGeoJSON = useMemo<FeatureCollection | null>(() => {
    if (
      !guessResult ||
      guessResult.isCorrectRegion ||
      !guessResult.clickedRegionCode
    ) {
      return null;
    }

    if (guessResult.clickedRegionType === "state" && statesGeoJSON) {
      const match = statesGeoJSON.features.find(
        (f) =>
          (!guessResult.clickedRegionCountry ||
            f.properties?.country?.toLowerCase() ===
              guessResult.clickedRegionCountry.toLowerCase() ||
            f.properties?.country_code?.toUpperCase() ===
              guessResult.clickedRegionCountry.toUpperCase()) &&
          f.properties?.state_code?.toUpperCase() ===
            guessResult.clickedRegionCode?.toUpperCase()
      );
      if (match) {
        return {
          type: "FeatureCollection",
          features: [match],
        };
      }
    }

    if (countriesGeoJSON) {
      const match = countriesGeoJSON.features.find(
        (f) =>
          f.properties?.code?.toUpperCase() ===
          guessResult.clickedRegionCode?.toUpperCase()
      );
      if (match) {
        return {
          type: "FeatureCollection",
          features: [match],
        };
      }
    }

    return null;
  }, [statesGeoJSON, countriesGeoJSON, guessResult]);

  // Line connecting guess to actual target
  const lineGeoJSON = useMemo<Feature | null>(() => {
    if (!guessResult) return null;
    return createLineStringGeoJSON(
      guessResult.guessCoords,
      guessResult.targetCoords
    );
  }, [guessResult]);

  // Map Click handler (Player makes a guess)
  const handleMapClick = useCallback(
    (e: MapLayerMouseEvent) => {
      if (!target || guessResult !== null) return;

      const guessLng = e.lngLat.lng;
      const guessLat = e.lngLat.lat;

      const clickedRegion = detectClickedRegion([guessLng, guessLat]);

      let isDirectHit = false;
      let distance = 0;
      let roundScore = 0;

      // MODE 1: STATE / REGION TRAINING
      if (target.type === "state") {
        isDirectHit =
          clickedRegion !== null &&
          clickedRegion.type === "state" &&
          clickedRegion.countryCode.toUpperCase() === target.country_code.toUpperCase() &&
          ((target.state_code &&
            clickedRegion.code.toUpperCase() === target.state_code.toUpperCase()) ||
            clickedRegion.name.toLowerCase() === target.name.toLowerCase());

        distance = isDirectHit
          ? 0
          : calculateDistanceKm(guessLat, guessLng, target.lat, target.lng);
        roundScore = isDirectHit ? 1000 : calculateScore(distance);
      } else if (target.type === "country") {
        isDirectHit =
          clickedRegion !== null &&
          clickedRegion.code.toUpperCase() === target.country_code.toUpperCase();

        distance = isDirectHit
          ? 0
          : calculateDistanceKm(guessLat, guessLng, target.lat, target.lng);
        roundScore = isDirectHit ? 1000 : calculateScore(distance);
      } else {
        // MODE 2: CITY TRAINING
        distance = calculateDistanceKm(guessLat, guessLng, target.lat, target.lng);
        roundScore = calculateScore(distance);

        let regionMatch = false;
        if (clickedRegion !== null) {
          const targetCountry = (target.country_code || "").toUpperCase();
          const targetStateCode = target.state_code?.toUpperCase();
          const targetStateName = target.state?.toLowerCase();

          // Check if this country has subnational states in statesGeoJSON
          const hasStates = Boolean(
            statesGeoJSON?.features.some(
              (f) => f.properties?.country_code?.toUpperCase() === targetCountry
            )
          );

          if (hasStates) {
            // Must match the exact state or province
            regionMatch = Boolean(
              clickedRegion.type === "state" &&
              clickedRegion.countryCode.toUpperCase() === targetCountry &&
              ((targetStateCode &&
                clickedRegion.code.toUpperCase() === targetStateCode) ||
                (targetStateName &&
                  clickedRegion.name.toLowerCase() === targetStateName))
            );
          } else {
            // Country without subnational borders: matching country is sufficient
            regionMatch = clickedRegion.code.toUpperCase() === targetCountry;
          }
        }

        isDirectHit = regionMatch || distance <= 50;
      }

      // Tactile Web Audio feedback
      if (isDirectHit) {
        soundEffects.playSuccess();
      } else if (distance <= 250) {
        soundEffects.playClose();
      } else {
        soundEffects.playMiss();
      }

      const result: GuessResult = {
        guessCoords: [guessLng, guessLat],
        targetCoords: [target.lng, target.lat],
        distanceKm: distance,
        score: roundScore,
        clickedRegionName: clickedRegion?.name,
        clickedRegionCode: clickedRegion?.code,
        clickedRegionCountry: clickedRegion?.countryName,
        clickedRegionType: clickedRegion?.type,
        targetRegionName: target.name,
        targetRegionCode: target.state_code || target.country_code,
        isCorrectRegion: isDirectHit,
      };

      setGuessResult(result);
      setScore((prev) => prev + roundScore);
      setStreak((prev) => (result.isCorrectRegion ? prev + 1 : 0));
    },
    [target, guessResult, detectClickedRegion, statesGeoJSON]
  );

  // Stable MapLibre style specification for raster tiles and labels
  const mapStyleSpec = useMemo(() => {
    return buildUnifiedMapLibreStyle(settings);
  }, [settings]);

  return (
    <div className="relative h-screen w-screen overflow-hidden select-none bg-slate-950">
      {/* Unified Top Game Panel (Tamanho Fixo e Estável - Sem Jitter) */}
      <UnifiedGamePanel
        target={target}
        settings={settings}
        score={score}
        streak={streak}
        guessResult={guessResult}
        cities={cities}
        statesGeoJSON={statesGeoJSON}
        onUpdateSettings={handleUpdateSettings}
        onFlyToRegion={handleFlyToRegion}
        onOpenCatalog={() => setCatalogOpen(true)}
      />

      {/* Main MapLibre Canvas */}
      <Map
        ref={mapRef}
        {...viewState}
        maxPitch={85}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        onClick={handleMapClick}
        mapLib={maplibregl}
        mapStyle={mapStyleSpec}
        style={{ width: "100%", height: "100%" }}
        cursor={guessResult ? "grab" : "crosshair"}
      >
        {/* 1. Highlight da Região Alvo (Outline Nítido + Preenchimento Quase 100% Transparente) */}
        {guessResult && targetRegionGeoJSON && (
          <Source id="target-region-source" type="geojson" data={targetRegionGeoJSON}>
            <Layer
              id="target-region-fill"
              type="fill"
              paint={{
                "fill-color": "#10b981",
                "fill-opacity": 0.08,
              }}
            />
            <Layer
              id="target-region-line"
              type="line"
              paint={{
                "line-color": "#10b981",
                "line-width": 2.4,
                "line-opacity": 0.85,
              }}
            />
          </Source>
        )}

        {/* 2. Highlight da Região Errada Clicada (Outline Nítido + Preenchimento Quase 100% Transparente) */}
        {guessResult && clickedWrongRegionGeoJSON && (
          <Source id="wrong-region-source" type="geojson" data={clickedWrongRegionGeoJSON}>
            <Layer
              id="wrong-region-fill"
              type="fill"
              paint={{
                "fill-color": "#f43f5e",
                "fill-opacity": 0.08,
              }}
            />
            <Layer
              id="wrong-region-line"
              type="line"
              paint={{
                "line-color": "#f43f5e",
                "line-width": 2.4,
                "line-opacity": 0.85,
              }}
            />
          </Source>
        )}

        {/* 3. Linha conectando chute ao alvo */}
        {guessResult && lineGeoJSON && (
          <Source id="guess-line-source" type="geojson" data={lineGeoJSON}>
            <Layer
              id="guess-line-layer"
              type="line"
              paint={{
                "line-color": "#f59e0b",
                "line-width": 3.0,
                "line-dasharray": [2, 2],
              }}
            />
          </Source>
        )}

        {/* 4. Guess Marker with Clicked Region Tag */}
        {guessResult && (
          <Marker
            longitude={guessResult.guessCoords[0]}
            latitude={guessResult.guessCoords[1]}
            anchor="bottom"
          >
            <div className="flex flex-col items-center">
              {!guessResult.isCorrectRegion && (
                <div className="mb-1 flex items-center gap-1 rounded-full bg-rose-600/95 px-2 py-0.5 text-[10px] font-bold text-white shadow-xl border border-white whitespace-nowrap">
                  <span>
                    {guessResult.clickedRegionName
                      ? guessResult.clickedRegionCountry &&
                        guessResult.clickedRegionName !==
                          guessResult.clickedRegionCountry
                        ? `${guessResult.clickedRegionName}, ${guessResult.clickedRegionCountry}`
                        : guessResult.clickedRegionName
                      : "Outside area"}
                  </span>
                </div>
              )}
              <div className="relative flex items-center justify-center">
                <span className="absolute size-8 rounded-full bg-rose-500/30 animate-ping" />
                <div className="size-6 rounded-full bg-rose-600 border-2 border-white shadow-lg flex items-center justify-center text-white">
                  <Crosshair className="size-3.5" />
                </div>
              </div>
            </div>
          </Marker>
        )}

        {/* 5. Correct Target Marker (Revealed Post-Guess with Country) */}
        {guessResult && target && (
          <Marker
            longitude={target.lng}
            latitude={target.lat}
            anchor="bottom"
          >
            <div className="flex flex-col items-center">
              <div className="flex items-center gap-1 rounded-full bg-emerald-600 px-2.5 py-0.5 text-[10px] font-bold text-white shadow-xl border border-white whitespace-nowrap">
                <MapPin className="size-2.5" />
                <span>
                  {target.type === "state"
                    ? `${target.name}, ${target.country}`
                    : target.country && target.name !== target.country
                    ? `${target.name}, ${target.country}`
                    : target.name}
                </span>
              </div>
              <div className="size-3 rotate-45 bg-emerald-600 border-r border-b border-white -mt-1.5" />
            </div>
          </Marker>
        )}
      </Map>

      {/* Modern Floating Bottom Controls Dock (Tamanho Rigorosamente Fixo) */}
      <BottomControlsDock
        settings={settings}
        onUpdateSettings={handleUpdateSettings}
        onSkipTarget={() => pickNewTarget()}
        onNextTarget={() => pickNewTarget()}
        hasGuessed={guessResult !== null}
      />

      {/* Cities Catalog Dialog */}
      <CitiesCatalogDialog
        open={catalogOpen}
        onOpenChange={setCatalogOpen}
        cities={eligibleCities}
        onSelectCity={(city) => {
          pickNewTarget(city);
          setCatalogOpen(false);
          if (mapRef.current) {
            mapRef.current.flyTo({ center: [city.lng, city.lat], zoom: 5 });
          }
        }}
      />
    </div>
  );
}
