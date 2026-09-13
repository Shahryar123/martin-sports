import Link from "next/link";
import { FOOTER_NAV, LEGAL_NAV } from "@/lib/constants/nav";
import { SITE_CONFIG } from "@/lib/constants/site";
import { Container } from "@/components/shared/container";
import { Caption } from "@/components/ui/typography";
import { InstagramIcon, FacebookIcon, YoutubeIcon, TiktokIcon } from "@/components/icons/social-icons";

const SOCIAL_LINKS = [
  { key: "instagram", href: SITE_CONFIG.social.instagram, icon: InstagramIcon, label: "Instagram" },
  { key: "facebook", href: SITE_CONFIG.social.facebook, icon: FacebookIcon, label: "Facebook" },
  { key: "tiktok", href: SITE_CONFIG.social.tiktok, icon: TiktokIcon, label: "TikTok" },
  { key: "youtube", href: SITE_CONFIG.social.youtube, icon: YoutubeIcon, label: "YouTube" },
].filter((social) => social.href);

export function SiteFooter() {
  return (
    <footer className="border-t border-border bg-surface-0">
      <Container className="py-12">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-4">
          <div className="col-span-2 md:col-span-1">
            <p className="font-heading text-lg font-semibold text-foreground">
              {SITE_CONFIG.name}
            </p>
            <p className="mt-2 text-sm text-foreground-secondary">
              {SITE_CONFIG.tagline}
            </p>
            <p className="mt-4 text-sm text-muted-foreground">
              {SITE_CONFIG.contact.address}
            </p>

            {SOCIAL_LINKS.length > 0 && (
              <div className="mt-5 flex items-center gap-2">
                {SOCIAL_LINKS.map(({ key, href, icon: Icon, label }) => (
                  <a
                    key={key}
                    href={href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={label}
                    className="flex size-9 items-center justify-center rounded-full border border-border text-muted-foreground transition-colors hover:border-brand/40 hover:text-brand"
                  >
                    <Icon className="size-4" strokeWidth={1.75} />
                  </a>
                ))}
              </div>
            )}
          </div>

          {FOOTER_NAV.map((section) => (
            <div key={section.title}>
              <p className="text-sm font-semibold text-foreground">
                {section.title}
              </p>
              <ul className="mt-3 space-y-2">
                {section.links.map((link) => (
                  <li key={link.label}>
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

        <div className="mt-10 flex flex-col gap-4 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
          <Caption>
            © {new Date().getFullYear()} {SITE_CONFIG.legalName}. Nationwide
            delivery across Pakistan · Cash on Delivery.
          </Caption>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            {LEGAL_NAV.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-xs text-muted-foreground transition-colors hover:text-foreground"
              >
                {link.label}
              </Link>
            ))}
            <Caption className="text-muted-foreground">
              {SITE_CONFIG.contact.phone}
            </Caption>
          </div>
        </div>
      </Container>
    </footer>
  );
}
