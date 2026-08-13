interface IconProps {
  className?: string;
}

/** Simple flat food/grocery illustrations, drawn to match the app's own palette
 *  (tomato/turmeric/ink) rather than pulling in external stock photography.
 *  Every shape carries a thin ink outline so it stays legible even at the
 *  very low opacity these render at as background texture. */

const OUTLINE = { stroke: "#1F2A24", strokeWidth: 1.5 };

export function TomatoIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <circle cx="32" cy="36" r="22" fill="#C1432E" {...OUTLINE} />
      <path
        d="M32 16c-3-4-8-5-12-3 3 1 5 3 6 6-3-1-7 0-9 3 3 0 6 1 8 3"
        stroke="#8A9A6E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
      <path
        d="M32 16c3-4 8-5 12-3-3 1-5 3-6 6 3-1 7 0 9 3-3 0-6 1-8 3"
        stroke="#8A9A6E"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}

export function CarrotIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M22 24c0-5 4-8 10-8s10 3 10 8c0 14-4 28-10 34-6-6-10-20-10-34Z"
        fill="#D9A02A"
        {...OUTLINE}
      />
      <path
        d="M32 16c0-8-2-14-6-18M32 16c0-9 3-15 8-19M32 16c-3-7-8-11-13-13"
        stroke="#8A9A6E"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
    </svg>
  );
}

export function HerbSprigIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path d="M32 12v40" stroke="#8A9A6E" strokeWidth="2.5" strokeLinecap="round" />
      <ellipse cx="24" cy="22" rx="8" ry="4" fill="#8A9A6E" transform="rotate(-35 24 22)" />
      <ellipse cx="40" cy="22" rx="8" ry="4" fill="#8A9A6E" transform="rotate(35 40 22)" />
      <ellipse cx="22" cy="34" rx="8" ry="4" fill="#8A9A6E" transform="rotate(-35 22 34)" />
      <ellipse cx="42" cy="34" rx="8" ry="4" fill="#8A9A6E" transform="rotate(35 42 34)" />
      <ellipse cx="26" cy="46" rx="7" ry="3.5" fill="#8A9A6E" transform="rotate(-30 26 46)" />
      <ellipse cx="38" cy="46" rx="7" ry="3.5" fill="#8A9A6E" transform="rotate(30 38 46)" />
    </svg>
  );
}

export function BreadIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path
        d="M8 36c0-13 11-22 24-22s24 9 24 22c0 9-6 15-24 15S8 45 8 36Z"
        fill="#D9A02A"
        {...OUTLINE}
      />
      <path
        d="M20 30c2-5 6-8 12-8s10 3 12 8M18 39c3-2 7-3 14-3s11 1 14 3"
        stroke="#1F2A24"
        strokeWidth="1.5"
        strokeLinecap="round"
        fill="none"
        opacity="0.6"
      />
    </svg>
  );
}

export function GroceryBagIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path d="M13 22h38l-4 36H17Z" fill="#C1432E" {...OUTLINE} strokeLinejoin="round" />
      <path
        d="M22 22c0-7 4-12 10-12s10 5 10 12"
        stroke="#1F2A24"
        strokeWidth="2.5"
        strokeLinecap="round"
        fill="none"
      />
      <path d="M25 30l3 18M39 30l-3 18M32 30v18" stroke="#EFF2E9" strokeWidth="2" strokeLinecap="round" opacity="0.7" />
    </svg>
  );
}

export function BowlIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 64 64" fill="none" className={className} aria-hidden="true">
      <path d="M8 28h48c0 14-10 24-24 24S8 42 8 28Z" fill="#1F2A24" {...OUTLINE} />
      <path d="M8 28c0-2 1-3 2-3h44c1 0 2 1 2 3" stroke="#1F2A24" strokeWidth="1.5" fill="none" />
      <circle cx="24" cy="20" r="4" fill="#C1432E" stroke="#1F2A24" strokeWidth="1.2" />
      <circle cx="34" cy="16" r="3.5" fill="#D9A02A" stroke="#1F2A24" strokeWidth="1.2" />
      <circle cx="42" cy="22" r="4" fill="#8A9A6E" stroke="#1F2A24" strokeWidth="1.2" />
    </svg>
  );
}
