"use client";

import { useMemo } from "react";
import type { CityItem, GuessResult, TargetEntity, TrainingSettings } from "@/types/map";
import type { FeatureCollection } from "geojson";
import { RegionSelector } from "./region-select-dialog";
import { CityPoolSelector } from "./city-pool-selector";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  CheckCircle2,
  Flame,
  MapPin,
  Map as MapIcon,
  Search,
  Trophy,
  Volume2,
  VolumeX,
  XCircle,
} from "lucide-react";

interface UnifiedGamePanelProps {
  target: TargetEntity | null;
  settings: TrainingSettings;
  score: number;
  streak: number;
  guessResult: GuessResult | null;
  cities?: CityItem[];
  statesGeoJSON?: FeatureCollection | null;
  onUpdateSettings: (newVals: Partial<TrainingSettings>) => void;
  onFlyToRegion?: (center: [number, number], zoom: number) => void;
  onOpenCatalog: () => void;
}

export function UnifiedGamePanel({
  target,
  settings,
  score,
  streak,
  guessResult,
  cities = [],
  statesGeoJSON = null,
  onUpdateSettings,
  onFlyToRegion,
  onOpenCatalog,
}: UnifiedGamePanelProps) {
  const isCitiesMode = settings.mode === "cities";

  const clickedLocationText = useMemo(() => {
    if (!guessResult || !guessResult.clickedRegionName) return "Outside area";
    if (
      guessResult.clickedRegionCountry &&
      guessResult.clickedRegionName !== guessResult.clickedRegionCountry
    ) {
      return `${guessResult.clickedRegionName}, ${guessResult.clickedRegionCountry}`;
    }
    return guessResult.clickedRegionName;
  }, [guessResult]);

  if (!target) return null;

  return (
    <div className="pointer-events-none fixed top-3 left-3 right-3 z-20 flex justify-center max-w-lg mx-auto">
      <div className="pointer-events-auto w-full min-h-[144px] h-auto rounded-2xl border border-white/20 bg-background/95 p-3 shadow-2xl backdrop-blur-xl flex flex-col justify-between select-none">
        {/* 1. Top Bar: Region Selector, City Pool Dropdown, Mode, Score, Audio & Search */}
        <div className="flex items-center justify-between gap-1.5 pb-2 border-b border-border/50">
          {/* Left: Region & City Pool Selectors */}
          <div className="flex items-center gap-1.5 min-w-0">
            <RegionSelector
              currentScope={settings.scopeCountry}
              mode={settings.mode}
              cityPool={settings.cityPool}
              maptapOnly={settings.maptapOnly}
              cities={cities}
              statesGeoJSON={statesGeoJSON}
              onSelectScope={(scope, center, zoom) => {
                onUpdateSettings({ scopeCountry: scope });
                if (center && zoom && onFlyToRegion) {
                  onFlyToRegion(center, zoom);
                }
              }}
            />

            {/* City Pool Selector Dropdown (visible in Cities mode) */}
            <CityPoolSelector
              currentPool={settings.cityPool}
              onSelectPool={(pool) => onUpdateSettings({ cityPool: pool })}
              maptapOnly={settings.maptapOnly}
              onToggleMaptapOnly={(maptapOnly) => onUpdateSettings({ maptapOnly })}
              cities={cities}
              scopeCountry={settings.scopeCountry}
              disabled={!isCitiesMode}
            />
          </div>

          {/* Right Group: Game Mode Switch, Score, Audio & Search */}
          <div className="flex items-center gap-1.5 shrink-0">
            {/* Game Mode Switch: Cities vs States */}
            <div className="flex items-center bg-muted/70 p-0.5 rounded-xl border border-border/50 shrink-0">
              <Button
                variant={isCitiesMode ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onUpdateSettings({ mode: "cities" })}
                className={`h-6 w-7 p-0 rounded-lg transition-all ${
                  isCitiesMode
                    ? "bg-background shadow-xs text-foreground font-bold"
                    : "text-muted-foreground"
                }`}
                title="Cities Mode"
              >
                <MapPin className="size-3.5" />
              </Button>
              <Button
                variant={!isCitiesMode ? "secondary" : "ghost"}
                size="sm"
                onClick={() => onUpdateSettings({ mode: "states" })}
                className={`h-6 w-7 p-0 rounded-lg transition-all ${
                  !isCitiesMode
                    ? "bg-background shadow-xs text-foreground font-bold"
                    : "text-muted-foreground"
                }`}
                title="States & Regions Mode"
              >
                <MapIcon className="size-3.5" />
              </Button>
            </div>

            {/* Score & Streak */}
            <div className="flex items-center gap-1.5 px-0.5 shrink-0">
              <div className="flex items-center gap-1 text-xs font-bold text-foreground">
                <Trophy className="size-3.5 text-amber-500" />
                <span>{score.toLocaleString("en-US")}</span>
              </div>
              {streak > 1 && (
                <div className="flex items-center gap-0.5 text-xs font-bold text-orange-500 animate-bounce">
                  <Flame className="size-3.5 fill-orange-500" />
                  <span>{streak}x</span>
                </div>
              )}
            </div>

            {/* Audio Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() =>
                onUpdateSettings({ soundEnabled: !settings.soundEnabled })
              }
              className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground shrink-0 flex items-center justify-center"
              title={settings.soundEnabled ? "Mute Audio" : "Unmute Audio"}
            >
              {settings.soundEnabled ? (
                <Volume2 className="size-3.5 text-foreground" />
              ) : (
                <VolumeX className="size-3.5 text-muted-foreground/60" />
              )}
            </Button>

            {/* Cities Search Button */}
            <Button
              variant="ghost"
              size="sm"
              onClick={onOpenCatalog}
              className="h-7 w-7 p-0 rounded-lg text-muted-foreground hover:text-foreground shrink-0 flex items-center justify-center"
              title="Cities Catalog"
            >
              <Search className="size-3.5" />
            </Button>
          </div>
        </div>

        {/* 2. Target Display: City • Region • Country */}
        <div className="py-0.5 text-center truncate">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-foreground truncate leading-tight">
            {target.displayName}
          </h2>
          {target.type === "city" && Boolean(target.population) && (
            <div className="text-[11px] font-medium text-muted-foreground/80 tracking-tight mt-0.5 flex items-center justify-center gap-1 select-none">
              <span className="text-muted-foreground/60">👥</span>
              <span>
                {(target.population || 0) >= 1_000_000
                  ? `${((target.population || 0) / 1_000_000).toFixed(1)}M hab. (${(target.population || 0).toLocaleString("pt-BR")})`
                  : `${(target.population || 0).toLocaleString("pt-BR")} hab.`}
              </span>
            </div>
          )}
        </div>

        {/* 3. Feedback Row: Distance and Clicked Region */}
        <div className="h-10 flex items-center justify-between border-t border-border/40 pt-1">
          {guessResult ? (
            <div className="w-full flex items-center justify-between text-xs animate-in fade-in duration-100">
              <div className="flex items-center gap-1.5 min-w-0 pr-2">
                {guessResult.isCorrectRegion ? (
                  <CheckCircle2 className="size-4 text-emerald-500 shrink-0" />
                ) : (
                  <XCircle className="size-4 text-rose-500 shrink-0" />
                )}
                <span className="font-black text-foreground shrink-0">
                  {guessResult.distanceKm.toLocaleString("en-US")} km
                </span>
                <span
                  className="text-muted-foreground truncate text-[11px]"
                  title={clickedLocationText}
                >
                  • {clickedLocationText}
                </span>
              </div>

              <Badge
                variant={guessResult.score >= 800 ? "default" : "secondary"}
                className="text-[10px] px-2 py-0.5 font-bold shrink-0"
              >
                +{guessResult.score} pts
              </Badge>
            </div>
          ) : (
            <div className="w-full flex items-center justify-center text-[11px] text-muted-foreground/75 font-medium">
              <span>Tap the map to guess the location</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
