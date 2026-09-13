"use client";

import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { buildWhatsAppSingleItemLink } from "@/lib/whatsapp";
import type { Product } from "@/types";

export function OrderOnWhatsAppButton({ product }: { product: Product }) {
  const href = buildWhatsAppSingleItemLink({
    productId: product.id,
    productSlug: product.slug,
    productName: product.name,
    unitPrice: product.price,
    quantity: 1,
    image: product.images[0] ?? "",
  });

  return (
    <Button size="lg" className="w-full sm:w-auto" asChild>
      <a href={href} target="_blank" rel="noopener noreferrer">
        <MessageCircle className="size-4" />
        Order on WhatsApp
      </a>
    </Button>
  );
}
