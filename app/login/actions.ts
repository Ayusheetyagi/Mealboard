"use server";

import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { isSupabaseConfigured } from "@/lib/supabase/is-configured";

export async function sendMagicLink(
  _prevState: { error?: string; success?: boolean },
  formData: FormData,
): Promise<{ error?: string; success?: boolean }> {
  if (!isSupabaseConfigured()) {
    return { error: "Sign-in isn't set up yet — check back soon." };
  }

  const email = String(formData.get("email") ?? "").trim();
  if (!email) return { error: "Enter your email first." };

  const origin = headers().get("origin");
  const supabase = createClient();
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${origin}/auth/callback` },
  });

  if (error) {
    console.error("[login] signInWithOtp failed:", error);
    return { error: "We couldn't send that link — please try again." };
  }
  return { success: true };
}

export async function signOut() {
  if (!isSupabaseConfigured()) return;
  const supabase = createClient();
  await supabase.auth.signOut();
}
