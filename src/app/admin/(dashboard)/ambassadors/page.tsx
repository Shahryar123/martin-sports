import Link from "next/link";
import { Plus, Users } from "lucide-react";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { AdminPageHeader } from "@/components/admin/page-header";
import { EmptyState } from "@/components/shared/empty-state";
import { Button } from "@/components/ui/button";
import { AmbassadorsTable } from "@/components/admin/ambassadors/ambassadors-table";

export default async function AdminAmbassadorsPage() {
  const ambassadors = await ambassadorRepository.adminList();

  return (
    <div className="space-y-6">
      <AdminPageHeader
        title="Ambassadors"
        description={`${ambassadors.length} ambassador${ambassadors.length === 1 ? "" : "s"}.`}
        action={
          <Button asChild>
            <Link href="/admin/ambassadors/new">
              <Plus className="size-4" /> New Ambassador
            </Link>
          </Button>
        }
      />

      {ambassadors.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No ambassadors yet"
          description="Add your first brand ambassador."
        />
      ) : (
        <AmbassadorsTable ambassadors={ambassadors} />
      )}
    </div>
  );
}
