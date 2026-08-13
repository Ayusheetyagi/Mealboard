import Link from "next/link";
import { FOCUS_RING } from "@/lib/styles";

export function SiteHeader() {
  return (
    <header className="border-b border-ink/5 bg-background/85 backdrop-blur-sm">
      <div className="mx-auto flex max-w-4xl items-center px-6 py-4">
        <Link
          href="/"
          className={`font-display text-lg text-ink transition-colors hover:text-tomato ${FOCUS_RING} rounded`}
        >
          Family Meal Planner
        </Link>
      </div>
    </header>
  );
}
