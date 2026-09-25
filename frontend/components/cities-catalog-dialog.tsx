"use client";

import React, { useMemo, useState } from "react";
import type { CityItem } from "@/types/map";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MapPin, Search, Users } from "lucide-react";

interface CitiesCatalogDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  cities: CityItem[];
  onSelectCity: (city: CityItem) => void;
}

export const CitiesCatalogDialog = React.memo(function CitiesCatalogDialog({
  open,
  onOpenChange,
  cities,
  onSelectCity,
}: CitiesCatalogDialogProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCountry, setSelectedCountry] = useState<string>("all");
  const [displayLimit, setDisplayLimit] = useState(50);

  const countries = useMemo(() => {
    if (!open || !cities || cities.length === 0) return [];
    const set = new Set<string>();
    for (let i = 0; i < cities.length; i++) {
      set.add(cities[i].country);
    }
    return Array.from(set).sort();
  }, [open, cities]);

  const filteredCities = useMemo(() => {
    if (!open || !cities || cities.length === 0) return [];
    const q = searchTerm.trim().toLowerCase();
    const hasCountryFilter = selectedCountry !== "all";

    return cities.filter((city) => {
      if (hasCountryFilter && city.country !== selectedCountry) {
        return false;
      }
      if (!q) return true;
      return (
        city.name.toLowerCase().includes(q) ||
        (city.state && city.state.toLowerCase().includes(q)) ||
        city.country.toLowerCase().includes(q)
      );
    });
  }, [open, cities, searchTerm, selectedCountry]);

  if (!open) return null;

  const visibleCities = filteredCities.slice(0, displayLimit);
  const hasMore = filteredCities.length > displayLimit;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] sm:max-w-xl flex flex-col p-4 sm:p-6 overflow-hidden border border-white/10 bg-slate-950/95 backdrop-blur-2xl shadow-2xl">
        <DialogHeader className="pb-2">
          <DialogTitle className="text-lg font-bold flex items-center gap-2">
            <MapPin className="size-5 text-primary" />
            Cities & Locations Database ({filteredCities.length.toLocaleString("en-US")})
          </DialogTitle>
          <DialogDescription className="text-xs">
            Browse all locations available for training or choose one to practice directly.
          </DialogDescription>
        </DialogHeader>

        {/* Search & Filter Bar */}
        <div className="flex flex-col gap-2 pt-1 pb-3 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by city, state, or country..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setDisplayLimit(50);
              }}
              className="w-full rounded-lg border border-input bg-background pl-9 pr-3 py-1.5 text-sm outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-xs">
            <button
              type="button"
              onClick={() => {
                setSelectedCountry("all");
                setDisplayLimit(50);
              }}
              className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                selectedCountry === "all"
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:bg-muted/80"
              }`}
            >
              All ({cities.length.toLocaleString("en-US")})
            </button>
            {countries.map((country) => (
              <button
                key={country}
                type="button"
                onClick={() => {
                  setSelectedCountry(country);
                  setDisplayLimit(50);
                }}
                className={`px-2.5 py-1 rounded-full whitespace-nowrap transition-colors ${
                  selectedCountry === country
                    ? "bg-primary text-primary-foreground font-semibold"
                    : "bg-muted text-muted-foreground hover:bg-muted/80"
                }`}
              >
                {country}
              </button>
            ))}
          </div>
        </div>

        {/* List of Cities (Virtualized / Paginated Chunk) */}
        <div className="flex-1 overflow-y-auto divide-y divide-border/50 pr-1">
          {filteredCities.length === 0 ? (
            <div className="py-12 text-center text-sm text-muted-foreground">
              No locations found matching your search.
            </div>
          ) : (
            <>
              {visibleCities.map((city) => (
                <div
                  key={city.id}
                  className="py-2.5 flex items-center justify-between gap-3 hover:bg-muted/50 px-2 rounded-lg transition-colors"
                >
                  <div className="flex flex-col min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-semibold text-sm">{city.name}</span>
                      {city.is_capital && (
                        <Badge variant="secondary" className="text-[10px] py-0 px-1.5 font-normal">
                          Capital
                        </Badge>
                      )}
                      {city.is_maptap_base && (
                        <Badge variant="outline" className="text-[10px] py-0 px-1 text-amber-500 border-amber-500/40">
                          MapTap
                        </Badge>
                      )}
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {city.state ? `${city.state} • ` : ""}
                      {city.country}
                    </span>
                    {city.population > 0 && (
                      <div className="flex items-center gap-1 text-[11px] text-muted-foreground/80 mt-0.5">
                        <Users className="size-3" />
                        <span>{city.population.toLocaleString("en-US")} pop.</span>
                      </div>
                    )}
                  </div>

                  <Button
                    size="sm"
                    variant="outline"
                    className="h-8 text-xs shrink-0"
                    onClick={() => {
                      onSelectCity(city);
                      onOpenChange(false);
                    }}
                  >
                    Train
                  </Button>
                </div>
              ))}

              {hasMore && (
                <div className="py-3 text-center">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-xs font-semibold text-primary"
                    onClick={() => setDisplayLimit((prev) => prev + 50)}
                  >
                    Load More ({filteredCities.length - displayLimit} remaining)
                  </Button>
                </div>
              )}
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});
