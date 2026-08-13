import type { FamilyProfile } from "@/types/family";

const STORAGE_KEY = "fmp:family-profile:v1";

export function loadFamilyProfile(): FamilyProfile | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed: unknown = JSON.parse(raw);
    if (!isValidFamilyProfile(parsed)) {
      window.localStorage.removeItem(STORAGE_KEY);
      return null;
    }
    return parsed;
  } catch {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    return null;
  }
}

export function saveFamilyProfile(profile: FamilyProfile): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  } catch {
    // quota exceeded / privacy mode / storage disabled — fail safe, don't crash the UI
  }
}

export function clearFamilyProfile(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignore
  }
}

export function isValidFamilyProfile(value: unknown): value is FamilyProfile {
  if (!value || typeof value !== "object") return false;
  const v = value as Record<string, unknown>;
  if (!Array.isArray(v.members) || !Array.isArray(v.householdNotes)) return false;
  return v.members.every((m) => {
    if (!m || typeof m !== "object") return false;
    const mm = m as Record<string, unknown>;
    return (
      typeof mm.id === "string" &&
      typeof mm.name === "string" &&
      typeof mm.ageRange === "string" &&
      Array.isArray(mm.dietaryRestrictions) &&
      Array.isArray(mm.dislikedFoods) &&
      Array.isArray(mm.favoriteFoods)
    );
  });
}
