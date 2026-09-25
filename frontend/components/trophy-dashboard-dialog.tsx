"use client";

import { useMemo, useState } from "react";
import type { GuessHistoryItem } from "@/lib/game-storage";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Trophy,
  Flame,
  Target,
  Trash2,
  MapPin,
  Clock,
  Compass,
  CheckCircle2,
  Users,
} from "lucide-react";

interface TrophyDashboardDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  history: GuessHistoryItem[];
  averageScore: number;
  streak: number;
  onClearHistory: () => void;
}

export function TrophyDashboardDialog({
  open,
  onOpenChange,
  history,
  averageScore,
  streak,
  onClearHistory,
}: TrophyDashboardDialogProps) {
  const [confirmClear, setConfirmClear] = useState(false);

  const stats = useMemo(() => {
    if (!history || history.length === 0) {
      return {
        totalRounds: 0,
        bestScore: 0,
        directHits: 0,
        directHitRate: 0,
        avgDistance: 0,
      };
    }
    const totalRounds = history.length;
    let bestScore = 0;
    let directHits = 0;
    let sumDist = 0;

    for (const h of history) {
      if (h.score > bestScore) bestScore = h.score;
      if (h.isCorrectRegion) directHits++;
      sumDist += h.distanceKm;
    }

    return {
      totalRounds,
      bestScore,
      directHits,
      directHitRate: Math.round((directHits / totalRounds) * 100),
      avgDistance: Math.round(sumDist / totalRounds),
    };
  }, [history]);

  const handleClearClick = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      return;
    }
    onClearHistory();
    setConfirmClear(false);
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(val) => {
        setConfirmClear(false);
        onOpenChange(val);
      }}
    >
      <DialogContent className="max-h-[85vh] sm:max-w-2xl flex flex-col p-4 sm:p-6 overflow-hidden">
        <DialogHeader className="pb-2 border-b border-border/60">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="size-9 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                <Trophy className="size-5" />
              </div>
              <div>
                <DialogTitle className="text-base sm:text-lg font-bold flex items-center gap-2">
                  Dashboard de Desempenho
                  {streak > 1 && (
                    <Badge variant="outline" className="text-orange-500 border-orange-500/30 gap-1 text-[11px]">
                      <Flame className="size-3 fill-orange-500" /> {streak}x streak
                    </Badge>
                  )}
                </DialogTitle>
                <DialogDescription className="text-xs text-muted-foreground">
                  Pontuação média acumulada e histórico de rodadas salvo localmente.
                </DialogDescription>
              </div>
            </div>
          </div>
        </DialogHeader>

        {/* Top KPI Summary Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-3 pb-2">
          <div className="p-3 rounded-xl border border-border/60 bg-muted/30 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Pontuação Média
            </span>
            <span className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
              {averageScore.toLocaleString("pt-BR")}
            </span>
            <span className="text-[10px] text-muted-foreground/80 mt-0.5">pts / rodada</span>
          </div>

          <div className="p-3 rounded-xl border border-border/60 bg-muted/30 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Total Jogadas
            </span>
            <span className="text-xl sm:text-2xl font-black text-foreground mt-0.5">
              {stats.totalRounds}
            </span>
            <span className="text-[10px] text-muted-foreground/80 mt-0.5">
              {stats.totalRounds === 1 ? "rodada salva" : "rodadas salvas"}
            </span>
          </div>

          <div className="p-3 rounded-xl border border-border/60 bg-muted/30 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Melhor Rodada
            </span>
            <span className="text-xl sm:text-2xl font-black text-emerald-500 mt-0.5">
              {stats.bestScore}
            </span>
            <span className="text-[10px] text-muted-foreground/80 mt-0.5">pts recorde</span>
          </div>

          <div className="p-3 rounded-xl border border-border/60 bg-muted/30 flex flex-col items-center justify-center text-center">
            <span className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
              Taxa de Acerto
            </span>
            <span className="text-xl sm:text-2xl font-black text-sky-500 mt-0.5">
              {stats.directHitRate}%
            </span>
            <span className="text-[10px] text-muted-foreground/80 mt-0.5">
              {stats.directHits} acertos diretos
            </span>
          </div>
        </div>

        {/* Action Bar: Title & Reset Button */}
        <div className="flex items-center justify-between pt-2 pb-1 border-b border-border/40">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-foreground">
            <Clock className="size-3.5 text-muted-foreground" />
            <span>Histórico de Palpites ({history.length})</span>
          </div>

          {history.length > 0 && (
            <div className="flex items-center gap-2">
              {confirmClear && (
                <span className="text-[11px] text-rose-500 font-medium animate-pulse">
                  Tem certeza?
                </span>
              )}
              <Button
                variant={confirmClear ? "destructive" : "ghost"}
                size="sm"
                onClick={handleClearClick}
                onMouseLeave={() => setConfirmClear(false)}
                className={`h-7 px-2.5 text-xs rounded-lg transition-all gap-1.5 ${
                  !confirmClear
                    ? "text-muted-foreground hover:text-rose-500 hover:bg-rose-500/10"
                    : ""
                }`}
                title="Limpar histórico e resetar pontuação"
              >
                <Trash2 className="size-3.5" />
                <span>{confirmClear ? "Confirmar Limpeza" : "Resetar Pontuação"}</span>
              </Button>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto pr-1 space-y-2 mt-2 max-h-[46vh]">
          {history.length === 0 ? (
            <div className="py-12 flex flex-col items-center justify-center text-center text-muted-foreground gap-2">
              <Target className="size-8 stroke-[1.5] text-muted-foreground/40" />
              <p className="text-sm font-medium">Nenhum palpite registrado ainda</p>
              <p className="text-xs text-muted-foreground/80 max-w-sm">
                Jogue algumas rodadas dando palpites no mapa. Seus resultados, cidades jogadas e pontuação média ficarão salvos aqui.
              </p>
            </div>
          ) : (
            history.map((item) => {
              const dateStr = new Date(item.timestamp).toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              });

              return (
                <div
                  key={item.id}
                  className="p-3 rounded-xl border border-border/50 bg-background/60 hover:bg-muted/40 transition-colors flex items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-start gap-2.5 min-w-0">
                    <div
                      className={`size-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                        item.isCorrectRegion
                          ? "bg-emerald-500/15 text-emerald-500"
                          : item.score >= 500
                          ? "bg-amber-500/15 text-amber-500"
                          : "bg-rose-500/15 text-rose-500"
                      }`}
                    >
                      {item.isCorrectRegion ? (
                        <CheckCircle2 className="size-4" />
                      ) : (
                        <MapPin className="size-4" />
                      )}
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="font-bold text-foreground text-sm">
                          {item.targetName}
                        </span>
                        {item.targetDetails && (
                          <span className="text-[11px] text-muted-foreground">
                            ({item.targetDetails})
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2 mt-1 text-[11px] text-muted-foreground flex-wrap">
                        <span className="flex items-center gap-1">
                          <Compass className="size-3 text-muted-foreground/70" />
                          <span>Distância: <strong className="text-foreground">{item.distanceKm.toLocaleString("pt-BR")} km</strong></span>
                        </span>

                        {item.clickedRegionName && (
                          <span>
                            • Clicado: <strong className="text-foreground">{item.clickedRegionName}</strong>
                            {item.clickedRegionCountry ? ` (${item.clickedRegionCountry})` : ""}
                          </span>
                        )}

                        {item.targetPopulation && item.targetPopulation > 0 && (
                          <span className="flex items-center gap-0.5">
                            • <Users className="size-3" />
                            {item.targetPopulation >= 1_000_000
                              ? `${(item.targetPopulation / 1_000_000).toFixed(1)}M`
                              : `${(item.targetPopulation / 1_000).toFixed(0)}k`} hab.
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end shrink-0 pl-2">
                    <span
                      className={`font-black text-sm ${
                        item.score >= 800
                          ? "text-emerald-500"
                          : item.score >= 500
                          ? "text-amber-500"
                          : "text-muted-foreground"
                      }`}
                    >
                      +{item.score} pts
                    </span>
                    <span className="text-[10px] text-muted-foreground/70 mt-0.5">
                      {dateStr}
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
