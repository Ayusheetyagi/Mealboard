"use client";

import { useState } from "react";
import Link from "next/link";
import { RecipeCard } from "@/components/plan/RecipeCard";
import { GroceryList } from "@/components/plan/GroceryList";
import { Button } from "@/components/ui/Button";
import { FOCUS_RING } from "@/lib/styles";
import type { WeeklyPlan, WeeklyRecipe } from "@/lib/meal-plan";
import type { FamilyProfile } from "@/types/family";

interface WeeklyPlanViewProps {
  profile: FamilyProfile;
  initialPlan: WeeklyPlan | null;
  isAuthenticated: boolean;
  weeklyEmailOptIn: boolean;
  onToggleWeeklyEmail: (optIn: boolean) => void;
}

const DAY_ORDER = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
const MEAL_TYPE_ORDER = ["breakfast", "lunch", "dinner"];

function groupByDay(recipes: WeeklyRecipe[]): [string, WeeklyRecipe[]][] {
  const groups = new Map<string, WeeklyRecipe[]>();
  for (const recipe of recipes) {
    const meals = groups.get(recipe.day) ?? [];
    meals.push(recipe);
    groups.set(recipe.day, meals);
  }
  for (const meals of Array.from(groups.values())) {
    meals.sort(
      (a: WeeklyRecipe, b: WeeklyRecipe) =>
        MEAL_TYPE_ORDER.indexOf(a.mealType) - MEAL_TYPE_ORDER.indexOf(b.mealType),
    );
  }
  return Array.from(groups.entries()).sort(
    ([a], [b]) => DAY_ORDER.indexOf(a) - DAY_ORDER.indexOf(b),
  );
}

export function WeeklyPlanView({
  profile,
  initialPlan,
  isAuthenticated,
  weeklyEmailOptIn,
  onToggleWeeklyEmail,
}: WeeklyPlanViewProps) {
  const [plan, setPlan] = useState<WeeklyPlan | null>(initialPlan);
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function generate() {
    setIsGenerating(true);
    setError(null);
    try {
      const res = await fetch("/api/plan-week", {
        method: "POST",
        ...(isAuthenticated
          ? {}
          : {
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ profile }),
            }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
        return;
      }
      setPlan(data.plan as WeeklyPlan);
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  const emailPrompt = isAuthenticated ? (
    <label className="flex items-center gap-3 rounded-lg px-1 py-1 text-sm text-ink">
      <input
        type="checkbox"
        checked={weeklyEmailOptIn}
        onChange={(e) => onToggleWeeklyEmail(e.target.checked)}
        className={`h-4 w-4 rounded accent-tomato ${FOCUS_RING}`}
      />
      Email me this plan every week
    </label>
  ) : (
    <p className="text-sm text-muted">
      Want to get this emailed every week?{" "}
      <Link href="/login" className={`text-tomato underline underline-offset-2 ${FOCUS_RING}`}>
        Sign in
      </Link>
    </p>
  );

  if (!plan) {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex flex-col gap-1">
          <h2 className="font-display text-2xl text-ink">Your week</h2>
          <p className="text-sm text-muted">
            We&apos;ll put together recipes that work for everyone and build a grocery list to match.
          </p>
        </div>
        {error && (
          <p role="alert" className="text-sm text-tomato">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={generate} disabled={isGenerating}>
            {isGenerating ? "Finding recipes…" : "Generate my week"}
          </Button>
          {emailPrompt}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-10">
      <div className="flex flex-col gap-3">
        <h2 className="font-display text-2xl text-ink">Your week</h2>
        {error && (
          <p role="alert" className="text-sm text-tomato">
            {error}
          </p>
        )}
        <div className="flex flex-wrap items-center gap-4">
          <Button onClick={generate} disabled={isGenerating} variant="ghost">
            {isGenerating ? "Regenerating…" : "Regenerate this week"}
          </Button>
          {emailPrompt}
        </div>
      </div>

      <div className="flex flex-col gap-8">
        {groupByDay(plan.recipes).map(([day, meals]) => (
          <div key={day} className="flex flex-col gap-3">
            <h3 className="font-display text-xl text-ink">{day}</h3>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {meals.map((recipe) => (
                <RecipeCard key={recipe.id} recipe={recipe} />
              ))}
            </div>
          </div>
        ))}
      </div>

      <div className="flex flex-col gap-3">
        <h3 className="font-display text-2xl text-ink">Grocery list</h3>
        <GroceryList items={plan.groceryList} />
      </div>
    </div>
  );
}
