import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { HomeView } from "@/components/home/HomeView";
import type { FamilyProfile } from "@/types/family";
import type { WeeklyPlan } from "@/lib/meal-plan";

export default async function Home() {
  let initialProfile: FamilyProfile | null = null;
  let initialWeeklyEmailOptIn = false;
  let initialPlan: WeeklyPlan | null = null;
  let isAuthenticated = false;

  if (isSupabaseConfigured()) {
    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();
    isAuthenticated = !!user;

    if (user) {
      const [{ data: profileRow }, { data: planRow }] = await Promise.all([
        supabase
          .from("family_profiles")
          .select("profile, weekly_email_opt_in")
          .eq("user_id", user.id)
          .single(),
        supabase.from("weekly_plans").select("plan").eq("user_id", user.id).single(),
      ]);

      initialProfile = (profileRow?.profile as FamilyProfile | undefined) ?? null;
      initialWeeklyEmailOptIn = profileRow?.weekly_email_opt_in ?? false;
      initialPlan = (planRow?.plan as WeeklyPlan | undefined) ?? null;
    }
  }

  return (
    <HomeView
      initialProfile={initialProfile}
      initialWeeklyEmailOptIn={initialWeeklyEmailOptIn}
      initialPlan={initialPlan}
      isAuthenticated={isAuthenticated}
    />
  );
}
