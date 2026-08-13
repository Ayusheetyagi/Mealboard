"use client";

import { MemberCard } from "@/components/summary/MemberCard";
import { AddMemberButton } from "@/components/summary/AddMemberButton";
import { HouseholdNotes } from "@/components/summary/HouseholdNotes";
import { Button } from "@/components/ui/Button";
import { signOut } from "@/app/login/actions";
import { FOCUS_RING } from "@/lib/styles";
import {
  addMember,
  removeMember,
  updateMemberName,
  updateAgeRange,
  updateTagAt,
  addTag,
  removeTagAt,
  updateHouseholdNoteAt,
  addHouseholdNote,
  removeHouseholdNoteAt,
} from "@/lib/family-profile-updates";
import type { FamilyProfile } from "@/types/family";

interface FamilySummaryCardProps {
  profile: FamilyProfile;
  onChange: (updater: (prev: FamilyProfile | null) => FamilyProfile) => void;
  isAuthenticated: boolean;
  onStartOver: () => void;
}

export function FamilySummaryCard({
  profile,
  onChange,
  isAuthenticated,
  onStartOver,
}: FamilySummaryCardProps) {
  function apply(fn: (p: FamilyProfile) => FamilyProfile) {
    onChange((prev) => fn(prev ?? profile));
  }

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-display text-3xl text-ink">Here&apos;s what I&apos;ve got</h1>
        <div className="flex items-center gap-4">
          <Button type="button" variant="ghost" onClick={onStartOver}>
            Start over
          </Button>
          {isAuthenticated && (
            <form action={signOut}>
              <button type="submit" className={`text-xs text-muted hover:text-tomato ${FOCUS_RING}`}>
                sign out
              </button>
            </form>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4">
        {profile.members.map((member) => (
          <MemberCard
            key={member.id}
            member={member}
            onUpdateName={(name) => apply((p) => updateMemberName(p, member.id, name))}
            onUpdateAgeRange={(ageRange) => apply((p) => updateAgeRange(p, member.id, ageRange))}
            onUpdateTag={(field, index, value) =>
              apply((p) => updateTagAt(p, member.id, field, index, value))
            }
            onAddTag={(field, value) => apply((p) => addTag(p, member.id, field, value))}
            onRemoveTag={(field, index) => apply((p) => removeTagAt(p, member.id, field, index))}
            onRemoveMember={() => apply((p) => removeMember(p, member.id))}
          />
        ))}
      </div>

      <AddMemberButton onAdd={() => apply(addMember)} />

      <HouseholdNotes
        notes={profile.householdNotes}
        onUpdateNote={(index, value) => apply((p) => updateHouseholdNoteAt(p, index, value))}
        onAddNote={(value) => apply((p) => addHouseholdNote(p, value))}
        onRemoveNote={(index) => apply((p) => removeHouseholdNoteAt(p, index))}
      />
    </div>
  );
}
