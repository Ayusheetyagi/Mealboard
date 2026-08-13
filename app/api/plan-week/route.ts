import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";
import { generateWeeklyPlan } from "@/lib/meal-plan";
import { isValidFamilyProfile } from "@/lib/storage";
import type { FamilyProfile } from "@/types/family";
import type { SupabaseClient } from "@supabase/supabase-js";

export async function POST(request: Request) {
  let supabase: SupabaseClient | null = null;
  let user: { id: string } | null = null;

  if (isSupabaseConfigured()) {
    supabase = createClient();
    const {
      data: { user: sessionUser },
    } = await supabase.auth.getUser();
    user = sessionUser;
  }

  let profile: FamilyProfile;

  if (user && supabase) {
    const { data: row } = await supabase
      .from("family_profiles")
      .select("profile")
      .eq("user_id", user.id)
      .single();

    profile = (row?.profile as FamilyProfile | undefined) ?? { members: [], householdNotes: [] };
    if (profile.members.length === 0) {
      return NextResponse.json(
        { error: "Tell us about your family first." },
        { status: 400 },
      );
    }
  } else {
    let body: { profile?: unknown } = {};
    try {
      body = await request.json();
    } catch {
      // fall through to the validation error below
    }
    if (!isValidFamilyProfile(body.profile) || body.profile.members.length === 0) {
      return NextResponse.json(
        { error: "Tell us about your family first." },
        { status: 400 },
      );
    }
    profile = body.profile;
  }

  try {
    const plan = await generateWeeklyPlan(profile);
    if (user && supabase) {
      await supabase.from("weekly_plans").upsert({
        user_id: user.id,
        plan,
        generated_at: new Date().toISOString(),
      });
    }
    return NextResponse.json({ plan });
  } catch (err) {
    console.error("[plan-week] failed:", err);
    return NextResponse.json(
      { error: "We couldn't build your plan just now. Please try again." },
      { status: 502 },
    );
  }
}
