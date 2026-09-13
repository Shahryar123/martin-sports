import { notFound } from "next/navigation";
import { productRepository } from "@/lib/repositories/product-repository";
import { categoryRepository } from "@/lib/repositories/category-repository";
import { AdminPageHeader } from "@/components/admin/page-header";
import { ProductForm } from "@/components/admin/products/product-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditProductPage({ params }: Props) {
  const { id } = await params;
  const [product, categories] = await Promise.all([
    productRepository.adminGetById(id),
    categoryRepository.adminList(),
  ]);

  if (!product) notFound();

  return (
    <div className="max-w-3xl space-y-6">
      <AdminPageHeader title="Edit Product" description={product.name} />
      <ProductForm mode="edit" product={product} categories={categories} />
    </div>
  );
}
