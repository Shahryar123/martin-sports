import type { LucideIcon } from "lucide-react";
import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type AdminStatCardProps = {
  label: string;
  value: number | string;
  icon?: LucideIcon;
  href?: string;
  tone?: "default" | "warning";
};

export function AdminStatCard({ label, value, icon: Icon, href, tone = "default" }: AdminStatCardProps) {
  const content = (
    <Card className={cn(href && "transition-colors hover:bg-surface-2")}>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-sm font-medium text-muted-foreground">
          {label}
          {Icon && <Icon className="size-4" strokeWidth={1.75} />}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <p
          className={cn(
            "text-3xl font-semibold text-foreground",
            tone === "warning" && Number(value) > 0 && "text-warning",
          )}
        >
          {value}
        </p>
      </CardContent>
    </Card>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {content}
      </Link>
    );
  }

  return content;
}
