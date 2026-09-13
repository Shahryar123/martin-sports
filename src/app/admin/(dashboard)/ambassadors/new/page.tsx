import { AdminPageHeader } from "@/components/admin/page-header";
import { AmbassadorForm } from "@/components/admin/ambassadors/ambassador-form";

export default function NewAmbassadorPage() {
  return (
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader title="New Ambassador" description="Add a brand ambassador." />
      <AmbassadorForm mode="create" />
    </div>
  );
}
