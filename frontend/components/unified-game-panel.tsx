"use client";

import { useMemo } from "react";
import type { CityItem, GuessResult, TargetEntity, TrainingSettings } from "@/types/map";
import type { FeatureCollection } from "geojson";
import { RegionSelector } from "./region-select-dialog";
import { CityPoolSelector } from "./city-pool-selector";
import { Button } from "@/components/ui/button";
import {
  CheckCircle2,
  Crosshair,
  Flame,
  MapPin,
  Map as MapIcon,
  Navigation,
  Search,
  Trophy,
  Volume2,
  VolumeX,
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
  onOpenStats?: () => void;
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
  onOpenStats,
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
    <div className="pointer-events-none fixed top-3 left-3 right-3 z-20 flex justify-center max-w-xl mx-auto">
      <div className="pointer-events-auto w-full rounded-2xl border border-white/10 bg-slate-950/85 p-2.5 sm:p-3 shadow-[0_16px_40px_-8px_rgba(0,0,0,0.8)] backdrop-blur-2xl flex flex-col gap-2 select-none transition-all duration-200">
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

            {/* Score & Streak (Click Trophy for Dashboard & History) */}
            <div className="flex items-center gap-1.5 px-0.5 shrink-0">
              <Button
                variant="ghost"
                size="sm"
                onClick={onOpenStats}
                className="h-7 px-2 rounded-lg flex items-center gap-1 text-xs font-bold text-foreground hover:bg-muted/60 transition-colors"
                title="Ver Dashboard de Desempenho e Histórico de Palpites"
              >
                <Trophy className="size-3.5 text-amber-500 shrink-0" />
                <span>{score.toLocaleString("pt-BR")}</span>
              </Button>
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

        {/* 2. Target Display: City • Region • Country & Metadata */}
        <div className="py-0.5 text-center px-1">
          <h2 className="text-base sm:text-lg font-black tracking-tight text-foreground leading-snug break-words">
            {target.displayName}
          </h2>
          <div className="text-[11px] font-medium text-muted-foreground/80 tracking-tight mt-0.5 flex flex-wrap items-center justify-center gap-1.5 select-none">
            {target.type === "city" && Boolean(target.population) && (
              <span className="flex items-center gap-1">
                <span className="text-muted-foreground/60">👥</span>
                <span>
                  {(target.population || 0) >= 1_000_000
                    ? `${((target.population || 0) / 1_000_000).toFixed(1)}M hab. (${(target.population || 0).toLocaleString("pt-BR")})`
                    : `${(target.population || 0).toLocaleString("pt-BR")} hab.`}
                </span>
              </span>
            )}
            {target.is_country_capital && (
              <span className="px-1.5 py-0.2 rounded-md bg-amber-500/15 text-amber-700 dark:text-amber-300 font-semibold text-[10px] border border-amber-500/30">
                🏛️ Capital
              </span>
            )}
            {!target.is_country_capital && target.is_state_capital && (
              <span className="px-1.5 py-0.2 rounded-md bg-blue-500/15 text-blue-700 dark:text-blue-300 font-semibold text-[10px] border border-blue-500/30">
                🏢 State Capital
              </span>
            )}
          </div>
        </div>

        {/* 3. Feedback / Action Strip (Distance, Guess, Score & Advance) */}
        {guessResult ? (
          <div
            className={`w-full rounded-xl p-2 px-3 border transition-all animate-in fade-in slide-in-from-top-1 duration-150 flex items-center justify-between gap-2.5 ${
              guessResult.score >= 800
                ? "bg-emerald-500/10 border-emerald-500/30"
                : guessResult.score >= 500
                ? "bg-amber-500/10 border-amber-500/30"
                : "bg-rose-500/10 border-rose-500/30"
            }`}
          >
            {/* Left: Distance & Clicked Place */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div
                className={`size-8 rounded-xl flex items-center justify-center shrink-0 shadow-xs ${
                  guessResult.score >= 800
                    ? "bg-emerald-500 text-white"
                    : guessResult.score >= 500
                    ? "bg-amber-500 text-white"
                    : "bg-rose-500 text-white"
                }`}
              >
                {guessResult.isCorrectRegion ? (
                  <CheckCircle2 className="size-4.5" />
                ) : (
                  <Navigation className="size-4 rotate-45" />
                )}
              </div>

              <div className="flex flex-col min-w-0">
                <div className="flex items-baseline gap-1.5 leading-none">
                  <span className="font-black text-sm tracking-tight text-foreground">
                    {guessResult.distanceKm < 1
                      ? "< 1 km"
                      : `${guessResult.distanceKm.toLocaleString("en-US")} km`}
                  </span>
                  <span
                    className={`text-[10px] font-bold uppercase tracking-wider ${
                      guessResult.score >= 800
                        ? "text-emerald-600 dark:text-emerald-400"
                        : guessResult.score >= 500
                        ? "text-amber-600 dark:text-amber-400"
                        : "text-rose-600 dark:text-rose-400"
                    }`}
                  >
                    {guessResult.score >= 950
                      ? "Bullseye!"
                      : guessResult.score >= 800
                      ? "Excellent!"
                      : guessResult.score >= 500
                      ? "Very Close"
                      : guessResult.score >= 250
                      ? "Good Try"
                      : "Off Target"}
                  </span>
                </div>
                <div className="text-[11px] text-muted-foreground mt-0.5 break-words">
                  <span className="opacity-70 font-medium">Clicked:</span>{" "}
                  <span className="font-semibold text-foreground/90">
                    {clickedLocationText}
                  </span>
                </div>
              </div>
            </div>

            {/* Right: Points Pill */}
            <div className="flex items-center shrink-0">
              <div
                className={`px-2.5 py-1 rounded-lg font-mono font-bold text-xs flex items-center gap-1 shadow-xs ${
                  guessResult.score >= 800
                    ? "bg-emerald-500 text-white"
                    : guessResult.score >= 500
                    ? "bg-amber-500 text-white"
                    : "bg-muted text-foreground border border-border/60"
                }`}
              >
                <span>+{guessResult.score}</span>
                <span className="text-[10px] font-normal opacity-85">pts</span>
              </div>
            </div>
          </div>
        ) : (
          /* Idle Hint Bar: Compact, clean, zero dead space */
          <div className="w-full py-1.5 px-3 rounded-xl bg-muted/40 border border-border/40 flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1.5 min-w-0">
              <Crosshair className="size-3.5 text-primary/70 animate-pulse shrink-0" />
              <span className="text-[11px] font-medium truncate">
                Tap anywhere on the map to guess
              </span>
            </div>
            <span className="text-[10px] font-mono text-muted-foreground/60 shrink-0 hidden sm:inline">
              space to skip
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
