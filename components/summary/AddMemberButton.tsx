"use client";

import { FOCUS_RING } from "@/lib/styles";

interface AddMemberButtonProps {
  onAdd: () => void;
}

export function AddMemberButton({ onAdd }: AddMemberButtonProps) {
  return (
    <button
      type="button"
      onClick={onAdd}
      className={`self-start rounded-full border border-dashed border-muted/40 px-4 py-2 text-sm text-muted hover:border-muted hover:text-ink ${FOCUS_RING}`}
    >
      + add family member
    </button>
  );
}
