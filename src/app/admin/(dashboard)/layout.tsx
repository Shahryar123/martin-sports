import type { ReactNode } from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getSession } from "@/lib/auth/session";
import { logoutAdminAction } from "@/lib/actions/admin-auth";
import { Button } from "@/components/ui/button";

const ADMIN_NAV = [
  { label: "Dashboard", href: "/admin" },
  { label: "Products", href: "/admin/products" },
  { label: "Ambassadors", href: "/admin/ambassadors" },
  { label: "Inquiries", href: "/admin/inquiries" },
];

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
        <nav className="space-y-1">
          {ADMIN_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="block rounded-md px-3 py-2 text-sm text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </aside>

      <div className="flex flex-1 flex-col">
        <header className="flex items-center justify-between border-b border-border bg-card px-6 py-4">
          <p className="text-sm text-muted-foreground">
            Signed in as{" "}
            <span className="text-foreground">{session.email}</span>
          </p>
          <form action={logoutAdminAction}>
            <Button type="submit" variant="outline" size="sm">
              Sign out
            </Button>
          </form>
        </header>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </div>
  );
}
