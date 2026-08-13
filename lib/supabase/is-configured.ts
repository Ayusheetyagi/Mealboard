/** Supabase is optional infrastructure — only needed for the sign-in / weekly-email
 *  feature. Anonymous mode must work with none of these env vars set at all, so
 *  every Supabase touchpoint checks this before ever constructing a client. */
export function isSupabaseConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  );
}
