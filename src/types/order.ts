export type CartLineItem = {
  productId: string;
  productSlug: string;
  productName: string;
  sku: string;
  variantId?: string;
  variantLabel?: string;
  unitPrice: number;
  quantity: number;
  /** Caps the cart-row quantity stepper (e.g. remaining stock for a
   * low-stock size). Undefined = no extra cap beyond the stepper default. */
  maxQuantity?: number;
  image: string;
};

export type CustomerDetails = {
  fullName: string;
  phone: string; // Pakistani mobile format, e.g. 03XX-XXXXXXX
  address: string;
  city: string;
  notes?: string;
};

export type OrderInquiry = {
  id: string;
  customer: CustomerDetails;
  items: CartLineItem[];
  subtotal: number;
  fulfillment: "cod-delivery"; // only mode supported in v1
  channel: "whatsapp" | "form";
  status: "new" | "contacted" | "confirmed" | "fulfilled" | "cancelled";
  createdAt: string;
};
