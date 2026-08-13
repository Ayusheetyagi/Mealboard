import type { FamilyMember } from "@/types/family";

/** Picks 2-3 representative tags per member for the chip-formation animation only —
 *  the summary card underneath shows every tag in every category. */
export function pickSignatureTags(member: FamilyMember): string[] {
  const tags: string[] = [];
  if (member.ageRange) tags.push(member.ageRange);

  const restrictionOrDislike = member.dietaryRestrictions[0] ?? member.dislikedFoods[0];
  if (restrictionOrDislike) tags.push(restrictionOrDislike);

  const favorite = member.favoriteFoods.find((f) => !tags.includes(f));
  if (favorite) tags.push(favorite);

  return tags.slice(0, 3);
}
