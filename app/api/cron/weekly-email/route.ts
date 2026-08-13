import { createAdminClient } from "@/lib/supabase/admin";
import { generateWeeklyPlan } from "@/lib/meal-plan";
import { renderWeeklyPlanEmail } from "@/lib/email-template";
import type { FamilyProfile } from "@/types/family";
import { Resend } from "resend";

// Deliberate cost guard: a scheduled job calling Claude + web search once per
// opted-in user, every week, has no human in the loop to notice a runaway bill
// if signups grow. Cap the batch size rather than processing everyone.
const MAX_WEEKLY_RECIPIENTS = 50;

export async function GET(request: Request) {
  const authHeader = request.headers.get("authorization");
  if (authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = createAdminClient();
  const { data: optedIn, error } = await supabase
    .from("family_profiles")
    .select("user_id, email, profile")
    .eq("weekly_email_opt_in", true)
    .limit(MAX_WEEKLY_RECIPIENTS);

  if (error) {
    console.error("[cron/weekly-email] failed to load subscribers:", error);
    return Response.json({ error: "Failed to load subscribers." }, { status: 500 });
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  const results = await Promise.allSettled(
    (optedIn ?? []).map(async (row) => {
      const profile = row.profile as FamilyProfile;
      if (!profile.members || profile.members.length === 0) return;

      const plan = await generateWeeklyPlan(profile);

      await supabase.from("weekly_plans").upsert({
        user_id: row.user_id,
        plan,
        generated_at: new Date().toISOString(),
      });

      await resend.emails.send({
        from: "Family Meal Planner <onboarding@resend.dev>",
        to: row.email,
        subject: "Your meal plan for this week",
        html: renderWeeklyPlanEmail(plan),
      });
    }),
  );

  const failed = results.filter((r) => r.status === "rejected");
  failed.forEach((r) => console.error("[cron/weekly-email] one recipient failed:", r.reason));

  return Response.json({
    total: optedIn?.length ?? 0,
    sent: results.length - failed.length,
    failed: failed.length,
  });
}
