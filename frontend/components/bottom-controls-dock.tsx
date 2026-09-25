"use client";

import { useState } from "react";
import type { TrainingSettings } from "@/types/map";
import { BASEMAP_OPTIONS } from "@/lib/unified-map-style";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  ArrowRight,
  Compass,
  Mountain,
  SkipForward,
  Tag,
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

  const activeBasemap =
    BASEMAP_OPTIONS.find((b) => b.id === settings.baseMap) ??
    BASEMAP_OPTIONS[0];

  return (
    <>
      {/* Floating Bottom Dock Bar (Tamanho Estritamente Fixo e Estável) */}
      <div className="pointer-events-none fixed bottom-4 left-0 right-0 z-20 flex justify-center px-3 safe-area-bottom">
        <div className="pointer-events-auto flex items-center gap-2 rounded-2xl border border-white/20 bg-background/90 p-1.5 shadow-2xl backdrop-blur-xl">
          {/* 1. Base Map Imagery (Fixed: w-10 h-10) */}
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setStyleSelectorOpen(!styleSelectorOpen)}
            className="h-10 w-10 p-0 rounded-xl hover:bg-accent/80 transition-all shrink-0 flex items-center justify-center relative"
            title={`Base Map: ${activeBasemap.name}`}
          >
            <span className="text-lg leading-none">{activeBasemap.icon}</span>
          </Button>

          <div className="h-5 w-px bg-border/60 shrink-0" />

          {/* 2. Labels Toggle (Fixed: w-10 h-10) */}
          <Button
            variant={settings.showLabels ? "default" : "ghost"}
            size="sm"
            onClick={() =>
              onUpdateSettings({ showLabels: !settings.showLabels })
            }
            className={`h-10 w-10 p-0 rounded-xl transition-all shrink-0 flex items-center justify-center relative ${
              settings.showLabels
                ? "bg-primary text-primary-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
            title={settings.showLabels ? "Hide Labels" : "Show Labels"}
          >
            <Tag className="size-4" />
            {settings.showLabels && (
              <span className="absolute top-1.5 right-1.5 size-1.5 rounded-full bg-emerald-400" />
            )}
          </Button>

          <div className="h-5 w-px bg-border/60 shrink-0" />

          {/* 3. 3D Terrain Elevation Toggle (Fixed: w-10 h-10) */}
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

          {/* 4. Skip or Next Round (Fixed: w-10 h-10) */}
          {hasGuessed ? (
            <Button
              onClick={onNextTarget}
              size="sm"
              className="h-10 w-10 p-0 rounded-xl bg-primary text-primary-foreground shadow-md animate-pulse shrink-0 flex items-center justify-center"
              title="Next Round (Space / Enter)"
            >
              <ArrowRight className="size-4" />
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="sm"
              onClick={onSkipTarget}
              className="h-10 w-10 p-0 rounded-xl text-muted-foreground hover:text-foreground shrink-0 flex items-center justify-center"
              title="Skip Round"
            >
              <SkipForward className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Quick Basemap Selection Overlay Dialog */}
      {styleSelectorOpen && (
        <div className="fixed inset-0 z-30 flex items-end sm:items-center justify-center p-3 bg-black/50 backdrop-blur-sm animate-in fade-in duration-150">
          <div className="w-full max-w-md rounded-2xl border border-border bg-background p-4 shadow-2xl safe-area-bottom">
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
