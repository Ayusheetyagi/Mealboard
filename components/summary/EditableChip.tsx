"use client";

import { useState } from "react";
import { FOCUS_RING } from "@/lib/styles";

interface EditableChipProps {
  value: string;
  tone?: "tomato" | "turmeric" | "neutral";
  onCommit: (value: string) => void;
  onRemove?: () => void;
  placeholder?: string;
}

const toneClasses: Record<NonNullable<EditableChipProps["tone"]>, string> = {
  tomato: "bg-tomato text-white",
  turmeric: "bg-turmeric text-ink",
  neutral: "bg-white text-ink border border-muted/30",
};

export function EditableChip({
  value,
  tone = "neutral",
  onCommit,
  onRemove,
  placeholder,
}: EditableChipProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [draft, setDraft] = useState(value);

  function commit() {
    setIsEditing(false);
    const trimmed = draft.trim();
    if (trimmed && trimmed !== value) onCommit(trimmed);
    else setDraft(value);
  }

  function cancel() {
    setDraft(value);
    setIsEditing(false);
  }

  if (isEditing) {
    return (
      <input
        autoFocus
        value={draft}
        placeholder={placeholder}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") cancel();
        }}
        className={`w-28 rounded-full bg-white px-3 py-1 font-mono text-xs text-ink outline-none ring-2 ring-tomato ${FOCUS_RING}`}
      />
    );
  }

  return (
    <span
      className={`group inline-flex items-center gap-1 rounded-full px-3 py-1 font-mono text-xs ${toneClasses[tone]}`}
    >
      <button
        type="button"
        onClick={() => setIsEditing(true)}
        className={`rounded-full ${FOCUS_RING}`}
        aria-label={`Edit ${value}`}
      >
        {value}
      </button>
      {onRemove && (
        <button
          type="button"
          onClick={onRemove}
          className={`rounded-full opacity-60 hover:opacity-100 ${FOCUS_RING}`}
          aria-label={`Remove ${value}`}
        >
          ×
        </button>
      )}
    </span>
  );
}
