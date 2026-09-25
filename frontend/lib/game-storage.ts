"use client";

export interface GuessHistoryItem {
  id: string;
  targetId: string;
  targetName: string;
  targetDetails?: string;
  targetPopulation?: number;
  targetType: "city" | "state" | "country";
  targetCoords: [number, number];
  guessCoords: [number, number];
  clickedRegionName?: string;
  clickedRegionCountry?: string;
  distanceKm: number;
  score: number;
  isCorrectRegion: boolean;
  timestamp: number;
}

const STORAGE_KEY = "maptap_guess_history_v1";

/**
 * Safely retrieves guess history from localStorage
 */
export function getStoredGuessHistory(): GuessHistoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      return parsed;
    }
    return [];
  } catch (err) {
    console.error("Failed to read game history from localStorage:", err);
    return [];
  }
}

/**
 * Appends a new guess to history, keeps up to 500 recent entries
 */
export function saveGuessToHistory(item: GuessHistoryItem): GuessHistoryItem[] {
  if (typeof window === "undefined") return [item];
  try {
    const existing = getStoredGuessHistory();
    // Add newest at the beginning
    const updated = [item, ...existing.filter((i) => i.id !== item.id)].slice(0, 500);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return updated;
  } catch (err) {
    console.error("Failed to save guess to localStorage:", err);
    return [item];
  }
}

/**
 * Clears the history completely from localStorage
 */
export function clearStoredGuessHistory(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch (err) {
    console.error("Failed to clear game history from localStorage:", err);
  }
}

/**
 * Calculates the average score (média) of all played rounds
 */
export function calculateAverageScore(history: GuessHistoryItem[]): number {
  if (!history || history.length === 0) return 0;
  const total = history.reduce((sum, item) => sum + item.score, 0);
  return Math.round(total / history.length);
}

/**
 * Gets a set of IDs for cities that have already been played
 */
export function getPlayedCityIds(history: GuessHistoryItem[]): Set<string> {
  const ids = new Set<string>();
  if (!history) return ids;
  for (const item of history) {
    if (item.targetType === "city" && item.targetId) {
      ids.add(item.targetId);
    }
  }
  return ids;
}
