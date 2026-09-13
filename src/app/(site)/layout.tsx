import type { ReactNode } from "react";
import { SiteHeader } from "@/components/layout/site-header";
import { SiteFooter } from "@/components/layout/site-footer";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";

/**
 * Public storefront shell (header/footer/WhatsApp FAB). Kept out of the
 * root layout so /admin/** can use its own dashboard shell instead of the
 * marketing chrome — see src/app/admin/(dashboard)/layout.tsx.
 */
export default function SiteLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <SiteHeader />
      <main className="flex-1">{children}</main>
      <SiteFooter />
      <WhatsAppButton variant="fab" />
    </>
  );
}
