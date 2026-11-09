import type { CountryTips } from "@/types/tips";

export type TipsSnap = "peek" | "half" | "full";

// Bottom-sheet heights; it floats just above the bottom controls dock
export const TIPS_SHEET_HEIGHT: Record<TipsSnap, string> = {
  peek: "3.5rem",
  half: "32dvh",
  full: "52dvh",
};

export const TIPS_SHEET_BOTTOM_PX = 76;
const PEEK_PX = 56;
const SNAP_VH: Record<TipsSnap, number> = { peek: 0, half: 0.32, full: 0.52 };

export function tipsSheetHeightPx(snap: TipsSnap): number {
  return snap === "peek" ? PEEK_PX : window.innerHeight * SNAP_VH[snap];
}

export const COUNTRIES_WITH_TIPS = new Set<string>(["CHN"]);

const cache = new Map<string, CountryTips>();

export async function loadCountryTips(
  countryCode: string
): Promise<CountryTips | null> {
  const cached = cache.get(countryCode);
  if (cached) return cached;
  try {
    const basePath = process.env.NEXT_PUBLIC_BASE_PATH || "";
    const res = await fetch(`${basePath}/data/tips/${countryCode}.json`);
    if (!res.ok) return null;
    const data = (await res.json()) as CountryTips;
    cache.set(countryCode, data);
    return data;
  } catch {
    return null;
  }
}
