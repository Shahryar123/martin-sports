import type { ReactNode } from "react";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { logoutAdminAction } from "@/lib/actions/admin-auth";
import { Button } from "@/components/ui/button";
import { AdminNavLinks } from "@/components/admin/admin-nav";
import { AdminMobileNav } from "@/components/admin/admin-mobile-nav";

export default async function AdminLayout({
  children,
}: {
  children: ReactNode;
}) {
  // proxy.ts already guards /admin/**; this check is defense in depth and
  // gives us the session payload (admin email) to render.
  const session = await getSession();
  if (!session) {
    redirect("/admin/login");
  }

  return (
    <div className="flex min-h-screen bg-background">
      <aside className="hidden w-64 shrink-0 border-r border-border bg-card px-4 py-6 md:block">
        <div className="mb-8 px-2">
          <p className="font-heading text-lg font-semibold text-foreground">
            Martin Sports
          </p>
          <p className="text-xs text-muted-foreground">Admin Dashboard</p>
        </div>
        <AdminNavLinks />
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between gap-3 border-b border-border bg-card px-4 py-4 sm:px-6">
          <div className="flex items-center gap-3">
            <AdminMobileNav />
            <p className="text-sm text-muted-foreground">
              Signed in as{" "}
              <span className="text-foreground">{session.email}</span>
            </p>
          </div>
          <form action={logoutAdminAction}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </header>
        <main id="main-content" className="flex-1 p-4 sm:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
