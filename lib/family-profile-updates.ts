import type { FamilyProfile, MemberTagField } from "@/types/family";
import { generateId } from "@/lib/id";

function mapMember(
  profile: FamilyProfile,
  memberId: string,
  fn: (m: FamilyProfile["members"][number]) => FamilyProfile["members"][number],
): FamilyProfile {
  return {
    ...profile,
    members: profile.members.map((m) => (m.id === memberId ? fn(m) : m)),
  };
}

export function updateMemberName(profile: FamilyProfile, memberId: string, name: string): FamilyProfile {
  return mapMember(profile, memberId, (m) => ({ ...m, name }));
}

export function updateAgeRange(profile: FamilyProfile, memberId: string, ageRange: string): FamilyProfile {
  return mapMember(profile, memberId, (m) => ({ ...m, ageRange }));
}

export function updateTagAt(
  profile: FamilyProfile,
  memberId: string,
  field: MemberTagField,
  index: number,
  value: string,
): FamilyProfile {
  if (field === "ageRange") return updateAgeRange(profile, memberId, value);
  return mapMember(profile, memberId, (m) => {
    const tags = [...(m[field] as string[])];
    tags[index] = value;
    return { ...m, [field]: tags };
  });
}

export function addTag(
  profile: FamilyProfile,
  memberId: string,
  field: Exclude<MemberTagField, "ageRange">,
  value: string,
): FamilyProfile {
  return mapMember(profile, memberId, (m) => ({
    ...m,
    [field]: [...m[field], value],
  }));
}

export function removeTagAt(
  profile: FamilyProfile,
  memberId: string,
  field: Exclude<MemberTagField, "ageRange">,
  index: number,
): FamilyProfile {
  return mapMember(profile, memberId, (m) => ({
    ...m,
    [field]: m[field].filter((_, i) => i !== index),
  }));
}

export function addMember(profile: FamilyProfile): FamilyProfile {
  return {
    ...profile,
    members: [
      ...profile.members,
      {
        id: generateId(),
        name: "",
        ageRange: "",
        dietaryRestrictions: [],
        dislikedFoods: [],
        favoriteFoods: [],
      },
    ],
  };
}

export function removeMember(profile: FamilyProfile, memberId: string): FamilyProfile {
  return { ...profile, members: profile.members.filter((m) => m.id !== memberId) };
}

export function updateHouseholdNoteAt(profile: FamilyProfile, index: number, value: string): FamilyProfile {
  const notes = [...profile.householdNotes];
  notes[index] = value;
  return { ...profile, householdNotes: notes };
}

export function addHouseholdNote(profile: FamilyProfile, value: string): FamilyProfile {
  return { ...profile, householdNotes: [...profile.householdNotes, value] };
}

export function removeHouseholdNoteAt(profile: FamilyProfile, index: number): FamilyProfile {
  return { ...profile, householdNotes: profile.householdNotes.filter((_, i) => i !== index) };
}
