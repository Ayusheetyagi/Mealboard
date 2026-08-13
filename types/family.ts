/** Shape returned by /api/parse-family. No ids — the model never invents identifiers. */
export interface ParsedFamilyMember {
  name: string;
  ageRange: string; // free text: "toddler", "8", "60s", "adult" — ages are fuzzy in casual input
  dietaryRestrictions: string[];
  dislikedFoods: string[];
  favoriteFoods: string[];
}

export interface ParsedFamilyProfile {
  members: ParsedFamilyMember[];
  householdNotes: string[]; // general notes not tied to one person, e.g. "no pork", "cooking for 4"
}

/** Client-hydrated member — same fields plus a stable id assigned once, client-side. */
export interface FamilyMember extends ParsedFamilyMember {
  id: string;
}

/** The shape persisted to localStorage and rendered by the summary card / animation. */
export interface FamilyProfile {
  members: FamilyMember[];
  householdNotes: string[];
}

/** Tag categories on a member — used by the animation's signature-tag picker and the
 *  editable summary card's per-category add/edit/remove wiring. */
export type MemberTagField =
  | "ageRange"
  | "dietaryRestrictions"
  | "dislikedFoods"
  | "favoriteFoods";
