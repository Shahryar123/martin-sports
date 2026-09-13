import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { ProductImage } from "@/components/products/product-image";
import { WhatsAppButton } from "@/components/shared/whatsapp-button";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Container } from "@/components/shared/container";
import { PriceDisplay } from "@/components/shared/price-display";
import { PageHeading, Body, Metadata as MetaText } from "@/components/ui/typography";
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
    <Container className="py-12 sm:py-16">
      <Breadcrumbs
        items={[
          { label: "Shop", href: "/products" },
          { label: getCategoryName(product.category), href: `/products?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductImage
          images={product.images}
          name={product.name}
          category={product.category}
          className="aspect-square w-full rounded-lg"
          priority
        />

        <div>
          <MetaText>{getCategoryName(product.category)}</MetaText>
          <PageHeading as="h1" className="mt-1">
            {product.name}
          </PageHeading>
          <PriceDisplay
            price={product.price}
            compareAtPrice={product.compareAtPrice}
            size="lg"
            className="mt-3"
          />
          <Body className="mt-4">{product.description}</Body>

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
            <WhatsAppButton
              label="Order on WhatsApp"
              size="lg"
              className="w-full sm:w-auto"
              items={[
                {
                  productId: product.id,
                  productSlug: product.slug,
                  productName: product.name,
                  unitPrice: product.price,
                  quantity: 1,
                  image: product.images[0] ?? "",
                },
              ]}
            />
            <p className="mt-3 text-xs text-muted-foreground">
              Cash on Delivery · Nationwide delivery across Pakistan
            </p>
          </div>
        </div>
      </div>
    </Container>
  );
}
