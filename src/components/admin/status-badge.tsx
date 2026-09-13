import { Badge } from "@/components/ui/badge";
import type { StockStatus } from "@/types";

export function PublishedBadge({ published }: { published: boolean }) {
  return (
    <Badge variant={published ? "success" : "outline"}>
      {published ? "Published" : "Draft"}
    </Badge>
  );
}

const STOCK_LABEL: Record<StockStatus, string> = {
  "in-stock": "In Stock",
  "low-stock": "Low Stock",
  "out-of-stock": "Out of Stock",
};

const STOCK_VARIANT: Record<StockStatus, "success" | "warning" | "destructive"> = {
  "in-stock": "success",
  "low-stock": "warning",
  "out-of-stock": "destructive",
};

export function StockStatusBadge({ status }: { status: StockStatus }) {
  return <Badge variant={STOCK_VARIANT[status]}>{STOCK_LABEL[status]}</Badge>;
}
