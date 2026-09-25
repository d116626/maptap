"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Check, ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  REGION_TABS,
  ALL_REGION_OPTIONS,
  RegionItem,
} from "@/data/countries-catalog";
import type { CityItem, CityPoolMode, TrainingMode } from "@/types/map";
import type { FeatureCollection } from "geojson";

export type RegionScopeOption = RegionItem;
export const REGION_OPTIONS: RegionScopeOption[] = ALL_REGION_OPTIONS;

// Known subnational division counts and labels for supported countries
const COUNTRY_SUBDIVISIONS: Record<
  string,
  { count: number; label: string; shortLabel: string }
> = {
  BRA: { count: 27, label: "states", shortLabel: "states" },
  USA: { count: 51, label: "states", shortLabel: "states" },
  CAN: { count: 13, label: "provinces", shortLabel: "prov" },
  MEX: { count: 33, label: "states", shortLabel: "states" },
  DEU: { count: 16, label: "states", shortLabel: "states" },
  FRA: { count: 18, label: "regions", shortLabel: "reg" },
  ESP: { count: 19, label: "communities", shortLabel: "com" },
  JPN: { count: 47, label: "prefectures", shortLabel: "pref" },
  AUS: { count: 11, label: "states/terr", shortLabel: "states" },
  IND: { count: 36, label: "states/UTs", shortLabel: "states" },
  CHN: { count: 32, label: "provinces", shortLabel: "prov" },
};

const CONTINENT_COUNTRY_COUNTS: Record<string, number> = {
  SOUTH_AMERICA: 13,
  NORTH_AMERICA: 23,
  EUR: 47,
  ASIA: 48,
  AFRICA: 54,
  OCEANIA: 14,
};

// Map country code to its continent scope identifier
const COUNTRY_TO_CONTINENT: Record<string, string> = {};
REGION_TABS.forEach((tab) => {
  if (tab.id === "main") return;
  const continentScope =
    tab.id === "south_america"
      ? "SOUTH_AMERICA"
      : tab.id === "north_america"
      ? "NORTH_AMERICA"
      : tab.id === "europe"
      ? "EUR"
      : tab.id === "asia"
      ? "ASIA"
      : tab.id === "africa"
      ? "AFRICA"
      : tab.id === "oceania"
      ? "OCEANIA"
      : "";

  if (continentScope) {
    tab.items.forEach((item) => {
      COUNTRY_TO_CONTINENT[item.id] = continentScope;
    });
  }
});

interface RegionSelectorProps {
  currentScope: string;
  mode?: TrainingMode;
  cityPool?: CityPoolMode;
  maptapOnly?: boolean;
  cities?: CityItem[];
  statesGeoJSON?: FeatureCollection | null;
  onSelectScope: (
    scope: string,
    center?: [number, number],
    zoom?: number
  ) => void;
}

