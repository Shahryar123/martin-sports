import { MessageSquareText } from "lucide-react";
import { orderInquiryRepository } from "@/lib/repositories/order-inquiry-repository";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatPKR } from "@/lib/currency";

export default async function AdminInquiriesPage() {
  const inquiries = await orderInquiryRepository.list();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Inquiries"
        description="Cash-on-Delivery order inquiries submitted by customers."
      />

      {inquiries.length === 0 ? (
        <EmptyState
          icon={MessageSquareText}
          title="No inquiries yet"
          description="Inquiries will appear here once the storefront's order form is wired up to persist them. Checkout currently opens WhatsApp directly."
        />
      ) : (
        <Card>
          <CardContent className="divide-y divide-border p-0">
            {inquiries.map((inquiry) => (
              <div key={inquiry.id} className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-medium text-foreground">{inquiry.customer.fullName}</p>
                  <p className="text-xs text-muted-foreground">
                    {inquiry.customer.phone} · {inquiry.items.length} item(s)
                  </p>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm text-foreground">{formatPKR(inquiry.subtotal)}</span>
                  <Badge variant="outline" className="capitalize">
                    {inquiry.status}
                  </Badge>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
