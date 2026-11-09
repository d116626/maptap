"use client";

import { useEffect, useRef, useState } from "react";
import { Lightbulb, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  TIPS_SHEET_HEIGHT,
  loadCountryTips,
  tipsSheetHeightPx,
  type TipsSnap,
} from "@/lib/tips";
import type { CountryTips } from "@/types/tips";

const SNAPS: TipsSnap[] = ["peek", "half", "full"];
const PEEK_PX = tipsSheetHeightPx("peek");

interface CountryTipsPanelProps {
  countryCode: string;
  snap: TipsSnap;
  onSnapChange: (snap: TipsSnap) => void;
  onHighlight: (regions: string[]) => void;
  onClose: () => void;
}

export function CountryTipsPanel({
  countryCode,
  snap,
  onSnapChange,
  onHighlight,
  onClose,
}: CountryTipsPanelProps) {
  const [loaded, setLoaded] = useState<{
    code: string;
    data: CountryTips | null;
  } | null>(null);
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const [sectionIndex, setSectionIndex] = useState(0);
  const [dragHeight, setDragHeight] = useState<number | null>(null);
  const drag = useRef<{ startY: number; startHeight: number; moved: boolean } | null>(
    null
  );
  const sheetRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<Record<string, HTMLElement | null>>({});
  const chipRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const scrollLocked = useRef(false);
  const lockTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    let cancelled = false;
    loadCountryTips(countryCode).then((data) => {
      if (!cancelled) setLoaded({ code: countryCode, data });
    });
    return () => {
      cancelled = true;
    };
  }, [countryCode]);

  const isReady = loaded !== null && loaded.code === countryCode;
  const isLoading = !isReady;
  const tips = isReady ? loaded.data : null;
  const activeSectionId = tips?.sections[sectionIndex]?.id;

  useEffect(() => {
    if (!activeSectionId) return;
    chipRefs.current[activeSectionId]?.scrollIntoView({
      inline: "center",
      block: "nearest",
      behavior: "smooth",
    });
  }, [activeSectionId]);

  const goToSection = (index: number) => {
    const body = bodyRef.current;
    const target = tips && sectionRefs.current[tips.sections[index].id];
    setSectionIndex(index);
    if (snap === "peek") onSnapChange("half");
    if (!body || !target) return;
    scrollLocked.current = true;
    if (lockTimer.current) clearTimeout(lockTimer.current);
    lockTimer.current = setTimeout(() => {
      scrollLocked.current = false;
    }, 700);
    body.scrollTo({ top: target.offsetTop - 4, behavior: "smooth" });
  };

  const handleBodyScroll = () => {
    const body = bodyRef.current;
    if (!body || !tips || scrollLocked.current) return;
    const atBottom = body.scrollTop + body.clientHeight >= body.scrollHeight - 2;
    let current = 0;
    if (atBottom) {
      current = tips.sections.length - 1;
    } else {
      tips.sections.forEach((sec, i) => {
        const el = sectionRefs.current[sec.id];
        if (el && el.offsetTop <= body.scrollTop + 8) current = i;
      });
    }
    setSectionIndex(current);
  };

  const handleItemClick = (key: string, regions: string[]) => {
    if (activeKey === key) {
      setActiveKey(null);
      onHighlight([]);
    } else {
      setActiveKey(key);
      onHighlight(regions);
    }
  };

  const handleDragStart = (e: React.PointerEvent<HTMLDivElement>) => {
    const sheet = sheetRef.current;
    if (!sheet) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    const startHeight = sheet.getBoundingClientRect().height;
    drag.current = { startY: e.clientY, startHeight, moved: false };
  };

  const handleDragMove = (e: React.PointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d) return;
    const dy = d.startY - e.clientY;
    if (Math.abs(dy) > 4) d.moved = true;
    if (!d.moved) return;
    const max = window.innerHeight * 0.6;
    setDragHeight(Math.min(max, Math.max(PEEK_PX, d.startHeight + dy)));
  };

  const handleDragEnd = () => {
    const d = drag.current;
    drag.current = null;
    if (!d) return;
    if (!d.moved) {
      onSnapChange(SNAPS[(SNAPS.indexOf(snap) + 1) % SNAPS.length]);
    } else if (dragHeight !== null) {
      const nearest = SNAPS.reduce((best, s) =>
        Math.abs(tipsSheetHeightPx(s) - dragHeight) <
        Math.abs(tipsSheetHeightPx(best) - dragHeight)
          ? s
          : best
      );
      onSnapChange(nearest);
    }
    setDragHeight(null);
  };

  const sheetHeight =
    dragHeight !== null ? `${dragHeight}px` : TIPS_SHEET_HEIGHT[snap];

  return (
    <div
      ref={sheetRef}
      className={`fixed inset-x-2 bottom-19 z-20 flex h-(--sheet-h) flex-col overflow-hidden rounded-2xl border border-white/10 bg-slate-950/95 shadow-2xl backdrop-blur-2xl mx-auto max-w-xl ${
        dragHeight === null ? "transition-[height] duration-200" : ""
      }`}
      style={{ "--sheet-h": sheetHeight } as React.CSSProperties}
    >
      <div
        className="flex h-6 shrink-0 cursor-grab touch-none items-center justify-center"
        onPointerDown={handleDragStart}
        onPointerMove={handleDragMove}
        onPointerUp={handleDragEnd}
        onPointerCancel={handleDragEnd}
        title="Drag to resize"
      >
        <div className="h-1 w-10 rounded-full bg-white/25" />
      </div>

      <div className="flex shrink-0 items-center justify-between gap-2 pb-1.5 pl-3 pr-2">
        <div className="flex min-w-0 items-center gap-1.5">
          <Lightbulb className="size-4 shrink-0 text-amber-400" />
          <h2 className="truncate text-sm font-semibold text-foreground">
            {tips?.title ?? "Tips"}
          </h2>
        </div>
        <Button
          variant="ghost"
          size="sm"
          onClick={onClose}
          className="size-8 shrink-0 rounded-lg p-0 text-muted-foreground hover:text-foreground"
          title="Close tips"
        >
          <X className="size-4" />
        </Button>
      </div>

      {tips && (
        <div className="flex shrink-0 gap-1.5 overflow-x-auto border-b border-white/10 px-2 pb-2 [scrollbar-width:none]">
          {tips.sections.map((s, i) => (
            <button
              key={s.id}
              ref={(el) => {
                chipRefs.current[s.id] = el;
              }}
              type="button"
              onClick={() => goToSection(i)}
              className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                activeSectionId === s.id
                  ? "border-amber-400/60 bg-amber-400/15 text-amber-300"
                  : "border-white/10 text-muted-foreground hover:bg-white/5"
              }`}
            >
              {s.title}
            </button>
          ))}
        </div>
      )}

      <div
        ref={bodyRef}
        onScroll={handleBodyScroll}
        className="relative min-h-0 flex-1 overflow-y-auto px-2 py-2"
      >
        {isLoading && (
          <p className="px-1 text-sm text-muted-foreground">Loading...</p>
        )}
        {!isLoading && !tips && (
          <p className="px-1 text-sm text-muted-foreground">
            Could not load tips.
          </p>
        )}
        {tips?.sections.map((section) => (
          <section
            key={section.id}
            ref={(el) => {
              sectionRefs.current[section.id] = el;
            }}
            className="pb-3"
          >
            <h3 className="px-2 pb-1 text-xs font-semibold uppercase tracking-wide text-amber-300/90">
              {section.title}
            </h3>
            <ul>
              {section.items.map((item, index) => {
                const key = `${section.id}:${index}`;
                const regions = item.regions;
                const isActive = activeKey === key;
                const content = (
                  <>
                    {item.label && (
                      <span className="font-medium text-foreground">
                        {item.label}
                      </span>
                    )}
                    {item.label && item.text && (
                      <span className="text-muted-foreground"> · </span>
                    )}
                    {item.text && (
                      <span className="text-muted-foreground">{item.text}</span>
                    )}
                  </>
                );

                return (
                  <li key={key}>
                    {regions && regions.length > 0 ? (
                      <button
                        type="button"
                        onClick={() => handleItemClick(key, regions)}
                        className={`w-full rounded-lg px-2 py-1.5 text-left text-[13px] sm:text-sm leading-snug transition-colors ${
                          isActive
                            ? "bg-amber-400/15 ring-1 ring-amber-400/50"
                            : "hover:bg-white/5"
                        }`}
                      >
                        {content}
                      </button>
                    ) : (
                      <p className="px-2 py-1.5 text-[13px] leading-snug sm:text-sm">
                        {content}
                      </p>
                    )}
                  </li>
                );
              })}
            </ul>
          </section>
        ))}
        <div className="h-24" />
      </div>
    </div>
  );
}
