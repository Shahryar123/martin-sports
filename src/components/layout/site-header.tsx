import Link from "next/link";
import { PRIMARY_NAV } from "@/lib/constants/nav";
import { SITE_CONFIG } from "@/lib/constants/site";
import { Button } from "@/components/ui/button";

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface-0/90 backdrop-blur supports-[backdrop-filter]:bg-surface-0/75">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="font-heading text-xl font-semibold tracking-tight text-foreground">
          {SITE_CONFIG.name}
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {PRIMARY_NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-2">
          <Button asChild size="sm">
            <Link href="/contact">Order via WhatsApp</Link>
          </Button>
        </div>
      </div>
    </header>
  );
}
