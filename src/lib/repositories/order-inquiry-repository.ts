import type { OrderInquiry } from "@/types";

/**
 * No inquiry form/checkout flow persists an `OrderInquiry` yet today —
 * checkout still ends at "open WhatsApp" (see ARCHITECTURE.md §9/§14). This
 * repository is the storage seam for when that ships: the admin Inquiries
 * screen and dashboard stats already read from it, so wiring up the
 * inquiry-submission flow later is additive (call `create()`), not a
 * rewrite of the admin UI.
 */
export interface OrderInquiryRepository {
  list(): Promise<OrderInquiry[]>;
  getById(id: string): Promise<OrderInquiry | null>;
  create(input: Omit<OrderInquiry, "id" | "createdAt" | "status">): Promise<OrderInquiry>;
  updateStatus(id: string, status: OrderInquiry["status"]): Promise<OrderInquiry>;
}

class InMemoryOrderInquiryRepository implements OrderInquiryRepository {
  private inquiries: OrderInquiry[] = [];

  async list(): Promise<OrderInquiry[]> {
    return [...this.inquiries].sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async getById(id: string): Promise<OrderInquiry | null> {
    return this.inquiries.find((i) => i.id === id) ?? null;
  }

  async create(input: Omit<OrderInquiry, "id" | "createdAt" | "status">): Promise<OrderInquiry> {
    const inquiry: OrderInquiry = {
      ...input,
      id: `inq-${Math.random().toString(36).slice(2, 10)}`,
      status: "new",
      createdAt: new Date().toISOString(),
    };
    this.inquiries.push(inquiry);
    return inquiry;
  }

  async updateStatus(id: string, status: OrderInquiry["status"]): Promise<OrderInquiry> {
    const index = this.inquiries.findIndex((i) => i.id === id);
    if (index === -1) throw new Error("Inquiry not found");

    const updated = { ...this.inquiries[index], status };
    this.inquiries[index] = updated;
    return updated;
  }
}

export const orderInquiryRepository: OrderInquiryRepository = new InMemoryOrderInquiryRepository();
