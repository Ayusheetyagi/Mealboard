"use client";

import { motion, type Variants } from "framer-motion";
import { Chip } from "@/components/animation/Chip";
import { pickSignatureTags } from "@/lib/animation-helpers";
import type { FamilyMember } from "@/types/family";

const clusterVariants: Variants = {
  hidden: {},
  visible: {
    transition: { staggerChildren: 0.08 },
  },
};

interface FamilyMemberClusterProps {
  member: FamilyMember;
  reduceMotion?: boolean;
}

export function FamilyMemberCluster({ member, reduceMotion = false }: FamilyMemberClusterProps) {
  const tags = pickSignatureTags(member);

  return (
    <motion.li
      variants={reduceMotion ? undefined : clusterVariants}
      className="flex flex-col gap-2 rounded-2xl border border-muted/20 bg-background/60 p-4"
    >
      <span className="font-display text-lg text-ink">{member.name}</span>
      <motion.ul
        variants={reduceMotion ? undefined : clusterVariants}
        className="flex flex-wrap gap-2"
      >
        {tags.map((tag, i) => (
          <Chip
            key={`${member.id}-${i}`}
            label={tag}
            tone={i === 0 ? "tomato" : i === 1 ? "turmeric" : "neutral"}
            reduceMotion={reduceMotion}
          />
        ))}
      </motion.ul>
    </motion.li>
  );
}
