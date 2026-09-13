import { SITE_CONFIG } from "@/lib/constants/site";
import { formatPKR } from "@/lib/currency";
import type { CartLineItem, CustomerDetails } from "@/types";

/**
 * Short customer-facing reference shown alongside the WhatsApp CTA and
 * embedded in the message, so a customer can quote it if they message
 * again. There's no order backend yet (see ARCHITECTURE.md), so this is
 * generated client-side at send time rather than issued by a server.
 */
export function generateOrderReference(): string {
  const date = new Date();
  const stamp = `${date.getFullYear()}${String(date.getMonth() + 1).padStart(2, "0")}${String(date.getDate()).padStart(2, "0")}`;
  const random = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `MS-${stamp}-${random}`;
}

/**
 * Builds the wa.me deep link used for WhatsApp-based ordering. Works for
 * both a single "order this product" tap and a full cart checkout, since
 * both cases are just a list of line items.
 *
 * Opening this link only pre-fills a draft message — it does not place or
 * confirm an order. Nothing here should imply otherwise; the actual order
 * is only made once the customer sends the message and Martin Sports
 * replies to confirm.
 */
export function buildWhatsAppOrderLink(params: {
  items: CartLineItem[];
  customer?: Partial<CustomerDetails>;
  orderReference?: string;
  phoneNumber?: string; // override SITE_CONFIG.whatsappNumber if needed
}): string {
  const { items, customer, orderReference, phoneNumber } = params;

  const subtotal = items.reduce((sum, item) => sum + item.unitPrice * item.quantity, 0);

  const lines: string[] = [
    "Assalam o Alaikum, I would like to place an order:",
    "",
    ...items.flatMap((item, i) => [
      `${i + 1}. Product: ${item.productName}${item.variantLabel ? ` (${item.variantLabel})` : ""}`,
      `SKU: ${item.sku}`,
      `Quantity: ${item.quantity}`,
      `Price: ${formatPKR(item.unitPrice)} x ${item.quantity} = ${formatPKR(item.unitPrice * item.quantity)}`,
      "",
    ]),
    `Subtotal: ${formatPKR(subtotal)}`,
  ];

  if (orderReference) {
    lines.push(`Order Reference: ${orderReference}`);
  }

  if (customer?.fullName || customer?.phone || customer?.address) {
    lines.push("", "Delivery details:");
    if (customer.fullName) lines.push(`Name: ${customer.fullName}`);
    if (customer.phone) lines.push(`Phone: ${customer.phone}`);
    if (customer.address) lines.push(`Address: ${customer.address}`);
    if (customer.city) lines.push(`City: ${customer.city}`);
  }

  lines.push(
    "",
    "Payment: Cash on Delivery",
    "Please confirm availability and delivery details.",
  );

  const message = lines.join("\n");
  const number = phoneNumber ?? SITE_CONFIG.whatsappNumber;

  return `https://wa.me/${number}?text=${encodeURIComponent(message)}`;
}

/** Convenience wrapper for a single-product "Order on WhatsApp" button. */
export function buildWhatsAppSingleItemLink(item: CartLineItem): string {
  return buildWhatsAppOrderLink({ items: [item] });
}
