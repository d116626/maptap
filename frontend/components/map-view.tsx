"use client";

import { useEffect, useState } from "react";
import Map, {
  FullscreenControl,
  Marker,
  NavigationControl,
  Popup,
  type ViewStateChangeEvent,
} from "react-map-gl/maplibre";
import * as maplibregl from "maplibre-gl";
import { BASEMAP_STYLES } from "@/lib/map-styles";
import type { BaseMapId, PointFeature, PointsCollection } from "@/types/map";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Layers, MapPin, Star } from "lucide-react";

const INITIAL_VIEW_STATE = {
  longitude: -46.6333,
  latitude: -23.5505,
  zoom: 12,
};

export function MapView() {
  const [activeBaseMap, setActiveBaseMap] = useState<BaseMapId>("osm");
  const [points, setPoints] = useState<PointFeature[]>([]);
  const [selectedPoint, setSelectedPoint] = useState<PointFeature | null>(null);
  const [loading, setLoading] = useState(true);
  const [viewState, setViewState] = useState(INITIAL_VIEW_STATE);

  useEffect(() => {
    const basePath =
      process.env.NEXT_PUBLIC_BASE_PATH ??
      (process.env.NODE_ENV === "production" ? "/maptap" : "");
    const url = `${basePath}/data/points.json`;

    fetch(url)
      .then((res) => {
        if (!res.ok) {
          throw new Error(`Failed to load points: ${res.statusText}`);
        }
        return res.json() as Promise<PointsCollection>;
      })
      .then((data) => {
        if (data.features) {
          setPoints(data.features);
        }
      })
      .catch((err: unknown) => {
        console.error("Error loading map points:", err);
      })
      .finally(() => {
        setLoading(false);
      });
  }, []);

  return (
    <div className="relative h-screen w-screen overflow-hidden">
      {/* Top Floating Control Bar */}
      <header className="pointer-events-none absolute top-4 left-4 right-4 z-10 flex flex-wrap items-center justify-between gap-3">
        <div className="pointer-events-auto flex items-center gap-3 rounded-xl border border-border bg-background/95 px-4 py-2.5 shadow-lg backdrop-blur-md">
          <div className="flex items-center gap-2">
            <span className="flex size-7 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold">
              M
            </span>
            <div>
              <h1 className="text-sm font-semibold tracking-tight text-foreground">MapTap</h1>
              <p className="text-xs text-muted-foreground">MapLibre + Next.js</p>
            </div>
          </div>
          <Badge variant="secondary" className="text-xs">
            {points.length} pontos
          </Badge>
        </div>

        {/* Basemap Switcher */}
        <div className="pointer-events-auto flex items-center gap-1.5 rounded-xl border border-border bg-background/95 p-1.5 shadow-lg backdrop-blur-md">
          <Layers className="size-4 text-muted-foreground ml-2 mr-1" />
          {(Object.keys(BASEMAP_STYLES) as BaseMapId[]).map((key) => {
            const basemap = BASEMAP_STYLES[key];
            const isActive = activeBaseMap === key;
            return (
              <Button
                key={key}
                size="sm"
                variant={isActive ? "default" : "ghost"}
                className="h-8 text-xs font-medium"
                onClick={() => setActiveBaseMap(key)}
              >
                {basemap.name}
              </Button>
            );
          })}
        </div>
      </header>

      {/* Map Engine */}
      <Map
        {...viewState}
        onMove={(evt: ViewStateChangeEvent) => setViewState(evt.viewState)}
        mapLib={maplibregl}
        mapStyle={BASEMAP_STYLES[activeBaseMap].style}
        style={{ width: "100%", height: "100%" }}
      >
        <NavigationControl position="bottom-right" />
        <FullscreenControl position="bottom-right" />

        {points.map((pt) => {
          const [lng, lat] = pt.geometry.coordinates;
          const isSelected = selectedPoint?.properties.id === pt.properties.id;

          return (
            <Marker
              key={pt.properties.id}
              longitude={lng}
              latitude={lat}
              anchor="bottom"
              onClick={(e) => {
                e.originalEvent.stopPropagation();
                setSelectedPoint(pt);
              }}
            >
              <button
                type="button"
                className={`group flex items-center justify-center transition-transform hover:scale-110 focus:outline-none ${
                  isSelected ? "scale-125" : ""
                }`}
                title={pt.properties.title}
              >
                <div className="relative">
                  <div className="size-9 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-md ring-2 ring-background">
                    <MapPin className="size-5" />
                  </div>
                  <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 size-2 rotate-45 bg-primary" />
                </div>
              </button>
            </Marker>
          );
        })}

        {selectedPoint && (
          <Popup
            longitude={selectedPoint.geometry.coordinates[0]}
            latitude={selectedPoint.geometry.coordinates[1]}
            anchor="top"
            offset={14}
            onClose={() => setSelectedPoint(null)}
            closeButton={false}
            className="z-20 !p-0"
          >
            <Card className="w-64 border-none shadow-xl">
              <CardHeader className="p-3 pb-1">
                <div className="flex items-center justify-between gap-2">
                  <Badge variant="outline" className="text-xs">
                    {selectedPoint.properties.category}
                  </Badge>
                  {selectedPoint.properties.rating && (
                    <div className="flex items-center gap-1 text-xs font-semibold text-amber-500">
                      <Star className="size-3 fill-amber-500" />
                      <span>{selectedPoint.properties.rating}</span>
                    </div>
                  )}
                </div>
                <CardTitle className="text-sm font-bold mt-1">
                  {selectedPoint.properties.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="p-3 pt-1 text-xs text-muted-foreground">
                <CardDescription className="text-xs">
                  {selectedPoint.properties.description ?? "Sem descrição."}
                </CardDescription>
                <div className="mt-2 text-[10px] text-muted-foreground/70">
                  {selectedPoint.geometry.coordinates[1].toFixed(4)},{" "}
                  {selectedPoint.geometry.coordinates[0].toFixed(4)}
                </div>
              </CardContent>
            </Card>
          </Popup>
        )}
      </Map>

      {/* Loading Indicator */}
      {loading && (
        <div className="absolute bottom-6 left-6 z-10 flex items-center gap-2 rounded-lg bg-background/90 px-3 py-1.5 text-xs text-muted-foreground shadow-md backdrop-blur-sm">
          <div className="size-2 animate-ping rounded-full bg-primary" />
          <span>Carregando dados geoespaciais...</span>
        </div>
      )}
    </div>
  );
}
