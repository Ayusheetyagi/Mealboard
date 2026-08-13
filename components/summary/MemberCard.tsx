"use client";

import { EditableChip } from "@/components/summary/EditableChip";
import { AddTagButton } from "@/components/summary/AddTagButton";
import { CARD_SURFACE, FOCUS_RING } from "@/lib/styles";
import type { FamilyMember, MemberTagField } from "@/types/family";

interface MemberCardProps {
  member: FamilyMember;
  onUpdateName: (name: string) => void;
  onUpdateAgeRange: (ageRange: string) => void;
  onUpdateTag: (field: Exclude<MemberTagField, "ageRange">, index: number, value: string) => void;
  onAddTag: (field: Exclude<MemberTagField, "ageRange">, value: string) => void;
  onRemoveTag: (field: Exclude<MemberTagField, "ageRange">, index: number) => void;
  onRemoveMember: () => void;
}

const tagRows: {
  field: Exclude<MemberTagField, "ageRange">;
  label: string;
  tone: "tomato" | "turmeric" | "neutral";
}[] = [
  { field: "dietaryRestrictions", label: "Restrictions", tone: "tomato" },
  { field: "dislikedFoods", label: "Won't touch", tone: "neutral" },
  { field: "favoriteFoods", label: "Loves", tone: "turmeric" },
];

export function MemberCard({
  member,
  onUpdateName,
  onUpdateAgeRange,
  onUpdateTag,
  onAddTag,
  onRemoveTag,
  onRemoveMember,
}: MemberCardProps) {
  return (
    <div className={`flex flex-col gap-3 p-5 ${CARD_SURFACE}`}>
      <div className="flex items-center justify-between gap-3">
        <input
          value={member.name}
          onChange={(e) => onUpdateName(e.target.value)}
          placeholder="Name"
          aria-label="Member name"
          className={`font-display text-lg text-ink outline-none bg-transparent ${FOCUS_RING}`}
        />
        <button
          type="button"
          onClick={onRemoveMember}
          className={`text-xs text-muted hover:text-tomato ${FOCUS_RING}`}
        >
          remove
        </button>
      </div>

      <div className="self-start">
        <EditableChip value={member.ageRange || "age?"} onCommit={onUpdateAgeRange} tone="neutral" />
      </div>

      {tagRows.map(({ field, label, tone }) => (
        <div key={field} className="flex flex-col gap-1.5">
          <span className="text-xs uppercase tracking-wide text-muted">{label}</span>
          <div className="flex flex-wrap gap-2">
            {member[field].map((value, index) => (
              <EditableChip
                key={`${field}-${index}`}
                value={value}
                tone={tone}
                onCommit={(v) => onUpdateTag(field, index, v)}
                onRemove={() => onRemoveTag(field, index)}
              />
            ))}
            <AddTagButton onAdd={(v) => onAddTag(field, v)} />
          </div>
        </div>
      ))}
    </div>
  );
}
