"use server";

import { createClient } from "@/lib/supabase/server";
import type { FamilyProfile } from "@/types/family";

export async function saveFamilyProfileAction(profile: FamilyProfile): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { error } = await supabase
    .from("family_profiles")
    .update({ profile, updated_at: new Date().toISOString() })
    .eq("user_id", user.id);

  if (error) throw new Error("Couldn't save your changes.");
}

export async function setWeeklyEmailOptInAction(optIn: boolean): Promise<void> {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error("Not signed in.");

  const { error } = await supabase
    .from("family_profiles")
    .update({ weekly_email_opt_in: optIn })
    .eq("user_id", user.id);

  if (error) throw new Error("Couldn't update your email preference.");
}
