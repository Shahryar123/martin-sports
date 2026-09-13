import { categoryRepository } from "@/lib/repositories/category-repository";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/products/product-form";

export default async function NewProductPage() {
  const categories = await categoryRepository.adminList();

  return (
    <div className="max-w-3xl space-y-6">
      <AdminPageHeader title="New Product" description="Add a product to the catalog." />
      <ProductForm mode="create" categories={categories} />
    </div>
  );
}
