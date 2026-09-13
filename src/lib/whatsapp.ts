import { SITE_CONFIG } from "@/lib/constants/site";
import type { CartLineItem, CustomerDetails } from "@/types";

function formatPKR(amount: number): string {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Builds the wa.me deep link used for WhatsApp-based ordering. Works for
 * both a single "order this product" tap and a full cart checkout, since
 * both cases are just a list of line items.
 */
export function buildWhatsAppOrderLink(params: {
  items: CartLineItem[];
  customer?: Partial<CustomerDetails>;
  phoneNumber?: string; // override SITE_CONFIG.whatsappNumber if needed
}): string {
  const { items, customer, phoneNumber } = params;

  const lines: string[] = [
    `Hello Martin Sports, I'd like to order:`,
    "",
    ...items.map((item, i) => {
      const variant = item.variantLabel ? ` (${item.variantLabel})` : "";
      return `${i + 1}. ${item.productName}${variant} x${item.quantity} — ${formatPKR(
        item.unitPrice * item.quantity,
      )}`;
    }),
    "",
    `Subtotal: ${formatPKR(
      items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0),
    )}`,
  ];

  if (customer?.fullName || customer?.phone || customer?.address) {
    lines.push(
      "",
      "Delivery details:",
      customer.fullName ? `Name: ${customer.fullName}` : "",
      customer.phone ? `Phone: ${customer.phone}` : "",
      customer.address ? `Address: ${customer.address}` : "",
      customer.city ? `City: ${customer.city}` : "",
    );
  }

  lines.push("", "Payment: Cash on Delivery");

  const message = lines.filter(Boolean).join("\n");
  const number = phoneNumber ?? SITE_CONFIG.whatsappNumber;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Convenience wrapper for a single-product "Order on WhatsApp" button. */
export function buildWhatsAppSingleItemLink(item: CartLineItem): string {
  return buildWhatsAppOrderLink({ items: [item] });
}