export function RegionSelector({
  currentScope,
  mode = "cities",
  cityPool = "all",
  maptapOnly = false,
  cities = [],
  statesGeoJSON,
  onSelectScope,
}: RegionSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeTabId, setActiveTabId] = useState<string>("main");
  const [searchQuery, setSearchQuery] = useState("");
  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  const currentOption = useMemo(() => {
    return (
      ALL_REGION_OPTIONS.find((opt) => opt.id === currentScope) ??
      ALL_REGION_OPTIONS[0]
    );
  }, [currentScope]);

  // Close when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when opening
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Dynamic counts calculation for the active city pool
  const { totalCitiesCount, countryCounts, continentCounts } = useMemo(() => {
    if (!cities || cities.length === 0) {
      return { totalCitiesCount: 0, countryCounts: {}, continentCounts: {} };
    }

    let pool = cities;
    if (maptapOnly || cityPool === "maptap") {
      pool = pool.filter((c) => c.is_maptap_base);
    }

    if (cityPool === "country_capitals") {
      pool = pool.filter((c) => Boolean(c.is_country_capital));
    } else if (cityPool === "state_capitals") {
      pool = pool.filter((c) => Boolean(c.is_state_capital));
    } else if (cityPool === "capitals") {
      pool = pool.filter((c) => Boolean(c.is_capital));
    } else if (cityPool === "100k") {
      pool = pool.filter((c) => (c.population || 0) >= 100_000);
    } else if (cityPool === "1M") {
      pool = pool.filter((c) => (c.population || 0) >= 1_000_000);
    }

    const cCounts: Record<string, number> = {};
    const contCounts: Record<string, number> = {};

    for (const city of pool) {
      const code = (city.country_code || "").toUpperCase();
      cCounts[code] = (cCounts[code] || 0) + 1;

      const contScope = COUNTRY_TO_CONTINENT[code];
      if (contScope) {
        contCounts[contScope] = (contCounts[contScope] || 0) + 1;
      } else if (city.continent) {
        const cLower = city.continent.toLowerCase();
        if (cLower.includes("south")) contCounts["SOUTH_AMERICA"] = (contCounts["SOUTH_AMERICA"] || 0) + 1;
        else if (cLower.includes("north")) contCounts["NORTH_AMERICA"] = (contCounts["NORTH_AMERICA"] || 0) + 1;
        else if (cLower.includes("eur")) contCounts["EUR"] = (contCounts["EUR"] || 0) + 1;
        else if (cLower.includes("asia") || cLower.includes("ásia")) contCounts["ASIA"] = (contCounts["ASIA"] || 0) + 1;
        else if (cLower.includes("afr")) contCounts["AFRICA"] = (contCounts["AFRICA"] || 0) + 1;
        else if (cLower.includes("ocean")) contCounts["OCEANIA"] = (contCounts["OCEANIA"] || 0) + 1;
      }
    }

    return {
      totalCitiesCount: pool.length,
      countryCounts: cCounts,
      continentCounts: contCounts,
    };
  }, [cities, cityPool, maptapOnly]);

  // Live subnational feature counts from statesGeoJSON
  const liveSubdivisionCounts = useMemo<Record<string, number>>(() => {
    if (!statesGeoJSON || !statesGeoJSON.features) return {};
    const map: Record<string, number> = {};
    for (const feat of statesGeoJSON.features) {
      const code = (feat.properties?.country_code || "").toUpperCase();
      if (code) {
        map[code] = (map[code] || 0) + 1;
      }
    }
    return map;
  }, [statesGeoJSON]);

  // Compute dynamic badge for each item depending on mode and pool
  const getItemBadge = (item: RegionItem): string => {
    if (mode === "states") {
      if (item.id === "ALL") {
        return "241 countries";
      }
      if (CONTINENT_COUNTRY_COUNTS[item.id]) {
        return `${CONTINENT_COUNTRY_COUNTS[item.id]} countries`;
      }
      if (COUNTRY_SUBDIVISIONS[item.id]) {
        const meta = COUNTRY_SUBDIVISIONS[item.id];
        const count = liveSubdivisionCounts[item.id] ?? meta.count;
        return `${count} ${meta.label}`;
      }
      return "1 country";
    }

    // Cities mode: dynamically computed according to selected city pool
    if (item.id === "ALL") {
      return `${totalCitiesCount.toLocaleString("en-US")} cities`;
    }
    if (CONTINENT_COUNTRY_COUNTS[item.id]) {
      const count = continentCounts[item.id] || 0;
      return `${count.toLocaleString("en-US")} cities`;
    }
    if (COUNTRY_SUBDIVISIONS[item.id]) {
      const meta = COUNTRY_SUBDIVISIONS[item.id];
      const regCount = liveSubdivisionCounts[item.id] ?? meta.count;
      const count = countryCounts[item.id] || 0;
      return `${regCount} reg • ${count.toLocaleString("en-US")} cit`;
    }

    const count = countryCounts[item.id] || 0;
    return `${count.toLocaleString("en-US")} cities`;
  };

  const activeTab = useMemo(() => {
    return REGION_TABS.find((t) => t.id === activeTabId) ?? REGION_TABS[0];
  }, [activeTabId]);

  const displayedItems = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    if (!q) {
      return activeTab.items;
    }
    // Search across all global country options
    return ALL_REGION_OPTIONS.filter(
      (item) =>
        item.name.toLowerCase().includes(q) ||
        item.id.toLowerCase().includes(q)
    );
  }, [searchQuery, activeTab]);

  const handleSelect = (option: RegionItem) => {
    onSelectScope(option.id, option.center, option.zoom);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={containerRef}>
      {/* Compact trigger button on top bar */}
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-7 px-2 rounded-xl gap-1.5 text-xs font-semibold bg-background/90 hover:bg-accent border-border/70 shrink-0 shadow-xs"
        title="Select Training Region"
      >
        <span className="text-sm leading-none">{currentOption.flag}</span>
        <span className="text-[11px] font-bold whitespace-nowrap">
          {currentOption.name}
        </span>
        <ChevronDown
          className={`size-3 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {/* Dropdown Popover with Continents & Perfectly Aligned Badges */}
      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-84 sm:w-96 rounded-2xl border border-border/80 bg-background/98 p-2.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-2">
          {/* Continent Tabs */}
          <div className="flex flex-wrap gap-1 p-1 rounded-xl bg-muted/40 border border-border/50">
            {REGION_TABS.map((tab) => {
              const isActive = activeTabId === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTabId(tab.id);
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-1 px-2 py-1 rounded-lg text-[10.5px] font-bold transition-all ${
                    isActive
                      ? "bg-background text-foreground shadow-xs border border-border/60"
                      : "text-muted-foreground hover:text-foreground hover:bg-background/50"
                  }`}
                >
                  <span className="text-xs">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Instant Search Input */}
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-muted-foreground" />
            <input
              ref={searchInputRef}
              type="text"
              autoComplete="off"
              autoCorrect="off"
              spellCheck="false"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search country or region..."
              className="w-full pl-7 pr-2.5 py-1 text-xs rounded-lg border border-border/60 bg-muted/40 focus:outline-hidden focus:border-primary/80 focus:bg-background transition-colors placeholder:text-muted-foreground/60"
            />
          </div>

          {/* List of Countries with Aligned Badges and Dynamic Stats */}
          <div className="max-h-64 overflow-y-auto space-y-0.5 pr-0.5">
            {displayedItems.length === 0 ? (
              <div className="py-6 text-center text-xs text-muted-foreground">
                No country found
              </div>
            ) : (
              displayedItems.map((item, index) => {
                const isSelected = item.id === currentScope;
                const badgeText = getItemBadge(item);

                return (
                  <button
                    key={`${activeTabId}-${item.id}-${index}`}
                    onClick={() => handleSelect(item)}
                    className={`group w-full flex items-center justify-between px-2.5 py-1.5 rounded-lg text-xs transition-colors text-left ${
                      isSelected
                        ? "bg-primary/10 text-primary font-bold"
                        : "text-foreground/90 hover:bg-accent hover:text-accent-foreground"
                    }`}
                  >
                    {/* Left: Flag and Name */}
                    <div className="flex items-center gap-2 min-w-0 flex-1 pr-2">
                      <span className="text-sm shrink-0 leading-none">
                        {item.flag}
                      </span>
                      <span className="font-medium whitespace-normal">{item.name}</span>
                    </div>

                    {/* Right: Tabular Dynamic Badge and Checkmark (Fixed Layout) */}
                    <div className="flex items-center gap-1.5 shrink-0">
                      <span className="inline-flex items-center justify-center min-w-[98px] text-[10.5px] tabular-nums font-mono font-medium text-muted-foreground/85 bg-muted/60 px-2 py-0.5 rounded-md border border-border/40 whitespace-nowrap">
                        {badgeText}
                      </span>
                      <div className="w-3.5 flex items-center justify-center shrink-0">
                        {isSelected && (
                          <Check className="size-3.5 text-primary shrink-0" />
                        )}
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// Backwards compatibility export
export function RegionSelectDialog(props: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentScope: string;
  onSelectScope: (
    scope: string,
    center?: [number, number],
    zoom?: number
  ) => void;
}) {
  if (!props.open) return null;
  return (
    <RegionSelector
      currentScope={props.currentScope}
      onSelectScope={props.onSelectScope}
    />
  );
}
