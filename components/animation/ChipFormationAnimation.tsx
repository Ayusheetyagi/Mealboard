"use client";

import { useEffect, useRef } from "react";
import { motion, type Variants } from "framer-motion";
import { FamilyMemberCluster } from "@/components/animation/FamilyMemberCluster";
import { usePrefersReducedMotion } from "@/lib/usePrefersReducedMotion";
import type { FamilyMember } from "@/types/family";

/** Generous upper bound on how long the stagger animation should ever take —
 *  a safety net in case the animation library's completion callback doesn't
 *  fire (this gates saving the user's data, so it must never get stuck). */
const COMPLETION_FALLBACK_MS = 3000;

interface ChipFormationAnimationProps {
  rawText: string;
  members: FamilyMember[];
  onComplete: () => void;
}

const wordVariants: Variants = {
  visible: { opacity: 1, y: 0, filter: "blur(0px)" },
  hidden: {
    opacity: 0,
    y: -6,
    filter: "blur(3px)",
    transition: { duration: 0.5 },
  },
};

const chipLayerVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.12, delayChildren: 0.3 },
  },
};

export function ChipFormationAnimation({ rawText, members, onComplete }: ChipFormationAnimationProps) {
  const reduceMotion = usePrefersReducedMotion();
  const words = rawText.split(/\s+/).filter(Boolean);
  const completedRef = useRef(false);

  function completeOnce() {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  }

  // Reduced motion: skip the sequence entirely, show the end state immediately.
  useEffect(() => {
    if (reduceMotion) completeOnce();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  // Fallback in case the animation library's onAnimationComplete never fires.
  useEffect(() => {
    if (reduceMotion) return;
    const timer = setTimeout(completeOnce, COMPLETION_FALLBACK_MS);
    return () => clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reduceMotion]);

  if (reduceMotion) {
    return (
      <ul className="flex flex-col gap-3">
        {members.map((member) => (
          <FamilyMemberCluster key={member.id} member={member} reduceMotion />
        ))}
      </ul>
    );
  }

  return (
    <div className="relative min-h-[16rem]">
      <motion.p
        aria-hidden="true"
        initial="visible"
        animate="hidden"
        className="pointer-events-none absolute inset-0 leading-relaxed text-muted"
      >
        {words.map((word, i) => (
          <motion.span key={i} variants={wordVariants} className="mr-1 inline-block">
            {word}
          </motion.span>
        ))}
      </motion.p>

      <motion.ul
        initial="hidden"
        animate="visible"
        variants={chipLayerVariants}
        onAnimationComplete={completeOnce}
        className="flex flex-col gap-3"
      >
        {members.map((member) => (
          <FamilyMemberCluster key={member.id} member={member} />
        ))}
      </motion.ul>
    </div>
  );
}
