import { notFound } from "next/navigation";
import { ambassadorRepository } from "@/lib/repositories/ambassador-repository";
import { AdminPageHeader } from "@/components/admin/page-header";
import { AmbassadorForm } from "@/components/admin/ambassadors/ambassador-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditAmbassadorPage({ params }: Props) {
  const { id } = await params;
  const ambassador = await ambassadorRepository.adminGetById(id);

  if (!ambassador) notFound();

  return (
    <div className="max-w-2xl space-y-6">
      <AdminPageHeader title="Edit Ambassador" description={ambassador.name} />
      <AmbassadorForm mode="edit" ambassador={ambassador} />
    </div>
  );
}
