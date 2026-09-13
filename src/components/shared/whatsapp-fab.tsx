import { MessageCircle } from "lucide-react";
import { SITE_CONFIG } from "@/lib/constants/site";

/**
 * Site-wide floating action button for general WhatsApp contact. Per-product
 * "Order on WhatsApp" buttons use `buildWhatsAppOrderLink` (lib/whatsapp.ts)
 * instead, so the pre-filled message includes the actual item(s).
 */
export function WhatsAppFab() {
  const message = encodeURIComponent(
    "Hello Martin Sports, I have a question about your products.",
  );
  const href = `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${message}`;

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat with Martin Sports on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg shadow-black/30 transition-transform hover:scale-105"
    >
      <MessageCircle className="size-6" strokeWidth={2} />
    </a>
  );
}
