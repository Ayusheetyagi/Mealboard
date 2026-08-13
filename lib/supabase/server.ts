import "server-only";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

/** For Server Components, Server Actions, and Route Handlers — reads/writes the
 *  session via the request's cookies. Server Components can't set cookies, so
 *  writes from there are silently ignored (the session is refreshed by middleware
 *  on the next request instead). */
export function createClient() {
  const cookieStore = cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll: () => cookieStore.getAll(),
        setAll: (cookiesToSet) => {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options),
            );
          } catch {
            // Called from a Server Component — no-op, middleware refreshes instead.
          }
        },
      },
    },
  );
}
