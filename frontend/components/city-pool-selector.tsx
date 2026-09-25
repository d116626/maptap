"use client";

import { useState, useRef, useEffect, useMemo } from "react";
import { Check, ChevronDown, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CityItem, CityPoolMode } from "@/types/map";
import { filterCitiesByScope } from "@/lib/geo-utils";

export interface CityPoolOption {
  id: CityPoolMode;
  label: string;
  shortLabel: string;
  icon: string;
  description: string;
}

export const CITY_POOL_OPTIONS: CityPoolOption[] = [
  {
    id: "all",
    label: "All Municipalities",
    shortLabel: "All Cities",
    icon: "🌐",
    description: "Entire dataset in region",
  },
  {
    id: "country_capitals",
    label: "Country Capitals",
    shortLabel: "Nat. Capitals",
    icon: "🏛️",
    description: "Official national capitals",
  },
  {
    id: "state_capitals",
    label: "State Capitals",
    shortLabel: "State Capitals",
    icon: "🏢",
    description: "State & provincial capitals",
  },
  {
    id: "capitals",
    label: "All Capitals",
    shortLabel: "All Capitals",
    icon: "⭐",
    description: "National + state capitals",
  },
  {
    id: "1M",
    label: "1M+ Megacities",
    shortLabel: "1M+",
    icon: "🌆",
    description: "Metropolises (Pop. ≥ 1,000,000)",
  },
  {
    id: "100k",
    label: "100k+ Pop.",
    shortLabel: "100k+",
    icon: "🏙️",
    description: "Major cities (Pop. ≥ 100,000)",
  },
];

interface CityPoolSelectorProps {
  currentPool: CityPoolMode;
  onSelectPool: (pool: CityPoolMode) => void;
  maptapOnly?: boolean;
  onToggleMaptapOnly?: (maptapOnly: boolean) => void;
  cities?: CityItem[];
  scopeCountry?: string;
  disabled?: boolean;
}

