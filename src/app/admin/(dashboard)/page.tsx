import Link from "next/link";
import { Package, CheckCircle2, FileEdit, Star, FolderTree, AlertTriangle, MessageSquareText } from "lucide-react";
import { productRepository } from "@/lib/repositories/product-repository";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { orderInquiryRepository } from "@/lib/repositories/order-inquiry-repository";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AdminStatCard } from "@/components/admin/stat-card";
import { PublishedBadge } from "@/components/admin/status-badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/shared/empty-state";
import { formatPKR } from "@/lib/currency";
import { getCategoryName } from "@/lib/constants/categories";

export default async function AdminDashboardPage() {
  const [productStats, categories, inquiries] = await Promise.all([
    productRepository.getStats(),
    categoryRepository.adminList(),
    orderInquiryRepository.list(),
  ]);

  const newInquiries = inquiries.filter((i) => i.status === "new").length;

  const stats = [
    { label: "Total Products", value: productStats.total, icon: Package, href: "/admin/products" },
    {
      label: "Published",
      value: productStats.published,
      icon: CheckCircle2,
      href: "/admin/products?status=published",
    },
    { label: "Drafts", value: productStats.draft, icon: FileEdit, href: "/admin/products?status=draft" },
    {
      label: "Featured",
      value: productStats.featured,
      icon: Star,
      href: "/admin/products?featured=1",
    },
    { label: "Categories", value: categories.length, icon: FolderTree, href: "/admin/categories" },
    {
      label: "Low Stock",
      value: productStats.lowStock,
      icon: AlertTriangle,
      href: "/admin/products?stockStatus=low-stock",
      tone: "warning" as const,
    },
  ];

  return (
    <div className="space-y-8">
      <AdminPageHeader
        title="Dashboard"
        description="Overview of your catalog, categories and content."
      />

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
        {stats.map((stat) => (
          <AdminStatCard key={stat.label} {...stat} />
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Products</CardTitle>
          </CardHeader>
          <CardContent>
            {productStats.recent.length === 0 ? (
              <EmptyState
                icon={Package}
                title="No products yet"
                description="Create your first product to see it here."
              />
            ) : (
              <div className="divide-y divide-border">
                {productStats.recent.map((product) => (
                  <Link
                    key={product.id}
                    href={`/admin/products/${product.id}/edit`}
                    className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0 hover:bg-surface-1"
                  >
                    <div className="min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">{product.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {getCategoryName(product.category)} · {product.sku}
                      </p>
                    </div>
                    <div className="flex shrink-0 items-center gap-3">
                      <span className="text-sm text-foreground">{formatPKR(product.price)}</span>
                      <PublishedBadge published={product.published} />
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MessageSquareText className="size-4" strokeWidth={1.75} />
              Order Inquiries
            </CardTitle>
          </CardHeader>
          <CardContent>
            {inquiries.length === 0 ? (
              <EmptyState
                icon={MessageSquareText}
                title="No inquiries yet"
                description="Inquiries will appear here once the order form is wired up to persist them."
              />
            ) : (
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Total</span>
                  <span className="font-medium text-foreground">{inquiries.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">New</span>
                  <span className="font-medium text-foreground">{newInquiries}</span>
                </div>
                <Link
                  href="/admin/inquiries"
                  className="mt-3 inline-block text-sm font-medium text-brand hover:underline"
                >
                  View all inquiries
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
