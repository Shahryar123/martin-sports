import Link from "next/link";
import { FOOTER_NAV } from "@/lib/constants/nav";
import { SITE_CONFIG } from "@/lib/constants/site";

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-0">
      <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="font-heading text-lg font-semibold text-foreground">
              {SITE_CONFIG.name}
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {SITE_CONFIG.tagline}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {SITE_CONFIG.contact.address}
            </p>
          </div>

          {FOOTER_NAV.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold text-foreground">
                {section.title}
              </p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 flex flex-col gap-2 border-t border-border pt-6 text-xs text-muted-foreground sm:flex-row sm:items-center sm:justify-between">
          <p>
            © {new Date().getFullYear()} {SITE_CONFIG.legalName}. Nationwide
            delivery across Pakistan · Cash on Delivery.
          </p>
          <p>{SITE_CONFIG.contact.phone}</p>
        </div>
      </div>
    </footer>
  );
}
