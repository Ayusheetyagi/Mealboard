"use client";

import { type ButtonHTMLAttributes } from "react";
import { FOCUS_RING } from "@/lib/styles";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "ghost";
}

export function Button({ variant = "primary", className = "", ...props }: ButtonProps) {
  const base =
    "rounded-full px-5 py-2.5 text-sm font-medium transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:translate-y-0 disabled:hover:shadow-none";
  const variants = {
    primary:
      "bg-tomato text-white shadow-[0_2px_8px_-2px_rgba(193,67,46,0.5)] hover:bg-tomato/90 hover:-translate-y-0.5 hover:shadow-[0_6px_16px_-4px_rgba(193,67,46,0.55)] active:translate-y-0",
    ghost:
      "bg-white text-ink border border-ink/10 shadow-[0_1px_3px_rgba(31,42,36,0.06)] hover:border-ink/20 hover:-translate-y-0.5 hover:shadow-[0_4px_10px_-4px_rgba(31,42,36,0.15)] active:translate-y-0",
  };
  return (
    <button
      className={`${base} ${variants[variant]} ${FOCUS_RING} ${className}`}
      {...props}
    />
  );
}
