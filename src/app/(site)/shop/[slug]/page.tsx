import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Check, Truck, Banknote } from "lucide-react";
import { ProductGallery } from "@/components/products/product-gallery";
import { ProductBuyBox } from "@/components/products/product-buy-box";
import { ProductCard } from "@/components/products/product-card";
import { Breadcrumbs } from "@/components/shared/breadcrumbs";
import { Container } from "@/components/shared/container";
import { SectionHeading, PageHeading, Body, Metadata as MetaText, Caption } from "@/components/ui/typography";
import { productRepository } from "@/lib/repositories/product-repository";
import { getCategoryName } from "@/lib/constants/categories";
import { SITE_CONFIG } from "@/lib/constants/site";
import { buildMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ slug: string }>;
};

/**
 * Without this, an unknown slug still renders `not-found.tsx` correctly but
 * with an HTTP 200: `shop/loading.tsx` streams that status before the async
 * `getBySlug`/`notFound()` call resolves, and a response's status can't
 * change once streaming has started. `dynamicParams = false` rejects any
 * slug outside `generateStaticParams` before rendering begins, so the 404
 * is resolved up front instead. (If products ever come from a live DB where
 * a slug can disappear *after* the build that generated static params for
 * it, that specific case would need the same existence check moved into
 * `proxy.ts`, which always runs before any Suspense boundary.)
 */
export const dynamicParams = false;

export async function generateStaticParams() {
  const slugs = await productRepository.getAllSlugs();
  return slugs.map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);
  if (!product) return buildMetadata({ title: "Product Not Found", noIndex: true });

  return buildMetadata({
    title: product.seo?.title ?? product.name,
    description: product.seo?.description ?? product.shortDescription,
    path: `/shop/${product.slug}`,
    image: product.images[0],
    imageAlt: product.name,
  });
}

export default async function ProductDetailPage({ params }: Props) {
  const { slug } = await params;
  const product = await productRepository.getBySlug(slug);

  if (!product) notFound();

  const related = await productRepository.getRelated(product, 4);
  const effectivePrice = product.salePrice ?? product.price;
  const canonicalUrl = `${SITE_CONFIG.url}/shop/${product.slug}`;

  const productStructuredData = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.name,
    description: product.shortDescription,
    sku: product.sku,
    image: product.images,
    category: getCategoryName(product.category),
    brand: { "@type": "Brand", name: product.brand },
    offers: {
      "@type": "Offer",
      url: canonicalUrl,
      priceCurrency: product.currency,
      price: effectivePrice,
      availability:
        product.stockStatus === "out-of-stock"
          ? "https://schema.org/OutOfStock"
          : "https://schema.org/InStock",
    },
  };

  const breadcrumbStructuredData = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Shop", item: `${SITE_CONFIG.url}/shop` },
      {
        "@type": "ListItem",
        position: 2,
        name: getCategoryName(product.category),
        item: `${SITE_CONFIG.url}/shop?category=${product.category}`,
      },
      { "@type": "ListItem", position: 3, name: product.name, item: canonicalUrl },
    ],
  };

  return (
    <Container className="py-12 pb-28 sm:py-16 sm:pb-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productStructuredData) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbStructuredData) }}
      />

      <Breadcrumbs
        items={[
          { label: "Shop", href: "/shop" },
          { label: getCategoryName(product.category), href: `/shop?category=${product.category}` },
          { label: product.name },
        ]}
      />

      <div className="mt-6 grid grid-cols-1 gap-10 lg:grid-cols-2">
        <ProductGallery images={product.images} name={product.name} category={product.category} />

        <div>
          <MetaText>{getCategoryName(product.category)}</MetaText>
          <PageHeading as="h1" className="mt-1">
            {product.name}
          </PageHeading>
          <Caption className="mt-1.5">
            by {product.brand} · SKU: {product.sku}
          </Caption>

          <div className="mt-4">
            <ProductBuyBox product={product} />
          </div>

          <Body className="mt-6 border-t border-border pt-6">{product.description}</Body>

          {product.features.length > 0 && (
            <ul className="mt-5 space-y-2">
              {product.features.map((feature) => (
                <li key={feature} className="flex items-start gap-2 text-sm text-foreground-secondary">
                  <Check className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={2} />
                  {feature}
                </li>
              ))}
            </ul>
          )}

          {product.specifications.length > 0 && (
            <dl className="mt-6 space-y-2 border-t border-border pt-6">
              {product.specifications.map((spec) => (
                <div key={spec.label} className="flex justify-between text-sm">
                  <dt className="text-muted-foreground">{spec.label}</dt>
                  <dd className="text-foreground">{spec.value}</dd>
                </div>
              ))}
            </dl>
          )}

          <div className="mt-6 border-t border-border pt-6">
            <p className="flex items-center gap-2 text-sm font-semibold text-foreground">
              <Banknote className="size-4 shrink-0 text-brand" strokeWidth={1.75} />
              Cash on Delivery Available Across Pakistan
            </p>
            <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
              <div className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                <Truck className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} />
                Nationwide delivery across Pakistan
              </div>
              <div className="flex items-start gap-2.5 text-sm text-foreground-secondary">
                <Banknote className="mt-0.5 size-4 shrink-0 text-brand" strokeWidth={1.75} />
                Pay in cash when your order arrives
              </div>
            </div>
          </div>
        </div>
      </div>

      {related.length > 0 && (
        <div className="mt-16 border-t border-border pt-12 sm:mt-20 sm:pt-16">
          <SectionHeading as="h2" className="mb-8">
            You May Also Like
          </SectionHeading>
          <div className="grid grid-cols-2 gap-4 sm:gap-6 lg:grid-cols-4">
            {related.map((item) => (
              <ProductCard key={item.id} product={item} />
            ))}
          </div>
        </div>
      )}
    </Container>
  );
}
