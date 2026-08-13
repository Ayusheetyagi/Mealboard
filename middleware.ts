import type { NextRequest } from "next/server";
import { updateSession } from "@/lib/supabase/middleware";

export async function middleware(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - static assets and images handled by Next.js
     * - the cron route, which is guarded by its own CRON_SECRET check
     */
    "/((?!_next/static|_next/image|favicon.ico|api/cron).*)",
  ],
};
