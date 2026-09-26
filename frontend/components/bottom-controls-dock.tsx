"use client";

import { useState } from "react";
import type { TrainingSettings } from "@/types/map";
import { BASEMAP_OPTIONS } from "@/lib/unified-map-style";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Building2,
  Compass,
  Flag,
  Globe,
  Landmark,
  Layers,
  Mountain,
  Route,
  SkipForward,
  Trees,
  X,
} from "lucide-react";

interface BottomControlsDockProps {
  settings: TrainingSettings;
  onUpdateSettings: (newVals: Partial<TrainingSettings>) => void;
  onSkipTarget: () => void;
  onNextTarget: () => void;
  hasGuessed: boolean;
}

export function BottomControlsDock({
  settings,
  onUpdateSettings,
  onSkipTarget,
  onNextTarget,
  hasGuessed,
}: BottomControlsDockProps) {
  const [styleSelectorOpen, setStyleSelectorOpen] = useState(false);
  const [layersSelectorOpen, setLayersSelectorOpen] = useState(false);

  const activeBasemap =
    BASEMAP_OPTIONS.find((b) => b.id === settings.baseMap) ??
    BASEMAP_OPTIONS[0];

  const currentProvider = settings.overlayProvider || "mapbox";

  const isBordersActive = settings.showBorders ?? true;
  const isCountryActive = settings.showCountryNames ?? false;
  const isRoadsActive = settings.showRoads ?? false;
  const isRegionsActive =
    settings.showRegionNames ?? settings.showPlaceNames ?? false;
  const isCitiesActive =
    settings.showCityNames ?? settings.showPlaceNames ?? false;
  const isPhysicalActive = settings.showPhysical ?? false;

  const activeLayersCount =
    currentProvider === "esri"
      ? (isRoadsActive ? 1 : 0) + (isBordersActive ? 1 : 0)
      : (isBordersActive ? 1 : 0) +
        (isCountryActive ? 1 : 0) +
        (isRegionsActive ? 1 : 0) +
        (isCitiesActive ? 1 : 0) +
        (isRoadsActive ? 1 : 0) +
        (isPhysicalActive ? 1 : 0);

  const toggleLayer = (
    key:
      | "showBorders"
      | "showCountryNames"
      | "showRoads"
      | "showRegionNames"
      | "showCityNames"
      | "showPhysical"
  ) => {
    const nextBorders = key === "showBorders" ? !isBordersActive : isBordersActive;
    const nextCountry = key === "showCountryNames" ? !isCountryActive : isCountryActive;
    const nextRoads = key === "showRoads" ? !isRoadsActive : isRoadsActive;
    const nextRegions = key === "showRegionNames" ? !isRegionsActive : isRegionsActive;
    const nextCities = key === "showCityNames" ? !isCitiesActive : isCitiesActive;
    const nextPhysical = key === "showPhysical" ? !isPhysicalActive : isPhysicalActive;

    onUpdateSettings({
      [key]: !settings[key],
      showLabels:
        currentProvider === "esri"
          ? nextBorders || nextRoads
          : nextBorders ||
            nextCountry ||
            nextRegions ||
            nextCities ||
            nextRoads ||
            nextPhysical,
    });
  };

  return (
    <>
      {/* Floating Bottom Dock Bar */}
      <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-20 flex justify-center px-3 safe-area-bottom">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/10 bg-slate-950/85 p-1.5 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8)] backdrop-blur-2xl">
          {/* 1. Base Map Imagery */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setStyleSelectorOpen(!styleSelectorOpen);
              setLayersSelectorOpen(false);
            }}
            className="h-10 w-10 p-0 rounded-xl hover:bg-accent/80 transition-all shrink-0 flex items-center justify-center relative"
            title={`Base Map: ${activeBasemap.name}`}
          >
            <span className="text-lg leading-none">{activeBasemap.icon}</span>
          </Button>

          <div className="h-5 w-px bg-border/60 shrink-0" />

          {/* 2. Map Layers & Overlays Options Selector */}
          <div className="relative">
            <Button
              variant={activeLayersCount > 0 ? "default" : "ghost"}
              size="sm"
              onClick={() => {
                setLayersSelectorOpen(!layersSelectorOpen);
                setStyleSelectorOpen(false);
              }}
              className={`h-10 w-10 p-0 rounded-xl transition-all shrink-0 flex items-center justify-center relative ${
                activeLayersCount > 0
                  ? "bg-primary text-primary-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
              title={`Map Overlays (${activeLayersCount} active)`}
            >
              <Layers className="size-4" />
              {activeLayersCount > 0 && (
                <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-emerald-400" />
              )}
            </Button>

            {/* Janelinha flutuante com toggles logo acima do botão */}
            {layersSelectorOpen && (
              <>
                {/* Backdrop invisível para fechar ao clicar fora */}
                <div
                  className="fixed inset-0 z-40"
                  onClick={() => setLayersSelectorOpen(false)}
                />

                <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 w-52 rounded-2xl border border-white/10 bg-slate-950/95 p-2 shadow-2xl backdrop-blur-2xl animate-in fade-in zoom-in-95 duration-150">
                  {/* Dropdown de Seleção da Fonte do Overlay */}
                  <div className="flex items-center justify-between gap-1 px-1 py-1 mb-1.5 border-b border-border/50">
                    <span className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                      Source
                    </span>
                    <select
                      value={currentProvider}
                      onChange={(e) =>
                        onUpdateSettings({
                          overlayProvider: e.target.value as "mapbox" | "esri",
                        })
                      }
                      className="text-[11px] font-medium bg-muted/80 text-foreground border border-border/60 rounded-md px-1.5 py-0.5 outline-none cursor-pointer hover:bg-muted"
                    >
                      <option value="mapbox">Mapbox Streets</option>
                      <option value="esri">Esri Reference</option>
                    </select>
                  </div>

                  {/* Toggles conforme a fonte ativa */}
                  {currentProvider === "esri" ? (
                    <div className="space-y-0.5">
                      {/* Esri Combined Places & Borders */}
                      <div
                        onClick={() => toggleLayer("showBorders")}
                        className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="size-3.5 text-sky-400" />
                          <div>
                            <p className="text-xs font-medium text-foreground leading-tight">Places & Borders</p>
                            <p className="text-[9px] text-muted-foreground leading-none">Borders, cities & labels</p>
                          </div>
                        </div>
                        <div
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            isBordersActive ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              isBordersActive ? "translate-x-3" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Esri Roads */}
                      <div
                        onClick={() => toggleLayer("showRoads")}
                        className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Route className="size-3.5 text-amber-400" />
                          <div>
                            <p className="text-xs font-medium text-foreground leading-tight">Roads</p>
                            <p className="text-[9px] text-muted-foreground leading-none">Highways & streets</p>
                          </div>
                        </div>
                        <div
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            isRoadsActive ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              isRoadsActive ? "translate-x-3" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-0.5">
                      {/* Mapbox Borders (Divisas puras, sem cidades) */}
                      <div
                        onClick={() => toggleLayer("showBorders")}
                        className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Globe className="size-3.5 text-sky-400" />
                          <span className="text-xs font-medium text-foreground">Borders</span>
                        </div>
                        <div
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            isBordersActive ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              isBordersActive ? "translate-x-3" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Mapbox Countries (Nomes dos países nativos do Mapbox) */}
                      <div
                        onClick={() => toggleLayer("showCountryNames")}
                        className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Flag className="size-3.5 text-indigo-400" />
                          <span className="text-xs font-medium text-foreground">Countries</span>
                        </div>
                        <div
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            isCountryActive ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              isCountryActive ? "translate-x-3" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Mapbox Regions (Apenas divisões regionais / estados) */}
                      <div
                        onClick={() => toggleLayer("showRegionNames")}
                        className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Landmark className="size-3.5 text-purple-400" />
                          <span className="text-xs font-medium text-foreground">Regions</span>
                        </div>
                        <div
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            isRegionsActive ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              isRegionsActive ? "translate-x-3" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Mapbox Cities / Municipalities */}
                      <div
                        onClick={() => toggleLayer("showCityNames")}
                        className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Building2 className="size-3.5 text-emerald-400" />
                          <span className="text-xs font-medium text-foreground">Cities</span>
                        </div>
                        <div
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            isCitiesActive ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              isCitiesActive ? "translate-x-3" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Mapbox Roads */}
                      <div
                        onClick={() => toggleLayer("showRoads")}
                        className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Route className="size-3.5 text-amber-400" />
                          <span className="text-xs font-medium text-foreground">Roads</span>
                        </div>
                        <div
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            isRoadsActive ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              isRoadsActive ? "translate-x-3" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>

                      {/* Mapbox Physical */}
                      <div
                        onClick={() => toggleLayer("showPhysical")}
                        className="flex items-center justify-between px-2 py-1.5 rounded-xl hover:bg-white/5 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-2">
                          <Trees className="size-3.5 text-teal-400" />
                          <span className="text-xs font-medium text-foreground">Physical</span>
                        </div>
                        <div
                          className={`relative inline-flex h-4 w-7 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out ${
                            isPhysicalActive ? "bg-primary" : "bg-muted-foreground/30"
                          }`}
                        >
                          <span
                            className={`pointer-events-none inline-block size-3 transform rounded-full bg-white shadow-sm transition duration-200 ease-in-out ${
                              isPhysicalActive ? "translate-x-3" : "translate-x-0"
                            }`}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              </>
            )}
          </div>

          <div className="h-5 w-px bg-border/60 shrink-0" />

          {/* 3. 3D Terrain Elevation Toggle */}
          <Button
            variant={settings.terrain3D ? "default" : "ghost"}
            size="sm"
            onClick={() =>
              onUpdateSettings({ terrain3D: !settings.terrain3D })
            }
            className={`h-10 w-10 p-0 rounded-xl transition-all shrink-0 flex items-center justify-center relative ${
              settings.terrain3D
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={
              settings.terrain3D
                ? "Disable 3D Terrain"
                : "Enable 3D Terrain Elevation (Mountains & Relief)"
            }
          >
            <Mountain className="size-4" />
            {settings.terrain3D && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-emerald-400" />
            )}
          </Button>

          <div className="h-5 w-px bg-border/60 shrink-0" />

          {/* 4. Skip or Next Round */}
          {hasGuessed ? (
            <Button
              onClick={onNextTarget}
              size="sm"
              className="h-10 min-w-[84px] px-3.5 rounded-xl bg-primary text-primary-foreground shadow-md animate-pulse shrink-0 flex items-center justify-center gap-1.5 font-bold text-xs transition-all hover:brightness-110 active:scale-95"
              title="Next Round (Space / Enter)"
            >
              <span>Next</span>
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkipTarget}
              className="h-10 min-w-[84px] px-3.5 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 shrink-0 flex items-center justify-center gap-1.5 font-bold text-xs transition-all active:scale-95"
              title="Skip Round (Space / Enter)"
            >
              <span>Skip</span>
              <SkipForward className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Quick Basemap Selection Overlay Dialog */}
      {styleSelectorOpen && (
        <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center p-3 bg-black/60 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-white/10 bg-slate-950/95 p-4 shadow-2xl backdrop-blur-2xl safe-area-bottom">
            <div className="flex items-center justify-between pb-3 border-b border-border mb-3">
              <div className="flex items-center gap-2">
                <Compass className="size-4 text-primary" />
                <h3 className="text-sm font-bold">Base Map Style</h3>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setStyleSelectorOpen(false)}
                className="size-7 p-0 rounded-full"
              >
                <X className="size-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 gap-2 max-h-[60vh] overflow-y-auto pr-1">
              {BASEMAP_OPTIONS.map((opt) => {
                const isSelected = settings.baseMap === opt.id;
                return (
                  <button
                    key={opt.id}
                    onClick={() => {
                      onUpdateSettings({ baseMap: opt.id });
                      setStyleSelectorOpen(false);
                    }}
                    className={`flex items-start gap-3 p-3 rounded-xl border text-left transition-all ${
                      isSelected
                        ? "border-primary bg-primary/10 shadow-sm"
                        : "border-border hover:border-primary/40 hover:bg-muted/50"
                    }`}
                  >
                    <span className="text-2xl mt-0.5">{opt.icon}</span>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-foreground">
                          {opt.name}
                        </span>
                        {isSelected && (
                          <Badge className="text-[10px] px-1.5 py-0">Active</Badge>
                        )}
                      </div>
                      <p className="text-[11px] text-muted-foreground mt-0.5 line-clamp-1">
                        {opt.description}
                      </p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
