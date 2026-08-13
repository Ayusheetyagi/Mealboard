"use client";

import { type TextareaHTMLAttributes } from "react";
import { FOCUS_RING } from "@/lib/styles";

export function PromptTextarea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      {...props}
      className={`w-full rounded-2xl border border-ink/5 bg-white p-5 text-base leading-relaxed text-ink shadow-[0_1px_2px_rgba(31,42,36,0.04),0_8px_24px_-8px_rgba(31,42,36,0.12)] placeholder:text-muted/70 ${FOCUS_RING} ${props.className ?? ""}`}
    />
  );
}
