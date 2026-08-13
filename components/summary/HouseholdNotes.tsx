"use client";

import { EditableChip } from "@/components/summary/EditableChip";
import { AddTagButton } from "@/components/summary/AddTagButton";

interface HouseholdNotesProps {
  notes: string[];
  onUpdateNote: (index: number, value: string) => void;
  onAddNote: (value: string) => void;
  onRemoveNote: (index: number) => void;
}

export function HouseholdNotes({ notes, onUpdateNote, onAddNote, onRemoveNote }: HouseholdNotesProps) {
  return (
    <div className="flex flex-col gap-1.5">
      <span className="text-xs uppercase tracking-wide text-muted">Household notes</span>
      <div className="flex flex-wrap gap-2">
        {notes.map((note, index) => (
          <EditableChip
            key={index}
            value={note}
            tone="neutral"
            onCommit={(v) => onUpdateNote(index, v)}
            onRemove={() => onRemoveNote(index)}
          />
        ))}
        <AddTagButton onAdd={onAddNote} label="+ add note" />
      </div>
    </div>
  );
}
