"use client";

import { useState } from "react";
import { FamilyInputForm } from "@/components/landing/FamilyInputForm";
import { ChipFormationAnimation } from "@/components/animation/ChipFormationAnimation";
import { FamilySummaryCard } from "@/components/summary/FamilySummaryCard";
import { WeeklyPlanView } from "@/components/plan/WeeklyPlanView";
import { useFamilyProfile } from "@/lib/useFamilyProfile";
import { generateId } from "@/lib/id";
import { setWeeklyEmailOptInAction } from "@/app/actions/family-profile";
import { FOCUS_RING } from "@/lib/styles";
import type { FamilyProfile, ParsedFamilyProfile } from "@/types/family";
import type { WeeklyPlan } from "@/lib/meal-plan";

type ViewState =
  | { name: "input" }
  | { name: "animating"; rawText: string; hydratedProfile: FamilyProfile };

function hydrate(parsed: ParsedFamilyProfile): FamilyProfile {
  return {
    members: parsed.members.map((m) => ({ ...m, id: generateId() })),
    householdNotes: parsed.householdNotes,
  };
}

interface HomeViewProps {
  initialProfile: FamilyProfile | null;
  initialWeeklyEmailOptIn: boolean;
  initialPlan: WeeklyPlan | null;
  isAuthenticated: boolean;
}

export function HomeView({
  initialProfile,
  initialWeeklyEmailOptIn,
  initialPlan,
  isAuthenticated,
}: HomeViewProps) {
  const { profile, hydrated, updateProfile } = useFamilyProfile(initialProfile, isAuthenticated);
  const [view, setView] = useState<ViewState>({ name: "input" });
  const [weeklyEmailOptIn, setWeeklyEmailOptIn] = useState(initialWeeklyEmailOptIn);
  const [isRedescribing, setIsRedescribing] = useState(false);
  const hasProfile = !!profile && profile.members.length > 0;

  function handleToggleWeeklyEmail(optIn: boolean) {
    setWeeklyEmailOptIn(optIn);
    void setWeeklyEmailOptInAction(optIn).catch((err) => {
      console.error("[HomeView] failed to update weekly email preference:", err);
    });
  }

  if (!hydrated) return null;

  if (view.name === "animating") {
    return (
      <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-2xl flex-col justify-center px-6 py-16">
        <ChipFormationAnimation
          rawText={view.rawText}
          members={view.hydratedProfile.members}
          onComplete={() => {
            updateProfile(view.hydratedProfile);
            setIsRedescribing(false);
            setView({ name: "input" });
          }}
        />
      </main>
    );
  }

  // Either a returning visitor with a saved profile, or one who just finished animating.
  if (hasProfile && !isRedescribing) {
    return (
      <main className="mx-auto flex max-w-4xl flex-col gap-16 px-6 py-16">
        <FamilySummaryCard
          profile={profile}
          onChange={updateProfile}
          isAuthenticated={isAuthenticated}
          onStartOver={() => setIsRedescribing(true)}
        />
        <div id="your-week" className="scroll-mt-24 border-t border-ink/5 pt-8">
          <WeeklyPlanView
            profile={profile}
            initialPlan={initialPlan}
            isAuthenticated={isAuthenticated}
            weeklyEmailOptIn={weeklyEmailOptIn}
            onToggleWeeklyEmail={handleToggleWeeklyEmail}
          />
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-65px)] max-w-2xl flex-col justify-center gap-6 px-6 py-16">
      <div className="flex flex-col gap-2">
        <h1 className="font-display text-3xl text-ink">
          {isRedescribing ? "Describe your family again" : "Let's get to know your family"}
        </h1>
        <p className="text-sm text-muted">
          {isRedescribing
            ? "Tell us what's changed, or just describe your family fresh — this will replace what we have now."
            : "Describe them once, in your own words. We'll remember it and plan your week from there."}
        </p>
      </div>
      <FamilyInputForm
        onParsed={(parsed, rawText) => {
          setView({ name: "animating", rawText, hydratedProfile: hydrate(parsed) });
        }}
      />
      {isRedescribing && (
        <button
          type="button"
          onClick={() => setIsRedescribing(false)}
          className={`self-start text-sm text-muted underline underline-offset-2 hover:text-ink ${FOCUS_RING}`}
        >
          Cancel and go back
        </button>
      )}
    </main>
  );
}
