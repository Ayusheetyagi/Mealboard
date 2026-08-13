"use client";

import { motion, type Variants } from "framer-motion";

const chipVariants: Variants = {
  hidden: { opacity: 0, scale: 0.6, y: 8, rotate: -4 },
  visible: {
    opacity: 1,
    scale: 1,
    y: 0,
    rotate: 0,
    transition: { type: "spring", stiffness: 260, damping: 20 },
  },
};

interface ChipProps {
  label: string;
  tone?: "tomato" | "turmeric" | "neutral";
  reduceMotion?: boolean;
}

const toneClasses: Record<NonNullable<ChipProps["tone"]>, string> = {
  tomato: "bg-tomato text-white",
  turmeric: "bg-turmeric text-ink",
  neutral: "bg-white text-ink border border-muted/30",
};

export function Chip({ label, tone = "neutral", reduceMotion = false }: ChipProps) {
  return (
    <motion.li
      variants={reduceMotion ? undefined : chipVariants}
      className={`inline-flex items-center rounded-full px-3 py-1 font-mono text-xs ${toneClasses[tone]}`}
    >
      {label}
    </motion.li>
  );
}
