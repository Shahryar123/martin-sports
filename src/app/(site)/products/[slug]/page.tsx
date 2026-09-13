import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductImage } from "@/components/products/product-image";
import { OrderOnWhatsAppButton } from "@/components/products/order-on-whatsapp-button";
import { productRepository } from "@/lib/repositories/product-repository";
import { getCategoryName } from "@/lib/constants/categories";
import { buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

export async function generateStaticParams() {
  const slugs = await productRepository.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);
  if (!product) return buildMetadata({ title: "Product Not Found", noIndex: true });

  return buildMetadata({
    title: product.name,
    description: product.shortDescription,
    path: `/products/${product.slug}`,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);

  if (!product) notFound();

  return (
    <div className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <p className="text-sm text-muted-foreground">
        {getCategoryName(product.category)}
      </p>

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductImage
          images={product.images}
          name={product.name}
          category={product.category}
          className="aspect-square w-full rounded-lg"
          priority
        />

        <div>
          <h1 className="font-heading text-3xl font-semibold text-foreground">
            {product.name}
          </h1>
          <p className="mt-3 text-2xl font-semibold text-primary">
            Rs. {product.price.toLocaleString("en-PK")}
          </p>
          <p className="mt-4 text-sm leading-relaxed text-muted-foreground">
            {product.description}
          </p>

          {product.specs.length > 0 && (
            <dl className="mt-6 space-y-2 border-t border-border pt-6">
              {product.specs.map((spec) => (
                <div key={spec.label} className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-8">
            <OrderOnWhatsAppButton product={product} />
            <p className="mt-3 text-xs text-muted-foreground">
              Cash on Delivery · Nationwide delivery across Pakistan
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
