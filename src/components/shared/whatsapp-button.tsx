"use client";

import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppOrderLink } from "@/lib/whatsapp";
import { SITE_CONFIG } from "@/lib/constants/site";
import { cn } from "@/lib/utils";
import type { CartLineItem } from "@/types";

type WhatsAppButtonProps = {
  /** "fab" = fixed floating round button (site-wide contact). Any other
   * variant renders an inline shadcn Button styled as a WhatsApp CTA. */
  variant?: "fab" | "default" | "outline" | "secondary";
  size?: "default" | "sm" | "lg";
  label?: string;
  /** Order context — when given, the message lists these item(s) instead
   * of the generic contact greeting. */
  items?: CartLineItem[];
  className?: string;
};

const GENERIC_MESSAGE =
  "Hello Martin Sports, I have a question about your products.";

function buildHref(items?: CartLineItem[]) {
  if (items?.length) {
    return buildWhatsAppOrderLink({ items });
  }
  return `https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(GENERIC_MESSAGE)}`;
}

/**
 * Single reusable WhatsApp CTA used everywhere the site links out to
 * WhatsApp: the floating contact button, the header CTA, per-product
 * ordering, and the contact page. Keeping one component means the wa.me
 * link format and message copy only need to be right in one place.
 */
export function WhatsAppButton({
  variant = "default",
  size = "default",
  label = "Order via WhatsApp",
  items,
  className,
}: WhatsAppButtonProps) {
  const href = buildHref(items);

  if (variant === "fab") {
    return (
      <motion.a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat with Martin Sports on WhatsApp"
        initial={{ opacity: 0, scale: 0.6, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        whileHover={{ scale: 1.06 }}
        whileTap={{ scale: 0.96 }}
        className={cn(
          "fixed right-6 bottom-6 z-50 flex size-14 items-center justify-center rounded-full bg-brand text-brand-foreground shadow-lg shadow-black/30",
          className,
        )}
      >
        <MessageCircle className="size-6" strokeWidth={2} />
      </motion.a>
    );
  }

  return (
    <Button asChild variant={variant} size={size} className={className}>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-4" />
        {label}
      </a>
    </Button>
  );
}