export function CityPoolSelector({
  currentPool,
  onSelectPool,
  maptapOnly = false,
  onToggleMaptapOnly,
  cities = [],
  scopeCountry = "ALL",
  disabled = false,
}: CityPoolSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Normalize legacy "maptap" pool mode to "all"
  const normalizedPoolId = currentPool === "maptap" ? "all" : currentPool;
  const activeOption =
    CITY_POOL_OPTIONS.find((opt) => opt.id === normalizedPoolId) ||
    CITY_POOL_OPTIONS[0];

  // Calculate live counts for each pool option in the current scope
  const poolCounts = useMemo<Record<CityPoolMode, number>>(() => {
    if (!cities || cities.length === 0) {
      return {
        all: 0,
        country_capitals: 0,
        state_capitals: 0,
        capitals: 0,
        "1M": 0,
        "100k": 0,
        maptap: 0,
      };
    }

    let scoped = filterCitiesByScope(cities, scopeCountry);
    if (scoped.length === 0 && scopeCountry !== "ALL") {
      scoped = cities;
    }

    const base = maptapOnly ? scoped.filter((c) => c.is_maptap_base) : scoped;

    return {
      all: base.length,
      country_capitals: base.filter((c) => Boolean(c.is_country_capital)).length,
      state_capitals: base.filter((c) => Boolean(c.is_state_capital)).length,
      capitals: base.filter((c) => Boolean(c.is_capital)).length,
      "1M": base.filter((c) => (c.population || 0) >= 1_000_000).length,
      "100k": base.filter((c) => (c.population || 0) >= 100_000).length,
      maptap: scoped.filter((c) => c.is_maptap_base).length,
    };
  }, [cities, scopeCountry, maptapOnly]);

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

  if (disabled) {
    return null;
  }

  return (
    <div className="relative" ref={containerRef}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen((prev) => !prev)}
        className="h-7 px-2 rounded-xl gap-1.5 text-xs font-semibold bg-background/90 hover:bg-accent border-border/70 shrink-0 shadow-xs"
        title="Select City Pool Filter"
      >
        <span className="text-xs leading-none">{activeOption.icon}</span>
        <span className="text-[11px] font-bold whitespace-nowrap">
          {activeOption.shortLabel}
        </span>
        {maptapOnly && (
          <span
            className="flex items-center text-[9px] font-bold px-1 py-0.2 rounded-md bg-amber-500/15 text-amber-600 dark:text-amber-400 border border-amber-500/30"
            title="Restricted to MapTap curated pool"
          >
            Base
          </span>
        )}
        <ChevronDown
          className={`size-3 text-muted-foreground transition-transform duration-200 ${
            isOpen ? "rotate-180" : ""
          }`}
        />
      </Button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-1.5 z-50 w-64 rounded-2xl border border-border/80 bg-background/98 p-1.5 shadow-2xl backdrop-blur-xl animate-in fade-in zoom-in-95 duration-150 flex flex-col gap-1">
          {/* MapTap Base Toggle Header */}
          {onToggleMaptapOnly && (
            <div className="px-2 pt-1 pb-2 border-b border-border/60">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-1.5">
                  <Sparkles className="size-3.5 text-amber-500" />
                  <span className="text-xs font-semibold text-foreground">
                    MapTap Pool Only
                  </span>
                </div>
                <button
                  type="button"
                  onClick={() => onToggleMaptapOnly(!maptapOnly)}
                  className={`relative inline-flex h-4.5 w-8 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-hidden ${
                    maptapOnly ? "bg-amber-500" : "bg-muted"
                  }`}
                  role="switch"
                  aria-checked={maptapOnly}
                >
                  <span
                    aria-hidden="true"
                    className={`pointer-events-none inline-block size-3.5 transform rounded-full bg-white shadow-lg ring-0 transition duration-200 ease-in-out ${
                      maptapOnly ? "translate-x-3.5" : "translate-x-0"
                    }`}
                  />
                </button>
              </div>
              <p className="text-[10px] text-muted-foreground mt-0.5 leading-tight">
                {maptapOnly
                  ? "Restricted to 5,894 curated locations"
                  : "All consolidated cities worldwide"}
              </p>
            </div>
          )}

          <div className="px-2 py-1 text-[10px] font-bold text-muted-foreground uppercase tracking-wider flex items-center justify-between">
            <span>City Mode Filter</span>
            <span className="text-[9px] font-mono text-muted-foreground/80 lowercase">
              count in scope
            </span>
          </div>

          <div className="flex flex-col gap-0.5 max-h-64 overflow-y-auto pr-0.5">
            {CITY_POOL_OPTIONS.map((opt) => {
              const isSelected = normalizedPoolId === opt.id;
              const count = poolCounts[opt.id] ?? 0;
              return (
                <button
                  key={opt.id}
                  onClick={() => {
                    onSelectPool(opt.id);
                    setIsOpen(false);
                  }}
                  className={`w-full flex items-center justify-between px-2.5 py-1.5 rounded-xl text-xs transition-colors text-left ${
                    isSelected
                      ? "bg-primary/10 text-primary font-bold"
                      : "text-foreground/90 hover:bg-accent hover:text-accent-foreground"
                  }`}
                >
                  <div className="flex items-center gap-2 min-w-0 mr-2">
                    <span className="text-sm shrink-0">{opt.icon}</span>
                    <div className="flex flex-col">
                      <span className="font-semibold text-xs leading-tight">
                        {opt.label}
                      </span>
                      <span className="text-[10px] text-muted-foreground font-normal">
                        {opt.description}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0 ml-auto">
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded-md font-mono font-bold ${
                        isSelected
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {count.toLocaleString()}
                    </span>
                    {isSelected && (
                      <Check className="size-3.5 text-primary shrink-0" />
                    )}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
