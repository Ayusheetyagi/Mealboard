"use client";

import { useState } from "react";
import { FOCUS_RING } from "@/lib/styles";

interface AddTagButtonProps {
  onAdd: (value: string) => void;
  label?: string;
}

export function AddTagButton({ onAdd, label = "+ add" }: AddTagButtonProps) {
  const [isAdding, setIsAdding] = useState(false);
  const [draft, setDraft] = useState("");

  function commit() {
    const trimmed = draft.trim();
    if (trimmed) onAdd(trimmed);
    setDraft("");
    setIsAdding(false);
  }

  if (isAdding) {
    return (
      <input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === "Enter") commit();
          if (e.key === "Escape") {
            setDraft("");
            setIsAdding(false);
          }
        }}
        placeholder="type and press enter"
        className={`w-32 rounded-full bg-white px-3 py-1 font-mono text-xs text-ink outline-none ring-2 ring-tomato ${FOCUS_RING}`}
      />
    );
  }

  return (
    <button
      type="button"
      onClick={() => setIsAdding(true)}
      className={`rounded-full border border-dashed border-muted/40 px-3 py-1 font-mono text-xs text-muted hover:border-muted hover:text-ink ${FOCUS_RING}`}
    >
      {label}
    </button>
  );
}
