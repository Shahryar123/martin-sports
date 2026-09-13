import { productRepository } from "@/lib/repositories/product-repository";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

export default async function AdminDashboardPage() {
  const [{ total: productCount }, ambassadors] = await Promise.all([
    productRepository.list({ pageSize: 1 }),
    ambassadorRepository.list(),
  ]);

  const stats = [
    { label: "Products", value: productCount },
    { label: "Ambassadors", value: ambassadors.length },
    { label: "Open Inquiries", value: 0 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="font-heading text-2xl font-semibold text-foreground">
          Dashboard
        </h1>
        <p className="text-sm text-muted-foreground">
          Overview of your catalog and content. Product/content editing screens
          are built in the next phase.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        {stats.map((stat) => (
          <Card key={stat.label}>
            <CardHeader>
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-semibold text-foreground">
                {stat.value}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
