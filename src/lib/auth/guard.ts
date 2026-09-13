import "server-only";
import { getSession, type SessionPayload } from "@/lib/auth/session";

/**
 * `proxy.ts` and the dashboard layout already keep unauthenticated visitors
 * away from `/admin/**` pages, but Server Actions are independently callable
 * endpoints (a POST straight to their action id bypasses page-level guards),
 * so every mutating admin action must re-check the session itself. Call this
 * first thing in every admin server action.
 */
export class UnauthorizedError extends Error {
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export async function requireAdminSession(): Promise<SessionPayload> {
  const session = await getSession();
  if (!session) throw new UnauthorizedError();
  return session;
}
